<!--
 * @Author: Hzh
 * @Date: 2020-08-17 09:44:27
 * @LastEditTime: 2020-09-18 17:54:02
 * @LastEditors: Hzh
 * @Description:一级菜单导航
-->
<template>
  <div class="nav-menu-container">
    <!-- <better-scroll
      ref="scrollPane"
      :data="routes"
      :scroll-x="true"
      :scroll-y="false"
      class="el-menu-wrapper"
    > -->
    <el-menu
      ref="elMenu"
      class="el-menu-content"
      :default-active="activeMenu.path"
      active-text-color="#fff"
      mode="horizontal"
    >
      <el-menu-item
        v-for="(route,index) in routes"
        :key="index"
        :index="route.path"
        @click="handleSelectMenu(route)"
      >{{ route | filterFirstMenuTitle }}</el-menu-item>
    </el-menu>
    <!-- </better-scroll> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { isExternal } from '@/utils/validate'
// import BetterScroll from './BetterScroll'
import path from 'path'
export default {
  name: 'MenuContainer',

  components: { },

  props: {},

  data() {
    return {
      activeMenu: {}, // 当前高亮的一级菜单
      linkToRootPath: '' // 一级路由的根路由
    }
  },

  computed: {
    ...mapGetters(['permission_routers', 'device', 'theme']),
    // 左侧菜单的数据
    menuList: {
      get() {
        return this.$store.state.menu.menuList
      },
      set(routes) {
        this.$store.dispatch('menu/setSiderbarList', routes)
      }
    },
    routes() {
      return this.permission_routers.filter((item) => !item.hidden)
    }
  },

  watch: {
    $route: {
      handler: function(newVal, oldVal) {
        this.handleSiderbarMenuList()
        this.changeActiveMenuColor()
      },
      immediate: true
    },
    routes: {
      handler: function(newVal, oldVal) {
        this.handleSiderbarMenuList()
      }
    },
    device: {
      handler: function(newVal, oldVal) {
        this.handleSiderbarMenuList()
      }
    },
    theme: {
      handler: function(newVal, oldVal) {
        this.changeActiveMenuColor()
      }
    }
  },

  created() {},

  mounted() {},

  methods: {
    /**
     * @description: 获取侧边菜单栏的数据，移动端下，隐藏一级菜单，侧边栏菜单显示所有菜单
     */
    handleSiderbarMenuList() {
      if (this.device !== 'mobile') {
        this.matchActiveMenu(this.routes)
      } else {
        this.menuList = this.routes
      }
    },

    /**
     * @description: 遍历当前路由属于的菜单
     * @param {Array} routes 所有的菜单路由
     * $route.matched：一个数组，包含当前路由的所有嵌套路径片段的路由记录
     */
    matchActiveMenu(routes) {
      for (const router of routes) {
        // 判断是否首页
        if (this.$route.matched[0].path === '') {
          this.activeMenu = routes[0]
          this.menuList = routes[0].children
          this.$store.dispatch('menu/setRootPath', routes[0].path)
          break
        } else if (this.$route.matched[0].path === router.path) {
          this.activeMenu = router
          this.menuList = router.children
          this.$store.dispatch('menu/setRootPath', router.path)
          break
        }
      }
    },

    /**
     * @description: 点击一级菜单
     * @param {Object} route 当前点击的菜单
     */
    handleSelectMenu(route) {
      // const [{ $el }] = this.$refs.elMenu.$children.filter(item => item.index === route.path)
      // this.$refs.scrollPane.scrollToElement($el, 350, true)
      this.linkToRootPath = route.path
      this.linkToFirstPage(route)
    },

    /**
     * @description: 跳转页面选中菜单下第一个页面
     * @param {Object}  activeMenu 选中的菜单
     */
    linkToFirstPage(activeMenu, basePath = '') {
      const linkToPath = path.resolve(
        this.linkToRootPath,
        basePath,
        activeMenu.path
      )
      if (!activeMenu.children) {
        if (isExternal(activeMenu.path)) {
          window.location.href = activeMenu.path
        } else {
          this.$router.push(linkToPath) // this.$router.push({ name: activeMenu.name })
        }
      } else if (activeMenu.children && activeMenu.children.length) {
        this.linkToFirstPage(activeMenu.children[0], activeMenu.path)
      }
    },

    /**
     * @description: 激活的背景颜色
     */
    changeActiveMenuColor() {
      this.$nextTick(() => {
        const menuChild = this.$refs.elMenu.$el.children
        for (const item of menuChild) {
          if (item.className.indexOf('is-active') !== -1) {
            item.style.background = this.theme
          } else {
            item.style.background = '#fff'
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.nav-menu-container {
  height: 100%;
  width: 100%;
  .el-menu-wrapper {
    width: 100%;
  }
  .el-menu {
    display: inline-block;
    white-space: nowrap;
    &-item {
      display: inline-block;

      float: none;
      height: 50px;
      line-height: 50px;
      user-select: none;
      &.is-active {
        border: 0;
      }
    }
  }
}
</style>
