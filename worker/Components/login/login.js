// Components/login/login.js
const app = getApp()
import util from '../../utils/util.js'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isAuthorize: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    //绑定按钮，用户授权回调
    handleAuthorize: util.throttle(function(event) {
      //console.log(event,'event')
      const self = this;
      let detail = event.detail;
      if (detail.userInfo) { //授权成功

        app.globalHandler.login(function(err) {
          if (err) { //登录发生错误时
            //微信登录
            // app.login(self.loginCb);
          } else {
            //调用父组件的getData方法
            self.triggerEvent('getDataEvent')
          }
        });

      }
    }, 1000),

  }
})