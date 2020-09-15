/*
 * @Author: Hzh
 * @Date: 2020-09-14 10:00:32
 * @LastEditTime: 2020-09-15 14:00:05
 * @LastEditors: Hzh
 * @Description:自动生成编译模板
 */

module.exports = {
  vueTemplate: compoenntName => {
    return `<template>
  <div class="${compoenntName}"></div>
</template>

<script>
export default {
  name: '${compoenntName}',

  components: {},

  mixins: [],

  props: {},

  data() {
    return {}
  },

  computed: {},

  watch: {},

  created() {},

  mounted() {},

  destroyed() {},

  methods: {}
}
</script>

<style lang="scss" scoped>
  .${compoenntName}{

  }
</style>
`
  }
}
