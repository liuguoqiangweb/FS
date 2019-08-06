<template>
  <el-dialog v-dialogDrag :title="dialogConfig.title" :visible.sync="dialogConfig.dialogVisible" :close-on-click-modal="false">
    <el-form ref="form" :model="formData" :rules="rules" label-position="right" label-width="100px" style="width: 400px; margin-left:50px;">
      <!-- 编码 -->
      <el-form-item :label="this.$t('common.SeriesCode')" prop="CategoryNo">
        <el-input v-model.trim="formData.CategoryNo" :placeholder="this.$t('common.AutoGenerate')" clearable :disabled="true" />
      </el-form-item>
      <!-- 公司名称 -->
      <el-form-item :label="this.$t('common.SeriesName')" prop="CategoryName">
        <el-input v-model.trim="formData.CategoryName" :placeholder="this.$t('common.PleaseInput')" clearable />
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
import { saveInfo } from '../API'
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
      formData: {
        IsAdd: 0,
        CategoryNo: '',
        CategoryName: ''
      },
      rules: {
        CategoryName: [
          { required: true, message: this.$t('common.NotNull'), trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    if (this.dialogConfig.type === 'update') {
      // 如果弹窗状态为'update'，则把行数据解构
      this.formData = { ...this.dialogConfig.row }
      this.formData.IsAdd = 1
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

              // 触发列表刷新
              this.$emit('on-event')
            } else {
              this.$message.error(response.data.Msg)
            }

            // 关闭弹窗
            this.dialogConfig.dialogVisible = false
          })
        }
      })
    }
  }
}
</script>
