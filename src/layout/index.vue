<template>
  <el-scrollbar class="app-wrapper-scroll">
    <div :class="classObj" class="app-wrapper">
      <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
      <sidebar class="sidebar-container" />
      <div :class="{hasTagsView:needTagsView}" class="main-container">
        <div :class="{'fixed-header':fixedHeader}">
          <navbar />
          <tags-view v-if="needTagsView" />
        </div>
        <app-main />
        <right-panel v-if="showSettings">
          <settings />
        </right-panel>
      </div>
      <!--  防止刷新后主题丢失  -->
      <theme v-show="false" ref="theme" />
    </div>
  </el-scrollbar>
</template>

<script>
import RightPanel from '@/components/RightPanel'
import { AppMain, Navbar, Settings, Sidebar, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState } from 'vuex'
import Theme from '@/components/ThemePicker'
import Cookies from 'js-cookie'
export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    RightPanel,
    Settings,
    Sidebar,
    TagsView,
    Theme
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      sidebar: (state) => state.app.sidebar,
      device: (state) => state.app.device,
      showSettings: (state) => state.settings.showSettings,
      needTagsView: (state) => state.settings.tagsView,
      fixedHeader: (state) => state.settings.fixedHeader
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  // watch: {
  //   theme: {
  //     handler: function(newVal) {
  //       this.setThemeColor()
  //     },
  //     immediate: true
  //   }
  // },
  mounted() {
    this.setThemeColor()
  },
  methods: {
    /**
     * @description: 关闭侧边栏菜单
     */
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },

    /**
     * @description: 设置主题颜色
     */
    setThemeColor() {
      if (Cookies.get('theme')) {
        this.$refs.theme.theme = Cookies.get('theme')
        this.$store.dispatch('settings/changeSetting', {
          key: 'theme',
          value: Cookies.get('theme')
        })
      }
    }
    // /**
    //  * @description: 设置主题颜色,css也能使用js变量，但是兼容性不太好，仅作测试，慎用
    //  */
    // setThemeColor() {
    //   document.body.style.setProperty(
    //     '--theme-color',
    //     this.theme
    //   )
    // }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/mixin.scss";
@import "~@/assets/styles/variables.scss";
//整体滚动条
.app-wrapper-scroll {
  width: 100%;
  height: 100%;
  overflow: hidden;
  ::v-deep .el-scrollbar__wrap {
    overflow-x: hidden;
  }
}

//整体布局
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  //移动端下打开左侧侧边栏下的样式
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

//移动端下点击左侧菜单，右边的阴影样式
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

//固定头部
.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
  padding: 0;
}

//隐藏左侧菜单下 固定头部的宽度
.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

//移动端下 固定头部的宽度
.mobile .fixed-header {
  width: 100%;
}
</style>
