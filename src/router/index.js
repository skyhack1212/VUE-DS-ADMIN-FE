import Vue from 'vue'
import Router from 'vue-router'
import RouteHelper from '@/tools/RouteHelper'
import store from '../store'
import TYPE from '../store/mutation-types'
import Home from '@/views/Home'
import Dashboard from '@/views/Dashboard'
import Login from '@/views/Login'
import NoAuth from '@/views/NoAuth'
import NotFound from '@/views/NotFound'
import API from '../api/menu'

const UserList = resolve => require(['@/views/user/List'], resolve)
const UserAddOrEdit = resolve => require(['@/views/user/AddOrEdit'], resolve)
const UserProfile = resolve => require(['@/views/user/Profile'], resolve)

const DataList = resolve => require(['@/views/data/ListGet'], resolve)
const DataBusinessList = resolve => require(['@/views/data_business/BusinessListGet'], resolve)
const DataNetworkList = resolve => require(['@/views/data_network/ListGet'], resolve)
const DataProduceList = resolve => require(['@/views/data_produce/ListMake'], resolve)
const DataIMProduceList = resolve => require(['@/views/data_produce/IMMake'], resolve)
const DataDBList = resolve => require(['@/views/data_db/List'], resolve)
const DataDBAddOrEdit = resolve => require(['@/views/data_db/AddOrEdit'], resolve)
const DataMobilesList = resolve => require(['@/views/data_mobiles/List'], resolve)
const DataMobilesAddOrEdit = resolve => require(['@/views/data_mobiles/AddOrEdit'], resolve)
const DataRedisList = resolve => require(['@/views/data_redis/ListGet'], resolve)
const DataMockFactory = resolve => require(['@/views/data_mock/MockFactory'], resolve)
const DataMockGroup = resolve => require(['@/views/data_mock/MockGroup'], resolve)
const EditMock = resolve => require(['@/views/data_mock/EditMock'], resolve)
const MockDetail = resolve => require(['@/views/data_mock/MockDetail'], resolve)

const PermissionList = resolve => require(['@/views/permission/List'], resolve)
const PermissionAddOrEdit = resolve => require(['@/views/permission/AddOrEdit'], resolve)

const MenuList = resolve => require(['@/views/menu/List'], resolve)
const MenuAddOrEdit = resolve => require(['@/views/menu/AddOrEdit'], resolve)

const ToolBox = resolve => require(['@/views/common/ToolBox'], resolve)

/**
 * 静态路由
 * 下面的路由属于默认的必须有的路由
 * path 路由
 * component 组件
 * redirect 重定向
 * name 路由名称
 * menuShow 在右侧菜单中是否显示(自定义字段)
 * menuName 菜单显示时的名称（自定义字段）
 * menuPath 单个菜单(没有展开功能)时的跳转路径，只显示一个菜单填值(自定义字段)
 * iconCls 菜单前面的小图标（自定义字段）
 * @type {[*]}
 */
export const constantRouterMap = [
  {
    path: '/login',
    component: Login
  },
  {
    path: '/',
    component: Home,
    menuShow: true,
    menuName: '首页',
    menuPath: '/dashboard',
    iconCls: 'iconfont icon-home',
    children: [
      {path: '/dashboard', component: Dashboard, name: 'dash_board'}
    ]
  },
  {
    path: '/noauth',
    component: Home,
    redirect: {name: 'noauth'},
    children: [
      {path: '/noauth/index', component: NoAuth, name: 'noauth'}
    ]
  },
  {
    path: '/myself',
    component: Home,
    redirect: {name: 'profile'},
    children: [
      {path: '/myself/profile', component: UserProfile, name: 'profile'}
    ]
  }
]

/**
 * 动态路由(相关参数说明参见上面的静态路由)
 * 下面的路由会根据用户的权限动态加载
 * @type {[*]}
 */
