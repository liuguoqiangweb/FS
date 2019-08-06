import request from '@/utils/request'

// 管理树形控件
export function getTree(data) {
  return request({
    url: '/UserCompany/QueryTreeData',
    method: 'post',
    data
  })
}

// 保存
export function saveInfo(data) {
  return request({
    url: '/UserCompany/Save',
    method: 'post',
    data
  })
}

// 查询用户绑定的公司
export function getBindCompany(data) {
  return request({
    url: '/UserCompany/QueryList',
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
