/**
 * Created by ds_sky on 2018/10/11.
 */
import * as API from './base'
const name = 'menuset'

export default {
  findList: params => {
    return API.GET(`/pt/menuset/findlist`, params)
  },
  findCategoryAll: () => {
    return API.GET(`/pt/category/all`)
  },
  findById: (id) => {
    return API.GET(`/pt/menuset/find/${id}`)
  },
  add: params => {
    return API.POST(`/pt/menuset/add`, params)
  },
  update: (id, params) => {
    return API.POST(`/pt/menuset/update`, params)
  },
  delete: id => {
    return API.POST(`/pt/menuset/del/${id}`)
  }
}
