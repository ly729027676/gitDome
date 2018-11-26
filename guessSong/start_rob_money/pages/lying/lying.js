Page({

  /**
   * 页面的初始数据
   */
  data: {
    showNav: 3
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getScreenw();
  },
  //获取屏幕宽度
  getScreenw: function () {
    const self = this;
    wx.getSystemInfo({
      success: function (res) {
        const name = 'iPhone X', name2 = 'iPhone11';
        if (res.model.indexOf(name) > -1 || res.model.indexOf(name2) > -1) {
          self.data.isIpx = true;

        } else {
          self.data.isIpx = false;
        }

        self.setData(self.data)
      }
    })
  },
  toIndex: function () {
    wx.navigateTo({
      url: '../index/index',
    })
  },
  //跳转通知页面
  toNotice: function () {
    wx.navigateTo({
      url: '../notice/notice',
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})