import request from '@/utils/request'

// 财务科目树形控件
export function getTree(data) {
  return request({
    url: '/Account/QueryTreeData',
    method: 'post',
    data
  })
}

// 查数据字典下拉
export function dataDictionary(data) {
  return request({
    url: '/BasicData/QueryComboxDataByParentNo',
    method: 'post',
    data
  })
}

// 保存
export function saveInfo(data) {
  return request({
    url: '/Account/Save',
    method: 'post',
    data
  })
}

// 删除
export function deleteInfo(data) {
  return request({
    url: '/Account/Delete',
    method: 'post',
    data
  })
}
