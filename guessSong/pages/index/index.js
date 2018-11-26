//index.js
//获取应用实例
const app = getApp()
import Base from '../../utils/base.js';
import GetApi from '../../utils/api.js';
import Config from '../../utils/config.js';
import Util from '../../utils/util.js';
const util = new Util();

Page({
  data: {
    imgUrl: Config.Constants.DOMAIN_Img_URL,
    isLoading: false,
    flag: 0, //控制弹框 1 规则
    userInfo: {},
    hasUserInfo: '',
    dataList: {}
  },
  onLoad: function() {
    this.getEquipment();
  },
  onShow: function () {
    this.getAuthorize();
  },
  //根据屏幕获取设备大小
  getEquipment: function(px = 0) {
    const self = this;
    util.getEquipment(function() {
      self.data.title_top = px;

      self.setData(self.data);
    });
  },
  getAuthorize: function() {
    const self = this,
      base = new Base();
    if (wx.getStorageSync('session_id')) {
      this.setData({
        hasUserInfo: true
      })
      self.getData();
    } else {
      base.authorize(self);
    }
  },
  getData: function() {
    const self = this;
    const obj = {
      url: 'song/song_home_page',
      data: {
        session_id: wx.getStorageSync('session_id')
      },
      flag: true,
      self: self
    }
    const api = new GetApi(obj);
    api.getData(function(res) {
      self.data.energy_num = res.data.energy_num;
      self.data.rob_money = res.data.rob_money;
      self.data.lie_money = res.data.lie_money;
      self.data.chance_count = res.data.chance_count;
      self.data.new_user_ret = res.data.new_user_ret;

      //新用户是否领取了红包 1 不能弹，0 弹框
      if (res.data.new_user_ret == 0) {
        self.data.flag = 5;
      }

      self.setData(self.data);
    })
  },
  getUserInfo: function() {
    const self = this,
      base = new Base();
    base.getUserInfo(self, function() {
      self.setData({
        hasUserInfo: true
      })
      self.getData();
    });
  },
  //我的账户
  toUser: function() {
    wx.navigateTo({
      url: '../user/user',
    })
  },
  //猜歌
  toSong: function() {
    // if (this.data.energy_num <= 0) {
    //   wx.showToast({
    //     title: '请获取更多能量在来通关吧~',
    //     icon: 'none'
    //   })
    //   return;
    // }
    wx.navigateTo({
      url: '../../start_song/pages/index/index',
    })
  },
  //躺钱 
  toLying: function() {
    wx.navigateTo({
      url: '../../start_rob_money/pages/lying/lying',
    })
  },
  //抢钱
  toRob: function() {
    wx.navigateTo({
      url: '../../start_rob_money/pages/index/index',
    })
  },
  //规则
  goModel: function(e) {
    const _index = e.currentTarget.dataset.index;
    this.setData({
      flag: _index
    })
  },
  // 关闭model
  close_model: function() {
    this.setData({
      flag: 0
    })
  },
  // 能量页面
  toEnergy: function() {
    wx.navigateTo({
      url: '../energy/energy',
    })
  },
  //领取新人红包
  getRed: function() {
    const self = this;
    const obj = {
      url: 'song/get_red_money',
      data: {
        session_id: wx.getStorageSync('session_id'),
        red_type: 'new'
      },
      flag: false,
      self: self
    }
    const api = new GetApi(obj);
    api.getData(function (res) {
      self.data.flag = 0;
      self.setData(self.data);
    })
  },
  //排行榜
  goRank: function() {
    const self = this;
    const obj = {
      url: 'song/ranking_list',
      data: {},
      flag: false,
      self: self
    }
    const api = new GetApi(obj);
    api.getData(function (res) {
      self.data.dataList = res.ret_data.money_first_list;
      self.data.money_first_list = res.ret_data.money_first_list;
      self.data.fist_first_list = res.ret_data.fist_first_list;
      self.data.boss_first_list = res.ret_data.boss_first_list;

      self.data.flag = 2;

      self.setData(self.data);
    })
  },
  //排行榜导航栏
  goRankNav: function(e) {
    const _index = e.currentTarget.dataset.index;
    if (_index == 1) {
      this.data.dataList = this.data.money_first_list;
    } else if (_index == 2) {
      this.data.dataList = this.data.fist_first_list;
    } else if (_index == 3) {
      this.data.dataList = this.data.boss_first_list;
    }

    this.setData(this.data);
  }
})