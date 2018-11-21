// pages/draw.js
import Base from '../../utils/base.js'
import config from '../../utils/config.js'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoading: false,
    dataList: {},
    drawList: [],
    imgUrl: config.Constants.DOMAIN_Img_URL,
    _index: 0,  //更换题目下标
    _number: 1, //答案的数量
    chatFlagA: '',
    chatFlagB: '',
    small_portrait: '',
    questionsArr: [],
    userLogin: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onReady: function () {
    
  },
  getData: function () {
    const self = this;
    const obj = {
      url: 'friend/to_questions',
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
      let resultA = self.getChat(res.question_id_list[self.data._index].resultA)
      let resultB = self.getChat(res.question_id_list[self.data._index].resultB)
      resultA ? self.data.chatFlagA = false : self.data.chatFlagA = true
      resultB ? self.data.chatFlagB = false : self.data.chatFlagB = true

      self.data.drawList = res.question_id_list;
      self.data.dataList = res.question_id_list[self.data._index];
      self.data.small_portrait = res.small_portrait;
      self.setData(self.data)

    }, (err) => {
      console.log(JSON.stringify(err) + '请求失败to_questions')
    })
  },
  goNext: function () {
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
  goResult: config.throttle(function (e) {
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
      //把选择的答案从总体库中删掉
      this.data.drawList.splice(index, 1);

      obj[question_id] = result;

      this.data.questionsArr.push(obj);
      
      this.setData(this.data);

      this.setQuestions(this.data.questionsArr);
    } else {
      //答题数量
      this.data._number = num + 1;
      //把选择的答案从总体库中删掉
      this.data.drawList.splice(index,1);

      obj[question_id] = result;

      this.data.questionsArr.push(obj);
      this.setData(this.data);
      this.goNext();
    }
    
  }, 500),
  //提交答案
  setQuestions: function () {
    const self = this;
    console.log(JSON.stringify(self.data.questionsArr))
    const obj = {
      url: 'friend/user_set_questions',
      data: {
        questions_list: self.data.questionsArr,
        session_id: wx.getStorageSync('session_id'),
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
      wx.setStorageSync('question_index', res.questions_index)
      
      wx.navigateTo({
        url: '../invite_friends/invite_friends',
      })
      //把获取到得formid传给后端，前端的formid全部清除重新获取在发送
      app.globalData.formId = [];
      setTimeout(function () {
        self.setData({
          _number: 1,
          questionsArr: []
        })
      }, 200)
    }, (err) => {
      console.log(JSON.stringify(err) + '请求失败user_set_questions')
    })
  },
  //答案文字是否超过13个字符
  getChat: function (name) {
    if (name.length > 12) {
      return true
    } else {
      return false
    }
  },
  //左上角的返回箭头
  toBack: function () {
    wx.navigateBack({
      delta: 1
    })
  },
})