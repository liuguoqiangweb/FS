<template>
  <div>
    <!-- 树形控件过滤输入框 -->
    <el-input
      v-model="filterText"
      :placeholder="this.$t('common.InputFilterKeyword')"
      style="width:92%; margin: 10px auto; display: block"
      clearable
    />
    <!-- 树形控件 -->
    <el-tree
      ref="tree"
      node-key="RoleNo"
      :data="treeData"
      :props="defaultProps"
      :default-expanded-keys="['Root']"
      :highlight-current="true"
      default-expand-all
      :filter-node-method="filterNode"
      @node-click="handleNodeClick"
    />
  </div>
</template>

<script>
import { getTree } from '../API'
export default {
  data() {
    return {
      treeData: [],
      filterText: '', // 树形控件过滤值
      defaultProps: {
        children: 'Children',
        label: 'RoleName'
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.initTree()
  },
  methods: {
    // 初始化树形控件数据
    initTree() {
      getTree({ Data: {}}).then(response => {
        if (response.data.MsgStatus === 1) {
          this.treeData = response.data.Data
        }
      })
    },
    // 树形控件过滤方法
    filterNode(value, data) {
      if (!value) return true
      return data.RoleName.indexOf(value) !== -1
    },
    // 树形控件点击事件
    handleNodeClick(node, data) {
      this.$emit('on-event', { selectNode: node, selectData: data })
    }
  }
}
</script>
