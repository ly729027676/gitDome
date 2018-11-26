import Util from '../../../utils/util.js';
import Base from '../../../utils/base.js';
import Config from '../../../utils/config.js';
import GetApi from '../../../utils/api.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoading: false,
    flag: 0,
    imgUrl: '',
    isLoading: false,
    showSubPackages: true,
    showNav: 2,
    fist_count: 0,
    dataList: {},
    _date: {
      m: '00',
      s: '00'
    },
    show_worker_list: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  onUnload: function () {
    console.log('22222222222222')
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setImg();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
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
      url: 'song/fist_page',
      data: {
        session_id: wx.getStorageSync('session_id')
      },
      flag: true,
      self: self
    }
    const api = new GetApi(obj);
    api.getData(function (res) {
      self.data.fist_count = res.ret_data.fist_count;
      self.data.ttime = res.ret_data.ttime;
      self.data.dataList = res.ret_data;

      if (res.ret_data.worker_list_ret) {
        self.data.show_worker_list = 1
      } else {
        self.data.show_worker_list = 2
      }

      self.setData(self.data);

      self.getTime();
    })
  },
  //拳头倒计时增加
  getTime: function () {
    const self = this;
    //self.data.ttime
    let _time = 4 * 60 * 1000;
    if (_time < 0) {
      return;
    }
    
    const util = new Util();
    util.getTime(_time, function (obj) {
      //4分钟倒计时结束重新执行倒计时，拳头数量增加，一直到10停止
      if (self.data.fist_count == 10) {
        return;
      }
      if (obj.leftTime < 0) {
        self.data.fist_count = self.data.fist_count + 1;
        self.getTime();
      }
      
      self.data._date = obj;
      self.setData(self.data);
    })

  },
  // 跳转躺钱页面
  toLying: function () {
    wx.navigateTo({
      url: '../lying/lying',
    })
  },
  //跳转通知页面
  toNotice: function () {
    wx.navigateTo({
      url: '../notice/notice',
    })
  },
  //单人抢钱
  goHandel: function (e) {
    const worker_id = e.currentTarget.dataset.userid, self = this;
    const obj = {
      url: 'song/fist_handel',
      data: {
        session_id: wx.getStorageSync('session_id'),
        worker_id: worker_id
      },
      flag: true,
      self: self
    }
    const api = new GetApi(obj);
    api.getData(function (res) {
      self.data.flag = 1;
      if (res.fist_money == 0) {
        self.data.all_msg = 'TA没钱';
      } else {
        self.data.all_msg = '已抢';
      }

      self.setData(self.data);

      self.getData();
    })
  },
  //领取
  goInvite: function (e) {
    const new_user_id = e.currentTarget.dataset.userid;
    const self = this;
    const obj = {
      url: 'song/get_invite_award',
      data: {
        session_id: wx.getStorageSync('session_id'),
        new_user_id: new_user_id
      },
      flag: true,
      self: self
    }

    const api = new GetApi(obj);
    api.getData(function (res) {
      wx.showToast({
        title: '领取成功',
        icon: 'success'
      })
    })
  },
  //一键抢钱
  getFistAllHandel: function () {
    const self = this;
    const obj = {
      url: 'song/fist_all_handel',
      data: {
        session_id: wx.getStorageSync('session_id')
      },
      flag: true,
      self: self
    }

    const api = new GetApi(obj);
    api.getData(function (res) {
      self.data.flag = 1;
      self.data.all_msg = `成功抢了${res.ret_dict.fist_man_count}个好友，共抢到${res.ret_dict.all_fist_money}元`;

      self.setData(self.data);

      self.getData();
    })
  },
  //关闭弹框
  close_modle: function () {
    this.setData({
      flag: 0
    })
  },
  //分享
  getShare: function () {
    const base = new Base(), self = this;
    base.getShare(self);
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    const base = new Base();
    base.onShareAppMessage(this)
  }
})