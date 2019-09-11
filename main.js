import Vue from 'vue'
import App from './App'

// #ifdef H5
import LisTree from './components/lis-tree/lis-tree.vue'
// #endif

Vue.config.productionTip = false

// #ifdef H5
Vue.component('lis-tree', LisTree)
// #endif

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
