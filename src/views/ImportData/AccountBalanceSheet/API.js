import request from '@/utils/request'

// 删除
export function deleteInfo(data) {
  return request({
    url: '/SubjectBalance/Delete',
    method: 'post',
    data
  })
}

// 数据字典-地区类别下拉数据
export function dataDictionary(data) {
  return request({
    url: '/BasicData/QueryComboxDataByParentNo',
    method: 'post',
    data
  })
}

// 导入
export function importInfo(url, data) {
  return request({
    url: url,
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

// 公司下拉数据
export function getCompanyList(data) {
  return request({
    url: '/BaseData/QueryList',
    method: 'post',
    data
  })
}
