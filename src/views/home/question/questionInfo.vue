<template>
  <!-- v-if="list[currIndex]"一定不能忘了  否则会报错  -->
  <div class="questionInfo" v-if="bol">
    <hmNavBar
      isLink
      title="刷题"
      right="答题卡"
      path="/home/question"
      @clickRight="rightClick"
    ></hmNavBar>
    <div class="content" v-if="list.length > 0 && list[currIndex].detail">
      <!-- 题目 -->
      <div class="title">
        【{{ typeObj[list[currIndex].detail.type] }}】{{
          list[currIndex].detail.title
        }}
      </div>
      <!-- 标签 -->
      <div class="tag-list">
        <van-tag
          class="tag"
          color="#f7f4f5"
          text-color="#c2c1c9"
          v-for="(item, index) in list[currIndex].detail.tag"
          :key="index"
          >{{ item }}</van-tag
        >
      </div>
      <!-- 选项 -->
      <!-- *************************************单选 -->
      <ul class="select" v-if="list[currIndex].detail.type === 1">
        <!-- 当单选题答案等于当前选项转换过来的答案时添加active类 -->
        <!-- 正确:有答案 且当前选项与正确答案一致 -->
        <!-- 错误：1.有答案 2.当前选项===自己回答的选项 3.选择的答案不等于正确答案 -->
        <li
          class="select-item"
          v-for="(item, index) in list[currIndex].detail.option"
          :key="index"
          :class="{
            active: ans1 === str[index],
            right:
              list[currIndex].ans &&
              list[currIndex].ans.singleAnswer === str[index],
            error:
              list[currIndex].ans &&
              ans1 === str[index] &&
              ans1 !== list[currIndex].ans.singleAnswer
          }"
          @click="liClick(index)"
        >
          {{ str[index] }}.{{ item }}
        </li>
      </ul>
      <!-- *************************************多选 -->
      <ul class="select" v-else-if="list[currIndex].detail.type === 2">
        <li
          class="select-item"
          :class="{
            active: ans2.includes(str[index]),
            right:
              list[currIndex].ans &&
              list[currIndex].ans.multipleAnswer.includes(str[index])
          }"
          v-for="(item, index) in list[currIndex].detail.option"
          :key="index"
          @click="liClick2(index)"
        >
          {{ str[index] }}.{{ item }}
        </li>
      </ul>
      <!-- *************************************简答-->
      <div class="select2" v-else>
        <van-field
          type="textarea"
          rows="4"
          class="field"
          v-model="ans3"
          @input="input"
          :disabled="step > 1"
          placeholder="请输入答案"
        >
        </van-field>
      </div>
      <!-- *************************************答案解析 -->
      <div class="answer" v-if="step > 1">
        <h3 class="title">答案解析</h3>
        <!-- 单选答案 -->
        <div class="answer-right" v-if="list[currIndex].detail.type === 1">
          正确答案:{{ list[currIndex].ans.singleAnswer }}
        </div>
        <!-- 多选答案 -->
        <div class="answer-right" v-else-if="list[currIndex].detail.type === 2">
          正确答案:{{ list[currIndex].ans.multipleAnswer.join('') }}
        </div>
        <div class="other">
          <span>难度:{{ difficulty[list[currIndex].ans.difficulty] }}</span>
          <span>提交次数:{{ list[currIndex].ans.submitNum }}</span>
          <span>正确次数:{{ list[currIndex].ans.correctNum }}</span>
        </div>
        <div class="answer-txt">
          {{ list[currIndex].ans.answerAnalysis }}
        </div>
      </div>
      <!-- *************************************底部 -->
      <div class="footer">
        <div class="f1">
          <div class="iconfont">&#xe611;</div>
          <div class="txt">收藏</div>
        </div>
        <div class="f1">
          <div class="iconfont">&#xe606;</div>
          <div class="txt">反馈</div>
        </div>
        <div class="f2">
          <span class="num">{{ currIndex + 1 }}</span
          >/{{ list.length }}题
        </div>
        <div class="f3">
          <van-button
            color="red"
            :disabled="step === 0"
            @click="submit"
            class="btn"
            v-if="step <= 1"
            >提交</van-button
          >
          <van-button
            color="red"
            class="btn"
            v-else-if="step === 2"
            @click="next"
            >下一题</van-button
          >
          <van-button color="red" class="btn" v-else>结束</van-button>
        </div>
      </div>
    </div>
    <!-- *************************************答题卡弹窗 -->
    <van-popup v-model="showCard" position="bottom">
      <ul class="card-list">
        <!-- 答题卡绑定事件并传递当前索引 -->
        <li
          class="card-item"
          v-for="(item, index) in list"
          :key="index"
          @click="skip(index)"
          :class="{
            right: item.ans && item.ans.isRight === true,
            error: item.ans && item.ans.isRight === false
          }"
        >
          {{ index + 1 }}
        </li>
        <!-- 添加占位的li   这是一种常用的解决方案 -->
        <li class="noUse"></li>
        <li class="noUse"></li>
        <li class="noUse"></li>
        <li class="noUse"></li>
        <li class="noUse"></li>
        <li class="noUse"></li>
        <li class="noUse"></li>
        <li class="noUse"></li>
        <li class="noUse"></li>
        <li class="noUse"></li>
      </ul>
    </van-popup>
  </div>
