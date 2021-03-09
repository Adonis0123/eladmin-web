/*
 * @Author: Hzh
 * @Date: 2020-09-04 10:57:09
 * @LastEditTime: 2021-03-09 09:36:56
 * @LastEditors: Hzh
 * @Description:
 */

function hide(el, binding) {
  const { value } = binding
  if (value) {
    el.style.visibility = 'hidden'
  } else {
    el.style.visibility = 'visible'
  }
}

export default {
  bind(el, binding) {
    hide(el, binding)
  },
  componentUpdated(el, binding) {
    hide(el, binding)
  }
}
