<template>
  <div class="myInfo">
    <!-- 使用公共的hmNavBar组件 -->
    <hmNavBar path="/home/my" title="我的资料"></hmNavBar>
    <div class="content">
      <myCell
        title="头像"
        type="img"
        :value="userInfo.avatar"
        @click.native="goEdit('avatar')"
      ></myCell>
      <div class="other">
        <!--点击昵称与个人简介时通过路由传参相应的字段名 -->
        <myCell
          title="昵称"
          :value="userInfo.nickname"
          @click.native="goEdit('nickname')"
        ></myCell>
        <!-- {
          0:"未知",
          1:"男",
          2:"女"
          } -->
        <!-- 在组件上使用原生事件 @click.native就可以使用原生事件了
        el-input  @keyup.enter.native
         -->

        <myCell
          title="性别"
          :value="genderObj[userInfo.gender]"
          @click.native="showGender = true"
        ></myCell>
        <myCell
          title="地区"
          :value="areaData.city_list[userInfo.area]"
          @click.native="showCity = true"
        ></myCell>
        <myCell
          title="个人简介"
          :value="userInfo.intro"
          @click.native="goEdit('intro')"
        ></myCell>
        <van-button block color="#fff" class="btn" @click="exit">
          <span class="red">退出登录</span>
        </van-button>
      </div>
    </div>
    <!--性别选择弹框 1
     van-popup
     v-model:是否显示
     position:位置  1
      van-picker
      title:标题
      show-toolbar:是否显示工具拦
      columns="数组数据"
      default-index:默认选中某项的索引
      @cancel="取消点击事件"
      @confirm="确定点击事件(value,index)=>{value选中项的值 index:选中项的索引}"
    -->
    <van-popup v-model="showGender" position="bottom">
      <van-picker
        title="性别选择"
        show-toolbar
        :default-index="userInfo.gender"
        :columns="Object.values(genderObj)"
        @cancel="showGender = false"
        @confirm="genderConfirm"
      ></van-picker>
    </van-popup>

    <!-- 城市选择弹框 -->
    <van-popup v-model="showCity" position="bottom">
      <!-- van-area
      title="标题"
      area-list:城市数据
      columns-num:3:省市区 2:省市 1:省
      value:默认选中城市的code
      @confirm="(value,index)=>{value选中的值,index选中的索引}"
     @cancel="取消" -->
      <van-area
        title="城市选择"
        :area-list="areaData"
        columns-num="2"
        :value="userInfo.area"
        @cancel="showCity = false"
        @confirm="cityConfirm"
      ></van-area>
    </van-popup>
  </div>
</template>

<script>
import myCell from './mycell' // 导入组件
import { mapState } from 'vuex'
import { removeLocal } from '@/utils/local.js'
import { auEdit } from '@/api/my.js'
import area from '@/assets/js/area.js'
export default {
  data () {
    return {
      genderObj: {
        // 性别
        0: '未知',
        1: '男',
        2: '女'
      },
      showGender: false, // 性别弹框
      showCity: false, // 城市弹框
      areaData: area // 省市区数据
    }
  },
  // 注册myCell组件
  components: {
    myCell
  },
  // 简化对state数据的操作
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    // 退出登录
    exit () {
      // 弹出确认框
      /*
      this.$dialog.confirm({
        title:标题,
        message:"内容"
      }).then(()=>{
        //确定处理
      }).catch(()=>{
        //取消处理
      })
      */
      this.$dialog
        .confirm({
          title: '温馨提示',
          message: '您确认退出登录吗？'
        })
        .then(() => {
          // 1.清除token
          removeLocal('token')
          // 2.修改是否登录
          this.$store.commit('getLoginState', false)
          // 3.跳转到登录页面
          this.$router.push('/login')
        })
        .catch(() => {})
    },
    // 性别 选择确定
    genderConfirm (value, index) {
      window.console.log(value, index)
      this.showGender = false
      // 点击确定时触发编辑用户信息方法
      this.editInfo('gender', index)
    },
    // 城市选择确定
    cityConfirm (value, index) {
      window.console.log(value, index)
      this.showCity = false
      // 点击确定时触发编辑用户信息方法
      this.editInfo('area', value[1].code)
    },
    // 编辑用户信息
    editInfo (key, value) {
      // 对象内的key希望是变量{[变量名]:值}
      auEdit({
        [key]: value
      }).then(() => {
        // 一定是成功
        // 提示一下
        this.$toast.success('修改资料成功')
        // 刷新用户信息 调用actions里面的getUserInfo
        this.$store.dispatch('getUserInfo')
      })
    },
    // 跳转路由到相应页面
    /**
     * 路由传参
     *传：this.$router.push("path?参数名=值")
     *收：this.$route.query.参数名
     */
    goEdit (str) {
      this.$router.push('/home/editInfo?type=' + str)
    }
  }
}
</script>

<style lang="less" scoped>
.myInfo {
  height: 100%;
  background-color: #f7f4f5;
  .content {
    padding: 18px @p15;
    .other {
      padding-top: 10px;
    }
    .btn {
      margin-top: 10px;
      .red {
        color: red;
      }
    }
  }
}
</style>
