import Taro from "@tarojs/taro";

interface IRequestParams {
  url: string,
  method: 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT',
  data: Object,
}

export interface ISuccessResponse<T> {
  data: T
}

export interface IErrorResponse {
  errorMessage: string
}

interface ILoginResponse {
  data: {
    jwt: string
  }
}

/**
 * @description 自动通过微信登录并换取服务端jwt
 */
const login = () => new Promise((resolve, reject) => {
  Taro.login({
    success: res => {
      Taro.request({
        url: 'http://localhost:3000/user/sessions',
        method: 'POST',
        data: {
          code: res.code
        },
        success: ({ data }) => {
          const response = data as ILoginResponse;
          Taro.setStorageSync('harvest:jwt', response.data.jwt);
          resolve(response.data.jwt);
        },
        fail: reject
      })
    }
  });
})

/**
 * @description 请求前置
 * 1. 如果请求时无token，自动拉取token并携带token
 */
Taro.addInterceptor(function (chain) {
  const requestParams = chain.requestParams
  requestParams.header = {
    ...requestParams.header,
    'access-token': Taro.getStorageSync('harvest:jwt')
  }

  return chain.proceed(requestParams)
    .then(async res => {
      if (res.statusCode === 401) {
        await login();
        requestParams.header = {
          ...requestParams.header,
          'access-token': Taro.getStorageSync('harvest:jwt')
        }
        return chain.proceed(requestParams);
      } else {
        return res.data;
      }
    });
})

const request: <T>(params: IRequestParams) => Promise<ISuccessResponse<T>> = params => {
  return new Promise((resolve, reject) => {
    Taro.request({
      url: params.url,
      method: params.method,
      data: params.data,
      // success: <T>(res: ISuccessResponse<T> | IErrorResponse ) => void,
      // success: (res: Taro.request.SuccessCallbackResult<ISuccessResponse<any>>) => {
      //   if () {

      //   } else {
      //     // resolve(res.data);
      //   }
      // },
      fail: reject
    })
  });
}

export default request;
