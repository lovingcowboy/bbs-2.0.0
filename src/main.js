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

/* eslint-disable no-new */

// sync(store, router)
Fastclick.attach(document.body)

Vue.use(Resource)

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// 保存deviceId
// window.sessionStorage['deviceId'] = '4caaCM/5LuOQX37lMfS7TFh9Z7V7BCxJXZ+C9oxgS4pUwulQBzDQ+skMRao'

const app = new Vue({
  router,
  ...App
})

app.$mount('#app')

// new Vue({
//   el: '#app',
//   template: '<App/>',
//   components: { App },
//   router: router
// })

Vue.use(router)

router.beforeEach(function () {

})

router.afterEach(function ({to, next}) {

})
