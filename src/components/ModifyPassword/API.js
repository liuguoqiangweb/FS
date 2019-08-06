import request from '@/utils/request'

// 修改密码
export function modifyPassword(data) {
  return request({
    url: '/User/UpdatePassword',
    method: 'post',
    data
  })
}
