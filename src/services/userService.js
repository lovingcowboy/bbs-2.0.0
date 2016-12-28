import Vue from 'vue'

const url = 'http://bbs5.tuandai.com/app/index.php'

export default {
  getUser (options) {
    return Vue.http.post(url, options)
  }
}
