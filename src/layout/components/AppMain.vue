<!--
 * @Author: Hzh
 * @Date: 2020-09-14 09:38:49
 * @LastEditTime: 2020-09-18 17:33:02
 * @LastEditors: Hzh
 * @Description:
-->
<template>
  <section class="app-main">
    <el-scrollbar class="app-main-scroll">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="cachedViews">
          <router-view :key="key" />
        </keep-alive>
      </transition>
    </el-scrollbar>
    <div v-if="false" id="el-main-footer">
      <span v-html="$store.state.settings.footerTxt" />
      <span>⋅</span>
      <a href="http://www.beian.miit.gov.cn" target="_blank">{{ $store.state.settings.caseNumber }}</a>
    </div>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    /**
     * @description: 需要缓存的页面
     */
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      // 只要保证 key 唯一性就可以了，保证不同页面的 key 不相同
      return this.$route.path
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main-scroll {
  width: 100%;
  height: 100%;
  overflow: hidden;
  ::v-deep .el-scrollbar__wrap {
   overflow: hidden scroll;
  }
  ::v-deep .el-scrollbar__view {
    padding: 15px;
    background: #f0f0f0;
    box-sizing: border-box;
  }
  // ::v-deep .el-scrollbar__bar.is-horizontal{
    // display: none;
  // }
}
.app-main {
  /*头部的高度 没有tags-view  50= navbar  50*/
  // min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}

//固定头部下 .app-main的padding-top
.fixed-header + .app-main {
  padding-top: 50px;
}

//如果有标签页的话
.hasTagsView {
  // .app-main {
  //   /* 84 = navbar + tags-view = 50 + 39 */
  //   // min-height: calc(100vh - 89px);
  // }

  //固定头部下 .app-main的padding-top
  .fixed-header + .app-main {
    padding-top: 89px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
