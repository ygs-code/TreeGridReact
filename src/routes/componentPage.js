import React, { Suspense, Component, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
export default [
  {
    component: lazy(() => import('../pages/Basic/BasicOne')),
    key: 'BasicOne',
    pageName: '基本使用BasicOne',
    path: '/'
  },
  {
    component: lazy(() => import('../pages/Basic/BasicTwo')),
    key: 'BasicTwo',
    pageName: '基本使用BasicTwo',
    path: '/BasicTwo'
  },
  {
    component: lazy(() => import('../pages/Gantt/GanttOne')),
    key: 'GanttOne',
    pageName: 'GanttOne',
    path: '/GanttOne'
  },
  {
    component: lazy(() => import('../pages/Order/Order')),
    key: 'Order',
    pageName: '基本使用',
    path: '/order/:abc/:def'
  },
  // {
  //     component: lazy(() => import('../pages/About/About')),
  //     key: 'About',
  //     path: '/about/:aaa/:kk'
  // },
  {
    component: lazy(() => import('../pages/Modified/Modified')),
    key: 'Modified',
    pageName: '基本使用',
    path: '/modified'
  },
  {
    component: lazy(() => import('../pages/ModifiedComponent/ModifiedComponent')),
    key: 'ModifiedComponent',
    path: '/modifiedcomponent',
    pageName: '基本使用',
  },


];
