// 导入_fetch 封装的请求与响应拦截
import _fetch from './request'

// 获取验证码
function auCode (data) {
  return _fetch({
    method: 'post',
    url: '/au/code',
    data
  })
}
// 登录
function auLogin (data) {
  return _fetch({
    method: 'post',
    url: '/au/login',
    data
  })
}
// 暴露出去
export { auCode, auLogin }
