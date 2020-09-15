import axios from 'axios'
import router from '@/router/routers'
import { Notification } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'
import Config from '@/settings'
import Cookies from 'js-cookie'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? process.env.VUE_APP_BASE_API : '/', // api 的 base_url
  timeout: Config.timeout // 设置请求超时的时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    // do something 在请求发送前
    if (getToken()) {
      /**
       * 让每个请求携带token
       * ['Authorization']为自定义key 请根据实际情况自行修改
       */
      config.headers['Authorization'] = getToken()
    }
    config.headers['Content-Type'] = 'application/json'
    return config
  },
  error => {
    // do something 发送请求失败的话
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  /**
   * 如果您想获取http信息，如头或状态
   * 那么设置 return  response => response
  */

  /**
   * 通过自定义代码确定请求状态
   * 下面只是一个例子
   * 你也可以通过 response.data.code 来判断
   */
  response => {
    const code = response.status
    if (code < 200 || code > 300) {
      Notification.error({
        title: response.message
      })
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    let code = 0
    try {
      code = error.response.data.status
    } catch (e) {
      if (error.toString().indexOf('Error: timeout') !== -1) {
        Notification.error({
          title: '网络请求超时',
          duration: 5000
        })
        return Promise.reject(error)
      }
    }
    if (code) {
      if (code === 401) {
        store.dispatch('LogOut').then(() => {
          // 用户登录界面提示
          Cookies.set('point', 401)
          location.reload()
        })
      } else if (code === 403) {
        router.push({ path: '/401' })
      } else {
        const errorMsg = error.response.data.message
        if (errorMsg !== undefined) {
          Notification.error({
            title: errorMsg,
            duration: 5000
          })
        }
      }
    } else {
      Notification.error({
        title: '接口请求失败',
        duration: 5000
      })
    }
    return Promise.reject(error)
  }
)
export default service
