/*
 * @Author: Hzh
 * @Date: 2020-09-14 09:38:49
 * @LastEditTime: 2020-09-15 19:58:08
 * @LastEditors: Hzh
 * @Description: 判断用户权限生成异步路由
 */

import router from './routers.js'
import store from '@/store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
// import { getToken } from '@/utils/auth' // 从cookie获取token
import { buildMenus } from '@/api/system/menu'

import getPageTitle from '@/utils/get-page-title' // 页面标题

import Layout from '@/layout/index' // layout组件

NProgress.configure({ showSpinner: false }) // NProgress Configuration showSpinner 是否显示环形进度动画

// const whiteList = ['/login'] // 不需要登录就可以访问的页面

router.beforeEach(async(to, from, next) => {
  // 进度条开始
  NProgress.start()

  // 设置页面的标题
  document.title = getPageTitle(to.meta.title)

  /* 异步路由注册 */
  const hasAsyncRouters = store.getters.addRouters && store.getters.addRouters.length
  if (hasAsyncRouters) {
    next()
  } else {
    initAsyncRouters(next, to)
  }

  // // 判断用户是否已登录
  // const hasToken = getToken()

  // if (hasToken) {
  //   /* 如果已登录且跳转的页面是登录页，重定向到主页 */
  //   if (to.path === '/login') {
  //     next({ path: '/' })
  //     NProgress.done() // 进度条完成 hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
  //   } else {
  //     // 判断是否已获取用户权限
  //     const hasRoles = store.getters.roles && store.getters.roles.length

  //     /* 通过GetInfo获取用户信息 */
  //     if (!hasRoles) {
  //       try {
  //         await store.dispatch('GetInfo') // 获取user_info
  //         loadMenus(next, to) // 动态路由，拉取菜单
  //       } catch (error) {
  //         console.log(error)
  //         await store.dispatch('LogOut')
  //         next(`/login?redirect=${to.path}`)
  //         NProgress.done()
  //       }

  //       /* 登录的时候没有拉取菜单，在此处拉取 */
  //     } else if (store.getters.loadMenus) {
  //       // 修改成false，防止死循环
  //       await store.dispatch('updateLoadMenus')
  //       loadMenus(next, to) // 拉取菜单
  //     } else {
  //       next()
  //     }
  //   }
  // } else {
  //   /* 没有token*/
  //   if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
  //     next()
  //   } else {
  //     /**
  //      * 其他没有访问权限的页面将被重定向到登录页面
  //      * 登录成功之后将重定向到之前想跳转的页面
  //      */
  //     next(`/login?redirect=${to.fullPath}`)
  //     NProgress.done()
  //   }
  // }
})

router.afterEach(() => {
  NProgress.done() // 完成 progress bar 加载
})

/* 根据用户的路由表注册用户可见的菜单 */
export const loadMenus = async(next, to) => {
  const res = await buildMenus()
  const asyncRouter = filterAsyncRouter(res)
  asyncRouter.push({ path: '*', redirect: '/404', hidden: true })
  await store.dispatch('GenerateRoutes', asyncRouter)
  router.addRoutes(asyncRouter)
  next({ ...to, replace: true }) // hack方法，确保addRoutes已完成
}

/**
 * @description: 递归注册组件
 * @param {Array}  routers
 */
export const filterAsyncRouter = (routers) => { // 遍历后台传来的路由字符串，转换为组件对象
  return routers.filter(router => {
    if (router.component) {
      if (router.component === 'Layout') { // Layout组件特殊处理
        router.component = Layout
      } else {
        const component = router.component
        router.component = loadView(component)
      }
    }
    if (router.children && router.children.length) {
      router.children = filterAsyncRouter(router.children)
    }
    return true
  })
}

/**
 * @description: 懒加载组件
 * @param {String} view 组件的地址
 */
export const loadView = (view) => {
  return (resolve) => require([`@/views/${view}`], resolve)
}

/**
 * @description: 初始化异步路由（前端暂时写死数据）
 */

const initAsyncRouters = async(next, to) => {
  const asyncRouter = filterAsyncRouter(asyncRouterTable)
  asyncRouter.push({ path: '*', redirect: '/404', hidden: true })
  await store.dispatch('GenerateRoutes', asyncRouter)
  router.addRoutes(asyncRouter)
  next({ ...to, replace: true })
}

