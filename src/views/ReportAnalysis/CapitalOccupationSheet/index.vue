<template>
  <analysis-model :model-config="modelConfig" />
</template>

<script>
import AnalysisModel from '@/components/AnalysisModel/index'
export default {
  name: 'CapitalOccupationSheet',
  components: {
    AnalysisModel
  },
  data() {
    return {
      modelConfig: {
        aglid: 'FinancialAnalysisCapitalOccupancy'
      }
    }
  }
}
</script>
