<template>
  <el-form ref="form" :model="formData" :rules="rules" label-width="100px" label-position="right" style="margin-top:20px">
    <el-row>
      <!-- 上级编码 -->
      <el-col :span="6" :offset="1">
        <el-form-item :label="this.$t('common.ParentCode')" prop="ParentNo">
          <el-input v-model.trim="formData.ParentNo" :placeholder="this.$t('common.AutoGet')" :disabled="true" clearable />
        </el-form-item>
      </el-col>
      <!-- 上级名称 -->
      <el-col :span="6" :offset="1">
        <el-form-item :label="this.$t('common.ParentName')" prop="ParentName">
          <el-input v-model.trim="formData.ParentName" :placeholder="this.$t('common.AutoGet')" :disabled="true" clearable />
        </el-form-item>
      </el-col>
      <!-- 编码 -->
      <el-col :span="6" :offset="1">
        <el-form-item :label="this.$t('common.Code')" prop="MenuNo">
          <el-input v-model.trim="formData.MenuNo" :placeholder="this.$t('common.AutoGenerate')" :disabled="true" clearable />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <!-- 中文名称 -->
      <el-col :span="6" :offset="1">
        <el-form-item :label="this.$t('basicSettings.ChineseName')" prop="MenuName">
          <el-input v-model.trim="formData.MenuName" :placeholder="this.$t('common.PleaseInput')" :disabled="disabled" clearable />
        </el-form-item>
      </el-col>
      <!-- URL -->
      <el-col :span="6" :offset="1">
        <el-form-item :label="this.$t('basicSettings.URL')" prop="MenuUrl">
          <el-input v-model.trim="formData.MenuUrl" :placeholder="this.$t('common.PleaseInput')" :disabled="disabled" clearable />
        </el-form-item>
      </el-col>
      <!-- 图标 -->
      <el-col :span="6" :offset="1">
        <el-form-item :label="this.$t('basicSettings.ICON')" prop="MenuIcon">
          <el-select v-model="formData.MenuIcon" :placeholder="this.$t('common.PleaseSelect')" style="width: 100%" clearable filterable :disabled="disabled">
            <el-option v-for="(item,index) in svgIcons" :key="index" :value="item">
              <svg-icon :icon-class="item" />
              <span>{{ item }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <!-- 排序 -->
      <el-col :span="6" :offset="1">
        <el-form-item :label="this.$t('common.SortId')" prop="SortCode">
          <el-input-number v-model="formData.SortCode" :placeholder="this.$t('common.PleaseInput')" :disabled="disabled" style="width:100%" />
        </el-form-item>
      </el-col>
      <!-- 是否显示 -->
      <el-col :span="6" :offset="1">
        <el-form-item :label="this.$t('basicSettings.IsHidden')" prop="EnabledMark">
          <el-switch v-model.trim="formData.EnabledMark" :disabled="disabled" />
        </el-form-item>
      </el-col>
      <!-- 标签栏固定 -->
      <el-col :span="6" :offset="1">
        <el-form-item :label="this.$t('basicSettings.FixedTagsView')" prop="FixedTagsView">
          <el-switch v-model.trim="formData.FixedTagsView" :disabled="disabled" />
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
</template>

<script>
import { saveInfo } from '../API'
export default {
  name: 'MenuManagement',
  data() {
    return {
      // 表单数据
      formData: {
        ParentNo: '',
        ParentName: '',
        MenuNo: '',
        MenuName: '',
        MenuUrl: '',
        MenuIcon: '',
        SortCode: '',
        EnabledMark: true,
        FixedTagsView: false
      },
      // 表单校验
      rules: {
        MenuName: [{ required: true, message: this.$t('common.NotNull'), trigger: 'blur' }],
        MenuUrl: [{ required: true, message: this.$t('common.NotNull'), trigger: 'blur' }]
      },
      disabled: true,
      svgIcons: this.$store.state.common.svgIcons
    }
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
