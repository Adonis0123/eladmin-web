/*
 * @Author: Hzh
 * @Date: 2020-09-14 09:38:49
 * @LastEditTime: 2020-09-18 18:04:48
 * @LastEditors: Hzh
 * @Description:
 */

const getters = {
  size: state => state.app.size,
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  roles: state => state.user.roles,
  user: state => state.user.user,
  loadMenus: state => state.user.loadMenus,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  menuList: state => state.menu.menuList,
  baseApi: state => state.api.baseApi,
  updateAvatarApi: state => state.api.updateAvatarApi,
  theme: state => state.settings.theme
}
export default getters
