<template>
  <Card>
    <p v-if="idType==6" slot="title">单位申请信息：</p>
    <Form ref="configInfo" inline :label-width="110" :model="configInfo" :rules="configInfoValidate">
      <FormItem v-if="idType==1 || idType==3" label="申请单位：" prop="applyOrgid">
        <Select v-model="configInfo.applyOrgid" clearable style="width:200px" :disabled='disabled'>
          <Option v-for="item in unitList" :value="item.id" :key="item.id">{{item.name}}</Option>
        </Select>
      </FormItem>
      <FormItem v-if="idType!=1 && idType!=3" label="申请单位：" prop="applyOrgid">
        <Input type="text" v-model="configInfo.applyOrgname" style="width:140px" :disabled='disabled'></Input>
      </FormItem>
      <FormItem v-if="idType==4" label="申请人：" prop="applyUname">
        <Input type="text" v-model="configInfo.applyUname" style="width:140px" :disabled='disabled'></Input>
      </FormItem>
      <FormItem label="申请人邮箱：" prop="applyEmail">
        <AutoComplete
            v-model="configInfo.applyEmail"
            @on-search="emailHandleSearch"
            @on-change="emailChange"
            placeholder="请输入邮箱地址"
            style="width:200px">
            <Option v-for="item in emailData" :value="item" :key="item">{{ item }}</Option>
        </AutoComplete>
        <!-- <Input type="text" v-model="configInfo.applyEmail" style="width:140px" :disabled='disabled'></Input> -->
      </FormItem>
      <FormItem v-if="!disab">
        <Button type="primary" @click="popModal">+添加</Button>
      </FormItem>
      <hy-table highlight-row :columns="tableList.columns" :data="tableList.data" class="server-list" @on-page-change="getList" :needPage="false" />
      <hy-table highlight-row v-if="serverChangeShow" :columns="tableList.changeColumns" :data="tableList.changeData" style="width: 99.9%" :needPage="false" />
      <FormItem label="申请原因：" style="margin-top: 20px;margin-right: 68px;" prop="applyReason">
        <Input type="textarea" style="width: 400px;" v-model="configInfo.applyReason" :maxlength="200" placeholder="限制输入200个字符以内" :disabled='disabled'> </Input>
      </FormItem>
      <FormItem v-if="idType==4 || idType==6 || idType==5" label="附件说明：" style="margin-top: 20px;" v-for="(item,idx) in configInfo.attachment" :key="idx">
        <Input type="text" v-model="item.fileName" disabled style="width: 400px;"></Input>
        <Button v-if="!!item.fileUrl" type="primary" @click="downLoad(item.fileUrl,item.fileName)">下载</Button>
      </FormItem>
      <FormItem v-if="idType!=4 && idType!=6 && idType!=5" label="附件说明：" style="margin-top: 40px;">
        <hy-upload ref="evalReport" multiple :on-success="setEvalReport" :format="['xls','xlsx','doc', 'docx','pdf']" :on-remove="removeEvalReport" :before-upload="evalBeforeUpload" :defaultFileList="configInfo.attachment"></hy-upload> <!-- :defaultFileList="configInfo.attachment" -->
      </FormItem>
      <approvalOpinions v-if="idType!=2 &&  idType!=2"></approvalOpinions>
    </Form>
    <Row class="bottom-bar" style="text-align: center">
      <Col>
        <Button v-if="idType!=6" type="default" @click="quit">取消</Button>
        <Button v-if="idType!=4 && idType!=5 && idType!=6" type="primary" @click="submit(1,'configInfo')">保存</Button>
        <Button v-if="idType!=4 && idType!=5 && idType!=6" type="primary" @click="submit(2,'configInfo')">提交</Button>
        <Button v-if="idType==4" type="primary" @click="audit">审批</Button>
        <Button v-if="idType==5" type="primary" @click="resources(0)">配置资源</Button>
        <Button v-if="idType==5 && configInfo.stepCode != 'YOUYI_FINAL'" type="primary" @click="resources(1)">资源不足</Button>
      </Col>
    </Row>
    <Modal v-model="showModal" title="服务器资源配置" :mask-closable='false' :closable='false'>
        <!-- <div slot="footer">
          <Button type="primary" @click="doAddServer(applyServer)">确定</Button>
          <Button type="text" @click="closeModal">关闭</Button>
        </div> -->
      <server-config ref="serverConfig" v-on:saveConfig="doAddServer" :applyEdit='applyServer'/>
      <div slot="footer">
				<Button type="primary" @click="applySubmit('serverConfig')">确定</Button>
				<Button type="default" @click="closeModal">关闭</Button>
			</div>
    </Modal>
    <Modal v-model="auditModal" title="审批" :mask-closable="false">
        <Form ref="auditInfo" :label-width="100" :model="auditInfo" :rules="auditInfoValidate">
          <FormItem label="审批结果" prop="passFlag">
            <Select clearable v-model="auditInfo.passFlag" style="width:200px">
              <Option value="通过">通过</Option>
              <Option value="不通过">不通过</Option>
            </Select>
          </FormItem>
          <FormItem label="审批意见" prop="apprOpinion">
            <Input type="textarea" style="width: 400px;" :maxlength="50" placeholder="限制输入50个字符以内" v-model="auditInfo.apprOpinion"> </Input>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="primary" @click="auditBtn">确定</Button>
          <Button type="default" @click="closeAuditModal">关闭</Button>
        </div>
    </Modal>
  </Card>
