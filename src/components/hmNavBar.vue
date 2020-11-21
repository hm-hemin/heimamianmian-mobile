<template>
  <!-- 登录页顶部导航栏的封装 -->
  <!-- van-nav-bar -->
  <!-- title:中间标题 -->
  <!-- left-title:左边文本 -->
  <!-- right-title:右边文本 -->
  <!-- left-arrow:左边箭头 -->
  <!-- @click-left:左边点击 -->
  <!-- @click-right:右边点击 -->
  <!-- slot = "title/left/right" -->
  <van-nav-bar
    class="hmNavBar"
    @click-left="$router.push(path)"
    @click-right="clickRight"
  >
    <template #left v-if="showLeft">
      <i class="iconfont f44">&#xe637;</i>
    </template>
    <template #title>
      <div class="title">{{ title }}</div>
    </template>
    <template #right>
      <div class="right">{{ right }}</div>
    </template>
  </van-nav-bar>
</template>

<script>
export default {
  // 接收父组件传递过来的值
  //   props: ['title', 'right', 'path'],
  props: {
    title: {
      type: String,
      default: undefined
    },
    right: {
      type: String,
      default: undefined
    },
    path: {
      type: String,
      default: undefined
    },
    showLeft: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {}
  },
  methods: {
    clickRight () {
      /**
       * 子触发父方法
       * 第一种方法1.this.$parent
       * 第二种方法2.通过this.$emit
       *  a.在父组件内的 子组件标签上 定义一个相应的方法 @子组件方法名 = 父组件方法
       * b.在子组件内触发该方法 this.$emit("子组件方法名")
       */
      this.$emit('clickRight')
    }
  }
}
</script>

<style lang="less" scoped>
.hmNavBar {
  .f44 {
    font-size: 44px;
  }
  .title {
    font-size: 18px;
    font-family: PingFangSC, PingFangSC-Semibold;
    font-weight: 600;
    text-align: left;
    color: #222222;
    line-height: 25px;
    letter-spacing: 0px;
  }
}
</style>
