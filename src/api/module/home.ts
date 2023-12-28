import defineAPI from "../defineAPI";

export const getHomePic = defineAPI<{
  guiding: {
    url?: string;
  },
  modelList: {
    list: any[],

  },
  sceneList: {
    list: any,
  },
  showList: {
    list: any[]
  }
}, {
  userId: string;
}>(
  "post /bizhome/getGuiding"
)