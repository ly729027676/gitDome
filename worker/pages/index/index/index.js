const app = getApp()

Page({
  data: {
    location: '', //获取地址位置
    has_location: true, //是否获取地址位置授权
    isAuthorize: true, //用户信息授权
  },

  onLoad: function() {

    //用户没授权进行授权
    app.cache.has_location && this.getLocation()


    if (app.cache.has_login) {

      app.globalHandler.getSetting((res) => {

        if (res.authSetting['scope.userInfo']) {

          this.getData()

        } else {

          this.getLogin()

        }

      });

    } else {

      this.getData()

    }

  },

  getData() {
    console.log(app.cache.phoneIp, 'phoneIp')
    app.cache.has_login = false

    this.setData({
      isAuthorize: false
    })

  },

  getLogin: function() {

    this.setData({
      isAuthorize: true
    })

  },

  getLocation: function() {

    const self = this

    //获取地理位置
    app.globalHandler.getUserLocation(function() {
      self.setData({
        location: app.cache.location,
        has_location: app.cache.has_location
      })
    })

  }
})