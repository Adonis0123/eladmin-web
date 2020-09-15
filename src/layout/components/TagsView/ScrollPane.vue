<!--
 * @Author: Hzh
 * @Date: 2020-07-22 18:16:18
 * @LastEditTime: 2020-08-10 14:27:46
 * @LastEditors: Hzh
 * @Description:标签组件横向滚动条 @wheel滚轮滚动事件
-->
<template>
  <el-scrollbar
    ref="scrollContainer"
    :vertical="false"
    class="scroll-container"
    @wheel.native.prevent="handleScroll"
  >
    <slot />
  </el-scrollbar>
</template>

<script>
const tagAndTagSpacing = 5 // 标签与标签之间的距离

import smoothscroll from 'smoothscroll-polyfill' // 解决移动端下ScrollTo不生效的问题
export default {
  name: 'ScrollPane',
  data() {
    return {}
  },
  computed: {
    /**
     * @description: el-scroll的wrapper，产生滚动的地方
     */
    scrollWrapper() {
      return this.$refs.scrollContainer.$refs.wrap
    }
  },
  mounted() {
    this.$nextTick(() => {
      smoothscroll.polyfill()
    })

    /**
     * @description: 监听滚动事件，向父组件提交事件
     */
    this.scrollWrapper.addEventListener('scroll', this.emitScroll, true)
    this.$on('hook:beforeDestroy', () => {
      this.scrollWrapper.removeEventListener('scroll', this.emitScroll)
    })
  },
  methods: {
    /**
     * @description: 标签容器滚动事件
     * @param {Object} e 滚动事件对象
     */
    handleScroll(e) {
      const eventDelta = e.wheelDelta || -e.deltaY * 40
      const $scrollWrapper = this.scrollWrapper
      $scrollWrapper.scrollLeft = $scrollWrapper.scrollLeft + eventDelta / 4
    },

    /**
     * @description: 提交滚动事件
     */
    emitScroll() {
      this.$emit('scroll')
    },

    /**
     * @description: 移动滚动条
     * @param {Number} offset 移动的距离
     */
    moveScroll(offset) {
      const $scrollWrapper = this.scrollWrapper
      const outerWidth = this.$refs.scrollContainer.$el.offsetWidth
      const bodyWidth = $scrollWrapper.offsetWidth
      if (offset < 0) {
        // $scrollWrapper.scrollLeft = Math.max(0, $scrollWrapper.scrollLeft + offset)
        this.handleScrollTo(Math.max(0, $scrollWrapper.scrollLeft + offset))
      } else {
        if (outerWidth <= bodyWidth) {
          if ($scrollWrapper.scrollLeft < -(bodyWidth - outerWidth)) {
            this.handleScrollTo($scrollWrapper.scrollLeft)
          } else {
            this.handleScrollTo(Math.max($scrollWrapper.scrollLeft + offset, outerWidth - bodyWidth))
          }
        } else {
          this.handleScrollTo(0)
        }
      }
    },

    /**
     * @description: 移动效果
     * @param {Number} left ScrollLeft的距离
     */
    handleScrollTo(left) {
      this.scrollWrapper.scrollTo({
        left,
        behavior: 'smooth'
      })
    },

    /**
     * @description: 移动到当前高亮的标签
     * @param {Object} currentTag 当前高亮的标签
     * $el 获取dom元素
     */
    moveToTarget(currentTag) {
      const $container = this.$refs.scrollContainer.$el // 获取标签容器的DOM
      const $containerWidth = $container.offsetWidth // 标签容器的宽度
      const $scrollWrapper = this.scrollWrapper // el-scroll的wrapper
      const tagList = this.$parent.$refs.tag // 标签数组
      let firstTag = null
      let lastTag = null

      // 第一个标签和最后一个标签
      if (tagList.length > 0) {
        firstTag = tagList[0]
        lastTag = tagList[tagList.length - 1]
      }
      // 如果第一个标签等于当前高亮的标签，则横向滚动条滚动到最左边
      if (firstTag === currentTag) {
        $scrollWrapper.scrollLeft = 0
        // 如果最后一个标签等于当前高亮的标签，则横向滚动条滚动的位置等于滚动条的宽度减去整个标签容器的宽度
      } else if (lastTag === currentTag) {
        $scrollWrapper.scrollLeft =
          $scrollWrapper.scrollWidth - $containerWidth
      } else {
        // 找到前一个标签和后一个标签
        const currentIndex = tagList.findIndex((item) => item === currentTag)
        const prevTag = tagList[currentIndex - 1] // 前一个标签
        const nextTag = tagList[currentIndex + 1] // 后一个标签

        // the tag's offsetLeft after of nextTag 当前高亮路由的后一个标签的offsetLeft
        const afterNextTagOffsetLeft =
          nextTag.$el.offsetLeft + nextTag.$el.offsetWidth + tagAndTagSpacing

        // the tag's offsetLeft before of prevTag 当前高亮路由的前一个标签的offsetLeft
        const beforePrevTagOffsetLeft =
          prevTag.$el.offsetLeft - tagAndTagSpacing

        // 如果当前高亮路由的后一个标签的不在可视范围内
        if (
          afterNextTagOffsetLeft >
          $scrollWrapper.scrollLeft + $containerWidth
        ) {
          $scrollWrapper.scrollLeft = afterNextTagOffsetLeft - $containerWidth
        } else if (beforePrevTagOffsetLeft < $scrollWrapper.scrollLeft) {
          // 如果当前高亮路由的前一个标签不在可视范围内
          $scrollWrapper.scrollLeft = beforePrevTagOffsetLeft
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.scroll-container {
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: 100%;
  background: #F0F0F0;
  ::v-deep {
    .el-scrollbar__bar {
      bottom: 0px;
    }
    .el-scrollbar__wrap {
      // transition: left .3s ease;
      overflow: scroll !important;
      height: 59px;
    }
  }
}
</style>
