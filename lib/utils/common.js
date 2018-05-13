'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.accAdd = exports.getMergeProps = exports.mergeWith = exports.findLast = exports.find = exports.size = exports.set = exports.get = exports.isEmpty = exports.getType = exports.isAndroid = exports.isIOS = exports.isWeb = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _reactNative = require('react-native');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var isWeb = exports.isWeb = _reactNative.Platform.OS === 'web';

var isIOS = exports.isIOS = _reactNative.Platform.OS === 'ios';

var isAndroid = exports.isAndroid = _reactNative.Platform.OS === 'android';

var getType = exports.getType = function getType(object) {
  return Object.prototype.toString.call(object).slice(8, -1);
};

var isEmpty = exports.isEmpty = function isEmpty(value) {
  var type = getType(value);

  switch (type) {
    case 'Array':
      return !value.length;
    case 'Object':
      return !Object.keys(value).length;
    default:
      return !value;
  }
};

var baseGetSet = function baseGetSet(path) {
  var type = getType(path);
  switch (type) {
    case 'Array':
      return path;
    case 'String':
    case 'Number':
      return ('' + path).split('.');
    default:
      return [];
  }
};

var get = exports.get = function get(object, path, defaultValue) {
  var pathArray = baseGetSet(path);

  return pathArray.reduce(function (obj, key) {
    return obj && obj[key] ? obj[key] : null;
  }, object) || defaultValue;
};

var set = exports.set = function set(object, path, value) {
  var pathArray = baseGetSet(path);
  var len = pathArray.length;

  return pathArray.reduce(function (obj, key, ind) {
    if (obj && ind === len - 1) {
      obj[key] = value;
    }

    return obj ? obj[key] : null;
  }, object);
};

var getKeys = Object.keys || function (obj) {
  var arr = [];
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      arr.push(i);
    }
  }
  return arr;
};

var keys = function keys(value) {
  var type = getType(value);

  switch (type) {
    case 'Array':
    case 'Object':
      return getKeys(value);
    default:
      return [];
  }
};

var size = exports.size = function size(value) {
  if (value) {
    var type = getType(value);
    switch (type) {
      case 'Array':
        return value.length;
      case 'Object':
        return keys(value).length;
      default:
        return value.length || 0;
    }
  }
  return 0;
};

var find = exports.find = function find(value, handle) {
  if (value) {
    var type = getType(value);
    switch (type) {
      case 'Array':
        return value.find || function (value) {
          var len = size(value);
          for (var i = 0; i < len; i++) {
            var item = value[i];
            if (handle(item, i, value)) return item;
          }
          return undefined;
        };
      default:
        return undefined;
    }
  }
  return undefined;
};

var findLast = exports.findLast = function findLast(value, handle) {
  var arr = value && value.reverse && value.reverse();
  return find(arr, handle);
};

var mergeWith = exports.mergeWith = function mergeWith(originObject, mergeObject, handle) {
  var originKeys = keys(originObject);
  var mergeKeys = keys(mergeObject);
  var reObject = {};
  originKeys.forEach(function (key) {
    var mergeIndex = mergeKeys.indexOf(key);
    if (mergeIndex > -1) {
      reObject[key] = handle(originObject[key], mergeObject[key], key, originObject, mergeObject);
      mergeKeys.splice(mergeIndex, 1);
    } else {
      reObject[key] = originObject[key];
    }
  });
  mergeKeys.forEach(function (key) {
    reObject[key] = mergeObject[key];
  });

  return reObject;
};

var getMergeProps = exports.getMergeProps = function getMergeProps(originProps, mergeProps) {
  return mergeWith(originProps, mergeProps, function (originValue, mergeValue) {
    var type = getType(originValue);

    switch (type) {
      case 'array':
        return [].concat(_toConsumableArray(originValue), _toConsumableArray(mergeValue));
      case 'function':
        return function () {
          originValue.apply(undefined, arguments);mergeValue.apply(undefined, arguments);
        };
      case 'object':
        return _extends({}, originValue, mergeValue);
      default:
        return mergeValue;
    }
  });
};

/**
 ** 加法函数，用来得到精确的加法结果
 ** 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
 ** 调用：accAdd(arg1,arg2)
 ** 返回值：arg1加上arg2的精确结果
 **/
var accAdd = exports.accAdd = function accAdd(arg1, arg2) {
  var r1 = void 0;
  var r2 = void 0;
  var m = void 0;
  var c = void 0;
  try {
    r1 = arg1.toString().split('.')[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split('.')[1].length;
  } catch (e) {
    r2 = 0;
  }
  c = Math.abs(r1 - r2);

  // eslint-disable-next-line no-restricted-properties
  m = Math.pow(10, Math.max(r1, r2));
  // m = 10 ** Math.max(r1, r2)

  if (c > 0) {
    // eslint-disable-next-line no-restricted-properties
    var cm = Math.pow(10, c);
    if (r1 > r2) {
      arg1 = Number(arg1.toString().replace('.', ''));
      arg2 = Number(arg2.toString().replace('.', '')) * cm;
    } else {
      arg1 = Number(arg1.toString().replace('.', '')) * cm;
      arg2 = Number(arg2.toString().replace('.', ''));
    }
  } else {
    arg1 = Number(arg1.toString().replace('.', ''));
    arg2 = Number(arg2.toString().replace('.', ''));
  }
  return (arg1 + arg2) / m;
};