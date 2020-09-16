<!--
 * @Author: Hzh
 * @Date: 2020-07-22 18:16:18
 * @LastEditTime: 2020-09-16 10:58:59
 * @LastEditors: Hzh
 * @Description:搜索菜单
-->

<template>
  <div :class="{'show':show}" class="header-search">
    <svg-icon class-name="search-icon" icon-class="search" @click.stop="click" />
    <el-select
      ref="headerSearchSelect"
      v-model="search"
      :remote-method="querySearch"
      filterable
      default-first-option
      remote
      placeholder="搜索菜单"
      class="header-search-select"
      @change="change"
    >
      <el-option v-for="item in options" :key="item.path" :value="item" v-html="item.title" />
    </el-select>
  </div>
</template>

<script>
// fuse是一个轻量级的模糊搜索模块
// 使搜索结果更符合预期
import Fuse from 'fuse.js'
import path from 'path'

export default {
  name: 'HeaderSearch',
  data() {
    return {
      search: '', // 搜索的值
      options: [], // 展示出的搜索结果
      searchPool: [], // 搜索池
      show: false, // 是否展示搜索栏
      fuse: undefined
    }
  },
  computed: {
    // 所有的路由
    routes() {
      return this.$store.getters.permission_routers
    },
    themeColor() {
      return this.$store.getters.theme
    }
  },
  watch: {
    /**
     * @description: 监听routes,当permission_routers有变化时重置searchPool
     */
    routes() {
      this.searchPool = this.generateRoutes(this.routes)
    },

    /**
     * @description: 监听searchPool,当其变化时重新初始化initFuse
     */
    searchPool(list) {
      this.initFuse(list)
    },

    /**
     * @description: 关闭搜索栏
     * 全局监听click事件，只有show为true时才开启监听然后关闭搜索栏，否则移除监听事件
     * @param {Boolean} value
     */
    show(value) {
      if (value) {
        document.body.addEventListener('click', this.close)
      } else {
        document.body.removeEventListener('click', this.close)
      }
    }
  },
  mounted() {
    // 初始化搜索池
    this.searchPool = this.generateRoutes(this.routes)
  },
  methods: {
    /**
     * @description: 开启或者关闭搜索栏
     */
    click() {
      this.show = !this.show
      if (this.show) {
        this.$refs.headerSearchSelect && this.$refs.headerSearchSelect.focus()
      }
    },

    /**
     * @description: 关闭搜索栏
     */
    close() {
      this.$refs.headerSearchSelect && this.$refs.headerSearchSelect.blur()
      this.options = []
      this.show = false
    },

    /**
     * @description: 跳转路由
     * @param {Object} val 选中的值
     */
    change(val) {
      this.$router.push(val.path)
      this.search = ''
      this.options = []
      this.$nextTick(() => {
        this.show = false
      })
    },

    /**
     * @description: 初始化fuse
     * @param {Array} list 处理过后的router Array
     * new Fuse(要搜索的数组,options)
     */
    initFuse(list) {
      this.fuse = new Fuse(list, {
        shouldSort: true, // 是否按分数对结果列表排序
        threshold: 0.4, // 匹配算法阈值。阈值为0.0需要完全匹配（字母和位置），阈值为1.0将匹配任何内容。
        location: 0, // 确定文本中预期找到的模式的大致位置。
        distance: 100,
        maxPatternLength: 32, // 模式的最大长度
        minMatchCharLength: 1, // 模式的最小字符长度
        // 设置搜索的值
        keys: [
          {
            name: 'title' // 搜索title
            // weight: 0.7 // 比重
          }
          // {
          //   name: 'path', // 搜索path
          //   weight: 0.3
          // }
        ]
      })
    },

    /**
     * @description: 筛选出可以在侧边栏中显示的路由,并且显示出该路由的层级
     * @param {Array} routes 路由表
     * @param {String} basePath 递归拼接时的路径 如第一级path.resolve('/', '/nested')则取'/nested'
     * 第二级路由path.resolve('/nested', 'menu1') 则为/nested/menu1
     * @param {Array} prefixTitle 路由的上一级标题
     */
    generateRoutes(routes, basePath = '/', prefixTitle = []) {
      let res = []

      for (const router of routes) {
        // 如果router设置了hidden则跳过本次循环
        if (router.hidden) {
          continue
        }

        const data = {
          path: path.resolve(basePath, router.path),
          title: [...prefixTitle]
        }

        // 只push有title的路由
        if (router.meta && router.meta.title) {
          // 拼接改路由的层级，组成Array的形式
          data.title = [...data.title, router.meta.title] // 如果不想拼接可这样设置data.title = [router.meta.title]

          // 特殊情况：需要排除没有重定向的父路由器
          if (router.redirect !== 'noRedirect') {
            res.push(data)
          }
        }

        // 递归子路由
        if (router.children) {
          const tempRoutes = this.generateRoutes(
            router.children,
            data.path,
            data.title
          )
          if (tempRoutes.length >= 1) {
            res = [...res, ...tempRoutes]
          }
        }
      }
      return res
    },

    /**
     * @description: 搜索得到的结果
     * @param {String} query 用户输入的值
     */
    querySearch(query) {
      if (query !== '') {
        this.options = this.searchHighligt(this.fuse.search(query), query)
      } else {
        this.options = []
      }
    },

    /**
     * @description: 搜索高亮
     * @param {Array}  optionArr 搜索到的结果
     * @param {String} query 用户输入的值
     * @returns {Array} 高亮后的结果
     */
    searchHighligt(optionArr, query) {
      const options = JSON.parse(JSON.stringify(optionArr))
      // 匹配关键字正则
      const replaceReg = new RegExp(query, 'gi')
      // 高亮替换v-html值
      for (let i = 0; i < options.length; i++) {
        options[i].title = options[i].title.join(' > ')
        // 开始替换
        options[i].title = options[i].title.replace(
          replaceReg,
          (txt) => `<span style="color:${this.themeColor}">${txt}</span>`
        )
      }
      return options
    }
  }
}
</script>

<style lang="scss" scoped>
.header-search {
  font-size: 0 !important;

  .search-icon {
    cursor: pointer;
    font-size: 18px;
    vertical-align: middle;
  }

  .header-search-select {
    font-size: 18px;
    transition: width 0.2s;
    width: 0;
    overflow: hidden;
    background: transparent;
    border-radius: 0;
    display: inline-block;
    vertical-align: middle;

    ::v-deep .el-input__inner {
      border-radius: 0;
      border: 0;
      padding-left: 0;
      padding-right: 0;
      box-shadow: none !important;
      border-bottom: 1px solid #d9d9d9;
      vertical-align: middle;
    }
  }

  &.show {
    .header-search-select {
      width: 210px;
      margin-left: 10px;
    }
  }
}
</style>
