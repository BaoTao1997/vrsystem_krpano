// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import axios from 'axios'
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

Vue.prototype.$axios = axios;
axios.defaults.withCredentials=true;
axios.defaults.crossDomain=true;
Vue.config.productionTip = false;

/* eslint-disable no-new */
let vm = new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});

