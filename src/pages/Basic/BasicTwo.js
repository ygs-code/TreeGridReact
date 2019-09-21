import React, { Suspense, Component, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Menu from "../../component/Menu/Menu.js";


// 引入action

class Basic extends Component {
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




    /*
          < Grid >
          <Cfg id="Basic" />

          <!--- Columns-- >
            <Panel Visible="1" />
            <LeftCols>
              <C Name="LEFT1" Width="150" />
            </LeftCols>
            <Cols>
              <C Name="DATA1" />
              <C Name="DATA2" />
            </Cols>
            <RightCols>
              <C Name="RIGHT1" />
            </RightCols>

            <!--Rows -->
              <Header LEFT1="Left column 1" DATA1="Data column 1" DATA2="Data column 2" RIGHT1="Right column 1" Visible="1" />
              <Head>
                <I LEFT1="Fixed head row 1" DATA1="1" DATA2="2" RIGHT1="3" />
              </Head>
              <Body>
                <B>
                  <I LEFT1="Body row 1" DATA1="4" DATA2="5" RIGHT1="6" />
                  <I LEFT1="Body row 2" DATA1="7" DATA2="8" RIGHT1="9" />
                  <I LEFT1="Body row 3" DATA1="10" DATA2="11" RIGHT1="12" />
                  <I LEFT1="Body row 4" DATA1="13" DATA2="14" RIGHT1="15" />
                  <I LEFT1="Body row 5" DATA1="16" DATA2="17" RIGHT1="18" />
                  <I LEFT1="Body row 6" DATA1="19" DATA2="20" RIGHT1="21" />
                  <I LEFT1="Body row 7" DATA1="22" DATA2="23" RIGHT1="24" />
                </B>
              </Body>
              <Foot>
                <I LEFT1="Fixed foot row 1" DATA1="25" DATA2="26" RIGHT1="27" />
              </Foot>
              <Toolbar Visible="1" />
    </Grid >
    */




    var grid = window.TreeGrid({
      Debug: 'check',
      // Layout: { Url: "Layouts/StaticDef.js" },
      Layout: {
        Data: {
          Toolbar: {
            Visible: "0"
          },
          Panel:
            {
              Visible: "1"
            },
          LeftCols: [
            {  //固定左边的列
              Name: "LEFT1",
              Width: "150",
            }
          ],
          Cols: [  // 字段
            { Name: 'DATA1' },
            { Name: 'DATA2' }
          ],

          RightCols: [// 固定右边的列
            {
              Name: "CRIGHT1"
            }
          ],

          Header: { //头部重新命名
            LEFT1: "Left column 1",
            DATA1: "Data column 1",
            DATA2: "Data column 2",
            RIGHT1: "Right column 1",
            Visible: "1",
          },


          Head: [  // 固定头部的字段
            {
              LEFT1: "Fixed head row 1",
              DATA1: "2",
              DATA2: "3",
              CRIGHT1: '4'
            }
          ],

          //字段
          Foot: [ // 固定底部的字段
            {
              LEFT1: "Fixed foot row 2",
              DATA1: "5",
              DATA2: "6",
              CRIGHT1: "7"
            }
          ],

        }
      },
      Data: {
        Data: {
          Body: [

            [ //数据源
              { id: 1, LEFT1: 8, DATA1: 9, DATA2: 10, CRIGHT1: 11 },
              { id: 12, LEFT1: 13, DATA1: 14, DATA2: 15, CRIGHT1: 16 },
            ]
          ]
        }
      }
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

export default Basic;
