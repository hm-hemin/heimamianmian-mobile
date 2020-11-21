// 封装请求拦截与响应拦截
// 导入axios
import axios from 'axios'
import { Toast } from 'vant' // toast === this.$toast
import { removeLocal, getLocal } from '@/utils/local.js'
import router from '@/router'
import store from '@/store'
// Vue.prototype.$axios = axios
// axios.defaults.baseURL = process.env.VUE_APP_URL
// 创建一个axios副本（修改默认的一些配置的axios）
const _fetch = axios.create({
  baseURL: process.env.VUE_APP_URL
})
// 请求拦截
_fetch.interceptors.request.use(
  function (config) {
    // 我要求使用token 你才传我不用你别传 传了我就报错
    window.console.log('config', config)
    // 通过config识别到needToken为true则加入token请求头
    if (config.needToken) {
      config.headers.authorization = `Bearer ${getLocal('token')}`
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)
// 响应拦截
_fetch.interceptors.response.use(
  function (res) {
    //     window.console.log('验证响应拦截', res)
    if (res.data.code === 200) {
      // 200时正常返回
      return res
      // ******不需要执行错误处理****
    } else if (res.config.noError) {
      // 删除token  中止.then执行
      removeLocal('token')
      return Promise.reject(new Error('不需要处理错误的调用'))
    } else if (res.data.code === 401 || res.data.code === 403) {
      // token异常
      /**
       * 1.删除token
       * 2.修改vuex中的isLogin为false
       * 3.跳转到登录页
       * 4.提示一下
       * 5.中止.then执行
       */
      removeLocal('token')
      store.commit('getLoginState', false)
      router.push('/login')
      Toast.fail(res.data.message)
      return Promise.reject(new ErrorEvent(res.data.message))
    } else {
      // 非200提示错误
      Toast.fail(res.data.message) // 需要导入Toast
      // 终止.then执行 直接跳转到.catch执行 reject（内部值）就是最终.catch的返回值
      return Promise.reject(new Error(res.data.message))
    }
  },
  function (error) {
    return Promise.reject(error)
  }
)
// 暴露出去
export default _fetch
