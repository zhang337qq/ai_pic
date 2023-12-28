import { useEffect, useState } from "react";
import api from "../../src/api";
import { Scene } from "../../src/api/module/scene";
import { buildImageUrl } from "../utils";

interface SceneGroup {
  groupName: string;
  list: Scene[];
}

function useSceneHook() {
  const [sceneList, setSceneList] = useState<Scene[]>([]);
  const [sceneListGroup, setSceneListGroup] = useState<SceneGroup[]>([]);

  useEffect(() => {
    getSceneList();
  }, []);

  const getSceneList = () => {
    api.scene.getSceneList({
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
      });
      setSceneList(ll);
      setSceneListGroup([
        {
          groupName: '全部',
          list: ll,
        }
      ]);
    });
  }

  return {
    sceneList,
    sceneListGroup,
    getSceneList
  }
}

export default useSceneHook;