/*
 * @Author: Hzh
 * @Date: 2020-09-24 16:50:22
 * @LastEditTime: 2021-03-11 16:06:40
 * @LastEditors: Hzh
 * @Description:tip指令
 */
import Loading from './components/loading.vue'
import Error from './components/error.vue'
import Empty from './components/empty.vue'
// import TableEmpty from './components/tableEmpty.vue'
import Vue from 'vue'
import './tip.css'

// 根据绑定值创建提示信息
const createTip = type => {
  const LoadingComponent = Vue.extend(Loading)
  const loading = new LoadingComponent().$mount().$el // 文档外渲染组件

  const ErrorComponent = Vue.extend(Error)
  const error = new ErrorComponent().$mount().$el

  const EmptyComponent = Vue.extend(Empty)
  const empty = new EmptyComponent().$mount().$el

  // const TableEmptyComponent = Vue.extend(TableEmpty)
  // const tableEmpty = new TableEmptyComponent().$mount().$el

  const tip = document.createElement('div')
  tip.className = 'v-tip'
  switch (type) {
    case 'loading':
      tip.appendChild(loading)
      break
    case 'error':
      tip.appendChild(error)
      break
    case 'empty':
      tip.appendChild(empty)
      break
    // case 'tableEmpty':
    //   tip.appendChild(tableEmpty)
    //   break
    default:
      break
  }
  return tip
}

/**
 * 往绑定节点上插入不同内容（loading|error|empty）
 */
export default {
  name: 'tip',
  bind: (el, binding) => {
    if (el.style.position !== 'relative' && el.style.position !== 'absolute') {
      el.style.position = 'relative'
    }
    const tip = createTip(binding.value)
    el.tipElement = tip
    if (binding.value) {
      el.appendChild(el.tipElement)
    }
  },
  update: (el, binding) => {
    if (el === el.tipElement.parentNode) {
      // 移除旧的提示
      el.removeChild(el.tipElement)
    }
    // 根据绑定值创建新的提示信息
    const newTip = createTip(binding.value)
    el.tipElement = newTip
    if (binding.value) {
      el.appendChild(el.tipElement)
    }
  },
  unbind: el => {
    if (el.tipElement.parentNode === el) {
      el.removeChild(el.tipElement)
    }
    el.tipElement = null
  }
}

