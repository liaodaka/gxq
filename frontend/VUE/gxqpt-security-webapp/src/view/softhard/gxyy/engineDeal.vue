<template>
	<div class="ivu-layout serviceDetail">
		<h2>服务器新增申请</h2>
		<unitApplyinfo class="marginTop" :applyManageData="applyManageData"></unitApplyinfo>
		<specificInfo class="marginTop" :applyResData="applyResData"></specificInfo>
		<Card :bordered="false" class="marginTop">
			<p slot="title">审批意见：</p>
			<div class="comment" style="text-align:center">
				<ul>
					<li v-for="recordsResItem in applyRecordsRes"><span>{{recordsResItem.createTime}} </span><span>{{recordsResItem.applyUname}}</span><span v-if="recordsResItem.passFlag=='1'">已同意。同意意见：</span><span v-if="recordsResItem.passFlag=='2'">不同意。不同意意见：</span><span>{{recordsResItem.apprOpinion}}</span></li>
				</ul>
			</div>
		</Card>
		<Modal v-model="pzState" title="无法配置处理" width="70%" :mask-closable="false">
			<Form ref="formData" :model="formData" :label-width="100">
				<FormItem label="处理结果：">
					<Input disabled="disabled" value="暂时无法配置"></Input>
				</FormItem>
				<FormItem label="处理意见：">
					<Input v-model="apprOpinion" type="textarea" :rows="5"></Input>
				</FormItem>
			</Form>
			<div slot="footer">
				<Button type="primary" @click="pzSubmit">确定</Button>
				<Button type="text" @click="pzClose">取消</Button>
			</div>
		</Modal>
		<div class="btngroup">
			<Button type="primary" @click="btnBack">返回</Button>
			<Button type="primary" @click="applyPass">同意</Button>
			<Button type="primary" @click="pzBtn">无法配置</Button>
		</div>
	</div>
</template>

<script>
	import unitApplyinfo from '@/view/softhard/common/unitApplyinfo'
	import specificInfo from '@/view/softhard/common/specificInfoView'
	import api from '@/api/axiosApi'
	import softhardApiList from '@/api/softhardApiList'
	export default {
		data() {
			return {
				pzState: false,
				formData: {},
				id: "",
				apprOpinion:"",//无法配置意见
				applyManageData: {
					"applyEmail": "",
					"applyNo": "",
					"applyOrgid": "",
					"applyOrgname": "",
					"applyReason": "",
					"applyServer": [{
						"applyCount": 0,
						"cpuCount": 0,
						"disks": [{
							"diskSize": 1,
							"order": 1
						}, {
							"diskSize": 2,
							"order": 2
						}],
						"gatewayDesc": "",
						"memorySize": 0,
						"netScope": "",
						"netWide": 0,
						"sysDisksize": 0,
						"system": ""
					}, {
						"applyCount": 0,
						"cpuCount": 0,
						"disks": [{
							"diskSize": 0,
							"order": 0
						}],
						"gatewayDesc": "",
						"memorySize": 0,
						"netScope": "",
						"netWide": 0,
						"sysDisksize": 0,
						"system": ""
					}],
					"applyUid": "",
					"applyUname": "",
					"attachment": [{
						"busType": "",
						"fileName": "1",
						"fileSize": 0,
						"fileType": "",
						"fileUrl": ""
					}, {
						"busType": "",
						"fileName": "2",
						"fileSize": 0,
						"fileType": "",
						"fileUrl": ""
					}],
					"id": 0,
					"scode": "",
					"sname": "",
					"stepCode": "",
					"stepName": ""
				},
				applyResData: {
					"applyKeyid": 0,
					"changeMachine": 0,
					"changeModel": "string",
					"cpuCount": 0,
					"cpuModel": "string",
					"diskModel": "string",
					"diskSize": 0,
					"id": 0,
					"lightCount": 0,
					"lightModel": "string",
					"memoryModel": "string",
					"memorySize": 0,
					"netcardCount": 0,
					"netcardModel": "string",
					"remark": "string",
					"videocardCount": 0,
					"videocardModel": "string"
				},
				applyRecordsRes: [{
					"applyKeyid": 0,
					"applyUid": "1",
					"applyUname": "1",
					"apprOpinion": "1",
					"id": 0,
					"passFlag": "1",
					"stepCode": "1",
					"stepName": "1"
				}],
			}
		},
		components: {
			unitApplyinfo,
			specificInfo
		},
		mounted() {
			this.id = this.$route.params.keyid;
			this.getApplyManageById(); // 根据id查询审批详情
			this.getApplyResByApplyId(); // 根据ApplyId查询申请新增所需资源
			this.getApplyRecordsByApplyId(); // 根据ApplyId查询审批记录
		},
		methods: {
			getApplyManageById() { // 根据id查询审批详情
				api(softhardApiList.getApplyManageById, {
					"id": this.id
				}).then((res) => {
					if(res.status == 200 && res.data.data) {
						this.applyManageData = res.data.data;
					}else{
						this.applyManageData = {};
					}
				}, (err) => {
					//dong something...
				})
			},
			getApplyResByApplyId() { // 根据ApplyId查询申请新增所需资源
				api(softhardApiList.getApplyResByApplyId, {
					"keyid": this.id
				}).then((res) => {
					if(res.status == 200 && res.data.data) {
						this.applyResData = res.data.data;
					}else{
						this.applyResData = [];
					}
				}, (err) => {
					//dong something...
				})
			},
			getApplyRecordsByApplyId() { // 根据ApplyId查询审批记录
				api(softhardApiList.getApplyRecordsByApplyId, {
					"keyid": this.id
				}).then((res) => {
					if(res.status == 200 && res.data.data) {
						this.applyRecordsRes = res.data.data;
					}
				}, (err) => {
					//dong something...
				})
			},
			btnBack() {
				this.$router.go(-1);
			},
			pzBtn() {//无法配置
				this.pzState = true;
			},
			pzSubmit() {//无法配置提交方法
				api(softhardApiList.commApproveSubmit, {
					"applyKeyid": this.id,
					"passFlag": 2,
					"apprOpinion": this.apprOpinion
				}).then((res) => {
					if(res.status == 200 && res.data.data) {
						this.$router.go(-1);
					}else{
						this.error(res.data.errmsg);
					};
				}, (err) => {
					//dong something...
				})
			},
			pzClose() {
				this.pzState = false;
			},
			applyPass() {//同意方法
				api(softhardApiList.commApproveSubmit, {
					"applyKeyid": this.id,
					"passFlag": 1,
					"apprOpinion": ""
				}).then((res) => {
					if(res.status == 200 && res.data.data) {
						this.$router.push({
							path: '/gxyyApply'
						});
					}else{
						this.error(res.data.errmsg);
					}
				}, (err) => {
					//dong something...
				})
				
			},
			error(errormsg) { //错误提示
				this.$Message.error({
					content: errormsg,
					duration: 3
				});
			},
		}
	}
</script>

<style lang='less' scoped>
	.serviceDetail {
		background: #eee;
		padding: 20px;
		width: 80%;
		height: auto;
	}
	
	.comment {
		ul {
			list-style: none;
			li {
				text-align: left;
			}
		}
	}
	
	.btngroup {
		text-align: center;
		margin-top: 20px;
	}
	
	.marginTop {
		margin-top: 20px;
	}
</style>