/**
 * Created by fengxiaomao on 2018/12/11.
 */

import API from '@/api/mock'
import { Message } from 'element-ui'
import { cloneDeep } from 'lodash'
import router from '@/router'


const formatBody = (obj) => {
  let success = false
  let parse = {}
  const res = cloneDeep(obj)
  const req = Object.assign(res.body.request || {}, {
    method: res.method,
    uri: res.api_name,
  })
  if (typeof res.response === 'string') {
    try {
      parse = JSON.parse(res.response)
      success = true
    } catch (error) {
    }
  } else {
    success = true
    parse = res.response
  }

  if (res.delayTime) {
    parse.latency = parse.latency || {}
    parse.latency.duration = res.delayTime;
    parse.latency.unit = parse.latency.unit || 'second';
  }

  if (!success) {
    Message({
      message: 'response 对象格式有误',
      type: 'error',
      duration: 3 * 1000
    })
    return null
  }
  const body = {
    request: req,
    response: parse,
  }
  if (res.redirectUrl) {
    body.redirectTo = res.redirectUrl
  }
  res.body = JSON.stringify(body)
  res.type = +res.type
  return res
}

const state = {
  mockGroupList: [],
  mockApiList: [],
  factoryList: [],
  factoryFilter: {
    group_id: '',
    api_id: '',
  },
  mockFactoryPagination: {
    total: 0,
    page: 1,
    limit: 10
  },
  singleMock: {
    group_id: '',
    mock_detail_name: '',
    api_name: '',
    body: {},
    response: {
      status: "200",
      json: {
        data: {
          result: "",
          errmsg: ""
        }
      }
    },
    description: '',
    type: '0',
    method: 'get',
    protocol: 'http',
    delayTime: 0,
    redirectUrl: ''
  }
}

const actions = {
  async getGroupList ({ commit }) {
    const res = await API.getGroupList()
    commit('setGroupList', res.data)
  },
  async addGroup ({}, payload) {
    const res = await API.addGroup(payload)
    return res
  },
  async delGroup ({}, payload) {
    const res = await API.delGroup(payload)
    return res
  },
  async updateGroup ({}, payload) {
    const res = await API.updateGroup(payload)
    return res
  },
  async getFactoryList ({ commit }, payload) {
    const res = await API.getFactoryList(payload)
    if (res.errcode === 0) {
      commit('setFactoryList', res.data)
    } else {
      Message({
        message: res.errmsg,
        type: 'error',
        duration: 3 * 1000
      })
    }
  },
  async updateType ({ commit }, payload) {
    const res = await API.updateType({
      id: payload.id,
      type: payload.type === 0 ? 1 : 0
    })
    if (res.errcode === 0) {
      commit('updateType', payload)
    } else {
      Message({
        message: res.errmsg,
        type: 'error',
        duration: 3 * 1000
      })
    }
    return res
  },
  async updateStatus ({ commit }, payload) {
    let res;
    if (payload.status === 1) {
      res = await API.inactiveStatus({
        id: payload.id,
      })
    } else {
      res = await API.activateStatus({
        id: payload.id,
      })
    }
    if (res.errcode === 0) {
      commit('updateStatus', payload)
    } else {
      Message({
        message: res.errmsg,
        type: 'error',
        duration: 3 * 1000
      })
    }
    return res
  },
  async deleteMock ({ commit }, payload) {
    const res = await API.deleteMock(payload)
    if (res.errcode === 0) {
      Message({
        message: '服务删除成功！',
        type: 'success',
        duration: 3 * 1000
      })
      commit('deleteMock', payload)
    } else {
      Message({
        message: res.errmsg,
        type: 'error',
        duration: 3 * 1000
      })
    }
    return res
  },
  async addMock ({ }, payload) {
    const data = formatBody(payload);
    if (!data) {
      return;
    }
    delete data.id;
    const res = await API.addMock(data)
    if (res.errcode === 0) {
      Message({
        message: '创建成功！',
        type: 'success',
        duration: 3 * 1000
      })
      router.push({ path: '/data_mock/factory'})
    } else {
      Message({
        message: res.errmsg,
        type: 'error',
        duration: 3 * 1000
      })
    }
    return res;
  },
  async editMock ({ }, payload) {
    const data = formatBody(payload);
    if (!data) {
      return;
    }
    const res = await API.editMock(data)
    if (res.errcode === 0) {
      Message({
        message: '编辑成功！',
        type: 'success',
        duration: 3 * 1000
      })
      router.push({ path: '/data_mock/factory'})
    } else {
      Message({
        message: res.errmsg,
        type: 'error',
        duration: 3 * 1000
      })
    }
    return res;
  },
}

const mutations = {
  setGroupList (state, data) {
    state.mockGroupList = data || [];
  },
  modifyGroup (state, data) {
    const find = state.mockGroupList.findIndex(o => {
      return o.id === data.id
    });
    if (find > -1) {
      state.mockGroupList[find].name = data.name
      state.mockGroupList[find].description = data.description
    }
  },
  removeGroup (state, data) {
    const find = state.mockGroupList.findIndex(o => {
      return o.id === data.id
    });
    if (find > -1) {
      state.mockGroupList.splice(find, 1);
    }
  },
  setFactoryList (state, data) {
    state.factoryList = data.items || []
    state.mockApiList = data.apis_items || []
    state.mockFactoryPagination.limit = data.limit;
    state.mockFactoryPagination.page = data.page;
    state.mockFactoryPagination.total = data.total;
  },
  updateFactoryFilter (state, payload) {
    state.factoryFilter = {
      ...state.factoryFilter,
      ...payload
    };
  },
  updateType (state, payload) {
    const list = cloneDeep(state.factoryList)
    const find = list.findIndex(v => {
      return +v.id === +payload.id
    })
    if (find > -1) {
      list[find].type = payload.type === 0 ? 1 : 0
    }
    state.factoryList = list
  },
  updateStatus (state, payload) {
    const list = cloneDeep(state.factoryList)
    const find = list.findIndex(v => {
      return +v.id === +payload.id
    })
    if (find > -1) {
      list[find].status = payload.status === 0 ? 1 : 0
    }
    state.factoryList = list
  },
  deleteMock (state, payload) {
    const list = cloneDeep(state.factoryList)
    const find = list.findIndex(v => {
      return +v.id === +payload.id
    })
    if (find > -1) {
      list.splice(find, 1)
    }
    state.factoryList = list
  },
  updatePagination (state, payload) {
    state.mockFactoryPagination = {
      ...state.mockFactoryPagination,
      ...payload
    }
  },
  assignSingleMock (state, payload) {
    const body = payload.body;
    const response = body.response;
    const request = body.request;
    if (request && request.method) {
      state.singleMock.method = request.method;
    }

    if (response && response.latency != undefined) {
      state.singleMock.delayTime = response.latency.duration || 0;
    }

    if (body && body.redirectTo) {
      state.singleMock.redirectUrl = body.redirectTo;
    }

    if (body.response && Object.keys(body.response).length > 0) {
      state.singleMock.response = body.response;
    }

    state.singleMock = {
      ...state.singleMock,
      ...payload
    }
  },
  modifySingleMock (state, payload) {
    state.singleMock = {
      ...state.singleMock,
      ...payload
    }
  },
  resetSingleMock(state) {
    state.singleMock = {
      group_id: '',
      mock_detail_name: '',
      api_name: '',
      body: {},
      response: {
        status: "200",
        json: {
          data: {
            result: "",
            errmsg: ""
          }
        }
      },
      description: '',
      type: '0',
      method: 'get',
      protocol: 'http',
      delayTime: 0,
      redirectUrl: ''
    }
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
