<!--
 * @Author: Hzh
 * @Date: 2020-07-25 00:32:14
 * @LastEditTime: 2020-09-15 19:33:45
 * @LastEditors: Hzh
 * @Description:标签组件 @contextmenu 右键菜单 @click.middle 鼠标滚轮单击触发
-->

<template>
  <div id="tags-view-container" class="tags-view-container">
    <div class="btn-icon btn-left" @click.stop.prevent="moveScroll(200)">
      <!-- <svg-icon icon-class="zuo-yuan" /> -->
      <i class="el-icon-arrow-left" />
    </div>
    <better-scroll
      ref="scrollPane"
      :data="visitedViews"
      :scroll-x="true"
      :scroll-y="false"
      listen-scroll
      :click="false"
      :probe-type="2"
      class="tags-view-wrapper"
      @scroll="handleScroll"
    >
      <el-row style="display:inline-block;white-space:nowrap">
        <!-- <scroll-pane ref="scrollPane" class="tags-view-wrapper" @scroll="handleScroll"> -->
        <router-link
          v-for="tag in visitedViews"
          ref="tag"
          :key="tag.path"
          :class="isActive(tag)?'active':''"
          :style="activeColor(tag)"
          :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
          tag="span"
          class="tags-view-item"
          @click.middle.native="!isAffix(tag)?closeSelectedTag(tag):''"
          @click.right.prevent.native="openMenu(tag,$event)"
        >
          {{ tag.title }}
          <span
            v-if="!isAffix(tag)"
            class="el-icon-close"
            @click.stop.prevent="closeSelectedTag(tag)"
          />
        </router-link>
      </el-row>
      <!-- </scroll-pane> -->
    </better-scroll>
    <div class="btn-icon btn-right" @click.stop.prevent="moveScroll(-200)">
      <!-- <svg-icon icon-class="you-yuan" /> -->
      <i class="el-icon-arrow-right" />
    </div>
    <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag)">刷新</li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">关闭</li>
      <li @click="closeOthersTags">关闭其他</li>
      <li @click="closeAllTags(selectedTag)">关闭全部</li>
    </ul>
  </div>
</template>

<script>
// import ScrollPane from './ScrollPane'
import { BetterScroll } from 'components'
import path from 'path'