</template>

<script>
import serverConfig from './../common/serverConfig'
import api from '@/api/axiosApi'
import softhardApiList from '@/api/softhardApiList'
import superviseApiList from '@/api/superviseApiList'
import hyUpload from '@/components/hengyun/hyUpload'
import approvalOpinions from './../common/approvalOpinions'
const validateEmail = (rule, value, callback) => {
    let regEmail= /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    if (!value) {
        return callback(new Error('邮箱不能为空！'));
    }else if (!regEmail.test(value)) {
      callback(new Error('邮箱格式不正确'));
    }else{
      callback();
    }
};
function getConfigInfo() {
  return {
    serverChangeShow: '',
    serverKeyid: '',
    cpuCount:'',
    memorySize:'',
    system:'',
    netScope:'',
    netWide:'',
    content:'',
    sysDisksize:0,
    applyCount: 0,
    disks: [
      {
        diskSize:'',
        diskName:''
      }
    ],
  }
}

export default {
  components: {
    serverConfig,
    hyUpload,
    approvalOpinions
  },
  props: {
     disab: {
      type: Boolean,
      default:false
    }
  },
  data () {
    return {
      serverData: {
        serverKeyid: '',
        type: 1
      },
      isEdit:false,
      idx:0,
      disabled:false,
      idType:0,
      auditInfo:{},
      emailData:[],
      diskColumns:[
        {
          title:'磁盘',
          key:'diskName',
          width: 150,
        },
        {
          title:'大小(单位:GB)',
          key:'diskSize',
          width: 113,
        },
      ],
      unitList:[],//单位列表
      auditInfoValidate:{//审核表单验证
        passFlag: [{
          required: true,
          message: '审批结果不能为空，请重新选择！',
          trigger: 'change'
        }],
        apprOpinion: [{
          required: true,
          message: '审批意见不能为空！',
          trigger: 'change'
        }],
      },
      configInfoValidate:{
        applyOrgid: [{
          required: true,
          message: '单位不能为空，请重新选择！',
          trigger: 'change'
        }],
        applyEmail: [{required: true, validator:validateEmail, trigger: 'change'},
        {validator: (rule, value, cb) => {
          if (this.configInfo.applyEmail.length > 26) {
            cb(new Error('限制26个字符以内'))
            return
          }
          cb()
        }}],
        applyReason: [{
          required: true,
          message: '申请原因不能为空，请重新填写！',
          trigger: 'change'
        }],
      },
      tableList: {
        columns: [
          {
            type: 'index',
            title: '序号',
            width: 60,
            fixed: 'left',
            align: 'center'
          },
          {
            title: 'CPU核数(单位:核)',
            width: 140,
            key: 'cpuCount'
          },
          {
            title: '内存(单位:GB)',
            width: 120,
            key: 'memorySize'
          },
          {
            title: '操作系统',
            width: 160,
            key: 'systemName'
          },
          {
            title: '所属网络',
            width: 120,
            key: 'netScopeName'
          },
          {
            title: '网络带宽(单位:MB)',
            width: 140,
            key: 'netWide'
          },
          {
            title: '网关描述',
            width: 120,
            key: 'gatewayDesc',
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
                    title: params.row.gatewayDesc
                  }
                }, params.row.gatewayDesc)
              ])
            }
          },
          {
            title: '系统磁盘(单位:GB)',
            ellipsis:true,
            width: 140,
            key: 'sysDisksize',
            render: (h, params) => {
              const array = params.row.disks
              const key = params.row.sysDisksize
              let roleTitle = ''
              if(!key){
                for(const item of array){
                  if(item.diskType === 2){
                    roleTitle = item.diskSize
                  }
                }
              }else{
                roleTitle = key
              }
              return h('div', [
                h('span',roleTitle)
              ])
            }
          },
          {
            title: '申请数量(单位:台)',
            tooltip:true,
            width: 140,
            key: 'applyCount'
          },
          {
            title: '磁盘列表',
            key: 'disks',
            align: 'center',
            width: 300,
            render: (h, params) => {
              return h('Table', {
                class:'server-list',
                props: {
                  columns: this.diskColumns,
                  data:params.row.disks
                }
              })
            }
          },
          {
            title: '操作',
            width: 160,
            fixed: 'right',
            key: 'address',
            render: (h, params) => {
              const vm = this
              const age = params.row.age
              const id = params.row.age
              const edit = h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                domProps: {
                  innerHTML: '修改'
                },
                on: {
                  click () {
                    console.log(params);
                    vm.gotoCtrl(1, params.index)
                  }
                }
              })
              const deleteServer = h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                domProps: {
                  innerHTML: '删除'
                },
                on: {
                  click () {
                    vm.gotoCtrl(0, params.index)
                  }
                }
              })
              switch (this.disab) {
                case true:
                  return h('div', ['--'])
                default:
                  return h('div', [edit, deleteServer])
              }
            }
          }
        ],
        data: [],
        changeColumns: [{
					title: '变更前配置信息',
					key: 'source',
					render: (h, params) => {
						const cpu = h('p', "CPU："+params.row.source.cpuCount+"核");
						const memory = h('p', "内存："+params.row.source.memorySize+"G");
						const netwide = h('p', "网络带宽："+params.row.source.netWide+"M");
						let actArray = [cpu,memory,netwide];
						if(params.row.source.dtos.length>0){
							var dtosArray = params.row.source.dtos;
							for(let i in dtosArray){
								let item = h('p', "磁盘"+dtosArray[i].diskName+"大小："+dtosArray[i].diskSize+"G");
								actArray.push(item);
							}
						};
						return h('div', actArray);
					}
				}],
				changeData: [], //表格数据
      },
      showModal: false,
      auditModal:false,
      // 修改时服务器配置的一些信息
      configInfo:{},
      applyServer:{
        cpuCount:'',
        memorySize:'',
        system:'',
        netScope:'',
        netWide:'',
        gatewayDesc:'',
        sysDisksize:0,
        applyCount: 1,
        disks: [],
      },
      disks: [
        {
          createTime:"",
          diskId:"",
          diskName:"",
          diskPath:"",
          diskSize:"",
          diskType:"",
          id:"",
          serverId:"",
        }
      ],
    }
  },
  mounted () {
    console.log(this.$route.params)
    this.idType = this.$route.params.id;
    this.getUnitData();
    if(this.$route.params.departData){
      this.serverChangeShow = this.$route.params.departData.applyType === '2'
      this.serverData.serverKeyid = this.$route.params.departData.serverKeyid;
    }
    this.servermanagerPageChange(); //查询服务分配变更列表
    this.serverKeyid = this.$route.params.serverKeyid; // 查询历史变更参数
    if(this.$route.params.id != 1){ //1:新建,2:重新提交,3:修改,4:审批,5:处理,6:查看详情
      this.disabled = true;
      this.getApplyManageById();//变更参数，获取数据
    }
    // if(this.$route.params.id == 2)this.disab = true;//重新提交状态不允许编辑
    this.disabled = this.disab;
  },
  methods: {
    emailHandleSearch(value) {//邮箱自动补全
        this.emailData = !value || value.indexOf('@') >= 0 ? [] : [
            value + '@qq.com',
            value + '@sina.com',
            value + '@163.com'
        ];
    },
    getUnitData(){//获取基本单位id
      const vm = this
      api(superviseApiList.findOrgByUser).then((res) => {
          if(res.data.errcode == 0) {
            vm.unitList = res.data.data;
          }else{
              vm.$Message.error(res.data.errmsg);
          }
      }, (error) => {})
    },
    getApplyManageById() { // 查询服务分配管理分页
      this.$refs.configInfo.resetFields()
      api(softhardApiList.getApplyManageById,{id:this.$route.params.departData.id}).then((res) => {
        if(res.data.errcode == 0){
          res.data.data.applyServer.forEach(item => {
            item.netWide = item.netWide;
            if(item.disks.length == 0){
              item.disks.push({diskSize:'',diskName:''});
            }else{
              item.disks.forEach((diskItem,index) => {
                (diskItem.diskType==2) ? diskItem.diskName = '系统盘' : diskItem.diskName = '数据磁盘' + index;
              })
            }
          })
          console.log(res.data.data.applyServer);
          this.tableList.data = res.data.data.applyServer;
          this.configInfo = res.data.data;
          this.configInfo.applyServer = {};
          if(this.configInfo.attachment.length != 0){
            this.configInfo.attachment.forEach(item => {
              item.name = item.fileName;
              item.url = item.fileUrl;
            })
          }
          console.log(this.configInfo.attachment);
        }else{
          this.$Message.error(res.data.errmsg);
        }
      }, (err) => {
        //dong something...
      })
    },
    validForm() {
      this.$refs['configInfo'].validate();
    },
    evalBeforeUpload() { //文件上传前清空
      // this.$refs.evalReport.$children[0].clearFiles();
    },
    setEvalReport(response, file, fileList) {
      if(this.$route.params.id != 3 && this.$route.params.id != 2){ //当不等于修改和重新填写时，附件为空值
        this.configInfo.attachment = [];
      }
      console.log(fileList);
      fileList.forEach(item => {
        let obj = {};
        if(item.response){
          obj.busType = 'hd_applymanage_upload';
          obj.fileName = item.response.data.list[0].submittedFileName;
          obj.fileSize = item.response.data.list[0].size;
          obj.fileType = item.response.data.list[0].mime;
          obj.fileUrl = item.response.data.list[0].url;
          obj.name = item.response.data.list[0].submittedFileName;
          obj.url = item.response.data.list[0].url;
          this.configInfo.attachment = this.arrConcat(this.configInfo.attachment,[obj]);
        }
      });
      console.log(this.configInfo);
      this.validForm();
    },
    removeEvalReport(file, fileList) {
      this.configInfo.attachment = [];
      this.configInfo.attachment = fileList;
      this.validForm();
    },
    // 从服务端获取列表数据
    getList (pageNo, pageSize) {
      console.log(pageNo)
      console.log(pageSize)
    },
    // 操作
    gotoCtrl (type, idx) {
      this.idx = idx;
      // 删除
      if (type === 0) {
        this.isEdit = false;
        this.tableList.data.splice(idx, 1)
      } else {
      // 修改
        this.popModal(true)
        this.isEdit = true;
        const data = JSON.parse(JSON.stringify(this.tableList.data[idx]))
        this.applyServer = {...getConfigInfo(), ...data};
        this.applyServer.cpuCount = this.applyServer.cpuCount.toString();
        this.applyServer.netWide = this.applyServer.netWide.toString();
        this.$refs.serverConfig.getEditData(this.applyServer);
        console.log(this.applyServer);
      }
    },
    // 点击添加按钮
    popModal (isEdit) {
      // 非编辑
      if (isEdit !== true) {
        this.configInfo.applyServer = getConfigInfo()
      }
      this.$refs.serverConfig.reloadFun()
      this.showModal = true
    },
    closeModal(){//关闭模态框
      this.showModal = false;
    },
    applySubmit(name) {
      this.$refs[name].handleSubmit("apply");
    },
    // 添加修改服务器确定按钮
    doAddServer (params) {
      // params.system = params.system.slice(10);
      console.log(params);
      params.disks.forEach((item,idx)=>{
          item.diskName = '数据磁盘' + idx;
          item.diskType = 1;
      })
      params.disks = [...[{diskName:"系统盘",diskSize:params.sysDisksize,diskType:2}],...params.disks];//补充系统盘
      let applyServer = {
        cpuCount:params.cpuCount,
        memorySize:params.memorySize,
        system:params.system.slice(10),//删除ZDWH_czxt_
        netScope:params.netScope,
        netWide:params.netWide,
        gatewayDesc:params.gatewayDesc,
        sysDisksize:params.sysDisksize,
        applyCount: params.applyCount || 0,
        disks:params.disks
      };
      applyServer.disks = this.applyData(params.disks);
      if(!this.isEdit){//判断是否编辑服务器资源配置
        this.tableList.data.push(params);
      }else{
        this.$nextTick(() => {
          this.tableList.data.splice(this.idx, 1, params)
        })
      }
      this.showModal = false;
      console.log(this.tableList.data);
    },
    applyData(data){
      console.log(data);
      // data.splice(0,0, {diskName:'系统盘',diskSize:sysDisksize});//插入系统盘
      // data.splice(1,1);//删除
      data.forEach((item,index) => {
        item.order = index;
      });
      return data
    },
    audit(){//审批事件触发
      this.auditModal = true;
    },
    closeAuditModal(){
      this.auditModal = false;
    },
    auditBtn(){//确定审批
      this.$refs['auditInfo'].validate((valid) => {
          if(valid) {
            this.auditInfo.applyKeyid = this.$route.params.departData.id;
            (this.auditInfo.passFlag == '通过') ? this.auditInfo.passFlag = 1 :this.auditInfo.passFlag = 2;
            console.log(this.auditInfo);
            api(softhardApiList.commApproveSubmit,this.auditInfo).then((res) => {
                console.log(res);
                if(res.data.errcode == 0) {
                  console.log("审批成功");
                  this.$router.go(-1);//返回上一页
                }else{
                    this.$Message.error(res.data.errmsg);
                }
              }, (error) => {})
              this.auditModal = false;
          }else{
            this.$Message.error('表单验证错误！');
          }
      })
    },
    resources(type){//处理事件跳转选择
      switch (type) {
        case 0:
          this.$router.push({//配置资源
            name: 'allocation',
            params: {table:this.tableList.data,departData:this.$route.params.departData}
          })
          break
        case 1://资源不足
          this.$router.push({
            name: 'addApply',
            params:{departData:this.$route.params.departData}
          })
          break
      }
    },
    submit(type,name){//保存申请服务器
      this.$refs[name].validate((valid) => {
        if(valid) {
          this.configInfo.type = type; //提交类型：1仅保存，2提交
          this.configInfo.applyServer = [];
          // this.tableList.data.forEach(item=>{
          //   if(item.system.indexOf('ZDWH_czxt_')==-1){
          //     item.system = 'ZDWH_czxt_' + item.system;//添加ZDWH_czxt_
          //   }
          // });
          if(this.tableList.data.length==0){
            this.$Message.error("申请服务器数据不能为0，请添加后再提交保存！");
            return;
          }
          this.configInfo.applyServer = this.tableList.data;
          // this.configInfo.applyServer.forEach(item => { //删除M
          //   item.netWide = item.netWide.substr(0,item.netWide.length-1);
          // });
          this.unitList.forEach(item => {
            if(item.id == this.configInfo.applyOrgid){
              this.configInfo.applyOrgname = item.name;
            }
          })
          if(this.$route.params.id==3 || this.$route.params.id==2){ //重新填写和修改调用此接口
            // this.configInfo.applyType = (this.$route.params.id == 2) ?  '2' : '1';
            api(softhardApiList.updateApplyManage,this.configInfo).then((res) => {
              console.log(res);
              if(res.data.errcode == 0) {
                this.$router.go(-1);//返回上一页
              }else{
                  this.$Message.error(res.data.errmsg);
              }
            }, (error) => {})
          }else{
            this.configInfo.applyType = this.$route.params.id;
            api(softhardApiList.saveMyApply,this.configInfo).then((res) => {
              console.log(res);
              if(res.data.errcode == 0) {
                this.$router.go(-1);//返回上一页
              }else{
                this.$Message.error(res.data.errmsg);
              }
            }, (error) => {})
          }
        }else{
        }
      })
    },
    quit () {// 取消
      if (this.$route.params.id === 5) {
        this.$router.push({name: 'adminApply'})
      } else {
        this.$router.go(-1)
      } 
    },
    downLoad(url,filename){//下载
      let urlDownload = "/api/file/file/download?url=" + url + "&filename=" + filename;
      window.open(urlDownload);
    },
    // 弹框需要调用的方法
    addDisk (len) {
      let diskItem = {diskSize:'', diskName:''};
      this.disks.push(diskItem);
    },
    handleRemove (idx) {
      this.disks.splice(idx,1);
    },
    arrConcat(arr1,arr2){//数组去重
          let arr = {};
          for(var i=0;i<arr1.length;i++){
              arr[arr1[i].name]=true;
          }
          for (var i = 0; i < arr2.length; i++) {
              if(!arr[arr2[i].name]){
                  arr1.push(arr2[i]);
              }
          };
          return arr1;
      },
      emailChange (val) {
        if (val.length > 26) {
          this.configInfo.applyEmail = ''
          this.$Message.error('限制26个字符以内')
        }
      },
      servermanagerPageChange() { // 查询服务分配变更列表
        var formData = this.serverData
				api(softhardApiList.servermanagerPageChange, formData).then((res) => {
					if(res.status == 200 && res.data.data) {
						this.tableList.changeData = res.data.data;
					}
				}, (err) => {
					this.$Message.error(res.data.errmsg)
				})
			}
  },
  watch: {
    showModal(val) {
      if(!val) {
        this.$refs['serverConfig'].reload();
      }
    }
  }
}
</script>

<style lang='less'>
.server-list{
  span.handle{
    margin: 0 5px;
    display: inline-block;
    cursor: pointer;
    &:hover{
      color: #57a3f3;
    }
  }
}
.upload-list{
  margin-top: 8px;
  .upload-list-file{
    padding: 4px;
    color: #495060;
    border-radius: 4px;
    transition: background-color .2s ease-in-out;
    overflow: hidden;
    position: relative;
    span{
      cursor: pointer;
      transition: color .2s ease-in-out;
      i{
        display: inline-block;
        width: 12px;
        height: 12px;
        color: #495060;
        text-align: center;
      }
    }
    .upload-list-remove{
      opacity: 0;
      font-size: 18px;
      cursor: pointer;
      float: right;
      margin-right: 4px;
      color: #999;
      transition: all .2s ease;
    }
  }
}
.ivu-input-wrapper /deep/ .ivu-input-disabled{
  color:#797979;
}
.ivu-select-single  /deep/ .ivu-select-selection .ivu-select-selected-value{
  color:#797979;
}
</style>
