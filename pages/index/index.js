//index.js
const app = getApp()
const util = require('../../utils/util.js')
import event from '../../utils/event'

let tnc = "Privacy Policy for the use of Mobile Application" +
  "When you use our mobile application, we may use GPS technology(or other similar technology) to determine your current location" +
  "in order to determine the city you are located within and display a location map.The information we collect includes your mobile" +
  "phone operating system(i.e..Android, iOS) and your current geographical location from your mobile phone’s GPS component.The use of" +
  "the GPS information is solely for the purpose of identifying the location where the scanning and authentication of the product in" +
  "question is being conducted.This is important when verifying the product provenance through our traceability feature to detect any" +
  "suspicious fraudulent product.The collection of GPS information only active when you use the mobile application, once you exit the application, our application will no longer collect any information from your mobile device." +
  "We are concerned about safeguarding the confidentiality of your information.Please be aware that, although we endeavour provide reasonable security for information we process and maintain, no security system can prevent all potential security breaches." +
  "If you do not want to use your location for the purposes set for the above, you should turn off the location services for the mobile application.The information we collected will not be disclosed to any other parties non for the use of any marketing activities.We will retain the collected information for as long as you use our mobile application and for a reasonable time thereafter."


Page({
  data: {
    // motto: 'trustME',
    motto: 'Kclub',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    language: '',
    // languages: ['简体中文', 'English'],
    langIndex: 0,
    hasFullPremission: false, // For checking user authorized both location and userinfo
  },
  onLoad: function (options) {
    // if(false){
    if (options.q !== undefined) {
      let q = decodeURIComponent(options.q);
      //截取参数  options.q ='域名地址?bedcode=12345678';
      let bedcodeParams = that.getQueryVariable(q, 'bedcode');
      var tag = ""
      if (options.hasOwnProperty("q")) { // Handle deep link
        tag = decodeURIComponent(options.q)
      } else {
        tag = options.tag
      }
      // Pass form last page
      var uuid = "wechat"
      // Get History First before Get and Post back Location to server  
      

      wx.showLoading({
        title: '',
        mask: true
      })
      console.log("scan data : ", tag)
      var array = tag.split("/")
      var a = array.length
      var uniqId = array[a - 1].split("(")[0]

      var fullTagId = 'https://www.trustmecare.com/t/' + uniqId

      app.globalData.agentInfo.tagId = fullTagId
      var urlGetAgentDta = `${app.globalData.blockChainAPI.FQDN2}${app.globalData.blockChainAPI.getRecordByTagID}`
      var urlLogRecord = `${app.globalData.blockChainAPI.FQDN2}${app.globalData.blockChainAPI.postRelatedInfo}`
      var weChatIDContent = JSON.stringify(app.globalData.userInfo).replace(/"/g, "'");
      var deviceInfoContent = JSON.stringify(app.globalData.systemInfo).replace(/"/g, "'");

      var currentGPS = "0,0"
      wx.getLocation({
        success: res => {
          currentGPS = `${res.latitude},${res.longitude}`
          // console.log('dasdasdasdasdasdasdasdas',currentGPS)

          // log record to server here
          wx.request({
            url: urlLogRecord,
            method: "POST",
            header: {
              'Ocp-Apim-Subscription-Key': app.globalData.blockChainAPI.trustMeKey,
            },
            data: {
              tagId: fullTagId,
              info: {
                GPS: currentGPS,
                WeChatID: weChatIDContent,
                DeviceInfo: deviceInfoContent
              }
            },
            success: res => {
              console.log('call log Success and continue to get agent data')
              // get agent data from server
              wx.request({
                url: urlGetAgentDta,
                method: "POST",
                header: {
                  'Ocp-Apim-Subscription-Key': app.globalData.blockChainAPI.trustMeKey,
                },
                data: {
                  tagId: fullTagId,
                  lang: "en"
                },
                success: res => {
                  //Only go to next page if record exist
                  if (res != null && res.statusCode == 200 && res.data.status != "fail") {
                    // wx.navigateTo({
                    //   url: `../detail/detail?tag=${tag}`
                    // })
                    console.log('get agent data success (english)')
                    console.log(res.data)
                    var length = res.data.record.Tabs.length

                    app.globalData.agentInfo.department = res.data.record.Tabs[1].content
                    app.globalData.agentInfo.email = res.data.record.Tabs[3].content
                    app.globalData.agentInfo.tel = res.data.record.Tabs[2].content
                    app.globalData.agentInfo.position = res.data.record.Tabs[0].content
                    app.globalData.agentInfo.images = res.data.record.Image[0]
                    app.globalData.agentInfo.name = res.data.record.Header.Title + res.data.record.Header.Subtitle
                    app.globalData.agentInfo.company = res.data.record.Tabs[4].content
                    app.globalData.agentInfo.address = res.data.record.Tabs[5].content
                    app.globalData.lastcalledtime = res.data.record.Tabs[length - 1].complexcontent[0].content
                    app.globalData.lastcalledlocation = res.data.record.Tabs[length - 1].complexcontent[1].content
                    app.globalData.totalscantimes = res.data.record.Tabs[length - 1].complexcontent[2].content

                    console.log(app.globalData.agentInfo)

                    // get CH-TW data here
                    wx.request({
                      url: urlGetAgentDta,
                      method: "POST",
                      header: {
                        'Ocp-Apim-Subscription-Key': app.globalData.blockChainAPI.trustMeKey,
                      },
                      data: {
                        tagId: fullTagId,
                        lang: "zh-Hant"
                      },
                      success: resZh => {
                        //Only go to next page if record exist
                        if (resZh != null && resZh.statusCode == 200 && resZh.data.status != "fail") {
                          // wx.navigateTo({
                          //   url: `../detail/detail?tag=${tag}`
                          // })
                          console.log('get agent data success  (chinese)')
                          console.log(resZh.data)
                          var length = resZh.data.record.Tabs.length


                          app.globalData.agentInfoHant.departmentHant = resZh.data.record.Tabs[1].content
                          app.globalData.agentInfoHant.emailHant = resZh.data.record.Tabs[3].content
                          app.globalData.agentInfoHant.telHant = resZh.data.record.Tabs[2].content
                          app.globalData.agentInfoHant.positionHant = resZh.data.record.Tabs[0].content
                          app.globalData.agentInfoHant.imagesHant = resZh.data.record.Image[0]
                          app.globalData.agentInfoHant.nameHant = resZh.data.record.Header.Title + res.data.record.Header.Subtitle
                          app.globalData.agentInfoHant.companyHant = resZh.data.record.Tabs[4].content
                          app.globalData.agentInfoHant.addressHant = resZh.data.record.Tabs[5].content
                          app.globalData.lastcalledtimeHant = resZh.data.record.Tabs[length - 1].complexcontent[0].content
                          app.globalData.lastcalledlocationHant = resZh.data.record.Tabs[length - 1].complexcontent[1].content
                          app.globalData.totalscantimesHant = resZh.data.record.Tabs[length - 1].complexcontent[2].content

                          console.log(app.globalData.agentInfoHant)
                          wx.navigateTo({
                            url: `../agent/agent`
                          })
                        } else if (res.data.status == "fail") {
                          wx.showModal({
                            content: res.data.reason,
                            showCancel: false
                          })
                        } else {
                          wx.showModal({
                            content: this.data.language.productNotFound,
                            showCancel: false
                          })
                        }
                      },
                      fail: err => {
                        console.log(err)
                        wx.showModal({
                          title: this.data.language.productNotFound,
                          content: err.result,
                          showCancel: false
                        })
                      },
                      complete: res => {
                        // wx.hideLoading()
                      }
                    })

                  } else if (res.data.status == "fail") {
                    wx.showModal({
                      content: res.data.reason,
                      showCancel: false
                    })
                  } else {
                    wx.showModal({
                      content: this.data.language.productNotFound,
                      showCancel: false
                    })
                  }
                },
                fail: err => {
                  console.log(err)
                  wx.showModal({
                    title: this.data.language.productNotFound,
                    content: err.result,
                    showCancel: false
                  })
                },
                complete: res => {
                  // wx.hideLoading()
                }
              })
            },
            fail: err => {
              console.log('call log Failed')
              console.log(err)
              wx.hideLoading()
            }
          })
        },
        fail: err => {
          console.log('get location failed')
          currentGPS = "0,0"
          // wx.hideLoading()
          // wx.showModal({
          //   content: this.data.language.setPremisison,
          //   showCancel: false,
          //   success: () => {
          //     wx.openSetting({
          //       success: (res) => {

          //       }
          //     })
          //   }
          // })

          wx.request({
            url: urlLogRecord,
            method: "POST",
            header: {
              'Ocp-Apim-Subscription-Key': app.globalData.blockChainAPI.trustMeKey,
            },
            data: {
              tagId: fullTagId,
              info: {
                GPS: currentGPS,
                WeChatID: weChatIDContent,
                DeviceInfo: deviceInfoContent
              }
            },
            success: res => {
              console.log('call log Success and continue to get agent data')
              // get agent data from server
              wx.request({
                url: urlGetAgentDta,
                method: "POST",
                header: {
                  'Ocp-Apim-Subscription-Key': app.globalData.blockChainAPI.trustMeKey,
                },
                data: {
                  tagId: fullTagId,
                  lang: "en"
                },
                success: res => {
                  //Only go to next page if record exist
                  if (res != null && res.statusCode == 200 && res.data.status != "fail") {
                    // wx.navigateTo({
                    //   url: `../detail/detail?tag=${tag}`
                    // })
                    console.log('get agent data success (english)')
                    console.log(res.data)
                    var length = res.data.record.Tabs.length

                    app.globalData.agentInfo.department = res.data.record.Tabs[1].content
                    app.globalData.agentInfo.email = res.data.record.Tabs[3].content
                    app.globalData.agentInfo.tel = res.data.record.Tabs[2].content
                    app.globalData.agentInfo.position = res.data.record.Tabs[0].content
                    app.globalData.agentInfo.images = res.data.record.Image[0]
                    app.globalData.agentInfo.name = res.data.record.Header.Title + res.data.record.Header.Subtitle
                    app.globalData.agentInfo.company = res.data.record.Tabs[4].content
                    app.globalData.agentInfo.address = res.data.record.Tabs[5].content
                    app.globalData.lastcalledtime = res.data.record.Tabs[length - 1].complexcontent[0].content
                    app.globalData.lastcalledlocation = res.data.record.Tabs[length - 1].complexcontent[1].content
                    app.globalData.totalscantimes = res.data.record.Tabs[length - 1].complexcontent[2].content

                    console.log(app.globalData.agentInfo)

                    // get CH-TW data here
                    wx.request({
                      url: urlGetAgentDta,
                      method: "POST",
                      header: {
                        'Ocp-Apim-Subscription-Key': app.globalData.blockChainAPI.trustMeKey,
                      },
                      data: {
                        tagId: fullTagId,
                        lang: "zh-Hant"
                      },
                      success: resZh => {
                        //Only go to next page if record exist
                        if (resZh != null && resZh.statusCode == 200 && resZh.data.status != "fail") {
                          // wx.navigateTo({
                          //   url: `../detail/detail?tag=${tag}`
                          // })
                          console.log('get agent data success  (chinese)')
                          console.log(resZh.data)
                          var length = resZh.data.record.Tabs.length


                          app.globalData.agentInfoHant.departmentHant = resZh.data.record.Tabs[1].content
                          app.globalData.agentInfoHant.emailHant = resZh.data.record.Tabs[3].content
                          app.globalData.agentInfoHant.telHant = resZh.data.record.Tabs[2].content
                          app.globalData.agentInfoHant.positionHant = resZh.data.record.Tabs[0].content
                          app.globalData.agentInfoHant.imagesHant = resZh.data.record.Image[0]
                          app.globalData.agentInfoHant.nameHant = resZh.data.record.Header.Title + res.data.record.Header.Subtitle
                          app.globalData.agentInfoHant.companyHant = resZh.data.record.Tabs[4].content
                          app.globalData.agentInfoHant.addressHant = resZh.data.record.Tabs[5].content
                          app.globalData.lastcalledtimeHant = resZh.data.record.Tabs[length - 1].complexcontent[0].content
                          app.globalData.lastcalledlocationHant = resZh.data.record.Tabs[length - 1].complexcontent[1].content
                          app.globalData.totalscantimesHant = resZh.data.record.Tabs[length - 1].complexcontent[2].content

                          console.log(app.globalData.agentInfoHant)
                          wx.navigateTo({
                            url: `../agent/agent`
                          })
                        } else if (res.data.status == "fail") {
                          wx.showModal({
                            content: res.data.reason,
                            showCancel: false
                          })
                        } else {
                          wx.showModal({
                            content: this.data.language.productNotFound,
                            showCancel: false
                          })
                        }
                      },
                      fail: err => {
                        console.log(err)
                        wx.showModal({
                          title: this.data.language.productNotFound,
                          content: err.result,
                          showCancel: false
                        })
                      },
                      complete: res => {
                        // wx.hideLoading()
                      }
                    })

                  } else if (res.data.status == "fail") {
                    wx.showModal({
                      content: res.data.reason,
                      showCancel: false
                    })
                  } else {
                    wx.showModal({
                      content: this.data.language.productNotFound,
                      showCancel: false
                    })
                  }
                },
                fail: err => {
                  console.log(err)
                  wx.showModal({
                    title: this.data.language.productNotFound,
                    content: err.result,
                    showCancel: false
                  })
                },
                complete: res => {
                  // wx.hideLoading()
                }
              })
            },
            fail: err => {
              console.log('call log Failed')
              console.log(err)
              wx.hideLoading()
            }
          })
        }
      })







    }
   else {
      wx.showTabBar()
      wx.getSystemInfo({
        success: (res) => {
          console.log("onLoad getSystemInfo res", res)
          app.globalData.systemInfo = res
          // Check last launch error 
          var lastLaunchError = wx.getStorageSync("LastLaunchError")
          console.log("LastLaunchError", lastLaunchError)
          if (lastLaunchError != null) {
            // Post to Log API
            var errorMessageJSON = {
              title: "WeChat Newrok Error",
              code: lastLaunchError,
              userInfo: app.globalData.userInfo
            }
            // util.postLogAPI(errorMessageJSON)
            wx.setStorageSync("LastLaunchError", null)
          }
          // wx.showModal({
          //   title: 'getSystemInfo',
          //   content: res.language,
          // })
          this.initChangeLanguage(res.language)
        },
        fail: (err) => {
          console.log("onLoad getSystemInfo fail", err)
        },
        complete: (res) => {
          console.log("onLoad getSystemInfo complete", res)
        }
      })
      wx.getStorage({
        key: "tnc-confirm",
        success: res => {
          if (!res) {
            wx.showModal({
              title: "Privacy Policy:Terms and Condition",
              content: tnc,
              showCancel: false,
              success: res => {
                wx.setStorage({
                  key: "tnc-confirm",
                  data: true,
                })
              }
            })
          }
        },
        fail: err => {
          wx.showModal({
            title: "Privacy Policy:Terms and Condition",
            content: tnc,
            showCancel: false,
            success: res => {
              wx.setStorage({
                key: 'tnc-confirm',
                data: true,
              })
            }
          })
        }
      })
      langIndex: wx.getStorageSync('langIndex')
      if (app.globalData.userInfo) {
        this.setData({
          userInfo: app.globalData.userInfo,
          hasUserInfo: true
        })
      } else if (this.data.canIUse) {
        app.userInfoReadyCallback = res => {
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      } else {
        wx.getUserInfo({
          success: res => {
            app.globalData.userInfo = res.userInfo
            this.setData({
              userInfo: res.userInfo,
              hasUserInfo: true
            })
          }
        })
      }
      this.setLanguage();
    }
  },

  onReady: function() {
    wx.getSystemInfo({
      success: function(res) {
        console.log("onReadey getSystemInfo res", res)
      },
      fail: function(err) {
        console.log("onReadey getSystemInfo err", err)
      },
      complete: function(comp) {
        console.log("onReadey getSystemInfo comp", comp)
      }
    })
  },

  getUserInfo: function(e) {
    if (e.detail.userInfo != null) {
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      // this.grantFullPermission().then({})
    } else {
      wx.showModal({
        title: '',
        content: this.data.language.loginFailed,
        showCancel: false
      })
    }
  },

  // changeLanguage(e) {
  //   let index = e.detail.value;
  //   this.setData({ // (1)
  //     langIndex: index
  //   });
  //   wx.T.setLocaleByIndex(index);
  //   this.setLanguage();
  //   event.emit('languageChanged');

  //   wx.setStorage({
  //     key: 'langIndex',
  //     data: this.data.langIndex
  //   })
  // },


  initChangeLanguage(langCode) {
    console.log("initChangeLanguage", langCode)
    // wx.showModal({
    //   title: 'initChangeLanguage',
    //   content: langCode,
    // })
    let index = 0
    switch (langCode.toUpperCase()) {
      case "ZH_CN":
        index = 0
        break
      case "EN":
        index = 1
        break
      case "ZH_HK":
        index = 2
        break
      default:
        index = 2
        break
    }
    this.setData({
      langIndex: index
    });
    wx.T.setLocaleByIndex(index);
    this.setLanguage();
    event.emit('languageChanged');

    wx.setStorage({
      key: 'langIndex',
      data: this.data.langIndex
    })
  },

  setLanguage() {
    this.setData({
      language: wx.T.getLanguage()
    });
    //wx.T.setNavigationBarTitle();
  },

  startScan: function(e) {
    wx.showLoading({
      title: '',
      mask: true
    })
    // Check premission before scanning
    wx.getSetting({
      success: (res) => {
        console.log("wx.getSetting success", res)
        var authSettings = res.authSetting
        console.log('[scope.userInfo]', res.authSetting['scope.userInfo'])
        console.log('[userLocation]', res.authSetting['scope.userLocation'])
        // if ((authSettings.hasOwnProperty("scope.userInfo") && authSettings.hasOwnProperty("scope.userLocation") && authSettings["scope.userInfo"] && authSettings["scope.userLocation"])) {
        // if (authSettings.hasOwnProperty("scope.userInfo") && authSettings["scope.userInfo"] && res.authSetting['scope.userLocation']) {
        if (authSettings.hasOwnProperty("scope.userInfo") && authSettings["scope.userInfo"]) {
          wx.scanCode({
            onlyFromCamera: true,
            success: (res) => {
              // SCAN QR code success
              wx.showLoading({
                title: '',
                mask: true
              })
              console.log("scan data : ", res.result)
              var array = res.result.split("/")
              var a = array.length
              var uniqId = array[a - 1].split("(")[0]

              var fullTagId = 'https://www.trustmecare.com/t/' + uniqId

              app.globalData.agentInfo.tagId = fullTagId
              var urlGetAgentDta = `${app.globalData.blockChainAPI.FQDN2}${app.globalData.blockChainAPI.getRecordByTagID}`
              var urlLogRecord = `${app.globalData.blockChainAPI.FQDN2}${app.globalData.blockChainAPI.postRelatedInfo}`
              var weChatIDContent = JSON.stringify(app.globalData.userInfo).replace(/"/g, "'");
              var deviceInfoContent = JSON.stringify(app.globalData.systemInfo).replace(/"/g, "'");

              var currentGPS = "0,0"
              wx.getLocation({
                success: res => {
                  currentGPS = `${res.latitude},${res.longitude}`
                  // console.log('dasdasdasdasdasdasdasdas',currentGPS)

                  // log record to server here
                  wx.request({
                    url: urlLogRecord,
                    method: "POST",
                    header: {
                      'Ocp-Apim-Subscription-Key': app.globalData.blockChainAPI.trustMeKey,
                    },
                    data: {
                      tagId: fullTagId,
                      info: {
                        GPS: currentGPS,
                        WeChatID: weChatIDContent,
                        DeviceInfo: deviceInfoContent
                      }
                    },
                    success: res => {
                      console.log('call log Success and continue to get agent data')
                      // get agent data from server
                      wx.request({
                        url: urlGetAgentDta,
                        method: "POST",
                        header: {
                          'Ocp-Apim-Subscription-Key': app.globalData.blockChainAPI.trustMeKey,
                        },
                        data: {
                          tagId: fullTagId,
                          lang: "en"
                        },
                        success: res => {
                          //Only go to next page if record exist
                          if (res != null && res.statusCode == 200 && res.data.status != "fail") {
                            // wx.navigateTo({
                            //   url: `../detail/detail?tag=${tag}`
                            // })
                            console.log('get agent data success (english)')
                            console.log(res.data)
                            var length = res.data.record.Tabs.length

                            app.globalData.agentInfo.department = res.data.record.Tabs[1].content
                            app.globalData.agentInfo.email = res.data.record.Tabs[3].content
                            app.globalData.agentInfo.tel = res.data.record.Tabs[2].content
                            app.globalData.agentInfo.position = res.data.record.Tabs[0].content
                            app.globalData.agentInfo.images = res.data.record.Image[0]
                            app.globalData.agentInfo.name = res.data.record.Header.Title + res.data.record.Header.Subtitle
                            app.globalData.agentInfo.company = res.data.record.Tabs[4].content
                            app.globalData.agentInfo.address = res.data.record.Tabs[5].content
                            app.globalData.lastcalledtime = res.data.record.Tabs[length - 1].complexcontent[0].content
                            app.globalData.lastcalledlocation = res.data.record.Tabs[length - 1].complexcontent[1].content
                            app.globalData.totalscantimes = res.data.record.Tabs[length - 1].complexcontent[2].content

                            console.log(app.globalData.agentInfo)

                            // get CH-TW data here
                            wx.request({
                              url: urlGetAgentDta,
                              method: "POST",
                              header: {
                                'Ocp-Apim-Subscription-Key': app.globalData.blockChainAPI.trustMeKey,
                              },
                              data: {
                                tagId: fullTagId,
                                lang: "zh-Hant"
                              },
                              success: resZh => {
                                //Only go to next page if record exist
                                if (resZh != null && resZh.statusCode == 200 && resZh.data.status != "fail") {
                                  // wx.navigateTo({
                                  //   url: `../detail/detail?tag=${tag}`
                                  // })
                                  console.log('get agent data success  (chinese)')
                                  console.log(resZh.data)
                                  var length = resZh.data.record.Tabs.length


                                  app.globalData.agentInfoHant.departmentHant = resZh.data.record.Tabs[1].content
                                  app.globalData.agentInfoHant.emailHant = resZh.data.record.Tabs[3].content
                                  app.globalData.agentInfoHant.telHant = resZh.data.record.Tabs[2].content
                                  app.globalData.agentInfoHant.positionHant = resZh.data.record.Tabs[0].content
                                  app.globalData.agentInfoHant.imagesHant = resZh.data.record.Image[0]
                                  app.globalData.agentInfoHant.nameHant = resZh.data.record.Header.Title + res.data.record.Header.Subtitle
                                  app.globalData.agentInfoHant.companyHant = resZh.data.record.Tabs[4].content
                                  app.globalData.agentInfoHant.addressHant = resZh.data.record.Tabs[5].content
                                  app.globalData.lastcalledtimeHant = resZh.data.record.Tabs[length - 1].complexcontent[0].content
                                  app.globalData.lastcalledlocationHant = resZh.data.record.Tabs[length - 1].complexcontent[1].content
                                  app.globalData.totalscantimesHant = resZh.data.record.Tabs[length - 1].complexcontent[2].content

                                  console.log(app.globalData.agentInfoHant)
                                  wx.navigateTo({
                                    url: `../agent/agent`
                                  })
                                } else if (res.data.status == "fail") {
                                  wx.showModal({
                                    content: res.data.reason,
                                    showCancel: false
                                  })
                                } else {
                                  wx.showModal({
                                    content: this.data.language.productNotFound,
                                    showCancel: false
                                  })
                                }
                              },
                              fail: err => {
                                console.log(err)
                                wx.showModal({
                                  title: this.data.language.productNotFound,
                                  content: err.result,
                                  showCancel: false
                                })
                              },
                              complete: res => {
                                // wx.hideLoading()
                              }
                            })

                          } else if (res.data.status == "fail") {
                            wx.showModal({
                              content: res.data.reason,
                              showCancel: false
                            })
                          } else {
                            wx.showModal({
                              content: this.data.language.productNotFound,
                              showCancel: false
                            })
                          }
                        },
                        fail: err => {
                          console.log(err)
                          wx.showModal({
                            title: this.data.language.productNotFound,
                            content: err.result,
                            showCancel: false
                          })
                        },
                        complete: res => {
                          // wx.hideLoading()
                        }
                      })
                    },
                    fail: err => {
                      console.log('call log Failed')
                      console.log(err)
                      wx.hideLoading()
                    }
                  })
                },
                fail: err => {
                  console.log('get location failed')
                  currentGPS = "0,0"
                  // wx.hideLoading()
                  // wx.showModal({
                  //   content: this.data.language.setPremisison,
                  //   showCancel: false,
                  //   success: () => {
                  //     wx.openSetting({
                  //       success: (res) => {

                  //       }
                  //     })
                  //   }
                  // })
                  
                  wx.request({
                    url: urlLogRecord,
                    method: "POST",
                    header: {
                      'Ocp-Apim-Subscription-Key': app.globalData.blockChainAPI.trustMeKey,
                    },
                    data: {
                      tagId: fullTagId,
                      info: {
                        GPS: currentGPS,
                        WeChatID: weChatIDContent,
                        DeviceInfo: deviceInfoContent
                      }
                    },
                    success: res => {
                      console.log('call log Success and continue to get agent data')
                      // get agent data from server
                      wx.request({
                        url: urlGetAgentDta,
                        method: "POST",
                        header: {
                          'Ocp-Apim-Subscription-Key': app.globalData.blockChainAPI.trustMeKey,
                        },
                        data: {
                          tagId: fullTagId,
                          lang: "en"
                        },
                        success: res => {
                          //Only go to next page if record exist
                          if (res != null && res.statusCode == 200 && res.data.status != "fail") {
                            // wx.navigateTo({
                            //   url: `../detail/detail?tag=${tag}`
                            // })
                            console.log('get agent data success (english)')
                            console.log(res.data)
                            var length = res.data.record.Tabs.length

                            app.globalData.agentInfo.department = res.data.record.Tabs[1].content
                            app.globalData.agentInfo.email = res.data.record.Tabs[3].content
                            app.globalData.agentInfo.tel = res.data.record.Tabs[2].content
                            app.globalData.agentInfo.position = res.data.record.Tabs[0].content
                            app.globalData.agentInfo.images = res.data.record.Image[0]
                            app.globalData.agentInfo.name = res.data.record.Header.Title + res.data.record.Header.Subtitle
                            app.globalData.agentInfo.company = res.data.record.Tabs[4].content
                            app.globalData.agentInfo.address = res.data.record.Tabs[5].content
                            app.globalData.lastcalledtime = res.data.record.Tabs[length - 1].complexcontent[0].content
                            app.globalData.lastcalledlocation = res.data.record.Tabs[length - 1].complexcontent[1].content
                            app.globalData.totalscantimes = res.data.record.Tabs[length - 1].complexcontent[2].content

                            console.log(app.globalData.agentInfo)

                            // get CH-TW data here
                            wx.request({
                              url: urlGetAgentDta,
                              method: "POST",
                              header: {
                                'Ocp-Apim-Subscription-Key': app.globalData.blockChainAPI.trustMeKey,
                              },
                              data: {
                                tagId: fullTagId,
                                lang: "zh-Hant"
                              },
                              success: resZh => {
                                //Only go to next page if record exist
                                if (resZh != null && resZh.statusCode == 200 && resZh.data.status != "fail") {
                                  // wx.navigateTo({
                                  //   url: `../detail/detail?tag=${tag}`
                                  // })
                                  console.log('get agent data success  (chinese)')
                                  console.log(resZh.data)
                                  var length = resZh.data.record.Tabs.length


                                  app.globalData.agentInfoHant.departmentHant = resZh.data.record.Tabs[1].content
                                  app.globalData.agentInfoHant.emailHant = resZh.data.record.Tabs[3].content
                                  app.globalData.agentInfoHant.telHant = resZh.data.record.Tabs[2].content
                                  app.globalData.agentInfoHant.positionHant = resZh.data.record.Tabs[0].content
                                  app.globalData.agentInfoHant.imagesHant = resZh.data.record.Image[0]
                                  app.globalData.agentInfoHant.nameHant = resZh.data.record.Header.Title + res.data.record.Header.Subtitle
                                  app.globalData.agentInfoHant.companyHant = resZh.data.record.Tabs[4].content
                                  app.globalData.agentInfoHant.addressHant = resZh.data.record.Tabs[5].content
                                  app.globalData.lastcalledtimeHant = resZh.data.record.Tabs[length - 1].complexcontent[0].content
                                  app.globalData.lastcalledlocationHant = resZh.data.record.Tabs[length - 1].complexcontent[1].content
                                  app.globalData.totalscantimesHant = resZh.data.record.Tabs[length - 1].complexcontent[2].content

                                  console.log(app.globalData.agentInfoHant)
                                  wx.navigateTo({
                                    url: `../agent/agent`
                                  })
                                } else if (res.data.status == "fail") {
                                  wx.showModal({
                                    content: res.data.reason,
                                    showCancel: false
                                  })
                                } else {
                                  wx.showModal({
                                    content: this.data.language.productNotFound,
                                    showCancel: false
                                  })
                                }
                              },
                              fail: err => {
                                console.log(err)
                                wx.showModal({
                                  title: this.data.language.productNotFound,
                                  content: err.result,
                                  showCancel: false
                                })
                              },
                              complete: res => {
                                // wx.hideLoading()
                              }
                            })

                          } else if (res.data.status == "fail") {
                            wx.showModal({
                              content: res.data.reason,
                              showCancel: false
                            })
                          } else {
                            wx.showModal({
                              content: this.data.language.productNotFound,
                              showCancel: false
                            })
                          }
                        },
                        fail: err => {
                          console.log(err)
                          wx.showModal({
                            title: this.data.language.productNotFound,
                            content: err.result,
                            showCancel: false
                          })
                        },
                        complete: res => {
                          // wx.hideLoading()
                        }
                      })
                    },
                    fail: err => {
                      console.log('call log Failed')
                      console.log(err)
                      wx.hideLoading()
                    }
                  })
                }
              })

            },
            fail: (res) => { //Scan QR code fail
              wx.hideLoading()
              console.log("startScan fail")
              console.log(res)
            },
            complete: (res) => {
              // wx.hideLoading()
            }
          })
        } else {
          wx.hideLoading()
          console.log("checkFullPermission !hasFullPremission")
          this.setData({
            hasFullPremission: false
          })
          wx.showModal({
            content: this.data.language.setPremisison,
            showCancel: false,
            success: () => {
              wx.openSetting({
                success: (res) => {

                }
              })
            }
          })
        }
      },
      fail: (err) => {
        console.log("wx.getSetting fail", err)
        wx.hideLoading()
      }
    })
  },
  avatar_click: function() {
    wx.openSetting()
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
            if (!authSettings.hasOwnProperty("scope.userInfo")) {
              // Not yet ask for userInfo premission
              //Can only handle by clicking button
              console.log("222222")
              resolve(false)
            }
            if (!authSettings.hasOwnProperty("scope.userLocation")) {
              // Not yet ask for userLocation premission
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
  }
})