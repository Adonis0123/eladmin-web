/*
 * @Author: Hzh
 * @Date: 2020-08-05 14:11:14
 * @LastEditTime: 2020-09-14 10:07:41
 * @LastEditors: Hzh
 * @Description:localStorage和sessionStorage工具函数
 */

/**
 * @description: Local Storage操作
 * @param {String} method get获取，set存入或覆盖，clean清除
 * @param {String} name 储存的名称
 * @param {any} obj 存入的内容，可以是任意类型
 */
const localData = function(method, name, obj) {
  switch (method) {
    case 'get':
      if (localStorage.getItem(name + '_obj')) {
        return JSON.parse(localStorage.getItem(name + '_obj'))
      } else if (localStorage.getItem(name + '_str')) {
        return localStorage.getItem(name + '_str')
      } else {
        return null
      }
    case 'set':
      localData('clean', name)
      if (typeof obj === 'object') {
        localStorage.setItem(name + '_obj', JSON.stringify(obj))
      } else {
        localStorage.setItem(name + '_str', obj)
      }
      return true
    case 'clean':
      localStorage.removeItem(name + '_obj')
      localStorage.removeItem(name + '_str')
      return true
  }
}

/**
 * @description: Session Storage操作
 * @param {String} method get获取，set存入或覆盖，clean清除
 * @param {String} name 储存的名称
 * @param {any} obj 存入的内容，可以是任意类型
 */
const sessionData = function(method, name, obj) {
  switch (method) {
    case 'get':
      if (sessionStorage.getItem(name + '_obj')) {
        return JSON.parse(sessionStorage.getItem(name + '_obj'))
      } else if (sessionStorage.getItem(name + '_str')) {
        return sessionStorage.getItem(name + '_str')
      } else {
        return null
      }
    case 'set':
      sessionData('clean', name)
      if (typeof obj === 'object') {
        sessionStorage.setItem(name + '_obj', JSON.stringify(obj))
      } else {
        sessionStorage.setItem(name + '_str', obj)
      }
      return true
    case 'clean':
      sessionStorage.removeItem(name + '_obj')
      sessionStorage.removeItem(name + '_str')
      return true
  }
}

export { localData, sessionData }
