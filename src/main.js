/*
 * @Author: Hzh
 * @Date: 2020-09-14 09:38:49
 * @LastEditTime: 2020-09-14 17:49:40
 * @LastEditors: Hzh
 * @Description:全局函数入口
 */
import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // 重置css样式

import Element from 'element-ui'
//
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

// 数据字典
import dict from './components/Dict'

import permission from './directive/permission' // 权限指令

import './assets/styles/element-variables.scss'

import './assets/styles/index.scss' // 全局scss

import VueHighlightJS from 'vue-highlightjs' // 代码高亮
import 'highlight.js/styles/atom-one-dark.css'

import { localData, sessionData } from '@/utils/storage.js' // 浏览器存储工具函数

import * as filters from './filters' // 全局过滤器

import App from './App'
import store from './store'
import router from './router/routers' // 引入路由

import './assets/icons' // icon

import './router/index' // 权限控制
import 'echarts-gl'

Vue.use(VueHighlightJS)
Vue.use(mavonEditor)
Vue.use(permission)
Vue.use(dict)
Vue.use(Element, {
  size: Cookies.get('size') || 'small' // set element-ui default size
})

// 全局过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

Vue.prototype.$localData = localData

Vue.prototype.$sessionData = sessionData

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
