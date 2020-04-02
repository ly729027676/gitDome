/**
 * 文件工具
 */
let fileUtils = {
  /**
   * 保存临时文件到本地
   */
  saveFileToLocal: function(tempFile, cb, fcb) {
    let fileMgr = wx.getFileSystemManager();
    fileMgr.saveFile({
      tempFilePath: tempFile,
      success: cb,
      fail: fcb
    });
  },

  /**
   * 获取文件是否存在
   */
  checkFileIsExist: function(tempFile, cb, fcb) {
    let fileMgr = wx.getFileSystemManager();
    fileMgr.getFileInfo({
      filePath: tempFile,
      success: cb,
      fail: fcb
    });
  },

  /**
   * 下载图片
   */
  downFile: function(url, cb, fcb) {
    wx.downloadFile({
      url: url,
      success: function(res) {
        wx.getImageInfo({
          src: res.tempFilePath,
          success: cb,
          fail: fcb
        });
      },
      fail: fcb
    });
  },
  /**
   * 上传图片
   */
  uploadFile: function(up_data = {}, cb, fcb, ccb) {
    let url = up_data.url;
    let filePath = up_data.filePath;
    let name = up_data.name;
    console.error(url,':url')
    console.error(filePath, ':filePath')
    wx.uploadFile({
      url,
      filePath,
      name,
      success: cb,
      fail: fcb,
      complete: ccb
    })
  },

  /**
   * 删除文件,同步
   */
  delFileSync: function(path) {
    let filePath = path || '';
    let fileMgr = wx.getFileSystemManager();
    fileMgr.unlinkSync(filePath);
  }
};

module.exports = fileUtils;