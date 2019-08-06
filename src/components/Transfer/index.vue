<template>
  <el-dialog v-dialogDrag :title="dialogConfig.title" :visible.sync="dialogConfig.dialogVisible" :close-on-click-modal="false">
    <!-- 穿梭框 -->
    <el-transfer
      v-model="selectDatas"
      :props="currentData.props"
      filterable
      :filter-method="filterMethod"
      :filter-placeholder="this.$t('common.InputFilterKeyword')"
      :data="allDatas"
      :titles="[this.$t('common.SelectLeftData'), this.$t('common.SelectRightData')]"
      :button-texts="['到左边', '到右边']"
      @change="handleChange"
    />
    <!-- 底部按钮 -->
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
import { getAllData } from './API'
export default {
  props: {
    dialogConfig: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      allDatas: [], // 所有数据
      selectDatas: [], // 已选数据
      addDatas: [], // 要新增的数据
      delDatas: [], // 要删除的数据
      selectedList: [], // 传过来的已选数据
      currentData: {}, // 当前对象
      leftData: [],
      filterMethod(query, item) {
        return item.Value.indexOf(query.trim()) > -1
      },
      categoryList: [
        // 选择用户
        {
          type: 'user',
          url: 'User/QueryComboData',
          params: { Conditions: [] },
          props: { label: 'Value', key: 'Key' }
        }
      ]
    }
  },
  created() {
    // 首先判断传过来的参数类型
    this.currentData = this.categoryList.find(item => {
      return item.type === this.dialogConfig.type
    })
    // 接收传过来的已选数据
    this.selectedList = this.dialogConfig.selectedList === undefined ? [] : this.dialogConfig.selectedList.concat()

    this.selectedList.forEach(item => {
      this.selectDatas.push(item[this.currentData.props.key])
    })
    this.init()
  },
  methods: {
    // 获取所有数据
    init() {
      getAllData(this.currentData.url, { Data: this.currentData.params }).then(response => {
        // 获取所有数据
        this.allDatas = response.data.Data
      })
    },
    // 穿梭框改变事件
    handleChange(value, direction, movedKeys) {
      movedKeys.forEach(key => {
        if (direction === 'right') {
          const delData = this.delDatas.find(item => {
            return item[this.currentData.props.key] === key
          })
          if (delData) {
            this.removeObj(this.delDatas, delData)
          }

          const addData = this.addDatas.find(item => {
            return item[this.currentData.props.key] === key
          })
          if (!addData) {
            const userInfo = this.allDatas.find(item => {
              return item[this.currentData.props.key] === key
            })
            const inputData = this.selectedList.find(item => {
              return item[this.currentData.props.key] === key
            })
            if (userInfo && !inputData) {
              this.addDatas.push(userInfo)
            }
          }
        } else if (direction === 'left') {
          const addData = this.addDatas.find(item => {
            return item[this.currentData.props.key] === key
          })
          if (addData) {
            this.removeObj(this.addDatas, addData)
          }

          const delData = this.delDatas.find(item => {
            return item[this.currentData.props.key] === key
          })
          const inputData = this.selectedList.find(item => {
            return item[this.currentData.props.key] === key
          })
          if (!delData && inputData) {
            const userInfo = this.allDatas.find(item => {
              return item[this.currentData.props.key] === key
            })
            if (userInfo) {
              this.delDatas.push(userInfo)
            }
          }
        }
      })
    },
    // 保存
    handleSave() {
      this.$emit('on-save', {
        addDatas: this.addDatas,
        delDatas: this.delDatas
      })
    }
  }
}
</script>
