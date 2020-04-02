/*jshint esversion: 6 */
/**
 * 工具类
 */

let config = require('./config.js');
const app = getApp()

let util = {

  formatTime(date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  },
  formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  },
  /**
   * 对象复制
   */
  assign(a, b) {
    if (Object.assign) {
      return Object.assign(a, b);
    } else {
      for (var key in b) {
        a[key] = b[key];
      }
      return a;
    }
  },

  /**
   * 对象拷贝
   */
   copy(obj){
     if(typeof obj != 'object'){
          return obj;
      }
      var newobj = {};
      for ( var attr in obj) {
          newobj[attr] = copy(obj[attr]);
      }
      return newobj;
   },

  /**
   * iphoneX判断
   */
  adaptScreen() {
    let sysInfo = this.getSysInfo();
    let isIpx = false;
    if (sysInfo.statusBarHeight > 24 || sysInfo.model.indexOf('iPhone X') > -1) {
      isIpx = true;
    }
    return isIpx;
  },
  /**
   * 获取用户信息
   */
  getSysInfo: function() {
    if (!this.sysInfo) {
      this.sysInfo = wx.getSystemInfoSync();
      console.error("sysInfo", this.sysInfo);
    }
    return this.sysInfo;
  },

  /*
    获取状态栏的高度
   */
  getStatusBarHeight: function (self) {
    let menu = this.getMenuTop()
    let _data = {
      "nav_height": menu.top + menu.height,
      "menu_top": menu.top || 0,
      "menu_height": menu.height
    }
    app.cache.menu = _data

    self.setData({
      nav_height: menu.top + menu.height,
      menu_top: menu.top || 0,
      menu_height: menu.height
    })
  },

  /*
    获取菜单按钮距离顶部的距离
   */
  getMenuTop: function () {
    let menu_top = wx.getMenuButtonBoundingClientRect()
    console.error(menu_top,':menu_top')
    return menu_top
  },

  /**
   * 获取screen_adapt参数
   */
  getScreenAdaptArgs: function () {
    let sys_info = this.getSysInfo();
    let rpx_ratio = 750 / sys_info.screenWidth;
    let design_ratio = 375 / 603;
    return {
      rpx_ratio,
      design_ratio,
      design_width: 750,
      design_height: 1206,
      screen_rpx_w: sys_info.windowWidth * rpx_ratio,
      screen_rpx_h: sys_info.windowHeight * rpx_ratio,
      screen_w: sys_info.windowWidth,
      screen_h: sys_info.windowHeight,
      statusBarHeight: sys_info.statusBarHeight
    };
  },
  

  /**
   *绘制自动换行的字符串
   *font_obj = {
   *  x,
   *  y,
   *  width,
   *  size,
   *  font_style,
   *  txt,
   *  textBaseline,
   *  textAlign,
   *  fillStyle
   *}
   */
  drawText: function (ctx, font_obj = {}) {
    let chr = (font_obj.txt || "").split("");
    let temp = "";
    let row = [];
    let size = font_obj.size || 12;
    let line_height = font_obj.line_height || 5;
    ctx.font = font_obj.font_style;
    ctx.fillStyle = font_obj.fillStyle || "black";
    ctx.textBaseline = font_obj.textBaseline || "middle";
    ctx.textAlign = font_obj.textAlign || "center";

    for (var a = 0; a < chr.length; a++) {
      if (ctx.measureText(temp).width < font_obj.width) { } else {
        row.push(temp);
        temp = "";
      }
      temp += chr[a];
    }
    row.push(temp);

    for (var b = 0; b < row.length; b++) {
      ctx.fillText(row[b], font_obj.x, font_obj.y + b * (size + line_height));
    }
  },
  /**
   *绘制圆形图片
   *data = {
   *  x,
   *  y,
   *  file,
   *  radius
   *}
   */
  drawCircleImg: function(ctx, data = {}) {
    let file = data.file || "";
    let x = data.x || 0;
    let y = data.y || 0;
    let r = data.radius || 1;

    var d = 2 * r;
    var cx = x + r;
    var cy = y + r;
    ctx.save();
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.clip();
    ctx.drawImage(file, x, y, d, d);
    ctx.restore();
  },


  //函数节流 防止用户多次点击按钮打开多个页面
  throttle: function(fn, gapTime) {
    if (gapTime == null || gapTime == undefined) {
      gapTime = 1500
    }
    let _lastTime = null
    // 返回新的函数    
    return function() {
      let _nowTime = +new Date()
      if (_nowTime - _lastTime > gapTime || !_lastTime) {
        fn.apply(this, arguments)
        //将this和参数传给原函数
        _lastTime = _nowTime
      }
    }
  },

  //获取指定范围的随机数
  getRandForRange(begin, end) {
    return Math.floor(Math.random() * (end - begin + 1) + begin);
  },

  /**
   * 获取图片下载地址
   */
  getFileDownlodPath: function(relative_path) {
    if (relative_path) {
      if (relative_path.indexOf('http') < 0) {
        return config.Constants.DOMAIN_Img_URL + relative_path;
      } else {
        return relative_path;
      }
    }
    return "";
  },

  getFileDownload: function(path, cb) {
    const self = this;
    wx.downloadFile({
      url: path,
      success(res) {
        if (res.statusCode === 200) {
          return cb(res.tempFilePath);
          cb = null;
        } else {
          setTimeout(() => {
            self.getFileDownload();
          }, 100);
        }
      }
    });

  },

  /*
n: 需要返回到那一页的下标
*/
  getPage: function(n) {
    const _page = getCurrentPages();
    let _page_num = _page[(_page.length - n) - 1].route;

    return '/' + _page_num;
  },

  /*
    n: 获取某一页的data数据
   */
  getPageData: function(n = 0) {
    const _data = getCurrentPages()[n - 1].data;

    return _data;
  }
};

module.exports = util;