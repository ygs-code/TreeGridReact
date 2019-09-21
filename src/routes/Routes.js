import React, { Suspense, Component, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import componentPage from './componentPage';
// const componentPage = [
//     {
//         component: lazy(() => import('../pages/Home/Home')),
//         key: 'Home',
//         path: '/'
//     },
//     {
//         component: lazy(() => import('../pages/Order/Order')),
//         key: 'Order',
//         path: '/order/:abc/:def'
//     },
//     // {
//     //     component: lazy(() => import('../pages/About/About')),
//     //     key: 'About',
//     //     path: '/about/:aaa/:kk'
//     // },
//     {
//         component: lazy(() => import('../pages/Modified/Modified')),
//         key: 'Modified',
//         path: '/modified'
//     },
//     {
//         component: lazy(() => import('../pages/ModifiedComponent/ModifiedComponent')),
//         key: 'ModifiedComponent',
//         path: '/modifiedcomponent'
//     },


// ]

const loadingPage = componentPage.map(item => {
    return {
        ...item,
        component: lazy(() => import('../pages/Loading/Loading')),
    }
})

class Routes extends Component {
    constructor (props) {
        super(props);
        this.state = {
            authSuccess: false,
        }
    }

    componentDidMount() {
        setTimeout(() => {
            // 远程请求数据
            this.setState({
                authSuccess: true,
            })
        }, 1);
    }

    render() {
        const { authSuccess } = this.state;
        // console.info(this.props)
        // 使用store
        return (
            <Router>
                <Suspense fallback={<div>Loading...</div>}>
                    <Switch>
                        {
                            authSuccess ?
                                componentPage.map(item =>
                                    <Route key={item.key} exact path={item.path} component={item.component} />
                                ) :
                                loadingPage.map(item =>
                                    <Route key={item.key} exact path={item.path} component={item.component} />
                                )
                        }
                    </Switch>
                </Suspense>
            </Router>
        );
    }
}
export default Routes;
