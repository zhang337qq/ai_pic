import api from '@/api'
// import app from '@/services/request'
import StorageUtil from '@/utils/storage'

export const fetchSessionKey = (code: string) => {
  return new Promise((resolve) => {
    api.login.getSessionKeyByCode({
      data: {
        code
      }
    }).then((result: any) => {
      StorageUtil.setValue('login', result.session_key)
      resolve(result)
    })
    // app.request({
    //   url: app.apiUrl(api.getSessionKeyByCode),
    //   data: {
    //     code
    //   }
    // }).then((result: any) => {
    //   StorageUtil.setValue('session_key', result.session_key)
    //   resolve(result)
    // })
  })
}

interface IDecryptParam {
  sessionKey: string
  encryptedData: string
  iv: string
}

export const fetchDecryptData = (decryptParam: IDecryptParam) => {
  return new Promise((resolve) => {
    api.login.IDecryptParam({
      data: decryptParam
    }).then((result: any) => {
      StorageUtil.setValue('login', result.session_key)
      resolve(result)
    })
    // app.request({
    //   method: 'POST',
    //   url: app.apiUrl(api.decryptData),
    //   data: decryptParam
    // }, { loading: false }).then((result: any) => {
    //   resolve(result)
    // })
  })
}