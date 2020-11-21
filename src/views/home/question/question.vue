<template>
  <div class="question" v-if="info !== ''">
    <!-- ************************************************第一部分 标题和城市下拉菜单 -->
    <!--van-dropdown-menu 下拉菜单   van-dropdown-item  v-model = "选中项的值" options:[{text:显示的文本,value:"选中该项后的值"}]  slot= "title/default" toggle()  ref-->
    <van-dropdown-menu>
      <!-- 在子组件标签上定义一个ref属性  ref = "值"           this.$refs.值.toggle(false) === 关闭弹框 -->
      <van-dropdown-item ref="drop">
        <template #title>
          <div class="title">
            面试宝典<span class="city">{{ city }}</span>
          </div>
        </template>
        <template #default>
          <!-- van-index-bar  索引栏   index-list:索引数组  van-index-anchor  index = "索引值" -->
          <van-index-bar :index-list="indexList">
            <!--   {key:value}   v-for = "(value,key,index) in 对象名"  用来遍历对象 -->
            <div v-for="(value, key, index) in info.citys" :key="index">
              <!-- 这个是显示右边的索引栏 -->
              <van-index-anchor :index="key">{{ key }}</van-index-anchor>
              <!-- 这里显示的左边的城市数据 -->
              <!-- 绑定一个城市点击事件 -->
              <van-cell
                v-for="(item, index2) in value"
                :key="index2"
                :title="item"
                @click.native="cityClick(item)"
              >
              </van-cell>
            </div>
          </van-index-bar>
        </template>
      </van-dropdown-item>
    </van-dropdown-menu>
    <!-- ************************************************第二部分 岗位 -->
    <div class="content">
      <div class="tag-list">
        <!-- 当前索引等于index时添加active类实现变色  点击时切换currentIndex为index-->
        <van-tag
          v-for="(item, index) in info.cityPositions[city]"
          :key="index"
          class="tag"
          :class="{ active: currentIndex === index }"
          @click="currentIndex = index"
          >{{ item.name }}</van-tag
        >
      </div>
    </div>
    <!-- ************************************************分界线 -->
    <div class="line"></div>
    <!-- ************************************************第三部分 常错/收藏/企业/已答题库 顺序刷题 -->
    <div class="middle">
      <!-- 上 -->
      <div class="middle-top">
        <div class="item">
          <div class="item-top  i1">
            <i class="iconfont">&#xe64f;</i>
          </div>
          <div class="item-bottom">常错题库</div>
        </div>
        <div class="item">
          <div class="item-top  i2">
            <i class="iconfont">&#xe64f;</i>
          </div>
          <div class="item-bottom">收藏题库</div>
        </div>
      </div>
      <!-- 下 -->
      <div class="middle-bottom">
        <div class="item">
          <div class="item-top i3">
            <i class="iconfont">&#xe64f;</i>
          </div>
          <div class="item-bottom">企业题库</div>
        </div>
        <div class="item">
          <div class="item-top i4">
            <i class="iconfont ">&#xe64f;</i>
          </div>
          <div class="item-bottom">已答题库</div>
        </div>
      </div>
      <!-- 中 -->
      <div class="center">
        <!-- van-circle  v-model:当前值   rate：目标最大100  speed: 多少rate/秒 layer-color:轨道颜色  color:颜色 可设置渐变色-->
        <van-circle
          class="circle"
          v-model="circle"
          :rate="
            ($store.state.userInfo.correctQuestions.length * 100) /
              info.totalCount
          "
          :speed="10"
          :color="gradientColor"
          layer-color="none"
        >
          <div class="txt">
            <div class="txt1">顺序刷题</div>
            <div class="txt2">
              {{ $store.state.userInfo.correctQuestions.length }}/{{
                info.totalCount
              }}
            </div>
          </div>
        </van-circle>
      </div>
    </div>
    <!-- ************************************************分界线 -->
    <div class="line"></div>
    <!-- ************************************************累计收录 -->
    <div class="result">
      <div class="result-top">累计收录</div>
      <div class="result-bottom">{{ info.totalCount }}</div>
    </div>
    <!-- ************************************************模拟面试 -->
    <!-- 点击跳转到题库详情 -->
    <div class="btn">
      <van-button block color="#00b8d4" round @click="goQuestionInfo"
        >模拟面试</van-button
      >
    </div>
  </div>
</template>

