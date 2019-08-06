import request from '@/utils/request'

// 发送验证码
export function sendCode(data) {
  return request({
    url: '/User/SendDynamic',
    method: 'post',
    data
  })
}

// 登录
export function login(data) {
  return request({
    url: '/User/Login',
    method: 'post',
    data
  })
}

// 退出登录
export function logout(data) {
  return request({
    url: '/User/Logout',
    method: 'post',
    data
  })
}

// 修改密码
export function modifyPassword(data) {
  return request({
    url: '/User/UpdatePassword',
    method: 'post',
    data
  })
}

// 获取所有按钮
export function getButtons(data) {
  return request({
    url: '/Menu/QueryBtnListByUser',
    method: 'post',
    data
  })
}

// 用户下拉数据
export function getUserList(data) {
  return request({
    url: '/User/QueryComboData',
    method: 'post',
    data
  })
}
