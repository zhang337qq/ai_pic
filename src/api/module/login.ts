import defineAPI from "../defineAPI";

export interface IDecryptParam {
  sessionKey: string
  encryptedData: string
  iv: string
}

/** 获取登录信息 */
export const getSessionKeyByCode = defineAPI<{
  task: any
}, {
  code: string
}>(
  "post /bizme/userLogin"
);
/** 解密登录信息 */
export const getUserInfo = defineAPI<any, {
  id?: string,
  wxId?: string
}>(
  "post /bizme/getUserInfo"
);