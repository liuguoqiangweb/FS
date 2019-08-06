import request from '@/utils/request'

// 树形控件
export function getTree(data) {
  return request({
    url: '/Role/QueryTreeData',
    method: 'post',
    data
  })
}

// 保存角色
export function saveInfo(data) {
  return request({
    url: '/Role/Save',
    method: 'post',
    data
  })
}

// 删除
export function deleteInfo(data) {
  return request({
    url: '/Role/Delete',
    method: 'post',
    data
  })
}

// 保存角色用户信息
export function saveRoleUser(data) {
  return request({
    url: '/Role/SaveRoleUsers',
    method: 'post',
    data
  })
}

// 删除角色用户
export function deleteRoleUser(data) {
  return request({
    url: '/Role/DeleteRoleUser',
    method: 'post',
    data
  })
}
