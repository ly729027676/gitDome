//index.js
//获取应用实例
const app = getApp()
import Base from '../../utils/base.js'
import config from '../../utils/config.js'

Page({
  data: {
    isLoading: false,
    imgUrl: config.Constants.DOMAIN_Img_URL,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userLogin: true, //用户是否登陆
    athFlag: 0, //检测用户在小程序是否删除缓存，1 表示没有授权 2表示有授权但是缓存被清楚，需要重新登陆
  },
  onLoad: function () {},
  onShow: function() {
    wx.removeStorageSync('backPage');
    if (wx.getStorageSync('session_id')) {
      this.setData({
        userLogin: true,
      })
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
        userLogin: true
      })
      if (self.data.athFlag == 2) {
        self.upImages()
      }
    }, self)
  },
  upImages: function() {
    const self = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        const tempFilePaths = res.tempFilePaths

        wx.uploadFile({
          url: config.Constants.UPDOMAIN_Img_URL + 'face/img_handel?img_url=' + tempFilePaths[0], //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'uploadFile',
          success(res) {
            
            let data = res.data.replace("/");
            data = JSON.parse(data);

            wx.setStorageSync('img_index', data.img_index);

            //self.getData(data);
            setTimeout(function () {
              //share_ret 1是非提审，0是提审
              if (data.share_ret == 0) {
                wx.navigateTo({
                  url: '../facecheck/facecheck',
                })
              } else {
                wx.navigateTo({
                  url: '../share/share',
                })
              }

            }, 1000)

            wx.showToast({
              title: '上传成功',
              duration: 1000
            })

            
          }
        })
      },
      fail: function(err) {
        console.log(JSON.stringify(err) + '上传图片失败')
      }
    })
  },
  // getData: function (_data) {
  //   const self = this;
  //   const img_index = wx.getStorageSync('img_index');
  //   const obj = {
  //     url: 'face/face_check',
  //     data: {
  //       img_index: img_index,
  //       session_id: wx.getStorageSync('session_id')
  //     },
  //     flag: true,
  //     self: self
  //   }
  //   const base = new Base(obj);
  //   base.request().then((res) => {
  //     console.log(JSON.stringify(res))
  //     if (res.ret != 0) {
  //       wx.showToast({
  //         title: res.errmsg,
  //         icon: 'none'
  //       })
  //       return
  //     }

  //     //self.data.dataList = res.face_check_dict;
  //     // self.data.img_index = res.img_index;
  //     // self.data.jump_url = res.jump_url;
  //     // self.data.jump_path = res.jump_path;
  //     // self.data.jump_img = res.jump_img;
  //     // self.data.face_code = res.face_code;
  //     // self.data.share_ret = res.share_ret;

  //     self.setData(self.data);

  //     wx.setStorageSync('share_ret', res.share_ret);
  //     wx.setStorageSync('jump_url', res.jump_url);
  //     wx.setStorageSync('jump_path', res.jump_path);
  //     wx.setStorageSync('jump_img', res.jump_img);
  //     wx.setStorageSync('face_code', res.face_code);
  //     wx.setStorageSync('faceObj', res.face_check_dict);

  //     self.getImgPath(res.face_check_dict.img_path)

      

  //   }, (err) => {
  //     console.log(JSON.stringify(err) + '请求失败face_check')
  //   })
  // },
  // //下载上传图片的路径
  // getImgPath: function (imgPath) {
  //   const self = this;
  //   wx.downloadFile({
  //     url: self.data.imgUrl + imgPath,
  //     success: function (res) {
  //       wx.getImageInfo({
  //         src: res.tempFilePath,
  //         success: function (res) {
  //           wx.setStorageSync('imgMsg', res);
  //         }
  //       })
  //       wx.setStorageSync('imgPath', res.tempFilePath);
  //     },
  //     fail: function () {
  //       console.log('获取图片失败')
  //     }
  //   })
  // },
})