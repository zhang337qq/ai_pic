import { Button, View } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
import { useState } from "react";
import "./index.less";
import SelectModel from "./SelectModel";
import SelectScene from "./SelectScene";
import useModelHook from "../../hooks/useModelHook";
import useSceneHook from "../../hooks/useSceneHook";
import Result from "./Result";
import api from "../../../src/api";
import { baseUrl } from "../../config";
import { EnumTaskStatus } from "../../api/module/task";
import { buildImageUrl } from "../../utils/index";

type TaskStep =
  | "initial"
  | "model"
  | "scene"
  | "result"
  | "complete"
  | "failed";

let pollRequestTaskInfoTimer: any = null;
let poolRequestTimes = 0;

function Index() {
  const [taskStep, setTaskStep] = useState<TaskStep>("initial");
  const { modelList, modelListGroup } = useModelHook();
  const { sceneList, sceneListGroup } = useSceneHook();

  const [selectedModel, setSelectedModel] = useState("");
  const [selectedScene, setSelectedScene] = useState("");
  const [uploadImage, setUploadImage] = useState({
    key: "",
    url: "",
  });
  const [percent, setPercent] = useState(0);
  const [resultList, setResultList] = useState<any[]>([]);

  useLoad(() => {
    Taro.setNavigationBarTitle({
      title: "开始创作",
    });
  });

  const onChooseImage = () => {
    Taro.chooseImage({
      count: 1,
      sizeType: ["compressed"],
      sourceType: ["album", "camera"],
      success: (res) => {
        const tempFilePaths = res.tempFilePaths;
        Taro.showLoading({
          title: "上传中...",
        });
        Taro.uploadFile({
          url: `${baseUrl}/fileUploadAndDownload/upload`,
          filePath: tempFilePaths[0],
          name: "file",
          formData: {
            user: "test",
          },
          success(res) {
            if (res.statusCode === 200) {
              const resData = JSON.parse(res.data);
              setUploadImage({
                key: resData?.data?.file?.key,
                url: resData?.data?.file?.url,
              });
              setTaskStep("model");
            }
          },
        }).finally(() => {
          Taro.hideLoading();
        });
      },
    });
    // setTaskStep("model");
  };

  const handlePrev = () => {
    setSelectedScene("");
    setTaskStep("model");
  };

  const handleNext = () => {
    //
    if (taskStep === "model") {
      if (!selectedModel) {
        Taro.showToast({
          title: "请选择模特",
          icon: "error",
        });
        return;
      }
      setTaskStep("scene");
    } else if (taskStep === "scene") {
      if (!selectedScene) {
        Taro.showToast({
          title: "请选择场景",
          icon: "error",
        });
        return;
      }
      handleCreateTask();
    }
  };

  const handleCreateTask = async () => {
    setTaskStep("result");
    setPercent(0);
    const res = await api.task.createTask({
      data: {
        sceneKey: selectedScene,
        modelKey: selectedModel,
        userId: Taro.getStorageSync('user_id'),
        type: "u_model",
        srcKey: uploadImage.key,
      },
    });
    pollRequestTaskInfo(res.task.ID);
  };

  const pollRequestTaskInfo = async (taskId: string) => {
    const res = await api.task.getTaskInfo({
      data: {
        taskId: taskId,
      },
    });
    poolRequestTimes += 1;

    setPercent(res.task?.progress || 0);
    // console.log(res.task?.status, res.task?.progress)

    clearTimeout(pollRequestTaskInfoTimer);
    pollRequestTaskInfoTimer = null;
    if (poolRequestTimes >= 8 || res.task?.status === EnumTaskStatus.ERROR) {
      setTaskStep("failed");
      poolRequestTimes = 0;
      return;
    }
    if (
      res.task?.progress >= 100 ||
      res.task?.status === EnumTaskStatus.COMPLETE
    ) {
      if (res.task?.status === 2) {
        setPercent(99);
        // console.log(222223323232)
      }
      setTimeout(() => {
        clearTimeout(pollRequestTaskInfoTimer);
        pollRequestTaskInfoTimer = null;
        setTaskStep("complete");
        setResultList(
          ((res?.task?.resultList ?? []) as any).map((v) => {
            return {
              ...v,
              url: buildImageUrl(v.url),
              originUrl: v.url,
            };
          })
        );
      }, 1000)
    } else {
      pollRequestTaskInfoTimer = setTimeout(() => {
        pollRequestTaskInfo(taskId);
      }, 2000);
    }
  };

  const handleSave = () => {
    const url = resultList?.[0]?.url ?? "";
    Taro.showLoading({ title: '保存中...' });
    Taro.downloadFile({
      url: url,
      success: (res) => {
        console.log("download..", res);
        if (res.statusCode === 200) {
          Taro.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: () => {
              Taro.hideLoading();
              Taro.showToast({
                title: "保存成功",
                icon: "success",
              });
              const fileMgr = Taro.getFileSystemManager();
              fileMgr.unlink({
                filePath: res.tempFilePath,
                success: () => {
                  console.log("删除缓存成功");
                }
              });
            },
            fail: (err) => {
              if ((err.errMsg || '').indexOf('auth')) {
                Taro.showModal({
                  title: '提示',
                  content: `需要您授权保存相册`,
                  showCancel: false,
                  success: () => {
                    Taro.openSetting({
                      success(settingData) {
                        if (settingData.authSetting['scope.writePhotosAlbum']) {
                          Taro.showModal({
                            title: '提示',
                            content: '获取权限成功，再次点击保存即可保存',
                            showCancel: false
                          })
                        } else {
                          Taro.showModal({
                            title: '提示',
                            content: '获取权限失败',
                            showCancel: false
                          })
                        }
                      }
                    })
                  }
                })
              } else {
                Taro.showModal({
                  title: "提示",
                  content: err.errMsg,
                });
              }
            },
          });
        }
        Taro.hideLoading();
      },
      fail: (err) => {
        console.warn("download..", err);
        Taro.hideLoading();
        Taro.showToast({
          title: err.errMsg,
          icon: "error",
        });
      },
    });
  };

  const handleReStart = () => {
    setTaskStep("initial");
    setSelectedModel("");
    setSelectedScene("");
    setResultList([]);
    setUploadImage({ key: "", url: "" });
    clearTimeout(pollRequestTaskInfoTimer);
  };

  const isComplete =
    percent >= 100 || taskStep === "failed" || taskStep === "complete";

  return (
    <View className="page-container create-page">
      <View className="content">
        {taskStep === "model" && (
          <SelectModel
            list={modelList}
            onSelect={(k) => {
              setSelectedModel(k);
            }}
            selectedKey={selectedModel}
          />
        )}

        {taskStep === "scene" && (
          <SelectScene
            list={sceneList}
            onSelect={(k) => {
              setSelectedScene(k);
            }}
            selectedKey={selectedScene}
          />
        )}

        {(taskStep === "complete" ||
          taskStep === "failed" ||
          taskStep === "result") && (
            <Result
              percent={percent}
              isFailed={taskStep === "failed"}
              isSuccess={taskStep === "complete"}
              resultList={resultList}
            />
          )}
      </View>
      <View className="action">
        {taskStep === "initial" && (
          <Button className="button-start" onClick={onChooseImage}>
            开始创作
          </Button>
        )}
        {taskStep === "model" && (
          <View className="button-group">
            <Button className="button" onClick={handleReStart}>
              重新开始
            </Button>
            <Button className="button" type="primary" onClick={handleNext}>
              下一步
            </Button>
          </View>
        )}
        {taskStep === "scene" && (
          <View className="button-group">
            <Button className="button" onClick={handlePrev}>
              上一步
            </Button>
            <Button className="button" type="primary" onClick={handleNext}>
              生成
            </Button>
          </View>
        )}
        {taskStep === "failed" && (
          <>
            <View className="failed-tip">
              图片正在排队生成中，请稍后去 "我的图库" 查看。
            </View>
            <View className="button-group">
              <Button className="button" onClick={handleReStart}>
                再次创作
              </Button>
            </View>
          </>
        )}
        {(taskStep === "result" || taskStep === "complete") &&
          (isComplete ? (
            <View className="button-group">
              <Button className="button" onClick={handleReStart}>
                再次创作
              </Button>
              <Button className="button" type="primary" onClick={handleSave}>
                保存当前图片
              </Button>
            </View>
          ) : (
              <></>
            ))}
      </View>
    </View>
  );
}

export default Index;
