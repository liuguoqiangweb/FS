<template>
  <!-- 查询条件 -->
  <el-form ref="form" :model="formData" :rules="rules" label-width="100px" :inline-message="true">
    <el-row>
      <!-- 会计日期 -->
      <el-col :span="7">
        <el-form-item :label="$t('reportAnalysis.AccountingDate')" prop="YearMonth">
          <el-date-picker v-model="formData.YearMonth" type="month" value-format="yyyy-MM-dd" :placeholder="$t('common.PleaseSelect')" clearable />
        </el-form-item>
      </el-col>
      <!-- 类别 -->
      <el-col :span="6">
        <el-form-item :label="$t('common.Category')" prop="TbType">
          <el-select v-model="formData.TbType" :placeholder="$t('common.PleaseSelect')" clearable filterable @change="handleChangeType">
            <el-option v-for="(item,index) in categoryList" :key="index" :label="item.Value" :value="item.Key" />
          </el-select>
        </el-form-item>
      </el-col>
      <!-- 地区 -->
      <el-col v-if="formData.TbType === 'B190603007'" :span="6">
        <el-form-item :label="$t('common.RegionName')" prop="Areaid">
          <el-select v-model="formData.Areaid" :placeholder="$t('common.PleaseSelect')" clearable filterable>
            <el-option v-for="(item,index) in regionList" :key="index" :label="item.Value" :value="item.Key" />
          </el-select>
        </el-form-item>
      </el-col>
      <!-- 公司 -->
      <el-col v-if="formData.TbType === 'B190603008'" :span="6">
        <el-form-item :label="this.$t('common.CompanyName')" prop="comid">
          <el-select v-model="formData.comid" :placeholder="this.$t('common.PleaseSelect')" clearable filterable>
            <el-option v-for="(item,index) in companyList" :key="index" :label="item.Value" :value="item.Key" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="5" />
    </el-row>
    <el-row>
      <!-- 商品系列 -->
      <el-col :span="7">
        <el-form-item :label="$t('basicSettings.GoodsCategory')" prop="CategoryNo">
          <el-select v-model="formData.CategoryNo" :placeholder="$t('common.PleaseSelect')" clearable filterable>
            <el-option v-for="(item,index) in seriesList" :key="index" :label="item.Value" :value="item.Key" />
          </el-select>
        </el-form-item>
      </el-col>
      <!-- 商品名称 -->
      <el-col :span="6">
        <el-form-item :label="$t('common.GoodsName')" prop="ProductNo">
          <el-select v-model="formData.ProductNo" :placeholder="$t('common.PleaseSelect')" clearable filterable>
            <el-option v-for="(item,index) in goodsList" :key="index" :label="item.Value" :value="item.Key" />
          </el-select>
        </el-form-item>
      </el-col>
      <!-- 状态 -->
      <el-col :span="6">
        <el-form-item :label="$t('common.Status')" prop="IsUnsalableMachine">
          <el-select v-model="formData.IsUnsalableMachine" :placeholder="$t('common.PleaseSelect')" clearable filterable>
            <el-option v-for="(item,index) in statusList" :key="index" :label="item.Value" :value="item.Key" />
          </el-select>
        </el-form-item>
      </el-col>
      <!-- 按钮 -->
      <el-col :span="5">
        <el-button v-for="(item,index) in buttons" :key="index" :type="item.type" :icon="item.icon" @click="handleClick(item.btnCode)">{{ $t('buttons.'+item.btnName) }}</el-button>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { getRegionList, getCompanyList, getSeriesList, getGoodsList, dataDictionary } from '../API'
export default {
  data() {
    return {
      // 查询条件
      formData: {
        aglid: 'StockAnalysis',
        YearMonth: '',
        TbType: '',
        Areaid: '',
        comid: '',
        CategoryNo: '',
        ProductNo: '',
        IsUnsalableMachine: -1
      },
      rules: {
        YearMonth: [
          { required: true, message: this.$t('common.NotNull'), trigger: 'change' }
        ],
        TbType: [
          { required: true, message: this.$t('common.NotNull'), trigger: 'change' }
        ],
        Areaid: [
          { required: true, message: this.$t('common.NotNull'), trigger: 'change' }
        ],
        comid: [
          { required: true, message: this.$t('common.NotNull'), trigger: 'change' }
        ]
      },
      // 地区集合
      regionList: [],
      // 类别集合
      categoryList: [],
      // 公司集合
      companyList: [],
      // 系列集合
      seriesList: [],
      // 商品集合
      goodsList: [],
      // 状态集合
      statusList: [{ Key: 0, Value: '滞销机' }, { Key: 1, Value: '正常' }, { Key: -1, Value: '全部' }],
      buttons: [],
      allButtons: this.$store.state.common.buttons || JSON.parse(localStorage.getItem('FsAllButtons')),
      menuNo: JSON.parse(localStorage.getItem('FsMenuNo'))
    }
  },
  mounted() {
    this.init()
    // 获取当前菜单的按钮
    this.buttons = this.allButtons.reduce((prev, cur) => {
      cur && cur.menuNo === this.menuNo && cur.region === 'B190612001' ? prev.push({ btnCode: cur.btnCode, btnName: cur.btnCode, type: cur.type, icon: cur.icon }) : ''
      return prev
    }, [])
  },
  methods: {
    // 按钮点击事件
    handleClick(btnCode) {
      this.$emit('on-event', {
        btnCode: btnCode
      })
    },
    // 获取类别、商品下拉数据
    init() {
      getRegionList({ Data: {}}).then(response => {
        if (response.data.MsgStatus === 1) {
          this.regionList = response.data.Data
        }
      })

      getCompanyList({ Data: {}}).then(response => {
        if (response.data.MsgStatus === 1) {
          this.companyList = response.data.Data
        }
      })

      getSeriesList({ Data: {}}).then(response => {
        if (response.data.MsgStatus === 1) {
          this.seriesList = response.data.Data
        }
      })

      getGoodsList({ Data: {}}).then(response => {
        if (response.data.MsgStatus === 1) {
          this.goodsList = response.data.Data
        }
      })

      dataDictionary({ Data: { ParentNo: 'B190603001' }}).then(response => {
        if (response.data.MsgStatus === 1) {
          this.categoryList = response.data.Data
        }
      })
    },
    // 类别修改事件
    handleChangeType(value) {
      if (value !== 'B190603007' || value !== 'B190603008') {
        this.formData.Areaid = ''
        this.formData.comid = ''
      }
    }
  }
}
</script>
