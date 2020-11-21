<template>
  <!-- 封装一个面试技巧列表 -->
  <div class="technicItem">
    <div class="left">
      <!-- van-multi-ellipsis--l2 是style内置样式  超出文本使用省略号 -->
      <div class="left-top van-multi-ellipsis--l2">
        {{ info.title }}
      </div>
      <div class="left-bottom">
        <!-- 需要使用moment和过滤器来处理日期时间 -->
        <div class="b1">
          {{ info.created_at | formatTime('YYYY-MM-DD HH:mm:ss') }}
        </div>
        <i class="iconfont b2">&#xe644;</i>
        <div class="b3">{{ info.read }}</div>
        <i class="iconfont b4">&#xe638;</i>
        <div class="b5">{{ info.star }}</div>
      </div>
    </div>
    <img v-if="info.cover" :src="baseURL + info.cover" alt="" class="right" />
  </div>
</template>

<script>
export default {
  // 接收父组件传递过来的参数
  props: ['info'],
  data () {
    return {
      baseURL: process.env.VUE_APP_URL
    }
  }
}
</script>

<style lang="less" scoped>
.technicItem {
  display: flex;
  justify-content: space-between;
  padding-top: 18px;
  .left {
    .left-top {
      font-size: 16px;
      font-family: PingFangSC, PingFangSC-Medium;
      font-weight: 500;
      text-align: left;
      color: #181a39;
      line-height: 22px;
      letter-spacing: 0px;
    }
    .left-bottom {
      display: flex;
      align-items: center;
      color: #ccc;
      font-size: 12px;
      margin-top: 10px;
      .b1 {
        flex: 1;
      }
    }
  }
  // 右图
  .right {
    width: 113px;
    height: 75px;
    // 让图片不变形
    object-fit: contain;
    margin-left: 10px;
  }
}
</style>
