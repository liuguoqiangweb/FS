<template>
  <analysis-model :model-config="modelConfig" />
</template>

<script>
import AnalysisModel from '@/components/AnalysisModel/index'
export default {
  name: 'ProfitAnalysisSheet',
  components: {
    AnalysisModel
  },
  data() {
    return {
      modelConfig: {
        aglid: 'FinancialProfitAnalysis'
      }
    }
  }
}
</script>
