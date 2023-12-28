import { useEffect, useState } from "react";
import api from "../../src/api";
import { Model } from "../../src/api/module/model";
import { buildImageUrl } from "../utils";

interface ModelGroup {
  groupName: string;
  list: Model[];
}

function useModelHook() {
  const [modelList, setModelList] = useState<Model[]>([]);
  const [modelListGroup, setModelListGroup] = useState<ModelGroup[]>([]);

  useEffect(() => {
    getModelList();
  }, []);

  const getModelList = () => {
    api.model.getModelList({
      data: {
        page: 1,
        pageSize: 50,
      }
    }).then((res) => {
      const ll = (res?.list ?? []).map((v) => {
        return {
          ...v,
          url: buildImageUrl(v.url)
        }
      })
      setModelList(ll);
      setModelListGroup([
        {
          groupName: '全部',
          list: ll,
        }
      ])
    });
  }

  return {
    modelList,
    modelListGroup,
    getModelList
  }
}

export default useModelHook;