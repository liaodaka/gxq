<template>
  <Layout>
    <Content>
      <Breadcrumb>
        <BreadcrumbItem>统一监管平台</BreadcrumbItem>
        <BreadcrumbItem>{{appname}}预警分析</BreadcrumbItem>
      </Breadcrumb>
      <Card style="min-height: 600px;">
        <Form ref="formValidate" inline :label-width="80" id="appView">
          <FormItem label="时间" style="margin-bottom: 0;">
            <DatePicker type="year" placeholder="选择时间" style="width: 200px" v-model="formData.year"></DatePicker>
          </FormItem>
          <FormItem :label-width="20" style="margin-bottom: 0;">
            <Button type="primary" @click="initRender">查看分析</Button>
          </FormItem>
          <FormItem class="rt">
						<router-link to="/applicationWarnAnalyze"><Button type="primary">返回</Button></router-link>
					</FormItem>
        </Form>
      </Card>
      <Layout style="background:#fff;">
        <Layout>
          <Row>
            <Col style="padding: 15px;background-color: #59d4d4;font-size: 16px;display: inline-block;width: auto;">
              {{$route.query.app ? `${$route.query.app}的` : ''}}预警分析
            </Col>
          </Row>
          <Row type="flex" justify="space-between" style="margin: 0;">
            <Col style="width: 49%">
              <chart-card title="预警产生处理情况">
                <app-warn-history ref="appWarnHistory" />
              </chart-card>
            </Col>
            <Col style="width: 49%">
              <chart-card title="应用预警类别情况">
                <app-category-view ref="appCategoryView" />
              </chart-card>
            </Col>
          </Row>
          <Row type="flex" justify="space-between">
            <Col style="width: 30%">
              <chart-card title="应用预警级别对比分析">
                <app-level-view ref="appLevelView" />
              </chart-card>
            </Col>
            <Col style="width: 33%">
              <chart-card title="应用预警来源TOP10">
                <app-top-view ref="appTopView" />
              </chart-card>
            </Col>
            <Col style="width: 33%">
              <chart-card title="应用预警关联分析">
                <app-relation-view ref="appRelationView" />
              </chart-card>
            </Col>
          </Row>
        </Layout>
      </Layout>
    </Content>
  </Layout>
</template>

<script>
// api util
import api from '@/api/axiosApi'
import superviseApiList from '@/api/superviseApiList'

// echart图外层容器，包括卡片样式
import chartCard from './echarts/chartCard.vue'
// 应用预警级别对比分析
import appLevelView from './echarts/appLevelView.vue'
// 应用预警历史
import appWarnHistory from './echarts/appWarnHistory.vue'
// 各应用预警类别情况
import appCategoryView from './echarts/appCategoryView.vue'
// 应用预警来源TOP10
import appTopAndView from './echarts/appTopAndView'
// 应用预警关联分析
import appRelationView from './echarts/appRelationAndView.vue'

export default {
  components: {
    chartCard,
    appLevelView,
    appWarnHistory,
    appCategoryView,
    'app-top-view': appTopAndView,
    appRelationView
  },
  data(){
    return{
      ruleValidate: {},
      formData: {
        year: new Date()
      },
      appname: this.$route.query.app
    }
  },
  mounted() {
    this.initRender()
  },
  methods: {
    initRender () {
      this.getWarnHandleStatistical()
      this.warntype()
      this.findPublicContrastLevel()
      this.findAssociationChildRules()
      this.findContentTop()
    },
    // 应用预警历史(图1)
    getWarnHandleStatistical() {
      const vm = this
      api(superviseApiList.appanalysisWarnHandleStatistical, {
        appid: vm.$route.params.id,
        year: vm.formData.year ? vm.formData.year.getFullYear().toString() : ''
      }).then((res) => {
        if(res.data.errcode == 0) {
          vm.$refs.appWarnHistory.refresh(res.data.data)
        }else{
          this.$Message.error(res.data.errmsg);
        }
      }, (error) => {})
    },
    // 应用预警类别对比分析(图2)
    warntype () {
      const vm = this
      api(superviseApiList.appWarnType, {
        id: vm.$route.params.id,
        year: vm.formData.year ? vm.formData.year.getFullYear().toString() : ''
      }).then((res) => {
        if(res.data.errcode == 0) {
          vm.$refs.appCategoryView.refresh(res.data.data)
        }else{
          this.$Message.error(res.data.errmsg);
        }
      }, (error) => {})
    },
    // 应用预警级别对比分析
    findPublicContrastLevel () {
      const vm = this
      api(superviseApiList.findPublicContrastLevel, {
        appId: vm.$route.params.id,
        date: vm.formData.year ? vm.formData.year.getFullYear().toString() : ''
      }).then((res) => {
        if(res.data.errcode == 0) {
          vm.$refs.appLevelView.refresh(res.data.data)
        }else{
          this.$Message.error(res.data.errmsg);
        }
      }, (error) => {})
    },
    // 预警内容关键词分析
    findContentTop() {
      const vm = this
      api(superviseApiList.findContentTop, {
        appIds: [vm.$route.params.id],
        date: vm.formData.year ? vm.formData.year.getFullYear().toString() : ''
      }).then((res) => {
        if(res.data.errcode == 0) {
          vm.$refs.appTopView.refresh(res.data.data)
        }else{
          this.$Message.error(res.data.errmsg);
        }
      }, (error) => {})
    },
    // 应用预警关联分析
    findAssociationChildRules() {
      const vm = this
      api(superviseApiList.findAssociationChildRules,{
        appId: vm.$route.params.id,
        date: vm.formData.year ? vm.formData.year.getFullYear().toString() : ''
      }).then((res) => {
        if(res.data.errcode == 0) {
          vm.$refs.appRelationView.refresh(res.data.data)
        } else {
          this.$Message.error(res.data.errmsg);
        }
      }, (error) => {})
    }
  }
}
</script>

<style lang="less" scoped>
.radioMod{
  width:80%;
  height:100%;
  padding:10px 0;
  border:1px solid #ccc;
  border-radius: 50%;
  margin: 30px auto;
}
.lt{
	float: left;
}
.rt{
	float: right;
}
.mf{
  margin-left:2%;
}
.radioTxt{
  width:100px;
  height:100px;
  margin:35px auto;
  font-size:20px;
  text-align: center
}
</style>
