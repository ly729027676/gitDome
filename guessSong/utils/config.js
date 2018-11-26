const Constants = {
  // DOMAIN_URL: 'https://shop.quyifun.com/',
  // DOMAIN_Img_URL: 'https://shop.quyifun.com/media/',
  // UPDOMAIN_Img_URL: 'https://shop.quyifun.com/',
  versions_num: 10010,
  DOMAIN_URL: 'https://shop-test.quyifun.com/',
  DOMAIN_Img_URL: 'https://shop-test.quyifun.com/media/',
  UPDOMAIN_Img_URL: 'https://shop-test.quyifun.com/'
}

//函数节流 防止用户多次点击按钮打开多个页面
function throttle(fn, gapTime) {
  if (gapTime == null || gapTime == undefined) {
    gapTime = 1500
  }
  let _lastTime = null
  // 返回新的函数    
  return function () {
    let _nowTime = +new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(this, arguments)
      //将this和参数传给原函数
      _lastTime = _nowTime
    }
  }
}

module.exports = {
  Constants,
  throttle: throttle
}