import Base from '../../../utils/base.js';
import Config from '../../../utils/config.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
  getData: function () {
    const self = this;
    const obj = {
      url: 'song/money_detail_show',
      data: {
        session_id: wx.getStorageSync('session_id')
      },
      flag: true,
      self: self
    }
    const base = new Base(obj);
    base.request().then((res) => {
      console.log(JSON.stringify(res));
      if (res.ret != 0) {
        wx.showToast({
          title: res.errmsg,
          icon: 'none'
        })
        return
      }
      self.data.dataList = res.data;

      self.setData(self.data);

    }, (err) => {
      console.log(JSON.stringify(err) + '请求失败money_detail_show')
    })
  },

  
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },
})