export default {
  components: { BetterScroll },
  data() {
    return {
      visible: false, // 展示右键菜单
      top: 0, // 右键菜单的距离，同下
      left: 0,
      selectedTag: {}, // 右键菜单所属的标签
      affixTags: []
    }
  },
  computed: {
    /**
     * @description: 所有的标签
     */
    visitedViews() {
      return this.$store.state.tagsView.visitedViews
    },

    /**
     * @description: 所有的路由
     */
    routes: {
      get() {
        return this.$store.state.permission.routers
      },
      set() {
        this.$dispatch('tagsView/delAllViews')
      }
    },

    /**
     * @description: 主题颜色
     */
    themeColor() {
      return this.$store.state.settings.theme
    },

    /**
     * @description: 侧边栏展开与否
     */
    sidebar() {
      return this.$store.state.app.sidebar
    }
  },

  watch: {
    $route() {
      this.addTags()
      /* 解决添加标签没有滚动到最后一个的问题 */
      setTimeout(() => {
        this.moveToCurrentTag()
      }, 60)
    },

    sidebar: {
      deep: true,
      handler: function(obj) {
        setTimeout(() => {
          this.$refs.scrollPane.refresh() // 重置better-scroll
        }, 200)
      }
    },

    /**
     * @description: 全局监听点击事件，关闭右键菜单，visible为false则不监听
     */
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
  mounted() {
    this.initTags()
    this.addTags()
    this.$nextTick(() => {
      this.moveToCurrentTag()
    })
  },
  methods: {
    /**
     * @description: 标签高亮时的样式
     * @param {Object} tag 当前选中的标签
     */
    activeColor(tag) {
      if (this.isActive(tag)) {
        return {
          borderColor: this.themeColor,
          background: this.themeColor
        }
      }
    },
    /**
     * @description: 判断当前标签是否对应当前展示的路由，是则高亮
     * @param {Object} route 标签对象
     */
    isActive(route) {
      return route.path === this.$route.path
    },

    /**
     * @description: router的meta里面是否设置了affix固定标签
     * @param {Object} tag 标签对象
     */
    isAffix(tag) {
      return tag.meta && tag.meta.affix
    },

    /**
     * @description: 递归遍历路由表，获取meta带有affix的路由
     * @param {Object} routes 递归路由
     * @param {Object} basePath 父路由路径
     * @returns {Array} 标签数组
     */
    filterAffixTags(routes, basePath = '/') {
      let tags = []
      for (const route of routes) {
        const tagPath = path.resolve(basePath, route.path)
        if (route.meta && route.meta.affix) {
          tags.push({
            path: tagPath,
            fullPath: tagPath,
            name: route.name,
            meta: { ...route.meta }
          })
        }
        if (route.children && route.children.length) {
          const tempTags = this.filterAffixTags(route.children, tagPath)
          tags = [...tags, ...tempTags]
        }
      }
      return tags
    },

    /**
     * @description: 初始化标签数组,获取在router设置了affix的固定标签
     */
    initTags() {
      const affixTags = (this.affixTags = this.filterAffixTags(this.routes))
      for (const tag of affixTags) {
        // Must have tag name 标签必须要有name，也就是router的路由必须设置name属性才会显示标签
        if (tag.name) {
          this.$store.dispatch('tagsView/addVisitedView', tag)
        }
      }
    },

    /**
     * @description: 把当前显示的路由添加到标签组中
     */
    addTags() {
      const { path, fullPath, name, meta } = this.$route
      // 拷贝标签需要的属性
      const tag = {
        path,
        fullPath,
        name,
        meta
      }
      if (name) {
        this.$store.dispatch('tagsView/addView', tag)
      }
    },

    /**
     * @description: 移动到高亮的标签
     */
    moveToCurrentTag() {
      const tags = this.$refs.tag // 获取所有标签
      this.$nextTick(() => {
        for (const tag of tags) {
          if (tag.to.path === this.$route.path) {
            // this.$refs.scrollPane.moveToTarget(tag) // 移动到当前高亮的标签
            const { $el } = tag
            this.$refs.scrollPane.scrollToElement($el, 350, true) // 移动到当前高亮的标签
            // 如果路由传值不一样的话则更新传值
            if (tag.to.fullPath !== this.$route.fullPath) {
              const { path, fullPath, name, meta } = this.$route
              const tag = {
                path,
                fullPath,
                name,
                meta
              }
              this.$store.dispatch('tagsView/updateVisitedView', tag)
            }
            break
          }
        }
      })
    },

    /**
     * @description: 移动滚动条
     * @param {Number} offset 移动的距离
     */
    moveScroll(offset) {
      const { maxScrollX, minScrollX, x } = this.$refs.scrollPane.scroll
      if (offset < 0) {
        if (x === maxScrollX) {
          return
        } else if (Math.abs(maxScrollX) - Math.abs(x) < 150) {
          this.$refs.scrollPane.scrollTo(maxScrollX, 0, 200)
        } else {
          this.$refs.scrollPane.scrollBy(offset, 0, 200)
        }
      } else {
        if (x === minScrollX) {
          return
        } else if (Math.abs(x) < 150) {
          this.$refs.scrollPane.scrollTo(minScrollX, 0, 200)
        } else {
          this.$refs.scrollPane.scrollBy(offset, 0, 200)
        }
      }
    },

    /**
     * @description: 刷新右键选中的标签并跳转
     * @param {Object} view 标签路由
     */
    refreshSelectedTag(view) {
      this.$store.dispatch('tagsView/delCachedView', view).then(() => {
        const { fullPath } = view
        this.$nextTick(() => {
          this.$router.replace({
            path: '/redirect' + fullPath
          })
        })
      })
    },

    /**
     * @description: 关闭选中的标签
     * @param {Object} view 当前的标签
     */
    closeSelectedTag(view) {
      this.$store
        .dispatch('tagsView/delView', view)
        .then(({ visitedViews }) => {
          // 如果当前关闭的是高亮中的标签，那么就跳转是标签数组里最后一个标签
          if (this.isActive(view)) {
            this.toLastView(visitedViews, view)
          }
        })
    },

    /**
     * @description: 关闭其他标签，同时跳转到选中的标签
     */
    closeOthersTags() {
      this.$router.push(this.selectedTag)
      this.$store
        .dispatch('tagsView/delOthersViews', this.selectedTag)
        .then(() => {
          this.moveToCurrentTag()
        })
    },

    /**
     * @description: 关闭所有标签
     * @param {Object} view 当前右键选中的标签
     */
    closeAllTags(view) {
      this.$store.dispatch('tagsView/delAllViews').then(({ visitedViews }) => {
        // 如果选择关闭全部的标签在router里面设置了affix,则不跳转
        if (this.affixTags.some((tag) => tag.path === view.path)) {
          return
        }
        // 跳转标签最后一个
        this.toLastView(visitedViews, view)
      })
    },

    /**
     * @description: 跳转标签数组里最后一个标签
     * @param {Array} visitedViews 标签数组
     * @param {Object} view 被选中的标签
     */
    toLastView(visitedViews, view) {
      // 最后一个标签
      const latestView = visitedViews.slice(-1)[0] //  visitedViews[visitedViews.length - 1]
      // 如果有最后一个标签的话
      if (latestView) {
        this.$router.push(latestView.fullPath)
      } else {
        // 如果没有标签数组的话，默认会跳到首页，并刷新页面
        // 你也可以根据你的需求进行更改
        if (view.name === 'Dashboard') {
          this.$router.replace({ path: '/redirect' + view.fullPath })
        } else {
          this.$router.push('/')
        }
      }
    },

    /**
     * @description: 右键打开标签项
     * @param {Object} tag 当前右键的标签
     * @param {Object} e $event 当前的点击元素的事件对象
     */
    openMenu(tag, e) {
      const menuMinWidth = 105 // 菜单的最小宽度
      // Element.getBoundingClientRect() 方法返回元素的大小及其相对于视口的位置。
      const offsetLeft = this.$el.getBoundingClientRect().left // container margin left 相对于相对于视口左侧的位置
      const offsetWidth = this.$el.offsetWidth // container width 整个标签页的宽度
      const maxLeft = offsetWidth - menuMinWidth // 左边界
      const left = e.clientX - offsetLeft // 15: （鼠标右键后向右偏移15） 返回当事件被触发时鼠标指针向对于浏览器页面（或当前窗户）的水平坐标。
      if (left > maxLeft) {
        this.left = maxLeft
      } else {
        this.left = left
      }
      // this.top = e.clientY // 返回当事件被触发时鼠标指针向对于浏览器页面（或当前窗户）的垂直坐标
      this.top = 35
      this.visible = true
      // 给当前选中的标签赋值
      this.selectedTag = tag
    },

    /**
     * @description: 关闭右键菜单
     */
    closeMenu() {
      this.visible = false
    },

    /**
     * @description: 滚动的时候关闭右键菜单
     */
    handleScroll(pos) {
      this.closeMenu()
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-icon {
  width: 25px;
  height: 39px;
  border: none;
  background: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  &:active {
    background-color: #f2f3f5;
  }
  &:hover {
    color: rgb(24, 144, 255);
  }
  .svg-icon {
    color: #97a8be;
    width: 20px;
    height: 20px;
  }
  .svg-icon:hover {
    color: rgb(24, 144, 255);
  }
}
// @import "~@/styles/element-variables.scss";
.tags-view-container {
  height: 40px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  display: flex;
  justify-content: center;
  position: relative;
  .tags-view-wrapper {
    width: calc(100% - 50px); //48px: btnleft & btnright
    background: #f0f0f0;
    .tags-view-item {
      user-select: none;
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 28px;
      line-height: 28px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 6px;
      &:first-of-type {
        margin-left: 15px;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      &.active {
        // background-color: $--color-primary;
        color: #fff;
        // border-color: $--color-primary;
        &::before {
          content: "";
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

<style lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      width: 16px;
      height: 16px;
      vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;
      &:before {
        transform: scale(0.6);
        display: inline-block;
        vertical-align: -3px;
      }
      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
</style>
