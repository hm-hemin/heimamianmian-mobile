// 导入_fetch 封装的请求与响应拦截
import _fetch from './request'

// 获取面试技巧列表
export function articlesTechnic (params) {
  return _fetch({
    url: '/articles/technic',
    params
  })
}

// 获取热门职位数据（市场数据）
export function chartDataHot () {
  return _fetch({
    url: '/chart-data/hot'
  })
}

// 获取面经分享列表数据 （文章模块下的）
export function articlesShare (params) {
  return _fetch({
    url: '/articles/share',
    params
  })
}

// 获取面经热搜
export function articlesShareTopSearch () {
  return _fetch({
    url: '/articles/shareTopSearch'
  })
}

// 获取面经详情
export function articlesShareInfo (id) {
  return _fetch({
    url: '/articles/share/' + id
  })
}
// 获取面经分享评论列表
export function articlesCommentsList (id, params) {
  return _fetch({
    url: '/articles/comments/' + id,
    params
  })
}
// 发表评论
export function articlesComments (data) {
  return _fetch({
    url: '/articles/comments',
    method: 'post',
    needToken: true,
    data
  })
}
// 收藏面经
export function articlesCollect (data) {
  return _fetch({
    url: '/articles/collect',
    method: 'post',
    needToken: true,
    data
  })
}

// 点赞文章
export function articlesStar (data) {
  return _fetch({
    url: '/articles/star',
    method: 'post',
    needToken: true,
    data
  })
}

// 面经评论点赞
export function articleCommentsStar (data) {
  return _fetch({
    url: '/article-comments/star',
    method: 'post',
    needToken: true,
    data
  })
}
