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

import Bbsbridge from './js/lib/bbsbridge.js';
import Loader from './components/loader'

/* eslint-disable no-new */

// sync(store, router)
Fastclick.attach(document.body)
window.Bbsbridge = Bbsbridge

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
  let beforeSend = request.body.beforeSend;
  if (beforeSend && typeof beforeSend == "function") {

    request.body.beforeSend.call(this, request)

  }
  next((response) => {
    if (response.body && response.body.code === '401') {
      router.push('/main')
    }
    loader.hide()
  })
})
router.beforeEach((to, from, next) => {
  if (filters.isApp()) {
    var titleParams = {
      titleContent: '团粉圈',
      rightbuttonVisible: false,
      rightbuttonContent: '',
      rightbuttonTyppe: 1
    };
    if (to.name === 'postdetail' || to.name === 'reply') {
      titleParams.titleContent = '详情'
    } else if (to.name === 'mark') {
      titleParams.titleContent = '评分'
    } else if (to.name === 'post') {
      titleParams.titleContent = '发帖'
    }
    //判断是否需要初始化app事件注册
    if (window.WebViewJavascriptBridge) {
      Bbsbridge.exec('setTitleComponent', titleParams, function(data) {
        console.info('setTitleComponent--------', data)
      });
    } else {
      Bbsbridge.appBbsLifeHook(null, null, function() {
        Bbsbridge.exec('setTitleComponent', titleParams, function(data) {
          console.info('setTitleComponent--------', data)
        });
      });

    }
  }
  loader.show()
  next()
})

router.afterEach(function({
  to,
  next
}) {
  loader.hide()
})
const app = new Vue({
  router,
  ...App
})

app.$mount('#app')

window.Vue = Vue
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