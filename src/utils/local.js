// 获取token
function getLocal (key) {
  return window.localStorage.getItem(key)
}
// 设置token
function setLocal (key, value) {
  return window.localStorage.setItem(key, value)
}
// 删除token
function removeLocal (key) {
  return window.localStorage.removeItem(key)
}
// 导出
export { getLocal, setLocal, removeLocal }
