// pages/infoDetail/infoDetail.js
const app = getApp()
const util = require('../../utils/util.js')
import event from '../../utils/event'

Page({
  data: {
    language: '',
    currentLongitude: 0,
    currentLatitude: 0,
    displayDetails: {},
    currentTag: ""
  },

  onLoad: function (options) {
    // Handle deep link
    this.setLanguage()
    // Data from last page
    var queryData = JSON.parse(options.fullProductInfo)
    // Get current location of user
    console.log("777 options:", options)
    wx.getLocation({
      success: (res) => {
        this.setData({
          currentLatitude: res.latitude,
          currentLongitude: res.longitude
        })
      },
    })
    this.setData({
      fullProductInfo: queryData,
      currentTag: options.currentTag
    })
    console.log("777 this.data:", this.data)
    var displayDetails = queryData
    var displayDetailsView = []
    var contentIndex = [];
    // Hard Code that remove the first 3 node
    var i = 0
    for (var key in displayDetails) {
      if (i < 3) {
        delete displayDetails[key]
        i++
      } else {
        break
      }
    }

    i = 0
    for (var key in displayDetails) {
      // Check if the current node is special type
      if (displayDetails[key].hasOwnProperty("type")) {
        // Special Type
        if (displayDetails[key]["type"].toLowerCase() == "map") {
          var displayInfoTemp = {}
          displayInfoTemp["id"] = i
          displayInfoTemp["type"] = displayDetails[key]["type"].toLowerCase()
          displayInfoTemp["title"] = key
          var m = 0
          var displayValueTemp = []
          for (var valKey in displayDetails[key]["displayValue"]) {
            var displayMapValueTemp = {}
            // GPS location
            var points = displayDetails[key]["displayValue"][valKey]["gps"].split(",")
            var mapLatitude = points[0]
            var mapLongitude = points[1]
            // Store name
            var mapTitle = displayDetails[key]["displayValue"][valKey]["name"]
            // Add to temp map value
            displayMapValueTemp["id"] = m
            displayMapValueTemp["latitude"] = mapLatitude
            displayMapValueTemp["longitude"] = mapLongitude
            displayMapValueTemp["title"] = mapTitle
            // And push to displayValue array
            displayValueTemp.push(displayMapValueTemp)
            m++
          }
          displayInfoTemp["displayValue"] = displayValueTemp
          displayDetailsView.push(displayInfoTemp)
        } else if (displayDetails[key]["type"].toLowerCase() == "history") {
          var displayInfoTemp = {}
          displayInfoTemp["id"] = i
          displayInfoTemp["type"] = displayDetails[key]["type"].toLowerCase()
          displayInfoTemp["title"] = key
          // displayInfoTemp["total"] = displayDetails[key]["displayValue"].length
          //Determine the displayValue in infoDetail page
          displayInfoTemp["displayValue"] = {}
          for (var key1 in displayDetails[key]) {
            console.log("displayDetails[key]", displayDetails[key])
            if (!["type", "displayValue"].includes(key1)) {
              displayInfoTemp["displayValue"][key1] = displayDetails[key][key1]
            }
          }
          displayInfoTemp["displayValueDetail"] = displayDetails[key]["displayValue"]
          //Push to View Object
          displayDetailsView.push(displayInfoTemp)
        } else {
          var displayInfoTemp = {}
          displayInfoTemp["id"] = i
          displayInfoTemp["type"] = displayDetails[key]["type"].toLowerCase()
          displayInfoTemp["title"] = key
          displayInfoTemp["displayValue"] = displayDetails[key]["displayValue"]
          //Push to View Object
          displayDetailsView.push(displayInfoTemp)
        }
      } else {
        // General Type
        console.log("GeneralType", key)
        var displayInfoTemp = {}
        displayInfoTemp["id"] = i
        displayInfoTemp["type"] = "general"
        displayInfoTemp["title"] = key
        displayInfoTemp["displayValue"] = displayDetails[key]
        //Push to View Object
        displayDetailsView.push(displayInfoTemp)
      }
      i++
    }
    console.log("displayDetailsView", displayDetailsView)
    this.setData({
      displayDetails: displayDetailsView
    })

    // delete queryData[contentIndex[2]][traceIndex[3]]
    // delete queryData[contentIndex[3]][0]
    // var sdate = queryData[contentIndex[2]][traceIndex[1]]
    // var date = new Date(sdate);
    // queryData[contentIndex[2]][traceIndex[1]] = date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()


    // var countindex = []
    // for (var i = 0; i < Object.keys(queryData).length; i++) {
    //   countindex.push(Object.keys(queryData)[i])
    // }
    // this.setData({
    //   outindex: countindex
    // })

    // var marker = []
    // for (var i = 0; i < queryData[contentIndex[5]].length; i++) {
    //   var data = queryData[contentIndex[5]][i]

    //   var latlog = data[Object.keys(data)[0]].split(",");
    //   var lat = latlog[0]
    //   var log = latlog[1]
    //   var label = data[Object.keys(data)[1]]
    //   marker.push({
    //     "id": 1,
    //     "latitude": lat,
    //     "longitude": log,
    //     "iconPath": '/image/location.png',
    //     "title": 'Title 2',
    //     "label": {
    //       'content': label
    //     }
    //   })
    // }

    // this.setData({
    //   markers: marker
    // })

  },
  onReady: function () {

  },

  onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {

  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  },
  setLanguage() {
    this.setData({
      language: wx.T.getLanguage()
    });
  },
  listMoreDetailsClick: function (event) {
    // Get the data that pass by click event
    var queryString = JSON.stringify(event.currentTarget.dataset.querystring)
    wx.navigateTo({
      url: `../listDetail/listDetail?listData=${queryString}&currentTag=${this.data.currentTag}`
    })
  }
})