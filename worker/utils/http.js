/**
 * http请求
 */
import config from './config.js';

class Http {
  constructor(obj = {}) {
    this.obj = obj;
  }

  /*
  接口请求网络
  参数
  url：请求地址
  data：接口接受参数
  success：请求成功函数
  fail：请求失败函数
  showLoad：是否显示loding加载动画
 */
  request() {
    const {
      url,
      data,
      showLoad = true
    } = this.obj;

    let _time = setTimeout(() => {
      wx.showLoading({
        title: '数据加载中。。',
        mask: true
      });
    }, 2000)
    

    return new Promise((resolve, reject) => {
      wx.request({
        url: config.Constants.DOMAIN_URL + url,
        data: data,
        method: 'post',
        success: function(res) {
          clearTimeout(_time)
          wx.hideLoading();
          console.error(res, ':接口' + url)
          resolve(res.data)
        },
        fail: function(err) {
          reject(new Error(err))
        }
      })
    })
  }
}

export default Http;