</template>

<script>
// 导入api
import {
  interviewQuestions,
  questionsSubmit,
  questionsInfo
} from '@/api/question.js'
export default {
  name: 'questionInfo',
  data () {
    return {
      city: this.$route.query.city, // 城市
      id: this.$route.query.id, // id
      list: [], // 所有题目
      currIndex: Number(this.$route.query.currIndex) || 0, // 当前所在题目的索引 默认显示第一题
      typeObj: {
        1: '单选',
        2: '多选',
        3: '简答'
      },
      str: 'ABCDEFG', //  选项 ABCD等
      step: 0, // 定义一个步骤参数  0：读取题目还没做  1：已做题 还没点提交 2：点了提交还没点下一题 3：点了提交但是没下一题了
      ans1: '', // 单选题答案
      ans2: [], // 多选题答案
      ans3: '', // 简答题答案
      difficulty: {
        1: '简单',
        2: '一般',
        3: '困难'
      },
      bol: true, // 用于静默刷新
      showCard: false // 是否显示答题卡弹窗
    }
  },
  async created () {
    // 调用获取模拟面试题
    const res = await interviewQuestions({
      type: this.id,
      city: this.city
    })
    window.console.log(res)
    this.list = res.data.data // 存储所有题目数据
    //  调用skip()
    this.skip(this.currIndex)
  },
  methods: {
    //  *************************************答题卡点击事件
    rightClick () {
      this.showCard = true
    },
    //  *************************************单选点击事件
    liClick (index) {
      // 当step小于2的时候才允许选择单选选项
      if (this.step < 2) {
        // 拿到index转换成答案
        this.ans1 = this.str[index]
        // 修改step的值
        this.step = 1
      }
    },
    //  *************************************提交答案事件
    async submit () {
      this.$toast.loading({
        duration: 0,
        message: '加载中'
      })
      // 调用答案提交接口
      const res = await questionsSubmit({
        id: Number(this.list[this.currIndex].id),
        singleAnswer: this.ans1, // 单选题答案
        multipleAnswer: this.ans2 // 多选题答案
      })
      window.console.log(res)
      // 清空loading
      this.$toast.clear()
      // 点击提交后要做一个判断 是否是最后一个题来确定step的值
      if (this.list.length === this.currIndex + 1) {
        this.step = 3
      } else {
        // 修改step的值
        this.step = 2
      }
      // 提交时存储答案
      res.data.data.ams1 = this.ans1
      res.data.data.ans2 = this.ans2
      res.data.data.ans3 = this.ans3
      // 将答案存储到相应题目对应的索引项内
      this.list[this.currIndex].ans = res.data.data
    },
    //  *************************************下一题
    async next () {
      this.currIndex++
      this.skip(this.currIndex)
      // this.$toast.loading({
      //   duration: 0,
      //   message: '正在加载中'
      // })
      // // 答案还原
      // this.ans1 = ''
      // this.ans2 = []
      // this.ans3 = ''
      // // 调用接口获取题目
      // const res = await questionsInfo(this.list[this.currIndex].id)
      // window.console.log(res)
      // this.list[this.currIndex].detail = res.data.data // 存储数据
      // this.$toast.clear()
      // // 静默刷新
      // this.bol = false
      // this.$nextTick(() => {
      //   this.bol = true
      // })
    },
    //  *************************************多选点击事件
    liClick2 (index) {
      if (this.step < 2) {
        //     如果ans2中存在该项则删除 否则添加
        const _index = this.ans2.indexOf(this.str[index])
        if (_index !== -1) {
          //   splice(从哪开始删，删几个，向数组添加的新项目)
          this.ans2.splice(_index, 1)
        } else {
          this.ans2.push(this.str[index])
        }
        //  判断是否有答案
        if (this.ans2.length > 0) {
          this.step = 1
        } else {
          this.step = 0
        }
        window.console.log(this.ans2)
      }
    },
    // *************************************简答的输入框输入事件
    input (value) {
      if (value.length > 0) {
        this.step = 1
      } else {
        this.step = 0
      }
    },
    // *************************************答题卡快速跳转
    async skip (index) {
      this.showCard = false
      this.currIndex = index
      this.step = 0
      // 答案还原
      this.ans1 = ''
      this.ans2 = []
      this.ans3 = ''
      // 先解决没有题目的问题
      if (!this.list[index].detail) {
        this.$toast.loading({
          duration: 0,
          message: '加载中'
        })
        // 调用接口获取题目
        const res = await questionsInfo(this.list[this.currIndex].id)
        window.console.log(res)
        this.$toast.clear()
        this.list[this.currIndex].detail = res.data.data // 存储数据
      } else {
        // 有题目
        // 有题目有答案
        if (this.list[this.currIndex].ans) {
          //   在skip时还原答案 当有答案时我们才还原
          this.ans1 = this.list[this.currIndex].ans.ans1
          this.ans2 = this.list[this.currIndex].ans.ans2
          this.ans3 = this.list[this.currIndex].ans.ans3
          // 当到了最后一题
          if (this.currIndex + 1 === this.list.length) {
            this.step = 3
          } else {
            // 没到最后一题
            this.step = 2
          }
        }
        // 有题目没有答案
      }
      // 静默刷新
      this.bol = false
      this.$nextTick(() => {
        this.bol = true
      })
      // 通过路由存储当前的题目索引 传:this.$router.push(path?参数名=值) 收：this.$route.query.currIndex
      this.$router.push(
        `${this.$route.path}?city=${this.city}&id=${this.id}&currIndex=${this.currIndex}`
      )
    }
  }
}
</script>

