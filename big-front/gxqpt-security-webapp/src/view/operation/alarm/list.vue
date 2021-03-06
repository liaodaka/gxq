<template>
	<Layout>
		<Content>
			<Breadcrumb>
				<BreadcrumbItem>告警管理</BreadcrumbItem>
				<BreadcrumbItem>告警规则设置</BreadcrumbItem>
			</Breadcrumb>
			<Card style="min-height: 300px;">
				<Form :model="searchCondition" ref="searchformData" inline :label-width="80">
          <FormItem label="告警名称：" prop="alarmName">
            <Input
              type="text"
              v-model="searchCondition.alarmName" :disabled="cantEdit">
            </Input>
          </FormItem>
          <FormItem label="告警级别：" prop="alarmLevel">
            <Select v-model="searchCondition.alarmLevel" :disabled="cantEdit" style="width: 140px;">
              <Option :value="level.value" v-for="level in alarmLevels" :key="level">{{level.label}}</Option>
            </Select>
          </FormItem>
          <FormItem label="告警状态：" prop="status">
            <Select v-model="searchCondition.status" :disabled="cantEdit" style="width: 140px;">
              <Option :value="status.value" v-for="status in alarmStatus" :key="status">{{status.label}}</Option>
            </Select>
          </FormItem>
          <FormItem label="产生时间" prop="rangeTime">
            <DatePicker
              type="daterange"
              v-model="rangeTime"
              :editable="false"
              placeholder="请选择服务时间"
              style="width: 200px">
            </DatePicker>
          </FormItem>
					<FormItem>
						<Button type="primary" @click="preSearch">查询</Button>
					</FormItem>
				</Form>
        <hy-table
          highlight-row
          border
          :current="pageInfo.pageNo"
          :columns="tableList.columns"
          :data="tableList.data"
          :total="Number(pageInfo.total)"
          :pageSize="Number(pageInfo.pageSize)"
          pageType="small"
          show-elevator
          show-sizer
          ref="safetyEvalTable"
          @on-page-change="pageChange" />
			</Card>
		</Content>
    <ruleModal
      ref="ruleModal"
      :currentAct="currentAct">
    </ruleModal>
	</Layout>
</template>
<script>
import {mapState} from 'vuex'
import api from '@/api/axiosApi'
import operationApiList from '@/api/operationApiList'

import ruleModal from "./ruleModal.vue";

const alarmLevels = [{
  label: '全部',
  value: ''
}, {
  label: '一级',
  value: 1
}, {
  label: '二级',
  value: 2
}, {
  label: '三级',
  value: 3
}]

const alarmStatus = [{
  label: '全部',
  value: ''
}, {
  label: '未处理',
  value: 1
}, {
  label: '已处理',
  value: 2
}]

function getDateRange(time) {
  if (!time) {
    return ''
  }
  // 结束日期
  const endDate = new Date(time)
  // 当前日期往前推30天
  const startDate = new Date(time - 30 * 24 * 60 * 60 * 1000)
  return {
    start: `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}`,
    end: `${endDate.getFullYear()}-${endDate.getMonth() + 1}-${endDate.getDate()}`
  }
}

export default {
  components: {
      ruleModal
  },
  data() {
      const vm = this
      return {
        alarmLevels,
        alarmStatus,
        currentAct: 'create',
        // 类型列表
        typeList: [],
        rule: false,
        searchCondition: {
          alarmName: '',
          alarmLevel: '',
          status: ''
        },
        rangeTime: [],
        tableList: {
          columns: [{
            title: '序号',
            type: 'index',
            width: 80,
            align: 'center'
          }, {
            title: '告警名称',
            key: 'alarmName'
          }, {
            title: '告警级别',
            key: 'alarmLevel',
            render: (h, params) => {
              for (let level of alarmLevels) {
                if (level.value == params.row.alarmLevel) {
                  return h('span', level.label)
                }
              }
              return h('span', '--')
            }
          }, {
            title: '系统名称',
            key: 'systemName'
          }, {
            title: '告警状态',
            key: 'status',
            render: (h, params) => {
              const status = ['--', '未处理', '已处理']
              return h('span', status[params.row.status])
            }
          }, {
            title: '产生时间',
            key: 'createTime'
          }, {
            title: '操作',
            type: 'act',
            width: 200,
            align: 'center',
            render: (h, params) => {
              const {status, ruleId, id, detailsUrl, applyCode} = params.row
              const detail = h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.currentAct = 'detail'
                    this.$refs.ruleModal.open(ruleId)
                  }
                }
              }, '告警规则详情')
              const deal = h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    vm.$router.push({
                      path: `${detailsUrl}?code=${applyCode}`
                    })
                  }
                }
              }, '处理')
              const btns = []
              // 未处理
              if (status === 1) {
                btns.push(deal)
              }
              btns.push(detail)
              return h('div', btns)
            }
          }],
          data: []
        },
        pageInfo: {
          pageNo: 1,
          pageSize: 10,
          total: 0
        }
      }
  },
  computed: {
    ...mapState(['authButton'])
  },
  mounted () {
    this.doSearch()
  },
  methods: {
    preSearch() {
      this.pageInfo.pageNo = 1
      this.doSearch()
    },
    pageChange(pageNo, pageSize) {
      this.pageInfo.pageNo = pageNo
      this.pageInfo.pageSize = pageSize
      this.doSearch()
    },
    // 查询
    doSearch () {
      this.getList()
    },
    // 获取培训列表
    getList(pageNo, pageSize) {
      const vm = this
      const endTime = vm.rangeTime.length > 0 ? getDateRange(vm.rangeTime[1]).end : ''
      const startTime = vm.rangeTime.length > 0 ? getDateRange(vm.rangeTime[0]).end : ''
      api(operationApiList.alarmInformationPage, {
        pageNo: pageNo || vm.pageInfo.pageNo,
        pageSize: pageSize || vm.pageInfo.pageSize,
        data: {
          ...vm.searchCondition,
          endTime: endTime ? `${endTime} 23:59:59` : '',
          startTime: startTime ? `${startTime} 00:00:00` : ''
        }
      }).then(res => {
        if (res.data.errcode === 0) {
          const result = res.data.data
          vm.pageInfo.pageNo = result.pageNum
          vm.pageInfo.total = result.total
          vm.tableList.data = result.list
        }
      }, error => {console.log(error)})
    }
  }
}
</script>
<style lang="less" scoped="scoped">
.act-btn-group{
	button{
		margin: 0 12px;
	}
}
.ivu-modal-footer{
    display: none;
}
</style>