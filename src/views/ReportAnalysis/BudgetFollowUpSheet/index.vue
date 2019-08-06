<template>
  <analysis-model :model-config="modelConfig" />
</template>

<script>
import AnalysisModel from '@/components/AnalysisModel/index'
export default {
  name: 'BudgetFollowUpSheet',
  components: {
    AnalysisModel
  },
  data() {
    return {
      modelConfig: {
        aglid: 'BudgetFollowUp'
      }
    }
  }
}
</script>
