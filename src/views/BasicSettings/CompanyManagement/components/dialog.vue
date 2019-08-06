<template>
  <el-dialog v-dialogDrag :title="dialogConfig.title" :visible.sync="dialogConfig.dialogVisible" :close-on-click-modal="false" top="300px">
    <el-form ref="form" :model="formData" :rules="rules" label-position="right" label-width="100px" style="width: 400px; margin-left:50px; height:160px">
      <el-form-item :label="this.$t('common.Code')" prop="Code">
        <el-input v-model.trim="formData.Code" :placeholder="this.$t('common.AutoGenerate')" :disabled="true" clearable />
      </el-form-item>
      <el-form-item :label="this.$t('common.CompanyName')" prop="Name">
        <el-input v-model.trim="formData.Name" :placeholder="this.$t('common.PleaseInput')" clearable />
      </el-form-item>
      <el-form-item :label="this.$t('common.BelongArea')" prop="ChannelNo">
        <el-select v-model="formData.ChannelNo" :placeholder="this.$t('common.PleaseSelect')" style="width: 100%" clearable filterable>
          <el-option v-for="(item,index) in dialogConfig.regionList" :key="index" :label="item.Value" :value="item.Key" />
        </el-select>
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
      disabled: false,
      formData: {
        TypeNo: 'B190531002', // 此字段值在'数据字典-基础数据类型'获取
        Code: '',
        Name: '',
        ChannelNo: '',
        CompanyNo: ''
      },
      rules: {
        Name: [
          { required: true, message: this.$t('common.NotNull'), trigger: 'blur' }
        ],
        ChannelNo: [
          { required: true, message: this.$t('common.NotNull'), trigger: 'change' }
        ]
      }
    }
  },
  created() {
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
    // 保存
    handleSave() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.formData.CompanyNo = this.formData.Code
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
