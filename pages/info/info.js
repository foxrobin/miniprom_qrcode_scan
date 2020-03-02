//info.js
const util = require('../../utils/util.js')
const app = getApp()

Page({
  data: {
    logs: [],
    url: app.globalData.infoUrl
  },
  onLoad: function() {
    // this.setData({
    //   url: app.globalData.infoUrl
    // })
    // console.log("dasdhsakhdjskdha direct to Link: ", this.data.url)
  },
  onShow: function() {
    // this.setData({
    //   url: app.globalData.infoUrl
    // })
    // console.log("dasdhsakhdjskdha direct to Link: ", this.data.url)
  },
  onHide: function() {
    // this.setData({
    //   url: app.globalData.infoUrl
    // })
    // console.log("dasdhsakhdjskdha direct to Link: ", this.data.url)
  },

  setLanguage() {
    this.setData({
      language: wx.T.getLanguage()
    });
    this.data.shouldChangeTitle = true;
  },

})
