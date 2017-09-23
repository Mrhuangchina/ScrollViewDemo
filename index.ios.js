/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
} from 'react-native';

// 引入计时器
var TimerMixin = require('react-timer-mixin');

//导入JSON数据
var ImageDataArr = require('./ImageData.json').data;
//获取屏幕的宽度
var Dimensions = require('Dimensions');
var {width} = Dimensions.get('window');

export default class ScrollViewDemo extends Component {

  //设置可变的默认初始值
  constructor(props){
    super(props);
    this.state = {
      //当前页码
      currentPage:0,

    };
  }

  //ECMAScript 5 的写法
  // getInitialState(){
  //   return{
  //     //当前页码
  //     currentPage:0,
  //   }
  // }

  render() {
    return (
      <View style={styles.container}>
        {/*轮播图片*/}
        <ScrollView
          ref="myScrollView"
          horizontal={true}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          // 当一帧滚动结束后调用
          onMomentumScrollEnd={(kScroll)=>this._scrollEnd(kScroll)}
          // 开始拖拽
            onScrollBeginDrag={()=>{clearInterval(this.timer)}}
          // 结束拖拽
            onScrollEndDrag={()=>this._startTimer()}
        >
          {/*获取所有的图片函数*/}
          {this.renderAllImages()}

        </ScrollView>

        {/*圆点指示器*/}
        <View style={styles.CircleViewStyle}>
          {this.renderCircle()}
        </View>

      </View>
    );
  }

  //拿到JSON中的数据图片
  renderAllImages(){

    var ImagesArray = [];

    for(var i = 0; i < ImageDataArr.length;i++){
      // 单独取出每一个对象
      var imageItem = ImageDataArr[i];
      ImagesArray.push(
          <Image key = {i} source={{uri:imageItem.img}} style={{width :width,height:120}} />

      )
    }

   return ImagesArray;
  }
  //圆点的绘制
  renderCircle(){

    //装入圆点的数组
    var CircleArray = [];
    //样式
    var style;

    for(var i = 0; i < ImageDataArr.length;i++){
      // 判断
      style = (i == this.state.currentPage) ? {color:'orange'} : {color:'white'};
      //把圆点加入到数组中
      CircleArray.push(
          <Text key = {i} style={[{fontSize:25},style]}>&bull;</Text>
      )
    }

    return CircleArray;
  }

  // ScrollView滚动偏移量
  _scrollEnd(kScroll){
    // 获取水平方向的偏移量
    const offSetX = kScroll.nativeEvent.contentOffset.x;
    // 获取当前页的Index
    const  index = parseInt(offSetX/width);

    // 更新状态机 刷新UI
    this.setState({
      currentPage:index,
    });
  }

  // 处理耗时操作或者网络请求
  componentDidMount() {
    this._startTimer();
  }

  // 定时器
  _startTimer(){
    // 拿到scrollView
    const myScrollView = this.refs.myScrollView;
    //轮播图片个数(即圆点个数)
    const countPage = ImageDataArr.length;
    // 当前选中索引
    var currentIndex = 0;

    
    // 定时器
    this.timer = setInterval(()=>{

      //判断
      if(this.state.currentPage+1 >= countPage){
        currentIndex = 0;
      }else {
        currentIndex = (this.state.currentPage += 1);
      }

      // 改变索引
      this.setState({

        currentPage:currentIndex,

      });

      // 让scrollView滚动起来
      myScrollView.scrollResponderScrollTo({x: currentIndex * width,y: 0, animated: true});

    },1000);

  }
}

const styles = StyleSheet.create({

  container: {

    marginTop:30,


  },
  CircleViewStyle: {

    width:width,
    height:25,
    backgroundColor:'rgba(0,0,0,0.4)',

    //绝对定位
    position:'absolute',
    bottom:0,
    // 主轴方向
    flexDirection:'row',
    // 侧轴对齐方式
    alignItems:'center',
    //主轴对齐方式
    justifyContent:'center',
  },



});

AppRegistry.registerComponent('ScrollViewDemo', () => ScrollViewDemo);
