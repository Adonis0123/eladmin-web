
import { login, getInfo, logout } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router/routers'

const user = {
  state: {
    token: getToken(), // 刷新之后获取Token
    user: {},
    roles: [],
    loadMenus: false // 第一次加载菜单时用到
  },

  mutations: {
    /* 设置TOKEN */
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    /* 设置用户信息 */
    SET_USER: (state, user) => {
      state.user = user
    },
    /* 设置权限 */
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    /* 设置是否加载菜单 */
    SET_LOAD_MENUS: (state, loadMenus) => {
      state.loadMenus = loadMenus
    }
  },

  actions: {
    /**
     * @description: 登录
     * @param {Object} userInfo
     */
    Login({ commit }, userInfo) {
      const rememberMe = userInfo.rememberMe
      return new Promise((resolve, reject) => {
        login(userInfo.username, userInfo.password, userInfo.code, userInfo.uuid).then(res => {
          setToken(res.token, rememberMe)
          commit('SET_TOKEN', res.token)
          setUserInfo(res.user, commit) // 获取用户信息与权限
          commit('SET_LOAD_MENUS', true) // 第一次加载菜单时用到， 具体见 router 目录下的 index.js
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    /**
     * @description: 获取用户信息
     */
    GetInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(res => {
          setUserInfo(res, commit)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    /**
     * @description: 登出
     */
    LogOut({ commit, dispatch }) {
      return new Promise((resolve, reject) => {
        logout().then(res => {
          logOut(commit, dispatch)
          resolve()
        }).catch(error => {
          logOut(commit, dispatch)
          reject(error)
        })
      })
    },

    /**
     * @description: 第二次拉取菜单（非登录时获取）
     */
    updateLoadMenus({ commit }) {
      return new Promise((resolve, reject) => {
        commit('SET_LOAD_MENUS', false)
      })
    }
  }
}

/* 退出登录 */
export const logOut = (commit, dispatch) => {
  commit('SET_TOKEN', '')
  commit('SET_ROLES', [])

  removeToken() // 移除Token

  resetRouter()// 重置路由

  /**
    * 退出时重置访问的视图和缓存的视图 to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
    * 直接在模块中commit('mutation')/dispatch('action')，默认提交/分发的是模块中的mutation/action
    * 想要调用全局，需要在之后加上{root:true}
    */
  dispatch('tagsView/delAllViews', null, { root: true })
}

/* 获取用户权限 */
export const setUserInfo = (res, commit) => {
  // 如果没有任何权限，则赋予一个默认的权限，避免请求死循环
  if (res.roles.length === 0) {
    commit('SET_ROLES', ['ROLE_SYSTEM_DEFAULT'])
  } else {
    commit('SET_ROLES', res.roles)
  }
  commit('SET_USER', res.user)

  // commit('SET_ROLES', res.data.roles) uduhs-admin
  // commit('SET_USER', res.data)
}

export default user
