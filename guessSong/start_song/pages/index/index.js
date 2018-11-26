const app = getApp();
import Base from '../../../utils/base.js';
import Config from '../../../utils/config.js';
import Util from '../../../utils/util.js';
import GetApi from '../../../utils/api.js';

const util = new Util();
const base = new Base();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ready: true,
    go: false,
    flag: 0,
    countdown: 10
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
    this.startAni();
    this.getEquipment(11);
    this.getPx(19);
    //this.getData();
  },
  onUnload: function () {
    clearTimeout(this.clear01);
    clearTimeout(this.clear02);
    clearTimeout(this.downTimes);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(app.globalData._downTime +":app.globalData._downTime")
    if (app.globalData._downTime > 0) {
      this.goTopic();
    }
  },
  //根据屏幕获取设备大小
  getEquipment: function (px) {
    const self = this;
    util.getEquipment(function () {
      self.data.laoutTop = px;

      self.setData(self.data);
    });
  },
  //开始动画
  startAni: function () {
    const self = this;
    this.clear01 = setTimeout(function () {
      self.setData({
        ready: false,
        go: true,
      })
    }, 1000)

    this.clear02 = setTimeout(function () {
      self.setData({
        ready: false,
        go: false,
      })
      self.downTime();
    }, 2000)
  },
  //是否跳转此题
  goTopic: function () {
    //如果_downTime == 15 代表用户在另外小程序玩过15S
    if (app.globalData._downTime == 15) {
      //换此题逻辑
      console.log('已玩过15S-----------')

      app.globalData._downTime = 0;
    }
  },
  //倒计时
  downTime: function () {
    const self = this;
    let count = 10;
    self.downTimes = setInterval(function () {
      count--;
      if (count < 1) {
        //停止动画
        self.setData({
          stop_ani: true,
          flag: 1
        })
        clearInterval(self.downTimes);
        
        return;
      }

      self.setData({
        countdown: count
      })
    }, 1000)
  },
  getPx: function (px) {
    const self = this;
    util.getEquipment(function () {
      self.data.no_happy = px;

      self.setData(self.data);
    });
  },
  //关闭弹窗
  closeModle: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  //下一题
  goNext: function () {

  },
  //到首页
  toIndex: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  //跳过此题
  goSkip: function () {
    const self = this;
    wx.navigateToMiniProgram({
      appId: 'wx09de797f34671741',
      envVersion: 'develop',
      success: function (res) {
        let downTime = 1;
        self.Interval = setInterval(function () {
          downTime++;
          if (downTime == 15) {
            clearInterval(self.Interval);
            wx.setStorageSync('downTime', downTime);
            return
          }
          wx.setStorageSync('downTime', downTime);
        }, 1000)
        console.log(JSON.stringify(res)+'跳转此题')
      }
    })
  },
  /**
    * 用户点击右上角分享
    */
  onShareAppMessage: function () {
    base.onShareAppMessage(this);
  }
  
})