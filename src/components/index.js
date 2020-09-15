/*
 * @Author: Hzh
 * @Date: 2020-09-14 11:06:04
 * @LastEditTime: 2020-09-14 11:06:07
 * @LastEditors: Hzh
 * @Description:
 */
const componentFiles = require.context('./', true, /\index.vue$/)

const components = componentFiles.keys().reduce((files, filePath) => {
  const fileName = filePath.replace(/^\.\/(.*)\/index\.\w+$/, '$1')
  const name = fileName.replace(/\/pages/, '')
  const value = componentFiles(filePath)
  files[name] = value.default
  return files
}, {})

/* 为了按需引入 */
module.exports = components
