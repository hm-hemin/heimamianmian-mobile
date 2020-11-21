import Vue from 'vue'
import Vuex from 'vuex'
import { auInfo } from '@/api/my.js'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 用于获取用户信息
    userInfo: '', // 用户信息
    isLogin: '' // 是否已登录
  },
  mutations: {
    // 用于设置userInfo
    setUserInfo (state, value) {
      state.userInfo = value
    },
    // 用于设置用户登录状态
    getLoginState (state, value) {
      state.isLogin = value
    }
  },
  actions: {
    //  调用接口更新用户信息
    getUserInfo (store) {
      //  store.commit   调用mutations里面的方法
      auInfo().then(res => {
        store.commit('setUserInfo', res.data.data)
        store.commit('getLoginState', true)
      })
    }
    // 调用actions里面的方法:this.$store.dispatch("getUserInfo")
  },
  modules: {}
})
