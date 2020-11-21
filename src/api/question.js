// 导入_fetch 封装的请求与响应拦截
import _fetch from './request'

// 模拟面试筛选条件
export function interviewFilters () {
  return _fetch({
    url: '/interview/filters'
  })
}
// 获取模拟面试题
export function interviewQuestions (params) {
  return _fetch({
    url: '/interview/questions',
    needToken: true,
    params
  })
}

// 提交面试题
export function questionsSubmit (data) {
  return _fetch({
    url: '/questions/submit',
    method: 'post',
    needToken: true,
    data
  })
}

// 面试题详情
export function questionsInfo (id) {
  return _fetch({
    url: '/questions/' + id,
    needToken: true
  })
}
