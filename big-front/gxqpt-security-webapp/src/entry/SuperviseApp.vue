<template>
  <div>
    <template span="8">
      <Spin size="large" fix v-if="$store.state.isShowMask" id="hySpin">
        <Icon class="demo-spin-col-load" type="load-c" style="font-size: 30px;"	/>
      </Spin>
    </template>

    <Layout>
      <hengyun-header :title="{chinese: '统一监管平台', english: 'Unified Regulatory Platform'}"></hengyun-header>
      <Layout class="ivu-layout-has-sider" v-if="menus.length > 0" style="min-height: 600px;">
        <hengyun-sidebar :menus="menus" />
        <router-view v-if="isRouterAlive"></router-view>
      </Layout>
    </Layout>
  </div>
</template>
<script>
	import api from '@/api/axiosApi'
	import apiList from '@/api/comApiList'
	// 头部
	import header from '@/components/hengyun/header'
	// 侧边栏
	import siderBar from '@/components/hengyun/sideBar'
	import { mapState,mapActions } from 'vuex'

	// const menus = [{
	// 	name: '预警台账',
	// 	link: '/earlyWarning',
	// }, {
	// 	name: '预警处理台账',
	// 	link: '/earlyWarningDeal',
	// }, {
	// 	name: '预警处理结果台账',
	// 	link: '/earlyWarningResult',
	// }, {
	// 	name: '预警分析',
	// 	subMenu: [{
	// 		name: '领导驾驶舱',
	// 		link: '/leaderCockpit'
	// 	}, {
	// 		name: '单位预警分析',
	// 		link: '/unitWarnAnalyze'
	// 	}, {
	// 		name: '部门预警分析',
	// 		link: '/departmentWarnAnalyze'
	// 	}, {
	// 		name: '部门人员预警分析',
	// 		link: '/departPersonnelAnalyze'
	// 	}, {
	// 		name: '人员预警分析',
	// 		link: '/personnelAnalyze'
	// 	}, {
	// 		name: '应用预警分析',
	// 		link: '/applicationWarnAnalyze'
	// 	}]
	// }]

	export default {
		components: {
			'hengyun-sidebar': siderBar,
			'hengyun-header': header
		},
		data() {
			return {
				isRouterAlive: true,
				menus: []
			}
		},
		created() {
			this.fwlbByAdmin();
			this.fwlbByAdmin(1);
			// this.fwlbByAdmin(2);
			this.$nextTick(() => {
				this.$store.dispatch('getAuthButton')
				this.init();
			})
		},
		provide() {
			return {
				reload: this.reload
			}
		},
		computed: {
			rotateIcon() {
				return [
					'menu-icon',
					this.isCollapsed ? 'rotate-icon' : ''
				];
			},
			menuitemClasses() {
				return [
					'menu-item',
					this.isCollapsed ? 'collapsed-menu' : ''
				]
			},
			...mapState([
				'userInfo',
			])
		},
		methods: {
			reload() {
				this.isRouterAlive = false;
				this.$nextTick(function() {
					this.isRouterAlive = true;
				})
			},
			init() {
				this.getOperateMenu();
			},
			getOperateMenu() {
				const _this = this;
				function buildMenu(data) {
					var arr = [];
					data.forEach(function(item, index) {
						var obj = {
							name: item.name,
							link: item.url,
							icon: item.icon,
							subMenu: item.children ? buildMenu(item.children) : null
						}
						arr.push(obj);
					})
					return arr;
				}
				let AxiosData = {
					userId: this.userInfo.userId,
					group: 'left'
				}
				api(apiList.getOperateMenu, AxiosData).then((res) => {
					if(res.status == 200) {
						_this.menus = buildMenu(res.data.data)
						if (_this.menus.length > 0) {
							var obj = {}
							if(_this.menus[0].subMenu && _this.menus[0].subMenu.length) {
								obj = _this.menus[0].subMenu[0]
							} else {
								obj = _this.menus[0]
							}
							if(_this.$route.matched && _this.$route.matched.length === 0) {//当登陆调转时自动跳到一级菜单的一级目录
								_this.$router.push({
									path: obj.link
								})
							}
						}
						// _this.menus = buildMenu(res.data.data);
						// if (_this.menus == 0) {
						// 	_this.isRouterAlive = false
						// 	return
						// }
						// if(_this.menus[0].subMenu) {
						// 	var obj = this.menus[0].subMenu[0];
						// 	if(!_this.$route.query.resourceId) { //当登陆调转时自动跳到一级菜单的一级目录
						// 		_this.$router.push({
						// 			path: obj.link
						// 		});
						// 	}
						// } else {
						// 	var obj = _this.menus[0];
						// 	if(!_this.$route.query.resourceId) { //当登陆调转时自动跳到一级菜单的一级目录
						// 		_this.$router.push({
						// 			path: obj.link
						// 		});
						// 	}
						// }
					}
				})
			},
			...mapActions([
				'fwlbByAdmin',
			])
		}
	}
</script>
<style lang="less">
  .demo-spin-col-load{
    animation: ani-demo-spin 1s linear infinite;
  }
  @keyframes ani-demo-spin {
    from { transform: rotate(0deg);}
    50%  { transform: rotate(180deg);}
    to   { transform: rotate(360deg);}
  }
  .demo-spin-col{
    height: 100px;
    position: relative;
    border: 1px solid #ee212a;
  }
  #hySpin{
    z-index: 8888;
    background-color: rgba(255,255,255,.5);
  }
</style>
