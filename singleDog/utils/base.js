//获取应用实例
const app = getApp()
import config from './config.js'

class Base {
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
  falg：是否显示loding加载动画
 */
  request() {
    const {
      url,
      data,
      flag,
      self
    } = this.obj;

    flag && self.setData({ isLoading: true })

    return new Promise((resolve, reject) => {
      wx.request({
        url: config.Constants.DOMAIN_URL + url,
        data: data,
        success: function (res) {
          flag && self.setData({ isLoading: false })
          resolve(res.data)
        },
        fail: function (err) {
          reject(new Error(err))
        }
      })
    })
  }


  login(fn, self) {
    wx.login({
      success: function (res) {
        if (res.code) {
          const code = res.code;
          wx.getUserInfo({
            withCredentials: true,
            success: res => {
              app.globalData.userInfo = res.userInfo;
              wx.setStorageSync('userInfo', res.userInfo);
              const data = {
                code: code,
                nickName: res.userInfo.nickName,
                gender: res.userInfo.gender,
                avatarUrl: res.userInfo.avatarUrl,
              }

              const obj = {
                url: 'single/single_login',
                data: data,
                flag: false,
                self: self
              }

              const base = new Base(obj);
              base.request().then((res) => {
                console.log(JSON.stringify(res))
                if (res.ret != 0) {
                  wx.showToast({
                    title: res.errmsg,
                    icon: 'none'
                  })
                  return
                }

                wx.setStorageSync("session_id", res.ret_dict.session_id);
                wx.setStorageSync("user_id", res.ret_dict.user_id);
                
                fn && fn();

              }, (err) => {
                console.error(err + ':请求失败(single_login)')
              })

            }
          })
        }
      }
    })
  }

  route(url) {
    wx.navigateTo({
      url: url,
    })
  }
}

export default Base