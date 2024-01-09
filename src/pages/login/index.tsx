import './index.less'
import React, { useEffect, useDidShow } from 'react';
import Taro, { useLoad } from "@tarojs/taro";
import { View, Image, Button } from "@tarojs/components";



function DetailPage() {


  useLoad(() => {
    Taro.setNavigationBarTitle({
      title: "登录",
    });
    Taro.hideHomeButton();
  });

  const authoriseConfirm = () => {
    Taro.getUserProfile({
      desc: '正在获取',//不写不弹提示框
      success: function (res) {
        console.log('获取成功: ', res)
        // if (res) {
        //   Taro.setStorageSync('user_login', JSON.stringify(res))
        // }
        // setTimeout(() => {
        //   Taro.navigateBack({ delta: 1 })
        // },1000)
      },
      fail: function (err) {
        console.log("获取失败: ", err)
      }
    })
  }

  useEffect(() => {
    // 在组件挂载后立即调用 removeBackButton 函数
  }, []);

  return (
    <View className="page-container" style={{ overflow: "hidden" }}>
      <Image className="back_img" src="../../assets/icon/login_background.jpg"></Image>
      <button className="Authorized_login" onClick={authoriseConfirm}>微信授权登录</button>
    </View>
  );
}

export default DetailPage;