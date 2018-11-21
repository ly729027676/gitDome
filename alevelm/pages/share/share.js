// pages/share/share.js
import Base from '../../utils/base.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag: 1,
    switchFlag: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //this.getData();
    // if (wx.getStorageSync('backPage')) {
    //   setTimeout(function () {
    //     wx.navigateBack({
    //       delta: 1
    //     })
    //   }, 100)
    //   wx.removeStorageSync('backPage')
    // }
  },
  getData: function () {
    const self = this;
    const obj = {
      url: 'face/share_switch',
      data: {},
      flag: true,
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

      self.setData({
        switchFlag: res.switch
      })
    }, (err) => {
      console.log(JSON.stringify(err) + '请求失败face_check')
    })
  },
  toResult: function () {
    setTimeout(function () {
      wx.navigateTo({
        url: '../facecheck/facecheck',
      })
    },100)
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    const self = this;
    if (res.from == "button") {
      return {
        title: '在看脸的世界里，想知道你的颜值有多高吗？',
        path: `/pages/index/index`,
        imageUrl: '../../static/images/share_bg.png'
      }
    }
  }
})