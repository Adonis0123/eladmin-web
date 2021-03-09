/*
 * @Author: Hzh
 * @Date: 2020-09-14 09:38:49
 * @LastEditTime: 2021-03-09 09:52:34
 * @LastEditors: Hzh
 * @Description:校验函数
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/**
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email) {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

export function isvalidPhone(phone) {
  const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
  return reg.test(phone)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

/**
 * 是否合法IP地址
 * @param rule
 * @param value
 * @param callback
 */
export function validateIP(rule, value, callback) {
  if (value === '' || value === undefined || value == null) {
    callback()
  } else {
    const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
    if (!reg.test(value) && value !== '') {
      callback(new Error('请输入正确的IP地址'))
    } else {
      callback()
    }
  }
}

export function validatePort(rule, value, callback) {
  if (value === '' || value === undefined || value == null) {
    callback()
  } else {
    const reg = /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/
    if (!reg.test(value) && value !== '') {
      callback(new Error('请输入正确的端口号'))
    } else {
      callback()
    }
  }
}

/* 是否手机号码或者固话*/
export function validatePhoneTwo(rule, value, callback) {
  const reg = /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/
  if (value === '' || value === undefined || value == null) {
    callback()
  } else {
    if (!reg.test(value) && value !== '') {
      callback(new Error('请输入正确的电话号码或者固话号码'))
    } else {
      callback()
    }
  }
}

/* 是否固话*/
export function validateTelephone(rule, value, callback) {
  const reg = /0\d{2}-\d{7,8}/
  if (value === '' || value === undefined || value == null) {
    callback()
  } else {
    if (!reg.test(value) && value !== '') {
      callback(new Error('请输入正确的固话（格式：区号+号码,如010-1234567）'))
    } else {
      callback()
    }
  }
}

/* 是否手机号码*/
export function validatePhone(rule, value, callback) {
  const reg = /^[1][3,4,5,7,8][0-9]{9}$/
  if (value === '' || value === undefined || value == null) {
    callback()
  } else {
    if (!reg.test(value) && value !== '') {
      callback(new Error('请输入正确的电话号码'))
    } else {
      callback()
    }
  }
}

/* 是否身份证号码*/
export function validateIdNo(rule, value, callback) {
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  if (value === '' || value === undefined || value == null) {
    callback()
  } else {
    if (!reg.test(value) && value !== '') {
      callback(new Error('请输入正确的身份证号码'))
    } else {
      callback()
    }
  }
}

/**
 * @description: 检验特殊字符
 * @param {String} val
 *  @returns {Boolean}
 */

