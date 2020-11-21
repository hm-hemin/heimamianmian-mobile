<template>
  <div class="home">
    <!-- 嵌套路由  （1）在需要设置嵌套路由的地方添加一个router-view标签（2）配置该路由的子集 -->
    <!--部分页面上的数据不太会发生改变，但是每次当切换到这个页面时，页面都会重新发送请求，没有必要。所以我们可以将当前页面上的数据缓存起来，下次打开时不再需要发送请求。缓存数据可以使用 `keep-alive`  -->
    <!-- 如果只希望缓存的固定的几个组件，可以使用 `include` 属性 include后面跟的值是组件的名字  注意：希望缓存的组件一定要加name -->
    <keep-alive include="find">
      <router-view></router-view>
    </keep-alive>

    <!-- 标签栏 -->
    <!-- van-tabbar    -->
    <!-- v-model:对应下面子项的索引值(从0开始) -->
    <!-- active-color="选中后的颜色" -->
    <!-- inactive-color="没有选中时的颜色" -->
    <!-- van-tabbar-item  icon="只能使用vant的图标"  -->
    <!-- slot="default/icon"  -->
    <!--placeholder 固定在底部时 是否在标签位置生成一个登高的占位元素  -->
    <!-- route:true:使用路由模式(使用路由模式后,不需要使用v-model了,它会自动识别当前路由地址与下面子项的to匹配) -->
    <!-- 使用v-if判断 当需要路由的时候才显示    v-if="this.$route.meta.needTab" -->
    <!-- 1
     $router:整个路由的管理者,this.$router.push(path)
     $route:小秘书(想知道哪个当前公司基本信息),只能告诉我们当前路由的基本信息
      -->
    <van-tabbar
      active-color="#e40137"
      inactive-color="#b4b4bd"
      v-model="active"
      class="tabbar"
      placeholder
      route
      v-if="this.$route.meta.needTab"
    >
      <van-tabbar-item to="/home/company">
        <template #default>
          <div class="title">公司</div>
        </template>
        <template #icon>
          <i class="iconfont">&#xe63d;</i>
        </template>
      </van-tabbar-item>
      <van-tabbar-item to="/home/question">
        <template #default>
          <div class="title">
            刷题
          </div>
        </template>
        <template #icon>
          <i class="iconfont">&#xe63f;</i>
        </template>
      </van-tabbar-item>
      <van-tabbar-item to="/home/find">
        <template #default>
          <div class="title">
            发现
          </div>
        </template>
        <template #icon>
          <i class="iconfont">&#xe646;</i>
        </template>
      </van-tabbar-item>
      <van-tabbar-item to="/home/my">
        <template #default>
          <div class="title">
            我的
          </div>
        </template>
        <template #icon>
          <i class="iconfont">&#xe64b;</i>
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  data () {
    return {
      active: 3 // van-tabbar选中的下标
    }
  }
}
</script>

<style lang="less" scoped>
.home {
  .tabbar {
    height: 60px;
  }
  .iconfont {
    font-size: 28px;
  }
}
</style>
