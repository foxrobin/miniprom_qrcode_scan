// pages/listDetail/listDetail.js
Page({

  /**
   * Page initial data
   */
  data: {
    listDataView: [],
    language: '',
    currentTag: ''
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.setLanguage()
    console.log("listDetail.js -> onLoad(options)", options)
    var listDataJSON = JSON.parse(options.listData)
    console.log("listData", listDataJSON)
    this.setData({
      listDataView: listDataJSON,
      currentTag: options.currentTag
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
  mapDetail: (event) => {
    // Get the data that pass by click event
    console.log("mapDetail event", event.currentTarget.dataset.querystring)
    var queryString = JSON.stringify(event.currentTarget.dataset.querystring)
    console.log("mapDetail queryString", queryString)
    wx.navigateTo({
      url: `../listDetail2/listDetail2?mapData=${queryString}`
    })
  },
  setLanguage() {
    this.setData({
      language: wx.T.getLanguage()
    });
  },
  fullHistory_click: function () {
    wx.navigateTo({
      url: `../listDetailFull/listDetailFull?currentTag=${this.data.currentTag}`
    })
  }
})