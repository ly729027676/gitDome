//index.js
//获取应用实例
const app = getApp()
import Base from '../../utils/base.js';
import config from '../../utils/config.js'

let SCREEN_WIDTH = 750;
let PAGE_X, // 手按下的x位置
  PAGE_Y, // 手按下y的位置
  PR = wx.getSystemInfoSync().pixelRatio, // dpi
  T_PAGE_X, // 手移动的时候x的位置
  T_PAGE_Y, // 手移动的时候Y的位置
  CUT_L,  // 初始化拖拽元素的left值
  CUT_T,  // 初始化拖拽元素的top值
  CUT_R,  // 初始化拖拽元素的
  CUT_B,  // 初始化拖拽元素的
  CUT_W,  // 初始化拖拽元素的宽度
  CUT_H,  //  初始化拖拽元素的高度
  IMG_RATIO,  // 图片比例
  IMG_REAL_W,  // 图片实际的宽度
  IMG_REAL_H,   // 图片实际的高度
  DRAFG_MOVE_RATIO = 750 / wx.getSystemInfoSync().windowWidth,  //移动时候的比例,
  INIT_DRAG_POSITION = 200,   // 初始化屏幕宽度和裁剪区域的宽度之差，用于设置初始化裁剪的宽度
  INIT_BORDER = 200,
  MIN_WIDTH = 100,
  IMG_SCREEN_RATIO,
  DRAW_IMAGE_W // 设置生成的图片宽度

