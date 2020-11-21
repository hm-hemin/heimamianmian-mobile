import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入登录页面
import login from '../views/login/login.vue'
import home from '../views/home/home.vue'
import company from '../views/home/company/company.vue'
import question from '../views/home/question/question.vue'
import questionInfo from '../views/home/question/questionInfo.vue'
import my from '../views/home/my/my.vue'
import myInfo from '../views/home/my/myInfo.vue'
import editInfo from '../views/home/my/editInfo.vue'
import find from '../views/home/find/find.vue'
import shareList from '../views/home/find/shareList.vue'
import shareInfo from '../views/home/find/shareInfo.vue'
import store from '@/store'
import { getLocal } from '@/utils/local.js'
import { auInfo } from '@/api/my.js'
// 使用路由
Vue.use(VueRouter)

const router = new VueRouter({
  // 配置路由规则
  routes: [
    {
      path: '/',
      redirect: '/login' // 重定向
    },
    {
      path: '/login',
      component: login
    },
    {
      path: '/home',
      component: home,
      redirect: '/home/my', // 重定向
      children: [
        {
          path: '/home/company',
          component: company,
          meta: {
            needTab: true // 是否需要tab栏
          }
        },
        {
          path: '/home/question',
          component: question,
          meta: {
            needLogin: true, // 是否需要登录
            needTab: true
          }
        },
        {
          path: '/home/questionInfo', // 题库详情
          component: questionInfo,
          meta: {
            needLogin: true // 是否需要登录
          }
        },
        {
          path: '/home/find',
          component: find,
          meta: {
            needTab: true
          }
        },
        {
          path: '/home/my',
          component: my,
          meta: {
            needLogin: true,
            needTab: true
          }
        },
        {
          path: '/home/myInfo', // 我的资料
          component: myInfo,
          meta: {
            needLogin: true
          }
        },
        {
          path: '/home/editInfo', // 编辑资料
          component: editInfo,
          meta: {
            needLogin: true
          }
        },
        {
          path: '/home/shareList', // 面经分享
          component: shareList
        },
        {
          // 动态路由传参
          path: '/home/shareInfo/:id', // 面经详情
          component: shareInfo
        }
      ]
    }
  ]
})
// 导航守卫 前置守卫
/**
 * 如果不需要登录 next()
 * 如果需要登录
 ****如果已经登录 next()
 ****如果没有登录
 *******如果没有token 跳转到登录页
 *******如果有token 调用接口获取用户信息 用户信息获取完成后保存到vuex 再next()
 */
router.beforeEach((to, from, next) => {
  // 跳转前记录滚动的高度
  const _scrollTop =
    document.documentElement.scrollTop ||
    window.pageYOffset ||
    document.body.scrollTop
  // 通过路由元信息来记录滚动高度
  from.meta.xxx = _scrollTop

  //   window.console.log('to:', to) // 就是去往的页面的路由信息
  // to:去哪里 from:从哪来 next:是否允许通过 允许:next()  不允许:next(path)
  if (!to.meta.needLogin) {
    // 不需要登录
    next()
    //  获取用户信息  当前用户没有登录且有token
    if (!store.state.isLogin && getLocal('token')) {
      // ***获取用户信息  这里不需要进行错误处理 所以noError为true**
      auInfo(true).then(res => {
        store.commit('setUserInfo', res.data.data)
        store.commit('getLoginState', true)
      })
    }
  } else {
    // 需要登录
    // store === this.$store
    if (store.state.isLogin) {
      // 已登录
      next()
    } else {
      // 没登录
      if (!getLocal('token')) {
        // 没token跳到登录页
        // 路由传参 传：this.$router.push("path?参数名=值")  收：this.$route.query.参数名
        // 在回到登录页的时候带上要去的路由的fullPath
        next('/login?redirect=' + to.fullPath)
      } else {
        // 有token 则存储用户信息 设置登录状态为true
        auInfo().then(res => {
          window.console.log('导航守卫获取用户信息：', res)
          // 调用store里的mutations
          store.commit('setUserInfo', res.data.data) // 存储用户信息
          store.commit('getLoginState', true) // 设置登录状态
          next()
        })
      }
    }
  }
})

// 后置守卫
router.afterEach((to, from) => {
  // 路由跳转后滚动到顶部
  window.scrollTo(0, 0)
})

// 获取原型对象上的push函数
const originalPush = VueRouter.prototype.push
// 修改原型对象中的push方法
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
// 导出路由
export default router