<script>
// 导入api
import { interviewFilters } from '@/api/question'
export default {
  data () {
    return {
      city: '全国', // 城市
      indexList: [], // 索引数组
      info: '', // 返回的所有信息
      currentIndex: 0, // 当前索引
      circle: 0, // 圆环当前值
      gradientColor: {
        // 右上角的颜色
        '0%': 'rgba(228,1,55,0.7)',
        '100%': 'rgba(228,1,55,0.3)'
      }
    }
  },
  methods: {
    // *******************绑定一个城市点击事件
    cityClick (item) {
      // 点击后关闭下拉菜单 并给城市赋值
      this.$refs.drop.toggle(false)
      this.city = item
      this.currentIndex = 0
    },
    // *******************跳转到题库详情
    goQuestionInfo () {
      this.$router.push({
        path: '/home/questionInfo',
        query: {
          city: this.city,
          id: this.info.cityPositions[this.city][this.currentIndex].id
        }
      })
    }
  },
  async created () {
    this.$toast.loading({
      duration: 0,
      message: '加载中'
    })
    // 调用模拟面试筛选条件api
    const res = await interviewFilters()
    window.console.log(res)
    this.info = res.data.data // 存储返回的所有信息
    this.indexList = Object.keys(res.data.data.citys) // Object.keys(对象) 拿到对象的属性名
    this.$toast.clear()
  }
}
</script>

<style lang="less" scoped>
.question {
  // ********第一部分 标题和城市下拉菜单
  .title {
    font-size: 18px;
    font-family: PingFangSC, PingFangSC-Semibold;
    font-weight: 500;
    text-align: left;
    color: #222222;
    line-height: 25px;
    letter-spacing: 0px;
  }
  .city {
    font-size: 12px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: center;
    color: #545671;
    line-height: 16px;
    margin-left: 5px;
  }
  // ********第二部分 岗位
  .content {
    padding: 0 @p15;
    background-color: #fff;
    .tag-list {
      display: flex;
      width: 100%;
      overflow: auto;
      padding: 10px 0;
      .tag {
        padding: 5px 8px;
        background: #f7f4f5;
        border-radius: 10px;
        color: #5e6079;
        flex: 0 0 auto; // flex属性是flex-grow, flex-shrink 和 flex-basis的简写，默认值为0 1 auto  可以实现文字横向排列
        margin-right: 15px;
      }
      .active {
        background-color: #00b8d4 !important;
        color: #fff !important;
      }
    }
  }
  // ********分界线
  .line {
    height: 15px;
    background: #f7f4f5;
  }
  // ********中间的题库
  .middle {
    position: relative; // 父相
    padding: 16px 40px;
    background: #fff;
    .middle-top {
      display: flex;
      justify-content: space-between;
      margin-bottom: 40px;
    }
    .middle-bottom {
      display: flex;
      justify-content: space-between;
    }
    .item {
      width: 50px;
      text-align: center;
      .item-top {
        //   display: inline-block;
        width: 44px;
        height: 44px;
        line-height: 44px;
        text-align: center;
        color: #fff;
        border-radius: 50%;
        margin-bottom: 10px;
        .iconfont {
          font-size: 30px;
        }
      }
      .i1 {
        background: linear-gradient(180deg, #ff8080, #ff4949);
      }
      .i2 {
        background: linear-gradient(180deg, #ffda05, #ffb302);
      }
      .i3 {
        background: linear-gradient(180deg, #00ddec, #00b8d4);
      }
      .i4 {
        background: linear-gradient(180deg, #3ee5b1, #1dc779);
      }
      .item-bottom {
        font-size: 12px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        color: #545671;
        line-height: 16px;
        letter-spacing: 0px;
      }
    }
    // 中间
    .center {
      position: absolute; // 子绝
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 120px;
      height: 120px;
      // 在html与js中@表示 src,在css中~@表示src
      background: url(~@/assets/circle.png) no-repeat;
      background-size: 100%;
      border-radius: 50%;
      .circle {
        width: 100% !important;
        height: 100% !important;
        padding: 10px;
      }
      .txt {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: linear-gradient(180deg, #ff6f92, #e40137);
        color: #fff;
        font-size: 16px;
        padding-top: 25px;
        .txt1 {
          padding-bottom: 15px;
        }
      }
    }
  }
  //  ********累计收录
  .result {
    text-align: center;
    background-color: #fff;
    color: #545671;
    font-weight: 600;
    font-family: PingFangSC, PingFangSC-Semibold;
    .result-top {
      font-size: 18px;
      line-height: 25px;
      letter-spacing: 0px;
      margin-top: 20px;
      margin-bottom: 30px;
    }
    .result-bottom {
      font-size: 30px;
      line-height: 42px;
      letter-spacing: 1px;
      margin-bottom: 20px;
    }
  }
  //  ********按钮
  .btn {
    padding: 20px @p15 10px;
    background: #f7f4f5;
  }
}
</style>
