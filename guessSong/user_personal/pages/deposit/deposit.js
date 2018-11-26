Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag: 0,
    money: 1.01,
    amount: ''
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
    
  },
  //提现
  goDeposit: function () {
    if (this.data.money < 1) {
      wx.showToast({
        title: '金额满1元才可以提现哟~',
        icon: 'none'
      })
      return;
    }

    if (this.data.amount == '') {
      wx.showToast({
        title: '请输入提现金额',
        icon: 'none'
      })
      return;
    }

    if (this.data.amount > this.data.money) {
      wx.showToast({
        title: '提现金额不能大于现有金额',
        icon: 'none'
      })
      return;
    }

    this.setData({
      flag: 1
    })
  },
  //提现记录
  toRecode: function () {
    wx.navigateTo({
      url: '../recode/recode',
    })
  },
  //获取输入的提现金额
  getInput: function (e) {
    const _money = e.detail.value;
    this.setData({
      amount: _money
    })
  },
  //跳转客服页面
  toService: function () {
    wx.navigateTo({
      url: '../service/service',
    })
  },
  close_model: function () {
    this.setData({
      flag: 0
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})