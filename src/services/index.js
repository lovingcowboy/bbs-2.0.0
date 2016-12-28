import Vue from 'vue'
import openapi from './openapi'

export default {
  getData (url, options) {
    return Vue.http.get(openapi.domain + url, options)
  },
  postData (url, options) {
    let formdata = new window.FormData()
    for (var prop in options) {
      if (options.hasOwnProperty(prop)) {
        formdata.append(prop, options[prop])
      }
    }
    return Vue.http.post(openapi.domain + url, formdata, {'headers': {'Content-Type': 'application/x-www-form-urlencoded'}})
  }
}
