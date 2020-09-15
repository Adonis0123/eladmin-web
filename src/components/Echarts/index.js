/*
 * @Author: Hzh
 * @Date: 2020-07-08 09:24:49
 * @LastEditTime: 2020-09-14 11:05:42
 * @LastEditors: Hzh
 * @Description:导出组件，在单个文件夹下
 */
const componentFiles = require.context('./', true, /\.vue$/)

const components = componentFiles.keys().reduce((files, filePath) => {
  const fileName = filePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = componentFiles(filePath)
  files[fileName] = value.default
  return files
}, {})

/* 为了按需引入 */
module.exports = components
