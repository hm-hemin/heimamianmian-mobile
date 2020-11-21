<template>
  <!-- 这个页面是点击面经分享后的查看更多 跳转后的页面 可以显示列表 也可以显示搜索历史 -->
  <div class="shareList">
    <hmNavBar title="面经分享" isLink path="/home/find"></hmNavBar>
    <div class="content">
      <!-- search搜索   show-action为是否显示取消   search为回车进行搜索 cancel为点击了取消-->
      <van-search
        v-model="inputValue"
        show-action
        placeholder="请输入关键字"
        @search="search"
        @cancel="cancel"
      />
      <!-- ********展示列表 -->
      <div v-if="showList">
        <!-- list 上拉加载更多 -->
        <!-- v-model:是否处于加载中  finished：是否加载完成 finished-text：加载完成后显示的文本 @load= "加载过程中的方法" -->
        <van-list
          v-if="bol"
          v-model="loading"
          :finished="finished"
          finished-text="没有更多数据了"
          @load="load"
        >
          <!-- 使用组件 展示分享列表-->
          <shareItem
            v-for="(item, index) in list"
            :key="index"
            :info="item"
          ></shareItem>
        </van-list>
      </div>
      <!-- ********展示大家都在搜和历史搜索 showList = false -->
      <div v-else class="history">
        <h3 class="history-title">大家都在搜</h3>
        <!-- 注册tag标签点击事件 把值赋给输入框 执行搜索 -->
        <van-tag
          color="#f7f4f5"
          text-color="#9595a5"
          class="tag"
          v-for="(item, index) in historyList"
          :key="index"
          @click="tagClick(item)"
          >{{ item }}</van-tag
        >
        <!-- 单元格 -->
        <van-cell center>
          <template #title>
            <h3 class="history-title">历史搜索</h3>
          </template>
          <template #default>
            <!-- 添加清空按钮 -->
            <div class="clear" @click="clear">清空</div>
          </template>
        </van-cell>
        <van-tag
          color="#f7f4f5"
          text-color="#9595a5"
          class="tag"
          v-for="(item, index) in localList"
          :key="index"
          @click="tagClick(item)"
          >{{ item }}</van-tag
        >
      </div>
    </div>
  </div>
</template>

<script>
// 导入子组件
import shareItem from './shareItem'
// 导入api
import { articlesShare, articlesShareTopSearch } from '@/api/find.js'
import { setLocal, getLocal } from '@/utils/local.js' // 导入存储
export default {
  data () {
    return {
      inputValue: '', // 输入框的值
      list: [], // 面经分享列表
      currentPage: 0, // 当前页
      pageSize: 2, // 页容量
      loading: false, // 是否处于加载过程中 true：正在加载（滚动条小于300 让它自动执行load方法） false：加载完成
      finished: false, // 是否加载完成 true：加载完成（不再执行load）false：没加载完成
      bol: true, // 用于静默刷新
      showList: true, // 是否展示列表
      historyList: [], // 大家都在搜列表
      // 进入到页面获取存储的搜索历史数据 如果不存在则取空数组
      localList: JSON.parse(getLocal('history')) || [] // 搜索历史列表
    }
  },
  // 注册组件
  components: {
    shareItem
  },
  async created () {},
  methods: {
    // ****************************上拉加载方法
    async load () {
      this.currentPage++
      const _q = {
        start: (this.currentPage - 1) * this.pageSize,
        limit: this.pageSize,
        q: this.inputValue
      }
      // 调用面经分享列表方法
      const res = await articlesShare(_q)
      window.console.log(res)
      res.data.data.list.forEach(item => {
        // 去掉空字符串的情况
        if (this.inputValue.trim() !== '') {
          // 得到以inputValue作分割的数组
          const _title = item.title.split(this.inputValue)
          // window.console.log(_title)
          item.title = _title.join(
            `<span style = "color:red">${this.inputValue}</span>`
          )
          // window.console.log(item.title)
        }
      })
      this.list.push(...res.data.data.list) // 获取数据后添加数据
      // 当次加载完成后要将loading修改为false表示当次加载完成
      this.loading = false
      // 判断是否是最后一页（也就是是否所有数据已加载完成）
      if (res.data.data.total <= this.list.length) {
        // 如果已完成 则把finished变成true 不再执行加载
        this.finished = true
      }
    },
    // ****************************搜索
    search () {
      // 还原数据
      this.list = []
      this.currentPage = 0
      this.loading = false
      this.finished = false
      // van-list前面加载完成后 还原了响应数据vue识别不到 我们需要让它重新启动  使用静默刷新
      this.bol = false
      this.$nextTick(() => {
        this.bol = true
      })
      // 搜索时把showList改为true
      this.showList = true

      if (this.inputValue.trim() !== '') {
        // 存储搜索历史
        this.localList.unshift(this.inputValue)
        // 搜索历史数组去重
        this.localList = [...new Set(this.localList)]
        // 限制长度
        // splice(从哪开始，删除多少位数据，插入什么数据) 可以改变原数组
        this.localList.splice(5)
        // 本地存储  刷新时还存在
        setLocal('history', JSON.stringify(this.localList)) // 数组转为字符串存储
      }
    },
    // ****************************取消
    async cancel () {
      this.showList = false // 不显示列表
      // 为了防止多次调用 做了一个if判断
      if (this.historyList.length === 0) {
        const res = await articlesShareTopSearch()
        window.console.log(res)
        this.historyList = res.data.data // 存储返回的搜素历史列表
      }
    },
    // ****************************tag搜索事件
    tagClick (str) {
      // 1.把tag标签的值赋值给输入框
      this.inputValue = str
      // 2.执行搜索事件
      this.search()
    },
    // ****************************清空事件
    clear () {
      this.localList = [] // 清空数组
      // 存储
      setLocal('history', JSON.stringify(this.localList))
    }
  }
}
</script>

<style lang="less" scoped>
.shareList {
  .content {
    padding: 0 @p15;
  }
  .search {
    padding-left: 0;
    padding-right: 0;
  }
  .history {
    .history-title {
      font-size: 18px;
      font-family: PingFangSC, PingFangSC-Medium;
      font-weight: 600;
      text-align: left;
      color: #222222;
      line-height: 25px;
      letter-spacing: 0px;
      margin-top: 30px;
    }
    // 搜索的历史
    .tag {
      padding: 6px 8px;
      margin-top: 15px;
      margin-right: 15px;
    }
    .clear {
      margin-top: 33px;
      margin-right: 10px;
    }
    .van-cell {
      padding: 0;
    }
  }
}
</style>
