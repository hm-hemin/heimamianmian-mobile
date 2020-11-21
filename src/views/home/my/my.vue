<template>
  <div class="my">
    <!-- 1-顶部 -->
    <div class="top">
      <!-- 1-1顶部 -->
      <!--点击跳转到我的资料 -->
      <div class="top-info" @click="goInfo">
        <!-- 左边的文字 -->
        <div class="left">
          <!--使用mapState渲染数据-->
          <div class="left-title">{{ userInfo.nickname }}</div>
          <div class="left-txt">{{ userInfo.intro }}</div>
        </div>
        <!-- 右边的头像 -->
        <!-- 如果有头像则显示头像 如果没有头像则显示默认的头像 -->
        <img
          :src="baseUrl + userInfo.avatar"
          alt=""
          class="right"
          v-if="userInfo.avatar"
        />
        <img src="@/assets/logo.png" alt="" class="right" v-else />
      </div>
      <!-- 1-2数据 -->
      <ul class="top-num">
        <li class="top-num-item">
          <div class="num">298</div>
          <div class="txt">累计答题</div>
        </li>
        <li class="top-num-item">
          <div class="num">98</div>
          <div class="txt">收藏题目</div>
        </li>
        <li class="top-num-item">
          <div class="num">198</div>
          <div class="txt">我的错题</div>
        </li>
        <li class="top-num-item">
          <div class="num">76<i>%</i></div>
          <div class="txt">正确率</div>
        </li>
      </ul>
      <!-- 1-3我的岗位 -->
      <div class="position">
        <!-- 单元格 cell -->
        <!-- title:左边文本 value：右边文本 iis-link:箭头 center:上下居中 slot:"icon/title/default/right-icon"-->
        <!-- <van-cell center is-link class="cell">
          <template #icon>
            <i class="iconfont">&#xe64d;</i>
          </template>
          <template #title>
            <div class="cell-title">我的岗位</div>
          </template>
          <template #default>
            <div class="cell-value">产品经理</div>
          </template>
        </van-cell> -->
        <!-- 使用组件 -->
        <myCell
          class="cell"
          icon="&#xe64d;"
          title="我的岗位"
          :value="userInfo.position"
          @click.native="$router.push('/home/editInfo?type=position')"
        ></myCell>
      </div>
    </div>
    <!-- 2-中间面经数据 -->
    <div class="content">
      <div class="middle">
        <h3 class="middle-title">面经数据</h3>
        <!-- ul.middle-num>li.middle-num-item*3>.item1>span.color^.item2+.item3 -->
        <ul class="middle-num">
          <li class="middle-num-item">
            <div class="item1">昨日阅读<span class="color">+300</span></div>
            <div class="item2">17</div>
            <div class="item3">阅读总数</div>
          </li>
          <li class="middle-num-item">
            <div class="item1">昨日获赞<span class="color">+300</span></div>
            <div class="item2">297</div>
            <div class="item3">获赞总数</div>
          </li>
          <li class="middle-num-item">
            <div class="item1">昨日新增<span class="color">+12</span></div>
            <div class="item2">187</div>
            <div class="item3">评论总数</div>
          </li>
        </ul>
      </div>
      <div class="bottom">
        <myCell
          class="cell"
          icon="&#xe655;"
          title="我的面经分享"
          value="21"
        ></myCell>
        <myCell
          class="cell"
          icon="&#xe656;"
          title="我的消息"
          value="98"
        ></myCell>
        <myCell
          class="cell"
          icon="&#xe654;"
          title="收藏的题库"
          value="32"
        ></myCell>
        <myCell
          class="cell"
          icon="&#xe648;"
          title="收藏的企业"
          value="32"
        ></myCell>
        <myCell
          class="cell"
          icon="&#xe64f;"
          title="我的错题"
          value="123"
        ></myCell>
        <myCell
          class="cell"
          icon="&#xe649;"
          title="收藏的面试经验"
          value="166"
        ></myCell>
      </div>
    </div>
  </div>
</template>

