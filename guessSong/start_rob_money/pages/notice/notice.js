import Config from '../../../utils/config.js';
import GetApi from '../../../utils/api.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: '',
    showNav: 1,
    fist_count: 0,
    dataList: {}
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
    
    this.getData();
  },
  setImg: function () {
    this.setData({
      imgUrl: Config.Constants.DOMAIN_Img_URL
    })
  },
  getData: function () {
    const self = this;
    const obj = {
      url: 'song/inform_page',
      data: {
        session_id: wx.getStorageSync('session_id')
      },
      flag: true,
      self: self
    }

    const api = new GetApi(obj);
    api.getData(function (res) {
      self.data.dataList = res.ret_data.inform_list;

      self.setData(self.data);
    })
  },
  toLying: function () {
    wx.navigateTo({
      url: '../lying/lying',
    })
  },
  toIndex: function () {
    wx.navigateTo({
      url: '../index/index',
    })
  },
  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})