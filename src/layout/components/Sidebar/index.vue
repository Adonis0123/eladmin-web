<!--
 * @Author: Hzh
 * @Date: 2020-07-22 18:16:18
 * @LastEditTime: 2020-09-15 09:38:52
 * @LastEditors: Hzh
 * @Description:侧边栏
-->
<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="uniqueOpened"
        :active-text-color="themeColor"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in permission_routers"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/assets/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters(['permission_routers', 'sidebar']),

    /**
     * @description: 侧边栏高亮
     */
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // 如果设置了这一属性，那么侧边栏高亮的地方将指向你设置的地址
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },

    /**
     * @description: 展示侧边栏的logo
     */
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },

    /**
     * @description: 是否只保持一个子菜单的展开
     */
    uniqueOpened() {
      return this.$store.state.settings.uniqueOpened
    },

    /**
     * @description: 设置侧边栏的样式
     */
    variables() {
      return variables
    },

    /**
     * @description: 水平折叠收起菜单
     * 菜单展开,则isCollapse因为false,反之。
     */
    isCollapse() {
      return !this.sidebar.opened
    },

    /**
     * @description: 主题颜色
     */
    themeColor() {
      return this.$store.state.settings.theme
    }
  }
}
</script>
