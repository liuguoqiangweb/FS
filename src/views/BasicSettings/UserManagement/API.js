import request from '@/utils/request'

// 用户管理列表
export function userQueryList(data) {
  return request({
    url: '/User/QueryList',
    method: 'post',
    data
  })
}

// 新增用户
export function addUser(data) {
  return request({
    url: '/User/Save',
    method: 'post',
    data
  })
}

// 停用/启用账号
export function changeUserStatus(data) {
  return request({
    url: '/User/OpenOrStop',
    method: 'post',
    data
  })
}

// 解锁账号
export function unlockUser(data) {
  return request({
    url: '/User/UnLock',
    method: 'post',
    data
  })
}

// 删除用户
export function deleteUser(data) {
  return request({
    url: '/User/Delete',
    method: 'post',
    data
  })
}

// 重置密码
export function resetPassword(data) {
  return request({
    url: '/User/ResetPassword',
    method: 'post',
    data
  })
}

// 地区下拉数据
export function getRegionList(data) {
  return request({
    url: '/BusinessAreaBaseInfo/QueryComboData',
    method: 'post',
    data
  })
}
