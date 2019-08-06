import request from '@/utils/request'

// 删除
export function deleteInfo(data) {
  return request({
    url: '/BaseData/Delete',
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
    url: '/BaseData/QueryCompanyComboData',
    method: 'post',
    data
  })
}

// 数据字典
export function dataDictionary(data) {
  return request({
    url: '/BasicData/QueryComboxDataByParentNo',
    method: 'post',
    data
  })
}
