<template>
  <el-row class="navbar" :class="{'mobile':device === 'mobile'}">
    <template v-if="device==='mobile'">
      <el-col class="hamburger-container" @click.native="toggleSideBar">
        <hamburger class="hamburger" :is-active="sidebar.opened" />
      </el-col>
    </template>

    <div class="title" :style="{color:theme}">
      <el-image class="title-item logo" :src="logo" fit="contain" />
      <div class="title-item">Vue Element Admin</div>
    </div>

    <div class="left-menu">
      <nav-menu v-show="device!=='mobile'" />
    </div>

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <!-- <search id="header-search" class="right-menu-item" /> -->

        <el-tooltip content="项目文档" effect="dark" placement="bottom">
          <doc class="right-menu-item hover-effect" />
        </el-tooltip>

        <el-tooltip content="全屏缩放" effect="dark" placement="bottom">
          <screenfull id="screenfull" class="right-menu-item hover-effect" />
        </el-tooltip>

        <el-tooltip content="布局设置" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>
      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img
            :src="user.avatarName ? baseApi + '/avatar/' + user.avatarName : Avatar"
            class="user-avatar"
          >
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <span style="display:block;" @click="show = true">
            <el-dropdown-item>布局设置</el-dropdown-item>
          </span>
          <router-link to="/user/center">
            <el-dropdown-item>个人中心</el-dropdown-item>
          </router-link>
          <span style="display:block;" @click="open">
            <el-dropdown-item divided>退出登录</el-dropdown-item>
          </span>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-row>
</template>

<script>
import NavMenu from './NavMenu'
import { mapGetters } from 'vuex'
import {
  // Breadcrumb,
  Hamburger,
  Screenfull,
  SizeSelect,
  // HeaderSearch as Search,
  Doc
} from 'components'
import Avatar from '@/assets/images/avatar.png'
import { logo } from 'images'

export default {
  components: {
    // Breadcrumb,
    Hamburger,
    Screenfull,
    SizeSelect,
    // Search,
    Doc,
    NavMenu
  },
  data() {
    return {
      Avatar: Avatar,
      dialogVisible: false,
      logo: logo
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'device', 'user', 'baseApi']),
    /* 显示布局设置 */
    show: {
      get() {
        return this.$store.state.settings.showSettings
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'showSettings',
          value: val
        })
      }
    },
    theme() {
      return this.$store.state.settings.theme
    }
  },
  methods: {
    /**
     * @description: 展开或者收起侧边菜单栏
     */
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },

    open() {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.logout()
      })
    },

    /**
     * @description: 退出登录
     */
    async logout() {
      await this.$store.dispatch('LogOut')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;
  background: #fff;

  .title {
    height: 100%;
    padding: 0 19px;
    float: left;
    // flex: none;
    font-size: 18px;
    font-weight: 400;
    &-item {
      line-height: 50px;
      display: inline-block;
      vertical-align: middle;
    }
    .logo {
      margin-right: 8px;
      width: 40px;
      height: 40px;
    }
  }

  .left-menu {
    display: flex;
    align-items: center;
    height: 100%;
    float: left;
    // width: calc(100% - 244px - 222px); //272px hamburger-container + right-menu
    // flex: 1;
  }

  .right-menu {
    float: right;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;
      display: flex;
      align-items: center;
      .avatar-wrapper {
        // margin-top: 5px;
        display: flex;
        align-items: center;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}

.mobile {
  .hamburger-container {
    height: 100%;
    width: 25px;
    cursor: pointer;
    transition: width 0.3s;
    position: relative;
    .hamburger {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      height: 25px;
      width: 100%;
    }
    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  // .left-menu {
  //   // width: calc(100% - 136px);
  //   // flex-grow: 1;
  // }
  // .right-menu {
  //   width: 86px;
  // }
}
</style>
