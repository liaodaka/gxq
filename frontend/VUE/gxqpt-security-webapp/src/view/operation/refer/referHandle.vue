<template>
  <Layout>
    <Content>
      <Breadcrumb>
        <BreadcrumbItem>咨询管理</BreadcrumbItem>
        <BreadcrumbItem>咨询处理</BreadcrumbItem>
      </Breadcrumb>
      <Card>
        <Form
          ref="formValidate"
          inline
          :label-width="100"
          :model="searchCondition">
          <FormItem label="咨询时间：">
            <DatePicker
              v-model="searchTime"
              format="yyyy-MM-dd"
              type="daterange"
              :editable="false"
              style="width: 200px">
            </DatePicker>
          </FormItem>
          <FormItem label="咨询名称：">
            <Input
              type="text"
              v-model="searchCondition.consultName">
            </Input>
          </FormItem>
          <FormItem label="状态：">
            <Select v-model="searchCondition.status" style="width:120px">
              <Option v-for="item in statusList" v-model="item.value" :key="item.value">{{item.label}}</Option>
            </Select>
          </FormItem>
          <FormItem label="提交单位：">
            <!-- <Select v-model="searchCondition.subDept" style="width:180px">
              <Option value="-1">全部</Option>
              <Option v-for="item in subDeptList" v-model="item.name" :key="item.id">{{item.name}}</Option>
            </Select> -->
            <Input type="text" v-model="searchCondition.subDept" style="width: 100px;"></Input>
          </FormItem>
          <FormItem label="提交人：">
            <!-- <div class="ivu-form-item-content" @click="openTreeModal">
              <div class="ivu-input-wrapper ivu-input-type">
                <i class="ivu-icon ivu-icon-load-c ivu-load-loop ivu-input-icon ivu-input-icon-validate"></i>
                <div class="ivu-input" style="width: 120px;">{{searchCondition.subPerson}}</div>
              </div>
            </div> -->
            <Input type="text" v-model="searchCondition.subPerson" style="width: 100px;"></Input>
          </FormItem>
          <FormItem label="任务编号" style="width: 200px">
            <Input v-model="searchCondition.applyCode"></Input>
          </FormItem>
          <FormItem :label-width="20">
            <Button type="primary" @click="preSearch" v-if="authButton.includes('ops_consulting_handle_query')">查询</Button>
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
          class="refer-apply"
          @on-page-change="pageChange" />
        <!-- 选择培训人的树形弹窗 -->
        <personTreeModal ref="getPerson" @on-ok="selectPerson" />
      </Card>
    </Content>
  </Layout>
</template>

<script>
import {mapState} from 'vuex'
import api from '@/api/axiosApi'
import apiList from '@/api/comApiList'
import operationApiList from '@/api/operationApiList'
import personTreeModal from './../trainMgr/trainModal/personTreeModal.vue'

