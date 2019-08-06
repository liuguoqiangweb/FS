import request from '@/utils/request'

// 数据字典树形控件
export function getTree(data) {
  return request({
    url: '/BasicData/QueryTreeData',
    method: 'post',
    data
  })
}

// 保存
export function saveInfo(data) {
  return request({
    url: '/BasicData/Save',
    method: 'post',
    data
  })
}

// 删除
export function deleteInfo(data) {
  return request({
    url: '/BasicData/Delete',
    method: 'post',
    data
  })
}
