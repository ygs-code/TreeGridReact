import React, { Suspense, lazy } from 'react';



function Loading(props) {
    console.info(props)
    return (
        <div className="Loading">
           Loading 远程数据请求中
      </div>
);
}

export default Loading;
