<!--
 * @Author: Hzh
 * @Date: 2020-07-22 18:16:18
 * @LastEditTime: 2020-09-15 09:55:33
 * @LastEditors: Hzh
 * @Description:根据路由的地址判断生成a标签或者router-link
-->

<template>
  <component :is="type" v-bind="linkProps">
    <slot />
  </component>
</template>

<script>
import { isExternal } from '@/utils/validate'

export default {
  props: {
    /* 组件的地址 */
    to: {
      type: String,
      required: true
    }
  },
  computed: {
    /**
     * @description: 判断是否外链
     */
    isExternal() {
      return isExternal(this.to)
    },

    /**
     * @description: 生成标签
     */
    type() {
      if (this.isExternal) {
        return 'a'
      }
      return 'router-link'
    },

    /**
     * @description: 根据标签给予属性
     */
    linkProps() {
      if (this.isExternal) {
        return {
          href: this.to,
          target: '_blank',
          rel: 'noopener' // 为了防止window.opener被滥用，在使用targrt=_blank时需要加上rel=noopener
        }
      }
      return {
        to: this.to
      }
    }
  }
}
</script>
