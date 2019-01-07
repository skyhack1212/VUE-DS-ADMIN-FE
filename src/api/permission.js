/**
 * Created by ds_sky on 2018/10/11.
 */
import * as API from './base'
const name = 'permission'

export default {
  all: () => {
    return API.GET(`/permission_all`)
  },
  findList: params => {
    return API.GET(`/api/${name}/findlist`, params)
  },
  findById: (id) => {
    return API.GET(`/api/${name}/find/${id}`)
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
