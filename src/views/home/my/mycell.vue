<template>
  <!-- 封装的组件 用来生成cell  如 我的岗位  产品经理 -->
  <van-cell center is-link class="cell">
    <template #icon>
      <!-- 注意这里不能使用插值表达式  需要使用v-html -->
      <i class="iconfont" v-html="icon"></i>
    </template>
    <template #title>
      <div class="cell-title">{{ title }}</div>
    </template>
    <template #default>
      <!-- 分情况显示 -->
      <img
        v-if="type === 'img' && value"
        class="img"
        :src="baseUrl + value"
        alt=""
      />
      <img
        v-else-if="type === 'img' && !value"
        class="img"
        src="@/assets/logo.png"
        alt=""
      />
      <div v-else class="cell-value">{{ value }}</div>
    </template>
  </van-cell>
</template>

<script>
export default {
  data () {
    return {
      baseUrl: process.env.VUE_APP_URL
    }
  },
  // 接收父组件传递过来的值
  props: ['icon', 'title', 'value', 'type']
}
</script>

<style lang="less" scoped>
.cell {
  //   border-radius: 8px;
  .iconfont {
    font-size: 20px;
    padding-right: 10px;
  }
  .cell-title {
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: left;
    color: #181a39;
    line-height: 20px;
    letter-spacing: 0px;
  }
  .cell-value {
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: right;
    color: #5b5d75;
    line-height: 20px;
    letter-spacing: 0px;
  }
  .img {
    width: 40px;
    height: 40px;
  }
}
</style>
