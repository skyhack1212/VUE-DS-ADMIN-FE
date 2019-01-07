/**
 * Created by ds_sky on 2018/10/11.
 */
import * as API from './base'
const name = 'user'
const admin = 'admin'

export default {
  login: params => {
    return API.POST(`/pt/${admin}/user_token`, params)
  },
  logout: params => {
    return API.GET(`/user_token_out`, params)
  },
  profile: params => {
    return API.POST(`/pt/${admin}/user_token`, params)
  },
  reload: params => {
    return API.POST(`/pt/${admin}/user_token`, params)
  },
  changepwd: params => {
    return API.POST(`/api/${name}/changepwd`, params)
  },
  findById: (id, params) => {
    return API.GET(`/pt/${name}/find/${id}`, params)
  },
  findList: params => {
    return API.POST(`/pt/${name}/findlist`, params)
  },
  delete: id => {
    return API.POST(`/pt/${name}/del/${id}`)
  },
  updateAvatar: params => {
    return API.POST(`/api/${name}/avatar/save`, params)
  },
  add: params => {
    return API.POST(`/api/${name}/add`, params)
  },
  update: (id, params) => {
    return API.POST(`/pt/${name}/update`, params)
  },
  updateAuth: params => {
    return API.POST(`/api/${name}/auth/save`, params)
  }
}
