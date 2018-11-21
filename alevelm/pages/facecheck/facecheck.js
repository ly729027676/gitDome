// pages/facecheck.js
import config from '../../utils/config.js'
import Base from '../../utils/base.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoading: false,
    saveUrl: '',
    screenw: 0,
    screenH: 0,
    imgUrl: config.Constants.DOMAIN_Img_URL,
    isIpx: false,
    authFlag: false,
    share_ret: '',
    jump_url: '',
    jump_path: '',
    jump_img: '',
    pageFlag: 0, // 0小程序过来 1表示其他链接过来 从分享链接和二维码链接进来的不现实 发给好友和分享朋友圈按钮
    btnMsg: '再次测试', //自己从链接点击进来的 显示{再次测试} 1 其他人从链接点进来的 显示{我也要测试}
    imgPath: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.pageFlag && options.user_id) {
      //新用户没有user_id和user_id不相等的情况到不同的页面
      if (wx.getStorageSync('user_id') == options.user_id) {
        this.setData({
          pageFlag: 2,
        })
      } else {
        this.setData({
          pageFlag: options.pageFlag,
          btnMsg: '我也要测试',
        });
      }
      wx.setStorageSync('img_index', options.img_index);
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getData();
    this.getScreenw();
  },
  getData: function () {
    const self = this;
    self.setData({
      isLoading: true
    })
    const img_index = wx.getStorageSync('img_index');
    const obj = {
      url: 'face/face_check',
      data: {
        img_index: img_index,
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

      wx.setStorageSync('face_code', res.face_code);
      wx.setStorageSync('faceObj', res.face_check_dict);

      self.setData({
        jump_url: res.jump_url,
        jump_path: res.jump_path,
        jump_img: res.jump_img,
      })

      self.getImgPath(res.face_check_dict.img_path)

    }, (err) => {
      console.log(JSON.stringify(err) + '请求失败face_check')
    })
  },
  //下载上传图片的路径
  getImgPath: function (img_path) {
    const self = this;
    wx.downloadFile({
      url: self.data.imgUrl + img_path,
      success: function (res) {
        wx.getImageInfo({
          src: res.tempFilePath,
          success: function (res) {
            wx.setStorageSync('imgMsg', res);
          }
        })
      
        setTimeout(function () {
          self.getGenerate(res.tempFilePath);
        },200)
      },
      fail: function () {
        console.log('获取图片失败')
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
          self.data.isIpx = true;
          self.data.screenw = res.screenWidth - 30
          self.data.screenH = res.screenHeight - 240;
        } else {
          self.data.screenw = res.screenWidth - 30
          self.data.screenH = res.screenHeight - 200
        }

        self.setData(self.data)
      }
    })
  },
  //生成海报
  getGenerate: function (tempFilePath) {
    const self = this;
 
    const faceObj = wx.getStorageSync('faceObj'); 
    const face_code = wx.getStorageSync('face_code'); //二维码
    const imgMsg = wx.getStorageSync('imgMsg');

    const imgMsg_w = imgMsg.width;  //上传图片的宽
    const imgMsg_h = imgMsg.height; //上传图片的高
    const ctx = wx.createCanvasContext('poster');

    ctx.drawImage('../../static/images/code_bg.png', 0, 0, self.data.screenw, self.data.screenH) //画海报
    ctx.save();
    ctx.setFillStyle('#a0466c')
    ctx.font = 'normal bold 20px normal'; 
    ctx.fillText(faceObj.word_ret, (320 - ctx.measureText(faceObj.word_ret).width) / 2 + 10, (self.data.screenH * 0.074))
    ctx.restore();

    //绘制特性分数
    ctx.save();
    ctx.setFillStyle('#808080')
    ctx.setFontSize(16)
    ctx.fillText('颜值:', 30, self.data.screenH - (self.data.screenH * 0.1633) - 55)
    ctx.fillText('年龄:', self.data.screenw / 2 - 40, self.data.screenH - (self.data.screenH * 0.1633) - 55)
    ctx.fillText('脸型:', self.data.screenw - 120, self.data.screenH - (self.data.screenH * 0.1633) - 55)
    ctx.restore();

    //绘制特性分数值
    ctx.save();
    ctx.setFillStyle('#a0466c')
    ctx.setFontSize(16)
    ctx.fillText(faceObj.beauty, 70, self.data.screenH - (self.data.screenH * 0.1633) - 55)
    ctx.fillText(faceObj.age, self.data.screenw / 2, self.data.screenH - (self.data.screenH * 0.1633) - 55)
    ctx.fillText(faceObj.face_type, self.data.screenw - 80, self.data.screenH - (self.data.screenH * 0.1633) - 55)
    ctx.restore();

    ctx.save();
    ctx.setFillStyle('#e73c9e')
    ctx.setFontSize(20)
    ctx.fillText(faceObj.face_kill, (320 - ctx.measureText(faceObj.face_kill).width) / 2 + 10, self.data.screenH - (self.data.screenH * 0.1633) - 20)
    ctx.restore();

    //绘制图片的圆心
    var cw = self.data.screenH * 0.548, ch = self.data.screenH * 0.548;
    var cx = self.data.screenw * 0.5 - cw * 0.5, cy = self.data.screenH * 0.1056;
    ctx.drawImage('../../static/images/result_yuan.png', cx, cy, cw, ch);

    //上传图片绘制
    var d = Math.min(Math.min(imgMsg_h, imgMsg_w), cw - 6);
    var r = d * 0.5;
    var iw = 0, ih = 0;
    if (imgMsg_w > imgMsg_h) {
      ih = d;
      iw = d * imgMsg_w / imgMsg_h;
    }
    else {
      iw = d;
      ih = d * imgMsg_h / imgMsg_w;
    }
    var ix = cx + 3, iy = cy + 3;
    ctx.save();
    ctx.beginPath();
    ctx.arc(ix + r, iy + r, r, 0, 2 * Math.PI);
    ctx.clip();
    ctx.drawImage(tempFilePath, ix - (iw - d) * 0.5, iy - (ih - d) * 0.5, iw, ih);
    ctx.restore();

    if (self.data.isIpx) {
      //描述
      if (faceObj.cheke_ret == 1) {
        ctx.drawImage('../../static/images/result_01.png', self.data.screenw / 2 - 288 / 4, self.data.screenH - (self.data.screenH * 0.064) - 220, 288 / 2, 92 / 2)
      } else if (faceObj.cheke_ret == 2) {
        ctx.drawImage('../../static/images/result_02.png', self.data.screenw / 2 - 371 / 4, self.data.screenH - (self.data.screenH * 0.064) - 220, 371 / 2, 92 / 2)
      } else if (faceObj.cheke_ret == 3) {
        ctx.drawImage('../../static/images/result_03.png', self.data.screenw / 2 - 280 / 4, self.data.screenH - (self.data.screenH * 0.064) - 220, 280 / 2, 92 / 2)
      }
    } else {
      //描述
      if (faceObj.cheke_ret == 1) {
        ctx.drawImage('../../static/images/result_01.png', self.data.screenw / 2 - 288 / 4, self.data.screenH - (self.data.screenH * 0.064) - 180, 288 / 2, 92 / 2)
      } else if (faceObj.cheke_ret == 2) {
        ctx.drawImage('../../static/images/result_02.png', self.data.screenw / 2 - 371 / 4, self.data.screenH - (self.data.screenH * 0.064) - 180, 371 / 2, 92 / 2)
      } else if (faceObj.cheke_ret == 3) {
        ctx.drawImage('../../static/images/result_03.png', self.data.screenw / 2 - 280 / 4, self.data.screenH - (self.data.screenH * 0.064) - 180, 280 / 2, 92 / 2)
      }
    }
    
    wx.downloadFile({
      url: self.data.imgUrl+face_code,
      success: function (res) {
        //isIpx= true 是iphoneX
        if (self.data.isIpx) {
          ctx.drawImage(res.tempFilePath, self.data.screenw * 0.1433 - 20, self.data.screenH - (self.data.screenH * 0.1633) + 5, 73, 73) //画二维码

          //绘制分数
          ctx.drawImage('../../static/images/result_grade.png', self.data.screenw * 0.6956, self.data.screenH * 0.0856, 100, 100)

          ctx.translate(0, 0);//设置画布上的(0,0)位置，也就是旋转的中心点
          ctx.rotate(350 * Math.PI / 180);
          ctx.setFillStyle('#930abb')
          ctx.setFontSize(30)

          if (faceObj.beauty >= 100) {
            ctx.fillText(faceObj.beauty, self.data.screenw * 0.6521, self.data.screenH * 0.2765)
          } else if (faceObj.beauty < 100 && faceObj.beauty > 10) {
            ctx.fillText(faceObj.beauty, self.data.screenw * 0.6956, self.data.screenH * 0.2765)
          } else if (faceObj.beauty <= 0) {
            ctx.fillText(faceObj.beauty, self.data.screenw * 0.7391, self.data.screenH * 0.2765)
          }
        } else {
          ctx.drawImage(res.tempFilePath, self.data.screenw * 0.0821, self.data.screenH - (self.data.screenH * 0.1633) - 3, self.data.screenH * 0.1563, self.data.screenH * 0.1563) //画二维码

          //绘制分数
          ctx.drawImage('../../static/images/result_grade.png', self.data.screenw * 0.6956, self.data.screenH * 0.0856, 90, 90)

          ctx.translate(0, 0);//设置画布上的(0,0)位置，也就是旋转的中心点
          ctx.rotate(350 * Math.PI / 180);
          ctx.setFillStyle('#930abb')
          ctx.setFontSize(30)

          if (faceObj.beauty >= 100) {
            ctx.fillText(faceObj.beauty, self.data.screenw * 0.6521, self.data.screenH * 0.0856 + 104)
          } else if (faceObj.beauty < 100 && faceObj.beauty > 10) {
            ctx.fillText(faceObj.beauty, self.data.screenw * 0.6956, self.data.screenH * 0.0856 + 104)
          } else if (faceObj.beauty <= 0) {
            ctx.fillText(faceObj.beauty, self.data.screenw * 0.7391, self.data.screenH * 0.0856 + 104)
          }
        }

        ctx.draw()
        self.setData({
          isLoading: false
        })
   
        self.save() //生成微信临时模板文件path
      },
      fail: function (err) {
        console.log('下载失败' + JSON.stringify(err))
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
        authFlag: false
      })
    }
  },
  toIndex: function () {
    wx.redirectTo({
      url: '../index/index',
    })
  },
  //跳转其他小程序
  toProgram: function () {
    const self = this;
    wx.navigateToMiniProgram({
      appId: self.data.jump_url,
      path: self.data.jump_path,
      envVersion: 'release'
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    //const imgPath = wx.getStorageSync('imgPath');
    const user_id = wx.getStorageSync('user_id');
    const img_index = wx.getStorageSync('img_index');
    if (res.from == "button") {
      return {
        title: '[有人@我]OMG!国家给我颁发颜值证书了~~立即查看',
        path: `/pages/facecheck/facecheck?user_id=${user_id}&img_index=${img_index}&pageFlag=1`
      }
    }
  }
  
})