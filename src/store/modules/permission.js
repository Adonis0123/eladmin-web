/*
 * @Author: Hzh
 * @Date: 2020-09-14 09:38:49
 * @LastEditTime: 2020-09-14 13:27:31
 * @LastEditors: Hzh
 * @Description:注册路由
 */
import { constantRouterMap } from '@/router/routers'

const permission = {
  state: {
    routers: constantRouterMap, // 所有路由
    addRouters: [] // 异步路由
  },
  mutations: {
    /* 添加异步路由  */
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    /**
     * @description: 添加异步路由
     * @param {Array} asyncRouter 路由路由
     */
    GenerateRoutes({ commit }, asyncRouter) {
      commit('SET_ROUTERS', asyncRouter)
    }
  }
}

export default permission
