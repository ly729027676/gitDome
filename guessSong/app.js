//app.js
App({
  onLaunch: function () {
  },
  onShow: function (options) {
    //打开另一个小程序返回来接受的参数
    if (options.referrerInfo.appId) {
      const downTime = wx.getStorageSync('downTime');
      this.globalData._downTime = downTime;
    }
  },
  globalData: {
    userInfo: null,
    _downTime: 0
  }
})