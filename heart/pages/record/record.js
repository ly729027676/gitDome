// pages/record/record.js
import Base from '../../utils/base.js'
import config from '../../utils/config.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: config.Constants.DOMAIN_Img_URL,
    dataList: [],
    dataArry: {},
    portrait: '',
    u_name: '',
    qDataLen: 0, //出题长度
    aDataLen: 0, //答题长度
    tabFlag: 0,
    arrLen: 100,
    qnum: 1, //出题记录页数
    anum: 1, //答题记录页数
    flag: 0,
    answer_reget: 1,
    self_reget: 1,
    qindex: [],
    lodingFlag: true, //控制loding动画是否显示
    attention: 0, //1表示从公众号来，0表示不是公众号来
    attention_ret: '', //1表示已关注，0为没关注
    go_origin_img: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.attention) {
      this.setData({
        attention: options.attention
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getData();
  },
  getData: function() {
    const self = this;
    let lodingFlag = '';
    if (self.data.lodingFlag) {
      lodingFlag = true
    } else {
      lodingFlag = false
    }
    const obj = {
      url: 'friend/question_answer_info',
      data: {
        session_id: wx.getStorageSync('session_id'),
        qnum: self.data.qnum,
        anum: self.data.anum,
        attention: self.data.attention,
        versions_num: config.Constants.versions_num
      },
      flag: lodingFlag,
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

      let count = [];
      for (let i = 0; i < res.answer_list.length; i++) {
        if (res.answer_list[i].length == 0) {
          count.push(i)
        } else {
          count.push(100)
        }
      }

      //出题记录
      let qlist = [];
      let alist = [];
      if (self.data.tabFlag == 0) {
        if (self.data.qnum > 1) {
          qlist = self.data.dataList[self.data.tabFlag].concat(res.answer_list[self.data.tabFlag]);
          self.data.dataList[self.data.tabFlag] = qlist;
        } else {
          self.data.dataList = res.answer_list;
        }
        self.data.qDataLen = res.answer_list[self.data.tabFlag].length;
        
      } else {
        if (self.data.anum > 1) {
          alist = self.data.dataList[self.data.tabFlag].concat(res.answer_list[self.data.tabFlag]);
          self.data.dataList[self.data.tabFlag] = alist;
        } else {
          self.data.dataList = res.answer_list;
        }

        self.data.aDataLen = res.answer_list[self.data.tabFlag].length;
      }
      self.data.arrLen = count;
      self.data.attention_ret = res.attention_ret;
      self.data.self_reget = res.self_reget;
      self.data.answer_reget = res.answer_reget;
      self.data.go_origin_img = res.go_origin_img;

      self.setData(self.data)

    }, (err) => {
      console.log(JSON.stringify(err) + '请求失败question_answer_info')
    })
  },
  //答题记录
  setQuestion: function() {
    const self = this;
    const obj = {
      url: 'friend/self_answer_info',
      data: {
        session_id: wx.getStorageSync('session_id')
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
      self.data.dataList = res.answer_list;
      self.setData(self.data)

    }, (err) => {
      console.log(JSON.stringify(err) + '请求失败to_questions')
    })
  },
  toIndex: config.throttle(function() {
    wx.navigateTo({
      url: '../index/index',
    })
  }, 1000),
  //列表选项卡
  goTabSet: function(e) {
    const _index = e.currentTarget.dataset.index;
    this.data.tabFlag = _index;
    this.setData(this.data);
  },
  // 滚动切换标签样式
  switchTab: function(e) {
    this.setData({
      tabFlag: e.detail.current
    });
  },
  //左上角的返回箭头
  toBack: function() {
    wx.navigateBack({
      delta: 1
    })
  },
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh()
  },
  tolower: function() {
    const self = this;
    //出题记录
    setTimeout(function () {
      if (self.data.tabFlag == 0) {
        if (self.data.self_reget == 0) {
          return;
        }
        self.data.qnum = self.data.qnum + 1;
      } else {
        if (self.data.answer_reget == 0) {
          return;
        }
        self.data.anum = self.data.anum + 1;
      }

      self.data.lodingFlag = false;
      self.setData(self.data);
      self.getData();
    }, 100)
    
  },
  //查看此题
  toSeeTopic: config.throttle(function(e) {
    const _index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../see_topic/see_topic?_index=' + _index,
    })
  }, 1000),
  //偷看答案
  toAnswer: function(e) {
    this.setData({
      qindex: []
    })
    let list = e.currentTarget.dataset.list;
    let portrait = e.currentTarget.dataset.portrait;
    let u_name = e.currentTarget.dataset.name;
    let indexArry = e.currentTarget.dataset.index;
    if (this.data.attention_ret == 0) {
      this.data.flag = 1
    } else {
      this.data.flag = 2
      this.data.dataArry = list;
      this.data.portrait = portrait;
      this.data.u_name = u_name;
      for (let i = 0; i < list.length; i++) {
        if (indexArry.join(',').indexOf(list[i].question_id) > -1) {
          this.data.qindex.push(true)
        } else {
          this.data.qindex.push(false)
        }
      }
    }
    this.setData(this.data);
  },
  //关闭弹框
  close: function() {
    this.setData({
      flag: 0
    })
    //this.getData();
  },
  myCatchTouch: function (e) {
    return;
  },

})