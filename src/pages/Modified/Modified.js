import React, { Suspense, lazy,Component } from 'react';


/*
 修饰器  https://www.cnblogs.com/goloving/p/8001530.html
        https://www.jianshu.com/p/30e769f57e1b
*/


function testable(target,name, descriptor) {
  console.info('name='+name)
  console.info('descriptor='+descriptor)
  // 修改MyTestableClass 静态属性
  target.isTestable = true;
  //也可以MyTestableClass修改类的原型，
  target.prototype.isTestable = true;
  target.prototype.getTestable=function(){
     return '原型上的isTestable='+this.isTestable
  }.bind(target)
  return target;
}
@testable
class MyTestableClass {}
console.log('MyTestableClass.isTestable=',MyTestableClass.isTestable)
console.log('new MyTestableClass.isTestable=',new MyTestableClass().getTestable())




/*
修饰器传参
所以可以看出修饰器其实就是一些函数，用来修改类的行为（原型，静态属性...都可以），只不过这些行为可能有公共性，所以就写一个方法去改变，然后取了一个装逼的名字叫修饰器

既然修饰器是一个函数，那么参数肯定少不了
*/

function testable1(isTestable) {
  return function(target) {
          target.isTestable = isTestable;
   }
}
@testable1(true)
class MyTestableClass1 {}

console.log('MyTestableClass1.isTestable='+MyTestableClass1.isTestable)

// MyTestableClass1.isTestable // true

@testable1(false)
class MyClass1 {}
console.log('MyClass1.isTestable='+MyClass1.isTestable)



//再来看一个列子，巩固一下
function mixins(...list) {
  return function (target) {
    // 其实直接在外面使用这一句话就好，非要装逼搞个修饰器的概念，好吧...,我承认是因为站的立场不同，我是使用者的立场，他们是规范的立场
     Object.assign(target.prototype, ...list)
   }
}
const Foo = {
   foo() { console.log('foo') }
};
@mixins(Foo)
class MyClass {}

let obj = new MyClass();
obj.foo() // 'foo'




class Person {
  @nonenumerable
  get kidCount() { return this.children; }
}
/*
修饰类的属性 默认name 就是当前修饰属性的name， descriptor 就是
descriptor对象原来的值如下
  {
    value: specifiedFunction,
    enumerable: false,
    configurable: true,
    writable: true
  };
*/
function nonenumerable(target, name, descriptor) {
  console.info('descriptor',descriptor)
  console.info('name',name)
  descriptor.enumerable = false;
  return descriptor;
}

console.info('Person.kidCount',new Person().kidCount)


// 日志修饰器 拦截器
class Math {
  // @log
  @log
  add(a, b) {
    return a + b;
  }
}
function log(target, name, descriptor) {
  console.log('log descriptor=',descriptor)
  var oldValue = descriptor.value;
  // 打印出来发现，oldValue其实就是function add(){}
  descriptor.value = function() {
    // 拦截器
    console.log(`Calling "${name}" with`, arguments);
    return oldValue.apply(null, arguments);
  };
  return descriptor;
}
const math = new Math();
// passed parameters should get logged now
console.info('math',math.add(2, 4));


/*
若是同一个方法有多个修饰器，
会从外向内进入，
然后由内向外执行(简单理解就是把内部执行的结果当做参数传向外面的)
*/
function dec(id){
  console.log('evaluated', id);
  return (target, property, descriptor) =>{
    var oldValue = descriptor.value;
    descriptor.value = function() {
      // 拦截器 重写返回值
      console.log(`dec "${property}" with`, arguments);
      return oldValue.apply(null, arguments);
    };
    console.log('executed', id);
    return descriptor;
  }
  // return descriptor;
}
class Example {
  @dec(1)
  @dec(2)
  method(a,b){
    return a+b;
  }
}


new Example().method(1,3)





// 类的修饰器没有 name 和 descriptor 值
// react注入类 修饰器。可以使用继承 实现拿到react 类
function classDecorator(target,name, descriptor) {
  console.info('classDecorator target=',target)
  console.info('classDecorator name=',name, )
  console.info('classDecorator descriptor=',descriptor)
  // 相当于继承 重写 react组件
  class _classDecorator extends target{
    getTitle=()=>{
      console.info('getTitle',this.state)
    }
    //重写 react 类方法
    // render() {
    //   return (<div>_classDecorator</div>);
    // }
  }
    return   _classDecorator; // 这里一定要返回出去
}

// 属性修饰器
function attributeDecorator(target,name, descriptor) {
  console.info('attributeDecorator target=',target)
  console.info('attributeDecorator name=',name, )
  console.info('attributeDecorator descriptor=',descriptor)
  console.info('attributeDecorator descriptor.value=',descriptor.value)
  descriptor.value = function() {
    // 拦截器  有 es5 definePropety 和 e6的 proxy 和 修饰器
    return (<div>attributeDecorator</div>);
  };
  return descriptor;
}

 @classDecorator // 注入类的修饰器
class Modified extends Component {
  constructor(props){
   super(props)
   this.state={
     title:"修饰器"
   }
   // 在构造函数 只能调用 自己组件实现的方法。 只有在react 自己的生命周期函数才能调用 修饰器继承的方法
   this.printTitle()
  }
  componentDidMount(){
    console.log('this=',this)
    // console.log('this=',this.state)
    this.getTitle();
  }
  printTitle=()=>{
     // 这里调用getTitle 也会报错
    // this.getTitle();
  }
  @attributeDecorator //
  render() {
    const {title}=this.state;
    // this.getTitle();
    return (
      <div className="Modified">
         {title}
      </div>
    );
   }

}

export default Modified;
// function isAnimal(target) {
//   target.isAnimal = true
//   return target // 返回的是传递给该函数的对象
// }



// @isAnimal;
// function Modified(props) {
//     console.info(props)
//     return (
//         <div className="Modified">
//            修饰器
//       </div>
// );
// }

// export default Modified;