export function isCharacter(val) {
  const regEn = /[`~!@#$%^&*()+<>?{}\/[\]]/im
  const regCn = /[·！#￥（——）“”‘|《》？【】[\]]/im
  if (regEn.test(val) || regCn.test(val)) {
    return true
  } else {
    return false
  }
}

export function isCharacterValidator(rule, value, callback) {
  const regEn = /[`~!@#$%^&*()+<>?{}\/[\]]/im
  const regCn = /[·！#￥（——）“”‘|《》？【】[\]]/im
  if (regEn.test(value) || regCn.test(value)) {
    callback(new Error('请勿输入特殊字符'))
  } else {
    return callback()
  }
}

// 不能为纯数字
export function checkLetterAndNumber(rule, value, callback) {
  const patrn = /^[0-9]*$/
  if (value && patrn.test(value)) {
    callback(new Error('请勿输入纯数字'))
  } else {
    return callback()
  }
}

// 不能包含汉字
export function checkChineseChar(rule, value, callback) {
  const patrn = new RegExp('[\\u4E00-\\u9FFF]+', 'g')
  if (value && patrn.test(value)) {
    callback(new Error('请勿输入汉字'))
  } else {
    return callback()
  }
}

// 计算字节长度
export function byteLength(str) {
  if (str) {
    var count = 0
    for (var i = 0; i < str.length; i++) {
      if (str.charCodeAt(i) > 255) {
        count += 2
      } else {
        count++
      }
    }
    return count
  } else {
    return null
  }
}

// element 表单通用校验工具
export const elValidateUtils = {
  validateDiseaseOn: (rule, value, callback) => {
    const patrn = /(^[A-Za-z0-9]+(\-{1})?[A-Za-z0-9]+$)|(^[A-Za-z0-9]+$)/
    if (value && !patrn.exec(value)) {
      callback(new Error('请输入字母或者数字'))
    } else {
      callback()
    }
  },

  validateCharacter: (rule, value, callback) => {
    const patrn = /^[a-zA-Z][a-zA-Z0-9\.]*$/
    if (value && !patrn.exec(value)) {
      callback(new Error('请输入正确标识符'))
    } else {
      callback()
    }
  },

  validateCharacters: (rule, value, callback) => {
    const patrn = /^[a-zA-Z][a-zA-Z0-9_]*$/
    if (value && !patrn.exec(value)) {
      callback(new Error('请输入正确标识符'))
    } else {
      callback()
    }
  },

  /**
   * @description: 正整数0-23
   */
  integer23: (rule, value, callback) => {
    const patrn = /^(0|[1-9]|1\d|2[0-3])$/
    if (value && !patrn.exec(value)) {
      callback(new Error('请输入正整数0-23'))
    } else {
      callback()
    }
  },

  /**
   * @description: 正整数0-59
   */
  integer59: (rule, value, callback) => {
    const patrn = /^(0|[1-9]|[1-4]\d|5[0-9])$/
    if (value && !patrn.exec(value)) {
      callback(new Error('请输入正整数0-59'))
    } else {
      callback()
    }
  },

  /**
   * @description: 正整数1-7
   */
  integer7: (rule, value, callback) => {
    const patrn = /^([1-7])$/
    if (value && !patrn.exec(value)) {
      callback(new Error('请输入正整数1-7'))
    } else {
      callback()
    }
  },

  /**
   * @description: 正整数1-30
   */
  integer30: (rule, value, callback) => {
    const patrn = /^([1-9]|[1-2]\d|3[0])$/
    if (value && !patrn.exec(value)) {
      callback(new Error('请输入正整数1-30'))
    } else {
      callback()
    }
  },

  /**
   * @description: 正整数1-90
   */
  integer90: (rule, value, callback) => {
    const patrn = /^([1-9]|[1-8]\d|9[0])$/
    if (value && !patrn.exec(value)) {
      callback(new Error('请输入正整数1-90'))
    } else {
      callback()
    }
  },

  /**
   * @description: 正整数1-365
   */
  integer365: (rule, value, callback) => {
    const patrn = /^([1-9]|[1-9]\d|[1-3][0-6][0-5])$/
    if (value && !patrn.exec(value)) {
      callback(new Error('请输入正整数1-365'))
    } else {
      callback()
    }
  },

  // 校验字节长度
  validateByteLength: max => {
    return (rule, value, callback) => {
      if (
        max &&
        value &&
        byteLength(value + '') &&
        byteLength(value + '') > max
      ) {
        callback(new Error(`超出最大长度,${max}字节`))
      } else {
        callback()
      }
    }
  },

  // 校验数字
  validateNubmer: (rule, value, callback) => {
    const patrn = /(^[1-9]([0-9]*)(\.[0-9]{1,})?$)|(^(0){1}$)|(^[0-9]\.[0-9]{1,}?$)/
    if (value && !patrn.exec(value)) {
      callback(new Error('请输入正确的数字'))
    } else {
      callback()
    }
  },

  // 校验数字 正整数不包括0
  validatePositiveInteger: (rule, value, callback) => {
    // const patrn = /^([1-9]\d*|0)$/ //包括0
    const patrn = /^([1-9]\d*)$/ // 不包括0 /^[0-9]*[1-9][0-9]*$/
    if (value && !patrn.exec(value)) {
      callback(new Error('请输入正确的数字'))
    } else {
      callback()
    }
  },

  // N位整数,N位小数校验
  numberFmt: (integer = null, decimal = null) => {
    const integerLength = integer && integer > 0 ? `{0,${integer - 1}}` : '*' // 整数长度
    const integerErrorInfo =
      integer && integer > 0 ? `${integer || 0}位整数` : '' // 整数校验错误提示
    const decimalLength = decimal ? `{1,${decimal}}` : '{1,}' // 小数长度
    const decimalErrorInfo =
      integer && integer > 0 ? `${decimal || 0}位小数` : '' // 小数校验错误提示
    const str = `(^[1-9]([0-9]${integerLength})(\\.[0-9]${decimalLength})?$)|(^(0){1}$)|(^[0-9]\\.[0-9]${decimalLength}?$)`
    const reg = new RegExp(str)
    return (rule, value, callback) => {
      if (value && !reg.test(value)) {
        callback(
          new Error(
            `数字有误 ${
              integerErrorInfo || decimalErrorInfo
                ? '最多' + integerErrorInfo + decimalErrorInfo
                : ''
            }`
          )
        )
      } else {
        callback()
      }
    }
  },

  // 数值范围
  numRange(min = 0, max = 0) {
    return (rule, value, callback) => {
      if (value && (value < min || value > max)) {
        callback(new Error(`数值范围${min}~${max}`))
      } else {
        callback()
      }
    }
  },
  // 台湾居民居住证
  Taiwan: (rule, value, callback) => {
    const patrn = /^830000(?:19|20)\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])\d{3}[\dX]$/
    if (value && !patrn.exec(value)) {
      callback(new Error('请输入正确居住证格式'))
    } else {
      callback()
    }
  },
  // 护照
  passport: (rule, value, callback) => {
    const patrn = /^([a-zA-z]|[0-9]){5,17}$/
    if (value && !patrn.exec(value)) {
      callback(new Error('请输入正确护照格式'))
    } else {
      callback()
    }
  },
  // 户口本
  AccountBook: (rule, value, callback) => {
    const patrn = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
    if (value && !patrn.exec(value)) {
      callback(new Error('请输入正确户口本格式'))
    } else {
      callback()
    }
  },
  // 港澳居民来往内地通行证
  HongKongMacauresidents: (rule, value, callback) => {
    const patrn = /^([A-Z]\d{6,10}(\(\w{1}\))?)$/
    if (value && !patrn.exec(value)) {
      callback(new Error('请输入正确港澳通行证格式'))
    } else {
      callback()
    }
  },
  // 台胞证
  TaiwanResidents: (rule, value, callback) => {
    const patrn = /^\d{8}|^[a-zA-Z0-9]{10}|^\d{18}$/
    if (value && !patrn.exec(value)) {
      callback(new Error('请输入正确台胞证格式'))
    } else {
      callback()
    }
  },
  // 港澳居民居住证
  HongKongMacau: (rule, value, callback) => {
    const patrn = /^8[123]0000(?:19|20)\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])\d{3}[\dX]$/
    if (value && !patrn.exec(value)) {
      callback(new Error('请输入正确居住证格式'))
    } else {
      callback()
    }
  },

  // 允许英文字母、数字、下划线、中划线、点
  codeRule: (tip = '请输入正确标识符') => {
    return (rule, value, callback) => {
      const patrn = /^[\w\.-]+$/
      if (value && !patrn.test(value)) {
        callback(new Error(tip))
      } else {
        callback()
      }
    }
  },

  // 允许英文字母、中文字符、数字、下划线、中划线、点、空格
  nameRule: (tip = '请输入正确名称') => {
    return (rule, value, callback) => {
      const patrn = /^[a-zA-Z0-9_\u4e00-\u9fa5\s\-.]+$/
      if (value && !patrn.exec(value)) {
        callback(new Error(tip))
      } else {
        callback()
      }
    }
  },

  // 允许英文字母、数字及以下半角字符
  dataSourceAddressRule: (tip = '请输入正确数据源地址') => {
    return (rule, value, callback) => {
      const patrn = /[\w\ / \ . : , ; @ ? & = - _ ( )]+$/
      if (value && !patrn.exec(value)) {
        callback(new Error(tip))
      } else {
        callback()
      }
    }
  },

  // 以英文字母开头，允许英文字母、数字、下划线
  identifierRule: (tip = '请输入正确标识符') => {
    return (rule, value, callback) => {
      const patrn = /^[a-zA-Z][a-zA-Z0-9_]*$/
      if (value && !patrn.exec(value)) {
        callback(new Error(tip))
      } else {
        callback()
      }
    }
  },

  // 以英文字母开头，允许英文字母、数字、下划线、中划线
  userNameRule: (tip = '请输入正确名称') => {
    return (rule, value, callback) => {
      const patrn = /^[a-zA-Z][a-zA-Z0-9_\-]*$/
      if (value && !patrn.exec(value)) {
        callback(new Error(tip))
      } else {
        callback()
      }
    }
  },

  // 允许英文字母、数字、下划线、中划线
  passwordRule: (tip = '请输入正确密码') => {
    return (rule, value, callback) => {
      const patrn = /^[\w\ _ - @ . ,]+$/
      if (value && !patrn.exec(value)) {
        callback(new Error(tip))
      } else {
        callback()
      }
    }
  },

  // 允许英文字母、中文字符、数字、下划线、中划线、点
  directoryNameRule: (tip = '请输入正确名称') => {
    return (rule, value, callback) => {
      const patrn = /^[a-zA-Z0-9_\u4e00-\u9fa5\-.]+$/
      if (value && !patrn.exec(value)) {
        callback(new Error(tip))
      } else {
        callback()
      }
    }
  },

  // 数据库密码
  databasePasswordRule: (tip = '请输入正确密码格式') => {
    return (rule, value, callback) => {
      const patrn = /^[a-zA-Z0-9_\u4e00-\u9fa5\-.]+$/
      if (value && !patrn.exec(value)) {
        callback(new Error(tip))
      } else {
        callback()
      }
    }
  }
}

