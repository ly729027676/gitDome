// pages/see_topic/see_topic.js
import Base from '../../utils/base.js'
import config from '../../utils/config.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoading: false,
    dataList: {},
    imgUrl: config.Constants.DOMAIN_Img_URL,
    _index: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options._index) {
      this.setData({
        _index: options._index
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getShareData();
    this.getData();
  },
  getData: function () {
    const self = this;
    const obj = {
      url: 'friend/show_user_questions',
      data: {
        session_id: wx.getStorageSync('session_id'),
        questions_index: self.data._index
      },
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
      self.data.dataList = res.user_questions;
      self.setData(self.data)

    }, (err) => {
      console.log(JSON.stringify(err) + '请求失败to_questions')
    })
  },
  getShareData: function () {
    const self = this;
    const obj = {
      url: 'friend/share_handel',
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

      self.data.share_word = res.share_word;
      self.data.share_img = res.share_img;
      self.data.user_share = res.user_share;

      self.setData(self.data);

    }, (err) => {
      console.log(JSON.stringify(err) + '请求失败share_handel')
    })
  },
  //左上角的返回箭头
  toBack: function () {
    wx.navigateBack({
      delta: 1
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    const user_id = wx.getStorageSync('user_id');
    const question_index = this.data._index;

    const title = this.data.share_word;
    const user_share = this.data.user_share;
    const nickname = wx.getStorageSync('userInfo').nickName;

    let imageUrl = this.data.share_img;
    if (imageUrl) {
      imageUrl = this.data.imgUrl + imageUrl
    } else {
      imageUrl = ''
    }
    console.log(imageUrl)

    //表示是否显示@名字，1是要0是不要
    if (user_share == 1) {
      return {
        title: nickname + '@我, ' + title,
        path: `/pages/share/share?question_user_id=${user_id}&question_index=${question_index}`,
        imageUrl: imageUrl
      }
    } else {
      return {
        title: title,
        path: `/pages/share/share?question_user_id=${user_id}&question_index=${question_index}`,
        imageUrl: imageUrl
      }
    }
  }
})