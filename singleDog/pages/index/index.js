//index.js
//获取应用实例
const app = getApp()
import config from '../../utils/config.js'
import Base from '../../utils/base.js'

Page({
  data: {
    back: 2,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    user_nike: '',
    oldNike: '',
    user_date: '请选择出生年份',
    userLogin: false,  //用户是否登录
    athFlag: 0, //检测用户在小程序是否删除缓存，1 表示没有授权 2表示有授权但是缓存被清楚，需要重新登陆
  },
  onLoad: function () {
    this.getMore();
    if (wx.getStorageSync('session_id')) {
      this.setData({
        userLogin: true,
        userInfo: wx.getStorageSync('userInfo'),
        user_nike: wx.getStorageSync('userInfo').nickName
      })
    } else {
      this.userAuthorize();
    }
  },
  getMore: function () {
    const self = this;
    const obj = {
      url: 'single/jump_move_handel',
      data: {},
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
      self.data.jump_url = res.jump_url;
      self.data.jump_path = res.jump_path;
      self.setData(self.data);
    }, (err) => {
      console.log(JSON.stringify(err) + '请求失败jump_move_handel')
    })
  },
  userAuthorize: function () {
    const self = this;
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
  },
  //判断用户有没有授权
  getUserInfo: function (e) {
    const self = this;
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
                  self.login();
                }
              })
            }
          })
        }
      }
    })
  },
  login: function () {
    const self = this;
    const base = new Base();
    base.login(function () {
      if (self.data.user_nike.length <= 0) {
        self.data.user_nike = wx.getStorageSync('userInfo').nickName;
      }
      self.data.userLogin = true;
      self.data.userInfo = wx.getStorageSync('userInfo');
      self.setData(self.data);
    }, self)
  },
  //获取用户名字
  getUserNike: function (e) {
    let newNike = e.detail.value;
    if (this.fucCheckLength(newNike) > 30) {
      this.setData({
        user_nike: this.data.oldNike
      })
    } else {
      this.setData({
        user_nike: newNike,
        oldNike: newNike
      })
    }
  },
  //检验字节长度
  fucCheckLength: function (strTemp) {
    let i, sum;
    sum = 0;
    for (i = 0; i < strTemp.length; i++) {
      if ((strTemp.charCodeAt(i) >= 0) && (strTemp.charCodeAt(i) <= 255)) {
        sum = sum + 1;
      } else {
        sum = sum + 2;
      }
    }
    return sum;
  },
  //选择年份
  bindDateChange: function (e) {
    this.setData({
      user_date: e.detail.value
    })
  },
  toSingDog: function () {
    if (this.data.user_nike.length <= 0) {
      wx.showToast({
        title: '请输入名字',
        icon: 'none'
      })
      return
    }
    if (this.data.user_date === '请选择出生年份') {
      wx.showToast({
        title: '请选择年份',
        icon: 'none'
      })
      return
    }
    const user_nike = this.data.user_nike;
    const user_date = this.data.user_date;
    wx.navigateTo({
      url: '../singDog_test/singDog_test?user_nike=' + user_nike + '&user_date=' + user_date,
    })
  }
})
