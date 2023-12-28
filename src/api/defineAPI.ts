import Taro, { } from "@tarojs/taro";
import {baseUrl} from '../config';

export interface CustomRequest<T = unknown> {
  data: T;
  rawResponse?: boolean;
  catchError?: boolean;
  showLoading?: boolean | string | null;
  headers?: {
    [key: string]: string;
  };
}

export interface CustomResponse<T = unknown> {
  data: T;
  code: number;
  msg: string;
}

const defaultHeaders = {
  'Content-Type': 'application/json',
}

function defineAPI<Response = unknown, Request = unknown>(
  path: string,
): (req?: CustomRequest<Request>) => Promise<Response> {
  const info = path.split(' ');
  // eslint-disable-next-line eqeqeq
  if (info.length != 2) {
    throw new Error('path need with method and url');
  }
  const method = info[0].toUpperCase() as keyof Taro.request.Method;
  const url = info[1];

  return async (req?: CustomRequest<Request>): Promise<Response> => {
    if (req == null) {
      req = {} as CustomRequest<Request>
    }
    const {
      data,
      headers = {},
      showLoading = false,
      // catchError = true,
      // loading = true,
      ...others
    } = req;

    const reqConfig: Taro.request.Option = {
      url: `${baseUrl}${url}`,
      method,
      data,
      header: {
        ...defaultHeaders,
        ...headers,
      },
      credentials: 'include',
    }

    return Taro.request(reqConfig).then((res) => {
      if (res.statusCode === 200) {
        return res.data.data;
      }
      return res.data;
    })
  }
}

export default defineAPI;