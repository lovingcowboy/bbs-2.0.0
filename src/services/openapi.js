let openapi = {}
let domain = window.location.protocol + '//192.168.8.188:7010' // dev

Object.defineProperty(openapi, 'domain', {
  value: domain,
  writable: false,
  enumerable: true,
  configurable: false
})

export default openapi
