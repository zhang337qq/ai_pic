import { ScrollView, View, Image } from "@tarojs/components";
import "./index.less";
import Taro, { useLoad } from "@tarojs/taro";

function UserPage() {
  useLoad(() => {
    Taro.setNavigationBarTitle({
      title: "我的",
    });
  });

  return (
    <View className="page-container" style={{ overflow: "hidden" }}>
      <View>我的</View>
    </View>
  );
}

export default UserPage;
