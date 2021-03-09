/*
 * @Author: Hzh
 * @Date: 2020-09-04 10:57:09
 * @LastEditTime: 2020-09-04 11:40:16
 * @LastEditors: Hzh
 * @Description:隐藏元素，会占位
 */
import visibility from './visibility'

const install = function(Vue) {
  Vue.directive('visibility', visibility)
}

if (window.Vue) {
  window['visibility'] = visibility
  Vue.use(install); // eslint-disable-line
}

visibility.install = install

export default visibility

