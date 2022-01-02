import Taro from "@tarojs/taro";

Taro.addInterceptor(function (chain) {
  const requestParams = chain.requestParams
  const { method, data, url } = requestParams

  console.log(`http ${method || 'GET'} --> ${url} data: `, data)

  if (!Taro.getStorageSync('harvest:jwt') && !(url === 'http://localhost:3000/user/sessions')) {
    Taro.login({
      success: res => {
        Taro.request({
          url: 'http://localhost:3000/user/sessions',
          method: 'POST',
          data: {
            code: res.code
          },
          success: (res) => {
            Taro.setStorageSync('harvest:jwt', res.data.data.jwt);
          }
        })
      }
    });
  }

  return chain.proceed(requestParams)
    .then(res => {
      console.log(`http <-- ${url} result:`, res)
      return res
    })
})

const httpServer = (options) => {
  return Taro.request(options);
}

export default httpServer;