import defineAPI from "../defineAPI";

export interface Model {
  ID: string;
  class: string;
  url: string;
  key: string;
}

export const getModelList = defineAPI<{
  list: Model[];
  total: number;
}, {
  page: number;
  pageSize: number;
}>(
  "post /bizcreate/getModelList"
)