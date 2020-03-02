// pages/brand/brand.js
const app = getApp()
const util = require('../../utils/util.js')
import event from '../../utils/event'

Page({

  /**
   * Page initial data
   */
  data: {
    brandList: []
  },
 
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.setLanguage()
    event.on("languageChanged", this, this.setLanguage)
    // Get Top 5 brands from API
    var url = `${app.globalData.blockChainAPI.FQDN}${app.globalData.blockChainAPI.getTop5Brand}`
    wx.request({
      url: url,
      method: "POST",
      header: {
        Authorization: app.globalData.blockChainAPI.bearerToken
      },
      success: res => {
        console.log(res)
        this.setData({
          brandList: res.data.brands
        })
      }
    })
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  },
  
  setLanguage() {
    this.setData({
      language: wx.T.getLanguage()
    });
  },

})