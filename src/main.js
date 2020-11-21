import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入flexible（注意要放在上面 否则会报错）
import 'amfe-flexible'
// 导入vant   官网复制即可
import Vant from 'vant'
import 'vant/lib/index.css'
// 导入normalize  因为浏览器会为标签添加一些独有的默认样式 这会带来一定的显示差异
import 'normalize.css'
// 引入字体图标iconfont
import '@/style/font/iconfont.css'
// 导入main.js
import '@/style/main.css'
// 导入登录页顶部导航栏组件hmNavBar
import hmNavBar from '@/components/hmNavBar.vue'
// 导入common.js  全局过滤器写在里面
import common from '@/utils/common.js'
// Vue.component("名字","组件")   组件的全局注册
Vue.component('hmNavBar', hmNavBar)

// 使用 vant
Vue.use(Vant)
Vue.use(common)
new Vue({
  router, // 把路由注入到Vue实例中 这样整个项目就拥有路由功能
  store,
  render: h => h(App)
}).$mount('#app')