const asyncRouterTable = [{
  'name': '系统管理',
  'path': '/system',
  'hidden': false,
  'redirect': 'noredirect',
  'component': 'Layout',
  'alwaysShow': true,
  'meta': {
    'title': '系统管理',
    'icon': 'system',
    'noCache': true
  },
  'children': [{
    'name': 'User',
    'path': 'user',
    'hidden': false,
    'component': 'system/user/index',
    'meta': {
      'title': '用户管理',
      'icon': 'peoples',
      'noCache': true
    }
  }, {
    'name': 'Role',
    'path': 'role',
    'hidden': false,
    'component': 'system/role/index',
    'meta': {
      'title': '角色管理',
      'icon': 'role',
      'noCache': true
    }
  }, {
    'name': 'Menu',
    'path': 'menu',
    'hidden': false,
    'component': 'system/menu/index',
    'meta': {
      'title': '菜单管理',
      'icon': 'menu',
      'noCache': true
    }
  }, {
    'name': 'Dept',
    'path': 'dept',
    'hidden': false,
    'component': 'system/dept/index',
    'meta': {
      'title': '部门管理',
      'icon': 'dept',
      'noCache': true
    }
  }, {
    'name': 'Job',
    'path': 'job',
    'hidden': false,
    'component': 'system/job/index',
    'meta': {
      'title': '岗位管理',
      'icon': 'Steve-Jobs',
      'noCache': true
    }
  }, {
    'name': 'Dict',
    'path': 'dict',
    'hidden': false,
    'component': 'system/dict/index',
    'meta': {
      'title': '字典管理',
      'icon': 'dictionary',
      'noCache': true
    }
  }, {
    'name': 'Timing',
    'path': 'timing',
    'hidden': false,
    'component': 'system/timing/index',
    'meta': {
      'title': '任务调度',
      'icon': 'timing',
      'noCache': true
    }
  }]
}, {
  'name': '系统监控',
  'path': '/monitor',
  'hidden': false,
  'redirect': 'noredirect',
  'component': 'Layout',
  'alwaysShow': true,
  'meta': {
    'title': '系统监控',
    'icon': 'monitor',
    'noCache': true
  },
  'children': [{
    'name': 'OnlineUser',
    'path': 'online',
    'hidden': false,
    'component': 'monitor/online/index',
    'meta': {
      'title': '在线用户',
      'icon': 'Steve-Jobs',
      'noCache': true
    }
  }, {
    'name': 'Log',
    'path': 'logs',
    'hidden': false,
    'component': 'monitor/log/index',
    'meta': {
      'title': '操作日志',
      'icon': 'log',
      'noCache': true
    }
  }, {
    'name': 'ErrorLog',
    'path': 'errorLog',
    'hidden': false,
    'component': 'monitor/log/errorLog',
    'meta': {
      'title': '异常日志',
      'icon': 'error',
      'noCache': true
    }
  }, {
    'name': 'ServerMonitor',
    'path': 'server',
    'hidden': false,
    'component': 'monitor/server/index',
    'meta': {
      'title': '服务监控',
      'icon': 'codeConsole',
      'noCache': true
    }
  }, {
    'name': 'Sql',
    'path': 'druid',
    'hidden': false,
    'component': 'monitor/sql/index',
    'meta': {
      'title': 'SQL监控',
      'icon': 'sqlMonitor',
      'noCache': true
    }
  }]
}, {
  'name': '组件管理',
  'path': '/components',
  'hidden': false,
  'redirect': 'noredirect',
  'component': 'Layout',
  'alwaysShow': true,
  'meta': {
    'title': '组件管理',
    'icon': 'zujian',
    'noCache': true
  },
  'children': [{
    'name': 'Echarts',
    'path': 'echarts',
    'hidden': false,
    'component': 'components/Echarts',
    'meta': {
      'title': '图表库',
      'icon': 'chart',
      'noCache': false
    }
  }, {
    'name': 'Icons',
    'path': 'icon',
    'hidden': false,
    'component': 'components/icons/index',
    'meta': {
      'title': '图标库',
      'icon': 'icon',
      'noCache': true
    }
  }, {
    'name': 'Editor',
    'path': 'tinymce',
    'hidden': false,
    'component': 'components/Editor',
    'meta': {
      'title': '富文本',
      'icon': 'fwb',
      'noCache': true
    }
  }, {
    'name': 'Markdown',
    'path': 'markdown',
    'hidden': false,
    'component': 'components/MarkDown',
    'meta': {
      'title': 'Markdown',
      'icon': 'markdown',
      'noCache': true
    }
  }, {
    'name': 'YamlEdit',
    'path': 'yaml',
    'hidden': false,
    'component': 'components/YamlEdit',
    'meta': {
      'title': 'Yaml编辑器',
      'icon': 'dev',
      'noCache': true
    }
  }]
}]
