<!--
 * @Author: Hzh
 * @Date: 2020-07-25 00:32:14
 * @LastEditTime: 2020-09-18 18:15:58
 * @LastEditors: Hzh
 * @Description:展开/收起
-->

<template>
  <div @click="toggleClick">
    <svg-icon style="width:100%;height:100%" class-name="hamburger" :class="{'is-active':isActive}" icon-class="fold" />
  </div>
</template>

<script>
export default {
  name: 'Hamburger',
  props: {
    isActive: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toggleClick() {
      this.$emit('toggleClick')
    }
  }
}
</script>

<style scoped>
.hamburger {
  display: inline-block;
  vertical-align: middle;
}

.hamburger.is-active {
  transform: rotate(180deg);
}
</style>
