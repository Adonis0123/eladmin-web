/*
 * @Author: Hzh
 * @Date: 2020-07-13 11:28:22
 * @LastEditTime: 2020-09-14 10:05:08
 * @LastEditors: Hzh
 * @Description:自动导出图片
 */
const modulesFiles = require.context('./', true, /\.png$/)

const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value
  return modules
}, {})

module.exports = modules