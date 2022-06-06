import { createApp } from 'vue'
import App from './App.vue'
import VueRouter from './router/index'
// 重置样式
// import './assets/common/reset2.css'

import Vuex from './store/index'


createApp(App).use(VueRouter).use(Vuex).mount('#app')
