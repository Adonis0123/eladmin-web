/*
 * @Author: Hzh
 * @Date: 2020-09-14 09:38:49
 * @LastEditTime: 2020-09-14 10:22:13
 * @LastEditors: Hzh
 * @Description:控制侧边栏
 */

import Cookies from 'js-cookie'

const state = {
  sidebar: {
    /**
     * +Cookies.get('sidebarStatus') 把字符串转换为数字。
     * !+Cookies.get('sidebarStatus') 逻辑非运算，当数字为 0 或者 NaN 时返回 true。
     * !!+Cookies.get('sidebarStatus') 数字为 0 或者 NaN 时返回 false
     * false 侧边栏关闭，true侧边栏打开
     */
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false // 侧边栏菜单收起是否展示动画效果
  },
  device: 'desktop', // pc还是mobile端
  size: Cookies.get('size') || 'small' // 布局设置
}

const mutations = {
  /**
   * @description: 控制侧边栏打开或者关闭
   */
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },

  /**
   * @description: 关闭侧边栏
   * @param {Boolean} withoutAnimation
   * 路由变化时且当前是移动端，则需要动画效果，初始化页面以及屏幕尺寸变化时且为移动端则不需要动画效果
   */
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },

  /**
   * @description: 更改当前是mobile还是pc的标识
   */
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },

  /**
   * @description: 设置element ui组件的大小
   */
  SET_SIZE: (state, size) => {
    state.size = size
    Cookies.set('size', size)
  }
}

const actions = {
  /**
   * @description: 控制侧边栏打开或者关闭
   */
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },

  /**
   * @description: 关闭侧边栏
   */
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },

  /**
   * @description: 更改当前是mobile还是pc的标识
   */
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },

  /**
   * @description: 设置element ui组件的大小
   */
  setSize({ commit }, size) {
    commit('SET_SIZE', size)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
