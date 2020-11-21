<template>
  <!-- 封装的组件 是面经分享下的每一个列表 -->
  <div class="shareItem">
    <!-- van-multi-ellipsis--l2当文本内容长度超过容器最大宽度时，自动省略多余的文本。 -->
    <!-- v-html="info.title" 这里使用v-html  因为要是关键字变红 使用了span包起来 -->
    <!-- 注册点击事件 点击后跳转到分享详情页 -->
    <h3
      class="title van-multi-ellipsis--l2"
      v-html="info.title"
      @click="goShareInfo"
    >
      {{ info.title }}
    </h3>
    <div class="txt  van-multi-ellipsis--l2" @click="goShareInfo">
      {{ info.content }}
    </div>
    <div class="other">
      <!-- 如果有avatar才显示 -->
      <img
        v-if="info.author.avatar"
        :src="baseUrl + info.author.avatar"
        class="o1"
        alt=""
      />
      <img v-else src="@/assets/logo.png" class="o1" alt="" />
      <div class="o2">{{ info.author.nickname }}</div>
      <div class="o3">{{ info.created_at | formatTime('YYYY-MM-DD') }}</div>
      <i class="iconfont o4">&#xe65b;</i>
      <div class="o5">{{ info.read }}</div>
      <i class="iconfont o6">&#xe638;</i>
      <div class="o7">{{ info.star }}</div>
    </div>
  </div>
</template>

<script>
export default {
  // 接收父组件传递过来的数据
  props: ['info'],
  data () {
    return {
      baseUrl: process.env.VUE_APP_URL
    }
  },
  methods: {
    // 跳转到分享详情页
    goShareInfo () {
      // 路由传参  拿到回跳地址和文章id
      // this.$router.push(
      //   '/home/shareInfo?rePath=' + this.$route.fullPath + '$id=' + this.info.id
      // )
      // this.$router.push("/home/shareInfo/参数值")  路由跳转时传参
      this.$router.push(
        `/home/shareInfo/${this.info.id}?rePath=` + this.$route.fullPath
      )
    }
  }
}
</script>

<style lang="less">
.shareItem {
  margin-top: 20px;
  .title {
    font-size: 16px;
    font-family: PingFangSC, PingFangSC-Medium;
    font-weight: 600;
    text-align: left;
    color: #181a39;
    line-height: 23px;
    letter-spacing: 0px;
    padding-bottom: 10px;
  }
  .txt {
    font-size: 13px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: left;
    color: #545671;
    line-height: 19px;
    letter-spacing: 0px;
  }
  .other {
    display: flex;
    align-items: center;
    font-size: 12px;
    color: #ccc;
    padding-top: 10px;
    .o1 {
      width: 22px;
      height: 22px;
      border-radius: 50%;
    }
    .o2 {
      flex: 1;
      padding-left: 10px;
    }
    .o4,
    .o6 {
      padding: 0 3px 0 10px;
    }
  }
}
</style>
