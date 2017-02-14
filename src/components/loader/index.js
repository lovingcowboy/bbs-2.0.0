import Vue from 'vue'

const LoaderConstructor = Vue.extend(require('./loader.vue'))
let loaderPool = []

let getAnInstance = () => {
  if (loaderPool.length > 0) {
    let instance = loaderPool[0]
    loaderPool.splice(0, 1)
    return instance
  }
  return new LoaderConstructor({
    el: document.createElement('div')
  })
}

LoaderConstructor.prototype.show = function () {
  this.visible = true
}
LoaderConstructor.prototype.hide = function () {
  this.visible = false
}
let Loader = (options = {}) => {
  let instance = getAnInstance()
  document.body.appendChild(instance.$el)
  return instance
}

export default Loader
