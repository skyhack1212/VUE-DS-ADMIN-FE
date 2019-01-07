/**
 * Created by ds_sky on 2018/10/11.
 */
import * as API from './base'
const name = 'category'

export default {
  all: () => {
    return API.GET(`/api/${name}/all`)
  },
  findList: params => {
    return API.GET(`/pt/${name}/findlist`, params)
  },
  findById: (id) => {
    return API.GET(`/api/${name}/find/${id}`)
  },
  findByParentId: (id) => {
    return API.GET(`/pt/menuset/findp/${id}`)
  },
  add: params => {
    return API.POST(`/pt/${name}/add`, params)
  },
  update: (id, params) => {
    return API.POST(`/pt/${name}/update`, params)
  },
  delete: id => {
    return API.POST(`/pt/${name}/del/${id}`)
  }
}
