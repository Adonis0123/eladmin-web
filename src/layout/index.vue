<template>
  <el-container :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <!-- 头部 -->
    <el-header style="height:50px">
      <navbar />
    </el-header>

    <el-container class="app-container">
      <!-- 侧边栏 -->
      <el-aside style="width:auto">
        <sidebar class="sidebar-container" />
      </el-aside>

      <el-main :class="{hasTagsView:needTagsView}">
        <!-- 便签页 -->
        <tags-view v-if="needTagsView" />

        <!-- 主体内容 -->
        <app-main class="app-main-contaniner" />

        <!-- 右边设置 -->
        <right-panel v-if="showSettings">
          <settings />
        </right-panel>
      </el-main>
    </el-container>
    <!--  防止刷新后主题丢失  -->
    <theme v-show="false" ref="theme" />
  </el-container>
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
      needTagsView: (state) => state.settings.tagsView
      // fixedHeader: (state) => state.settings.fixedHeader
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

//整体布局
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
  //移动端下打开左侧侧边栏下的样式
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }

  .el-header {
    padding: 0;
    box-shadow: 0px 2px 8px 0px rgba(10, 43, 68, 0.12);
    position: relative; //解决box-shadow不显示的问题
    z-index: 1;
  }

  .app-container {
    overflow: hidden;
    .el-aside {
      height: calc(100vh - 50px); //50px el-header height
      padding: 0;
      margin-bottom: 0;
    }

    .el-main {
      padding: 0;
      height: calc(100vh - 50px);
      overflow: hidden;
      transition: width 0.28s;
    }
  }
}

//没有标签页
.app-main-contaniner {
  height: 100%;
  width: 100%;
}

// 如果有标签页的话
.hasTagsView {
  .app-main-contaniner {
    height: calc(100% - 40px); //40px tagsView的height
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
  z-index: 99;
}

// //固定头部
// .fixed-header {
//   position: fixed;
//   top: 0;
//   right: 0;
//   z-index: 9;
//   width: calc(100% - #{$sideBarWidth});
//   transition: width 0.28s;
//   padding: 0;
// }

// //隐藏左侧菜单下 固定头部的宽度
// .hideSidebar .fixed-header {
//   width: calc(100% - 54px);
// }

// //移动端下 固定头部的宽度
// .mobile .fixed-header {
//   width: 100%;
// }
</style>
