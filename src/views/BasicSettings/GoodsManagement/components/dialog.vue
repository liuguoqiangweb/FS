<template>
  <el-dialog v-dialogDrag :title="dialogConfig.title" :visible.sync="dialogConfig.dialogVisible" :close-on-click-modal="false">
    <el-form ref="form" :model="formData" :rules="rules" label-position="right" label-width="100px" style="width: 400px; margin-left:50px;">
      <!-- 财务代码 -->
      <el-form-item :label="this.$t('common.FinancialCode')" prop="ProductNo">
        <el-input v-model.trim="formData.ProductNo" :placeholder="this.$t('common.PleaseInput')" :disabled="disabled" clearable />
      </el-form-item>
      <!-- 商品系列 -->
      <el-form-item :label="this.$t('basicSettings.GoodsCategory')" prop="CategoryNo">
        <el-select v-model="formData.CategoryNo" :placeholder="this.$t('common.PleaseSelect')" style="width: 100%" clearable filterable>
          <el-option v-for="(item,index) in categoryList" :key="index" :label="item.Value" :value="item.Key" />
        </el-select>
      </el-form-item>
      <!-- 商品名称 -->
      <el-form-item :label="this.$t('common.GoodsName')" prop="ProductName">
        <el-input v-model.trim="formData.ProductName" :placeholder="this.$t('common.PleaseInput')" clearable />
      </el-form-item>
      <!-- 滞销时间 -->
      <el-form-item :label="this.$t('basicSettings.SlowSalesTime')" prop="UnsoldDate">
        <el-date-picker
          v-model="formData.UnsoldDate"
          type="date"
          :placeholder="this.$t('common.SelectDate')"
          value-format="yyyy-MM-dd"
          style="width: 100%"
          :picker-options="pickerOptions"
        />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="dialogConfig.dialogVisible = false">
        {{ this.$t('buttons.BtnCancel') }}
      </el-button>
      <el-button type="primary" @click="handleSave">
        {{ this.$t('buttons.BtnSave') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { saveInfo, getCategoryList } from '../API'
import { debounce } from '@/utils/extend'
export default {
  props: {
    dialogConfig: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      disabled: false,
      formData: {
        ProductNo: '',
        ProductName: '',
        CategoryNo: '',
        UnsoldDate: ''
      },
      rules: {
        ProductNo: [
          { required: true, message: this.$t('common.NotNull'), trigger: 'blur' }
        ],
        ProductName: [
          { required: true, message: this.$t('common.NotNull'), trigger: 'change' }
        ],
        CategoryNo: [
          { required: true, message: this.$t('common.NotNull'), trigger: 'blur' }
        ]
      },
      categoryList: null,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        }
      }
    }
  },
  created() {
    this.init()
    if (this.dialogConfig.type === 'update') {
      // 如果弹窗状态为'update'，则把行数据解构
      this.formData = { ...this.dialogConfig.row }
      this.disabled = true
    }
  },
  mounted() {
    this.handleSave = debounce(this.handleSave, 1000, true)
  },
  methods: {
    init() {
      getCategoryList({ Data: {}}).then(response => {
        if (response.data.MsgStatus === 1) {
          this.categoryList = response.data.Data
        }
      })
    },
    // 保存
    handleSave() {
      this.$refs.form.validate(valid => {
        if (valid) {
          saveInfo({ Data: this.formData }).then(response => {
            if (response.data.MsgStatus === 1) {
              this.$message.success(this.$t('common.SaveSuccess'))
              // 关闭弹窗
              this.dialogConfig.dialogVisible = false
              // 触发列表刷新
              this.$emit('on-event')
            } else {
              this.$message.error(response.data.Msg)
            }
          })
        }
      })
    }
  }
}
</script>