<script>
// 导入myCell组件
import myCell from '@/views/home/my/mycell.vue'
// 导入mapState
import { mapState } from 'vuex'
export default {
  // 注册组件
  components: {
    myCell
  },
  // 在计算属性中定义mapState
  computed: {
    // ...mapState(["希望取出store内的state的属性名"])
    ...mapState(['userInfo', 'isLogin'])
  },
  data () {
    return {
      // 定义一个头像基地址
      baseUrl: process.env.VUE_APP_URL
    }
  },
  methods: {
    // 跳转到我的资料
    goInfo () {
      this.$router.push('/home/myInfo')
    }
  }
}
</script>

<style lang="less" scoped>
.my {
  // 1-顶部
  .top {
    position: relative;
    height: 100%;
    background: linear-gradient(45deg, #ce0031, #b8002c);
    padding: 31px @p15;
    // 1-1顶部
    .top-info {
      display: flex;
      justify-content: space-between; // 两边对齐
      align-items: center; // 上下居中
      // 左边的文字
      .left {
        .left-title {
          font-size: 21px;
          font-family: PingFangSC, PingFangSC-Semibold;
          font-weight: 600;
          text-align: left;
          color: #ffffff;
          line-height: 29px;
          letter-spacing: 0px;
          margin-bottom: 5px;
        }
        .left-txt {
          opacity: 0.7;
          font-size: 12px;
          font-family: PingFangSC, PingFangSC-Regular;
          font-weight: 400;
          text-align: left;
          color: #ffffff;
          line-height: 16px;
          letter-spacing: 0px;
        }
      }
      // 右边的头像
      .right {
        width: 50px;
        height: 50px;
        border: 3px solid rgba(255, 255, 255, 0.38);
        border-radius: 50%;
      }
    }
    // 1-2数据
    .top-num {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 10px;
      .top-num-item {
        text-align: center;
        margin-top: 31px;
        .num {
          font-size: 21px;
          font-family: DINAlternate, DINAlternate-Bold;
          font-weight: 700;
          text-align: center;
          color: #ffffff;
          line-height: 24px;
          letter-spacing: 0px;
          margin-bottom: 5px;
          i {
            font-size: 12px;
          }
        }
        .txt {
          opacity: 0.7;
          font-size: 12px;
          font-family: PingFangSC, PingFangSC-Regular;
          font-weight: 400;
          text-align: center;
          color: #ffffff;
          line-height: 16px;
          letter-spacing: 0px;
        }
      }
    }
    // 1-3我的岗位
    .position {
      position: absolute;
      left: 0;
      bottom: -16px;
      width: 100%;
      padding: 0 @p15;
      .cell {
        border-radius: 8px;
      }
    }
  }
  // 2-中间面经数据
  .content {
    background-color: #f7f4f5;
    padding: 26px @p15;
    .middle {
      padding: 19px 15px;
      background-color: #fff;
      // margin-bottom: 10px;
      // 面经数据标题
      .middle-title {
        font-size: 14px;
        font-family: PingFangSC, PingFangSC-Semibold;
        font-weight: 600;
        text-align: left;
        color: #181a39;
        line-height: 20px;
        letter-spacing: 0px;
      }
      .middle-num {
        display: flex;
        justify-content: space-around;
        text-align: center;
        padding-top: 17px;
        .middle-num-item {
          .item1 {
            font-size: 12px;
            font-family: PingFangSC, PingFangSC-Regular;
            font-weight: 400;
            text-align: center;
            color: #b4b4bd;
            line-height: 14px;
            letter-spacing: 0px;
            .color {
              color: #74d7e6;
            }
          }
          .item2 {
            font-size: 21px;
            font-family: DINAlternate, DINAlternate-Bold;
            font-weight: 700;
            text-align: center;
            color: #181a39;
            line-height: 24px;
            letter-spacing: 0px;
            padding: 10px 0;
          }
          .item3 {
            font-size: 12px;
            font-family: PingFangSC, PingFangSC-Regular;
            font-weight: 400;
            text-align: center;
            color: #545671;
            line-height: 16px;
            letter-spacing: 0px;
          }
        }
      }
    }
    .bottom {
      margin-top: 10px;
      .cell:nth-child(1) {
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
      }
      .cell:nth-child(6) {
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
      }
      // border-radius: 8px;
      // margin-bottom: 60px;
    }
  }
}
</style>
