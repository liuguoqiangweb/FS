<template>
  <el-dialog v-dialogDrag :title="dialogConfig.title" :visible.sync="dialogConfig.dialogVisible" append-to-body :close-on-click-modal="false" :show-close="!userForm.FirstLogin">
    <div v-if="userForm.FirstLogin" class="firstLogin">
      <i class="el-icon-info" />
      <span>{{ $t('basicSettings.FirstLoginTip') }}</span>
    </div>
    <el-form ref="form" :model="userForm" :rules="rules" label-position="right" label-width="120px" style="width: 60%; margin-left:50px;">
      <!-- 登录账号 -->
      <el-form-item :label="this.$t('basicSettings.UserName')" prop="LoginAccount">
        <el-input v-model.trim="userForm.LoginAccount" :placeholder="this.$t('basicSettings.UserNameFormat')" :disabled="true" clearable />
      </el-form-item>
      <!-- 旧密码 -->
      <el-form-item :label="this.$t('basicSettings.OldPassword')" prop="OldPass">
        <el-input v-model.trim="userForm.OldPass" :placeholder="this.$t('basicSettings.InputOldPassword')" clearable />
      </el-form-item>
      <!-- 新密码 -->
      <el-form-item :label="this.$t('basicSettings.NewPassword')" prop="NewPass">
        <el-input v-model.trim="userForm.NewPass" :placeholder="this.$t('basicSettings.InputNewPasswordReg')" clearable />
      </el-form-item>
      <!-- 确认新密码 -->
      <el-form-item :label="this.$t('basicSettings.NewPassword2')" prop="NewPass2">
        <el-input v-model.trim="userForm.NewPass2" :placeholder="this.$t('basicSettings.InputPasswordAgain')" clearable />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button v-if="!userForm.FirstLogin" @click="dialogConfig.dialogVisible = false">
        {{ this.$t('buttons.BtnCancel') }}
      </el-button>
      <el-button type="primary" @click="handleSave">
        {{ this.$t('buttons.BtnSave') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getUserInfo } from '@/utils/auth'
import { validPassword } from '@/utils/validate'
import { modifyPassword } from './API'
export default {
  props: {
    dialogConfig: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error(this.$t('basicSettings.InputNewPassword')))
      } else if (!validPassword(value)) {
        callback(new Error(this.$t('basicSettings.InputNewPasswordReg')))
      } else {
        callback()
      }
    }
    const validatePasswordAgain = (rule, value, callback) => {
      if (!value) {
        callback(new Error(this.$t('basicSettings.InputPasswordAgain')))
      } else if (this.userForm.NewPass !== value) {
        callback(new Error(this.$t('basicSettings.PasswordAgainError')))
      } else {
        callback()
      }
    }
    return {
      userForm: {
        LoginAccount: JSON.parse(getUserInfo()).UserName,
        UserNo: JSON.parse(getUserInfo()).UserNo,
        OldPass: '',
        NewPass: '',
        NewPass2: '',
        FirstLogin: JSON.parse(getUserInfo()).FirstLogin
      },
      rules: {
        OldPass: [
          { required: true, message: this.$t('basicSettings.InputOldPassword'), trigger: 'blur' }
        ],
        NewPass: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ],
        NewPass2: [
          { required: true, trigger: 'blur', validator: validatePasswordAgain }
        ]
      }
    }
  },
  methods: {
    // 保存
    handleSave() {
      this.$refs.form.validate(valid => {
        if (valid) {
          modifyPassword({ Data: this.userForm }).then(response => {
            if (response.data.MsgStatus === 1) {
              this.$message.success(this.$t('common.ReUpdateSuccess'))

              // 关闭弹窗
              this.dialogConfig.dialogVisible = false

              // 修改完密码，需重新登录
              this.$emit('login-out')
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

<style lang="scss" scoped>
.firstLogin{
  line-height: 100px;
  padding: 0px 0px 20px 100px;
  color: #F56C6C
}
</style>
