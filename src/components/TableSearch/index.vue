<template>
  <!-- 搜索输入框 -->
  <el-form :model="formData" label-width="80px" label-position="right">
    <el-row>
      <el-col v-if="searchConfig.Name" :span="4">
        <!-- 名称筛选 -->
        <el-form-item :label="$t('SearchName.'+$route.name)">
          <el-input v-model.trim="formData.Name" maxlength="20" :placeholder="$t('common.PleaseInput')" clearable style="width:80%" />
        </el-form-item>
      </el-col>
      <el-col v-if="searchConfig.Telphone" :span="5">
        <!-- 联系方式筛选 -->
        <el-form-item :label="$t('basicSettings.Telephone')">
          <el-input v-model.trim="formData.Telphone" maxlength="20" :placeholder="$t('common.PleaseInput')" clearable style="width:80%" />
        </el-form-item>
      </el-col>
      <el-col v-if="searchConfig.ChannelNo" :span="5">
        <!-- 地区下拉筛选 -->
        <el-form-item :label="$t('common.BelongArea')">
          <el-select v-model="formData.ChannelNo" clearable filterable style="width:80%">
            <el-option v-for="(item,index) in formatterData.regionList" :key="index" :label="item.Value" :value="item.Key" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col v-if="searchConfig.CompanyNo" :span="5">
        <!-- 公司下拉筛选 -->
        <el-form-item :label="$t('common.BelongCompany')">
          <el-select v-model="formData.CompanyNo" clearable filterable style="width:80%">
            <el-option v-for="(item,index) in formatterData.companyList" :key="index" :label="item.Value" :value="item.Key" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col v-if="searchConfig.SeriesNo" :span="5">
        <!-- 系列下拉筛选 -->
        <el-form-item :label="$t('basicSettings.GoodsCategory')">
          <el-select v-model="formData.SeriesNo" clearable filterable style="width:80%">
            <el-option v-for="(item,index) in formatterData.seriesList" :key="index" :label="item.Value" :value="item.Key" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col v-if="searchConfig.Status" :span="5">
        <!-- 状态下拉筛选 -->
        <el-form-item :label="$t('common.Status')">
          <el-select v-model="formData.Status" clearable filterable style="width:80%">
            <el-option v-for="(item,index) in formatterData.statusList" :key="index" :label="item.Value" :value="item.Key" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col v-if="searchConfig.Category" :span="5">
        <!-- 类别下拉筛选 -->
        <el-form-item :label="$t('common.Category')">
          <el-select v-model="formData.Category" clearable filterable style="width:80%">
            <el-option v-for="(item,index) in formatterData.categoryList" :key="index" :label="item.Value" :value="item.Key" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="Object.keys(searchConfig).length===0?10:5">
        <!-- 按钮 -->
        <el-button v-for="(item,index) in buttons" :key="index" :type="item.type" :icon="item.icon" @click="handleClick(item.btnCode)"> {{ $t('buttons.'+item.btnName) }} </el-button>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { debounce } from '@/utils/extend'
export default {
  props: {
    searchConfig: {
      type: Object,
      default: () => {}
    },
    tableColumn: {
      type: Array,
      default: () => {}
    },
    formatterData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      formData: {
        Code: '',
        Name: '',
        Telphone: '',
        ChannelNo: '',
        CompanyNo: '',
        SeriesNo: '',
        Status: '',
        Category: ''
      },
      searchValue: '',
      allButtons: this.$store.state.common.buttons || JSON.parse(localStorage.getItem('FsAllButtons')),
      region: 'B190612001',
      menuNo: JSON.parse(localStorage.getItem('FsMenuNo')),
      buttons: null
    }
  },
  mounted() {
    // 获取当前菜单的按钮
    this.buttons = this.allButtons.reduce((prev, cur) => {
      cur && cur.menuNo === this.menuNo && cur.region === this.region ? prev.push({ btnCode: cur.btnCode, btnName: cur.btnCode, type: cur.type, icon: cur.icon }) : ''
      return prev
    }, [])

    this.handleSearch = debounce(this.handleSearch, 500, true)
  },
  methods: {
    debounce,
    // 查询
    handleSearch() {
      // 获取搜索对象的key
      const keys = Object.keys(this.formData)
      // 如果对应的key有值，则放入参数
      const conditions = keys.reduce((prev, cur) => {
        if (cur === 'Name') {
          // 如果key是'Name'，则把搜索值赋值给Name和Code字段，并且设置查询关系为OR：Character: 'OR'
          this.formData[cur] ? prev.push({ Key: this.searchConfig[cur], Value: this.formData[cur], Operator: 'like', Character: 'OR' }, { Key: this.searchConfig['Code'], Value: this.formData[cur], Operator: 'like', Character: 'OR' }) : ''
        } else {
          this.formData[cur] ? prev.push({ Key: this.searchConfig[cur], Value: this.formData[cur], Operator: 'Equal' }) : ''
        }
        return prev
      }, [])

      const allConditions = [...conditions, ...this.searchConfig.Conditions]
      console.log('allConditions', allConditions)
      this.$emit('on-search', allConditions)
    },
    // 按钮点击事件
    handleClick(btnCode) {
      if (btnCode === 'BtnSearch') {
        this.handleSearch()
        return
      }
      this.$emit('on-event', {
        btnCode: btnCode
      })
    }
  }
}
</script>
