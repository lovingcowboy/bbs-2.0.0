export function host (url) {
  const host = url.replace(/^https?:\/\//, '').replace(/\/.*$/, '')
  const parts = host.split('.').slice(-3)
  if (parts[0] === 'www') parts.shift()
  return parts.join('.')
}

export function timeAgo (time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

export function getMainData (num) {
  return (num + '').split('.')[0]
}

export function getDecimals (num) {
  return (num + '').split('.')[1]
}

export function dateFilter (date) {
  let _arr = date.split('-')
  return _arr[0] + '年' + _arr[1] + '月' + _arr[2] + '日'
}
function pluralize (time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}
