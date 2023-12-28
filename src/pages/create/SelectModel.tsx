import { ScrollView, View, Image, Icon } from "@tarojs/components";
import classnames from "classnames";

function SelectModel({ list, onSelect, selectedKey }) {
  return (
    <View
      style={{ overflow: "hidden" }}
      className="select-component"
    >
      <View className="page-title">选取模特</View>
      <ScrollView
        scrollY
        enable-flex
        scrollX={false}
        style={{ height: `calc(100vh - 220rpx)`, }}
      >
        {(list || []).map((l) => {
          const isSelected = l.key === selectedKey;
          return (
            <Image
              key={l.key}
              src={l.url}
              className={classnames("image", {
                selected: isSelected,
              })}
              mode={"scaleToFill"}
              onClick={() => onSelect(l.key)}
            >
              {isSelected && <Icon type="success" className="selected-icon" />}
            </Image>
          );
        })}
      </ScrollView>
    </View>
  );
}

export default SelectModel;
