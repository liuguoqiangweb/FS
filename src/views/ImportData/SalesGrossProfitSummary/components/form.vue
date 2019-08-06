<template>
  <!-- 查询条件 -->
  <el-form ref="form" :model="formData" :label-width="this.$store.state.app.language === 'cn'?'80px':'100px'" :inline-message="true" label-position="right">
    <el-row>
      <!-- 会计日期 -->
      <el-col :span="8">
        <el-form-item :label="$t('reportAnalysis.AccountingDate')">
          <el-date-picker v-model="formData.Efftime" type="month" value-format="yyyy-MM" :placeholder="$t('common.PleaseSelect')" clearable />
        </el-form-item>
      </el-col>
      <!-- 地区 -->
      <el-col :span="8">
        <el-form-item :label="$t('common.RegionName')">
          <el-select v-model="formData.ChannelNo" :placeholder="$t('common.PleaseSelect')" clearable filterable @change="handleRegionChange">
            <el-option v-for="(item,index) in regionList" :key="index" :label="item.Value" :value="item.Key" />
          </el-select>
        </el-form-item>
      </el-col>
      <!-- 公司 -->
      <el-col :span="8">
        <el-form-item :label="this.$t('common.CompanyName')">
          <el-select v-model="formData.CompanyCode" :placeholder="this.$t('common.PleaseSelect')" clearable filterable>
            <el-option v-for="(item,index) in companyList" :key="index" :label="item.Value" :value="item.Key" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <!-- 商品名称 -->
      <el-col :span="8">
        <el-form-item :label="$t('common.GoodsName')">
          <el-input v-model.trim="formData.ProductName" :placeholder="this.$t('common.PleaseInput')" clearable />
        </el-form-item>
      </el-col>
      <!-- 按钮 -->
      <el-col :span="8" :offset="1">
        <el-button v-for="(item,index) in buttons" :key="index" :type="item.type" :icon="item.icon" @click="handleClick(item.btnCode)">{{ $t('buttons.'+item.btnName) }}</el-button>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { getRegionList, getCompanyList } from '../API'
export default {
  data() {
    return {
      // 查询条件
      formData: {
        Efftime: '',
        ChannelNo: '',
        CompanyCode: '',
        ProductName: ''
      },
      // 地区集合
      regionList: [],
      // 公司集合
      companyList: [],
      buttons: [],
      allButtons: this.$store.state.common.buttons || JSON.parse(localStorage.getItem('FsAllButtons')),
      menuNo: JSON.parse(localStorage.getItem('FsMenuNo')),
      allCompany: [] // 公司缓存集合，做筛选用
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
    init() {
      getRegionList({ Data: {}}).then(response => {
        if (response.data.MsgStatus === 1) {
          this.regionList = response.data.Data
        }
      })

      getCompanyList({ Data: { Conditions: [{ Value: 'B190531002', Key: 'TypeNo', Operator: 'Equal' }] }}).then(response => {
        if (response.data.MsgStatus === 1) {
          this.allCompany = this.companyList = response.data.Data.reduce((prev, cur) => {
            cur ? prev.push({ Key: cur.CompanyNo, Value: cur.Name, ChannelNo: cur.ChannelNo }) : ''
            return prev
          }, [])
        }
      })
    },
    // 按钮点击事件
    handleClick(btnCode) {
      this.$emit('on-button', {
        btnCode: btnCode,
        data: this.formData
      })
    },
    // 地区改变事件
    handleRegionChange(value) {
      this.formData.CompanyCode = ''
      if (!value) {
        this.companyList = this.allCompany
        return
      }
      this.companyList = this.allCompany.filter(item => item.ChannelNo === value)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-date-picker, .el-input, .el-select{
  width: 80%
}
</style>
