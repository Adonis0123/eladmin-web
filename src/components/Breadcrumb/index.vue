<!--
 * @Author: Hzh
 * @Date: 2020-07-22 18:16:18
 * @LastEditTime: 2020-09-16 09:36:42
 * @LastEditors: Hzh
 * @Description:面包屑组件
-->
<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
        <!-- 路由设置了noRedirect或者面包屑最后一个不可点击 -->
        <span
          v-if="item.redirect==='noRedirect'||index==levelList.length-1"
          class="no-redirect"
        >{{ item.meta.title }}</span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import pathToRegexp from 'path-to-regexp'

export default {
  data() {
    return {
      levelList: null
    }
  },
  watch: {
    /**
     * @description: 监听路由，如果跳转的是重定向页面，那么就不会记录在面包屑中
     * @param {Object} route 路由对象
     * startsWith()：返回布尔值，表示参数字符串是否在查找字符串的头部
     */
    $route(route) {
      if (route.path.startsWith('/redirect/')) {
        return
      }
      this.getBreadcrumb()
    }
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    /**
     * @description: 获取面包屑中的数据
     * $route.matched 一个数组，包含当前路由的所有嵌套路径片段的路由记录
     * 只展示有meta.title且没设置item.meta.breadcrumb=false的路由
     */
    getBreadcrumb() {
      // 收集这个路由所属的父路由
      const matched = this.$route.matched.filter(
        (item) => item.meta && item.meta.title && item.meta.breadcrumb !== false
      )
      // 判断第一个路由是不是首页，如果不是的话就向数组开头添加首页的路由
      const first = matched[0]
      if (!this.isDashboard(first)) {
        matched.unshift({ path: '/dashboard', meta: { title: '首页' }})
      }

      this.levelList = matched
    },

    /**
     * @description: 判断收集到的第一个路由是不是首页
     * @param {Object} route
     * @returns {Boolean}
     */
    isDashboard(route) {
      const name = route && route.name
      if (!name) {
        return false
      }
      return (
        name.trim() === 'Dashboard'
      )
    },

    /**
     * @description: 解决path有传值（例如/detail/:id）但是获取不到的问题 To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
     * @param {String} path 路由的path
     * compile() 快速填充 url 字符串的参数值。
     */
    pathCompile(path) {
      const { params } = this.$route
      const toPath = pathToRegexp.compile(path)
      return toPath(params)
    },

    /**
     * @description:对转的路由对象，有重定向则跳转到重定向，无则正常跳转
     * @param {Object} item
     */
    handleLink(item) {
      const { redirect, path } = item
      if (redirect) {
        this.$router.push(redirect)
        return
      }
      this.$router.push(this.pathCompile(path))
    }
  }
}
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
