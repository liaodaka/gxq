/**
 * axiosApi封装，接口属于mock，可以修改 author：liuguangrui
 */
/* eslint-disable */
// import axios from 'axios'
// import qs from 'qs'
import store from '@/store'
import '@static/login'
// 请求拦截器配置


function toLoginUI(){
	  loginController.toLoginOut()
}
function loginTimeoutCheck(){
  var currentDatetime = new Date().getTime();
  var next_time_out = localStorage.getItem("login_time_out");
  var update_next_time_out = new Date().getTime() + 30*60*1000;
  if(!next_time_out){

    localStorage.setItem("login_time_out",update_next_time_out+"");
    return true;
  } else {
    next_time_out = parseFloat(next_time_out);
    if(currentDatetime > next_time_out){
      localStorage.removeItem("login_time_out");
      toLoginUI();
      return false;
    } else {

      localStorage.setItem("login_time_out",update_next_time_out+"");
      return true;
    }
  }
}


axios.interceptors.request.use(config => {
    return config
}, error => {
    return Promise.reject(error)
})

/* 超时处理 start */
/**
 * uuid
 * 
 * @returns {string}
 */
function getUuid() {
  return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}
function S4() {
  return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}
// 错误返回
var apiArr = new Map()
function times (id){
  if (apiArr.size > 0){
    store.state.isShowMask = true;
  }
}
function addTime(id) {
  if (apiArr.has(id)){
    apiArr.delete(id)
    // delete eval(apiArr)[id]
    if (apiArr.size === 0) {
      store.state.isShowMask = false;
    }
  } else {
    apiArr.set(id, true)
  }
}
function initTime(id) {
  addTime(id)
  window.clearInterval(timeController)
  timeController = window.setInterval(times, 500);
}
var timeController

/* 超时处理 end */

// 返回拦截器配置
axios.interceptors.response.use(response => {
	if(response.data.errcode == '-9999'){// 已退出登陆
		loginController.emptyLoginUserInfo();
		loginController.loginFlow();
	}
	if(response.data && response.data.data && response.data.data.total){
		response.data.data.total = Number(response.data.data.total);
	}
    return response
}, error => {
    return Promise.resolve(error.response)
})

// 错误返回
function errorState(response) {
    // 加入loading
    // 如果http状态码正常，则直接返回数据
    if (response && response.data.errcode == 0) {
        return response
    // token过期失效码，重新向安卓请求
    } else if (response && (response.data["errcode"] == 40001 || response.data["errcode"] == 40003 || response.data["errcode"] == 40005)) {
        store.commit('GETUSERINFO');// 重新获取userId和token
        store.state.alertText = response.data.msg;
        store.state.isAlert = true;
    } else {
        store.state.alertText = res.data.msg || '网络异常，请检查网络后重试！';
        store.state.isAlert = true;
    }

}
// 成功后返回
function successState(res) {
    // 加入loading
    // 统一判断后端返回的错误码
    if (res.data.errcode != 0 && res.data.errcode != '0') {
        store.state.alertText = res.data.msg || '网络异常，请检查网络后重试！';
        store.state.isAlert = true;
    }
}

// http请求
const httpServer = (opts, data) => {
	var userInfo = loginController.getLoginUserInfo();
    userInfo.userId = userInfo.userid;
    let HYtimestamp = (new Date()).getTime();
    let Public = { // 公共参数
        'HYtimestamp': HYtimestamp
        // userId: userInfo.userId,
        // token: userInfo.token,
        // unitId: userInfo.unitId
    }
// store.dispatch('openLoading')
    // store.dispatch('openLoading');
    let httpDefaultOpts = { // http默认配置
        method: opts.method,
        baseURL:'/',
        url: opts.url,
        timeout: 10000,
        params: Object.assign(Public, data),
        data: Object.assign(Public, data),
        headers: opts.method == 'get' ? { // 配置请求头数据
            'X-Requested-With': 'XMLHttpRequest',
            "Accept": "application/json",
            "Content-Type": "application/json; charset=UTF-8",
            "token": userInfo.token
        } : {
                '_user_id': userInfo.userId,
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': opts.contentType || 'application/json',
                "token": userInfo.token
            }
    }
    let notTimeout = loginTimeoutCheck();
    if(!notTimeout){
    	return false;
    }
    //
    if (opts.method == 'get' || opts.method == 'delete') {
        delete httpDefaultOpts.data
    } else {
        httpDefaultOpts.url = httpDefaultOpts.url + '?HYtimestamp=' + HYtimestamp
        if (opts.contentType){// 判断post请求条件下是否有设置contentType
            delete httpDefaultOpts.data
        }else{
            delete httpDefaultOpts.params
        }
    }

    var id = getUuid()
    initTime(id)
    let promise = new Promise((resolve, reject) => {
        axios(httpDefaultOpts).then(res => {
            addTime(id)
            if (res === undefined){
              return
            }
            successState(res)
            resolve(res)
// store.dispatch('closeLoading', false);
        }).catch(response => {
            if (response.data["errcode"] == 40001 || response.data["errcode"] == 40003 || response.data["errcode"] == 40005) {
                store.commit('GETUSERINFO');// 重新获取userId和token
                return
            }
            errorState(response)
            reject(response)
// store.dispatch('closeLoading');
        })
    })
    return promise
}

export default httpServer
