import React, { Suspense, lazy, Component } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import componentPage from '../../routes/componentPage';
import './Menu.less';
import { tsConstructSignatureDeclaration } from "@babel/types";
// 引入action

class Menu extends Component {
  constructor (props) {
    super(props);
    componentPage[0].selected = true;
    this.state = {
      pages: componentPage,
    }
  }

  componentDidMount() {

    console.log('componentPage', componentPage)
  }

  gotoPage(_item) {
    const { pages } = this.state;
    this.setState({
      pages: pages.map(item => {
        if (item === _item) {
          console.log(_item)
          this.props.history.push(_item.path)
        }
        return {
          ...item,
          selected: item === _item ? true : false,
        }
      })
    })
  }

  render() {
    const { props } = this.props
    const { pages } = this.state;
    return (
      <div className='menu'>
        <div className="left-box">
          {pages.map(item => {
            console.log(item)
            const className = `menu-link  ${item.selected && 'selected'}`
            return (
              <div onClick={this.gotoPage.bind(this, item)} className={className}>
                {item.pageName}
              </div>
            )
          })}
        </div>
        <div className="rignth-box">
          {this.props.children}
        </div>
      </div>


    );
  }
}

export default Menu;
