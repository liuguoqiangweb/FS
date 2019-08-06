import request from '@/utils/request'

// 查询表格数据
export function queryList(url, data) {
  return request({
    url: url,
    method: 'post',
    data
  })
}
