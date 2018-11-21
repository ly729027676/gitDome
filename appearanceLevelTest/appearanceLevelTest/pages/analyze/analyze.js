import config from '../../../utils/config.js'
import Base from '../../../utils/base.js'
var clearTimeout1 = '', clearTimeout2 = '', clearTimeout3 = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: config.Constants.DOMAIN_Img_URL,
    isLoading: false,
    result_msg: false,
    animationData: {},
    animationData2: {},
    animationData3: {},
    animationData4: {},
    cx: '',
    cy: '',
    aniFlag: true,
    showAni: true,
    showFail: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.img_index && options.index) {
      this.setData({
        img_index: options.img_index,
        index: options.index
      })
    }

    this.getScreenw();
    this.getData();
  },
  onUnload: function () {
    //页面离开关闭还没有执行完的定时器,是动画还原
    clearTimeout(clearTimeout1);
    clearTimeout(clearTimeout2);
    clearTimeout(clearTimeout3);
    let num = 7;
    for (let i = 1; i < 8; i++) {
      this.initData([i]);
    }
  },
  onReady: function () {
    
  },
  getData: function () {
    const self = this;
    self.setData({
      result_msg: true
    })
    const obj = {
      url: 'face/face_upgrades_shape',
      data: {
        img_index: self.data.img_index
      },
      flag: false,
      self: self
    }
    const base = new Base(obj);
    base.request().then((res) => {
      console.log(JSON.stringify(res));
      if (res.ret != 0) {
        wx.showToast({
          title: res.errmsg,
          icon: 'none'
        })
        return
      }

      if (res.face_shape_dict.succee == 0) {
        self.setData({
          aniFlag: false,
          result_msg: false,
          showFail: true
        })

        setTimeout(function () {
          self.setData({
            showFail: false
          })
        }, 3000)

        return
      }
      self.data.aniFlag = true;
      self.data.face_shape_dict = res.face_shape_dict;
      self.setData(self.data);
      self.getImages(res.face_shape_dict.img_path);

      clearTimeout1 = setTimeout(function () {
        self.setData({
          result_msg: ''
        })
      }, 6800);
      self.anition(7000, 1);
      self.anition(8000, 2);
      self.anition(9000, 3);
      self.anition(10000, 4);

      self.getTime(1300, 1);
      self.getTime(2300, 2);
      self.getTime(3300, 3);

      clearTimeout2 = setTimeout(function () {
        wx.navigateTo({
          url: '../result/result?img_index=' + self.data.img_index + '&index=' + self.data.index+'&showFlag=1',
        })
      }, 15000)

    }, (err) => {
      console.log(JSON.stringify(err) + '请求失败face_upgrades_shape')
    })
  },
  getTime: function (delay, key) {
    const self = this;
    if (key == 1) {
      setTimeout(function () {
        self.setData({
          show_eye: true
        })
      }, delay);
    } else if (key == 2) {
      setTimeout(function () {
        self.setData({
          show_eye2: true
        })
      }, delay);
    } else if (key == 3) {
      setTimeout(function () {
        self.setData({
          show_eye3: true
        })
      }, delay);
    }

    
  },
  //获取屏幕宽度
  getScreenw: function () {
    const self = this;
    wx.getSystemInfo({
      success: function (res) {
        const name = 'iPhone X', name2 = 'iPhone11';
        if (res.model.indexOf(name) > -1 || res.model.indexOf(name2) > -1) {
          self.data.isIpx = true;
          self.data.upfile_top = 13;
          self.data.upfile_height = 32.5;
        } else {
          self.data.isIpx = false;
        }
        self.setData(self.data)
      }
    })
  },
  getImages: function (img) {
    const self = this;
    wx.getImageInfo({
      src: self.data.imgUrl + img,
      success: function (res) {
        let cx = 0, cy = 0, face_top = 0, face_left = 0;
        if (self.data.isIpx) {
          cx = 442 / res.width * 1.15;
          cy = 442 / res.height * 1.13;
          face_top = 11.5;
          face_left = 15.5;
        } else {
          cx = 386 / res.width * 1.3;
          cy = 386 / res.height * 1.2;
          face_top = 16;
          face_left = 16;
        }
       
        self.setData({
          cx: cx,
          cy: cy,
          face_top: face_top,
          face_left: face_left
        })
      }
    })
  },
  anition: function (delay, key) {
    const self = this;
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
      delay: delay
    })

    this.animation = animation;
    animation.translateX(0).step()

    if (key == 1) {
      self.data.animationData = animation.export();
      self.data.show_face_item = true;
    } else if (key == 2) {
      self.data.animationData2 = animation.export();
      self.data.show_face_item = true;
    } else if (key == 3) {
      self.data.animationData3 = animation.export();
      self.data.show_face_item = true;
    } else if (key == 4) {
      self.data.animationData4 = animation.export();
      self.data.show_face_item = true;
    }

    self.setData(self.data);
  },

  initData: function (key) {
    const self = this;
    var animation = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease'
    })

    this.animation = animation;
    animation.translateX(-260).step()

    if (key == 1) {
      self.data.animationData = animation.export();
    } else if (key == 2) {
      self.data.animationData2 = animation.export();
    } else if (key == 3) {
      self.data.animationData3 = animation.export();
    } else if (key == 4) {
      self.data.animationData4 = animation.export();
    }

    self.setData(self.data);
  },
  toIndex: function () {
    wx.navigateBack({
      delta: 1
    })
  }
})