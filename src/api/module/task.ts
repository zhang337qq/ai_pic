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

export interface delTasks {
  ids: any;
  userId: string;
}

/** 创建任务 */
export const createTask = defineAPI<{
  task: TaskResult
}, Task>(
  "post /bizcreate/createTask"
);

// /bizme/deleteTasks
export const delImage = defineAPI<{
  task: delTasks
}, Task>(
  "post /bizme/deleteTasks"
);


/** 获取任务进度 */
export const getTaskInfo = defineAPI<{
  task: {
    progress: number;
    resultList: any[];
    status: EnumTaskStatus;
  }
}, { taskId: string }>(
  'post /bizcreate/getTaskInfo'
)

export const getTaskList = defineAPI<any, any>(
  "post /bizcreate/getTaskList"
)

export const getRecords = defineAPI<any, any>(
  "post /bizme/getRecords"
)
