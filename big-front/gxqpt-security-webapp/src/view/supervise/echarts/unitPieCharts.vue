<!-- 预警类型 -->
<template>
	<div id="pieCharts"></div>
</template>

<script>
	export default {
		data () {
			return {
				echartData: [],
				lineBar: ''
			}
		},
		methods: {
			initLineBar() {
				// 基于准备好的dom，初始化echarts实例
				if (!this.lineBar) {
					this.lineBar = this.$echarts.init(document.getElementById('pieCharts'))
				}
				const option = {
					color: ['#55CFF4', '#FFD851', '#FFA358', '#FD7F7F'],
					title: {
						text: '预警类型',
						subtext: '',
						x: 'center',
						top: '20px'
					},
					tooltip: {
						trigger: 'item',
						formatter: "{a} <br/>{b} : {c} ({d}%)"
					},
					legend: {
						data: []
					},
					series: [{
						name: '',
						type: 'pie',
						radius: '55%',
						center: ['50%', '55%'],
						label:{
							position:'inside',
						},
						data: this.echartData,
						itemStyle: {
							emphasis: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
							}
						}
					}]
				};

				// 使用刚指定的配置项和数据显示图表。
				this.lineBar.setOption(option);
			},
			refresh (data) {
				this.echartData = data
				this.echartData = JSON.parse(JSON.stringify(this.echartData).replace(/type/g,"name"));
				this.echartData = JSON.parse(JSON.stringify(this.echartData).replace(/count/g,"value"));
				this.initLineBar()
			}
		}
	}
</script>

<style lang="less" scoped>
	#pieCharts {
		width: 100%;
		height: 100%;
	}
</style>