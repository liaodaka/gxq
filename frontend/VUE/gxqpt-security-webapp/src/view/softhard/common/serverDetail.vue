<template>
	<Card :bordered="false">
		<p slot="title">服务器详情</p>
		<Button type="primary" style="margin:0 2rem" slot="extra" @click="goTo">
			监控详情
		</Button>
		<a href="#" slot="extra" @click="goback">
			<Icon type="chevron-left"></Icon>
			返回
		</a>
		<div style="text-align:center">
			<h3>基本信息</h3>
			<table class="tab">
				<tr>
					<th width="100">服务器ID</th>
					<td>{{evalData.serverId}}</td>
					<th width="100">服务器IP</th>
					<td>{{evalData.ip}}</td>
				</tr>
				<tr>
					<th>CPU核数</th>
					<td>{{evalData.cpuCount|cpuCountText}}</td>
					<th>内存大小</th>
					<td>{{evalData.memorySize|memorySizeText}}</td>
				</tr>
				<tr>
					<th>操作系统</th>
					<td>{{evalData.system}}</td>
					<th>所属网络</th>
					<td>{{evalData.netScope}}</td>
				</tr>
				<tr>
					<th>网络带宽</th>
					<td colspan="3">{{evalData.netWide|netWideText}}</td>
				</tr>
			</table>
			<h3>磁盘列表</h3>
			<Table :columns="columns" :data="evalData.dtos" :border='true' class="access-list"></Table>
		</div>
	</Card>
</template>

<script>
	export default {
		props: ['evalData'],
		data() {
			return {
				columns: [{
						title: '磁盘ID',
						key: 'diskId'
					},
					{
						title: '磁盘名称',
						key: 'diskName'
					},
					{
						title: '磁盘容量GB',
						key: 'diskSize'
					},
					{
						title: '挂载点',
						key: 'diskPath'
					},
					{
						title: '磁盘属性',
						key: 'diskType'
					},
					{
						title: '创建时间',
						key: 'createTime'
					}
				],
			}
		},
		filters:{
			cpuCountText:function(val){
				return val+"核";
			},
			memorySizeText:function(val){
				return val+"GB";
			},
			netWideText:function(val){
				return val+"M";
			},
		},
		methods: {
			goback() {
				this.$router.go(-1);
			},
			goTo(){
				this.$router.push({//跳转监控详情
					name: 'monitoringDetails',
					params: {id: this.evalData.id, serverId: this.evalData.serverId}
				})
			},
		},
	}
</script>

<style lang="less" type="text/css" scoped>
	h3{
		text-align: left;
		color: #333;
		line-height: 40px;
		font-size: 14px;
	}
	.tab {
		width: 100%;
		table-layout: fixed;
		border-collapse: collapse;
		border-spacing: 0;
		th {
			background: #f5f5f5;
			padding: 9px;
			border: 1px solid #ddd;
			font-weight: normal;
		}
		td {
			padding: 9px;
			border: 1px solid #ddd;
			text-align: left;
		}
	}
</style>
