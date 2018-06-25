export const noop = () => {}

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

const keys = (value) => {
  const type = getType(value)

  switch (type) {
    case 'Array':
    case 'Object':
      return Object.keys(value)
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

const getFind = (value, handle) => {
  const len = size(value)
  for (let i = 0; i < len; i++) {
    const item = value[i]
    if (handle(item, i, value)) return item
  }
  return undefined
}

export const find = (value, handle) => {
  if (value) {
    const type = getType(value)
    switch (type) {
      case 'Array':
        return value.find ? value.find(handle) : getFind(value, handle)
      default:
        return undefined
    }
  }
  return undefined
}

export const findLast = (value, handle) => {
  const arr = value && value.reverse && value.slice().reverse()
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

export const mergeStyle = (...styles) => styles.reduce((p, c) => ({ ...(p || {}), ...(c || {}) }), {})

export const getMergeObject = (originObject, mergeObject) => {
  return mergeWith(originObject, mergeObject, (originValue, mergeValue) => {
    const type = getType(originValue)

    switch (type) {
      case 'Array':
        return [...originValue, ...mergeValue]
      case 'Function':
        return (...params) => { originValue(...params); mergeValue(...params) }
      case 'Object':
        return { ...originValue, ...mergeValue }
      default:
        return mergeValue
    }
  })
}

export const getDisplayName = (component) => {
  return component.displayName || component.name || 'Component'
}

export const getPrototypeOf = (object) => {
  return Object.getPrototypeOf ? Object.getPrototypeOf(object) : object.__proto__
}

export const copyStatic = (target, source, options) => {
  const { finallyInherit = Object, exclude = [] } = options || {}
  const inherited = getPrototypeOf(source)

  if (inherited && inherited !== getPrototypeOf(finallyInherit)) {
    copyStatic(target, inherited, options)
  }

  const propertys = Object.keys(source)
  propertys.forEach((key) => {
    if (exclude.indexOf(key) !== -1) {
      target[key] = source[key]
    }
  })

  return target
}

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
