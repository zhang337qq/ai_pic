import { Image, ScrollView, View } from "@tarojs/components";
import "./index.less";

const CommonItemList: React.FC<{
  title: string;
  list: any[];
}> = ({ title, list }) => {
  return (
    <View className="common-item-list mt-20">
      <View className="common-item-list-title mb-20">{title}</View>
      <ScrollView
        scrollY={false}
        scrollX={true}
        enable-flex
        className="scroll-view x"
        style="flex-direction: row;height: 200rpx; width: 100%"
      >
        {list.map((v) => {
          return (
            <Image
              key={v.key}
              src={`${v.url}`}
              className="common-item-list-image mr-20"
              mode={"scaleToFill"}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

export default CommonItemList;
