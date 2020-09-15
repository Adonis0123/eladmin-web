<!--
    参数解释在props中
    使用说明：
      <scroll
      class="xx-xx-wrapper"
      :data="data"
    >
      <div class="xx-xx-content">
      </div>
    </scroll>

    要想betterScroll产生滚动效果(纵向或者横向)，你需要设置'.wrapper'的高度（宽度）,
    content的内容高度（宽度）必须要高于warpper的高度（宽度）
    如果content里面内容的高度是不固定的，那么需要给scroll传值data
-->
<template>
  <div ref="scrollContainer" class="scroll-container">
    <slot />
  </div>
</template>

<script>
import BScroll from 'better-scroll'
export default {
  props: {
    /**
     *  传1 滚动的时候会派发scroll事件，会截流
     *  传2 滚动的时候实时派发scroll事件，不会截流。
     *  传3 除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
     */
    probeType: {
      type: Number,
      default: 1
    },
    /** 点击列表是否派发click事件 */
    click: {
      type: Boolean,
      default: true
    },
    /** 是否开启横向滚动 */
    scrollX: {
      type: Boolean,
      default: false
    },
    /** 是否开启纵向滚动 */
    scrollY: {
      type: Boolean,
      default: true
    },
    /** 是否派发滚动事件 */
    listenScroll: {
      type: Boolean,
      default: false
    },
    /** 列表的数据,用于数据改变导致视图更改后重新初始化滚动 */
    data: {
      type: Array,
      default: null
    },
    /**  是否派发滚动到底部的事件，用于上拉加载 */
    pullup: {
      type: Boolean,
      default: false
    },
    /**  是否派发顶部下拉的事件，用于下拉刷新 */
    pulldown: {
      type: Boolean,
      default: false
    },
    /**  是否派发列表滚动开始的事件 */
    beforeScroll: {
      type: Boolean,
      default: false
    },
    /**  当数据更新后，刷新scroll的延时。 */
    refreshDelay: {
      type: Number,
      default: 20
    }
  },
  data() {
    return {
      scroll: null
    }
  },
  watch: {
    /* 监听数据的变化，延时refreshDelay时间后调用refresh方法重新计算，保证滚动效果正常 */
    data() {
      setTimeout(() => {
        this.refresh()
      }, this.refreshDelay)
    }
  },
  mounted() {
    /* 保证在DOM渲染完毕后初始化better-scroll */
    this.$nextTick(() => {
      this._initScroll()
    })
  },
  methods: {
    /**
     * @description: better-scroll的初始化
     */
    _initScroll() {
      if (!this.$refs.scrollContainer) {
        return
      }
      this.scroll = new BScroll(this.$refs.scrollContainer, {
        probeType: this.probeType,
        click: this.click, // 是否派发click事件
        useTransition: false, // 防止iphone微信滑动卡顿
        scrollX: this.scrollX, // 横向可滑动，默认为false
        scrollY: this.scrollY, // 纵向可滑动，默认为true
        preventDefault: true, // 是否阻止默认事件
        momentum: true, // 当快速滑动时是否开启滑动惯性
        bounce: false, //  是否启用回弹动画效果
        mouseWheel: { // pc端滚轮
          speed: 20,
          invert: false,
          easeTime: 300
        }
      })
      /* 是否派发滚动事件  */
      if (this.listenScroll) {
        const me = this
        this.scroll.on('scroll', (pos) => {
          me.$emit('scroll', pos)
        })
      }
      /* 是否派发滚动到底部事件，用于上拉加载 */
      if (this.pullup) {
        this.scroll.on('scrollEnd', () => {
          // 滚动到底部
          if (this.scroll.y <= this.scroll.maxScrollY + 50) {
            this.$emit('scrollToEnd')
          }
        })
      }
      /* 是否派发顶部下拉事件，用于下拉刷新 */
      if (this.pulldown) {
        this.scroll.on('touchend', (pos) => {
          // 下拉动作
          if (pos.y > 50) {
            this.$emit('pulldown')
          }
        })
      }
      /* 是否派发列表滚动开始的事件 */
      if (this.beforeScroll) {
        this.scroll.on('beforeScrollStart', () => {
          this.$emit('beforeScroll')
        })
      }
    },

    /**
     * @description: 禁用 better-scroll
     */
    disable() {
      this.scroll && this.scroll.disable()
    },

    /**
     * @description: 启用 better-scroll，默认开启
     */
    enable() {
      this.scroll && this.scroll.enable()
    },

    /**
     * @description: 强制 scroll 重新计算，当 better-scroll 中的元素发生变化的时候调用此方法。
     */
    refresh() {
      this.scroll && this.scroll.refresh()
    },

    /**
     * @description:滚动到某个位置
     * @param {Number} x x轴的坐标
     * @param {Number} y y轴的坐标
     * @param {Number} time 动画时间
     */
    scrollTo(x, y, time) {
      this.scroll && this.scroll.scrollTo(x, y = 0, time)
    },

    /**
     * @description:滚动到某个元素
     * @param {Object} el dom 元素(必填)
     * @param {Number} time 动画时间
     * @param {Number} offsetX  x轴偏移量,设置为true时，到达目标元素中心位置
     * @param {Number} offsetY  y轴偏移量,设置为true时，到达目标元素中心位置
     */
    scrollToElement(el, time, offsetX, offsetY) {
      this.scroll && this.scroll.scrollToElement(el, time, offsetX, offsetY)
    },

    /**
     * @description: 相对于当前位置偏移滚动 x,y 的距离。
     * @param {Number} x 横轴距离（单位 px）
     * @param {Number} y 纵轴距离（单位 px）
     * @param {Number} time 滚动动画执行的时长（单位 ms）
     */
    scrollBy(x, y, time) {
      this.scroll && this.scroll.scrollBy(x, y, time)
    }
  }
}
</script>

<style lang="scss" scoped>
.scroll-container {
  overflow: hidden;
}
</style>
