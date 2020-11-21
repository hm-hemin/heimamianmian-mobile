<template>
  <!-- v-if处理初始值报错 -->
  <div class="shareInfo" v-if="info !== ''">
    <!-- 这个页面是分享详情 包括文章内容以及评论和回复评论等信息 -->
    <hmNavBar :path="rePath" class="hmNavBar"></hmNavBar>
    <!-- ***********************文章详情内容区域 -->
    <div class="content">
      <!-- 1-标题 -->
      <h3 class="title">{{ info.title }}</h3>
      <!-- 2-中间 头像 时间 昵称 阅读和点赞 -->
      <div class="other">
        <!-- 头像 -->
        <!-- 存在avatar则显示头像 否则显示默认头像-->
        <img
          v-if="info.author.avatar"
          class="o1"
          :src="baseUrl + info.author.avatar"
          alt=""
        />
        <img v-else class="o1" src="@/assets/logo.png" alt="" />
        <div class="o2">
          <!--作者 -->
          <div class="o2-top">{{ info.author.nickname }}</div>
          <!-- 时间 使用过滤器和moment进行格式化处理-->
          <div class="o2-bottom">
            {{ info.updated_at | formatTime('YYYY-MM-DD') }}
          </div>
        </div>
        <i class="iconfont o3">&#xe644;</i>
        <!-- 阅读 -->
        <div class="o4">{{ info.read }}</div>
        <i
          class="iconfont o5"
          @click="star"
          :class="{
            red: userInfo.starArticles && userInfo.starArticles.includes(+id)
          }"
          >&#xe638;</i
        >
        <!-- 点赞 -->
        <div
          class="o6"
          @click="star"
          :class="{
            red: userInfo.starArticles && userInfo.starArticles.includes(+id)
          }"
        >
          {{ info.star }}
        </div>
      </div>
      <!-- 3-文章详情 -->
      <div class="txt" v-html="info.content"></div>
    </div>
    <!-- ***********************分界线 -->
    <div class="line"></div>
    <!--  ***********************评论 -->
    <div class="comment">
      <!-- 标题：评论 -->
      <h3 class="title">
        评论<span class="num">{{ commentTotal }}</span>
      </h3>
      <!-- 评论模块加入上拉加载 -->
      <!-- list 上拉加载  van-list  v-model = "loading" finished:是否加载完成 finished-text:到了最后一页最下面的提示文本 @load = "load"-->
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有数据了"
        @load="load"
      >
        <!-- 中间 头像 时间 昵称 点赞  -->
        <div
          class="comment-item"
          v-for="(item, index) in commentList"
          :key="index"
        >
          <!-- 上 -->
          <div class="item-top">
            <!-- 头像 -->
            <!-- 有avatar则显示头像 否则显示默认头像 -->
            <!-- 绑定点击事件并传递id 回复评论 -->
            <img
              v-if="item.author.avatar"
              class="t1"
              :src="baseUrl + item.author.avatar"
              alt=""
              @click="sendtoMen(item.id)"
            />
            <img
              v-else
              class="t1"
              src="@/assets/logo.png"
              alt=""
              @click="sendtoMen(item.id)"
            />
            <div class="t2" @click="sendtoMen(item.id)">
              <!--作者 -->
              <div class="t2-top">{{ item.author.nickname }}</div>
              <!-- 时间 使用过滤器和moment进行格式化处理-->
              <div class="t2-bottom">
                {{ item.created_at | formatTime('YYYY-MM-DD') }}
              </div>
            </div>
            <!-- 点赞评论 -->
            <div
              class="t3"
              @click="commentStar(item)"
              :class="{
                red:
                  userInfo.starComments &&
                  userInfo.starComments.includes(+item.id)
              }"
            >
              {{ item.star }}
            </div>
            <i
              class="iconfont t4"
              @click="commentStar(item)"
              :class="{
                red:
                  userInfo.starComments &&
                  userInfo.starComments.includes(+item.id)
              }"
              >&#xe638;</i
            >
          </div>
          <!-- 中 -->
          <div class="item-middle">
            {{ item.content }}
          </div>
          <!-- 下 -->
          <!-- 如果有children_comments才显示这部分 -->
          <div class="item-bottom" v-if="item.children_comments.length > 0">
            <div
              class="bottom-info"
              v-for="(item2, index2) in item.children_comments"
              :key="index2"
            >
              <span class="info-name">{{ item2.author }}:</span>
              <span class="info-txt">{{ item2.content }}</span>
            </div>
          </div>
        </div>
      </van-list>
    </div>
    <!--  ***********************底部发表评论 -->
    <div class="footer">
      <!-- 点击弹出发表评论的框 -->
      <div class="f1" @click="footerClick">
        <span class="f1-txt">我来补充两句</span>
      </div>
      <!-- 收藏 -->
      <!-- 当userInfo中包含收藏数组 且数组中包含当前文章id时才变红 -->
      <!-- 绑定点击事件 收藏文章 -->
      <div
        @click="collect"
        class="f2"
        :class="{
          red:
            userInfo.collectArticles && userInfo.collectArticles.includes(+id)
        }"
      >
        <div class="iconfont">&#xe63c;</div>
        <div class="f2-num">{{ info.collect }}</div>
      </div>
      <!-- 点赞 -->
      <div
        class="f2"
        @click="star"
        :class="{
          red: userInfo.starArticles && userInfo.starArticles.includes(+id)
        }"
      >
        <div class="iconfont">&#xe638;</div>
        <div class="f2-num">{{ info.star }}</div>
      </div>
      <!-- 转发 -->
      <div class="f2">
        <div class="iconfont">&#xe63e;</div>
        <div class="f2-num">323</div>
      </div>
    </div>
    <!--  ***********************发表评论弹出框 -->
    <!--popup弹出层   van-popup v-model = "是否显示" position:显示的位置 -->
    <van-popup v-model="showSendComment" position="bottom">
      <div class="send-area">
        <!-- 多行文本输入框 -->
        <van-field
          v-model="inputValue"
          type="textarea"
          rows="4"
          placeholder="我来补充两句"
          class="field"
        ></van-field>
        <!-- 发送按钮 -->
        <div class="send-line">
          <!-- 当输入框有值的时候才能发送 -->
          <span v-if="inputValue.length > 0" class="send-btn" @click="send"
            >发送</span
          >
          <span v-else class="send-btn2">发送</span>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
