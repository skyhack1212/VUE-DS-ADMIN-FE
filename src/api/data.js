/**
 * Created by ds_sky on 2018/10/11.
 */
import * as API from './base'
const name = 'data'

export default {
  get_regist_code: params => {
    return API.GET(`/xxxxx/yyyyyy/get_regist_code`, params)
  },
  get_redis_list: () => {
    return API.GET_Temp2(`/list`)
  },

  get_contacts: params => {
    return API.GET(`/xxxxx/yyyyyy/get_contacts`, params)
  },

  findById: (id, params) => {
    return API.GET(`/api/${name}/find/${id}`, params)
  },
  add: params => {
    return API.POST(`/api/${name}/add`, params)
  },
  update: (id, params) => {
    return API.POST(`/api/${name}/update/${id}`, params)
  },
  delete: id => {
    return API.POST(`/api/${name}/delete/${id}`)
  }
}
