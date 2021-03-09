/*
 * @Author: Hzh
 * @Date: 2020-09-14 09:38:49
 * @LastEditTime: 2021-03-09 09:52:13
 * @LastEditors: Hzh
 * @Description:
 */
import axios from 'axios'
import { getToken } from '@/utils/auth'

export function upload(api, file) {
  var data = new FormData()
  data.append('file', file)
  const config = {
    headers: { 'Authorization': getToken() }
  }
  return axios.post(api, data, config)
}