let menuList1 = [
  {
    path: '/data',
    component: Home,
    redirect: {name: 'datalist'},
    menuShow: true,
    menuName: '数据查询',
    iconCls: 'iconfont icon-search',
    children: [
      {
        path: '/data/list', component: DataList, name: 'datalist', menuShow: true, menuName: '用户信息查询',
        meta: {permission: 'AuthDataView'}
      },
      {
        path: '/data_network/list', component: DataNetworkList, name: 'data_networklist', menuShow: true, menuName: 'network信息查询',
        meta: {permission: 'AuthDataNetworkView'}
      },
      {
        path: '/data_business/list', component: DataBusinessList, name: 'data_businesslist', menuShow: true, menuName: '商业信息查询',
        meta: {permission: 'AuthDataBusinessView'}
      },
      {
        path: '/data_db/list', component: DataDBList, name: 'data_dblist', menuShow: true, menuName: '测试DB查询',
        meta: {permission: 'AuthDataDBView'}
      },
      {
        path: '/data_redis/list', component: DataRedisList, name: 'dataredislist', menuShow: true, menuName: '测试redis查询',
        meta: {permission: 'AuthDataRedisView'}
      },
      {
        path: '/data_db/add', component: DataDBAddOrEdit, name: 'data_dbadd',
        meta: {permission: 'AuthDataDBAdd'}
      },
      {
        path: '/data_db/edit/:id', component: DataDBAddOrEdit, name: 'data_dbedit',
        meta: {permission: 'AuthDataDBEdit'}
      },
      {
        path: '/data_mobiles/list', component: DataMobilesList, name: 'data_mobileslist', menuShow: true, menuName: '测试设备管理',
        meta: {permission: 'AuthDataMobilesView'}
      },
      {
        path: '/data_mobiles/add', component: DataMobilesAddOrEdit, name: 'data_mobilesadd',
        meta: {permission: 'AuthDataMobilesAdd'}
      },
      {
        path: '/data_mobiles/edit/:id', component: DataMobilesAddOrEdit, name: 'data_mobilesedit',
        meta: {permission: 'AuthDataMobilesEdit'}
      },
      // {
      //   path: '/data/category', component: DataCategory, name: 'datacategory', menuShow: true, menuName: '用户关系链',
      //   meta: {permission: 'AuthCategoryView'}
      // },
      // {
      //   path: '/data/feed', component: DataCategory, name: 'datafeed', menuShow: true, menuName: 'feed',
      //   meta: {permission: 'AuthFeedView'}
      // }
    ]
  },
  {
    path: '/data_produce',
    component: Home,
    redirect: {name: 'data_producelist'},
    menuShow: true,
    menuName: '数据生产',
    iconCls: 'iconfont icon-datas1',
    children: [
      {
        path: '/data_produce/list', component: DataProduceList, name: 'data_producelist', menuShow: true, menuName: '用户信息构造',
        meta: {permission: 'AuthDataProduceView'}
      },
      {
        path: '/data_produce/IMlist', component: DataIMProduceList, name: 'data_produceIMlist', menuShow: true, menuName: 'IM信息构造',
        meta: {permission: 'AuthDataIMProduceView'}
      }
    ]
  },
  {
    path: '/data_mock',
    component: Home,
    redirect: {name: 'data_mock'},
    menuShow: true,
    menuName: '数据Mock',
    iconCls: 'iconfont icon-setting1',
    children: [
      {
        path: '/data_mock/factory', component: DataMockFactory, menuShow: true, menuName: 'Mock工厂',
        meta: {permission: 'AuthDataMockFactory'},
      },
      {
        path: '/data_mock/edit', component: EditMock, menuShow: false, menuName: '编辑',
        meta: {permission: 'AuthDataMockEdit'},
      },
      {
        path: '/data_mock/detail', component: MockDetail, menuShow: false, menuName: 'Mock详情',
        meta: {permission: 'AuthDataMockDetail'},
      },
    ]
  },
  {
    path: '',
    component: Home,
    redirect: {name: 'commontools'},
    menuShow: true,
    menuName: '常用工具',
    iconCls: 'iconfont icon-setting1',
    children: [
      {
        path: '/common/toolbox', component: ToolBox, menuShow: true, menuName: '工具箱',
        meta: {permission: 'AuthToolBox'}
      }
    ]
  },
  {
    // 后台管理功能约定只给role===1的使用（比如是admin）
    path: '/background',
    component: Home,
    redirect: {name: 'backgroundlist'},
    menuShow: true,
    menuName: '后台管理',
    iconCls: 'iconfont icon-user',
    children: [
      {
        path: '/menu/list', component: MenuList, name: 'menulist', menuShow: true, menuName: '菜单管理',
        meta: {permission: 'AuthMenuPermissionView'}
      },
      {
        path: '/data_mock/group', component: DataMockGroup, menuShow: true, menuName: '分组管理',
        meta: {permission: 'Admin'}
      },
      {
        path: '/menu/add', component: MenuAddOrEdit, name: 'menuadd',
        meta: {permission: 'AuthMenuPermissionAdd'}
      },
      {
        path: '/menu/edit/:id', component: MenuAddOrEdit, name: 'menuedit',
        meta: {permission: 'AuthMenuPermissionEdit'}
      },
      {path: '/user/list', component: UserList, name: 'userlist', menuShow: true, menuName: '权限管理', meta: {permission: 'AuthUserView'}},
      {path: '/user/add', component: UserAddOrEdit, name: 'useradd', meta: {permission: 'AuthUserAdd'}},
      {path: '/user/edit/:id', component: UserAddOrEdit, name: 'useredit', meta: {permission: 'AuthUserEdit'}},
      {path: '/dashboard', component: Dashboard, name: 'dashboard', menuShow: true, menuName: '数据统计', meta: {permission: 'AuthUserEdit'}}
    ]
  },
  { // 其它没有匹配到的路由都会跳至此模块(404）
    // 该路由为必须路由，不需要权限，必须放在最后
    path: '*',
    name: 'notfound',
    component: NotFound
  }
]
// let menuList = API.get_all_menu().then(res =>res.data);
// console.log(menuList)
// let menuList = [
//   { // 其它没有匹配到的路由都会跳至此模块(404）
//     // 该路由为必须路由，不需要权限，必须放在最后
//     path: '*',
//     name: 'notfound',
//     component: NotFound
//   }
// ]
export const asyncRouterMap = menuList1

