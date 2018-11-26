import { Constants } from '@/utils/config.js'
import axios from 'axios'
import { Loading, MessageBox, Message } from 'element-ui';
import Qs from 'qs'

//var loading = ''

var instance = axios.create({
	baseURL: Constants.DOMAIN_URL,
	transformRequest: [function(data) {
		return Qs.stringify(data)
	}],
	withCredentials: true,
});

//http request 拦截器
instance.interceptors.request.use(
	config => {
		return config;
	},
	error => {
		return Promise.reject(err);
	}
);

//http response 拦截器
instance.interceptors.response.use(
	response => {
		return response;
	},
	error => {
		return Promise.reject(error)
	}
)

/**
 * 封装get方法
 * @param url
 * @param params
 * @returns {Promise}
 */

export function fetch(url, params = {}, loading) {
	if (loading) {myLoading()}
	
	return new Promise((resolve, reject) => {
		instance.get(url, {	
				params: params
			})
			.then(response => {
				resolve(response.data);
				
				if (loading) {closeLoading()}
			})
			.catch(err => {
				reject(err)
			})
	})
}

/**
 * 封装消息弹窗方法
 * @param self
 * @param showClose
 * @param message
 * @param type
 * @returns {Promise}
 */
export function myMessage(self, showClose, message, type) {
	self.$message({
		showClose: showClose,
		message: message,
		type: type
	})
}

/**
 * 封装请求网络loading加载
 * @param self
 */
export function myLoading() {
	Loading.service({ fullscreen: true });
}

/**
 * 封装关闭请求网络loading加载
 * @param self
 */
export function closeLoading() {
	let loadingInstance = Loading.service({ fullscreen: true });
	loadingInstance.close();
}

/**
 * 封装数组去重
 * @param fileImg
 */
export function dedupe(fileImg) {
	return Array.from(new Set(fileImg))
}

/**
 * 封装弹框
 * @param msg          提示信息
 * @param title        提示语
 * @param message      消息框的信息
 * @param callback     确定回调函数
 * @param errCallBack  取消回调函数
 */
export function messageBox(msg, title, message='删除成功!', callback, errCallBack) {
	MessageBox.confirm(msg, title,  {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      center: true
    }).then(() => {
      callback && callback()
      
      Message.success({
        type: 'success',
        message: message
      });
    }).catch(() => {
      errCallBack && errCallBack()
      
      Message.success({
        type: 'info',
        message: '已取消删除'
      });
    });
}
