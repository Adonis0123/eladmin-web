/*
 * @Author: Hzh
 * @Date: 2020-09-04 10:57:09
 * @LastEditTime: 2020-09-24 17:50:29
 * @LastEditors: Hzh
 * @Description:提示指令
 */
import tip from './tip'

const install = function(Vue) {
  Vue.directive('tip', tip)
}

if (window.Vue) {
  window['tip'] = tip
  Vue.use(install); // eslint-disable-line
}

tip.install = install

export default tip

