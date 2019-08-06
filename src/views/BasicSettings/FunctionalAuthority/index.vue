<template>
  <el-container>
    <!-- 顶部按钮 -->
    <el-header>
      <table-search :search-config="searchConfig" @on-event="handleClick" />
    </el-header>

    <el-main>
      <el-form ref="form" label-width="100px">
        <el-row>
          <!-- 选择角色 -->
          <el-col :span="10">
            <el-form-item :label="this.$t('basicSettings.SelectRole')">
              <el-select v-model="roleNo" :placeholder="this.$t('common.PleaseSelect')" style="width: 100%" clearable filterable @change="handleRoleChange">
                <el-option v-for="(item,index) in rolesList" :key="index" :label="item.Value" :value="item.Key" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <!-- 权限设置 -->
          <el-col :span="10">
            <el-form-item :label="this.$t('basicSettings.PermissionSettings')">
              <!-- 菜单树形控件 -->
              <el-tree
                ref="tree"
                node-key="MenuNo"
                :data="menuTreeList"
                :props="defaultProps"
                :default-expanded-keys="['Root']"
                :highlight-current="true"
                accordion
                style="border: 1px solid #ddd; border-radius:4px"
                :style="{height: bodyHeight}"
                show-checkbox
                :default-checked-keys="defaultMenuChecked"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-main>
  </el-container>
</template>

<script>
import { getRoles, getMenuTree, saveInfo, getRoleCheckedNodes } from './API'
export default {
  name: 'FunctionalAuthority',
  data() {
    return {
      // 表格顶部搜索区域
      searchConfig: {},
      roleNo: '',
      defaultProps: {
        children: 'Children',
        label: 'MenuName'
      },
      rolesList: [],
      menuTreeList: [],
      defaultMenuChecked: []
    }
  },
  computed: {
    bodyHeight() {
      return document.body.clientHeight - 84 - 120 + 'px'
    }
  },
  created() {
    this.init()
  },
  methods: {
    // 按钮点击事件
    handleClick(params) {
      switch (params.btnCode) {
        case 'BtnSave':
          this.handleSave()
          break
      }
    },
    // 获取角色数据
    init() {
      getRoles({ Data: {}}).then(response => {
        if (response.data.MsgStatus === 1) {
          this.rolesList = response.data.Data.reduce((prev, cur) => {
            prev.push({ Key: cur.RoleNo, Value: cur.RoleName })
            return prev
          }, [])
        }
      })

      getMenuTree({ Data: {}}).then(response => {
        if (response.data.MsgStatus === 1) {
          this.menuTreeList = response.data.Data
          this.menuTreeList[0].disabled = true
        }
      })
    },
    // 角色改变事件，获取该角色已授权的菜单和按钮
    handleRoleChange(value) {
      if (!value) {
        this.$refs.tree.setCheckedKeys([])
        return
      }
      // 先清空已选中的节点
      this.$refs.tree.setCheckedKeys(['M190612001'])
      getRoleCheckedNodes({ Data: { RoleNo: value }}).then(response => {
        if (response.data.MsgStatus === 1) {
          this.defaultMenuChecked = response.data.Data
        }
      })
    },
    // 保存
    handleSave() {
      // 必须选择用户
      if (!this.roleNo) {
        this.$message.warning(this.$t('basicSettings.PleaseSelectRole'))
        return
      }
      // 返回目前被选中的节点所组成的数组，ElementUI树形控件特有方法
      const checkedNodes = this.$refs.tree.getCheckedNodes()
      // 返回目前半选中的节点所组成的数组，ElementUI树形控件特有方法
      const halfCheckedNodes = this.$refs.tree.getHalfCheckedNodes()

      // 定义集合，存储类型（菜单/按钮）、父节点编码、菜单编码
      const checkedMenuData = []
      checkedNodes.forEach(item => checkedMenuData.push({ PrivilegeAccess: item.TYPE, PrivilegeAccessParentValue: item.ParentNo, PrivilegeAccessValue: item.MenuNo }))
      halfCheckedNodes.forEach(item => checkedMenuData.push({ PrivilegeAccess: item.TYPE, PrivilegeAccessParentValue: item.ParentNo, PrivilegeAccessValue: item.MenuNo }))

      saveInfo({ Data: { RoleNo: this.roleNo, TSysRolePrivilegeModel: checkedMenuData }}).then(response => {
        if (response.data.MsgStatus === 1) {
          this.$message.success(this.$t('common.SaveSuccess'))
        } else {
          this.$message.error(response.data.Msg)
        }
      })
    }
  }
}
</script>
