/**
 * Created by ds_sky on 2018/10/11.
 */
import * as API from './base'
const name = 'db'

export default {
  findList: (params) => {
    return API.GET(`/qa/${name}/findlist`, params)
    // return API.GET_TMP(`/qa/${name}/findlist`, params)
  },
  findById: (id, params) => {
    return API.GET(`/qa/${name}/find/${id}`, params)
    // return API.GET_TMP(`/qa/${name}/find/${id}`, params)
  },
  add: params => {
    return API.POST(`/qa/${name}/add`, params)
  },
  update: (id, params) => {
    console.log(params)
    return API.POST(`/qa/${name}/update`, params)
    // return API.POST_TMP(`/qa/${name}/update`, params)
  },
  delete: id => {
    return API.POST(`/qa/${name}/delete/${id}`)
  }
}
