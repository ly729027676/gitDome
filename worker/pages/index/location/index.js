const app = getApp()

Page({
  data: {
    location: '',
    isAuthorize: false
  },

  onLoad: function() {
    const self = this

    app.globalHandler.getUserLocation(function() {
      self.setData({
        location: app.cache.location
      })
    })
  },
})