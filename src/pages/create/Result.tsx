import { View, Image, Swiper, SwiperItem } from "@tarojs/components";
import { CircleProgress } from "@nutui/nutui-react-taro";
import classnames from "classnames";

function Result({ percent, isFailed, isSuccess, resultList }) {
  const isComplete = percent >= 100 || isFailed || isSuccess;
  return (
    <View className="result-component">
      <Swiper
        indicatorDots
        circular
        indicatorColor="#999"
        indicatorActiveColor="#333"
        className={classnames("swiper-list", { complete: isComplete })}
      >
        {resultList.map((v) => {
          return (
            <SwiperItem key={v.key} className="swiper-item">
              <Image
                src={v.url}
                className="swiper-image"
                mode={"scaleToFill"}
              />
            </SwiperItem>
          );
        })}
      </Swiper>
      <View className="progress">
        {(!isComplete) && (
          <CircleProgress percent={percent} strokeWidth={10} background={""} color={'#1296db'}>
            {percent}%
          </CircleProgress>
        )}
      </View>
    </View>
  );
}

export default Result;
