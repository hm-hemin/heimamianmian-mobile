import moment from 'moment' // 安装导入moment
export default function (Vue) {
  // 全局过滤器用来处理日期时间
  Vue.filter('formatTime', function (str, formatStr) {
    const _local = moment(str)
    const _now = moment()
    // diff可用来计算当前时间与某时间的小时差
    const _diff = _now.diff(_local, 'h')
    // 判断
    if (_diff < 1) {
      return '刚刚'
    } else if (_diff < 24) {
      return _diff + '小时前'
    } else {
      // return moment(str).format('YYYY-MM-DD HH:mm:ss')
      return moment(str).format(formatStr) // 传参
    }
  })
}