Vue.use(Router)

const router = new Router({
  // mode: 'history',
  mode: 'hash',
  routes: constantRouterMap
})

/**
 * 此处拦截路由判断
 */
router.beforeEach((to, from, next) => {
  // 在此处进行路由拦截处理

  // 获取用户信息
  let user = store.getters.currentUser
  // console.log(user)
  if (!user) {
    user = store.getters.storageUser
    // console.log(user)
    if (user) {
      store.commit(TYPE.setCurrentUser, user)
    }
  }

  if (!user) {
    // console.log("user")
    // 没有登录的情况：访问登录页直接通过,访问其它页面跳转到登录页
    to.path.startsWith('/login') ? next() : next({path: '/login'})
    // window.location.href = "http://auth.in.taou.com/login.php?goto=http://mm768.in.taou.com:8085/"
  }
  else {
    // 已经登录的情况
    // console.log(to.path)
    if (to.path.startsWith('/login')) {
      // 访问登录页直接跳转到首页
      next({path: '/'})
    }
    else if (RouteHelper.addRouters.length === 0) {
      // 页面强制刷新情况处理
      goAndRefresh()
    }
    // else if (to.path.startsWith('http')) {
    //   window.location.href = to.path
    // }
    else {
      next()
    }
  }

  async function goAndRefresh () {
    if (user.expire && Date.now() > user.expire) {
      // console.log('**用户缓存信息超过预设时间，准备更新数据**')
      try {
        let mm768_token = Cookies.get("mm768_token")
        let mm768_user = Cookies.get("authcenter_usr")
        let request_params = { token: mm768_token, name: mm768_user}
        // let result = await store.dispatch('user/reload')
        let result = await store.dispatch('user/reload')
        if (result && result.errcode === 0) {
          router.addRoutes(RouteHelper.addRouters)
          router.options.routes = RouteHelper.routers
          next({path: to.path})
        } else {
          resetRouterCache(user.permissions)
        }
      } catch (ex) {
        resetRouterCache(user.permissions)
      }
    } else {
      resetRouterCache(user.permissions)
    }
  }

  function resetRouterCache (permissions) {
    store.commit(TYPE.setPermissions, permissions)
    RouteHelper.setRouters(permissions)
    router.addRoutes(RouteHelper.addRouters)
    router.options.routes = RouteHelper.routers
    next({path: to.path})
  }
})

export default router
