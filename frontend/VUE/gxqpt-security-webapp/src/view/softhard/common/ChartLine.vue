<!-- 线图 -->
<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    lineOption: {
      type: Object,
      default: () => {
        return {}
      }
    },
    el: {
      type: String,
      required: true
    },
    title: {
      type: String,
      default: ''
    }
  },
  methods: {
    refresh () {
      const vm = this
      const option = {
        tooltip: {
          type: 'axis',
          formatter: '{b}<br>{c}'
        },
        grid: {
          left: '60px',
          right: '60px',
          bottom: '60px',
          containLabel: true
        },
        title: {
          text: vm.title
        },
        xAxis: {
          type: 'category'
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          type: 'line'
        }],
        ...vm.lineOption
      }
      const line = vm.$echarts.init(document.getElementById(vm.el))
      line.setOption(option)
    }
  }
}
</script>
