// pages/share/share.js
import config from '../../utils/config.js'
import Base from '../../utils/base.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    back: 1,
    myLogin: '',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    user_nike: '',
    oldNike: '',
    user_date: '请选择出生年份',
    userLogin: false, //用户是否登录
    athFlag: 0, //检测用户在小程序是否删除缓存，1 表示没有授权 2表示有授权但是缓存被清楚，需要重新登陆
    isLoading: true,
    imgUrl: config.Constants.DOMAIN_Img_URL,
    name_index: '',
    authFlag: false,
    user_id: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getMore();
    //分享链接进来的
    if (options.check_name && options.user_id) {
      if (wx.getStorageSync('user_id') == options.user_id) {
        this.data.myLogin = 1;
        this.data.check_name = options.check_name;
        this.data.user_id = options.user_id;
        this.setData(this.data);
        this.getScreenw();
        this.getImageInfo();
        this.getData();
      } else {
        this.data.myLogin = 2;
        if (wx.getStorageSync('session_id')) {
          this.setData({
            userLogin: true,
            userInfo: wx.getStorageSync('userInfo'),
            user_nike: wx.getStorageSync('userInfo').nickName
          })
        } else {
          this.userAuthorize();
        }
        this.data.back = 2;
        this.data.check_name = options.check_name;
        this.setData(this.data);
      }
    }

    //识别二维码进来
    if (options.scene) {
      var scene = decodeURIComponent(options.scene);
      scene = scene.split(",");
      const name_index = scene[0].split(':')[1];
      const v = scene[1].split(':')[1];
      const user_id = scene[2].split(':')[1];
      if (wx.getStorageSync('user_id') == user_id) {
        this.data.myLogin = 1;
        this.data.name_index = name_index;
        this.data.user_id = user_id;

        this.setData(this.data);
        this.getScreenw();
        this.getImageInfo();
        this.getData();
      } else {
        this.data.myLogin = 2;
        if (wx.getStorageSync('session_id')) {
          this.setData({
            userLogin: true,
            userInfo: wx.getStorageSync('userInfo'),
            user_nike: wx.getStorageSync('userInfo').nickName
          })
        } else {
          this.userAuthorize();
        }
        this.data.name_index = name_index;
        this.data.back = 2;
        this.setData(this.data);
      }
    }
  },
  onHide: function() {
    this.getShare(this.data.check_name);
  },
  getMore: function() {
    const self = this;
    const obj = {
      url: 'single/jump_move_handel',
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
      self.data.jump_url = res.jump_url;
      self.data.jump_path = res.jump_path;
      self.setData(self.data);
    }, (err) => {
      console.log(JSON.stringify(err) + '请求失败jump_move_handel')
    })
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
      console.log(self.data.user_nike.length + ':self.data.user_nike.length')
      if (self.data.user_nike.length <= 0) {
        self.data.user_nike = wx.getStorageSync('userInfo').nickName;
      }
      self.data.userLogin = true;
      self.data.userInfo = wx.getStorageSync('userInfo');
      self.setData(self.data);
    }, self)
  },
  //获取用户名字
  getUserNike: function(e) {
    let newNike = e.detail.value;
    if (this.fucCheckLength(newNike) > 30) {
      this.setData({
        user_nike: this.data.oldNike
      })
    } else {
      this.setData({
        user_nike: newNike,
        oldNike: newNike
      })
    }
  },
  //检验字节长度
  fucCheckLength: function(strTemp) {
    let i, sum;
    sum = 0;
    for (i = 0; i < strTemp.length; i++) {
      if ((strTemp.charCodeAt(i) >= 0) && (strTemp.charCodeAt(i) <= 255)) {
        sum = sum + 1;
      } else {
        sum = sum + 2;
      }
    }
    return sum;
  },
  //选择年份
  bindDateChange: function(e) {
    this.setData({
      user_date: e.detail.value
    })
  },
  toSingDog: function() {
    if (this.data.user_nike.length <= 0) {
      wx.showToast({
        title: '请输入名字',
        icon: 'none'
      })
      return
    }
    if (this.data.user_date === '请选择出生年份') {
      wx.showToast({
        title: '请选择年份',
        icon: 'none'
      })
      return
    }
    const user_nike = this.data.user_nike;
    const user_date = this.data.user_date;
    wx.navigateTo({
      url: '../singDog_test/singDog_test?user_nike=' + user_nike + '&user_date=' + user_date,
    })
  },
  //获取头像
  getPortrait: function(portrait) {
    const self = this;
    wx.downloadFile({
      url: self.data.imgUrl + portrait,
      success: function(res) {
        self.data.portrait = res.tempFilePath;
        self.setData(self.data);
        self.getSingleImg1(self.data.single_img_dict);
      },
      fail: function() {
        console.log('获取头像失败')
      }
    })
  },
  getSingleImg1: function(img) {
    const self = this;
    wx.downloadFile({
      url: self.data.imgUrl + img,
      success: function(res) {
        self.data.single_img1 = res.tempFilePath;
        self.setData(self.data);
        self.getSingleImg2(self.data.code_word);
      },
      fail: function() {
        console.log('获取图片失败SingleImg1')
      }
    })
  },
  getSingleImg2: function(img) {
    const self = this;
    wx.downloadFile({
      url: self.data.imgUrl + img,
      success: function(res) {
        self.data.code_word = res.tempFilePath;
        self.data.isLoading = false;
        self.setData(self.data);
        self.getGenerate();
      },
      fail: function() {
        console.log('获取图片失败SingleImg2')
      }
    })
  },
  //获取屏幕宽度
  getScreenw: function() {
    const self = this;
    wx.getSystemInfo({
      success: function(res) {
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
  getImageInfo: function() {
    const self = this;
    wx.getImageInfo({
      src: '../../static/images/sing_test01.png',
      success: function(res) {
        self.data.iw = res.width;
        self.data.ih = res.height;
        self.setData(self.data);
      }
    })
  },
  getData: function() {
    const self = this;
    self.setData({
      isLoading: true
    })
    const obj = {
      url: 'single/check_result',
      data: {
        session_id: wx.getStorageSync('session_id'),
        user_id: self.data.user_id,
        year: self.data.user_date,
        check_name: self.data.check_name,
        name_index: self.data.name_index,
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
      // self.getSingleImg1(res.check_dict.single_img_dict);
      // self.getSingleImg2(res.check_dict.code_word);
      self.getShare(res.check_dict.check_name);

    }, (err) => {
      console.log(JSON.stringify(err) + '请求失败check_result')
    })
  },
  //canvas渲染
  getGenerate: function() {
    const self = this;
    const ctx = wx.createCanvasContext('poster');

    ctx.drawImage('../../static/images/sing_test01.png', 0, 0, self.data.screenw, self.data.screenH) //画海报

    wx.downloadFile({
      url: self.data.imgUrl + self.data.code_img,
      success: function(res) {

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
        self.setData({
          isLoading: false
        })
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
  toBack: function() {
    wx.navigateBack({
      delta: 1
    })
  },
  toIndex: function() {
    wx.navigateTo({
      url: '../index/index',
    })
  },
  getShare: function(check_name) {
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
  onShareAppMessage: function() {
    const self = this;

    const nickname = wx.getStorageSync('userInfo').nickName;
    const user_id = self.data.user_id;

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