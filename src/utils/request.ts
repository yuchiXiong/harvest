import Taro from "@tarojs/taro";

/**
 * @description 通用请求参数数据结构
 */
interface IRequestParams {
  url: string,
  method: 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT',
  data: Object,
}

/**
 * @description 通用响应结构，当接口请求成功时，包含data属性，反之包含errorMessage属性
 */
export interface IResponse<T> {
  data: T;
  errorMessage: string;
}

/**
 * @description Login接口的响应数据结构
 */
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
 * 2. 当接口返回401时，自动进行登录（当前小程序用户不会出现登录以后依然401的情况
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
        return res;
      }
    });
})

/**
 * @description 通用请求实例
 * @param {IRequestParams} params - 通用请求参数
 * @returns {Promise<T>}
 * 
 * @example
 *   request({ 
 *     url: 'xxx', 
 *     method: 'GET', 
 *     data: {}
 *   }).then(res => { 
 *     console.log('接口数据', res) 
 *   }, err => { 
 *     console.log('错误信息', err) 
 *   });
 */
const request: <T>(params: IRequestParams) => Promise<T> = params => {
  return new Promise((resolve, reject) => {
    Taro.request({
      url: params.url,
      method: params.method,
      data: params.data,
      success: (res: Taro.request.SuccessCallbackResult<IResponse<any>>) => {
        if (res.data.errorMessage) {
          reject(res.data.errorMessage);
        } else {
          resolve(res.data.data);
        }
      },
      fail: reject
    })
  });
}


export default request;
