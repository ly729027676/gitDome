//app.js
// import Http from "./utils/http";
// import config from "./utils/config";
// import touch from './utils/touch.js'
import Global from './utils/global.js'
import cache from './utils/cache.js'

App({
  onLaunch: function() {
    this.getPhoneIp()
  },
  globalHandler: Global,
  cache: cache,
  //获取手机IP
  getPhoneIp: function () {
    const self = this

    wx.request({  // 获取ip
      url: 'http://ip-api.com/json',
      success: function (e) {
        cache.phoneIp = e.data.query
      }
    })
  },
  globalData: {
    userInfo: null
  },
})