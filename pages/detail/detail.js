//pages/detail/detail.js
const app = getApp()
const util = require('../../utils/util.js')
import event from '../../utils/event'


Page({
  data: {
    autoplay: true,
    interval: 3000,
    language: '',
    fullProductInfo: {},
    productInfo: {
      details: null,
      images: null,
      brandLogo: null,
      statusMessage: ""
    },
    trustLogo: "../../image/Loading_icon.gif",
    trustLogoDescription: "",
    hasFullPremission: false, // For checking user authorized both location and userinfo
    hasUserInfoPermission: false,
    dummyData: {},
    currentTag: ""
  },

  onLoad: function(options) {
    wx.hideTabBar({})
    wx.showLoading({
      title: "",
      mask: true
    })
    //locale
    this.setLanguage()
    event.on("languageChanged", this, this.setLanguage)

    // Set product description
    this.setData({
      trustLogoDescription: this.data.language
    })
    // this.checkUserInfoPermission().then((res) => {
    //   if ()
    // })
    var tag = ""
    if (options.hasOwnProperty("q")) { // Handle deep link
      tag = decodeURIComponent(options.q)
    } else {
      tag = options.tag
    }
    // Pass form last page
    var uuid = "wechat"
    // Get History First before Get and Post back Location to server
    wx.showLoading()
    this.setData({
      currentTag: tag
    })
    var url = `${app.globalData.blockChainAPI.FQDN}${app.globalData.blockChainAPI.getRecordByTagID}`
    this.checkFullPermissionPostRelatedInfo().then((checkPermissionRes) => {
      wx.request({
        url: url,
        method: "POST",
        data: {
          tagId: tag,
          lang: wx.T.locale
        },
        header: {
          Authorization: app.globalData.blockChainAPI.bearerToken
        },
        dataType: "string",
        success: res => {
          // API request success
          // Since returned data cannot parse to JSON, remote the newline and tab forst
          var dataJSON = JSON.parse(res.data.replace(/\n|\t/g, ''))
          // var dataJSON = res.data.replace(/\n/g, '')
          // var dataJSON = JSON.parse(dataJSON.replace(/\t/g, ''))
          // var dataJSON = JSON.parse(res.data)
          var imageUrls = []
          var brandLogo = null
          // The statusMessage shoud be only named as statusMsg from API
          if (dataJSON["status"].trim() == "success") {
            // Found the product without error
            var statusMessage = dataJSON["statusMsg"]
            var pInfo = dataJSON["record"]
            for (var key in pInfo) {
              // It its the image array, set to display in swiper
              if (Array.isArray(pInfo[key])) {
                if (key.toUpperCase().includes("IMAGE")) {
                  imageUrls = pInfo[key]
                }
                //Remove any array from display, not support to display in the list
                delete pInfo[key]
              } else if (pInfo[key].includes("http")) { //or if its an URL
                if (key.toUpperCase().includes("BRAND") && key.toUpperCase().includes("LOGO")) {
                  // if it's a brand logo
                  brandLogo = pInfo[key]
                }
                delete pInfo[key]
              }
            }
            this.setData({
              fullProductInfo: dataJSON,
              productInfo: {
                details: pInfo,
                images: imageUrls,
                brandLogo: brandLogo,
                statusMessage: statusMessage
              },
              trustLogo: "../../image/trust.gif"
            });
          } else { // API return with error message
            wx.showModal({
              content: dataJSON["reason"],
              showCancel: false
            })
          }
          wx.hideLoading()
        },
        fail: err => {
          // API Request failed
          wx.hideLoading()
          wx.showModal({
            title: this.data.language.requestError,
            content: err,
            showCancel: false
          })
        },
        complete: (res) => {
          // After the finished of rquest Product Info, post back the locaiton info to blockchain API
          // var url = `${app.globalData.blockChainAPI.FQDN}${app.globalData.blockChainAPI.postRelatedInfo}`
          // var currentGPS = "0,0"
          // Get Current Location of user
          wx.hideLoading()
        }
      })
    })
  },

  setLanguage() {
    this.setData({
      language: wx.T.getLanguage()
    });
  },

  backhome: function() {
    wx.navigateBack({})
  },

  moreInfo: function() {
    var productInfo = JSON.stringify(this.data.fullProductInfo);
    wx.navigateTo({
      url: `../infoDetail/infoDetail?fullProductInfo=${productInfo}&currentTag=${this.data.currentTag}`
    })
  },

  btnLogin2_Click: function(e) {
    wx.showLoading()
    this.grantFullPermission().then((res) => {
      if (e.detail.userInfo != null) {
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
          userInfo: e.detail.userInfo,
          hasUserInfo: true
        })
        this.grantFullPermission().then(() => {
          this.checkFullPermissionPostRelatedInfo().then((res) => {
            if (res) {

            }
          })
        })
      } else {
        wx.showModal({
          content: this.data.language.loginFailed,
          showCancel: false
        })
      }
    })
    wx.hideLoading()
    // if (e.details.userInfo != null) {
    //   this.grantFullPermission().then(() => {
    //     this.checkFullPermissionPostRelatedInfo().then((res) => {
    //       wx.hideLoading()
    //       if (res) {
    //       }
    //     })
    //   })
    // }

  },
  checkFullPermissionPostRelatedInfo() { // Check if user has full premissions
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success: (res) => {
          var authSettings = res.authSetting
          if ((authSettings.hasOwnProperty("scope.userInfo") && authSettings.hasOwnProperty("scope.userLocation") && authSettings["scope.userInfo"] && authSettings["scope.userLocation"])) {
            // Authorize all permissions
            this.setData({
              hasFullPremission: true
            })
            // PostRelatedInfo
            var url = `${app.globalData.blockChainAPI.FQDN}${app.globalData.blockChainAPI.postRelatedInfo}`
            var currentGPS = "0,0"
            wx.getLocation({
              success: res => {
                currentGPS = `${res.latitude},${res.longitude}`
                var weChatIDContent = JSON.stringify(app.globalData.userInfo).replace(/"/g, "'");
                var deviceInfoContent = JSON.stringify(app.globalData.systemInfo).replace(/"/g, "'");
                //Post to API
                wx.request({
                  url: url,
                  method: "POST",
                  header: {
                    Authorization: app.globalData.blockChainAPI.bearerToken
                  },
                  data: {
                    tagId: this.data.currentTag,
                    info: {
                      GPS: currentGPS,
                      WeChatID: weChatIDContent,
                      DeviceInfo: deviceInfoContent
                    }
                  },
                  success: res => {

                  },
                  fail: err => {

                  }
                })
              },
              fail: err => {

              }
            })
            resolve(true)
          } else {
            console.log("checkFullPermission !hasFullPremission")
            this.setData({
              hasFullPremission: false
            })
            resolve(false)
          }
        }
      })
    })
  },
  checkLocationPermission() {

  },
  checkUserInfoPermission() {
    // return new Promise((resolve, reject) => {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting["scope.userInfo"]) {
          this.setData({
            hasUserInfoPermission: true
          })
        }
      }
    })
    // })
  },
  grantFullPermission() { // Grant and attempt to ask user to provide premissions
    return new Promise((resolve, reject) => {
      console.log("000000 grantFullPermission")
      wx.getSetting({
        success: (res) => {
          var authSettings = res.authSetting
          if ((authSettings.hasOwnProperty("scope.userInfo") && authSettings.hasOwnProperty("scope.userLocation") && authSettings["scope.userInfo"] && authSettings["scope.userLocation"])) {
            console.log("111111")
            this.setData({
              hasFullPremission: true
            })
            resolve(true)
          } else {
            if (!authSettings.hasOwnProperty("scope.userInfo")) { // Not yet ask for userInfo premission
              //Can only handle by clicking button
              console.log("222222")
              resolve(false)
            }
            if (!authSettings.hasOwnProperty("scope.userLocation")) { // Not yet ask for userLocation premission
              console.log("333333")
              wx.authorize({
                scope: 'scope.userLocation',
                success: (res) => {
                  // this.setData({
                  //   hasFullPremission: true
                  // })
                  this.checkFullPermissionPostRelatedInfo().then((res) => {
                    console.log("666666", res)
                    resolve(true)
                  })
                },
                fail: (err) => {
                  this.setData({
                    hasFullPremission: false
                  })
                  wx.showModal({
                    content: this.data.language.loginFailed,
                    showCancel: false
                  })
                  resolve(false)
                }
              })
            } else if (!authSettings["scope.userLocation"]) {
              console.log("444444")
              wx.showModal({
                content: this.data.language.setPremisison,
                showCancel: false,
                success: () => {
                  wx.openSetting({
                    success: (res) => {
                      console.log("555555")
                      console.log("wx.openSetting success", res)
                      this.checkFullPermissionPostRelatedInfo().then((res) => {
                        console.log("666666", res)
                        resolve(true)
                      })
                    }
                  })
                }
              })
            }
          }
        }

      })
    })
  },
  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function() {},

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function() {},

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