<style lang="less" scoped>
.questionInfo {
  padding-bottom: 70px;
  .content {
    padding: 0 @p15;
    // 题目
    .title {
      font-size: 16px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      text-align: justify;
      color: #181a39;
      line-height: 22px;
      margin-top: 15px;
    }
    // 标签
    .tag-list {
      .tag {
        padding: 3px;
        margin: 10px 10px 20px 0;
      }
    }
    // 单选
    .select {
      .select-item {
        font-size: 16px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        text-align: justify;
        color: #181a39;
        line-height: 22px;
        border: 1px solid #f7f4f5;
        border-radius: 4px;
        background: #fff;
        color: #181a39;
        padding: 10px;
        margin-bottom: 15px;
      }
      // 修改边框颜色
      .active {
        border-color: #000;
      }
    }
    .select2 {
      margin-bottom: 10px;
      .field {
        border: 1px solid #ccc;
      }
    }
    // 答案解析
    .answer {
      .title {
        font-size: 18px;
        font-family: PingFangSC, PingFangSC-Medium;
        font-weight: 500;
        text-align: left;
        color: #222222;
        line-height: 25px;
        letter-spacing: 0px;
      }
      .answer-right {
        font-size: 16px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        text-align: justify;
        color: #1dc779;
        line-height: 22px;
        margin: 15px 0;
      }
      .other {
        background-color: #f7f4f5;
        padding: 6px;
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        color: #87879a;
      }
      .answer-txt {
        margin-top: 10px;
        font-size: 16px;
      }
    }
    //  底部
    .footer {
      position: fixed;
      left: 0;
      bottom: 0;
      padding: 0 @p15;
      width: 100%;
      height: 60px;
      display: flex;
      align-items: center;
      text-align: center;
      font-size: 12px;
      color: #ccc;
      background-color: #fff;
      .f1 {
        flex: 1;
        .iconfont {
          font-size: 24px;
        }
      }
      .f2 {
        flex: 2;
        font-size: 18px;
        .num {
          color: red;
          font-size: 22px;
        }
      }
      .f3 {
        flex: 2;
        .btn {
          width: 93px;
          height: 40px;
          border-radius: 8px;
          color: #fff;
        }
      }
    }
  }
  // 答题卡
  .card-list {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap; // 换行
    padding: 10px @p15;
    .card-item {
      width: 40px;
      height: 40px;
      line-height: 40px;
      border-radius: 50%;
      background-color: #ccc;
      text-align: center;
      margin-right: 10px;
      margin-bottom: 10px;
    }
    // 用来占位的li  设置高度为0
    .noUse {
      width: 4px;
      height: 0;
      margin-right: 10px;
    }
  }
  .right {
    background-color: #22e908 !important;
  }
  .error {
    background-color: #f40 !important;
  }
}
</style>
