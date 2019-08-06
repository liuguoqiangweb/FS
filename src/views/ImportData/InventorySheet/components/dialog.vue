<template>
  <el-dialog v-dialogDrag :title="dialogConfig.title" :visible.sync="dialogConfig.dialogVisible" :close-on-click-modal="false">
    <el-form ref="form" :model="formData" :rules="rules" label-position="right" label-width="100px" style="width: 400px; margin-left:50px;">
      <!-- 会计期间 -->
      <el-form-item :label="this.$t('common.AccountTime')" prop="YearMonth">
        <el-date-picker
          v-model="formData.YearMonth"
          type="month"
          :placeholder="this.$t('common.PleaseSelect')"
          style="width: 100%"
          value-format="yyyy-MM"
        />
      </el-form-item>
      <!-- 公司名称 -->
      <el-form-item :label="this.$t('common.CompanyName')" prop="CompanyCode">
        <el-select v-model="formData.CompanyCode" :placeholder="this.$t('common.PleaseSelect')" style="width: 100%" clearable filterable>
          <el-option v-for="(item,index) in dialogConfig.companyList" :key="index" :label="item.Value" :value="item.Key" />
        </el-select>
      </el-form-item>
      <!-- 导入组件 -->
      <el-form-item>
        <el-upload
          ref="upload"
          v-loading="loading"
          accept=".xls, .xlsx"
          drag
          :action="importUrl"
          :auto-upload="false"
          :file-list="fileList"
          :http-request="handleSubmitUpload"
          :on-change="handleChange"
          :limit="1"
          :show-file-list="true"
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text" v-html="this.$t('common.UploadText')" />
          <div slot="tip" class="el-upload__tip" v-html="this.$t('common.UploadTip')" />
        </el-upload>
      </el-form-item>
    </el-form>
    <!-- 底部按钮 -->
    <div slot="footer">
      <el-button @click="dialogConfig.dialogVisible = false">
        {{ this.$t('buttons.BtnCancel') }}
      </el-button>
      <el-button type="primary" @click="submitUpload">
        {{ this.$t('buttons.BtnSave') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { importInfo } from '../API'
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
      // 导入地址
      importUrl: this.$settings.url + 'api/ImpStock/ImportData',
      formData: {
        YearMonth: '',
        CompanyCode: ''
      },
      rules: {
        YearMonth: [
          { required: true, message: this.$t('common.NotNull'), trigger: 'change' }
        ],
        CompanyCode: [
          { required: true, message: this.$t('common.NotNull'), trigger: 'change' }
        ]
      },
      // 导入功能额外参数
      uploadDatas: {},
      // 导入文件列表
      fileList: [],
      loading: false
    }
  },
  mounted() {
    this.submitUpload = debounce(this.submitUpload, 1000, true)
  },
  methods: {
    // 保存上传
    submitUpload(file) {
      this.$refs.form.validate(valid => {
        if (valid) {
          // 如果导入文件列表为空，提示并停止提交
          if (this.fileList.length === 0) {
            this.$message.error(this.$t('common.SelectUploadFile'))
            return
          }
          // 提交
          this.$refs.upload.submit()
        }
      })
    },
    // 自定义导入提交方法
    handleSubmitUpload(file) {
      // 保存导入功能额外的参数
      this.$store.commit('SET_DEFAULT_PARAMS', { CompanyCode: this.formData.CompanyCode, YearMonth: this.formData.YearMonth })
      this.uploadDatas = this.$store.state.common.defaultParams

      // 获取POST请求参数对象，把额外参数放进去，必须必须是JSON格式(JSON.stringify)
      const data = new FormData()
      data.append('data', JSON.stringify(this.uploadDatas))
      data.append('Files', file.file)

      this.loading = true
      // 发送请求
      importInfo(this.importUrl, data).then(response => {
        if (response.data.MsgStatus === 1) {
          this.$message.success(this.$t('common.ImportSuccess'))

          // 关闭弹窗
          this.dialogConfig.dialogVisible = false

          // 刷新列表
          this.$emit('on-event')
        } else {
          this.$message.error(response.data.Msg)
        }
        this.loading = false
      })
    },
    handleChange(file, fileList) {
      this.fileList = fileList
    }
  }
}
</script>

