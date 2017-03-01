let openapi = {}
// let domain = window.location.protocol + '//192.168.8.188:7010' // dev
// let domain = window.location.protocol + '//10.100.1.39:80'
let domain = '//10.100.11.110:9500'
// let domain = '//bbs2.tuandai.com'

Object.defineProperty(openapi, 'domain', {
  value: domain,
  writable: false,
  enumerable: true,
  configurable: false
})

export default openapi
