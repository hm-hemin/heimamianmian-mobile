<template>
  <!-- 封装一个发现页的单元格组件 -->
  <div class="findCell">
    <van-cell is-link class="myCell">
      <template #title>
        <div class="title">{{ title }}</div>
      </template>
      <template #default>
        <div class="value">查看更多</div>
      </template>
    </van-cell>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  // 接收父组件传递过来的值
  props: ['title']
}
</script>

<style lang="less" scoped>
.findCell {
  .myCell {
    padding-left: 0;
    padding-right: 0;
    .title {
      font-size: 18px;
      font-family: PingFangSC, PingFangSC-Medium;
      font-weight: 600;
      text-align: left;
      color: #222222;
      line-height: 25px;
      letter-spacing: 0px;
    }
  }
}
</style>
