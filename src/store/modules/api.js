/*
 * @Author: Hzh
 * @Date: 2020-09-14 09:38:49
 * @LastEditTime: 2020-09-16 11:21:45
 * @LastEditors: Hzh
 * @Description: api vuex
 */
const baseUrl = process.env.VUE_APP_BASE_API
const api = {
  state: {
    // 修改头像
    updateAvatarApi: baseUrl + '/api/users/updateAvatar',
    // // 部署包上传
    // deployUploadApi: baseUrl + '/api/deploy/upload',
    // // SQL脚本上传
    // databaseUploadApi: baseUrl + '/api/database/upload',
    // // 实时控制台
    // socketApi: baseUrl + '/websocket?token=kl',
    // // 图片上传
    // imagesUploadApi: baseUrl + '/api/localStorage/pictures',
    // // 文件上传
    // fileUploadApi: baseUrl + '/api/localStorage',
    // baseUrl，
    baseApi: baseUrl
  }
}

export default api
