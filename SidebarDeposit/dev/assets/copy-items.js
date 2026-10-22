/* 待确认文案清单（所有需求通用，需求包框架规范第 6.4 节「文案确认」）。
   「文案确认」页自动列出两类文案给运营确认：
     ① 本文件里写的条目：PRD「未定文案清单」、短信 / push / 弹窗 / 后台提示等还没定稿或缺失的文案；
     ② assets/proto-en.js 英文对照表里英文带「（示意）」的条目（自动读取，不用在这里重复写）。
   写法：一行一条；id 用 T01、T02…（不改号，删了也不复用）；page 页面名称，place 页面里的位置，zh 中文，en 英文（没有写 ""），
         note 为什么待确认（缺失 / 示意 / 有歧义…）。文案定稿后，把定稿内容写回 PRD 和 proto-en.js，再从这里删掉这条。
   本需求：中文文案已在 PRD 12.1 由产品确认；以下是本需求新增提示的英文，由产品拟定，需运营确认用词。 */
window.COPY_ITEMS = [
  { id: "T01", page: "游戏页快捷侧边栏", place: "Home / 推荐游戏结算中的蒙层", zh: "正在结算游戏余额…", en: "Settling game balance…", note: "新增提示，英文由产品拟定，请确认用词" },
  { id: "T02", page: "游戏页快捷侧边栏", place: "当前局未结算时的蒙层", zh: "本局结算中…", en: "Settling the current round…", note: "新增提示，英文由产品拟定，请确认用词" },
  { id: "T03", page: "游戏页快捷侧边栏", place: "结算或余额同步失败提示", zh: "余额同步失败，请稍后重试", en: "Balance sync failed. Please try again later.", note: "新增提示，英文由产品拟定，请确认用词" },
  { id: "T04", page: "游戏页快捷侧边栏", place: "点到维护中的推荐游戏", zh: "该游戏当前维护中", en: "This game is under maintenance.", note: "新增提示，英文由产品拟定，请确认用词" },
  { id: "T05", page: "游戏页快捷侧边栏", place: "点到已下架或已停用的推荐游戏", zh: "该游戏暂不可用", en: "This game is unavailable.", note: "新增提示，英文由产品拟定，请确认用词" },
  { id: "T06", page: "游戏页快捷侧边栏", place: "新游戏启动失败或超时", zh: "所选游戏暂时不可用，请换一款试试", en: "This game is temporarily unavailable. Please try another.", note: "新增提示，英文由产品拟定，请确认用词" },
  { id: "T07", page: "游戏页快捷侧边栏", place: "免费次数使用中点离开类按钮", zh: "免费次数使用中，用完后再切换", en: "Free Spin in use. Please switch after it is used up.", note: "新增提示，英文由产品拟定，请确认用词" },
  { id: "T08", page: "游戏页快捷侧边栏", place: "推荐区为空", zh: "暂无可用游戏", en: "No games available", note: "新增提示，英文由产品拟定，请确认用词" },
  { id: "T09", page: "游戏页快捷侧边栏", place: "推荐区加载失败 / 加载更多失败", zh: "游戏加载失败 / 加载失败，点击重试", en: "Failed to load games / Failed to load. Tap to retry.", note: "新增提示，英文由产品拟定，请确认用词" },
  { id: "T10", page: "游戏页快捷侧边栏", place: "推荐区全部加载完", zh: "没有更多了", en: "No more games", note: "新增提示，英文由产品拟定，请确认用词" },
  { id: "T11", page: "游戏内充值弹窗", place: "没有存送活动时的标题语", zh: "继续游戏，精彩不停！", en: "Keep the game going!", note: "新增文案，英文由产品拟定，请确认用词" },
  { id: "T12", page: "游戏内充值弹窗", place: "支付页被浏览器拦截", zh: "支付页面打开失败，请重试", en: "Failed to open the payment page. Please try again.", note: "新增提示，英文由产品拟定，请确认用词" },
  { id: "T13", page: "游戏内充值弹窗", place: "「支付完成」中间页（不能自动关闭时）", zh: "支付已完成，请返回游戏页面 / 关闭此页面", en: "Payment completed. Please return to the game page. / Close this page", note: "新增页面文案，英文由产品拟定，请确认用词" },
  { id: "T14", page: "游戏内充值弹窗", place: "弹窗副标题", zh: "选择支付方式，立即充值", en: "Choose your payment method and deposit now", note: "中文已由 Claire 确认，英文由产品拟定，请确认用词" }
];
