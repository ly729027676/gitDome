class Util {
  constructor() {

  }

  /*
  获取时间倒计时
  参数
  url：请求地址
  data：接口接受参数
  success：请求成功函数
  fail：请求失败函数
  falg：是否显示loding加载动画
 */
  getTime(time, fn) {
    let leftTime = time / 1000;
    let d, h, m, s;
    let interval = setInterval(function() {
      if (leftTime > 0) {
        d = Math.floor(leftTime / 60 / 60 / 24); //计算剩余的天数 
        h = Math.floor(leftTime / 60 / 60 % 24);
        m = Math.floor(leftTime / 60 % 60);
        s = Math.floor(leftTime % 60);

        if (d < 10) d = "0" + d;
        if (s < 10) s = "0" + s;
        if (m < 10) m = "0" + m;
        if (h < 10) h = "0" + h;
      } else {
        d = '00';
        h = '00';
        m = '00';
        s = '00';
        clearInterval(interval);
        interval = null;
      }
      leftTime--
      let obj = {
        d: d,
        h: h,
        m: m,
        s: s,
        leftTime: leftTime
      }

      fn && fn(obj)

    }, 1000)
  }

  /*
  调整设备布局
  参数
  fn：回调函数
 */

  getEquipment (fn) {
    wx.getSystemInfo({
      success: function (res) {
        const name = 'iPhone X', name2 = 'iPhone11';
        if (res.model.indexOf(name) > -1 || res.model.indexOf(name2) > -1) {
          fn && fn();
        }
      }
    })
  }

}

export default Util;