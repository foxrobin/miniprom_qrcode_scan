// pages/listDetail2/listDetail2.js
Page({

  /**
   * Page initial data
   */
  data: {
    latitude: 23.099994,
    longitude: 113.324520,
    markers: [{
      id: 1,
      latitude: 23.099994,
      longitude: 113.344520,
      iconPath: '../../image/location.png',
      title: "Title 1",
      label: {
        content: "label content 1"
      }
    }]
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function(options) {
    console.log("listDetail2.js -> onLoad(options)", options)
    var mapDataJSON = JSON.parse(options.mapData)
    console.log("mapDataJSON", mapDataJSON)
    var mapData = mapDataJSON.split(",")
    console.log("mapData", mapData[0])
    console.log("mapData", mapData[1])
    var latitude = mapData[0]
    var longitude = mapData[1]
    this.setData({
      latitude: latitude,
      longitude: longitude,
      markers: [{
        id: 0,
        latitude: latitude,
        longitude: longitude,
        width: 50,
        height: 50
      }],
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