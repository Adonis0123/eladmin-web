/*
 * @Author: Hzh
 * @Date: 2020-09-14 09:38:49
 * @LastEditTime: 2020-09-14 18:00:20
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
  'name': 'Mnt',
  'path': '/mnt',
  'hidden': false,
  'redirect': 'noredirect',
  'component': 'Layout',
  'alwaysShow': true,
  'meta': {
    'title': '运维管理',
    'icon': 'mnt',
    'noCache': true
  },
  'children': [{
    'name': 'ServerDeploy',
    'path': 'mnt/serverDeploy',
    'hidden': false,
    'component': 'mnt/server/index',
    'meta': {
      'title': '服务器',
      'icon': 'server',
      'noCache': true
    }
  }, {
    'name': 'App',
    'path': 'mnt/app',
    'hidden': false,
    'component': 'mnt/app/index',
    'meta': {
      'title': '应用管理',
      'icon': 'app',
      'noCache': true
    }
  }, {
    'name': 'Deploy',
    'path': 'mnt/deploy',
    'hidden': false,
    'component': 'mnt/deploy/index',
    'meta': {
      'title': '部署管理',
      'icon': 'deploy',
      'noCache': true
    }
  }, {
    'name': 'DeployHistory',
    'path': 'mnt/deployHistory',
    'hidden': false,
    'component': 'mnt/deployHistory/index',
    'meta': {
      'title': '部署备份',
      'icon': 'backup',
      'noCache': true
    }
  }, {
    'name': 'Database',
    'path': 'mnt/database',
    'hidden': false,
    'component': 'mnt/database/index',
    'meta': {
      'title': '数据库管理',
      'icon': 'database',
      'noCache': true
    }
  }]
}, {
  'name': '系统工具',
  'path': '/sys-tools',
  'hidden': false,
  'redirect': 'noredirect',
  'component': 'Layout',
  'alwaysShow': true,
  'meta': {
    'title': '系统工具',
    'icon': 'sys-tools',
    'noCache': true
  },
  'children': [{
    'name': 'GeneratorIndex',
    'path': 'generator',
    'hidden': false,
    'component': 'generator/index',
    'meta': {
      'title': '代码生成',
      'icon': 'dev',
      'noCache': false
    }
  }, {
    'name': 'GeneratorConfig',
    'path': 'generator/config/:tableName',
    'hidden': true,
    'component': 'generator/config',
    'meta': {
      'title': '生成配置',
      'icon': 'dev',
      'noCache': false
    }
  }, {
    'name': 'Pictures',
    'path': 'pictures',
    'hidden': false,
    'component': 'tools/picture/index',
    'meta': {
      'title': '图床管理',
      'icon': 'image',
      'noCache': true
    }
  }, {
    'name': 'Storage',
    'path': 'storage',
    'hidden': false,
    'component': 'tools/storage/index',
    'meta': {
      'title': '存储管理',
      'icon': 'qiniu',
      'noCache': true
    }
  }, {
    'name': 'Email',
    'path': 'email',
    'hidden': false,
    'component': 'tools/email/index',
    'meta': {
      'title': '邮件工具',
      'icon': 'email',
      'noCache': true
    }
  }, {
    'name': 'Swagger',
    'path': 'swagger2',
    'hidden': false,
    'component': 'tools/swagger/index',
    'meta': {
      'title': '接口文档',
      'icon': 'swagger',
      'noCache': true
    }
  }, {
    'name': 'AliPay',
    'path': 'aliPay',
    'hidden': false,
    'component': 'tools/aliPay/index',
    'meta': {
      'title': '支付宝工具',
      'icon': 'alipay',
      'noCache': true
    }
  }, {
    'name': 'Preview',
    'path': 'generator/preview/:tableName',
    'hidden': true,
    'component': 'generator/preview',
    'meta': {
      'title': '生成预览',
      'icon': 'java',
      'noCache': false
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
}, {
  'name': '多级菜单',
  'path': '/nested',
  'hidden': false,
  'redirect': 'noredirect',
  'component': 'Layout',
  'alwaysShow': true,
  'meta': {
    'title': '多级菜单',
    'icon': 'menu',
    'noCache': true
  },
  'children': [{
    'name': '二级菜单1',
    'path': 'menu1',
    'hidden': false,
    'redirect': 'noredirect',
    'component': 'nested/menu1/index',
    'alwaysShow': true,
    'meta': {
      'title': '二级菜单1',
      'icon': 'menu',
      'noCache': true
    },
    'children': [{
      'name': '三级菜单2',
      'path': 'menu1-2',
      'hidden': false,
      'component': 'nested/menu1/menu1-2',
      'meta': {
        'title': '三级菜单2',
        'icon': 'menu',
        'noCache': true
      }
    }, {
      'name': '三级菜单1',
      'path': 'menu1-1',
      'hidden': false,
      'component': 'nested/menu1/menu1-1',
      'meta': {
        'title': '三级菜单1',
        'icon': 'menu',
        'noCache': true
      }
    }]
  }, {
    'name': '二级菜单2',
    'path': 'menu2',
    'hidden': false,
    'component': 'nested/menu2/index',
    'meta': {
      'title': '二级菜单2',
      'icon': 'menu',
      'noCache': true
    }
  }]
}]
