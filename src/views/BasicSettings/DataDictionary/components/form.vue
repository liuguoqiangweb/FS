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
        <!-- 上级名称 -->
        <el-col :span="10" :offset="1">
          <el-form-item :label="this.$t('common.ParentName')" prop="ParentName">
            <el-input v-model.trim="formData.ParentName" :placeholder="this.$t('common.AutoGet')" :disabled="true" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <!-- 编码 -->
        <el-col :span="10" :offset="1">
          <el-form-item :label="this.$t('common.Code')" prop="CodeNo">
            <el-input v-model.trim="formData.CodeNo" :placeholder="this.$t('common.AutoGenerate')" :disabled="true" clearable />
          </el-form-item>
        </el-col>
        <!-- 名称 -->
        <el-col :span="10" :offset="1">
          <el-form-item :label="this.$t('common.Name')" prop="Name">
            <el-input v-model.trim="formData.Name" :placeholder="this.$t('common.PleaseInput')" :disabled="disabled" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <!-- 排序 -->
        <el-col :span="10" :offset="1">
          <el-form-item :label="this.$t('common.SortId')" prop="SortCode">
            <el-input-number v-model="formData.SortCode" :placeholder="this.$t('common.PleaseInput')" :disabled="disabled" style="width:100%" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <!-- 描述 -->
        <el-col :span="21" :offset="1">
          <el-form-item :label="this.$t('common.Description')" prop="Description">
            <el-input v-model.trim="formData.Description" type="textarea" :disabled="disabled" style="width:100%" clearable />
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
import { saveInfo } from '../API'
import { debounce } from '@/utils/extend'
export default {
  data() {
    return {
      // 数据字典表单
      formData: {
        isAdd: null,
        ParentNo: '',
        ParentName: '',
        CodeNo: '',
        Name: '',
        SortCode: 0,
        Description: ''
      },
      rules: {
        Name: [{ required: true, message: this.$t('common.NotNull'), trigger: 'blur' }]
      },
      disabled: true
    }
  },
  mounted() {
    this.handleSave = debounce(this.handleSave, 1000, true)
  },
  methods: {
    // 保存
    handleSave() {
      this.$refs.form.validate(valid => {
        if (valid) {
          saveInfo({ Data: this.formData }).then(response => {
            if (response.data.MsgStatus === 1) {
              this.$message.success(this.$t('common.SaveSuccess'))

              this.disabled = true
              // 执行初始化树形控件数据方法
              this.$emit('on-form')
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
