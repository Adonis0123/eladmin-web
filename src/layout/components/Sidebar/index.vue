<!--
 * @Author: Hzh
 * @Date: 2020-07-22 18:16:18
 * @LastEditTime: 2020-09-18 18:09:11
 * @LastEditors: Hzh
 * @Description:侧边栏
-->
<template>
  <div :class="{'has-logo':menuSearch}">
    <sidebar-header v-if="menuSearch" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        ref="elMenu"
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
          v-for="route in menuList"
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
import SidebarHeader from './SidebarHeader'
import SidebarItem from './SidebarItem'
import variables from '@/assets/styles/variables.scss'

export default {
  components: { SidebarItem, SidebarHeader },
  data() {
    return {
      activeMenu: ''
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'menuList']),

    /**
     * @description: 展示侧边栏的菜单搜索
     */
    menuSearch() {
      return this.$store.state.settings.menuSearch
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
  },

  watch: {
    /**
     * @description: 侧边栏高亮
     */
    $route: {
      handler: function(newVal, oldVal) {
        const { meta, path } = newVal
        this.activeMenu = meta.activeMenu ? meta.activeMenu : path
        this.$nextTick(() => {
          this.$refs.elMenu.activeIndex = this.activeMenu // 修改左侧菜单不高亮的bug
        })
      },
      immediate: true
    }
  }

}
</script>