Page({
  data: {
    user_name: '',
    user_sex: '',
    userInfo: {},
    hasUserInfo: '',
    sexArry: ['男', '女'],
    index: 100,
    upfile_img: '../../static/images/upfile_bg.png',
    zIndex: 5,
    sceenW: '',
    sceenH: '',
    // 之后可以动态替换
    imageSrc: '',

    // 是否显示图片(在图片加载完成之后设置为true)
    isShowImg: false,

    // 初始化的宽高
    cropperInitW: SCREEN_WIDTH,
    cropperInitH: 0,

    // 动态的宽高
    cropperW: SCREEN_WIDTH,
    cropperH: SCREEN_WIDTH,

    // 动态的left top值
    cropperL: 0,
    cropperT: 0,

    // 图片缩放值
    scaleP: 0,

    // 裁剪框 宽高
    cutL: 0,
    cutT: 0,
    cutB: SCREEN_WIDTH,
    cutR: '100%',
    qualityWidth: DRAW_IMAGE_W,
    innerAspectRadio: DRAFG_MOVE_RATIO
  },
  onLoad: function() {
    this.getScreenw();
  },
  onShow: function () {
    this.onLoad();
  },
  onReady: function() {
    this.getData();
  },
  //获取屏幕宽度
  getScreenw: function () {
    const self = this;
    wx.getSystemInfo({
      success: function (res) {
        const name = 'iPhone X', name2 = 'iPhone11';
        if (res.model.indexOf(name) > -1 || res.model.indexOf(name2) > -1) {
          self.data.isIpx = true;
          self.data.cropperInitH = res.screenHeight * 0.6;
          self.data.name_top = 63;
          self.data.sex_top = 71;
          self.data.star_top = 81;
          self.data.upfile_top = 22;
          self.data.upfile_height = 32;
        } else {
          self.data.cropperInitH = res.screenHeight * 0.7;
        }

        self.setData(self.data)
      }
    })
  },
  getData: function() {
    const self = this,
      base = new Base();
    if (wx.getStorageSync('session_id')) {
      this.setData({
        hasUserInfo: true
      })
    } else {
      base.authorize(self);
    }
  },
  //跳转分析页
  toAnalyze: function() {

    if (this.data.user_name.length == 0) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none'
      })
      return
    }

    if (this.data.index == 100) {
      wx.showToast({
        title: '请输入性别',
        icon: 'none'
      })
      return
    }

    if (!this.data.isUpdate) {
      wx.showToast({
        title: '请上传图片',
        icon: 'none'
      })
      return
    }

    wx.navigateTo({
      url: '../../appearanceLevelTest/pages/analyze/analyze?img_index=' + this.data.img_index+'&index='+this.data.index,
    })
  },
  getUserInfo: function() {
    const self = this,
      base = new Base();
    base.getUserInfo(self, function() {
      self.setData({
        hasUserInfo: true
      })
    });
  },
  //上传图片
  upImages: function() {
    const self = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        const tempFilePaths = res.tempFilePaths
  
        self.setData({
          imageSrc: tempFilePaths[0],
          zIndex: 10
        })

        wx.getImageInfo({
          src: tempFilePaths[0],
          success: function (res) {
            DRAW_IMAGE_W = IMG_REAL_W = res.width
            IMG_REAL_H = res.height
            IMG_RATIO = IMG_REAL_W / IMG_REAL_H;
            let minRange = IMG_REAL_W > IMG_REAL_H ? IMG_REAL_W : IMG_REAL_H
            INIT_DRAG_POSITION = minRange > INIT_DRAG_POSITION ? INIT_DRAG_POSITION : minRange;

            IMG_SCREEN_RATIO = SCREEN_WIDTH / IMG_REAL_W;

            // 根据图片的宽高显示不同的效果   保证图片可以正常显示
            if (IMG_RATIO >= 1) {
              DRAW_IMAGE_W = IMG_REAL_W;
              let cropperL = Math.ceil((SCREEN_WIDTH - SCREEN_WIDTH * IMG_RATIO) / 2);
              let cutL = Math.ceil((SCREEN_WIDTH - SCREEN_WIDTH / IMG_RATIO) / 2 + 100),
                cutT = 100,
                cutB = 100,
                cutR = Math.ceil((SCREEN_WIDTH - SCREEN_WIDTH / IMG_RATIO) / 2 + 100);

              if (Math.ceil((SCREEN_WIDTH - SCREEN_WIDTH * IMG_RATIO) / 2) < 0) {
                cropperL = 0;
              }

              self.setData({
                cropperW: SCREEN_WIDTH,
                cropperH: SCREEN_WIDTH / IMG_RATIO,
                // 初始化left right
                cropperL: cropperL,
                cropperT: Math.ceil((SCREEN_WIDTH - SCREEN_WIDTH) / 2 + 100),

                cutL: cutL,
                cutT: cutT,
                cutB: cutB,
                cutR: cutR,
                // 图片缩放值
                scaleP: IMG_REAL_W / SCREEN_WIDTH,
                qualityWidth: DRAW_IMAGE_W,
                innerAspectRadio: IMG_RATIO
              })
            } else {
              DRAW_IMAGE_W = IMG_REAL_W;
              self.setData({
                cropperW: SCREEN_WIDTH * IMG_RATIO,
                cropperH: SCREEN_WIDTH,
                // 初始化left right
                cropperL: Math.ceil((SCREEN_WIDTH - SCREEN_WIDTH * IMG_RATIO) / 2),
                cropperT: Math.ceil((SCREEN_WIDTH - SCREEN_WIDTH) / 2 + 100),

                cutL: 100,
                cutT: Math.ceil((SCREEN_WIDTH - SCREEN_WIDTH * IMG_RATIO) / 2 + 100),
                cutB: Math.ceil((SCREEN_WIDTH - SCREEN_WIDTH * IMG_RATIO) / 2 + 100),
                cutR: 100,
                // 图片缩放值
                scaleP: IMG_REAL_W / SCREEN_WIDTH,
                qualityWidth: DRAW_IMAGE_W,
                innerAspectRadio: IMG_RATIO
              });
            }


            self.setData({
              isShowImg: true,
            })
          }
        })
      },
      fail: function(err) {
        console.log(JSON.stringify(err) + '上传图片失败')
      }
    })
  },
  //获取用户名字
  getUserName: function(e) {
    const user_name = e.detail.value;
    wx.setStorageSync('user_name', user_name);
    this.setData({
      user_name: user_name
    })
  },
  //获取用户性别
  getUserSex: function(e) {
    const _index = e.detail.value;
    this.setData({
      index: _index
    })
  },
  /**
   * 拖动时候触发的touchStart事件
   */
  contentStartMove(e) {
    PAGE_X = e.touches[0].pageX
    PAGE_Y = e.touches[0].pageY
  },

  /**
   * 拖动时候触发的touchMove事件
   */
  contentMoveing(e) {
    var _this = this
    var dragLengthX = (PAGE_X - e.touches[0].pageX) * DRAFG_MOVE_RATIO
    var dragLengthY = (PAGE_Y - e.touches[0].pageY) * DRAFG_MOVE_RATIO

    /**
     * 这里有一个小的问题
     * 移动裁剪框 ios下 x方向没有移动的差距
     * y方向手指移动的距离远大于实际裁剪框移动的距离
     * 但是在有些机型上又是没有问题的，小米4测试没有上下移动产生的偏差，模拟器ok，但是iphone8p确实是有的，虽然模拟器也ok
     * 小伙伴有兴趣可以找找原因
     */

    // 左移右移
    if (dragLengthX > 0) {
      if (this.data.cutL - dragLengthX < 0) dragLengthX = this.data.cutL
    } else {
      if (this.data.cutR + dragLengthX < 0) dragLengthX = -this.data.cutR
    }


    // 上移下移
    if (dragLengthY > 0) {
      if (this.data.cutT - dragLengthY < 0) dragLengthY = this.data.cutT
    } else {
      if (this.data.cutB + dragLengthY < 0) dragLengthY = -this.data.cutB
    }
    this.setData({
      cutL: this.data.cutL - dragLengthX,
      cutT: this.data.cutT - dragLengthY,
      cutR: this.data.cutR + dragLengthX,
      cutB: this.data.cutB + dragLengthY
    })

    PAGE_X = e.touches[0].pageX
    PAGE_Y = e.touches[0].pageY
  },

  contentTouchEnd() {

  },

  /**
   * 获取图片
   */
  getImageInfo() {
    var _this = this

    // 将图片写入画布
    const ctx = wx.createCanvasContext('myCanvas')
    ctx.drawImage(_this.data.imageSrc, 0, 0, IMG_REAL_W, IMG_REAL_H);
    ctx.draw(true, () => {
      // 获取画布要裁剪的位置和宽度   均为百分比 * 画布中图片的宽度    保证了在微信小程序中裁剪的图片模糊  位置不对的问题
      var canvasW = ((_this.data.cropperW - _this.data.cutL - _this.data.cutR) / _this.data.cropperW) * IMG_REAL_W
      var canvasH = ((_this.data.cropperH - _this.data.cutT - _this.data.cutB) / _this.data.cropperH) * IMG_REAL_H
      var canvasL = (_this.data.cutL / _this.data.cropperW) * IMG_REAL_W
      var canvasT = (_this.data.cutT / _this.data.cropperH) * IMG_REAL_H
      // 生成图片
      wx.canvasToTempFilePath({
        x: canvasL,
        y: canvasT,
        width: canvasW,
        height: canvasH,
        destWidth: canvasW,
        destHeight: canvasH,
        quality: 0.5,
        canvasId: 'myCanvas',
        fileType: 'jpg',
        success: function (res) {
          // 成功获得地址的地方
        wx.uploadFile({
          url: config.Constants.UPDOMAIN_Img_URL + 'face/img_upgrades_handel?img_url=' + res.tempFilePath,
          filePath: res.tempFilePath,
          name: 'uploadFile',
          success(obj) {
            console.log(JSON.stringify(obj))
            let _data = obj.data.replace("/");
            _data = JSON.parse(_data);

            // wx.setStorageSync('img_index', _data.img_index);
            wx.setStorageSync('share_button', _data.button);
            wx.setStorageSync('code_switch', _data.code_switch);

            _this.data.img_index = _data.img_index;
            _this.data.isUpdate = true;
            _this.data.isShowImg = false;
            _this.data.zIndex = 2;
            _this.data.upfile_img = res.tempFilePath;
            _this.setData(_this.data);
          },
          fail: function (err) {
            console.log(JSON.stringify(err))
          }
        })
        }
      })
    })
  },

  /**
   * 设置大小的时候触发的touchStart事件
   * 存数据
   */
  dragStart(e) {
    T_PAGE_X = e.touches[0].pageX
    T_PAGE_Y = e.touches[0].pageY
    CUT_L = this.data.cutL
    CUT_R = this.data.cutR
    CUT_B = this.data.cutB
    CUT_T = this.data.cutT
  },

  /**
   * 设置大小的时候触发的touchMove事件
   * 根据dragType判断类型
   * 4个方向的边线拖拽效果
   * 右下角按钮的拖拽效果
   */
  dragMove(e) {
    var _this = this
    var dragType = e.target.dataset.drag
    switch (dragType) {
      case 'right':
        var dragLength = (T_PAGE_X - e.touches[0].pageX) * DRAFG_MOVE_RATIO
        dragLength = Math.min(Math.min(Math.min(CUT_T, CUT_B), CUT_R), -dragLength);
        dragLength = -dragLength;

        this.setData({
          cutR: CUT_R + dragLength,
          cutT: CUT_T + dragLength / DRAFG_MOVE_RATIO,
          cutB: CUT_B + dragLength / DRAFG_MOVE_RATIO,
        })
        break;
      case 'left':
        var dragLength = (e.touches[0].pageX - T_PAGE_X) * DRAFG_MOVE_RATIO
        dragLength = Math.min(Math.min(Math.min(CUT_T, CUT_B), CUT_R), -dragLength);
        dragLength = -dragLength;

        this.setData({
          cutL: CUT_L + dragLength,
          cutT: CUT_T + dragLength / DRAFG_MOVE_RATIO,
          cutB: CUT_B + dragLength / DRAFG_MOVE_RATIO,
        })
        break;
      case 'top':
        var dragLength = (e.touches[0].pageY - T_PAGE_Y) * DRAFG_MOVE_RATIO;
        dragLength = Math.min(Math.min(Math.min(CUT_L, CUT_R), CUT_T), -dragLength);
        dragLength = -dragLength;

        this.setData({
          cutT: CUT_T + dragLength,
          cutL: CUT_L + dragLength / DRAFG_MOVE_RATIO,
          cutR: CUT_R + dragLength / DRAFG_MOVE_RATIO,
        })
        break;
      case 'bottom':
        var dragLength = (T_PAGE_Y - e.touches[0].pageY) * DRAFG_MOVE_RATIO;

        dragLength = Math.min(Math.min(Math.min(CUT_L, CUT_R), CUT_B), -dragLength);
        dragLength = -dragLength;

        this.setData({
          cutB: CUT_B + dragLength,
          cutL: CUT_L + dragLength / DRAFG_MOVE_RATIO,
          cutR: CUT_R + dragLength / DRAFG_MOVE_RATIO,
        })
        break;
      case 'rightBottom':
        var dragLengthX = (T_PAGE_X - e.touches[0].pageX) * DRAFG_MOVE_RATIO;
        var dragLengthY = (T_PAGE_Y - e.touches[0].pageY) * DRAFG_MOVE_RATIO;
        if (dragLengthX > 86 && dragLengthY > 100) {
          return;
        }
        
        var maxLen = Math.max(dragLengthX, dragLengthY);
        maxLen = -Math.min(Math.min(CUT_B, CUT_R), -maxLen);
        // if (CUT_B + dragLengthY < 0) dragLengthY = -CUT_B
        // if (CUT_R + dragLengthX < 0) dragLengthX = -CUT_R
        if (CUT_L + maxLen + CUT_R + MIN_WIDTH > SCREEN_WIDTH * DRAFG_MOVE_RATIO) {
          maxLen = SCREEN_WIDTH / DRAFG_MOVE_RATIO - MIN_WIDTH - CUT_R - CUT_L;
        }
        this.setData({
          cutB: CUT_B + maxLen,
          cutR: CUT_R + maxLen
        })
        break;
      case 'topRight':
        var dragLengthX = (T_PAGE_X - e.touches[0].pageX) * DRAFG_MOVE_RATIO;
        var dragLengthY = (e.touches[0].pageY - T_PAGE_Y) * DRAFG_MOVE_RATIO;
        if (dragLengthX > 86 && dragLengthY > 100) {
          return;
        }
        var maxLen = Math.max(dragLengthX, dragLengthY);
        maxLen = -Math.min(Math.min(CUT_T, CUT_R), -maxLen);
        // if (CUT_B + dragLengthY < 0) dragLengthY = -CUT_B
        // if (CUT_R + dragLengthX < 0) dragLengthX = -CUT_R
        if (CUT_L + maxLen + CUT_R + MIN_WIDTH > SCREEN_WIDTH * DRAFG_MOVE_RATIO) {
          maxLen = SCREEN_WIDTH / DRAFG_MOVE_RATIO - MIN_WIDTH - CUT_R - CUT_L;
        }
        this.setData({
          cutT: CUT_T + maxLen,
          cutR: CUT_R + maxLen
        })
        break;
      case 'leftTop':
        var dragLengthX = (e.touches[0].pageX - T_PAGE_X) * DRAFG_MOVE_RATIO;
        var dragLengthY = (e.touches[0].pageY - T_PAGE_Y) * DRAFG_MOVE_RATIO;
        if (dragLengthX > 86 && dragLengthY > 100) {
          return;
        }
        var maxLen = Math.max(dragLengthX, dragLengthY);
        maxLen = -Math.min(Math.min(CUT_L, CUT_T), -maxLen);
        // if (CUT_B + dragLengthY < 0) dragLengthY = -CUT_B
        // if (CUT_R + dragLengthX < 0) dragLengthX = -CUT_R
        if (CUT_L + maxLen + CUT_R + MIN_WIDTH > SCREEN_WIDTH * DRAFG_MOVE_RATIO) {
          maxLen = SCREEN_WIDTH / DRAFG_MOVE_RATIO - MIN_WIDTH - CUT_R - CUT_L;
        }
        this.setData({
          cutL: CUT_L + maxLen,
          cutT: CUT_T + maxLen
        })
        break;
      case 'bottomLeft':
        var dragLengthX = (e.touches[0].pageX - T_PAGE_X) * DRAFG_MOVE_RATIO;
        var dragLengthY = (T_PAGE_Y - e.touches[0].pageY) * DRAFG_MOVE_RATIO
        if (dragLengthX > 86 && dragLengthY > 100) {
          return;
        }
        var maxLen = Math.max(dragLengthX, dragLengthY);
        maxLen = -Math.min(Math.min(CUT_B, CUT_L), -maxLen);
        // if (CUT_B + dragLengthY < 0) dragLengthY = -CUT_B
        // if (CUT_R + dragLengthX < 0) dragLengthX = -CUT_R
        if (CUT_L + maxLen + CUT_R + MIN_WIDTH > SCREEN_WIDTH * DRAFG_MOVE_RATIO) {
          maxLen = SCREEN_WIDTH / DRAFG_MOVE_RATIO - MIN_WIDTH - CUT_R - CUT_L;
        }
        this.setData({
          cutL: CUT_L + maxLen,
          cutB: CUT_B + maxLen
        })
        break;
      default:
        break;
    }
  },
  closeBtn: function () {
    this.setData({
      isShowImg: false,
      zIndex: 10
    })
  }
})