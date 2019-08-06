import request from '@/utils/request'

// 地区下拉数据
export function getRegionList(data) {
  return request({
    url: '/BusinessAreaBaseInfo/QueryComboData',
    method: 'post',
    data
  })
}

// 地区管理树形控件
export function getTree(data) {
  return request({
    url: '/BusinessAreaBaseInfo/QueryTreeData',
    method: 'post',
    data
  })
}

// 保存地区信息
export function saveInfo(data) {
  return request({
    url: '/BusinessAreaBaseInfo/Save',
    method: 'post',
    data
  })
}

// 删除地区信息
export function deleteInfo(data) {
  return request({
    url: '/BusinessAreaBaseInfo/Delete',
    method: 'post',
    data
  })
}
