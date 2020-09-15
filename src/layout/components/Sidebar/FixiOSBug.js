/*
 * @Author: Hzh
 * @Date: 2020-07-22 18:16:18
 * @LastEditTime: 2020-09-15 09:35:27
 * @LastEditors: Hzh
 * @Description:解决ios上点击菜单的bug
 */
export default {
  computed: {
    device() {
      return this.$store.state.app.device
    }
  },
  mounted() {
    // 为了修复ios设备上的点击菜单将触发mouseleave错误
    // https://github.com/PanJiaChen/vue-element-admin/issues/1135
    this.fixBugIniOS()
  },
  methods: {
    fixBugIniOS() {
      const $subMenu = this.$refs.subMenu
      if ($subMenu) {
        const handleMouseleave = $subMenu.handleMouseleave
        $subMenu.handleMouseleave = (e) => {
          if (this.device === 'mobile') {
            return
          }
          handleMouseleave(e)
        }
      }
    }
  }
}
