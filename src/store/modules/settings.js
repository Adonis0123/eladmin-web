/*
 * @Author: Hzh
 * @Date: 2020-09-14 09:38:49
 * @LastEditTime: 2020-09-16 11:24:13
 * @LastEditors: Hzh
 * @Description:系统设置vuex
 */
import variables from '@/assets/styles/element-variables.scss'
import defaultSettings from '@/settings'
const { tagsView, fixedHeader, sidebarLogo, uniqueOpened, showFooter, footerTxt, caseNumber } = defaultSettings

const state = {
  theme: variables.theme, // 主题颜色
  showSettings: false, // 显示设置
  tagsView: tagsView, // 显示标签
  fixedHeader: fixedHeader, // 固定头部
  sidebarLogo: sidebarLogo, // 侧边栏Logo
  uniqueOpened: uniqueOpened, // 保持一个菜单展开
  showFooter: showFooter, // 显示底部
  footerTxt: footerTxt, // 底部文字
  caseNumber: caseNumber // 备案号
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

