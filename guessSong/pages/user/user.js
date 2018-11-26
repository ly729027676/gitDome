// pages/user/user.js
import Base from '../../utils/base.js';
import Config from '../../utils/config.js';
import GetApi from '../../utils/api.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoading: false,
    imgUrl: Config.Constants.DOMAIN_Img_URL,
    dataList: {}
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getData();
  },
  getData: function () {
    const self = this;
    const obj = {
      url: 'song/self_page',
      data: {
        session_id: wx.getStorageSync('session_id')
      },
      flag: true,
      self: self
    }
    const api = new GetApi(obj);
    api.getData(function (res) {
      self.data.dataList = res.ret_dict;
      self.setData(self.data);
    })
  },
  //提取现金
  toWithdrawal: function () {
    wx.navigateTo({
      url: '../../user_personal/pages/deposit/deposit',
    })
  },
  //跳转能量页面
  toEnergy: function () {
    wx.navigateTo({
      url: '../energy/energy',
    })
  }
})