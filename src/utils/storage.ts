import Taro from "@tarojs/taro";

/**
 * 本地存储声明
 */
interface StorageData {
  closeHomeGuide: boolean;
}

type StorageKey = keyof StorageData;

class StorageUtil {
  private static keyPrefix = 'ai_pic';

  private static getKey (key: string) {
    return `${this.keyPrefix}_${key}`;
  }
  static getValue(k: StorageKey, defaultValue: StorageData[StorageKey]) {
    const key = this.getKey(k);
    console.log("setValue..", key);
    return Taro.getStorageSync(key) ?? defaultValue;
  }

  static setValue(k: StorageKey, v: StorageData[StorageKey]) {
    const key = this.getKey(k);
    console.log("setValue..", key, v);
    Taro.setStorageSync(key, v);
  }
}

export default StorageUtil;