<template>
  <el-container>
    <!-- 顶部按钮 -->
    <el-header>
      <table-search :search-config="searchConfig" @on-event="handleClick" />
    </el-header>
    <el-container>
      <el-aside :style="{height: bodyHeight}">
        <!-- 左侧树形控件 -->
        <left-tree ref="tree" @on-event="handleEvent" />
      </el-aside>

      <el-main :style="{height: bodyHeight}" style="border: 1px solid #ddd">
        <!-- 右侧表单 -->
        <right-form ref="form" @on-form="handleForm" />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import LeftTree from './components/tree'
import RightForm from './components/form'
import { deleteInfo } from './API'
export default {
  name: 'DataDictionary',
  components: {
    LeftTree,
    RightForm
  },
  data() {
    return {
      // 表格顶部搜索区域
      searchConfig: {},
      selectNode: null, // 树形控件选中节点
      selectData: null // 树形控件选中数据
    }
  },
  computed: {
    bodyHeight() {
      return document.body.clientHeight - 84 - 36 - 30 + 'px'
    }
  },
  methods: {
    // 按钮点击事件
    handleClick(parmas) {
      switch (parmas.btnCode) {
        case 'BtnAdd':
          this.handleAddUpdate('add')
          break
        case 'BtnUpdate':
          this.handleAddUpdate('update')
          break
        case 'BtnDelete':
          this.handleDelete()
          break
        case 'BtnSave':
          this.handleSave()
          break
      }
    },
    // 新增、修改
    handleAddUpdate(status) {
      // 如果未选择节点，则提示并return结束方法
      if (!this.selectNode) {
        this.$message.warning(this.$t('common.PleaseSelectNode'))
        return
      }
      // 通过参数判断是新增还是修改，做相应的赋值
      if (status === 'add') {
        this.$refs.form.formData.isAdd = 0
        this.$refs.form.formData.ParentNo = this.selectNode.CodeNo
        this.$refs.form.formData.ParentName = this.selectNode.Name
        this.$refs.form.formData.CodeNo = ''
        this.$refs.form.formData.Name = ''
        this.$refs.form.formData.SortCode = 0
        this.$refs.form.formData.Description = ''
        this.$refs.form.disabled = false
      } else if (status === 'update') {
        // 如果选中的是根节点，不允许修改、删除
        if (this.selectNode.ParentNo === 'Root') {
          this.$message.warning(this.$t('common.IsRootNode'))
          return
        }
        this.$refs.form.formData = { ...this.selectNode }
        this.$refs.form.formData.isAdd = 1
        this.$refs.form.formData.ParentName = this.selectData.parent.data.Name
        this.$refs.form.disabled = false
      }
    },
    // 删除
    handleDelete() {
      // 如果未选择节点，则提示并return结束方法
      if (!this.selectNode) {
        this.$message.warning(this.$t('common.PleaseSelectNode'))
        return
      }
      // 如果选中的是根节点，不允许修改、删除
      if (this.selectNode.ParentNo === 'Root') {
        this.$message.warning(this.$t('common.IsRootNode'))
        return
      }
      // MessageBox弹框，询问是否进行删除操作
      // 用法详见：https://element.eleme.cn/2.7/#/zh-CN/component/message-box
      this.$confirm(this.$t('common.DeleteFormat').formatI18n(this.selectNode.Name), this.$t('common.Prompt'), {
        confirmButtonText: this.$t('buttons.BtnDefine'),
        cancelButtonText: this.$t('buttons.BtnCancel'),
        type: 'warning'
      }).then(() => {
        deleteInfo({ Data: { CodeNo: this.selectNode.CodeNo }}).then(response => {
          if (response.data.MsgStatus === 1) {
            this.$message.success(this.$t('common.DeleteSuccess'))
            // 执行初始化树形控件数据方法
            this.$refs.tree.initTree()
            this.$refs.tree.selectNode = null
            this.$refs.form.formData = {}
          } else {
            this.$message.success(response.data.Msg)
          }
        })
      }).catch(() => {
        this.$message.info(this.$t('common.CancelDeleted'))
      })
    },
    // 重置表单校验结果
    handleEvent(params) {
      this.selectNode = params.selectNode
      this.selectData = params.selectData
      this.$refs.form.disabled = true
      this.$refs.form.formData = { ...params.selectNode }
      this.$refs.form.formData.ParentName = params.selectData.parent.data.Name
      this.$refs.form.resetForm()
    },
    // 刷新树形控件
    handleForm() {
      this.selectNode = null
      this.$refs.tree.initTree()
    }
  }
}
</script>
