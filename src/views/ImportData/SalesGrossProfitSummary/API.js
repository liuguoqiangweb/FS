import request from '@/utils/request'

// 删除
export function deleteInfo(data) {
  return request({
    url: '/ImpGrossProfit/Delete',
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
