<template>
  <div class="editInfo">
    <!-- 1.在父组件内的子组件标签上定义一个相应的方法  @子组件方法名 = 父组件方法 -->
    <!-- inputValue无值时不显示保存按钮 -->
    <!-- 点击不同的字段显示不同的标题 -->
    <hmNavBar
      :title="title[type]"
      :right="inputValue ? '保存' : ''"
      @saveInfo="save"
      :path="path"
    ></hmNavBar>
    <div class="content">
      <!-- 输入框  van-field   v-model:双向绑定  label:标题 slot = "left-icon/button" -->
      <!-- 当类型不为头像时显示输入框 当类型是头像时显示附件上传 -->
      <van-field
        class="field"
        v-model="inputValue"
        v-if="type !== 'avatar'"
      ></van-field>
      <!-- 文件上传 -->
      <!-- v-model：双向绑定上传数据   before-read：上传前处理，大小类型判断  after-read:文件读取完成  max-count:限制上传张数 -->
      <van-uploader
        v-model="uploadFile"
        :before-read="beforeRead"
        :after-read="afterRead"
        :before-delete="del"
        :max-count="1"
        v-else
      >
      </van-uploader>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { auEdit, upload } from '@/api/my.js' // 导入api
export default {
  data () {
    return {
      inputValue: '',
      type: this.$route.query.type, // 获取相应路由传参的字段名
      title: {
        // 标题
        nickname: '修改昵称',
        intro: '修改个人简介',
        avatar: '修改头像',
        position: '修改岗位'
      },
      uploadFile: [], // 上传文件的v-model值
      path: '/home/myInfo' // 因为点击我的岗位要跳转到my.vue 所有需要分情况
    }
  },

  computed: {
    ...mapState(['userInfo'])
  },
  created () {
    // 根据不同的type处理path
    if (this.type === 'position') {
      this.path = '/home/my'
    }
    if (this.type === 'avatar') {
      if (this.userInfo[this.type]) {
        // 默认图片处理
        this.uploadFile[0] = {
          url: process.env.VUE_APP_URL + this.userInfo[this.type]
        }
      }
    } else {
      //  如果type不是avatar时才给inputValue赋值
      // 输入框的值显示路由传参的字段名
      this.inputValue = this.userInfo[this.type]
    }
  },
  methods: {
    save () {
      // input有值时才显示保存
      if (this.inputValue) {
        // 保存时调用编辑信息
        this.editInfo()
      }
    },
    // ******************************
    editInfo () {
      auEdit({
        // 编辑保存调用接口时字段名也不能写死
        // 对象内的key希望是变量{[变量名]:值}
        [this.type]: this.inputValue
      }).then(() => {
        // 走到了这里一定是成功
        //  1.提示一下
        this.$toast.success('修改资料成功')
        // 2.刷新用户信息
        this.$store.dispatch('getUserInfo')
        // 3.跳转到我的信息
        this.$router.push(this.path)
      })
    },
    // ********************************
    // 上传前
    beforeRead (file) {
      window.console.log('22')
      // 判断类型和大小
      const isImg = file.type === 'image/png'
      const limit1M = file.size / 1024 / 1024 < 1
      if (!isImg) {
        // 提示
        this.$toast.fail('请上传PNG格式图片')
      }
      if (!limit1M) {
        // 提示
        this.$toast.fail('请上传大小在1M内的图片')
      }
      return isImg && limit1M
    },
    // 文件读取后
    afterRead (res) {
      window.console.log('33')
      const _formData = new FormData()
      _formData.append('files', res.file) // files为参数 参考接口文档
      // 加上loading
      this.uploadFile[0].status = 'uploading'
      // 调用文件上传的api
      upload(_formData).then(res2 => {
        window.console.log(res2)
        // 修改图片我们只需要传递id
        this.inputValue = res2.data.data[0].id
        // 去掉loading
        this.uploadFile[0].status = 'done'
      })
    },
    // 文件删除前处理
    del () {
      // 让保存按钮消失
      this.inputValue = ''
      return true
    }
  }
}
</script>

<style lang="less" scoped>
.editInfo {
  .content {
    padding: 20px @p15;
    text-align: center;
    .field {
      background-color: #f7f4f5;
    }
  }
}
</style>
