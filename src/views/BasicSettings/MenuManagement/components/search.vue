<template>
  <div>
    <!-- 搜索输入框 -->
    <el-input v-if="searchConfig.isSearch" v-model="searchValue" :placeholder="searchConfig.placeholder" maxlength="20" style="width:280px" clearable @keyup.enter.native="handleSearch" @change="handleChange">
      <el-button slot="append" icon="el-icon-search" @click="handleSearch">{{ this.$t('buttons.BtnSearch') }}</el-button>
    </el-input>
    <!-- 按钮 -->
    <el-button v-for="(item,index) in searchConfig.buttons" :key="index" :type="item.type" :icon="item.icon" @click="handleClick(item.btnCode)"> {{ $t('buttons.'+item.btnName) }} </el-button>
  </div>
</template>

<script>
export default {
  props: {
    searchConfig: {
      type: Object,
      default: () => {}
    },
    tableColumn: {
      type: Array,
      default: () => {}
    },
    formatterData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      searchValue: '',
      allButtons: this.$store.state.common.buttons || JSON.parse(localStorage.getItem('FsAllButtons')),
      region: this.searchConfig.region === undefined ? 'B190612001' : this.searchConfig.region,
      menuNo: JSON.parse(localStorage.getItem('FsMenuNo'))
    }
  },
  mounted() {
    // 获取当前菜单的按钮
    this.searchConfig.buttons = this.allButtons.reduce((prev, cur) => {
      cur && cur.menuNo === this.menuNo && cur.region === this.region ? prev.push({ btnCode: cur.btnCode, btnName: cur.btnCode, type: cur.type, icon: cur.icon }) : ''
      return prev
    }, [])
  },
  methods: {
    // 查询
    handleSearch() {
      const columns = this.searchConfig.searchColumn.split(',')
      const conditions = columns.reduce((prev, cur) => {
        // 首先判断是否为‘编码转名称列’
        const obj = this.tableColumn.find(item => item.prop === cur && item.key)
        // 如果是，则把搜索词转化成编码再存入参数
        if (obj) {
          const hasObj = this.formatterData[obj.key].find(elem => elem && elem.Value.toUpperCase().indexOf(this.searchValue.toUpperCase()) > -1)
          const value = hasObj ? hasObj.Key : this.searchValue
          prev.push({ Key: cur, Value: value === true ? 1 : (value === false ? 0 : value), Operator: 'like', Character: 'OR' })
        } else {
          prev.push({ Key: cur, Value: this.searchValue, Operator: 'like', Character: 'OR' })
        }
        return prev
      }, [])
      this.$emit('on-search', conditions)
    },
    // 搜索框改变事件
    handleChange(value) {
      if (!value) {
        this.$emit('on-search', [])
      }
    },
    // 按钮点击事件
    handleClick(btnCode) {
      this.$emit('on-event', {
        btnCode: btnCode
      })
    }
  }
}
</script>
