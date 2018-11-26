import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import {fetch, myMessage, dedupe, messageBox} from './utils/base'

import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false
Vue.prototype.$fetch= fetch
Vue.prototype.$myMessage = myMessage
Vue.prototype.$dedupe = dedupe
Vue.prototype.$messageBox = messageBox

Vue.use(ElementUI)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
