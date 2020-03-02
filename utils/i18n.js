// /utils/i18n.js
let T = {
  locale: null,
  locales: {},
  langCode: ['zh-Hans', 'en', 'zh-Hant'],
  lastLangIndex: 0
}

T.registerLocale = function (locales) {
  T.locales = locales;
}

T.setLocale = function (code) {
  T.locale = code;
}

T.setLocaleByIndex = function (index) {
  T.lastLangIndex = index;
  T.setLocale(T.langCode[index]);
  setTabBarLang(index);
}

T.getLanguage = function () {
  return T.locales[T.locale];
}


let navigationBarTitles = [
  '查看启动日志',
  'View Logs'
];
// 设置导航栏标题
// T.setNavigationBarTitle = function () {
//   wx.setNavigationBarTitle({
//     title: navigationBarTitles[T.lastLangIndex]
//   })
// }

// 设置 TabBar 语言
let tabBarLangs = [
  [
    "扫描",
    // "经纪人",
    "资讯"
  ],
  [
    "Scan",
    // "Agents",
    "Info"
  ],
  [
    "掃描",
    // "經紀人",
    "資訊"
  ]
];

function setTabBarLang(index) {
  let tabBarLang = tabBarLangs[index];
  
  tabBarLang.forEach((element, index) => {
    wx.setTabBarItem({
      'index': index,
      'text': element
    })
  })  
}

export default T