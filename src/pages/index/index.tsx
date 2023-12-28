import React, { useState } from "react";
import {
  Checkbox,
  CheckboxGroup,
  Image,
  ScrollView,
  Swiper,
  SwiperItem,
  View,
} from "@tarojs/components";
import { Button } from "@nutui/nutui-react-taro";
import "./index.less";
import { useLoad } from "@tarojs/taro";
import StorageUtil from "../../utils/storage";
import CommonItemList from "../../components/CommonItemList/CommonItemList";
import useSceneHook from "../../hooks/useSceneHook";
import useModelHook from "../../hooks/useModelHook";
import api from "../../api";
import { buildImageUrl } from "@/utils/index";
import classnames from "classnames";


function IndexSwiperList({ list }) {
  return (
    <Swiper
      indicatorDots
      autoplay
      circular
      indicatorColor="#999"
      indicatorActiveColor="#333"
      className="swiper-list"
    >
      {list.map((v) => {
        return (
          <SwiperItem key={v.key} className="swiper-item">
            <Image src={v.url} className="swiper-image"
              mode={"scaleToFill"} />
          </SwiperItem>
        );
      })}
    </Swiper>
  );
}

function Index() {
  const [isCloseHomeGuide, setIsCloseHomeGuide] = useState<boolean>(false);
  const [isCloseHomeGuideChecked, setIsCloseHomeGuideChecked] =
    useState<boolean>(false);

  const { sceneList } = useSceneHook();
  const { modelList } = useModelHook();
  const [guideUrl, setGuideUrl] = useState('');
  const [posterList, setPosterList] = useState([]);

  useLoad(() => {
    setIsCloseHomeGuide(StorageUtil.getValue("closeHomeGuide", false));
    getHomeList();
  });

  const getHomeList = async () => {
    const res = await api.home.getHomePic({
      data: {
        userId: "1"
      }
    });
    setPosterList(((res?.showList?.list ?? []) as any).map((v) => {
      return {
        ...v,
        url: buildImageUrl(v.url),
      }
    }));
    setGuideUrl(buildImageUrl(res?.guiding?.url ?? ''))
  }

  const handleCloseHomeGuide = () => {
    setIsCloseHomeGuide(true);
    if (isCloseHomeGuideChecked) {
      StorageUtil.setValue("closeHomeGuide", true);
    }
  };

  const onIsCloseHomeGuideCheckChange = (e) => {
    setIsCloseHomeGuideChecked(!isCloseHomeGuideChecked);
  };

  return (
    <View className={classnames('page-container index-page', { guide: !isCloseHomeGuide })}>
      {isCloseHomeGuide ? (ni
        <ScrollView>
          <IndexSwiperList list={posterList} />
          <CommonItemList title="模特" list={modelList} />
          <CommonItemList title="场景" list={sceneList} />
        </ScrollView>
      ) : (
          <ScrollView>
            <Image src={guideUrl} mode={'widthFix'} className="guideUrl" />
            <View className="flex col center">
              <CheckboxGroup onChange={onIsCloseHomeGuideCheckChange}>
                <Checkbox value={"1"} checked={isCloseHomeGuideChecked}>
                  以后不看向导
              </Checkbox>
              </CheckboxGroup>
              <View className="t10" style={{ height: "20rpx" }}></View>
              <Button onClick={handleCloseHomeGuide} className="mt-10">
                关闭向导图
            </Button>
            </View>
          </ScrollView>
        )}
    </View>
  );
}

export default Index;
