<template>
  <div>
    <el-table
      ref="table"
      :key="tableKey"
      v-loading="loading"
      :data="tableData"
      :border="tableAttr.border"
      :stripe="tableAttr.stripe"
      :fit="tableAttr.fit"
      :height="tableHeight"
      highlight-current-row
      :show-summary="showSummary"
      :empty-text="this.$t('common.NotData')"
      :summary-method="getSummaries"
      @selection-change="handleSelectionChange"
    >
      <!-- #索引列 -->
      <el-table-column type="index" width="50" fixed="left">
        <template slot-scope="scope">
          <span>{{ scope.$index + (PageIndex - 1) * PageSize + 1 }}</span>
        </template>
      </el-table-column>
      <!-- 多选框列 -->
      <el-table-column v-if="tableAttr.isSelection" type="selection" width="55" fixed="left" />
      <!-- 数据展示列 -->
      <el-table-column
        v-for="(column,index) in tableColumn"
        :key="index"
        :prop="column.prop"
        :label="column.label"
        :width="column.width"
        :fixed="column.fixed === undefined ? false:true"
        :min-width="column.minWidth === undefined ? 100 : column.minWidth"
        :sortable="column.sortable === undefined ? true : column.sortable"
      >
        <!-- 表头 -->
        <template slot="header">
          <span v-if="column.isStar" style="color:red">*</span>
          <span>{{ column.label }}</span>
        </template>
        <!-- 表身 -->
        <template slot-scope="cell">
          <slot :cell="cell" :row="cell.row" :column="cell.column" :name="column.prop">
            <!-- 如果只是简单的状态码转换，则用formatter -->
            <span v-if="column.formatter">{{ column.formatter(cell.row[column.prop]) }}</span>
            <!-- 如果是编码转名称，则用key -->
            <span v-else-if="column.key">{{ formatterList(formatterData[column.key], cell.row[column.prop]) }}</span>
            <span v-else :style="{color:column.isClick?'blue':''}" @dblclick="handleClipboard(cell.row[column.prop],$event)">{{ cell.row[column.prop] }}</span>
          </slot>
        </template>
      </el-table-column>
      <!-- 右侧多选框列，效果参考(基础设置-数据权限设置) -->
      <el-table-column v-if="tableAttr.rightSelection" width="150" type="selection" fixed="right" />
      <!-- 操作列 -->
      <el-table-column
        v-if="tableButton.buttons && tableButton.buttons.length > 0"
        :label="this.$t('common.Operation')"
        :width="tableButton.operateWidth"
        fixed="right"
      >
        <template slot-scope="scope">
          <span
            v-for="(item,index) in tableButton.buttons"
            :key="index"
          >
            <el-button
              v-if="handleShowEvent(item, scope.row, scope.$index)"
              :type="item.type === undefined? '':item.type"
              style="margin-right:15px"
              @click="handleClick(scope.$index, scope.row, item.btnCode)"
            >{{ $t('buttons.'+item.btnName) }}</el-button>
          </span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="isPage" ref="pagination" :total="total" :page.sync="PageIndex" :limit.sync="PageSize" @pagination="getList" />
  </div>
</template>

