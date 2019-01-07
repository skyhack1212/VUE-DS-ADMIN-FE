<template>
  <div class="page-wrapper page-wrapper--profile" v-loading.fullscreen.lock="loading">
    <div class="page-breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>个人信息</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="page-main">
      <el-form ref="form" :model="userForm" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model='userForm.name' disabled></el-input>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model='userForm.nickname'></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model='userForm.email'></el-input>
        </el-form-item>
        <el-form-item label="手机">
          <el-input v-model='userForm.mobile'></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="btn-long" @click="handleSubmit" >更新</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import TYPE from '@/store/mutation-types'
  import Cookies from 'js-cookie'

  export default {
    data () {
      const checkMobile = (rule, value, callback) => {
        if (!value) {
          callback()
        } else if (/^1\d{10}$/.test(value)) {
          callback()
        } else {
          callback(new Error('手机号格式不正确!'))
        }
      }
      const checkEmail = (rule, value, callback) => {
        if (!value) {
          callback()
        } else if (/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)) {
          callback()
        } else {
          callback(new Error('电子邮箱格式不正确!'))
        }
      }
      return {
        orgInfo: {},
        userInfo: {},
        userForm: {
          name: '',
          nickname: '',
          mobile: '',
          email: ''
        },
        userRule: {
          name: [
            {required: true, message: '用户名不能为空', trigger: 'blur'}
          ],
          nickname: [
            {required: true, message: '姓名不能为空', trigger: 'blur'}
          ],
          mobile: [
            {validator: checkMobile, trigger: 'blur'}
          ],
          email: [
            {validator: checkEmail, trigger: 'blur'}
          ]
        },
      }
    },
    computed: {
      ...mapState(['loading'])
    },
    methods: {
      ...mapActions('user', ['profile', 'update']),
      loadData: async function () {
        try {
          this.$store.commit(TYPE.setLoading, true)
          let mm768_token = Cookies.get("mm768_token")
          let mm768_user = Cookies.get("authcenter_usr")
          let request_params = { token: mm768_token, name: mm768_user}
          let result = await this.profile(request_params)
          this.$store.commit(TYPE.setLoading, false)
          if (result && result.errcode === 0) {
            this.orgInfo = _.cloneDeep(result.data)
            this.userForm = result.data
          } else {
            this.$msgError(result.errmsg)
          }
        } catch (error) {
          console.log(error)
          this.$store.commit(TYPE.setLoading, false)
          this.$msgError('请求出现异常')
        }
      },
      checkValid: async function () {
        let valid = false
        try {
          valid = await this.$refs.userForm.validate()
        } catch (error) {
        }
        return valid
      },
      handleSubmit: async function () {
        // this.$msgInfo('功能未开发...')
        if (this.loading) {
          return
        }
        let valid = await this.checkValid()
        if (!valid) {
          return
        }
        console.log(1111111111)
        try {
          // 修改用户
          let params = _.clone(this.userForm)
          params.id = Number(this.userForm.id)
          this.$store.commit(TYPE.setLoading, true)
          console.log(params)
          let result = await this.update(params)
          console.log(result)
          this.$store.commit(TYPE.setLoading, false)
          if (result && result.errcode === 0) {
            this.$msgSuccess('修改成功')
          } else {
            this.$msgError(result.errmsg)
          }
        } catch (error) {
          console.log(error)
          this.$store.commit(TYPE.setLoading, false)
          this.$msgError('请求出现异常')
        }
      }
    },
    mounted () {
      this.loadData()
    }
  }
</script>

<style scoped lang="less">
  .page-wrapper--profile {

    .page-main {
      padding-top: 15px;
    }
    .el-form {
      padding: 0px;

      .el-form-item {
        margin-bottom: 15px;
      }

      .el-form-item .el-input {
        max-width: 420px;
      }
    }
  }
</style>
