// 导入_fetch 封装的请求与响应拦截
import _fetch from './request'
// import { getLocal } from '@/utils/local.js'
// 获取用户信息
// 这个noError是不处理错误信息 用于登录优化
function auInfo (noError = false) {
  return _fetch({
    url: '/au/info',
    method: 'get',
    needToken: true, // 是否需要使用token
    noError: noError // noError为true 不需要进行错误处理  false需要进行错误处理
    //     headers: {
    //       authorization: `Bearer ${getLocal('token')}`
    //     }
  })
}
// 修改用户资料
function auEdit (data) {
  return _fetch({
    url: '/au/edit',
    method: 'post',
    needToken: true,
    data // data:data
  })
}

// 上传图片
function upload (data) {
  return _fetch({
    url: '/upload',
    method: 'post',
    needToken: true,
    data
  })
}
// 暴露出去
export { auInfo, auEdit, upload }
