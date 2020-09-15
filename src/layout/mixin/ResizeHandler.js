/*
 * @Author: Hzh
 * @Date: 2020-07-22 18:16:18
 * @LastEditTime: 2020-09-14 16:10:55
 * @LastEditors: Hzh
 * @Description:根据屏幕宽度判断pc端还是移动端
 */
import store from '@/store'

const { body } = document
const WIDTH = 992 // 参考Bootstrap的响应式设计

export default {
  watch: {
    $route(route) {
      if (this.device === 'mobile' && this.sidebar.opened) {
        store.dispatch('app/closeSideBar', { withoutAnimation: false })
      }
    }
  },
  beforeMount() {
    /**
     * @description: 监听屏幕尺寸变化
     */
    window.addEventListener('resize', this.$_resizeHandler)
    this.$on('hook:beforeDestroy', () => {
      window.removeEventListener('resize', this.$_resizeHandler)
    })
  },
  mounted() {
    const isMobile = this.$_isMobile()
    /* 判断是否是移动端且菜单展开 */
    if (isMobile) {
      store.dispatch('app/toggleDevice', 'mobile')
      store.dispatch('app/closeSideBar', { withoutAnimation: true })
    }
  },
  methods: {
    /**
      *  将$_用于mixin属性
      *  https://vuejs.org/v2/style-guide/index.html#Private-property-names-essential
      */

    /**
     * @description: 判断当前页面的宽度是否小于992，小于992则视为移动端
     */
    $_isMobile() {
      // Element.getBoundingClientRect() 方法返回元素的大小及其相对于视口的位置。
      const rect = body.getBoundingClientRect()
      return rect.width - 1 < WIDTH
    },

    /**
     * @description:监听屏幕尺寸变化
     */
    $_resizeHandler() {
      // （只读属性）返回布尔值，表示页面是（true）否（false）隐藏
      if (!document.hidden) {
        const isMobile = this.$_isMobile()
        store.dispatch('app/toggleDevice', isMobile ? 'mobile' : 'desktop')

        if (isMobile) {
          store.dispatch('app/closeSideBar', { withoutAnimation: true })
        }
      }
    }
  }
}
