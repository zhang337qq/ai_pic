import { ScrollView, View, Image } from "@tarojs/components";
import React, { useState, useEffect } from 'react'
import groupBy from "lodash-es/groupBy";
import api from "../../api";
import { buildImageUrl } from "@/utils/index";
import "./index.less";
import Taro, { useLoad } from "@tarojs/taro";
import dayjs from "dayjs";
const pageSize = 50;

function TaskListComponent({ item, handlePreview, handleDetaile }) {
  return (
    <View className="task-item">
      <View className="df">
        <View className="task-item-title">{item.title}</View>
        <View> 创作{item.list.length} 条</View>
        <View className="task-item-detaile" onClick={() => handleDetaile(item)}>查看</View>
      </View>
      {/* <View className="task-item-images mt-20">
        {item.list.slice(0, 4).map((v) => {
          return (
            <Image
              key={v.url}
              src={v.url}
              className="task-item-image"
              mode={"aspectFit"}
              onClick={() => handlePreview(item.title, v.url)}
            />
          );
        })}
      </View> */}
    </View>
  );
}
function MinePage() {
  const [page, setPage] = useState<number>(1);
  const [list, setList] = useState<any[]>([]);
  const [originList, setOriginList] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [refresherTriggered, setRefresherTriggered] = useState(false);
  const usernum = JSON.parse(Taro.getStorageSync('user_num_msg'))
  const [userNum, setUserNum] = useState<any>(usernum);
  const userinfo = JSON.parse(Taro.getStorageSync('user_info'))
  const [userInfo, setUserInfo] = useState<any>(userinfo);
  // console.log(userInfo)
  useEffect(() => {
    // console.log(' 2 useEffect')
  }, [])
  useLoad(() => {
    // loginGetUserInfo()
    console.log(' 1 useLoad')
  })

  console.log(Taro.getStorageSync("user_info"))

  const handlePreview = (title, url) => {
    const targetItem = list.find((v) => v.title === title);
    if (!targetItem) {
      return;
    }
    const preViewImages = targetItem.list.map((v) => v.url);
    Taro.previewImage({
      urls: preViewImages,
      current: url,
    });
  };

  // 查看详情
  const handleDetaile = (item) => {
    item.list.forEach(function (item) {
      item['checked'] = false;
    });
    // 跳转到目的页面，打开新页面
    Taro.navigateTo({
      url: `/pages/mine/detaile/index?title=${item.title}&list=${JSON.stringify(item.list)}`
    })
  }
  // loginGetUserInfo(res.ID)
  // 查询个人信息


  useLoad(() => {
    Taro.setNavigationBarTitle({
      title: "记录",
    });
    getList();
  });

  const handleLoadMore = () => {
    if (!hasMore) {
      return;
    }
    getList();
  };

  const getList = async (isRefresh = false) => {
    const currentPage = isRefresh ? 1 : page;
    Taro.showLoading();
    const res = await api.task.getTaskList({
      data: {
        pageSize,
        page: currentPage,
        userId: "1",
      },
    });
    const resList = res?.list ?? [];
    const hasMore = res?.total > res?.page * res?.pageSize;
    setHasMore(hasMore);
    if (hasMore) {
      setPage(currentPage + 1);
    }
    const oList: any[] = [];
    resList.forEach((v) => {
      oList.push(
        ...(v.resultList || []).map((r) => {
          r.url = buildImageUrl(r.url);
          return r;
        })
      );
    });
    const totoalOList = currentPage === 1 ? oList : [...originList, ...oList];
    setOriginList(totoalOList);
    const groupData = groupBy(totoalOList, (e) => {
      return dayjs(e.CreatedAt).format("YYYY-MM-DD");
    });
    const l: any[] = [];
    Object.keys(groupData).forEach((k) => {
      l.push({
        title: (k || "").split("T")?.[0] ?? "",
        list: groupData[k],
      });
    });
    setList(l);
    Taro.hideLoading();
    Taro.stopPullDownRefresh();
  };

  const goToBill = () => {
    Taro.navigateTo({
      url: `/pages/mine/billDetails/index`
    })
  };
  const onRefresherRefresh = async () => {
    setRefresherTriggered(true);
    await getList(true);
    setRefresherTriggered(false);
  };

  return (
    <View className="page-container" style={{ overflow: "hidden" }}>
      <view className="my-user">
        <view className="user_message">
          <Image className="user_image" src={userInfo.avatarUrl}></Image>
          <view className="user_msg">
            <view className="name"> {userInfo.nickName}</view>
            <view className="id">id:</view>
          </view>
        </view>
        <view className="user_num">
          <view>
            剩余创作数:  <view className="num">{userNum?.remainingGpuPower}</view>
          </view>
          <view>
            剩余存储空间: <view className="num">{userNum?.remainingSpace}M</view>
          </view>
        </view>
        <view className="user_buttun">
          <button className="btn">
            充值
        </button>
          <button className="btn" onClick={goToBill}>
            账单明细
        </button>
        </view>
      </view>
      <View className="my-creatd">
        <View className="page-title">我的创作</View>
        <ScrollView
          enable-flex
          scrollX={false}
          scrollY
          refresherEnabled
          refresherTriggered={refresherTriggered}
          onRefresherRefresh={onRefresherRefresh}
          style={{ height: `calc(100vh - 540rpx)` }}
        >
          {list.map((v) => {
            return (
              <TaskListComponent
                key={v.title}
                item={v}
                handlePreview={handlePreview}
                handleDetaile={handleDetaile}
              />
            );
          })}
          <View onClick={handleLoadMore} className="load-more">
            {hasMore ? "加载更多" : "已加载全部"}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

export default MinePage;
