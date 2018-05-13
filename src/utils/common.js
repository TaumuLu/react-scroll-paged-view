import { Platform } from 'react-native'

export const isWeb = Platform.OS === 'web'

export const isIOS = Platform.OS === 'ios'

export const isAndroid = Platform.OS === 'android'

export const getType = (object) => {
  return Object.prototype.toString.call(object).slice(8, -1)
}

export const isEmpty = (value) => {
  const type = getType(value)

  switch (type) {
    case 'Array':
      return !value.length
    case 'Object':
      return !Object.keys(value).length
    default:
      return !value
  }
}

const baseGetSet = (path) => {
  const type = getType(path)
  switch (type) {
    case 'Array':
      return path
    case 'String':
    case 'Number':
      return `${path}`.split('.')
    default:
      return []
  }
}

export const get = (object, path, defaultValue) => {
  const pathArray = baseGetSet(path)

  return pathArray.reduce((obj, key) => {
    return (obj && obj[key]) ? obj[key] : null
  }, object) || defaultValue
}

export const set = (object, path, value) => {
  const pathArray = baseGetSet(path)
  const len = pathArray.length

  return pathArray.reduce((obj, key, ind) => {
    if (obj && ind === len - 1) {
      obj[key] = value
    }

    return obj ? obj[key] : null
  }, object)
}

const getKeys = Object.keys || ((obj) => {
  const arr = []
  for (const i in obj) {
    if (obj.hasOwnProperty(i)) {
      arr.push(i)
    }
  }
  return arr
})

const keys = (value) => {
  const type = getType(value)

  switch (type) {
    case 'Array':
    case 'Object':
      return getKeys(value)
    default:
      return []
  }
}

export const size = (value) => {
  if (value) {
    const type = getType(value)
    switch (type) {
      case 'Array':
        return value.length
      case 'Object':
        return keys(value).length
      default:
        return value.length || 0
    }
  }
  return 0
}

export const find = (value, handle) => {
  if (value) {
    const type = getType(value)
    switch (type) {
      case 'Array':
        return value.find || ((value) => {
          const len = size(value)
          for (let i = 0; i < len; i++) {
            const item = value[i]
            if (handle(item, i, value)) return item
          }
          return undefined
        })
      default:
        return undefined
    }
  }
  return undefined
}

export const findLast = (value, handle) => {
  const arr = value && value.reverse && value.reverse()
  return find(arr, handle)
}

export const mergeWith = (originObject, mergeObject, handle) => {
  const originKeys = keys(originObject)
  const mergeKeys = keys(mergeObject)
  const reObject = {}
  originKeys.forEach((key) => {
    const mergeIndex = mergeKeys.indexOf(key)
    if (mergeIndex > -1) {
      reObject[key] = handle(originObject[key], mergeObject[key], key, originObject, mergeObject)
      mergeKeys.splice(mergeIndex, 1)
    } else {
      reObject[key] = originObject[key]
    }
  })
  mergeKeys.forEach((key) => {
    reObject[key] = mergeObject[key]
  })

  return reObject
}

export const getMergeProps = (originProps, mergeProps) => {
  return mergeWith(originProps, mergeProps, (originValue, mergeValue) => {
    const type = getType(originValue)

    switch (type) {
      case 'array':
        return [...originValue, ...mergeValue]
      case 'function':
        return (...params) => { originValue(...params); mergeValue(...params) }
      case 'object':
        return { ...originValue, ...mergeValue }
      default:
        return mergeValue
    }
  })
}

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
