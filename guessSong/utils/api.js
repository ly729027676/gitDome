import Base from './base.js';

class GetApi {
  constructor(data = {}) {
    this._data = data;
  }

  getData(fn) {
    const base = new Base(this._data);
    base.request().then((res) => {
      console.log(JSON.stringify(res));
      if (res.ret != 0) {
        wx.showToast({
          title: res.errmsg,
          icon: 'none'
        })
        return
      }

      fn && fn(res);
    }, (err) => {
      console.log(JSON.stringify(err) + '请求失败'+_data.url);
    })
  }
  
}

export default GetApi;