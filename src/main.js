// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import GlobalMethods from '@/tools/GlobalMethods'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import NProgress from 'nprogress'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/styles/iconfont.css'
import '@/assets/styles/main.less'
import 'font-awesome/scss/font-awesome.scss'
import Cookies from 'js-cookie'
import API from './api/user'

// productionTip变量---Vue2.2.0新增 类型：boolean，默认值：true。作用：设置为false，用来阻止vue再启动时生成生产提示
Vue.config.productionTip = false
//开启debug模式
Vue.config.debug = true

// 进行插件注册,use方法参考:Vue.use源码分析 http://www.cnblogs.com/dupd/p/6716386.html
Vue.use(GlobalMethods)
Vue.use(ElementUI)  

// 路由检测
// register global progress.
Array.prototype.contain = function (obj) {
  var i = this.length;
  while (i--) {
    if (this[i] === obj) {
      return true;
    }
  }
  return false;
}


//操作cookie
const TokenKey ='mm768_token'
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

//调用后端接口拿到access_token
export function getAccessToken(params) {
  return API.login(params)
}
let result = {}

// const whiteList = ['/login','/signUp', '/401', '/404'] // 不重定向白名单
// const blockList=['/','/login']//登录或授权后，cookie获取用户信息，需要屏蔽路由名单

router.beforeEach((to, from, next) => {
  // localStorage.mm768_token = '767e15e0fdea31e64c581da8fc18882e'
  // let login = localStorage.mm768_token
  let mm768_token = getToken()
  let mm768_user = Cookies.get("authcenter_usr")
  if (typeof(mm768_token) == "undefined") {
    mm768_token = ""
    mm768_user = "nobody"
  }
  // console.log(mm768_user)
  let request_params = { token: mm768_token, name: mm768_user}
  // let result1 =  getAccessToken(request_params).then(res => {
  //   console.log(res.data)
  //   return res.data
  // });
  // console.log(request_params)

  getAccessToken(request_params).then(res =>{
    result = res
    // console.log(result)
    // console.log(mm768_token)
    let get_access_token_ok = result.errcode
    // console.log(get_access_token_ok)
    let path = to.path
    if (path === '/login' && get_access_token_ok === 10002) {
    // if (path === '/login') {
      // next()
      // window.location.href = "http://auth.in.taou.com/login.php?goto=http://localhost:8085/"
      // window.location.href = "http://auth.in.taou.com/login.php?goto=http://mm768.in.taou.com:8085/"
      window.location.href = "http://auth.in.taou.com/login.php?goto=http://mm768.in.taou.com/"
      return
    }
    if (get_access_token_ok === 0) {
      if (path === '/') {
        next({
          path: '/dashboard'
        })
      } else {
        next()
      }
    } else {
      next()
    }
  });

  // console.log(Cookies.getJSON('user'))
  // if (Cookies.getJSON('user')) {
  //   if (blockList.contain(to.path)) {//登录或授权后，需要屏蔽路由名单
	// 		router.replace({path: '/main'})
	// 	} else {
	// 		if (!store.getters.permissionRouters) { // 判断当前用户是否已经获得完整的可访问的路由
	// 			  store.dispatch('GetPermissionRouters',Cookies.getJSON('user').role).then(res=>{
  //         router.addRoutes(store.getters.permissionRouters)
  //         next(to.path)
  //       })
	// 		} else {
  //         next()
	// 		}
	// 	}
  // } else {
  //   console.log('token 不存在')
    // router.replace({ path: 'http://auth.in.taou.com/login.php?goto=http://localhost:8085/login'})
    // router.replace({ path: '/goto'})
    // whiteList.contain(to.path) ? next():router.replace({ path: '/goto'})
  // }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
