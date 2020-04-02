import cache from '../utils/cache.js'

let global = {
  getUserLocation: function(fn, target) {
    let vm = this;
    wx.getSetting({
      success: (res) => {
        wx.authorize({
          scope: 'scope.userLocation',
          success(res) {
            vm.getLocation(fn);
          },
          fail(err) {
            wx.showModal({
              title: '请求授权当前位置',
              content: '需要获取您的地理位置，请确认授权',
              success: function(res) {
                if (res.cancel) {
                  wx.showToast({
                    title: '拒绝授权',
                    icon: 'none',
                    duration: 1000
                  })

                  fn && fn.call(target, err)
                } else if (res.confirm) {
                  wx.openSetting({
                    success: function(res) {
                      if (res.authSetting["scope.userLocation"] == true) {
                        vm.getLocation(fn);
                      }
                    }
                  })
                }
              }
            })
          }
        })
      }
    })
  },
  // 微信获得经纬度
  getLocation: function(fn, target) {
    let vm = this;
    wx.getLocation({
      success: function(res) {
        let latitude = res.latitude,
          longitude = res.longitude,
          key = 'KCNBZ-FPXEW-K2GR4-OSH52-ZA2B3-NZBS2';
        let url = `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=${key}`

        wx.request({
          url: url,
          success: function(result) {

            cache.location = result.data.result.address

            cache.has_location = false

            fn && fn.call(fn, target)
          }

        })
      },
      fail: function(res) {
        console.log('fail' + JSON.stringify(res))
      }
    })
  },

  //微信登录
  login: function(fn, target) {
    //fn && fn.call(fn,target);

    let self = this;

    wx.showLoading({
      title: '登录中',
      mask: true
    });
    this.getUserInfo((res) => {
      let userInfo = res.userInfo || {};

      this.wxLogin((res) => {
        const code = res.code;
        let http = new Http({
          url: config.REQ_URL.LOGIN,
          data: {
            code,
          },
          showLoad: false
        });
        http.request().then((res) => {
          // console.error(res, "wx登录成功");
          wx.hideLoading();
          if (typeof res === 'string') {
            wx.showToast({
              title: res,
              icon: 'none'
            });
            fn && fn.call(target, res);
            return;
          }



          fn && fn.call(target);
        }, (err) => {
          //console.error(err + ':请求失败')
          fn && fn.call(target, err);
        })
      });
    });
  },

  //获取wx设置
  getSetting: function(cb) {
    wx.getSetting({
      success(res) {
        cb && cb(res);
      }
    });
  },

  //获取用户信息
  getUserInfo: function(cb) {
    wx.getUserInfo({
      withCredentials: true,
      success(res) {
        cb && cb(res);
      },
      fail(err) {
        //console.error(err, "getUserInfo");
      }
    })
  },

  //wx登录
  wxLogin: function(cb) {
    wx.login({
      success(res) {
        cb && cb(res);
      }
    })
  },
}

module.exports = global;