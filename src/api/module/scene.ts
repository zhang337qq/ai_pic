import defineAPI from "../defineAPI";

export interface Scene {
  ID: string;
  class: string;
  enable: number;
  name: string;
  url: string;
  key: string;
}

export const getSceneList = defineAPI<{
  list: Scene[],
  total: number;
}, {
  page: number;
  pageSize: number;
}>(
  "post /bizcreate/getSceneList"
)