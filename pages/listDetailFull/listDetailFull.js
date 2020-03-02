// pages/listDetailFull/listDetailFull.js
const app = getApp()
const util = require('../../utils/util.js')
import event from '../../utils/event'

Page({
  /**
   * Page initial data
   */
  data: {
    listDataView: null,
    currentTag: ""
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function(options) {
    this.setData({
      currentTag: options.currentTag
    })
    var url = `${app.globalData.blockChainAPI.FQDN}${app.globalData.blockChainAPI.getScanRecord}`
    wx.request({
      url: url,
      method: "POST",
      data: {
        tagId: this.data.currentTag
      },
      header: {
        Authorization: app.globalData.blockChainAPI.bearerToken
      },
      success: (res) => {
        this.setData({
          listDataView: res.data.displayValue
        })
      } 
    })
  },
  mapDetail: (event) => {
    // Get the data that pass by click event
    console.log("mapDetail event", event.currentTarget.dataset.querystring)
    var queryString = JSON.stringify(event.currentTarget.dataset.querystring)
    console.log("mapDetail queryString", queryString)
    wx.navigateTo({
      url: `../listDetail2/listDetail2?mapData=${queryString}`
    })
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function() {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function() {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function() {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function() {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function() {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function() {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function() {

  }
})