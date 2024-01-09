import React, { useEffect } from 'react'
import Taro, { useDidShow, useDidHide } from '@tarojs/taro'
import api from "@/api";
// 全局样式
import StorageUtil from "@/utils/storage";
import './app.less'    
function App(props) {
  // 可以使用所有的 React Hooks
  useEffect(() => {
  })
  const loginGetUserInfo = async (userid: string) => {
    const res = await api.login.getUserInfo({
      data: {
        id: userid
      },
    });
    Taro.setStorageSync('user_num_msg', JSON.stringify(res))
  }
  const loginCode = async () => {
    Taro.login()
      .then(async ({ code }) => {
        const res = await api.login.getSessionKeyByCode({
          data: {
            code: code
          },
        });
        Taro.setStorageSync('user_id', res.ID)
        Taro.setStorageSync('open_id', res.class)
        console.log(res)
        loginGetUserInfo(res.ID)
      })
      .catch((error) => console.log(error));
  }
  // 对应 onShow
  useDidShow(() => {
    if (!Taro.getStorageSync('user_info')) {
      // console.log('未登录')
      // Taro.navigateTo({
      //   url: `/pages/login/index`
      // })
      Taro.getUserInfo({
        success: function (res) {
          Taro.setStorageSync('user_info', JSON.stringify(res.userInfo))
        }
      })
      loginCode()
    }
    // Taro.setStorageSync('user_login', JSON.stringify(res))
    // Taro.navigateTo({
    //   url: `/pages/login/index`
    // })
  })

  // 对应 onHide
  useDidHide(() => {
    console.log('useDidHide')
  })

  return props.children
}

export default App
