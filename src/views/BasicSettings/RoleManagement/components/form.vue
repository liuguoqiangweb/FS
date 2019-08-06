<template>
  <div>
    <!-- 表单 -->
    <el-form ref="form" :model="formData" :rules="rules" label-width="100px" label-position="right" style="margin-top:40px">
      <el-row>
        <!-- 编码 -->
        <el-col :span="10" :offset="1">
          <el-form-item :label="this.$t('common.Code')" prop="RoleNo">
            <el-input v-model.trim="formData.RoleNo" :placeholder="this.$t('common.AutoGenerate')" :disabled="true" clearable />
          </el-form-item>
        </el-col>
        <!-- 角色名称 -->
        <el-col :span="10" :offset="1">
          <el-form-item :label="this.$t('basicSettings.RoleName')" prop="RoleName">
            <el-input v-model.trim="formData.RoleName" :placeholder="this.$t('common.PleaseInput')" :disabled="disabled" clearable />
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
  name: 'RoleManagement',
  data() {
    return {
      // 表单数据
      formData: {
        isAdd: null,
        RoleNo: '',
        RoleName: ''
      },
      // 表单校验
      rules: {
        RoleName: [{ required: true, message: this.$t('common.NotNull'), trigger: 'blur' }]
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
              this.$emit('on-event')
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
    margin: 20px 0px
  }
</style>
