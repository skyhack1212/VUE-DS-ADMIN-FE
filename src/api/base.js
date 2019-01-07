/**
 * Created by ds_sky on 2018/10/11.
 */
import axios from 'axios'
import {bus} from '../bus.js'
import { Message } from 'element-ui'
import { getUser } from '@/utils/user'

// axios.defaults.withCredentials = true
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';//配置请求头
// axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';

// 添加一个请求拦截器
axios.interceptors.request.use(config => {
  const user = getUser()
  if (!user) {
    bus.$emit('goto', '/login')
    return config;
  }
  config.headers['User'] = user
  return config
}, error => {
  Promise.reject(error)
})

// 添加一个响应拦截器
axios.interceptors.response.use(function (response) {
  // console.log(response);
  const data = response.data;
  if (data && data.errcode) {
    if (parseInt(data.errcode) === 41000) {
      // 未登录
      bus.$emit('goto', '/login')
    } else if (parseInt(data.errcode) === 42000) {
      // 没有权限
      bus.$emit('goto', '/noauth')
    }
    // else if (parseInt(data.errcode) !== 0) {
    //   Message({
    //     message: data.errmsg,
    //     type: 'error',
    //     duration: 3 * 1000
    //   })
    //   return Promise.reject(new Error(data.errmsg))
    // }
  }
  return response
}, function (error) {
  Message({
    message: error && error.errmsg || '服务器开小差了，请稍后再试！',
    type: 'error',
    duration: 3 * 1000
  })
  return Promise.reject(error)
})

// 接口地址baseURL统一配置
let baseURL = 'http://xx.x.xx.xxx:12306'
// let baseURL = 'http://xx.x.xx.xxx:12306'
// let baseURL = 'http://xx.x.xx.xxx:32783'
let baseURL1 = 'http://xx.x.xx.xxx:12306'
let baseURL2 = 'http://xx.x.xx.xxx:10000'
let baseURL3 = 'http://xx.x.xx.xxx:8000'

// 通用方法
export const POST = (url, params) => {
  return axios.post(`${baseURL}${url}`, params).then(res => res.data)
}

export const POST_TMP = (url, params) => {
  return axios.post(`${baseURL1}${url}`, params).then(res => res.data)
}

export const GET = (url, params) => {
  return axios.get(`${baseURL}${url}`, {params: params}).then(res => res.data)
}

export const GET_TMP = (url, params) => {
  return axios.get(`${baseURL1}${url}`, {params: params}).then(res => res.data)
}

export const GET_Temp2 = (url, params) => {
  return axios.get(`${baseURL2}${url}`, {params: params}).then(res => res.data)
}

export const GET_Temp3 = (url, params) => {
  return axios.get(`${baseURL3}${url}`, {params: params}).then(res => res.data)
}

// 上传路径
// eg. http://127.0.0.1:8084/api/file/upload/
export const UPLOADURL = `${baseURL}/api/file/upload/`

// 下载路径,后面跟filename参数,例如, DOWNLOAD + "?filename=eeffe750-fcdc-4b1c-931b-80835efab92b.png"
export const DOWNLOADURL = `${baseURL}/api/file/download`

// pdf文件预览,例如,PDFVIEWER+'?file=PDF文件流或者不跨域的PDF文件路径'
export const PDFVIEWER = `${baseURL}/pdf/viewer.html`

// 返回指定的接口路径
export const RETURNURL = (url) => {
  return `${baseURL}${url}`
}
