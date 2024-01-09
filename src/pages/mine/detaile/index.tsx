import { ScrollView, View, Image, Checkbox, Icon, CheckboxGroup } from "@tarojs/components";
import "./index.less";
import api from "@/api";
import classnames from "classnames";
import Taro, { useLoad } from "@tarojs/taro";
import { getCurrentInstance } from "@tarojs/runtime";
import { useState, useCallback } from 'react'

function DetailePage() {
  const [checkList, setCheckList] = useState<any>([]);
  useLoad(() => {
    Taro.setNavigationBarTitle({
      title: "记录详情",
    });
  });

  let params = Taro.getCurrentInstance().router.params
  const dateTitle = params.title
  const datalist = JSON.parse(params.list)
  const [dataImages, setDataImages] = useState<any>(datalist);

  // 点击放大图片
  const handlePreview = (title, url) => {
    const preViewImages = dataImages.map((v) => v.url);
    Taro.previewImage({
      urls: preViewImages,
      current: url,
    });
  };
  
  const [checkType, setCheckType] = useState<boolean>(false);

  const imgLongPress = () => {
    setCheckType(!checkType)
  }
  const deleteChecked = async () => {
    if (checkList.length <= 0) {
      Taro.showToast({
        title: '请选择图片',
        icon: 'error',
        duration: 2000
      })
    } else {
      const res = await api.task.delImage({
        data: {
          ids: checkList,
          userId: Taro.getStorageSync('user_id')
        }
      })
      setDataImages(removeMatchedItems(dataImages, checkList))
      Taro.showToast({
        title: '成功',
        icon: 'success',
        duration: 2000
      })
      setCheckList([])
    }
  }
  const checkChaneg = (e) => {
    console.log(e.detail.value)
    setCheckList(e.detail.value)
  }
  function removeMatchedItems(sourceArray: any[], targetArray: any[]): any[] {
    return sourceArray.filter(item => !targetArray.some(target => target === item.taskId));
  }
  return (
    <View className="page-container" style={{ overflow: "hidden" }}>
      <View className="page-title">{dateTitle}</View>
      <ScrollView
        enable-flex
        scrollX={false}
        scrollY
        refresherEnabled
        style={{ height: `calc(100vh - 360rpx)` }}
      >
        <View className="task-item-images mt-20">
          <CheckboxGroup onChange={checkChaneg}>

            {dataImages.map((v) => {
              return (
                <view className="task-item">
                  <label key={v.taskId}>
                    <Checkbox className={classnames("checkbox-list__checkbox", checkType ? 'block' : 'none')} value={v.taskId} checked={v.checked}></Checkbox>
                    <Image
                      onLongPress={imgLongPress}
                      key={v.url}
                      src={v.url}
                      lazy-load="true"
                      className="task-item-image"
                      mode={"aspectFit"}
                      // onClick={ () => handlePreview(dateTitle, v.url)}
                      onClick={e => { e.stopPropagation(); handlePreview(dateTitle, v.url) }}
                    >
                    </Image>
                  </label>
                  {/* <view className="del-img" onClick={e => {  }}>x</view> */}
                </view>
              );
            })}
          </CheckboxGroup>
        </View>
      </ScrollView>
      <view className={classnames("del-img", checkType ? 'xs' : 'xx')} onClick={deleteChecked}>
        删除
      </view>
    </View >
  );
}

export default DetailePage;
