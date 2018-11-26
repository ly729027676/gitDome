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

    flag && self.setData({
      isLoading: true
    })

    return new Promise((resolve, reject) => {
      wx.request({
        url: config.Constants.DOMAIN_URL + url,
        data: data,
        success: function(res) {
          flag && self.setData({
            isLoading: false
          })
          resolve(res.data)
        },
        fail: function(err) {
          flag && self.setData({
            isLoading: false
          })
          reject(new Error(err))
        }
      })
    })
  }


  /*
  用户登陆接口
  参数
  fn：回调函数
  self：this
  
 */
  login(fn, self) {
    wx.login({
      success: function(res) {
        if (res.code) {
          const code = res.code;
          wx.getUserInfo({
            withCredentials: true,
            success: res => {
              let boss_user = '';
              if (wx.getStorageSync('boss_user')) {
                boss_user = wx.getStorageSync('boss_user');
              }

              app.globalData.userInfo = res.userInfo;
              wx.setStorageSync('userInfo', res.userInfo);
              const data = {
                code: code,
                nickName: res.userInfo.nickName,
                avatarUrl: res.userInfo.avatarUrl,
                gender: res.userInfo.gender,
                encryptedData: res.encryptedData,
                iv: res.iv,
                boss_user: boss_user
              }

              const obj = {
                url: 'song/song_login',
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
                wx.setStorageSync("openid", res.ret_dict.openid);

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

  /*
  判断用户是否授权
  参数
  fn：回调函数
  self：this
  
 */
  authorize(self) {
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          //没授权逻辑
          self.setData({
            hasUserInfo: false,
            userLogin: false,
            athFlag: 1
          })
        } else {
          wx.authorize({
            scope: 'scope.userInfo',
            success(res) {
              if (wx.getStorageSync('session_id')) {
                self.setData({
                  userLogin: true
                })
              } else {
                self.setData({
                  hasUserInfo: false,
                  userLogin: false,
                  athFlag: 2
                })
              }
            }
          })
        }
      }
    })
  }

  //用户没有授权
  getUserInfo(self, fn) {
    const _that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          //没授权逻辑
          self.setData({
            hasUserInfo: false
          })
        } else {
          wx.authorize({
            scope: 'scope.userInfo',
            success(res) {
              wx.getUserInfo({
                success: res => {
                  _that.login(fn, self);
                }
              })
            }
          })
        }
      }
    })
  }

  //分享
  getShare(self) {
    const obj = {
      url: 'face/upgrades_share_handel',
      data: {
        img_index: self.data.img_index
      },
      flag: false,
      self: self
    }
    const base = new Base(obj);
    base.request().then((res) => {
      if (res.ret != 0) {
        wx.showToast({
          title: res.errmsg,
          icon: 'none'
        })
        return
      }
      self.data.share_word = res.share_word;
      self.data.user_share = res.user_share;
      self.data.share_img = res.share_img;
      self.setData(self.data);

    }, (err) => {
      console.log(JSON.stringify(err) + '请求失败share_random')
    })
  }

  /**
    * 用户点击右上角分享
    */
  onShareAppMessage(self) {
    const nickname = wx.getStorageSync('userInfo').nickName;
    const user_id = wx.getStorageSync('user_id');

    let imageUrl = self.data.share_img;
    if (imageUrl) {
      imageUrl = self.data.imgUrl + imageUrl
    } else {
      imageUrl = ''
    }
    //表示是否显示@名字，1是要0是不要
    if (self.data.user_share == 1) {
      return {
        title: nickname + '@我, ' + self.data.share_word,
        path: '/pages/index/index',
        imageUrl: imageUrl
      }
    } else {
      return {
        title: self.data.share_word,
        path: '/pages/index/index',
        imageUrl: imageUrl
      }
    }
  }

}

  export default Base