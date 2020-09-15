// template.js
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

<style lang="less" scoped>
  .${compoenntName}{

  }
</style>
`
  }
}
