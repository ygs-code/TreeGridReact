import React, { Suspense, Component, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Menu from "../../component/Menu/Menu.js";


// 引入action

class Home extends Component {
  constructor (props) {
    super(props);
    var Component = this;
    var Grid = null;
    window.Grids.OnInit = function (grid) {
      //初始化触发函数
      grid.Component = Component;
      Component.Grid = grid;
      return null;
    }
    window.Grids.OnLoadError = function (grid) {
      //加载错误触发函数
      alert("TreeGrid cannot load!\nCheck if the NodeJS server runs on the url http://localhost:8000\nThe sample NodeJS server is located in /ExamplesNode/Server");
    }
  }

  componentDidMount() {
    //默认情况下，TreeGrid从这些基本数据源按以下顺序下载：Text，Defaults，Base，Layout，Data。
    console.log('window.TreeGrid', window.TreeGrid)
    // MyObject = {
    //    MyData: { Cols: [{ Name: 'A' }, { Name: 'B' }] }
    //    };

    // TreeGrid({
    //    Layout: { Script: "MyObject.MyData" },
    //     Data: {
    //         Data: { Body: [[{ id: 1, A: 10, B: 20 }, { id: 2, A: 20, B: 40 }]] }
    //     }
    //   },
    //     "MyTag");


    // TreeGrid({
    //   Defaults: { Data: Defaults },
    //   Text: { Data: Text },
    //   Layout: { Data: Layout },
    //   Data: { Data: Data }
    // },
    //   "MainTag");

    var grid = window.TreeGrid({
      Debug: 'check',
      // Layout: { Url: "Layouts/StaticDef.js" },
      Layout: {
        Data: {
          Cols: [  // 字段
            { Name: 'A' },
            { Name: 'B' }
          ]
        }
      },
      Data: {
        Data: {
          Body: [
            [ //数据源
              { id: 1, A: 10, B: 20 },
              { id: 2, A: 20, B: 40 }
            ]
          ]
        }
      }
      //  Data: { Url: "Layouts/StaticData.js" }
    }, "TreeGrid");

  }

  render() {

    // 使用store
    return (
      <div>
        <Menu {...this.props}>
          <div id="TreeGrid"></div>
        </Menu>
      </div>
    );
  }
}

export default Home;
