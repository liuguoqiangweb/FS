<template>
  <div>
    <el-form ref="form" :model="formData" :rules="rules" label-width="100px" label-position="right" style="margin-top:80px">
      <el-row>
        <!-- 上级编码 -->
        <el-col :span="10" :offset="1">
          <el-form-item :label="this.$t('common.ParentCode')" prop="ParentNo">
            <el-input v-model.trim="formData.ParentNo" :placeholder="this.$t('common.AutoGet')" :disabled="true" clearable />
          </el-form-item>
        </el-col>
        <!-- 上级科目 -->
        <el-col :span="10" :offset="1">
          <el-form-item :label="this.$t('common.ParentSubject')" prop="ParentName">
            <el-input v-model.trim="formData.ParentName" :placeholder="this.$t('common.AutoGet')" :disabled="true" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <!-- 财务代码 -->
        <el-col :span="10" :offset="1">
          <el-form-item :label="this.$t('common.FinancialCode')" prop="AccountNo">
            <el-input v-model.trim="formData.AccountNo" :placeholder="this.$t('common.PleaseInput')" :disabled="visibled" clearable />
          </el-form-item>
        </el-col>
        <!-- 科目名称 -->
        <el-col :span="10" :offset="1">
          <el-form-item :label="this.$t('basicSettings.SubjectName')" prop="AccountName">
            <el-input v-model.trim="formData.AccountName" :placeholder="this.$t('common.PleaseInput')" :disabled="disabled" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <!-- 科目类别 -->
        <el-col :span="10" :offset="1">
          <el-form-item :label="this.$t('basicSettings.SubjectCategory')" prop="CategoryNo">
            <el-select v-model="formData.CategoryNo" :placeholder="this.$t('common.PleaseSelect')" style="width: 100%" clearable filterable :disabled="disabled">
              <el-option v-for="(item,index) in subjectList" :key="index" :label="item.Value" :value="item.Key" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <!-- 保存按钮 -->
        <el-col :span="11" :offset="11">
          <el-button type="success" icon="el-icon-success" :disabled="disabled" @click="handleSave">{{ this.$t('buttons.BtnSave') }}</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { saveInfo, dataDictionary } from '../API'
import { debounce } from '@/utils/extend'
export default {
  data() {
    return {
      // 财务科目表单
      formData: {
        IsAdd: null,
        ParentNo: '',
        ParentName: '',
        AccountNo: '',
        AccountName: '',
        CategoryNo: ''
      },
      rules: {
        AccountNo: [{ required: true, trigger: 'blur', message: this.$t('common.NotNull') }],
        AccountName: [{ required: true, message: this.$t('common.NotNull'), trigger: 'blur' }],
        CategoryNo: [{ required: true, message: this.$t('common.NotNull'), trigger: 'change' }],
        SortCode: [{ required: true, message: this.$t('common.NotNull'), trigger: 'blur' }]
      },
      disabled: true,
      visibled: true,
      subjectList: [],
      selectData: []
    }
  },
  created() {
    this.init()
  },
  mounted() {
    this.handleSave = debounce(this.handleSave, 1000, true)
  },
  methods: {
    init() {
      // 数据字典查科目类别
      dataDictionary({ Data: { ParentNo: 'B190601001' }}).then(response => {
        if (response.data.MsgStatus === 1) {
          this.subjectList = response.data.Data
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
              this.disabled = true

              // 执行初始化树形控件数据方法
              this.$emit('on-event')
            } else {
              this.$message.error(response.data.Msg)
            }
          })
        }
      })
    },
    // 重置表单校验结果
    resetForm() {
      this.$refs['form'].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-row{
    margin: 20px 0px !important
  }
</style>
