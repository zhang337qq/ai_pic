import { ScrollView, View, Image, Checkbox, Icon, RadioGroup, Radio, Label } from "@tarojs/components";
import "./index.less";
import api from "@/api";
import classnames from "classnames";
import Taro, { useLoad } from "@tarojs/taro";
import { getCurrentInstance } from "@tarojs/runtime";
import { useState } from 'react'
import { arrayBuffer } from "stream/consumers";
const pageSize = 50;

function DetailePage() {
  useLoad(() => {
    Taro.setNavigationBarTitle({
      title: "账单明细",
    });
    getList();
  });

  let list = [
    {
      value: '1',
      text: '全部',
      checked: true
    },
    {
      value: '2',
      text: '充值',
      checked: false
    },
    {
      value: '3',
      text: '创作',
      checked: false
    }]
  const [originList, setOriginList] = useState<any[]>([]);
  const [inOutList, setInOutList] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [lists, setLists] = useState<any>(list);
  const [checkType, setCheckType] = useState<boolean>(false);
  const [refresherTriggered, setRefresherTriggered] = useState(false);
  const getList = async (isRefresh = false) => {
    const currentPage = isRefresh ? 1 : page;
    Taro.showLoading();
    const res = await api.task.getRecords({
      data: {
        pageSize,
        keyword: '',
        page: currentPage,
        userId: Taro.getStorageSync('user_id'),
        // userId: '0000',
      },
    });
    Taro.hideLoading();
    setOriginList(res.list)
    setInOutList(res.list)
    // console.log(originList)
  }

  const groupFluter = (e) => {
    let arr = inOutList
    const { value } = e.detail;
    if (value === '2') {
      console.log(2)
      let a2 = arr.filter(i => i.type === 'in')
      setOriginList(a2)
    } else if (value === '3') {
      let a2 = arr.filter(i => i.type === 'out')
      setOriginList(a2)
    } else {
      setOriginList(arr)
    }
  }
  const onRefresherRefresh = async () => {
    setRefresherTriggered(true);
    await getList(true);
    setRefresherTriggered(false);
  };
  return (
    <View className="page-container" style={{ overflow: "hidden" }}>
      <View className="task-item-images mt-20">
        <RadioGroup className="radio_group" onChange={groupFluter}>
          {lists.map((item, i) => {
            return (
              <Label className='radio-list__label radio_group_label' for={i} key={i} >
                <Radio className='radio-list__radio' value={item.value} checked={item.checked}>{item.text}</Radio>
              </Label>
            )
          })}
        </RadioGroup>
      </View>
      <ScrollView
        enable-flex
        scrollX={false}
        scrollY
        refresherEnabled
        refresherTriggered={refresherTriggered}
        onRefresherRefresh={onRefresherRefresh}
        style={{ height: `calc(100vh - 120rpx)` }}
      >
        {originList.map((item, i) => {
          return (
            <View className="box_list">
              <view className="f2 name">{item.memo}</view>
              <view className="f2">{item.amt}</view>
              <view className="f3">{item.dt}</view>
            </View>
          )
        })}
        {/* <View className="box_list">
          <view className="f2 name">1</view>
          <view className="f2">2</view>
          <view className="f3">3</view>
        </View> */}
      </ScrollView>
    </View >
  );
}

export default DetailePage;
