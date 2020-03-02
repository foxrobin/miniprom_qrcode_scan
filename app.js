// app.js
import locales from './utils/locales'
import T from './utils/i18n'

T.registerLocale(locales);
T.setLocaleByIndex(wx.getStorageSync('langIndex') || 0);
wx.T = T;

//app.js
App({
  onLaunch: function() {
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //     console.log("777wx.login", res)
    //   }
    // })

    wx.login({

      success: res => {

        // 发送 res.code 到后台换取 openId, sessionKey, unionId

        console.log(res.code)

        var url = 'https://kclub.com.hk/returnOpenId/' + res.code
        wx.request({
          url: url,
          data: {
            appid: 'wxd02d941726b696f5',
            secret: 'ba869c7047c91a3ec07bccf15bd3fc76',
            js_code: res.code,
            grant_type: 'authorization_code'
          },
          success: (res) => {

            console.log('open id: ', res.data.openid);

            this.globalData.openid = res.data.openid;

          }

        })

      }

    })


    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // console.log("777wx.getUserInfo", res)
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              console.log(res.userInfo)
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
        if (!res.authSetting['scope.userLocation']) {
          console.log("scope.userLocation fail")
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              console.log('scope.userLocation success')
            },
            fail() {
              console.log("scope.userLocation fail2")
            }
          })
        }
      }
    })
  },
  globalData: {
    infoUrl: "https://www.Konew.com",
    openid: '',
    session_key: '',
    userInfo: null,
    systemInfo: null,
    fisrttime: 0,
    blockChainAPI: {
      // FQDN: "https://www.generic-trustme.com/api/",
      // FQDN: "http://65.52.166.180/api/",
      FQDN: "https://kclub.com.hk/",
      FQDN2: "https://generic-chain-api-production.azure-api.net/trustmecare/v2/api/",
      // bearerToken: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkdDTWluaVByb2dyYW0iLCJpYXQiOjE1MTYyMzkwMjJ9.OFEPdHDR9VZKjpNFEQyPUco252HIHbHZWPA6i6KmQuI",
      trustMeKey: '6447628d2eca4f9da70b221ac74e8255',
      getRecordByTagID: "getRecordByTagID", // getRecordByTagID?tagId=TAGID1234567890
      postRelatedInfo: "postRelatedInfo",
      getScanRecord: "getScanRecord",
      getTop5Brand: "brands",
      postNameCardRecord: "namecard_record",
      returnOpenId: "returnOpenId/",
      logging: "logging",
      ProductActivation: ""
    },
    agentInfo: {
      company: "",
      department: "",
      email: "",
      id: 0,
      images: "",
      mobile: "",
      name: "",
      position: "",
      tel: "",
      address: "",
    },
    agentInfoHant: {
      companyHant: "",
      departmentHant: "",
      emailHant: "",
      idHant: 0,
      imagesHant: "",
      mobileHant: "",
      nameHant: "",
      positionHant: "",
      telHant: "",
      addressHant: "",
    },
    location: {
      latitude: "",
      longitude: "",
    },
    infoBody: {
      GPS: "",
      WeChatID: "WeChat#",
      DeviceInfo: "MacAddr",
    },
    tagId: '',
    lastcalledtime: '',
    lastcalledlocation: '',
    totalscantimes: 0,
    lastcalledtimeHant: '',
    lastcalledlocationHant: '',
    totalscantimesHant: 0,
    qrcodeUrl: '',
    currentGPS: "0,0",
  }
})