// pages/invite_friends/invite_friends.js
import Base from '../../utils/base.js'
import config from '../../utils/config.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: {},
    isLoading: false,
    imgUrl: config.Constants.DOMAIN_Img_URL,
    code: '',
    small_portrait: '',
    flag: '',
    iw: 0,
    ih: 0,
    screenw: 0,
    screenH: 0,
    authFlag: false,
    share_ret: 0, // 1是提审，0是没提审
    shareFlag: false,
    isIpx: false,
    user_portrait: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      flag: 0
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onReady: function() {
    this.getShareData();
    this.getPortrait();
    this.getScreenw();
    this.getImageInfo();
    if (!this.data.shareFlag) {
      this.getData();
    }
  },
  //获取头像
  getPortrait: function() {
    const self = this;
    const small_portrait = wx.getStorageSync('small_portrait');
    wx.downloadFile({
      url: self.data.imgUrl + small_portrait,
      success: function(res) {
        self.data.user_portrait = res.tempFilePath;
        self.setData(self.data);
      },
      fail: function() {
        console.log('获取头像失败')
      }
    })
  },
  //获取屏幕宽度
  getScreenw: function() {
    const self = this;
    wx.getSystemInfo({
      success: function(res) {
        const name = 'iPhone X',
          name2 = 'iPhone11';
        if (res.model.indexOf(name) > -1 || res.model.indexOf(name2) > -1) {
          self.data.screenw = res.screenWidth - 32
          self.data.screenH = res.screenHeight - 330;
          self.data.isIpx = true;
        } else {
          self.data.screenw = res.screenWidth - 32
          self.data.screenH = res.screenHeight - 280
        }

        self.setData(self.data)
      }
    })
  },
  getImageInfo: function() {
    const self = this;
    wx.getImageInfo({
      src: '../../static/images/invite_bg.png',
      success: function(res) {
        self.data.iw = res.width;
        self.data.ih = res.height;
        self.setData(self.data);
      }
    })
  },
  getShareData: function() {
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
  getData: function() {
    const self = this;
    const obj = {
      url: 'friend/get_friend_twocode',
      data: {
        session_id: wx.getStorageSync('session_id'),
        question_index: wx.getStorageSync('question_index')
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
      // 1是提审，0是没提审
      if (wx.getStorageSync('switch_ret') == 0) {
        self.data.flag = 1
      } else {
        self.data.flag = 0
      }

      self.data.code = res.path;

      self.setData(self.data)

      self.getGenerate();
    }, (err) => {
      console.log(JSON.stringify(err) + '请求失败get_friend_twocode')
    })
  },
  //canvas渲染
  getGenerate: function() {
    const self = this;
    const ctx = wx.createCanvasContext('poster');

    ctx.drawImage('../../static/images/invite_bg.png', 0, 0, self.data.screenw, self.data.screenH) //画海报
    console.log(self.data.imgUrl + self.data.code)
    wx.downloadFile({
      url: self.data.imgUrl + self.data.code,
      success: function(res) {
        let ix = self.data.screenw * 0.3;
        let iy = self.data.screenH * 0.351;
        let iw = self.data.iw * 0.22;
        let ih = self.data.ih * 0.2;
        ctx.drawImage(res.tempFilePath, ix, iy, iw, ih) //二维码

        //绘制头像
        ctx.save();
        let r = iw * 0.5 / 2.2;
        let d = r * 2;
        let cx = ix + 40;
        let cy = iy + 40;
        ctx.arc(cx + r, cy + r, r, 0, 2 * Math.PI);
        ctx.clip();

        ctx.drawImage(self.data.user_portrait, cx, cy, d, d);
        ctx.restore();

        ctx.draw();
        self.save();
      },
      fail: function(err) {
        console.log('下载图片失败' + JSON.stringify(err))
      }
    })
  },
  save: function() {
    const self = this;
    setTimeout(() => {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: self.data.screenw,
        height: self.data.screenH,
        canvasId: 'poster',
        success: function(res) {
          self.setData({
            saveUrl: res.tempFilePath
          })
        }
      })
    }, 500)
  },
  //保存相册
  savePhoto: config.throttle(function() {
    const self = this;
    wx.saveImageToPhotosAlbum({
      filePath: self.data.saveUrl,
      success(result) {
        wx.showToast({
          title: '已保存至相册'
        })
      },
      fail: function() {
        wx.showToast({
          title: '相册授权才能正常使用',
          icon: 'none'
        })
        self.setData({
          authFlag: true
        })
      }
    })
  }, 1000),
  toOpen: function(res) {
    const self = this;
    if (res.detail.authSetting['scope.writePhotosAlbum']) {
      self.savePhoto();
      self.setData({
        authFlag: true
      })
    }
  },
  //关闭规则按钮
  close: function() {
    this.setData({
      flag: 0
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    this.setData({
      shareFlag: true
    })
    const user_id = wx.getStorageSync('user_id');
    const question_index = wx.getStorageSync('question_index');
    const title = this.data.share_word;
    const user_share = this.data.user_share;
    const nickname = wx.getStorageSync('userInfo').nickName;

    let imageUrl = this.data.share_img;
    if (imageUrl) {
      imageUrl = this.data.imgUrl + imageUrl
    } else {
      imageUrl = ''
    }

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

  },
  //左上角的返回箭头
  toBack: function() {
    wx.navigateBack({
      delta: 1
    })
  },
  toIndex: function() {
    wx.navigateTo({
      url: '../index/index',
    })
  }
})