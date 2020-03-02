//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: []
  },
  onLoad: function () {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
    this.setLanguage()
  },
  onShow: function () {
    if (this.data.shouldChangeTitle) {
      wx.T.setNavigationBarTitle();
      this.data.shouldChangeTitle = false;
    }
  },
  setLanguage() {
    this.setData({
      language: wx.T.getLanguage()
    });
    this.data.shouldChangeTitle = true;
  }
})
