import { useState } from "react";
import { Tabbar } from "@nutui/nutui-react-taro";
import { Find, Home, My } from "@nutui/icons-react-taro";
import Taro from "@tarojs/taro";

const pagesMap = {
  0: "/pages/index/index",
  1: "/pages/create/index",
  2: "/pages/mine/index",
};

const App = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const onSwitch = (idx) => {
    // setActiveTab(idx);
    Taro.switchTab({
      url: pagesMap[idx],
    });
  };

  return (
    <Tabbar
      inactiveColor="#7d7e80"
      activeColor="#1989fa"
      onSwitch={onSwitch}
      fixed={true}
      safeArea={true}
    >
      <Tabbar.Item title="首页" icon={<Home width={20} height={20} />} />
      <Tabbar.Item title="创作" icon={<Find width={20} height={20} />} />
      <Tabbar.Item title="我的" icon={<My width={20} height={20} />} />
    </Tabbar>
  );
};

export default App;
