<template>
  <el-form ref="form" :model="formData" :rules="rules" label-width="100px" :inline-message="true">
    <el-row>
      <!-- 会计日期 -->
      <el-col :span="7">
        <el-form-item :label="yearAglid.includes(aglid)?$t('reportAnalysis.FiscalYear'):$t('reportAnalysis.AccountingDate')" prop="YearMonth">
          <el-date-picker v-model="formData.YearMonth" :type="yearAglid.includes(aglid)?'year':'month'" :value-format="yearAglid.includes(aglid)?'yyyy':'yyyy-MM-dd'" :placeholder="$t('common.PleaseSelect')" clearable />
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
      <!-- 按钮 -->
      <el-col :span="5">
        <el-button v-for="(item,index) in buttons" :key="index" :type="item.type" :icon="item.icon" @click="handleClick(item.btnCode)">{{ $t('buttons.'+item.btnName) }}</el-button>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { getRegionList, getCompanyList, dataDictionary } from '../API'
export default {
  props: {
    aglid: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 查询条件
      formData: {
        aglid: this.aglid,
        TbType: '',
        YearMonth: '',
        Areaid: '',
        comid: ''
      },
      rules: {
        TbType: [
          { required: true, message: this.$t('common.NotNull'), trigger: 'change' }
        ],
        YearMonth: [
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
      // 公司集合
      companyList: [],
      // 类别集合
      categoryList: [],
      buttons: [],
      allButtons: this.$store.state.common.buttons || JSON.parse(localStorage.getItem('FsAllButtons')),
      menuNo: JSON.parse(localStorage.getItem('FsMenuNo')),
      // 财年集合
      yearAglid: ['CoreCostIndicators', 'ProportionalAnalysis']
    }
  },
  created() {
    this.init()
  },
  mounted() {
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

