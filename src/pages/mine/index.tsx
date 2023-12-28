import { ScrollView, View, Image } from "@tarojs/components";
import { useState } from "react";
import groupBy from "lodash-es/groupBy";
import api from "../../api";
import { buildImageUrl } from "@/utils/index";
import "./index.less";
import Taro, { useLoad } from "@tarojs/taro";
import dayjs from "dayjs";

const pageSize = 50;

function TaskListComponent({ item, handlePreview }) {
  return (
    <View className="task-item">
      <View className="task-item-title">{item.title}</View>
      <View className="task-item-images mt-20">
        {item.list.map((v) => {
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
      </View>
    </View>
  );
}

function MinePage() {
  const [page, setPage] = useState<number>(1);
  const [list, setList] = useState<any[]>([]);
  const [originList, setOriginList] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [refresherTriggered, setRefresherTriggered] = useState(false);

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

  useLoad(() => {
    Taro.setNavigationBarTitle({
      title: "我的",
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

  const onRefresherRefresh = async () => {
    setRefresherTriggered(true);
    await getList(true);
    setRefresherTriggered(false);
  };

  return (
    <View className="page-container" style={{ overflow: "hidden" }}>
      <View className="page-title">我的图库</View>
      <ScrollView
        enable-flex
        scrollX={false}
        scrollY
        refresherEnabled
        refresherTriggered={refresherTriggered}
        onRefresherRefresh={onRefresherRefresh}
        style={{ height: `calc(100vh - 100rpx)` }}
      >
        {list.map((v) => {
          return (
            <TaskListComponent
              key={v.title}
              item={v}
              handlePreview={handlePreview}
            />
          );
        })}
        <View onClick={handleLoadMore} className="load-more">
          {hasMore ? "加载更多" : "已加载全部"}
        </View>
      </ScrollView>
    </View>
  );
}

export default MinePage;
