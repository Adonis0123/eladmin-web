<!--
 * @Author: Hzh
 * @Date: 2020-09-14 09:38:49
 * @LastEditTime: 2020-09-16 09:48:52
 * @LastEditors: Hzh
 * @Description:项目文档
-->

<template>
  <div>
    <svg-icon icon-class="doc" @click="click" />
  </div>
</template>

<script>
export default {
  name: 'Doc',
  methods: {
    click() {
      window.open('https://el-admin.vip/guide/', '_blank')
    }
  }
}
</script>
