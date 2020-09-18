
/*
 * @Author: Hzh
 * @Date: 2020-08-17 10:08:49
 * @LastEditTime: 2020-09-18 17:55:26
 * @LastEditors: Hzh
 * @Description:
 */
const state = {
  menuList: [],
  rootPath: ''
}

const mutations = {

  /* 设置侧边栏数据 */
  SET_MENULIST: (state, menuList) => {
    state.menuList = menuList
  },

  /* 设置一级菜单的路由 */
  SET_ROOTPATH: (state, path) => {
    state.rootPath = path
  }

}

const actions = {
  /**
   * @description: 设置侧边栏的菜单的数据
   * @param {Array} menuList 菜单数据
   */
  setSiderbarList({ commit }, menuList) {
    commit('SET_MENULIST', menuList)
  },
  /**
   * @description: 设置一级菜单的路由
   * @param {String} path
   */
  setRootPath({ commit }, path) {
    commit('SET_ROOTPATH', path)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
