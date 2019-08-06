<template>
  <analysis-model :model-config="modelConfig" />
</template>

<script>
import AnalysisModel from '@/components/AnalysisModel/index'
export default {
  name: 'DeptExpensesSheet',
  components: {
    AnalysisModel
  },
  data() {
    return {
      modelConfig: {
        aglid: 'DepCostSheet'
      }
    }
  }
}
</script>
