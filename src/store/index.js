/**
 * Created by ds_sky on 2018/10/11.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import permission from './modules/permission'
import menu from './modules/menu'
import data from './modules/data'
import data_db from './modules/data_db'
import data_mobiles from './modules/data_mobiles'
import category from './modules/category'
import mock from './modules/mock'
import createLogger from 'vuex/dist/logger'
import {asyncRouterMap, constantRouterMap} from '@/router/index.js'
import TYPE from './mutation-types'
Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  state: {
    loading: false,
    currentActive: '-1',
    currentUser: null,
    permissions: []
  },
  getters: {
    currentUser: function (state) {
      return state.currentUser
    },
    storageUser: function (state) {
      let user
      try {
        // 从localStorage中获取
        user = JSON.parse(window.localStorage.getItem('access-user'))
      } catch (ex) {
        localStorage.removeItem('access-user')
        user = null
      }
      return user
    }
  },
  mutations: {
    [TYPE.setLoading] (state, status) {
      state.loading = status
    },
    [TYPE.setCurrentUser] (state, user) {
      state.currentUser = user
    },
    [TYPE.setCurrentActive] (state, menuIndex) {
      state.currentActive = menuIndex
    },
    [TYPE.setPermissions] (state, permissions) {
      state.permissions = permissions
    }
  },
  modules: {
    user,
    permission,
    menu,
    data,
    data_db,
    data_mobiles,
    category,
    mock
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
