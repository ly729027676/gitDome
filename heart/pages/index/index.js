//index.js
//获取应用实例
const app = getApp()
import config from '../../utils/config.js'
import Base from '../../utils/base.js'

Page({
  data: {
    imgUrl: config.Constants.DOMAIN_Img_URL,
    userInfo: {},
    hasUserInfo: false,
    userLogin: false,  //用户是否登录
    athFlag: 0, //检测用户在小程序是否删除缓存，1 表示没有授权 2表示有授权但是缓存被清楚，需要重新登陆
    flag: 0,
    recordFlag: false,
    dataList: {},
    copyFlag: 0,
    jump_go_url: '',
    jump_path: '',
    copy_msg: '点击复制'
  },
  onShow: function () {
    this.getMore();
    this.getFriendSwitch();
    if (wx.getStorageSync('session_id')) {
      this.setData({
        userLogin: true,
        userInfo: wx.getStorageSync('userInfo')
      })
    } else {
      this.userAuthorize();
    }
  },
  //获取提审开关
  getFriendSwitch: function () {
    const self = this;
    const obj = {
      url: 'friend/friend_switch',
      data: {
        versions_num: config.Constants.versions_num
      },
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

      wx.setStorageSync('switch_ret', res.switch_ret);

    }, (err) => {
      console.log(JSON.stringify(err) + '请求失败friend_switch')
    })
  },
  //获得更多好玩的数据
  getMore: function () {
    const self = this;
    const obj = {
      url: 'friend/get_jump_url',
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

      self.data.jump_go_url = res.jump_go_url;
      self.data.jump_path = res.jump_path;
      self.setData(self.data)

    }, (err) => {
      console.log(JSON.stringify(err) + '请求失败get_jump_url')
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
      self.setData({
        userLogin: true,
        userInfo: wx.getStorageSync('userInfo')
      })
    }, self)
  },
  //开始出题
  toDraw: config.throttle(function () {
    wx.navigateTo({
      url: '../draw/draw',
    })
  }, 1000),
  //我的记录
  toRecord: config.throttle(function () {
    wx.navigateTo({
      url: '../record/record',
    })
  }, 1000),
  //联系客服
  toService: config.throttle(function () {
    const self = this;
    const obj = {
      url: 'friend/online_service',
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
      self.data.dataList = res.online_service_list;
      self.setData(self.data)

      self.setData({
        flag: 2
      })

    }, (err) => {
      console.log(JSON.stringify(err) + '请求失败to_questions')
    })
    
  }, 1000),
  //打开规则
  goRule: function () {
    this.setData({
      flag: 1
    })
  },
  //关闭规则按钮
  close: function () {
    this.setData({
      flag: 0
    })
  },
  goCopy: function (e) {
    const self = this;
    const data = e.currentTarget.dataset.num;
    const _index = e.currentTarget.dataset.index;
    wx.setClipboardData({
      data: data,
      success: function (res) {
        self.setData({
          copyFlag: _index,
          copy_msg01: '复制成功'
        })
      }
    })
  }
  
})
