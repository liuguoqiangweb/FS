<template>
  <el-dialog v-dialogDrag :title="dialogConfig.title" :visible.sync="dialogConfig.dialogVisible" :close-on-click-modal="false">
    <el-form ref="form" :model="formData" :rules="rules" label-position="right" label-width="100px" style="width: 400px; margin-left:50px;">
      <!-- 编码 -->
      <el-form-item :label="this.$t('common.Code')" prop="BtnNo">
        <el-input v-model.trim="formData.BtnNo" :placeholder="this.$t('common.PleaseInput')" clearable />
      </el-form-item>
      <!-- 名称 -->
      <el-form-item :label="this.$t('common.Name')" prop="BtnName">
        <el-input v-model.trim="formData.BtnName" :placeholder="this.$t('common.PleaseInput')" clearable />
      </el-form-item>
      <!-- 图标 -->
      <el-form-item :label="this.$t('basicSettings.ICON')" prop="BtnIcon">
        <el-select v-model="formData.BtnIcon" :placeholder="this.$t('common.PleaseSelect')" style="width: 100%" clearable filterable>
          <el-option v-for="(item,index) in elIcons" :key="index" :value="item">
            <i :class="item" />
            <span>{{ item }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 按钮类型 -->
      <el-form-item :label="this.$t('basicSettings.ButtonColor')" prop="BtnType">
        <el-select v-model="formData.BtnType" :placeholder="this.$t('common.PleaseSelect')" style="width: 100%" clearable filterable>
          <el-option v-for="(item,index) in buttonType" :key="index" :value="item">
            <el-button :type="item" />
            <span>{{ item }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 区域 -->
      <el-form-item :label="this.$t('common.Region')" prop="Region">
        <el-select v-model="formData.Region" :placeholder="this.$t('common.PleaseSelect')" style="width: 100%" clearable filterable>
          <el-option v-for="(item,index) in placeList" :key="index" :label="item.Value" :value="item.Key" />
        </el-select>
      </el-form-item>
      <!-- 排序 -->
      <el-form-item :label="this.$t('common.SortId')" prop="SortCode">
        <el-input-number v-model="formData.SortCode" :placeholder="this.$t('common.PleaseInput')" style="width:100%" />
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
import { saveBtn, dataDictionary } from '../API'
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
        MenuNo: this.dialogConfig.MenuNo,
        BtnNo: '',
        BtnName: '',
        BtnIcon: '',
        BtnType: '',
        Region: '',
        SortCode: 1,
        EnabledMark: true
      },
      rules: {
        BtnNo: [
          { required: true, message: this.$t('common.NotNull'), trigger: 'blur' }
        ],
        BtnName: [
          { required: true, message: this.$t('common.NotNull'), trigger: 'blur' }
        ],
        BtnIcon: [
          { required: true, message: this.$t('common.NotNull'), trigger: 'change' }
        ],
        BtnType: [
          { required: true, message: this.$t('common.NotNull'), trigger: 'change' }
        ],
        Region: [
          { required: true, message: this.$t('common.NotNull'), trigger: 'change' }
        ],
        SortCode: [
          { required: true, message: this.$t('common.NotNull'), trigger: 'blur' }
        ]
      },
      buttonRegion: [],
      // 图标集合
      elIcons: this.$store.state.common.elIcons,
      // 按钮类型集合
      buttonType: ['success', 'primary', 'info', 'warning', 'danger'],
      // 按钮区域集合
      placeList: []
    }
  },
  created() {
    this.init()
    if (this.dialogConfig.type === 'update') {
      // 如果弹窗状态为'update'，则把行数据解构
      this.formData = { ...this.dialogConfig.row }
    } else if (this.dialogConfig.type === 'add') {
      // 清空表单数据
      this.formData.BtnNo = ''
      this.formData.BtnName = ''
      this.formData.BtnIcon = ''
      this.formData.Region = ''
    }
  },
  mounted() {
    this.handleSave = debounce(this.handleSave, 1000, true)
  },
  methods: {
    init() {
      // 查询按钮区域集合
      dataDictionary({ Data: { ParentNo: 'B190611005' }}).then(response => {
        if (response.data.MsgStatus === 1) {
          this.placeList = response.data.Data
        }
      })
    },
    // 保存
    handleSave() {
      this.$refs.form.validate(valid => {
        if (valid) {
          saveBtn({ Data: this.formData }).then(response => {
            if (response.data.MsgStatus === 1) {
              this.$message.success(this.$t('common.SaveSuccess'))

              // 触发列表刷新
              this.$emit('on-save')
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