const statusList = [{
  label: '全部',
  value: -1
}, {
  label: '处理中',
  value: 2
}, {
  label: '已完结',
  value: 4
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

function convertDateTime(date) {
  if (!date) return ''
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

function defaultDisplay(h, params, key) {
  return h('span', params.row[key] || '--')
}

export default {
  components: {
    personTreeModal
  },
  data () {
    const vm = this
    return {
      statusList,
      subDeptList: [],
      showModal: false,
      // 咨询时间
      searchTime: [],
      searchCondition: {
        // 咨询名称
        consultName: '',
        // 状态
        status: -1,
        // 提交单位
        subDept: '',
        // 提交人
        subPerson: '',
        // 任务编号
        applyCode: this.$route.query.code || ''
      },
      tableList: {
        columns: [
          {
            type: 'index',
            title: '序号',
            width: 60,
            align: 'center'
          },
          {
            title: '任务编号',
            key: 'applyCode'
          },
          {
            title: '咨询名称',
            key: 'consultName',
            render: (h, params) => {
              return h('div', [
                h('span', {
                  style: {
                    display: 'inline-block',
                    width: params.column._width * 0.9 + 'px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  },
                  domProps: {
                    title: params.row.consultName
                  }
                }, params.row.consultName)
                // h('Tooltip', {
                //   props: { placement: 'top' }
                // }, [
                //   h('span', {
                //     style: {
                //       display: 'inline-block',
                //       width: params.column._width * 0.9 + 'px',
                //       overflow: 'hidden',
                //       textOverflow: 'ellipsis',
                //       whiteSpace: 'nowrap'
                //     }
                //   }, params.row.consultName),
                //   h('span', {
                //     slot: 'content',
                //     style: { whiteSpace: 'normal', wordBreak: 'break-all', maxHeight: '40vh', overflow: 'auto', display: 'inline-block' }
                //   }, params.row.consultName)
                // ])
              ])
            }
          },
          {
            title: '咨询时间',
            key: 'consultTime'
          },
          {
            title: '提交单位',
            key: 'subDept'
          },
          {
            title: '提交人',
            key: 'subPerson'
          },
          {
            title: '状态',
            key: 'status',
            render: (h, params) => {
              const status = params.row.status
              const label = status == 2 ? '处理中' : '已完结'
              return h('span', label)
            }
          },
          {
            title: '评分',
            key: 'score',
            render: (h, params) => {
              return defaultDisplay(h, params, 'score')
            }
          },
          {
            title: '操作',
            key: 'address',
            render: (h, params) => {
              const vm = this
              const {status, zxrId, isAdminRole} = params.row
              const handle = h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click () {
                    vm.currentInfo = params.row
                    vm.doOver()
                  }
                }
              }, '完结')
              const detail = h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click () {
                    vm.$router.push({
                      name: 'referDetail',
                      params: {
                        id: params.row.id
                      },
                      query: {
                        status
                      }
                    })
                  }
                }
              }, '详情')
              const btns = []
              switch (status) {
                case 2:
                  // 此处判断当前登录人是否是咨询人，只有咨询人和管理员才能点击完结
                  if (isAdminRole || zxrId == vm.userInfo.userId) {
                    btns.push(handle)
                  }
                  break
              }
              if (vm.authButton.includes('ops_consulting_handle_detail')) {
                btns.push(detail)
              }
              return h('div', btns)
            }
          }
        ],
        data: []
      },
      pageInfo: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      // 当前行信息
      currentInfo: {},

    }
  },
  computed: {
    ...mapState(['authButton', 'userInfo'])
  },
  mounted() {
    this.search()
    // this.getSubDeptList()
  },
  methods: {
    preSearch() {
        this.pageInfo.pageNo = 1
        this.search()
    },
    pageChange(pageNo, pageSize) {
      this.pageInfo.pageNo = pageNo
      this.pageInfo.pageSize = pageSize
      this.search()
    },
    search () {
      this.getList()
    },
    // 获取所有咨询的列表
    getList (pageNo, pageSize) {
      const vm = this
      const endTime = vm.searchTime.length > 0 ? getDateRange(vm.searchTime[1]).end : ''
      const startTime = vm.searchTime.length > 0 ? getDateRange(vm.searchTime[0]).end : ''
      api(operationApiList.consultHandlePage, {
        pageNo: pageNo || vm.pageInfo.pageNo,
        pageSize: pageSize || vm.pageInfo.pageSize,
        data: {
          endTime: endTime ? `${endTime} 23:59:59` : '',
          startTime: startTime ? `${startTime} 00:00:00` : '',
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
    // 获取单位列表
    getSubDeptList() {
      const vm = this
      api(apiList.getMyOrgList)
      .then(res => {
        if (res.data.errcode === 0) {
          vm.subDeptList = res.data.data.orgList
        }
      }, error => {console.log(error)})
    },
    // 打开树形结构，选择人员
    openTreeModal() {
      this.$refs.getPerson.open()
    },
    // 选择提交人的回调
    selectPerson(list) {
      this.searchCondition.subPerson = list.length > 0 ? list[0].title : ''
    },
    // 完结
    doOver() {
      const vm = this
      vm.$Modal.confirm({
        title: '完结确认',
        content: '确定完结此条咨询吗？',
        onOk: () => {
          api(operationApiList.consultOver, {
            id: vm.currentInfo.id
          }).then(res => {
            if (res.data.errcode === 0) {
              vm.$Message.success('完结成功！！！')
              vm.showModal=  false
              vm.search()
            }
          }, error => {console.log(error)})
        }
      })
    },
  }
}
</script>

<style lang='less'>
.refer-apply{
  .handle{
    color: #2d8cf0;
    cursor: pointer;
    margin: 0 5px;
    display: inline-block;
  }
}
</style>