// 导入api
import {
  articlesShareInfo,
  articlesCommentsList,
  articlesComments,
  articlesCollect,
  articlesStar,
  articleCommentsStar
} from '@/api/find.js'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      rePath: this.$route.query.rePath, // 获取路由传参  回跳路径
      id: this.$route.params.id, // 获取文章id   在相应路由对应的组件上获取id
      info: '', // 存储面经详情
      baseUrl: process.env.VUE_APP_URL,
      commentList: [], // 存储评论列表
      commentTotal: 0, // 评论总数
      loading: false, // 是否处于加载中
      finished: false, // 是否完成加载
      currentPage: 0, // 当前页
      pageSize: 2, // 页容量
      showSendComment: false, // 是否显示发表评论弹出框
      inputValue: '', // 输入框的值
      parent: '' // 回复评论
    }
  },
  async created () {
    // 调用api获取面经详情
    const res = await articlesShareInfo(this.id)
    window.console.log(res)
    this.info = res.data.data // 存储面经详情
  },
  // 监听 showSendComment的变化
  watch: {
    showSendComment (newVal) {
      // 当不显示发表评论的弹出框的时候把输入框的内容清空
      if (newVal === false) {
        this.inputValue = ''
      }
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    // *********************************上拉加载方法
    async load () {
      // 加载一次增加一页
      this.currentPage++
      const _q = {
        // 根据当前页和页容量生成起始页
        start: (this.currentPage - 1) * this.pageSize,
        limit: this.pageSize
      }
      // 调用api获取面经分享评论
      const res2 = await articlesCommentsList(this.id, _q)
      window.console.log(res2)
      // this.commentList = res2.data.data.list // 存储返回的评论列表数据
      this.commentList.push(...res2.data.data.list) // 一条一条的处理数据
      this.commentTotal = res2.data.data.total // 评论总数
      // 加载完以后让loading变为false
      this.loading = false
      // 判断是否所有的数据都加载完成
      if (this.commentTotal <= this.commentList.length) {
        this.finished = true // 加载完成则把finished的值变为true
        // 更新评论总数
        this.commentTotal = this.commentList.length
      }
    },
    // *********************************底部点击事件
    footerClick () {
      // 点击弹出发表评论的框
      this.showSendComment = true
      this.parent = '' // 回复评论才有  发表评论没有该值
    },
    // *********************************发表评论
    async send () {
      // 调用发表评论接口
      const res = await articlesComments({
        content: this.inputValue, // 评论内容
        article: this.id, // 就是评论的文章的id
        parent: this.parent // 回复评论
      })
      window.console.log(res)
      // 关闭弹框
      this.showSendComment = false
      // ***如果没有parent则为发表评论 如果有parent则为回复评论
      if (this.parent === '') {
        if (this.commentList.length !== 0) {
          // 给新增的评论一个默认的星星
          res.data.data.star = 0
          // 发表评论后将数据添加到评论列表数组里 显示在前面
          this.commentList.unshift(res.data.data)
          this.commentTotal = this.commentList.length
        }
      } else {
        // 将返回值添加到相应评论的回复评论内（children_comments）
        // 先找到id=this.parent的项索引
        // 返回值=数组.findIndex((item,index,arr)=>{return boolean})  如果boolean为true,找到了,返回值=当前的index,中止查找 到最后都没找到(return都是false) 返回值=-1
        const _index = this.commentList.findIndex(item => {
          return item.id === this.parent
        })
        this.commentList[_index].children_comments.push(res.data.data)
      }
    },
    // *********************************回复评论
    sendtoMen (id) {
      // 赋值parent
      this.parent = id
      // 打开弹框
      this.showSendComment = true
    },
    // *********************************收藏文章
    async collect () {
      const res = await articlesCollect({ id: this.id })
      window.console.log(res)
      // 提示 1：收藏成功 2：取消收藏
      if (res.data.data.list.includes(+this.id)) {
        this.$toast.success('收藏成功')
      } else {
        this.$toast.success('取消成功')
      }
      // 更新收藏总数量
      this.info.collect = res.data.data.num
      // 更新一哈用户信息
      this.$store.dispatch('getUserInfo')
    },
    // *********************************点赞文章
    async star () {
      const res = await articlesStar({ article: this.id })
      window.console.log(res)
      // 提示 1：点赞成功 2：取消点赞
      if (res.data.data.list.includes(+this.id)) {
        this.$toast.success('点赞成功')
      } else {
        this.$toast.success('取消成功')
      }
      // 更新点赞总数量
      this.info.star = res.data.data.num
      // 更新一哈用户信息
      this.$store.dispatch('getUserInfo')
    },
    // *********************************点赞面经评论
    async commentStar (item) {
      const res = await articleCommentsStar({ id: item.id })
      window.console.log(res)
      // 提示 1：点赞成功 2：取消点赞
      if (res.data.data.list.includes(+item.id)) {
        this.$toast.success('点赞成功')
      } else {
        this.$toast.success('取消成功')
      }
      // 更新点赞总数量
      item.star = res.data.data.num
      // 更新一哈用户信息
      this.$store.dispatch('getUserInfo')
    }
  }
}
</script>

