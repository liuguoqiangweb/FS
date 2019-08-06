<template>
  <el-container>
    <!-- 顶部按钮 -->
    <el-header style="position:relative">
      <table-search :search-config="searchConfig" :table-column="tableColumn" @on-event="handleClick" />

      <!-- 地区过滤下拉框 -->
      <el-select v-model="ChannelNo" :placeholder="this.$t('basicSettings.SelectRegionFilter')" class="regionSelect" clearable filterable @change="handleFilter">
        <el-option v-for="(item,index) in formatterData.regionList" :key="index" :label="item.Value" :value="item.Key" />
      </el-select>
    </el-header>

    <el-container>
      <el-aside :style="{height: bodyHeight}">
        <!-- 左侧树形控件 -->
        <left-tree ref="tree" @on-event="handleTree" />
      </el-aside>

      <el-main :style="{height: bodyHeight}">
        <!-- 表格 -->
        <oppo-table ref="table" :table-column="tableColumn" :table-attr="tableAttr" :table-button="tableButton" :formatter-data="formatterData" @on-event="handleClick" @on-Selection="handleSelection" />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import LeftTree from './components/tree'
import { saveInfo, getBindCompany, getRegionList } from './API'
export default {
  name: 'DataPermission',
  components: {
    LeftTree
  },
  data() {
    return {
      // 表格顶部搜索区域
      searchConfig: {},
      selectNode: null,
      // 表格列
      tableColumn: [
        {
          prop: 'ChannelNo',
          label: this.$t('common.RegionName'),
          key: 'regionList' // 编码转名称，必带
        },
        {
          prop: 'Name',
          label: this.$t('common.CompanyName')
        }
      ],
      // 表格属性
      tableAttr: {
        border: true,
        stripe: true,
        fit: true,
        url: '/BaseData/QueryCompanyList',
        Conditions: [{ Value: 'B190531002', Key: 'TypeNo', Operator: 'Equal' }],
        rightSelection: true,
        isPage: false
      },
      // 表格按钮
      tableButton: {
        buttons: []
      },
      // 多选数据
      selectionData: null,
      ChannelNo: '',
      bindCompany: [],
      formatterData: {
        regionList: null
      }
    }
  },
  computed: {
    bodyHeight() {
      return document.body.clientHeight - 84 - 36 - 30 + 'px'
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      getRegionList({ Data: {}}).then(response => {
        if (response.data.MsgStatus === 1) {
          this.formatterData.regionList = response.data.Data
        }
      })
    },
    // 按钮点击事件
    handleClick(params) {
      switch (params.btnCode) {
        case 'BtnSave':
          this.handleSave()
          break
      }
    },
    // 接收多选数据
    handleSelection(datas) {
      let newSelectionArr = null
      let otherSelectionArr = null
      newSelectionArr = datas.reduce((prev, cur) => {
        prev.push({ CompanyNo: cur.CompanyNo })
        return prev
      }, [])

      if (this.ChannelNo) {
        // 如果有地区筛选，选中数据则是'新的多选数据'加上'本来就绑定的数据'
        otherSelectionArr = this.bindCompany.reduce((prev, cur) => {
        // 如果地区编码不等于当前选中的地区，说明是操作不到的，则必定是本来就绑定的数据
          cur.ChannelNo !== this.ChannelNo ? prev.push({ CompanyNo: cur.CompanyNo }) : ''
          return prev
        }, [])
        this.selectionData = [...newSelectionArr, ...otherSelectionArr]
      } else {
        // 否则就是多选数据
        this.selectionData = newSelectionArr
      }
    },
    // 保存
    handleSave() {
      // 必须选择用户
      if (!this.selectNode || this.selectNode.typeNo !== 2) {
        this.$message.warning(this.$t('basicSettings.PleaseSelectUser'))
        return
      }
      saveInfo({ Data: { UserNo: this.selectNode.Code, detailList: this.selectionData }}).then(response => {
        if (response.data.MsgStatus === 1) {
          this.$message.success(this.$t('common.SaveSuccess'))
        } else {
          this.$message.error(response.data.Msg)
        }
      })
    },
    // 地区过滤
    handleFilter(value) {
      if (!value) {
        this.$refs.table.tableData = this.$refs.table.allDatas
        this.getSelectedCompany()
        return
      }
      this.$refs.table.tableData = this.$refs.table.allDatas.filter(item => item.ChannelNo === value)

      // 把绑定成功的公司在列表选中
      this.bindCompany.forEach(item => {
        const obj = this.$refs.table.tableData.find(elem => elem.CompanyNo === item.CompanyNo)
        this.$nextTick(() => {
          obj ? this.$refs.table.$refs['table'].toggleRowSelection(obj) : ''
        })
      })
    },
    // 树形控件触发方法
    handleTree(node) {
      this.selectNode = node

      // 清空表格选中数据
      this.$refs.table.$refs['table'].clearSelection()

      this.getSelectedCompany()
    },
    // 获取当前用户已被分配的公司
    getSelectedCompany() {
      // 获取已经绑定的公司
      getBindCompany({ Data: { Conditions: [{ Key: 'UserNo', Value: this.selectNode.Code, Operator: 'Equal' }] }}).then(response => {
        if (response.data.MsgStatus === 1) {
          this.bindCompany = response.data.Data

          // 把绑定成功的公司在列表选中
          this.bindCompany.forEach(item => {
            // 如果查出来已绑定数据存在列表中，则把状态选中
            const obj = this.$refs.table.tableData.find(elem => elem && elem.CompanyNo === item.CompanyNo)
            obj ? this.$refs.table.$refs['table'].toggleRowSelection(obj) : ''
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .regionSelect{
    width: 150px;
    position: absolute;
    top: 0px;
    right: 0px;
  }
</style>
