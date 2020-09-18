<!--
 * @Author: Hzh
 * @Date: 2020-07-22 18:16:18
 * @LastEditTime: 2020-09-18 18:06:58
 * @LastEditors: Hzh
 * @Description: 侧边栏的菜单搜索
-->
<template>
  <div class="sidebar-header" :class="{'collapse':collapse}">
    <transition name="sidebarHeaderFade">
      <!-- 折叠状态 -->
      <el-row
        v-if="collapse"
        class="sidebar-header-container"
        type="flex"
        align="middle"
        justify="center"
      >
        <hamburger :is-active="sidebar.opened" class="sidebar-logo" @toggleClick="toggleSideBar" />
      </el-row>
      <!-- 展开状态 -->
      <el-row v-else :class="{'mobile':device==='mobile'}" class="sidebar-header-container" type="flex" align="middle">
        <template v-if="device === 'mobile'">
          <menu-search />
        </template>

        <template v-else>
          <menu-search />
          <hamburger :is-active="sidebar.opened" class="sidebar-logo" @toggleClick="toggleSideBar" />
        </template>
      </el-row>
    </transition>
  </div>
</template>

<script>
import { Hamburger, MenuSearch } from 'components'
import { mapGetters } from 'vuex'
export default {
  name: 'SidebarLogo',
  components: { Hamburger, MenuSearch },
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['sidebar', 'device'])
  },
  methods: {
    /**
     * @description: 展开或者收起侧边菜单栏
     */
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarHeaderFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarHeaderFade-enter,
.sidebarHeaderFade-leave-to {
  opacity: 0;
}

.sidebar-header {
  width: 100%;
  height: 61px;
  border-bottom: 1px solid #1f2d3d;
  overflow: hidden;

  &-container {
    height: 100%;
    width: 100%;
    position: relative;

    & .sidebar-logo {
      width: 25px;
      height: 25px;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 10px;

      ::v-deep .svg-icon {
        margin-right: 0 !important;
        cursor: pointer;
        color: #fff;
      }
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      margin-right: 0px;
    }
  }
}
</style>
