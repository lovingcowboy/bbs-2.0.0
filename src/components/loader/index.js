/*
loader
author: Simona
使用:
let loader = Loader()
loader.show()
loader.hide()
*/
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

let returnAnInstance = instance => {
  if (instance) {
    loaderPool.push(instance)
  }
}

LoaderConstructor.prototype.show = function () {
  this.visible = true
}
LoaderConstructor.prototype.hide = function () {
  this.visible = false
  returnAnInstance(this)
}
let Loader = (options = {}) => {
  let instance = getAnInstance()
  document.body.appendChild(instance.$el)
  return instance
}

export default Loader