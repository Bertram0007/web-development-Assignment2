import Vue from 'vue'
import App from './App.vue'
import './assets/css/global.css'
import router from './router'
import store from './store'
import elementUI from "element-ui"
import axios from 'axios'

Vue.config.productionTip = false
Vue.use(elementUI)
Vue.prototype.$message = elementUI.Message
Vue.prototype.$confirm = elementUI.MessageBox.confirm

// use this.$http to send a network request
axios.defaults.baseURL = 'http://localhost:3000'
Vue.prototype.$http = axios;


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
