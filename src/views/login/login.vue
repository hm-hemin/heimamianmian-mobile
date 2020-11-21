<template>
  <div class="login">
    <!-- van-nav-bar -->
    <!-- title:中间标题 -->
    <!-- left-title:左边文本 -->
    <!-- right-title:右边文本 -->
    <!-- left-arrow:左边箭头 -->
    <!-- @click-left:左边点击 -->
    <!-- @click-right:右边点击 -->
    <!-- slot = "title/left/right" -->
    <!-- 导航栏 -->
    <!-- 点击返回 -->
    <!-- <van-nav-bar @click-left="$router.push('/home/find')">
      <template #left>
        <i class="iconfont f44">&#xe637;</i>
      </template>
    </van-nav-bar> -->

    <!-- 使用公共的hmNavBar组件 -->
    <!-- 登录页只需要传递path即可 -->
    <hmNavBar path="/home/find"></hmNavBar>
    <!-- 内容区域 -->
    <div class="content">
      <h3 class="title">您好，请登录</h3>
      <van-form ref="form">
        <!-- 手机号 -->
        <van-field
          v-model="form.mobile"
          :rules="rules.mobile"
          name="mobile"
          placeholder="请输入手机号"
        >
          <template #left-icon>
            <i class="iconfont">&#xe60b;</i>
          </template>
        </van-field>
        <!-- 验证码 -->
        <van-field
          v-model="form.code"
          :rules="rules.code"
          placeholder="请输入验证码"
        >
          <template #left-icon>
            <i class="iconfont">&#xe60c;</i>
          </template>
          <template #button>
            <!-- 获取验证码或重试 -->
            <span class="code" @click="getCode" v-if="totalTime === 6"
              >获取验证码</span
            >
            <span class="code" v-else>{{ totalTime }}S后重试</span>
          </template>
        </van-field>
      </van-form>
      <div class="tip">
        登录即同意<span class="color">《用户使用协议》</span>和<span
          class="color"
          >《隐私协议》</span
        >
      </div>
      <van-button block round color="#e40137" @click="submit">确定</van-button>
    </div>
  </div>
</template>
<script>
// 导入api
import { auCode, auLogin } from '@/api/login.js'
// 导入token
import { setLocal, getLocal } from '@/utils/local.js'
export default {
  data () {
    return {
      form: {
        mobile: '',
        code: ''
      },
      totalTime: 6, // 倒计时时间
      rules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'onBlur' },
          {
            validator: value => {
              // 手机号验证
              return /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/.test(
                value
              )
            },
            message: '请正确输入手机号',
            trigger: 'onChange'
          }
        ],
        code: [{ required: true, message: '请输入验证码', trigger: 'onBlur' }]
      }
    }
  },
  created () {
    // 验证环境变量的配置
    window.console.log(process.env.VUE_APP_URL)
    // 如果存在token直接跳转到home
    if (getLocal('token')) {
      this.$router.push('/home')
    }
  },
  methods: {
    //   验证手机号
    getCode () {
      this.$refs.form
        .validate('mobile')
        .then(() => {
          // this.$toast.success('验证成功')
          // ***倒计时处理***
          // 在点击获取验证码验证通过后进行倒计时
          // 为了后面按钮倒计时一开始就不可点击
          this.totalTime--
          const _interval = setInterval(() => {
            this.totalTime--
            // 倒计时结束处理
            if (this.totalTime <= 0) {
              // 清除定时器
              clearInterval(_interval)
              // 还原时间
              this.totalTime = 6
            }
          }, 1000)

          // ***手机号验证通过获取验证码***
          auCode({ mobile: this.form.mobile })
            .then(res => {
              window.console.log(res)
              // 弹出验证码
              this.$toast.success(res.data.data)
            })
            .catch(error => {
              window.console.log(error)
            })
        })
        .catch(() => {
          this.$toast.fail('验证失败')
        })
    },
    // 确认提交
    submit () {
      this.$refs.form
        .validate()
        .then(() => {
          // 处理加载中
          this.$toast.loading('加载中')
          // this.$toast.success('验证成功')
          // 点击确定按钮在表单验证成功后调用登录api
          auLogin(this.form)
            .then(res => {
              window.console.log(res)
              this.$toast.success('登录成功')
              // 保存token
              setLocal('token', res.data.data.jwt)
              // 存储用户信息
              this.$store.commit('setUserInfo', res.data.data.user)
              // 修改用户登录状态
              this.$store.commit('getLoginState', true)
              // 清除加载中
              this.$toast.clear()
              // 从哪来回哪去
              // 在登录完成进行跳转时进行处理 如果有回跳地址我们就跳转到相应地址没有就回到home
              const _redirect = this.$route.query.redirect
              if (_redirect) {
                this.$router.push(_redirect)
              } else {
                // 跳转到home页面
                this.$router.push('/home')
              }
            })
            .catch(err => {
              window.console.log(err)
            })
        })
        .catch(() => {
          this.$toast.fail('验证失败')
        })
    }
  }
}
</script>
<style lang="less" scoped>
.login {
  // 左箭头
  .f44 {
    font-size: 44px;
  }
  // 内容区域
  .content {
    padding: 0 @p15;
    font-size: 18px;
    // h3标题
    .title {
      margin-top: 50px;
      margin-bottom: 63px;
      font-size: 18px;
      font-family: PingFangSC, PingFangSC-Semibold;
      font-weight: 600;
      text-align: left;
      color: #222222;
      line-height: 25px;
      letter-spacing: 0px;
    }
    .code {
      font-size: 16px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      text-align: left;
      color: @c;
      line-height: 22px;
      letter-spacing: 0px;
    }
    .tip {
      margin-bottom: 44px;
      font-size: 12px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      text-align: left;
      color: #181a39;
      line-height: 33px;
      letter-spacing: 0px;
      .color {
        color: @c;
      }
    }
  }
}
</style>
<style lang="less">
.login {
  .van-nav-bar__left,
  .van-nav-bar__right {
    padding: 0;
  }
}
</style>
