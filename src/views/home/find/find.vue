<template>
  <div class="find">
    <hmNavBar title="发现" :showLeft="false"></hmNavBar>
    <!-- PullReflesh下拉刷新 -->
    <van-pull-refresh v-model="loading" @refresh="refresh">
      <div class="content">
        <!-- 使用组件 -->
        <findCell title="面试技巧"></findCell>
        <!-- 父子组件传值  在子组件标签定义一个属性  属性名 = 值； 在子组件上通过props接收 -->
        <technicItem
          v-for="(item, index) in technicList"
          :key="index"
          :info="item"
        ></technicItem>
        <!-- ********************************************************************** -->
        <!-- tag标签栏   color为背景验证 text-color为文本颜色 -->
        <findCell title="市场数据"></findCell>
        <van-tag color="#eceaea" text-color="#838a9f" class="tag">{{
          chartList.city
        }}</van-tag>
        <van-tag color="#eceaea" text-color="#838a9f" class="tag">{{
          chartList.position
        }}</van-tag>

        <div class="chart-area" ref="chart">
          <ul
            class="chart"
            v-for="(item, index) in chartList.yearSalary"
            :key="index"
          >
            <!-- slice(start,end)  start表示从哪开始截取 end表示结束位置（不包含）-->
            <li class="c1">{{ item.year.slice(0, 5) }}</li>
            <li class="c2">
              <!-- 使用添加的百分比来完成不同工资不同长度的渲染 -->
              <div class="line" :style="{ width: item.per }">
                {{ item.salary }}
              </div>
            </li>
            <li class="c3">
              <!-- 渲染百分比  无值时不显示百分比 -->
              <div v-if="item.percent !== undefined && item.percent >= 0">
                <i class="iconfont up">&#xe651;</i>
              </div>
              <div v-else-if="item.percent !== undefined && item.percent < 0">
                <i class="iconfont down">&#xe64e;</i>
              </div>
            </li>
            <li class="c4">
              <div v-if="item.percent !== undefined">{{ item.percent }}%</div>
            </li>
          </ul>
        </div>
        <!-- 收起与展开更多 -->
        <div class="lookMore" @click="showClick">
          <div v-if="showAll">
            <span>收起</span><i class="iconfont r180">&#xe652;</i>
          </div>
          <div v-else>
            <span>展开更多</span><i class="iconfont">&#xe652;</i>
          </div>
        </div>
        <!-- ********************************************************************** -->
        <findCell title="面经分享" @click.native="goShareList"></findCell>
        <!-- 使用子组件 -->
        <div>
          <shareItem
            v-for="(item, index) in shareList"
            :key="index"
            :info="item"
          ></shareItem>
        </div>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
// 导入子组件
import findCell from './findCell'
import technicItem from './technicItem'
import shareItem from './shareItem'
// 导入api
import { articlesTechnic, chartDataHot, articlesShare } from '@/api/find.js'
export default {
  name: 'find', // 这个地方一定要添加name  因为find页面要添加缓存
  data () {
    return {
      technicList: [], // 面试技巧列表
      chartList: [], // 热门职位列表
      showAll: false, // 控制展开与收起
      shareList: [], // 面经分享列表
      loading: false // 是否处于下拉刷新过程中
    }
  },
  // 注册组件
  components: {
    findCell,
    technicItem,
    shareItem
  },
  async created () {
    this.refresh()
  },
  methods: {
    //  ************************收起与展开控制
    showClick () {
      this.showAll = !this.showAll
      // 如果显示全部则高度为scrollHeight  如果收起来了 则只显示3条数据的高度
      if (this.showAll) {
        this.$refs.chart.style.height = this.$refs.chart.scrollHeight + 'px'
      } else {
        this.$refs.chart.style.height =
          (this.$refs.chart.scrollHeight / this.chartList.yearSalary.length) *
            3 +
          'px'
      }
    },
    //  ************************下拉刷新
    async refresh () {
      // *************获取面试技巧列表*************
      const res = await articlesTechnic()
      window.console.log(res)
      this.technicList = res.data.data.list

      // *************获取热门职位数据（市场数据）*************
      const res2 = await chartDataHot()
      // 在数组每一项添加一个百分占比的值  salary/topSalary的百分比
      res2.data.data.yearSalary.forEach(item => {
        item.per = (item.salary / res2.data.data.topSalary) * 100 + '%'
      })
      window.console.log(res2)
      // 反转数组 从而把最新的年份显示在上面
      res2.data.data.yearSalary.reverse()
      this.chartList = res2.data.data // 存储热门职位数据

      // 让它默认显示三行数据  控制它的高度等于前三条高度
      // nextTick:将在它前面的数据渲染完成后执行
      this.$nextTick(() => {
        this.$refs.chart.style.height =
          (this.$refs.chart.scrollHeight / res2.data.data.yearSalary.length) *
            3 +
          'px'
      })
      // *************获取面经分享列表*************
      const res3 = await articlesShare()
      window.console.log(res3)
      this.shareList = res3.data.data.list // 存储面经分享列表

      this.loading = false // 刷新完成后loading改为false 表示刷新已完成
    },
    //  ************************跳转到面经分享
    goShareList () {
      this.$router.push('/home/shareList')
    }
  },
  // 注意这个activated 是一个钩子函数 不能放在methods里面
  activated () {
    // 回到跳转之前的位置
    window.scrollTo(0, this.$route.meta.xxx)
  }
}
</script>

<style lang="less">
.find {
  .content {
    padding: 0 @p15;
    .tag {
      padding: 4px 8px;
      margin-right: 12px;
    }
    .chart-area {
      transition: height 0.5s;
      overflow: hidden;
      // 市场数据
      .chart {
        display: flex;
        align-items: center;
        font-size: 12px;
        color: #545671;
        padding-top: 10px;
        .c1 {
          width: 50px;
          text-align: left;
        }
        .c2 {
          flex: 1;
          background-color: #ebdfdf;
          border-radius: 4px;
          .line {
            background-color: #fe6d67;
            border-radius: 4px;
            color: #fff;
            text-align: right;
            padding-right: 10px;
          }
        }
        .c3 {
          width: 15px;
          height: 16px;
          text-align: center;
          padding-left: 5px;
          padding-right: 3px;
          .up {
            color: #00d47a;
            font-size: 16px;
          }
          .down {
            color: #fe6d67;
            font-size: 16px;
          }
        }
        .c4 {
          width: 35px;
          text-align: right;
        }
      }
    }

    //  收起与展开更多
    .lookMore {
      margin-top: 10px;
      text-align: center;
      font-size: 14px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      text-align: center;
      color: #545671;
      line-height: 20px;
      letter-spacing: 0px;
      .r180 {
        display: inline-block;
        transform: rotate(
          180deg
        ); // 注意这个属性对绝大多数行内元素都不生效 需要转为行内块或块才行
      }
    }
  }
}
</style>