<script>
import { queryList } from './API'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import clipboard from '@/utils/clipboard'
export default {
  name: 'ComplexTable',
  components: { Pagination },
  props: {
    tableColumn: {
      type: Array,
      default: () => {}
    },
    tableAttr: {
      type: Object,
      default: () => {}
    },
    tableButton: {
      type: Object,
      default: () => {}
    },
    formatterData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      tableKey: 0,
      total: 0,
      loading: true, // 是否loading
      tableData: [], // 表格当前页数据
      allDatas: [], // 所有数据，备用
      isPage: this.tableAttr.isPage === undefined ? true : this.tableAttr.isPage, // 是否分页
      PageIndex: 1,
      PageSize: this.tableAttr.isPage === false ? 100 : 15, // 如果不分页，则默认查询100条数据
      // 是否合计
      showSummary: this.tableAttr.showSummary === undefined ? false : this.tableAttr.showSummary,
      tableHeight: this.tableAttr.height === undefined ? null : this.tableAttr.height,
      btnShowEvent: this.tableButton.btnShowEvent === undefined ? null : this.tableButton.btnShowEvent,
      headerHeight: null,
      allButtons: this.$store.state.common.buttons || JSON.parse(localStorage.getItem('FsAllButtons')),
      menuNo: JSON.parse(localStorage.getItem('FsMenuNo')),
      // 需要合计的列集合
      summaryColumn: []
    }
  },
  watch: {
    // 监听以下集合，只有有值才触发方法
    'formatterData.regionList': {
      handler(newList, oldList) {
        this.formatterData.regionList = newList
      },
      immediate: false
    },
    'formatterData.companyList': {
      handler(newList, oldList) {
        this.formatterData.companyList = newList
      },
      immediate: false
    },
    'formatterData.categoryList': {
      handler(newList, oldList) {
        this.formatterData.categoryList = newList
      },
      immediate: false
    },
    'formatterData.seriesList': {
      handler(newList, oldList) {
        this.formatterData.seriesList = newList
      },
      immediate: false
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    // 获取el-header元素，提取height属性值
    const elHeader = document.querySelector('.el-container>.el-header')
    this.headerHeight = parseInt(window.getComputedStyle(elHeader).height)

    if (this.isPage) {
      this.tableHeight = document.body.clientHeight - 84 - this.headerHeight - 80 + 'px'
    } else {
      this.tableHeight = document.body.clientHeight - 84 - this.headerHeight - 40 + 'px'
    }

    this.$nextTick(() => {
      if (this.allButtons.length > 0) {
        // 获取表格列按钮
        const tableButtons = this.allButtons.reduce((prev, cur) => {
          cur && cur.menuNo === this.menuNo && cur.region === 'B190611007' ? prev.push({ btnCode: cur.btnCode, btnName: cur.btnName, type: cur.type }) : ''
          return prev
        }, [])
        // 如果传过来的参数有按钮，接收默认按钮，否则接收请求返回的按钮
        this.tableButton.buttons = this.tableButton.buttons.length > 0 ? this.tableButton.buttons : tableButtons
      }
    })

    // 组装合计列
    this.summaryColumn = this.tableColumn.reduce((prev, curr) => {
      curr.isSummary ? prev.push(curr['prop']) : ''
      return prev
    }, [])
  },
  methods: {
    // 初始化表格数据
    getList() {
      // 如果没有带参数，仅把分页参数插入，否则把分页参数一同放入请求参数里面
      const parameter = this.tableAttr.Conditions === undefined
        ? { PageIndex: this.PageIndex, PageSize: this.PageSize } : { Conditions: this.tableAttr.Conditions, PageIndex: this.PageIndex, PageSize: this.PageSize }

      this.loading = true
      // 发送请求
      queryList(this.tableAttr.url, { Data: parameter }).then(response => {
        if (response.data.MsgStatus === 1) {
          this.allDatas = this.tableData = response.data.Data
          console.log('this.tableData', this.tableData)
          // 计算分页控件显示数
          this.total = response.data.TotalCount ? response.data.TotalCount : 0

          // 如果当前选中的页码大于总页码，则把页面设置为1，重新查询
          if (this.PageIndex - this.total / this.PageSize > 1) {
            this.PageIndex = 1
            this.getList()
          }
        }
        this.loading = false
      })
    },

    // 按钮点击事件
    handleClick(index, row, btnCode) {
      this.$emit('on-event', {
        index: index,
        row: row,
        btnCode: btnCode
      })
    },

    // 表格多选数据
    handleSelectionChange(datas) {
      this.$emit('on-Selection', datas)
    },

    // 按钮显示事件
    handleShowEvent(item, row, index) {
      item.isShow = true
      if (this.btnShowEvent) {
        item.isShow = this.btnShowEvent(item.btnCode, row)
      }
      return item.isShow
    },

    // 编码转名称方法
    formatterList(list, value) {
      if (list) {
        const obj = list.find(item => item.Key === value)
        return obj ? obj.Value : value
      }
    },

    // 自定义合计方法
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }

        const values = data.map(item => {
          return { value: Number(item[column.property]), prop: column.property }
        })

        if (this.summaryColumn.includes(column.property)) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr.value)
            if (!isNaN(value)) return prev + curr.value
          }, 0)
          sums[index] = '¥' + sums[index]
        } else {
          sums[index] = '--'
        }
      })
      return sums
    },

    // 单击复制到粘贴板
    handleClipboard(text, event) {
      clipboard(text, event)
    }
  }
}
</script>

<style lang="scss">
.el-table-column--selection{
  .cell{
    text-align: center !important
  }
}
</style>
