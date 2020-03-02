const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// const postLogAPI = message => {
//   wx.request({
//     url: 'https://www.generic-trustme.com/api/logging', //Todo, use GlobalData
//     method: 'POST',
//     header: {
//       Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkdDTWluaVByb2dyYW0iLCJpYXQiOjE1MTYyMzkwMjJ9.OFEPdHDR9VZKjpNFEQyPUco252HIHbHZWPA6i6KmQuI"
//     },
//     data: {
//       "message": message
//     },
//     success: (res) => {
//       console.log("postLogAPI res", res)
//     },
//     fail: (err) => {
//       console.log("postLogAPI err", err)
//     }
//   })
// }

// const checkNetworkState = () => {
//   return new Promise((resolve, reject) => {
//     console.log("Enter checkNetworkState")
//     var validNetworkType = ["wifi", "2g", "3g", "4g"]
//     wx.getNetworkType({
//       success: function(res) {
//         console.log("getNetworkType res.networkType", res.networkType)
//         var currentNetworkType = res.networkType.toString().trim().toLowerCase()
//         // if (validNetworkType.includes[currentNetworkType]) {
//         if (currentNetworkType == "wifi" || currentNetworkType == "2g" || currentNetworkType == "3g" || currentNetworkType == "4g" || currentNetworkType == "5g") {
//           console.log("validNetworkType")
//           // TODO, Check if the nework can access baidu
//           //Check if the nework can access API
//           //TODO, set timeout
//           // setTimeout(() => {

//           // },
//           // 60)
         
//           wx.request({
//             url: 'https://www.generic-trustme.com/', //Todo, use GlobalData
//             header: {
//               Authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkdDTWluaVByb2dyYW0iLCJpYXQiOjE1MTYyMzkwMjJ9.OFEPdHDR9VZKjpNFEQyPUco252HIHbHZWPA6i6KmQuI`
//             },
//             success: res => {
//               resolve(0)
//             },
//             fail: err => {
//               if (currentNetworkType == "wifi") {
//                 resolve(501) //Connecting to WIFI but no network
//               } else { //"2g", "3g", "4g"
//                 resolve(502) //Connecting to Cellular but no network access
//                 console.log(err)
//               }
//             }
//           })
//         } else if (currentNetworkType == "none") { //无网络
//           resolve(500)
//         } else if (currentNetworkType == "other") { //Android 下不常见的网络类型
//           resolve(503) //Connecting to unknown type of connection but no network access
//         } else {
//           resolve(505) //Other unknown error
//         }
//       },
//       fail: function(err) {
//         console.log("getNetworkType err", err)
//         resolve(505) //Other unknown error
//       }
//     })
//   })
// }

module.exports = {
  formatTime: formatTime,
  // postLogAPI: postLogAPI,
  // checkNetworkState: checkNetworkState
}