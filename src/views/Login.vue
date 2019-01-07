<template>
  <!-- <el-container class="app-container" style="background: #458B74">
    <el-header style="height: 50px;border-bottom: 1px solid #e7e7e7;">
      <div style="width:100%;padding-top: 10px;">
        <img src="../assets/logo.png" height="30px;" align="absmiddle"/>
        <span style="padding-left: 10px;"><b> 数据管理平台</b></span>
      </div>
    </el-header>

    <el-form ref="AccountFrom" :model="account" :rules="rules" label-position="left" label-width="0px"
             class="login-form">
      <el-form-item prop="username">
        <el-input type="text" v-model="account.username" suffix-icon="iconfont icon-seeuser"
                  auto-complete="off" placeholder="用户名/邮箱"></el-input>
      </el-form-item>
      <el-form-item prop="passwd">
        <el-input type="password" v-model="account.passwd" suffix-icon="iconfont icon-key"
                  auto-complete="off" placeholder="密码" @keyup.enter.native="handleLogin"></el-input>
      </el-form-item>
      <el-form-item style="width:100%;">
        <el-button type="primary" style="width:100%;" @click.native.prevent="handleLogin" :loading="loading">
          <b>登 录</b>
        </el-button>
        <div style="background: #efefef;padding:5px;border-radius: 5px;font-size: 12px;margin-top: 5px;">
          <p style="margin: 0px;line-height: 20px;">超级管理员：admin/123456</p>
          <p style="margin: 0px;line-height: 20px;">普通管理员：demo/demo@demo</p>
        </div>
      </el-form-item>
    </el-form>

  </el-container> -->
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import TYPE from '@/store/mutation-types'
  import RouteHelper from '../tools/RouteHelper'
  import Cookies from 'js-cookie'

  const TokenKey="mm768_token"
  export default {
    data () {
      return {
        account: {
          username: '',
          passwd: ''
        },
        rules: {
          username: [{required: true, message: '请输入账号', trigger: 'blur'}],
          passwd: [{required: true, message: '请输入密码', trigger: 'blur'}]
        },
        access_token: {
          token: '',
          name: ''
        },
        result: {}
      }
    },
    created: function() {
      this.handleLogin()
    },
    computed: {
      ...mapState(['loading'])
    },
    methods: {
      ...mapActions('user',
        ['login']
      ),
      // check_token: function(){
      //   let access_token = Cookies.get(TokenKey)
      //   console.log(access_token)
      //   if (access_token) {
      //     this.$store.commit(TYPE.setLoading, true)
      //     let result = await this.login(this.account)
      //     console.log(result)
      //     this.$store.commit(TYPE.setLoading, false)
      //     if (result && result.errcode === 0) {
      //       // 登录成功设置路由
      //       this.$router.addRoutes(RouteHelper.addRouters)
      //       this.$router.options.routes = RouteHelper.routers
      //
      //       // 登录成功跳转
      //       this.$router.push({path: '/'})
      //       return
      //     } else {
      //       this.$msgError(result.errmsg)
      //       return
      //     }
      //   }
      // },
      handleLogin: async function () {
        try {
          // let valid = await this.$refs.AccountFrom.validate()
          // if (valid) {
          // let access_token = await this.getToken(this.TokenKey)
          let get_access_token = Cookies.get(TokenKey)
          let get_access_user = Cookies.get("authcenter_usr")
          // console.log(get_access_token)
          if (get_access_token) {
            this.$store.commit(TYPE.setLoading, true)
            this.access_token.token = get_access_token
            console.log(get_access_token)
            this.access_token.name = get_access_user
            this.result = await this.login(this.access_token)
            console.log(this.result)
            this.$store.commit(TYPE.setLoading, false)
            if (this.result && this.result.errcode === 0 ) {
              // 登录成功设置路由
              this.$router.addRoutes(RouteHelper.addRouters)
              this.$router.options.routes = RouteHelper.routers

              // 登录成功跳转
              this.$router.push({path: '/'})
            } else {
              this.$msgError(result.errmsg)
            }
          }
        } catch (error) {
          this.$store.commit(TYPE.setLoading, false)
          this.$msgError('error: 请求出现异常!')
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .login-form {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 160px auto;
    width: 320px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;

    background: -ms-linear-gradient(top, #fff, #6495ed); /* IE 10 */
    background: -moz-linear-gradient(top, #b8c4cb, #f6f6f8); /*火狐*/
    background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#b8c4cb), to(#f6f6f8)); /*谷歌*/
    background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#fff), to(#6495ed)); /* Safari 4-5, Chrome 1-9*/
    background: -webkit-linear-gradient(top, #fff, #6495ed, #fff); /*Safari5.1 Chrome 10+*/
    background: -o-linear-gradient(top, #fff, #6495ed); /*Opera 11.10+*/
  }
</style>
