// pages/result.js
import Base from '../../utils/base.js'
import config from '../../utils/config.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoading: false,
    imgUrl: config.Constants.DOMAIN_Img_URL,
    dataList: {},
    btnMsg: '再次测试', //自己从链接点击进来的 显示{再次测试} 1 其他人从链接点进来的 显示{我也要测试}
    img_index: '',
    pageFlag: 0, // 0小程序过来 1表示其他链接过来 从分享链接和二维码链接进来的不现实 发给好友和分享朋友圈按钮
    left: 0,
    top: 0,
    backPage: true, //控制返回箭头触发变量
    wxFlag: false,
    jump_url: '',
    jump_path: '',
    jump_img: '',
    noSto: false,
    isIpx: false,
    share_ret: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //识别二维码进来
    if (options.scene) {
      var scene = decodeURIComponent(options.scene);
      scene = scene.split(",");
      const img_index = scene[0].split(':')[1];
      const pageFlag = scene[1].split(':')[1];
      const uid = scene[2].split(':')[1];
      
      wx.setStorageSync('img_index', img_index);

      if (wx.getStorageSync('user_id') == uid) {
        this.data.pageFlag = 2;
      } else {
        this.data.pageFlag = pageFlag;
        this.data.btnMsg = '我也要测试';
      }

      this.setData(this.data);
    }

    if (options.pageFlag && options.user_id) {
      //新用户没有user_id和user_id不相等的情况到不同的页面
      if (wx.getStorageSync('user_id') == options.user_id) {
        this.setData({
          pageFlag: 2,
        })
      } else {
        this.setData({
          pageFlag: options.pageFlag,
          btnMsg: '我也要测试'
        });
      }

      wx.setStorageSync('img_index', options.img_index);
      wx.setStorageSync('imgPath', options.imgPath);
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onShow: function() {
    this.getScreenw();
    if (!this.data.wxFlag) {
      this.setData({
        wxFlag: true
      })
      this.getData();
    }
  },
  onUnload: function() {
    if (!this.data.noSto) {
      wx.setStorageSync('backPage', true)
    }
  },
  //获取屏幕宽度
  getScreenw: function () {
    const self = this;
    wx.getSystemInfo({
      success: function (res) {
        const name = 'iPhone X';
        if (res.model.indexOf(name) > -1) {
          self.data.isIpx = true;
        } 
      }
    })
  },
  getData: function() {
    const self = this;
    const img_index = wx.getStorageSync('img_index');
    const obj = {
      url: 'face/face_check',
      data: {
        img_index: img_index,
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

      if (res.face_check_dict.beauty >= 100) {
        self.data.left = 3;
        self.data.top = 34;
      } else if (res.face_check_dict.beauty < 100 && res.face_check_dict.beauty > 10) {
        self.data.left = 19;
        self.data.top = 31;
      } else if (res.face_check_dict.beauty < 10) {
        self.data.left = 30;
        self.data.top = 31;
      }

      self.data.dataList = res.face_check_dict;
      self.data.img_index = res.img_index;
      self.data.jump_url = res.jump_url;
      self.data.jump_path = res.jump_path;
      self.data.jump_img = res.jump_img;
      self.data.face_code = res.face_code;
      self.data.share_ret = res.share_ret;

      self.setData(self.data);

      wx.setStorageSync('share_ret', res.share_ret);
      wx.setStorageSync('face_code', res.face_code);
      wx.setStorageSync('faceObj', res.face_check_dict);

      self.getImgPath(res.face_check_dict.img_path)
      
    }, (err) => {
      console.log(JSON.stringify(err) + '请求失败face_check')
    })
  },
  //下载上传图片的路径
  getImgPath: function (imgPath) {
    const self = this;
    wx.downloadFile({
      url: self.data.imgUrl + imgPath,
      success: function (res) {
        wx.getImageInfo({
          src: res.tempFilePath,
          success: function (res) {
            wx.setStorageSync('imgMsg', res);
          }
        })
        wx.setStorageSync('imgPath', res.tempFilePath);
      },
      fail: function () {
        console.log('获取图片失败')
      }
    })
  },
  toIndex: config.throttle(function() {
    this.setData({
      noSto: true
    })

    if (this.data.pageFlag == 0) {
      setTimeout(function () {
        wx.navigateBack({
          delta: 2
        })
      }, 100)
    }else {
      wx.removeStorageSync('backPage')
      wx.redirectTo({
        url: '../index/index',
      })
    }
  }, 1000),
  toFacecheck: config.throttle(function() {
    wx.navigateTo({
      url: '../facecheck/facecheck',
    })
  },1000),
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    const imgPath = wx.getStorageSync('imgPath');
    const user_id = wx.getStorageSync('user_id');
    const img_index = wx.getStorageSync('img_index');
    if (res.from == "button") {
      return {
        title: '[有人@我]OMG!国家给我颁发颜值证书了~~立即查看',
        path: `/pages/result/result?user_id=${user_id}&img_index=${this.data.img_index}&pageFlag=1`
      }
    }
  }
})