// vxe-table 通用校验工具
export const vxeValidateUtils = {
  validateCharacters: ({ cellValue, row }) => {
    const patrn = /^[a-zA-Z][a-zA-Z0-9_]*$/
    if (cellValue && !patrn.exec(cellValue)) {
      return new Error('请输入正确标识符')
    }
  },

  // 校验数字 正整数不包括0
  validatePositiveInteger: ({ cellValue, row }) => {
    const patrn = /^([1-9]\d*)$/
    if (cellValue && !patrn.exec(cellValue)) {
      return new Error('请输入正确的数字')
    }
  },

  // 允许英文字母、中文字符、数字、下划线、中划线、点
  directoryNameRule: (tip = '请输入正确名称') => {
    return ({ cellValue, row }) => {
      const patrn = /^[a-zA-Z0-9_\u4e00-\u9fa5\-.]+$/
      if (cellValue && !patrn.exec(cellValue)) {
        return new Error(tip)
      }
    }
  },

  // 校验字节长度
  validateByteLength: max => {
    return ({ cellValue, row }) => {
      if (
        max &&
        cellValue &&
        byteLength(cellValue + '') &&
        byteLength(cellValue + '') > max
      ) {
        return new Error(`超出最大长度,${max}字节`)
      }
    }
  },

  // 以英文字母开头，允许英文字母、数字、下划线
  identifierRule: (tip = '请输入正确标识符') => {
    return ({ cellValue, row }) => {
      const patrn = /^[a-zA-Z][a-zA-Z0-9_]*$/
      if (cellValue && !patrn.exec(cellValue)) {
        return new Error(tip)
      }
    }
  },

  // 允许英文字母、中文字符、数字、下划线、中划线、点、空格
  nameRule: (tip = '请输入正确名称') => {
    return ({ cellValue, row }) => {
      const patrn = /^[a-zA-Z0-9_\u4e00-\u9fa5\s\-.]+$/
      if (cellValue && !patrn.exec(cellValue)) {
        return new Error(tip)
      }
    }
  }
}
