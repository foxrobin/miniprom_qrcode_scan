// pages/agent/agent.js
const app = getApp()
import event from '../../utils/event'

Page({
  data: {
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
    lastcalledtime: '',
    lastcalledlocation: '',
    totalscantimes: 0,
    descp: "",
    isshowalert: false,
    language: '',
    // languages: ['简体中文', 'English'],
    langIndex: 0,
    buttonText:"",
    
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
    lastcalledtimeHant: '',
    lastcalledlocationHant: '',
    totalscantimesHant: 0,
  },


  onLoad: function(options) {
    this.setLanguage()
    event.on("languageChanged", this, this.setLanguage)
  
    // Get scan history
    // var url = `${app.globalData.blockChainAPI.FQDN2}${app.globalData.blockChainAPI.getScanRecord}`
    // wx.request({
    //   url: url,
    //   method: "POST",
    //   data: {
    //     tagId: app.globalData.agentInfo.tagId
    //   },
    //   header: {
    //     'Ocp-Apim-Subscription-Key': app.globalData.blockChainAPI.trustMeKey,
    //   },
    //   success: (res) => {
    //     console.log('success ', res.data.displayValue)
    //     // app.globalData.lastcalledtime = res.data.displayValue[0].time
    //     app.globalData.lastcalledlocation = res.data.displayValue[0].name
    //     // app.globalData.totalscantimes = res.data.displayValue.length
    //   }
    // })

    var url = `${app.globalData.blockChainAPI.FQDN}${app.globalData.blockChainAPI.postNameCardRecord}`
    wx.request({
      url: url,
      method: "POST",
      data: {
        phoneNumber: "",
        qrLink: app.globalData.agentInfo.tagId,
        name: app.globalData.userInfo.nickName,
        openId: app.globalData.openid,
      },
      success: (res) => {
        console.log('TTTTTTTTTTTTTT')
        console.log(res.data)
        var result = res.data
        switch (result) {
          case "correct_data":
            this.setData({
              isshowalert: false
            })
            console.log("hit correct_data", res.data )
            break;
          case "new_data":
            this.setData({
              isshowalert: false
            })
            console.log("hit new_data", res.data)
            break;
          case "incorrect_data":
            this.setData({
              isshowalert: true
            })
            console.log("hit incorrect_data", res.data)
            break;
          case "no_data":
            this.setData({
              isshowalert: true
            })
            console.log("hit no_data", res.data)
            break;
          default:
            break;
        }
      }
    })
    // console.log('TTTTTTTTTTTTTT')
    // console.log(app.globalData.agentInfo.tagId,)
    // console.log(app.globalData.userInfo.nickName)
    // console.log(app.globalData.openid)

    this.setData({
      company: app.globalData.agentInfo.company,
      department: app.globalData.agentInfo.department,
      email: app.globalData.agentInfo.email,
      id: app.globalData.agentInfo.id,
      images: app.globalData.agentInfo.images,
      mobile: app.globalData.agentInfo.mobile,
      name: app.globalData.agentInfo.name,
      position: app.globalData.agentInfo.position,
      tel: app.globalData.agentInfo.tel,
      address: app.globalData.agentInfo.address,
      lastcalledtime: app.globalData.lastcalledtime,
      lastcalledlocation: app.globalData.lastcalledlocation,
      totalscantimes: app.globalData.totalscantimes,
           
      companyHant: app.globalData.agentInfoHant.companyHant,
      departmentHant: app.globalData.agentInfoHant.departmentHant,
      emailHant: app.globalData.agentInfoHant.emailHant,
      idHant: app.globalData.agentInfo.id,
      imagesHant: app.globalData.agentInfoHant.imagesHant,
      mobileHant: app.globalData.agentInfoHant.mobileHant,
      nameHant: app.globalData.agentInfoHant.nameHant,
      positionHant: app.globalData.agentInfoHant.positionHant,
      telHant: app.globalData.agentInfoHant.telHant,
      addressHant: app.globalData.agentInfoHant.addressHant,
      lastcalledtimeHant: app.globalData.lastcalledtimeHant,
      lastcalledlocationHant: app.globalData.lastcalledlocationHant,
      totalscantimesHant: app.globalData.totalscantimesHant,
    })

    if (app.globalData.lastcalledlocation.indexOf("error") >= 0) {
      this.setData({
        lastcalledlocation: '(請開啟GPS以顯示地點)'
      })
    }

    // set locales text display here
    this.setData({
      buttonText: this.data.language.buttonAddContact,
    })

    if (app.globalData.agentInfo.company.indexOf("Konew") >= 0) {
      this.setData({
        descp: '此卡片已被其他手機掃描多次, 可能已被盜用, 如有懷疑, 請致電2110 2110向本公司客戶服務主任查詢。'
      })
      // app.globalData.infoUrl = "https://www.konew.com"
    
    }
    if (app.globalData.agentInfo.company.indexOf("Kcash") >= 0) {
      this.setData({
        descp: '此卡片已被其他手機掃描多次, 可能已被盜用, 如有懷疑, 請致電2111 1211向本公司客戶服務主任查詢。'
      })
      // app.globalData.infoUrl = "https://www.kcash.hk"
   
    }
  },

  addContact: function (e) {
  // TODO add mobile contact list here
  // add loading and success toast

     console.log('add mobile contact')
    wx.addPhoneContact({
      firstName: this.data.name,
      workPhoneNumber: this.data.tel,
      mobilePhoneNumber: this.data.mobile,
      organization: this.data.company,
      title: this.data.department + ", " + this.data.position,
      email: this.data.email,
      remark: this.data.company + ", " + this.data.department + ", " + this.data.position,
      success(res) {
        console.log('add contact success: ',res)
        wx.showToast({
          title: "已添加 Added",
          icon: 'succes',
          duration: 2000,
          mask: true
        })
      },
      fail: err => {
        console.log('add contact fail: ',err)
      }
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
    wx.hideLoading()
    console.log('hideloading')
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

  },

  setLanguage() {
    this.setData({
      language: wx.T.getLanguage()
    })
  },

})