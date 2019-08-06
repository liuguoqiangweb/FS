import request from '@/utils/request'

// 获取菜单
export function getMenuTree(data) {
  return request({
    url: '/Menu/QueryUserMenu',
    method: 'post',
    data
  })
}
