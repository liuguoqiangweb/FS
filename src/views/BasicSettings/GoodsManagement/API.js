import request from '@/utils/request'

// 系列下拉数据
export function getCategoryList(data) {
  return request({
    url: '/ProductCategory/QueryComboData',
    method: 'post',
    data
  })
}

// 保存
export function saveInfo(data) {
  return request({
    url: '/ProductInfo/Save',
    method: 'post',
    data
  })
}

// 删除
export function deleteInfo(data) {
  return request({
    url: '/ProductInfo/Delete',
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
