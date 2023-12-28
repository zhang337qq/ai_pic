import defineAPI from "../defineAPI";

export interface Task {
  userId: string;
  /** 类型 u_model,  u_scene  */
  type: string;
  /** 原图id */
  srcKey: string;
  /** 衣服款式 */
  srcClass?: string;
  /** 衣服风格 */
  srcStyle?: string;
  /** 模特id */
  modelKey: string;
  /** 场景id */
  sceneKey: string;
  /**  创作图片数 */
  createNo?: number;
}

export const enum EnumTaskStatus {
  START = 0,
  PROGRESS = 1,
  COMPLETE = 2,
  ERROR = 9
}

export interface TaskResult {
  ID: string;
  progress: string;
  status: number;
}

/** 创建任务 */
export const createTask = defineAPI<{
  task: TaskResult
}, Task>(
  "post /bizcreate/createTask"
);

/** 获取任务进度 */
export const getTaskInfo = defineAPI<{
  task: {
    progress: number;
    resultList: any[];
    status: EnumTaskStatus;
  }
}, {taskId: string}>(
  'post /bizcreate/getTaskInfo'
)

export const getTaskList = defineAPI<any, any>(
  "post /bizcreate/getTaskList"
)
