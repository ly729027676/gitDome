// pages/share/share.js
import Base from '../../utils/base.js'
import config from '../../utils/config.js'
const app = getApp()
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
    drawList: [],
    _index: 0, //更换题目下标
    _number: 1, //答案的数量
    chatFlagA: '',
    chatFlagB: '',
    small_portrait: '',
    questionsArr: [],
    back: 1,
    question_user_id: '',
    question_index: 0,
    userFlag: '', //判断是自己从分享点击还是其他点击
    userLogin: false, //用户是否登录
    athFlag: 0, //检测用户在小程序是否删除缓存，1 表示没有授权 2表示有授权但是缓存被清楚，需要重新登陆
    lodingFlag: true, //控制loding动画是否显示
    attention: 0, //1表示从公众号来，0表示不是公众号来
    attention_ret: '', //1表示已关注，0为没关注
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //识别二维码进来
    if (options.scene) {
      var scene = decodeURIComponent(options.scene);
      scene = scene.split(",");
      let question_user_id = scene[0].split(':')[1];
      let question_index = scene[1].split(':')[1];


      //出题者user_id, 题目ID
      this.data.question_user_id = question_user_id;
      this.data.question_index = question_index;


      if (question_user_id == wx.getStorageSync('user_id')) {
        //自己从分享链接点进来的
        this.data.userFlag = 1
      } else {
        this.data.userFlag = 0
      }


      this.setData(this.data);
    }

    //分享链接进来
    if (options.question_user_id && options.question_index) {
      //出题者user_id, 题目ID
      this.data.question_user_id = options.question_user_id;
      this.data.question_index = options.question_index;


      if (options.question_user_id == wx.getStorageSync('user_id')) {
        //自己从分享链接点进来的
        this.data.userFlag = 1
      } else {
        this.data.userFlag = 0
      }

      this.setData(this.data);
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (wx.getStorageSync('session_id')) {
      this.setData({
        userLogin: true,
        userInfo: wx.getStorageSync('userInfo')
      })
      if (this.data.userFlag == 1) {
        this.getDataRecord();
      } else {
        this.getData();
      }
    } else {
      this.userAuthorize();
    }

    

  },
  userAuthorize: function() {
    const self = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          //没授权逻辑
          self.setData({
            hasUserInfo: false,
            userLogin: false,
            athFlag: 1
          })
        } else {
          wx.authorize({
            scope: 'scope.userInfo',
            success(res) {
              if (wx.getStorageSync('session_id')) {
                self.setData({
                  userLogin: true
                })
              } else {
                self.setData({
                  hasUserInfo: false,
                  userLogin: false,
                  athFlag: 2
                })
              }
            }
          })
        }
      }
    })
  },
  //判断用户有没有授权
  getUserInfo: function(e) {
    const self = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          //没授权逻辑
          self.setData({
            hasUserInfo: false
          })
        } else {
          wx.authorize({
            scope: 'scope.userInfo',
            success(res) {
              wx.getUserInfo({
                success: res => {
                  self.login();
                }
              })
            }
          })
        }
      }
    })
  },
  login: function() {
    const self = this;
    const base = new Base();
    base.login(function() {
      self.setData({
        userLogin: true,
        userInfo: wx.getStorageSync('userInfo')
      })
      if (self.data.userFlag == 1) {
        self.getDataRecord();
      } else {
        self.getData();
      }
    }, self)
  },
  getData: function() {
    const self = this;
    const obj = {
      url: 'friend/to_answer_question',
      data: {
        question_user_id: self.data.question_user_id,
        question_index: self.data.question_index
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

      let resultA = self.getChat(res.ret_question[self.data._index].resultA)
      let resultB = self.getChat(res.ret_question[self.data._index].resultB)
      resultA ? self.data.chatFlagA = false : self.data.chatFlagA = true
      resultB ? self.data.chatFlagB = false : self.data.chatFlagB = true

      self.data.drawList = res.ret_question;
      self.data.dataList = res.ret_question[self.data._index];
      self.data.small_portrait = res.small_portrait;

      self.setData(self.data);

    }, (err) => {
      console.log(JSON.stringify(err) + '请求失败face_check')
    })
  },
  goNext: function() {
    const self = this;
    let index = self.data._index + 1;

    //判断用户选择换提是否超过题目总数量
    if (index > self.data.drawList.length - 1) {
      index = 0
    }
    let resultA = self.getChat(self.data.drawList[index].resultA);
    let resultB = self.getChat(self.data.drawList[index].resultB);
    resultA ? self.data.chatFlagA = false : self.data.chatFlagA = true
    resultB ? self.data.chatFlagB = false : self.data.chatFlagB = true

    self.data._index = index;
    self.data.dataList = self.data.drawList[index];

    self.setData(self.data);

  },
  //用户选择答案
  goResult: config.throttle(function(e) {
    const formId = e.detail.formId;
    let formData = {
      formId: formId,
      expire: new Date().getTime() + 60480000 // 7天后的过期时间戳
    }
    app.globalData.formId.unshift(formData);

    let obj = {};
    const question_id = e.detail.target.dataset.id;
    const result = e.detail.target.dataset.result;
    const num = this.data._number;
    const index = this.data._index;

    if (this.data._number == 10) {
      this.data.drawList.splice(index, 1);

      obj[question_id] = result;

      this.data.questionsArr.push(obj);
      this.setData(this.data);

      this.setQuestions(this.data.questionsArr);
      
    } else {
      //答题数量
      this.data._number = num + 1;
      //把选择的答案从总体库中删掉
      this.data.drawList.splice(index, 1);

      obj[question_id] = result;

      this.data.questionsArr.push(obj);
      this.setData(this.data);
      this.goNext();
    }

  }, 500),
  //提交答案
  setQuestions: function() {
    const self = this;
    const obj = {
      url: 'friend/answer_question',
      data: {
        answer: self.data.questionsArr,
        session_id: wx.getStorageSync('session_id'),
        question_user_id: self.data.question_user_id,
        question_index: self.data.question_index,
        user_formid_list: app.globalData.formId
      },
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

      wx.setStorageSync('questionsList', res.ret_dict);
      self.setData({
        questionsArr: []
      })
      wx.reLaunch({
        url: '../answer/answer',
      })
      
    }, (err) => {
      console.log(JSON.stringify(err) + '请求失败user_set_questions')
    })
  },

  //答案文字是否超过13个字符
  getChat: function(name) {
    if (name.length > 12) {
      return true
    } else {
      return false
    }
  },
  toBack: config.throttle(function() {
    wx.navigateTo({
      url: '../index/index',
    })
  }, 1000),
  //我的记录
  getDataRecord: function() {
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
      //console.log(JSON.stringify(res))
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
  toIndex: function() {
    wx.navigateBack({
      delta: 1
    })
  },
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
      self.getDataRecord();
    }, 100)
  },
  //查看此题
  toSeeTopic: function(e) {
    const _index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../see_topic/see_topic?_index=' + _index,
    })
  },
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
  goAccount: function() {
    const self = this;
    const obj = {
      url: 'friend/attention',
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

    }, (err) => {
      console.log(JSON.stringify(err) + '请求失败attention')
    })
  }
})