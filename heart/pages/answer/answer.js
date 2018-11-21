// pages/answer/answer.js
import Base from '../../utils/base.js'
import config from '../../utils/config.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: {},
    back: 2,
    flag: 0,
    imgUrl: config.Constants.DOMAIN_Img_URL,
    dataArry: []
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
    this.getData();
  },
  getData: function () {
    this.setData({
      dataList: wx.getStorageSync('questionsList')
    })
    const obj = this.data.dataList.user_questions;
    const similar_index_list = this.data.dataList.similar_index_list;
    for (let i = 0; i < obj.length;i++) {
      if (similar_index_list.join(',').indexOf(obj[i].question_id) > -1) {
        this.data.dataArry.push(true)
      }else {
        this.data.dataArry.push(false)
      }
    }
    this.setData(this.data);
  },
  //偷看答案
  goDraw: function () {
    this.setData({
      flag: 1
    })
  },
  //关闭弹框
  close: function () {
    this.setData({
      flag: 0
    })
  },
  toIndex: function () {
    wx.navigateTo({
      url: '../index/index',
    })
  },
})