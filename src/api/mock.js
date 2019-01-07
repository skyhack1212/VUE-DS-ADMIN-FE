import * as API from './base'

const getGroupList = params => {
  return API.GET('/mock/mock_group/findlist', params)
}

const addGroup = params => {
  return API.POST('/mock/mock_group/add', params)
}

const delGroup = params => {
  return API.POST('/mock/mock_group/del', params)
}

const updateGroup = params => {
  return API.POST('/mock/mock_group/update', params)
}

const getFactoryList = params => {
  return API.GET('/mock/mock_detail/findlist', params)
}

const updateType = params => {
  return API.POST('/mock/mock_detail/update_type', params)
}

const updateStatus = params => {
  return API.POST('/mock/mock_detail/update_status', params)
}

const activateStatus = params => {
  return API.POST('/mock/mock_ser/activate', params)
}

const inactiveStatus = params => {
  return API.POST('/mock/mock_ser/inactive', params)
}

const deleteMock = params => {
  return API.POST('/mock/mock_detail/del', params)
}

const addMock = params => {
  return API.POST(`/mock/mock_detail/add`, params)
}

const editMock = params => {
  return API.POST(`/mock/mock_detail/update`, params)
}

export default {
  getGroupList,
  addGroup,
  delGroup,
  updateGroup,
  getFactoryList,
  updateType,
  updateStatus,
  deleteMock,
  addMock,
  editMock,
  activateStatus,
  inactiveStatus,
}
