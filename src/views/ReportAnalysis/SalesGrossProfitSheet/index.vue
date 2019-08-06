<template>
  <el-container>
    <el-header>
      <!-- 查询表单 -->
      <form-header ref="form" @on-event="handleClick" />
    </el-header>
    <el-main>
      <!-- Excel表格数据 -->
      <div id="FinanceExcel" ref="excel" v-loading="loading" />
    </el-main>
  </el-container>
</template>

<script>
import FormHeader from './components/form'
import { getExcelTable } from './API'
export default {
  name: 'SalesGrossProfitSheet',
  components: {
    FormHeader
  },
  data() {
    return {
      exportURL: this.$settings.url + 'DownloadFile/GrossProfitSales20190621170437_0266.xlsx',
      excelData: '',
      loading: false,
      spread: {},
      excelIo: {},
      exportUrl: ''
    }
  },
  mounted() {
    this.spread = new GC.Spread.Sheets.Workbook(document.getElementById('FinanceExcel'), { sheetCount: 1 })
    this.excelIo = new GC.Spread.Excel.IO()

    // 设置Excel表格高度
    const elHeader = document.querySelector('.el-container>.el-header')
    const headerHeight = parseInt(window.getComputedStyle(elHeader).height)
    const excelHeight = document.body.clientHeight - headerHeight - 130 + 'px'
    this.$refs.excel.style.height = excelHeight
  },
  methods: {
    // 按钮点击事件
    handleClick(parmas) {
      switch (parmas.btnCode) {
        case 'BtnSearch':// 查询
          this.handleSearch()
          break
        case 'BtnExport':// 导出
          this.handleExport()
          break
      }
    },
    // 查询
    handleSearch() {
      this.$refs.form.$refs['form'].validate(valid => {
        if (valid) {
          this.loading = true
          getExcelTable({ Data: this.$refs.form.formData }).then(resopnse => {
            if (resopnse.data.MsgStatus === 1) {
              this.excelData = resopnse.data.Data

              // 把返回的下拉地址拼装成完整地址，并把\转为/
              this.exportUrl = this.$settings.url + resopnse.data.Msg.replace(/\\/ig, '/')

              // 生成excel
              const myFile = createFile(this.excelData, '')
              this.excelIo.open(myFile, (json) => {
                var workbookObj = json
                this.spread.fromJSON(workbookObj)

                // 保护表格，不允许编辑
                const sheet = this.spread.getActiveSheet()
                sheet.options.isProtected = true
              }, (e) => {})

              // 取消loading
              this.loading = false
            }
          })
        }
      })
    },
    // 导出
    handleExport() {
      if (this.exportUrl) {
        var downloadElement = document.createElement('a')
        var href = this.exportUrl // 创建下载的链接
        downloadElement.href = href
        document.body.appendChild(downloadElement)
        downloadElement.click() // 点击下载
        document.body.removeChild(downloadElement) // 下载完成移除元素
        window.URL.revokeObjectURL(href) // 释放掉blob对象
      } else {
        this.$message.warning(this.$t('reportAnalysis.PleaseSearchExcel'))
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-header{
  height: 80px !important;
}
</style>
