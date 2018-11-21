// pages/singDog_test/singDog_test.js
import config from '../../utils/config.js'
import Base from '../../utils/base.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: {},
    isLoading: true,
    imgUrl: config.Constants.DOMAIN_Img_URL,
    name_index: '',
    authFlag: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.user_nike && options.user_date) {
      this.data.user_nike = options.user_nike;
      this.data.user_date = options.user_date;
    }

    this.setData(this.data);
    this.getScreenw();
    this.getImageInfo();
    this.getData();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onReady: function () {
    
  },
  onHide: function () {
    this.getShare(this.data.check_name);
  },
  //获取头像
  getPortrait: function (portrait) {
    const self = this;
    wx.downloadFile({
      url: self.data.imgUrl + portrait,
      success: function (res) {
        self.data.portrait = res.tempFilePath;
        self.setData(self.data);
        self.getSingleImg1(self.data.single_img_dict);
      },
      fail: function () {
        console.log('获取头像失败')
      }
    })
  },
  getSingleImg1: function (img) {
    const self = this;
    wx.downloadFile({
      url: self.data.imgUrl + img,
      success: function (res) {
        self.data.single_img1 = res.tempFilePath;
        self.setData(self.data);
        self.getSingleImg2(self.data.code_word);
      },
      fail: function () {
        console.log('获取图片失败SingleImg1')
      }
    })
  },
  getSingleImg2: function (img) {
    const self = this;
    wx.downloadFile({
      url: self.data.imgUrl + img,
      success: function (res) {
        self.data.code_word = res.tempFilePath;
        self.data.isLoading = false;
        self.setData(self.data);

        self.getGenerate();
      },
      fail: function () {
        console.log('获取图片失败SingleImg1')
      }
    })
  },
  //获取屏幕宽度
  getScreenw: function () {
    const self = this;
    wx.getSystemInfo({
      success: function (res) {
        const name = 'iPhone X';
        if (res.model.indexOf(name) > -1) {
          self.data.screenw = res.screenWidth - 30
          self.data.screenH = res.screenHeight * 0.7;
          self.data.isIpx = true;
        } else {
          self.data.screenw = res.screenWidth - 30
          self.data.screenH = res.screenHeight * 0.7
        }

        self.setData(self.data)
      }
    })
  },
  getImageInfo: function () {
    const self = this;
    wx.getImageInfo({
      src: '../../static/images/sing_test01.png',
      success: function (res) {
        self.data.iw = res.width;
        self.data.ih = res.height;
        self.setData(self.data);
      }
    })
  },
  getData: function () {
    const self = this;
    self.setData({
      isLoading: true
    })
    const obj = {
      url: 'single/check_result',
      data: {
        session_id: wx.getStorageSync('session_id'),
        year: self.data.user_date,
        check_name: self.data.user_nike,
        versions_num: config.Constants.versions_num
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
      self.data.code_img = res.check_dict.code_img;
      self.data.code_switch = res.code_switch;
      self.data.share_switch = res.share_switch;
      self.data.user_name = res.check_dict.user_name;
      self.data.check_name = res.check_dict.check_name;
      self.data.love_year = res.check_dict.love_year;
      self.data.name_index = res.check_dict.name_index;
      self.data.single_img_dict = res.check_dict.single_img_dict
      self.data.code_word = res.check_dict.code_word;
      
      self.setData(self.data);

      self.getPortrait(res.check_dict.portrait);
      // self.getSingleImg1(self.data.single_img_dict);
      // self.getSingleImg2(self.data.code_word);
      self.getShare(self.data.check_name);

    }, (err) => {
      console.log(JSON.stringify(err) + '请求失败check_result')
    })
  },
  //canvas渲染
  getGenerate: function () {
    const self = this;
    const ctx = wx.createCanvasContext('poster');

    ctx.drawImage('../../static/images/sing_test01.png', 0, 0, self.data.screenw, self.data.screenH) //画海报
   
    wx.downloadFile({
      url: self.data.imgUrl + self.data.code_img,
      success: function (res) {
        
        if (self.data.code_switch == 0) {
          let ix = self.data.screenw * 0.8;
          let iy = self.data.screenH * 0.85;
          let iw = self.data.screenw * 0.155;
          let ih = self.data.screenH * 0.11;
          ctx.drawImage(res.tempFilePath, ix, iy, iw, ih) //二维码

          let dx = self.data.screenw * 0.48;
          let dy = self.data.screenH * 0.88;
          let dw = self.data.screenw * 0.3;
          let dh = self.data.screenH * 0.08;
          ctx.drawImage(self.data.code_word, dx, dy, dw, dh); //二维码描述
        }
      
        let sx = self.data.screenw * 0.05;
        let sy = self.data.screenH * 0.3;
        let sw = self.data.screenw * 0.89;
        let sh = self.data.screenH * 0.15;
        ctx.drawImage(self.data.single_img1, sx, sy, sw, sh); //单身原因

        

        //绘制头像
        let r = self.data.screenw * 0.155 * 0.8;
        let d = r * 2;
        let cx = self.data.screenw * 0.05;
        let cy = self.data.screenH * 0.06;
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx + r, cy + r, r, 0, 2 * Math.PI);
        ctx.clip();
        ctx.drawImage(self.data.portrait, cx, cy, d, d);
        ctx.restore();

        //绘制年份
        ctx.save();
        ctx.setFillStyle('#2b2a2a')
        ctx.font = 'normal bold 28px normal';
        ctx.fillText(self.data.love_year, self.data.screenw * 0.59, self.data.screenH * 0.797)
        ctx.restore();

        //绘制姓名
        ctx.save();
        ctx.setFillStyle('#44494d')
        ctx.font = 'normal bold 22px normal';
        ctx.fillText('@' + self.data.user_name, self.data.screenw * 0.35, self.data.screenH * 0.11)
        ctx.restore();

        ctx.draw();
       
        self.save();
      },
      fail: function (err) {
        console.log('下载图片失败' + JSON.stringify(err))
      }
    })
  },
  save: function () {
    const self = this;
    setTimeout(() => {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: self.data.screenw,
        height: self.data.screenH,
        canvasId: 'poster',
        success: function (res) {
          self.setData({
            saveUrl: res.tempFilePath
          })
        }
      })
    }, 500)
  },
  //保存相册
  savePhoto: config.throttle(function () {
    const self = this;
    wx.saveImageToPhotosAlbum({
      filePath: self.data.saveUrl,
      success(result) {
        wx.showToast({
          title: '已保存至相册'
        })
      },
      fail: function () {
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
  toOpen: function (res) {
    const self = this;
    if (res.detail.authSetting['scope.writePhotosAlbum']) {
      self.savePhoto();
      self.setData({
        authFlag: true
      })
    }
  },
  toBack: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  toIndex: function () {
    wx.navigateTo({
      url: '../index/index',
    })
  },
  getShare: function (check_name) {
    const self = this;

    const obj = {
      url: 'single/share_handel',
      data: {
        session_id: wx.getStorageSync('session_id'),
        check_name: check_name
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

      self.data.share_img = res.share_img;
      self.data.share_word = res.share_word;
      self.data.user_share = res.user_share;
      self.setData(self.data);

    }, (err) => {
      console.log(JSON.stringify(err) + '请求失败face_check')
    })
  },
  onShareAppMessage: function () {
    const self = this;
    
    const nickname = wx.getStorageSync('userInfo').nickName;
    const user_id = wx.getStorageSync('user_id');

    let imageUrl = self.data.share_img;
    if (imageUrl) {
      imageUrl = self.data.imgUrl + imageUrl
    } else {
      imageUrl = ''
    }

    //表示是否显示@名字，1是要0是不要
    if (self.data.user_share == 1) {
      return {
        title: nickname + '@我, ' + self.data.share_word,
        path: `/pages/share/share?check_name=${self.data.check_name}&user_id=${user_id}`,
        imageUrl: imageUrl
      }
    } else {
      return {
        title: self.data.share_word,
        path: `/pages/share/share?check_name=${self.data.check_name}&user_id=${user_id}`,
        imageUrl: imageUrl
      }
    }
  }
})