import defineAPI from "../defineAPI";

interface UploadFileResponse {
  url: string;
  tag: string;
  key: string;
  small: string;
}

export const uploadFile = defineAPI<UploadFileResponse, any>(
  "post /fileUploadAndDownload/upload"
)

// export const uploadFile = (fil)