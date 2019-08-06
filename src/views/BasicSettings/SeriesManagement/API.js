import request from '@/utils/request'

// 保存系列
export function saveInfo(data) {
  return request({
    url: '/ProductCategory/Save',
    method: 'post',
    data
  })
}

// 删除系列
export function deleteInfo(data) {
  return request({
    url: '/ProductCategory/Delete',
    method: 'post',
    data
  })
}

// 系列下拉数据
export function getSeriesList(data) {
  return request({
    url: '/ProductCategory/QueryComboData',
    method: 'post',
    data
  })
}
