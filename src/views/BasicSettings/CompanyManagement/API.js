import request from '@/utils/request'

// 公司下拉数据
export function getCompanyList(data) {
  return request({
    url: '/BaseData/QueryCompanyComboData',
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

// 保存
export function saveInfo(data) {
  return request({
    url: '/BaseData/Save',
    method: 'post',
    data
  })
}

// 删除
export function deleteInfo(data) {
  return request({
    url: '/BaseData/Delete',
    method: 'post',
    data
  })
}
