import request from '@/utils/request'

// 管理树形控件
export function getTree(data) {
  return request({
    url: '/Menu/QueryTreeData',
    method: 'post',
    data
  })
}

// 保存菜单
export function saveInfo(data) {
  return request({
    url: '/Menu/Save',
    method: 'post',
    data
  })
}

// 删除菜单
export function deleteInfo(data) {
  return request({
    url: '/Menu/Delete',
    method: 'post',
    data
  })
}

// 保存按钮
export function saveBtn(data) {
  return request({
    url: '/Menu/SaveBtn',
    method: 'post',
    data
  })
}

// 删除按钮
export function deleteBtn(data) {
  return request({
    url: '/Menu/DeleteBtn',
    method: 'post',
    data
  })
}

// 数据字典-按钮位置下拉数据
export function dataDictionary(data) {
  return request({
    url: '/BasicData/QueryComboxDataByParentNo',
    method: 'post',
    data
  })
}
