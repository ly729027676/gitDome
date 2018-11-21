import config from '../../../utils/config.js'
import Base from '../../../utils/base.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoading: false,
    imgUrl: config.Constants.DOMAIN_Img_URL,
    faceObj: {},
    indexFlag: '',
    authFlag: false,
    isSava: '',
    size: 16
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.user_id && options.img_index && options.index) {
      if (wx.getStorageSync('user_id') != options.user_id) {
        wx.reLaunch({
          url: '../../../pages/index/index',
        })
        return;
      }
      this.data.indexFlag = options.indexFlag;
      this.data.user_id = options.user_id;
      this.data.img_index = options.img_index;
      this.data.index = options.index;
    }
    if (options.img_index && options.index && options.showFlag) {
      this.data.img_index = options.img_index;
      this.data.index = options.index;
      this.data.indexFlag = 1;
    }

    this.data.isLoading = true;
    this.data.share_button = wx.getStorageSync('share_button');
    this.data.code_switch = wx.getStorageSync('code_switch');
    this.setData(this.data);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // this.getScreenw();
    this.getCavasImg();
    this.getShare();
    this.getData();
  },
  onHide: function() {
    const self = this;
    setTimeout(function() {
      self.getShare();
    }, 1000)
  },
  getData: function() {
    const self = this;

    const obj = {
      url: 'face/face_upgrades_check',
      data: {
        img_index: self.data.img_index,
        gender: self.data.index,
        session_id: wx.getStorageSync('session_id')
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

      self.data.jump_url = res.jump_url;
      self.data.jump_path = res.jump_path;
      self.data.jump_img = res.jump_img;
      self.data.faceObj = res.face_upgrades_check_dict;

      self.setData(self.data);
      self.getTemperament(res.face_upgrades_check_dict.temperament_img);
      self.getImgPath(res.face_upgrades_check_dict.img_path)
      self.getCode(res.face_code);

    }, (err) => {
      console.log(JSON.stringify(err) + '请求失败face_upgrades_check')
    })
  },
  getCode: function(code) {
    const self = this;
    wx.downloadFile({
      url: self.data.imgUrl + code,
      success: function(res) {
        setTimeout(function () {
          self.getGenerate(res.tempFilePath);
        }, 400)
      },
      fail: function() {
        console.log('获取图片失败')
      }
    })
  },
  getTemperament: function(img) {
    const self = this;
    wx.downloadFile({
      url: self.data.imgUrl + img,
      success: function(res) {
        self.data.temperament_img = res.tempFilePath
        self.setData(self.data);
      },
      fail: function() {
        console.log('获取图片失败')
      }
    })
  },
  getImgPath: function(img) {
    const self = this;
    wx.downloadFile({
      url: self.data.imgUrl + img,
      success: function(res) {
        self.data.face_img_path = res.tempFilePath
        self.setData(self.data);
      },
      fail: function() {
        console.log('获取图片失败')
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
          self.data.screenw = res.screenWidth * 0.847;
          self.data.screenH = res.screenHeight * 0.61;
          self.data.ipX_top = self.data.cavansH * 0.89;
          self.data.btn_top = 81;
          self.data.result_top = 7;
        } else {
          self.data.screenw = res.screenWidth * 0.847;
          self.data.screenH = res.screenHeight * 0.75;
          self.data.ipX_top = self.data.cavansH * 0.858;
        }

        self.setData(self.data)
      }
    })
  },
  getCavasImg: function() {
    const self = this;
    wx.getImageInfo({
      src: '../../../static/images/canvas_bg.png',
      success: function(res) {
        console.log(JSON.stringify(res))
        self.setData({
          cavansW: res.width,
          cavansH: res.height
        })
        self.getScreenw();
      }
    })
  },
  //canvas渲染
  getGenerate: function(face_code) {
    const self = this;
    const ctx = wx.createCanvasContext('poster');
    const user_name = '姓名：'+wx.getStorageSync('user_name');

    ctx.drawImage('../../../static/images/canvas_bg.png', 0, 0, self.data.screenw, self.data.screenH) //画海报
    //报告单数量
    ctx.save();
    ctx.setFillStyle('#31d5ff')
    ctx.font = 'normal bold 12px normal';
    ctx.setTextAlign('left');
    ctx.fillText(self.data.faceObj.report_num_word, (320 - ctx.measureText(self.data.faceObj.report_num_word).width) / 2 * 1.8, self.data.screenH * 0.035)
    ctx.restore();

    ctx.save();
    ctx.setFillStyle('#31d5ff')
    ctx.font = 'normal bold 12px normal';
    ctx.setTextAlign('left');
    ctx.fillText(user_name, (320 - ctx.measureText(user_name).width) / 2 * 1.8, self.data.screenH * 0.145)
    ctx.restore();

    //绘制气质类型
    let tx = self.data.screenw * 0.05;
    let ty = self.data.screenH * 0.87;
    let tw = self.data.screenw * 0.3;
    let th = self.data.screenH * 0.09;
    ctx.drawImage(self.data.temperament_img, tx, ty, tw, th);

    //绘制头像
    let r = self.data.screenw * 0.2165;
    let d = r * 2;
    let ux = self.data.screenw * 0.064;
    let uy = self.data.screenH * 0.178;
    ctx.save();
    ctx.beginPath();
    ctx.arc(ux + r, uy + r, r, 0, 2 * Math.PI);
    ctx.clip();
    ctx.drawImage(self.data.face_img_path, ux, uy, d, d);
    ctx.restore();

    console.log(self.data.faceObj.seal_word + ':self.data.faceObj.seal_word')
    //图案类似印章
    ctx.save();
    ctx.setFillStyle('#ffffff')
    ctx.font = 'normal bold 16px normal';
    ctx.fillText(self.data.faceObj.seal_word, self.data.screenw * 0.575, self.data.screenH * 0.195)
    ctx.restore();

    //颜值，年龄，脸型
    ctx.save();
    ctx.setFillStyle('#ffffff')
    ctx.font = 'normal bold 22px normal';
    ctx.fillText(self.data.faceObj.beauty, self.data.screenw * 0.66, self.data.screenH * 0.27)
    ctx.fillText(self.data.faceObj.age, self.data.screenw * 0.75, self.data.screenH * 0.34)
    ctx.fillText(self.data.faceObj.face_type, self.data.screenw * 0.59, self.data.screenH * 0.415)
    ctx.restore();


    //脸，五官，综合描述
    ctx.save();
    ctx.setFillStyle('#ffffff')
    ctx.font = 'normal bold 14px normal';
    ctx.fillText('脸：' + self.data.faceObj.face_word, self.data.screenw * 0.155, self.data.screenH * 0.535)

    let features = '五官：' + self.data.faceObj.heent_word,
      features1 = '',
      features2 = '';
    if (features.length > self.data.size) {
      features1 = features.substr(0, self.data.size);
      features2 = features.substr(self.data.size);
      ctx.fillText(features1, self.data.screenw * 0.155, self.data.screenH * 0.59)
      ctx.fillText(features2, self.data.screenw * 0.155, self.data.screenH * 0.623)
    } else {
      ctx.fillText(features, self.data.screenw * 0.155, self.data.screenH * 0.623)
    }

    let describe = '综合描述：' + self.data.faceObj.complex_word,
      describe1 = '',
      describe2 = '';
    if (describe.length > self.data.size) {
      describe1 = describe.substr(0, self.data.size);
      describe2 = describe.substr(self.data.size);
      ctx.fillText(describe1, self.data.screenw * 0.155, self.data.screenH * 0.675)
      ctx.fillText(describe2, self.data.screenw * 0.155, self.data.screenH * 0.71)
    } else {
      ctx.fillText(describe, self.data.screenw * 0.155, self.data.screenH * 0.71)
    }
    ctx.restore();

    //超过用户百分比
    ctx.save();
    ctx.setFillStyle('#ff005a')
    ctx.font = 'normal bold 23px normal';
    ctx.fillText(self.data.faceObj.face_kill + '%', self.data.screenw * 0.5, self.data.screenH * 0.775)
    ctx.restore();

    if (self.data.code_switch == 0) {
      //绘制二维码
      let cx = self.data.screenw * 0.65;
      let cy = self.data.screenH * 0.795;
      let cw = self.data.screenw * 0.27;
      let ch = self.data.screenH * 0.173;
      ctx.drawImage(face_code, cx, cy, cw, ch);
    }

    ctx.draw();

    self.setData({
      isLoading: false,
      isSava: true
    })

    self.save();
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
        self.setData({
          isSava: false
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
  toIndex: function() {
    if (this.data.indexFlag == 1) {
      wx.navigateBack({
        delta: 2
      })
    } else {
      wx.reLaunch({
        url: '../../../pages/index/index',
      })
    }
  },
  getShare: function() {
    const self = this;
    const obj = {
      url: 'face/upgrades_share_handel',
      data: {
        img_index: self.data.img_index
      },
      flag: false,
      self: self
    }
    const base = new Base(obj);
    base.request().then((res) => {
      if (res.ret != 0) {
        wx.showToast({
          title: res.errmsg,
          icon: 'none'
        })
        return
      }
      self.data.share_word = res.share_word;
      self.data.user_share = res.user_share;
      self.data.share_img = res.share_img;
      self.setData(self.data);

    }, (err) => {
      console.log(JSON.stringify(err) + '请求失败share_random')
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    const self = this;
    const nickname = wx.getStorageSync('userInfo').nickName;
    const user_id = wx.getStorageSync('user_id');
    const indexFlag = 2

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
        path: `/appearanceLevelTest/pages/result/result?user_id=${user_id}&img_index=${self.data.img_index}&index=${self.data.index}&indexFlag=${indexFlag}`,
        imageUrl: imageUrl
      }
    } else {
      return {
        title: self.data.share_word,
        path: `/appearanceLevelTest/pages/result/result?user_id=${user_id}&img_index=${self.data.img_index}&index=${self.data.index}&indexFlag=${indexFlag}`,
        imageUrl: imageUrl
      }
    }
  }
})