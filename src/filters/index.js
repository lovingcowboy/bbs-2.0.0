export function host(url) {
  const host = url.replace(/^https?:\/\//, '').replace(/\/.*$/, '')
  const parts = host.split('.').slice(-3)
  if (parts[0] === 'www') parts.shift()
  return parts.join('.')
}

export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

export function getMainData(num) {
  return (num + '').split('.')[0]
}

export function getDecimals(num) {
  return (num + '').split('.')[1]
}

export function dateFilter(date) {
  let _arr = date.split('-')
  return _arr[0] + '年' + _arr[1] + '月' + _arr[2] + '日'
}
export function isApp() {
  let useragent = navigator.userAgent;
  if (useragent.indexOf("tuandaiapp_android") == -1 && useragent.indexOf("tuandaiapp_IOS") == -1) {
    return false;
  } else {
    return true;
  }
}
export function isAndroid() {
  if (navigator.userAgent.match(/(Android)/)) {
    return true;
  } else {
    return false;
  }
}
export function isIos() {
  if (navigator.userAgent.match(/(iPad|iPhone)/)) {
    return true;
  } else {
    return false;
  }
}

export function isWeiXin() {
  let ua = navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    return true;
  } else {
    return false;
  }
}
export function ellipsisText(str, length) {
  length = length && +length > 0 ? +length : 6
  if (str && str.length > length) {
    return str.substr(0, length) + '...'
  } else {
    return str
  }
}

function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

function indexOf(array, item) {
    if (array == null) return -1;
    var i = 0, length = array.length;
    /*if (isSorted) {
      if (typeof isSorted == 'number') {
        i = isSorted < 0 ? Math.max(0, length + isSorted) : isSorted;
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }*/
    for (; i < length; i++) if (array[i] === item) return i;
    return -1;
}

function unique(array, iteratee, context) {
  if (array == null) return [];
  var result = [];
  var seen = [];
  for (var i = 0, length = array.length; i < length; i++) {
    var value = array[i];
    if (iteratee) {
      var computed = iteratee(value, i, array);
      if (indexOf(seen, computed) < 0) {
        seen.push(computed);
        result.push(value);
      }
    } else if (indexOf(result, value) < 0) {
      result.push(value);
    }
  }
  return result;
}

// 对列表去重
export function uniq(arr, target) {
  let list = arr /*&& arr.list*/;
   if (!list) {
    return arr;
  }

  // 去重
  list = unique(list, function(item) {
    return item[target]
  });
  
  // 防止过滤器不断触发
  /*this.compareList = [];
  for (let i = 0; i < list.length; i++) {
    this.compareList.push(convertObject(list[i]));
  }

  if (this.lastList && isArrayEqual(this.compareList, this.lastList)) {
    return list;
  }

  this.lastList = this.compareList;*/

  arr = list;

  return arr;
}

export function convertObject(value) {
  if (isPlainObject(value)) {
    // convert plain object to array.
    var keys = Object.keys(value)
    var i = keys.length
    var res = {};
    var key
    while (i--) {
      key = keys[i]
      if (key !== "__ob__" && key !== "__v-for__4") {
        res[key] = value[key];
      }
    }
    return res
  } else {
    return value;
  }
}

var toString = Object.prototype.toString
var OBJECT_STRING = '[object Object]'
export function isPlainObject(obj) {
  return toString.call(obj) === OBJECT_STRING
}
export const isArray = Array.isArray

export function isObject(obj) {
  return obj !== null && typeof obj === 'object'
}

// 判断2个数组的内容是否相等
export function isArrayEqual(arr, list) {
  if (!arr || !list) {
    return false;
  }

  if (arr.length !== list.length) {
    return false;
  }

  /*let i = 0;
  let len = arr.length;
  let isEqual = true;
  for (; i < len; i++) {
    let arrObj = convertObject(arr[i]);
    let listObj = convertObject(list[i]);
    eq(arrObj, listObj, [], []) ? '' : isEqual = false;
    if (!isEqual) {
      return isEqual;
    }
  }
  return isEqual;*/
  return eq(arr, list, [], [])
}

var hasPro = function(obj, key) {
  return obj != null && hasOwnProperty.call(obj, key);
};
var isFunction = function(obj) {
  return typeof obj == 'function' || false;
};

// Internal recursive comparison function for `isEqual`.
var eq = function(a, b, aStack, bStack) {
  // Identical objects are equal. `0 === -0`, but they aren't identical.
  // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
  if (a === b) return a !== 0 || 1 / a == 1 / b;
  // A strict comparison is necessary because `null == undefined`.
  if (a == null || b == null) return a === b;

  // Compare `[[Class]]` names.
  var className = toString.call(a);
  if (className != toString.call(b)) return false;
  switch (className) {
    // Strings, numbers, dates, and booleans are compared by value.
    case '[object String]':
      // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
      // equivalent to `new String("5")`.
      return a == String(b);
    case '[object Number]':
      // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
      // other numeric values.
      return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
    case '[object Date]':
    case '[object Boolean]':
      // Coerce dates and booleans to numeric primitive values. Dates are compared by their
      // millisecond representations. Note that invalid dates with millisecond representations
      // of `NaN` are not equivalent.
      return +a == +b;
      // RegExps are compared by their source patterns and flags.
    case '[object RegExp]':
      return a.source == b.source &&
        a.global == b.global &&
        a.multiline == b.multiline &&
        a.ignoreCase == b.ignoreCase;
  }
  if (typeof a != 'object' || typeof b != 'object') return false;
  // Assume equality for cyclic structures. The algorithm for detecting cyclic
  // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
  var length = aStack.length;
  while (length--) {
    // Linear search. Performance is inversely proportional to the number of
    // unique nested structures.
    if (aStack[length] == a) return bStack[length] == b;
  }
  // Objects with different constructors are not equivalent, but `Object`s
  // from different frames are.
  var aCtor = a.constructor,
    bCtor = b.constructor;
  if (aCtor !== bCtor && !(isFunction(aCtor) && (aCtor instanceof aCtor) &&
      isFunction(bCtor) && (bCtor instanceof bCtor)) && ('constructor' in a && 'constructor' in b)) {
    return false;
  }
  // Add the first object to the stack of traversed objects.
  aStack.push(a);
  bStack.push(b);
  var size = 0,
    result = true;
  // Recursively compare objects and arrays.
  if (className == '[object Array]') {
    // Compare array lengths to determine if a deep comparison is necessary.
    size = a.length;
    result = size == b.length;
    if (result) {
      // Deep compare the contents, ignoring non-numeric properties.
      while (size--) {
        if (!(result = eq(a[size], b[size], aStack, bStack))) break;
      }
    }
  } else {
    // Deep compare objects.
    for (var key in a) {
      if (hasPro(a, key)) {
        // Count the expected number of properties.
        size++;
        // Deep compare each member.
        if (!(result = hasPro(b, key) && eq(a[key], b[key], aStack, bStack))) break;
      }
    }
    // Ensure that both objects contain the same number of properties.
    if (result) {
      for (key in b) {
        if (hasPro(b, key) && !(size--)) break;
      }
      result = !size;
    }
  }
  // Remove the first object from the stack of traversed objects.
  aStack.pop();
  bStack.pop();
  return result;
};
