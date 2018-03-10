import { Platform } from 'react-native'

/**
 ** 加法函数，用来得到精确的加法结果
 ** 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
 ** 调用：accAdd(arg1,arg2)
 ** 返回值：arg1加上arg2的精确结果
 **/
export const accAdd = (arg1, arg2) => {
  let r1
  let r2
  let m
  let c
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  c = Math.abs(r1 - r2)

  // eslint-disable-next-line no-restricted-properties
  m = Math.pow(10, Math.max(r1, r2))
  // m = 10 ** Math.max(r1, r2)

  if (c > 0) {
    // eslint-disable-next-line no-restricted-properties
    const cm = Math.pow(10, c)
    if (r1 > r2) {
      arg1 = Number(arg1.toString().replace('.', ''))
      arg2 = Number(arg2.toString().replace('.', '')) * cm
    } else {
      arg1 = Number(arg1.toString().replace('.', '')) * cm
      arg2 = Number(arg2.toString().replace('.', ''))
    }
  } else {
    arg1 = Number(arg1.toString().replace('.', ''))
    arg2 = Number(arg2.toString().replace('.', ''))
  }
  return (arg1 + arg2) / m
}


export const isWeb = Platform.OS === 'web'

export const isIOS = Platform.OS === 'ios'

export const isAndroid = Platform.OS === 'android'

export const isEmpty = (value) => {
  const typeString = Object.prototype.toString.call(value).slice(8, -1)

  switch (typeString) {
    case 'Array':
      return !value.length
    case 'Object':
      return !Object.keys(value).length
    default:
      return !value
  }
}
