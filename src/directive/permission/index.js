/*
 * @Author: Hzh
 * @Date: 2020-09-14 11:00:54
 * @LastEditTime: 2020-09-14 11:07:01
 * @LastEditors: Hzh
 * @Description: 权限指令
 */
import permission from './permission'

const install = function(Vue) {
  Vue.directive('permission', permission)
}

if (window.Vue) {
  window['permission'] = permission
  Vue.use(install) // eslint-disable-line
}

permission.install = install
export default permission
