let cache = {
  location: '', //获取当前位置
  has_location: true, // true 没有获取用户授权
  has_login: true, // true 没有获取用户登录授权
  phoneIp: '', //获取当前手机的IP
}

module.exports = cache