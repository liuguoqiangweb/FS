import request from '@/utils/request'

// 获取角色数据
export function getRoles(data) {
  return request({
    url: '/Role/QueryTreeData',
    method: 'post',
    data
  })
}

// 获取菜单、按钮树形数据
export function getMenuTree(data) {
  return request({
    url: '/Menu/QueryTreeMenuButtonData',
    method: 'post',
    data
  })
}

// 保存
export function saveInfo(data) {
  return request({
    url: '/Role/SavePrivilege',
    method: 'post',
    data
  })
}

// 获取已授权的菜单、按钮
export function getRoleCheckedNodes(data) {
  return request({
    url: '/Role/QueryUserPrivilege',
    method: 'post',
    data
  })
}
