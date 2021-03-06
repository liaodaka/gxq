<template>
	<Layout>
		<Content>
			<Breadcrumb>
				<BreadcrumbItem>告警管理</BreadcrumbItem>
				<BreadcrumbItem>告警规则设置</BreadcrumbItem>
			</Breadcrumb>
			<Card>
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
					<FormItem label="告警类型：" prop="alarmType">
            <Select v-model="searchCondition.alarmType" :disabled="cantEdit" style="width: 140px;">
              <Option :value="type.value" v-for="type in alarmTypes" :key="type">{{type.label}}</Option>
            </Select>
          </FormItem>
					<FormItem>
						<Button type="primary" @click="preSearch">查询</Button>
					</FormItem>
				</Form>
        <Row style="margin-bottom: 20px;">
          <Col span="24">
            <Button type="primary" @click="openCreateModal">新增</Button>
            <Button type="primary" @click="openDeleteModal">删除</Button>
          </Col>
        </Row>
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
          @on-page-change="pageChange"
          @on-selection-change="doSelect" />
			</Card>
		</Content>
    <ruleModal
      ref="ruleModal"
      :currentAct="currentAct"
      @on-ok="doSearch">
    </ruleModal>
	</Layout>
</template>
<script>
import {mapState} from 'vuex'
import api from '@/api/axiosApi'
import operationApiList from '@/api/operationApiList'

import ruleModal from "./ruleModal.vue";

const alarmTypes = [{
  label: '全部',
  value: ''
}, {
  label: '任务审核超时告警',
  value: 1
}, {
  label: '任务处理超时告警',
  value: 2
}]

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

export default {
  components: {
    ruleModal
  },
  data() {
    const vm = this
    return {
      alarmTypes,
      alarmLevels,
      currentAct: 'create',
      selections: [],
      searchCondition: {
        alarmName: '',
        alarmLevel: '',
        alarmType: '',
      },
      tableList: {
        columns: [{
          type: 'selection',
          width: 60,
          align: 'center'
        }, {
          title: '序号',
          type: 'index',
          width: 80,
          align: 'center'
        }, {
          title: '告警类型',
          key: 'alarmType',
          render: (h, params) => {
            for (let type of alarmTypes) {
              if (type.value == params.row.alarmType) {
                return h('span', type.label)
              }
            }
            return h('span', '--')
          }
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
          title: '操作',
          type: 'act',
          width: 200,
          align: 'center',
          render: (h, params) => {
            const {id} = params.row
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
                  this.$refs.ruleModal.open(id)
                }
              }
            }, '查看')
            const edit = h('Button', {
              props: {
                type: 'primary',
                size: 'small'
              },
              style: {
                marginRight: '5px'
              },
              on: {
                click: () => {
                  vm.currentAct = 'edit'
                  vm.$refs.ruleModal.open(id)
                }
              }
            }, '修改')
            const remove = h('Button', {
              props: {
                type: 'primary',
                size: 'small'
              },
              style: {
                marginRight: '5px'
              },
              on: {
                click: () => {
                  vm.$Modal.confirm({
                    title: '删除确认',
                    content: '确认删除这条告警规则吗？',
                    onOk: () => {
                      vm.alarmDelete([id])
                    }
                  })
                }
              }
            }, '删除')
            const btns = []
            btns.push(edit)
            btns.push(remove)
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
      },
      // 当前修改的培训的信息
      currentActTrainInfo: {}
    }
  },
  computed: {
    ...mapState(['authButton'])
  },
  mounted () {
    this.doSearch()
  },
  methods: {
    // 删除规则
    alarmDelete (ids) {
      const vm = this
      api(operationApiList.alarmDelete, {
        ids: ids.join(',')
      }).then(res => {
        if (res.data.errcode === 0) {
          vm.doSearch()
        }
      }, error => {console.log(error)})
    },
    // 勾选列表时触发
    doSelect(selection) {
      this.selections = selection
    },
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
    // 获取列表
    getList(pageNo, pageSize) {
      const vm = this
      api(operationApiList.rulePage, {
        pageNo: pageNo || vm.pageInfo.pageNo,
        pageSize: pageSize || vm.pageInfo.pageSize,
        data: {
          ...vm.searchCondition
        }
      }).then(res => {
        if (res.data.errcode === 0) {
          const result = res.data.data
          vm.pageInfo.pageNo = result.pageNum
          vm.pageInfo.total = result.total
          vm.tableList.data = result.list
        }
      }, error => {console.log(error)})
    },
    // 打开新增的弹窗
    openCreateModal () {
      this.currentAct = 'create'
      this.$refs.ruleModal.open()
    },
    // 打开批量删除弹窗
    openDeleteModal () {
      const vm = this
      if (vm.selections.length == 0) {
        vm.$Message.info('请先勾选至少一项告警规则')
        return
      }
      vm.$Modal.confirm({
        title: '删除确认',
        content: '确认删除选中的告警规则吗？',
        onOk: () => {
          const ids = []
          vm.selections.map(item => {
            ids.push(item.id)
          })
          vm.alarmDelete(ids)
        }
      })
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