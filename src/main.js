import Vue from 'vue'
import Resource from 'vue-resource'
import App from './App.vue'
// import store from './store'
import router from './router'
// import { sync } from 'vuex-router-sync'
import * as filters from './filters'
import Fastclick from 'fastclick'
// import 'mint-ui/lib/style.css'

// 全局化css
import './sass/common.scss'

// 全局化工具库Util
import './js/Util.js'

import Loader from './components/loader'

/* eslint-disable no-new */

// sync(store, router)
Fastclick.attach(document.body)

Vue.use(Resource)

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

let loader = Loader()
Vue.http.options.emulateJSON = true
Vue.http.interceptors.push((request, next) => {
    // continue to next interceptor
    if (!request.body.notLoader) {
      loader.show()
    }
    next((response) => {
      loader.hide()
    })
  })
router.beforeEach((to, from, next) => {
	loader.show()
	next()
})

router.afterEach(function ({to, next}) {
	loader.hide()
})
const app = new Vue({
  router,
  ...App
})

app.$mount('#app')
// window.mySessionStorage = {}

// new Vue({
//   el: '#app',
//   template: '<App/>',
//   components: { App },
//   router: router
// })

// Vue.use(router)

// router.beforeEach(function () {

// })

// router.afterEach(function ({to, next}) {

// })
