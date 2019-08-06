<template>
  <el-dialog v-dialogDrag :title="dialogConfig.title" :visible.sync="dialogConfig.dialogVisible" :close-on-click-modal="false">
    <el-form ref="form" :model="formData" :rules="rules" label-position="right" label-width="100px" style="width: 400px; margin-left:50px;">
      <!-- 登录账号 -->
      <el-form-item :label="this.$t('basicSettings.UserName')" prop="LoginAccount">
        <el-input v-model.trim="formData.LoginAccount" :placeholder="this.$t('basicSettings.UserNameFormat')" :disabled="disabled" clearable />
      </el-form-item>
      <!-- 联系方式 -->
      <el-form-item :label="this.$t('basicSettings.Telephone')" prop="TelPhone">
        <el-input v-model.trim="formData.TelPhone" :placeholder="this.$t('basicSettings.TelephoneFormat')" clearable />
      </el-form-item>
      <!-- 真实姓名 -->
      <el-form-item :label="this.$t('basicSettings.RealName')" prop="UserName">
        <el-input v-model.trim="formData.UserName" :placeholder="this.$t('basicSettings.RealNameFormat')" clearable />
      </el-form-item>
      <!-- 地区 -->
      <el-form-item :label="this.$t('common.RegionName')" prop="ChannelNo">
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
import { addUser } from '../API'
import { validPhone } from '@/utils/validate'
import { debounce } from '@/utils/extend'
export default {
  props: {
    dialogConfig: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    const validatePhone = (rules, value, callback) => {
      if (!validPhone(value)) {
        callback(new Error(this.$t('basicSettings.TelephoneFormat')))
      } else {
        callback()
      }
    }
    return {
      disabled: false,
      formData: {
        UserNo: '',
        LoginAccount: '',
        TelPhone: '',
        UserName: '',
        ChannelNo: ''
      },
      // 表单校验
      rules: {
        LoginAccount: [
          { required: true, message: this.$t('basicSettings.UserNameFormat'), trigger: 'blur' }
        ],
        TelPhone: [
          { required: true, message: this.$t('basicSettings.TelephoneFormat'), trigger: 'blur', validator: validatePhone }
        ],
        UserName: [
          { required: true, message: this.$t('basicSettings.RealNameFormat'), trigger: 'blur' }
        ],
        ChannelNo: [
          { required: true, message: this.$t('basicSettings.PleaseSelectRegion'), trigger: 'change' }
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
    this.submitUpload = debounce(this.submitUpload, 1000, true)
  },
  methods: {
    // 保存
    handleSave() {
      this.$refs.form.validate(valid => {
        if (valid) {
          addUser({ Data: this.formData }).then(response => {
            if (response.data.MsgStatus === 1) {
              this.$message.success(this.$t('common.SaveSuccess'))

              // 关闭弹窗
              this.dialogConfig.dialogVisible = false
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
