/*
 * @Author: Hzh
 * @Date: 2020-07-22 18:16:18
 * @LastEditTime: 2020-09-14 15:38:15
 * @LastEditors: Hzh
 * @Description:设置登录之后获取的Token
 */
import Cookies from 'js-cookie'
import Config from '@/settings'

const TokenKey = Config.TokenKey

/**
 * @description: 获取Token
 */
export function getToken() {
  return Cookies.get(TokenKey)
}

/**
 * @description: 设置Token
 */
export function setToken(token, rememberMe) {
  if (rememberMe) {
    return Cookies.set(TokenKey, token, { expires: Config.tokenCookieExpires })
  } else return Cookies.set(TokenKey, token)
}

/**
 * @description: 删除Token
 */
export function removeToken() {
  return Cookies.remove(TokenKey)
}

// Cookies.set('name', 'value', { expires: 7 });
