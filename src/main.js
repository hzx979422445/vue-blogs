// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Element from 'element-ui'
import http from './service/http'
import validate from './service/validate'
import util from './service/util'
import mavonEditor from 'mavon-editor'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/iconfont/iconfont.css'
import 'mavon-editor/dist/css/index.css'
Vue.config.productionTip = false
Vue.use(Element)
Vue.use(validate)
Vue.use(util)
Vue.use(mavonEditor)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  http,
  render: h => h(App)
}).$mount('#app')