<style lang="less" scoped>
.shareInfo {
  padding-bottom: 70px;
  // 让导航栏的左箭头对齐 因为加了scoped的原因
  .hmNavBar {
    &::v-deep .van-nav-bar__left,
    &::v-deep .van-nav-bar__right {
      padding: 0;
    }
  }

  // 内容区域
  .content {
    padding: 0 @p15;

    // 标题
    .title {
      font-size: 18px;
      font-family: PingFangSC, PingFangSC-Medium;
      font-weight: 600;
      text-align: left;
      color: #181a39;
      line-height: 25px;
    }

    .other {
      display: flex;
      align-items: center;
      color: #ccc;
      font-size: 12px;
      margin: 20px 0;

      // 头像
      .o1 {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        margin-right: 10px;
      }

      .o2 {
        flex: 1;

        // 作者
        .o2-top {
          font-size: 12px;
          font-family: PingFangSC, PingFangSC-Regular;
          font-weight: 400;
          text-align: left;
          line-height: 17px;
          letter-spacing: 0px;
        }
      }

      // 点赞
      .o5 {
        margin-left: 10px;
      }
    }
  }

  //  文章详情
  .txt {
    font-size: 16px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: justify;
    color: #181a39;
    line-height: 27px;
    letter-spacing: 0px;
  }

  &::v-deep img {
    // 设置图片宽度
    width: 100%;
  }

  // 分界线
  .line {
    height: 10px;
    background: #f7f4f5;
  }

  // 评论
  .comment {
    padding: 0 @p15;

    .title {
      position: relative; // 父相
      font-size: 18px;
      font-family: PingFangSC, PingFangSC-Medium;
      font-weight: 500;
      text-align: left;
      color: #222222;
      line-height: 25px;
      letter-spacing: 0px;
      margin-top: 20px;
      margin-bottom: 20px;

      // 标题右上角的评论数
      .num {
        font-size: 12px;
        font-family: PingFangSC, PingFangSC-Medium;
        font-weight: 500;
        text-align: left;
        color: #b4b4bd;
        line-height: 17px;
        letter-spacing: 0px;
        position: absolute; // 子绝
        top: 0;
        left: 38px;
      }
    }

    .comment-item {
      .item-top {
        display: flex;
        align-items: center;
        color: #ccc;
        font-size: 12px;

        // 头像
        .t1 {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          margin-right: 10px;
        }

        .t2 {
          flex: 1;

          .t2-top {
            margin-bottom: 5px;
          }
        }

        .t3 {
          margin-right: 5px;
        }
      }

      .item-middle {
        font-size: 16px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        text-align: justify;
        color: #181a39;
        line-height: 27px;
        letter-spacing: 0px;
        word-wrap: break-word;
        // 到头就换行,它不能换行标点符号
        word-break: break-all;
        margin: 10px 0 10px 45px; // 上 右  下 左
      }

      .item-bottom {
        margin-left: 45px;
        padding: 20px 15px;
        background-color: #f7f4f5;
        font-size: 14px;
        font-family: PingFangSC, PingFangSC-Semibold;
        text-align: left;
        line-height: 20px;
        letter-spacing: 0px;

        .info-name {
          color: #545671;
          font-weight: 600;
        }

        .info-txt {
          color: #545671;
          font-weight: 400;
          word-wrap: break-word;
          // 到头就换行,它不能换行标点符号
          word-break: break-all;
        }
      }
    }
  }
  // 发表评论
  .footer {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    padding: 0 @p15;
    height: 60px;
    display: flex;
    align-items: center;
    background-color: #ffffff;
    font-size: 12px;
    color: #b4b4bd;
    .f1 {
      flex: 1;
      display: inline-block;
      height: 34px;
      background-color: #f7f4f5;
      margin: 15px;
      line-height: 34px;
      padding-left: 10px;
    }
    .f2 {
      padding: 0 10px;
      text-align: center;
      .iconfont {
        font-size: 30px;
      }
    }
  }
  // 发表评论弹出框
  .send-area {
    padding: @p15;
    .field {
      background-color: #f7f4f5;
    }
    .send-line {
      text-align: right;
      .send-btn {
        color: #000;
        font-size: 16px;
      }
      .send-btn2 {
        color: #ccc;
        font-size: 16px;
      }
    }
  }
  // 收藏变红
  .red {
    color: red;
  }
}
</style>
