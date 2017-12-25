import Vue from 'vue'
import App from './App.vue'
import VueResource from 'vue-resource'
var VueGoogleApps = require('vue2-google-maps')

Vue.use(VueResource)
Vue.use(VueGoogleApps, {
  load: {
    key: 'AIzaSyDfVVSKQjGSDWKsN1U-bF9atJSfWXaYWhw',
    libraries: 'places'
  }
})
new Vue({
  el: '#app',
  render: h => h(App)
})
