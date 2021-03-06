/**
 * 接口文档地址
 * author：liuguangrui
 */

const serviceModule = {
	getSystemName: { //查询系统名称
		url: '/api/developer/application/findAppVisibleForSelf',
		method: 'get'
	},
	// 首页统计：
	statInterfaceConfig: { // 统计接口总数量和配置接口数量
		url: '/api/security/statistic/statInterfaceConfig',
		method: 'get'
	},
	statAllBackupsAndYesterday: { // 统计数据应备份数量和昨天数据备份数量
		url: '/api/security/statistic/statAllBackupsAndYesterday',
		method: 'get'
	},
	statExceptionProcess: { // 统计总异常进程数量和本月异常进程数量
		url: '/api/security/statistic/statExceptionProcess',
		method: 'get'
	},
	statExceptionServer: { // 统计总异常服务数量和本月异常服务数量
		url: '/api/security/statistic/statExceptionServer',
		method: 'get'
	},
	statInterfaceExecuteTop10: { // 统计接口调用数量排行前10位
		url: '/api/security/statistic/statInterfaceExecuteTop10',
		method: 'get'
	},
	statExceptionProcessIn7days: { // 统计最近7天内每天异常进程数量
		url: '/api/security/statistic/statExceptionProcessIn7days',
		method: 'get'
	},
	statExceptionServerIn7days: { // 统计最近7天内每天异常服务数量
		url: '/api/security/statistic/statExceptionServerIn7days',
		method: 'get'
	},
	//首页统计结束

	findFiveSupport: { // 根据appid集合查询应用列表
		url: '/api/developer/application/findFiveSupport',
		method: 'get'
	},
	getProgram: { //查询程序发布数据列表
		url: '/api/security/dataapi/program/find',
		method: 'post'
	},
	CreateProgram: { //保存程序发布数据
		url: '/api/security/dataapi/program/save',
		method: 'post'
	},
	auditProgram: { //程序发布审批
		url: '/api/security/dataapi/program/audit',
		method: 'post'
	},
	viewProgram: { //查看程序发布
		url: '/api/security/dataapi/program/get',
		method: 'get'
	},
	deleteProgram: { //删除程序发布
		url: '/api/security/dataapi/program/delete',
		method: 'get'
	},
	getAssessment: { //查询系统安全评估数据列表
		url: '/api/security/dataapi/assessment/find',
		method: 'post'
	},
	viewAssessment: { //根据ID查询测评信息数据
		url: '/api/security/dataapi/assessment/get',
		method: 'get'
	},
	createAssessmentReport: { //保存测评报告数据
		url: '/api/security/dataapi/assessmentreport/save',
		method: 'post'
	},

	deleteAssessmentReport: { //根据ID删除测评报告
		url: '/api/security/dataapi/assreport/delete',
		method: 'get'
	},
	getBackup: { //查询备份数据列表
		url: '/api/security/dataapi/backups/findList',
		method: 'post'
	},
	createBackup: { //保存备份数据
		url: '/api/security/dataapi/backups/save',
		method: 'post'
	},
	validBackupName: { //校验备份名称是否重复
		url: '/api/security/dataapi/backups/valionlyname',
		method: 'get'
	},
	viewBackup: { //根据ID查询备份数据
		url: '/api/security/dataapi/backups/getbyid',
		method: 'get'
	},
	getUserApp: { //获取当前登录用户拥有应用
		url: '/api/developer/application/findList',
		method: 'get'
	},
	editBackup: { //更新备份数据
		url: '/api/security/dataapi/backups/update',
		method: 'post'
	},
	getBackupName: { //查询所有备份名称
		url: '/api/security/dataapi/backups/getallname',
		method: 'get'
	},
	getBackupLog: { //查询备份监控表
		url: '/api/security/dataapi/backupslog/find',
		method: 'post'
	},
	getbySystemName: { //根据备份系统名称查询备份名称
		url: '/api/security/dataapi/backups/getbySystemName',
		method: 'get'
	},
	getServerAccess: { //分页查询服务器访问记录
		url: '/api/security/monitor/pageServerAccessList',
		method: 'post'
	},
	getProcess: { //分页查询进程列表
		url: '/api/security/monitor/pageProcessList',
		method: 'post'
	},
	getProcessWhite: { //分页查询进程白名单
		url: '/api/security/monitor/pageProcessWhitelist',
		method: 'post'
	},
	viewProcess: { //根据主键获取单个异常进程信息
		url: '/api/security/monitor/getProcess',
		method: 'get'
	},
	handleProcess: { //处理异常进程信息
		url: '/api/security/monitor/updateMonitorProcess',
		method: 'post'
	},
	getServerMonitor: { //分页查询服务预警记录列表
		url: '/api/security/monitor/pageServerMonitorList',
		method: 'post'
	},
	viewServerMonitor: { //根据主键获取单个异常服务信息
		url: '/api/security/monitor/getMonitorServer',
		method: 'get'
	},
	editServerMonitor: { //更新服务异常记录信息
		url: '/api/security/monitor/updateServiceWarn',
		method: 'post'
	},
	getApplication: { //获取所有应用(非分页)
		url: '/api/developer/application/findAllList',
		method: 'get'
	},
	getInterface: { //分页查询接口阀值配置信息(appID不能为空)
		url: '/api/security/interfaces/pageInterfaceConfig',
		method: 'post'
	},
	viewInterface: { //根据主键获取单个接口阀值信息
		url: '/api/security/interfaces/getInterfaceConfig',
		method: 'get'
	},
	editInterface: { //批量更新接口阀值限制信息
		url: '/api/security/interfaces/updateApiAccessLimitList',
		method: 'post'
	},
	getApiAccessStat: { //获取指定接口、指定日期的访问量统计结果
		url: '/api/security/interfaces/getApiAccessStat',
		method: 'get'
	},
	fileUpload: {
		url: '/upload',
		method: 'post'
	},
	empTypeList: { // 人员预警类别列表
		url: '/api/supervise/empanalysis/empTypeList',
		method: 'post'
	},
	getInterfaceConfigList: { // 根据用户有权限，获取接口列表
		url: '/api/security/interfaces/getInterfaceConfigList',
		method: 'get',
	},
	findAppVisibleForSelf: { // 查询指定用户可见的应用列表
		url: '/api/developer/application/findAppVisibleForSelf',
		method: 'get'
	}
}
const ApiList = { ...serviceModule }

export default ApiList