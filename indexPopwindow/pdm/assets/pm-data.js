/* 弹窗管理功能 · 原型共用数据（只用于原型演示，示例数据均为虚构，不是线上配置）。
   后台「首页弹窗管理中心」原型改的配置（两种状态下是否弹出、顺序、频率、当日免打扰、单次上限、跳走后设置）和「活动按钮跳转」原型改的配置（按钮跳转、活动外部链接）
   存在本标签页的 sessionStorage，前台「Home 弹窗队列」原型读取同一份配置演示；「清空原型状态」回到上线初始化。不调用任何接口。
   变更 CH02（2026-11-23）：首页弹窗管理中心不再配置按钮跳转、不再有集中目标库。targets 里 type=page 的是每站一份的「系统页面清单」（技术维护，运营只读）；
   type=ext 的是各活动自己登记的外部链接，owner = 所属活动（弹窗的 src）。
   label：按钮的英文默认文案（后台显示、运营覆盖时只写英文）；zh：前台原型手机画面用的中文（打包时按 assets/proto-en.js 换英文）。 */
(function () {
  var KEY = "pm-popup-center-v9";
  /* 变更 CH04（2026-11-25）：每个弹窗有总开关 p.on（关闭后前台任何状态都不弹）；队列项 it.on / it.freq 为该状态下的显示方式（it.on=false 即「不显示」） */
  function T(id, g, name, type, app, h5, param, login, ver, st) { return { id: id, g: g, name: name, type: type, app: app, h5: h5, param: param, login: login, ver: ver, st: st, at: id }; }
  function targets() {
    return [
      T(1, "首页与游戏", "首页", "page", "home", "/", "", false, "", "on"),
      T(2, "首页与游戏", "游戏大厅 Games", "page", "games", "/games", "分类（可选）", false, "", "app"),
      T(3, "钱包", "充值页", "page", "wallet_deposit", "/user/walletbox", "", true, "", "on"),
      T(4, "钱包", "提现页", "page", "wallet_withdraw", "/user/walletbox/withdraw", "", true, "", "on"),
      T(5, "钱包", "交易记录", "page", "tx_history", "/user/walletbox/history", "", true, "", "on"),
      T(6, "钱包", "奖励记录", "page", "rewards_history", "/rewards/history", "", true, "", "app"),
      T(7, "活动与奖励", "活动中心 Promo", "page", "promo_list", "/promo", "", false, "", "app"),
      T(8, "活动与奖励", "我的奖励", "page", "rewards", "/rewards", "", true, "", "app"),
      T(9, "活动与奖励", "Lucky Spin 转盘", "page", "lucky_spin", "/lucky-spin", "", true, "", "app"),
      T(10, "活动与奖励", "每日打卡", "page", "checkin", "/checkin", "", true, "", "app"),
      T(11, "活动与奖励", "邀请好友页", "page", "invite", "/inviteFriends", "", true, "", "app"),
      T(12, "会员", "VIP 俱乐部", "page", "vip", "/vip", "", true, "", "app"),
      T(13, "账户", "身份认证 KYC", "page", "kyc", "/user/info/update-kyc-v2", "", true, "", "app"),
      T(14, "账户", "账号设置", "page", "account", "/account", "", true, "", "app"),
      T(15, "账户", "注册页", "page", "register", "/register", "", false, "", "app"),
      T(16, "其他", "下载 App 页", "page", "app_download", "/download", "", false, "", "app"),
      T(17, "其他", "联系客服", "page", "support", "/support", "", false, "", "app"),
      T(18, "其他", "聊天室 Chat", "page", "chat", "/chat", "", true, "", "stop"),
      (function (t) { t.owner = "活动中心 › 老用户充值转盘"; return t; })(T(19, "外部链接", "官方 Facebook 主页", "ext", "", "https://www.facebook.com/789bingo.official", "", false, "", "on"))
    ];
  }
  /* 指定游戏按「厂商编码 / 游戏 ID」填写（示意，以平台游戏列表为准）；n 游戏名称（下拉显示用），m 是否支持手机端 */
  var GAMES = [{ v: "JDB", g: [{ id: "14001", n: "Magic Ace", m: true }, { id: "14002", n: "Fortune Gems", m: true }] }, { v: "JILI", g: [{ id: "2001", n: "Super Ace", m: true }, { id: "2002", n: "Money Coming", m: false }] }, { v: "PG", g: [{ id: "65", n: "Mahjong Ways", m: true }] }];
  function game(v, id) { var r = null; GAMES.forEach(function (x) { if (x.v === v) x.g.forEach(function (g) { if (g.id === String(id)) r = g; }); }); return r; }
  var ACTS = ["Daily First Deposit 10%", "Christmas Lucky Spin", "Crown Rush 圣诞活动"];
  function J(t, o) { var j = { t: t }; for (var k in (o || {})) j[k] = o[k]; return j; }
  function B(id, label, zh, kind, def, where) { return { id: id, label: label, zh: zh, kind: kind, def: def || J("close"), where: where || "" }; }
  var LOGIN = ["new", "old", "wl"], ALL = ["new", "old", "wl", "guest"];
  /* 首页顶部邀请好友提示条：归首页弹窗管理中心（只用状态开关），出现时机沿用现网（不遮罩，自动收起），出现条件待前端确认（PRD Q33） */
  function BAR(sfx) { return { k: "invBar", cat: "bar", name: "顶部邀请好友提示条" + sfx, zh: "邀请好友赚奖励", src: "活动中心 › 邀请好友活动" + sfx, scene: "首页顶部提示条", elig: "出现时机沿用现网（不遮罩，自动收起）", btns: [B("inv", "Invite Now", "去邀请", "jump", J("page", { id: 11 }))] }; }
  /* 合规置顶组：固定顺序 强制更新 → 21+ → 协议 → 责任博彩 → 登录后 KYC 提示（PRD N10）
     21+ 按钮英文三站统一「I'm 21+」：前端按 PRD Q19 核对现网，现网不是这句的列为 N47 第 ④ 条有意变更（团队自定 T-K3） */
  function fixed(site) {
    var g = site === "789Games", py = site === "789Play";
    if (py) {
      /* 789Play 现状资料未覆盖：合规组按三站统一顺序示意，系统参数合规开关是否存在待后台前端确认（PRD Q23） */
      return fixed("789Bingo").map(function (p) { p = clone(p); if (p.k === "age21" || p.k === "kyc") { p.val = "待确认（Q23）"; p.src = "系统管理 › 系统参数管理 › 注册登陆 › 合规（789Play 待确认）"; } return p; });
    }
    return [
      { k: "force", cat: "fix", name: "强制更新", zh: "发现新版本", src: "系统管理 › App更新配置", scene: "登录 / 游客 Home", ctrl: "App更新配置", val: "App 版本低于要求时弹", btns: [B("upd", "Update", "立即更新", "sys")] },
      { k: "age21", cat: "fix", name: "21+ 年龄确认", zh: "年龄确认", src: "系统管理 › 系统参数管理 › 注册登陆 › 合规", scene: "登录 / 游客 Home", ctrl: "21 岁弹窗登录后是否展示；已登录超过 10 分钟的玩家刷新页面需重新弹出 21 岁弹窗", val: g ? "待确认（Q11）" : "开；关", note: "按钮英文统一「I'm 21+」（现网不是这句时为 N47 第 ④ 条有意变更，Q19 核对）", btns: [B("yes", "I'm 21+", "我已满 21 岁", "sys")] },
      { k: "agree", cat: "fix", name: "协议确认", zh: "用户协议", src: "现网写死，待前端确认（Q1、Q3）", scene: "登录 Home", ctrl: "按账号和协议版本确认一次", val: "-", btns: [B("agree", "Agree", "同意", "sys")] },
      { k: "rg", cat: "fix", name: "责任博彩弹窗", zh: "理性娱乐", src: "现网写死，待前端确认（Q1、Q3）", scene: "登录 Home", ctrl: "每次登录至少弹一次", val: "-", btns: [B("ok", "I Understand", "我知道了", "sys")] },
      { k: "kyc", cat: "fix", name: "登录后 KYC 提示", zh: "完成实名认证", src: "系统管理 › 系统参数管理 › 注册登陆 › 合规", scene: "登录 Home", ctrl: "会员登入是否提示 KYC", val: g ? "待确认（Q11）" : "开", btns: [B("go", "Verify Now", "去认证", "sys"), B("later", "Later", "稍后", "sys")] }
    ];
  }
  function bingo() {
    return fixed("789Bingo").concat([
      { k: "oldEgg", cat: "q", name: "旧版砸金蛋", zh: "砸金蛋领奖", src: "活动中心 › 砸金蛋（旧）", scene: "登录 Home", elig: "有可领金额", who: ["old", "wl"], period: true, status: "进行中", btns: [B("smash", "Smash & Claim", "砸蛋领取", "action")] },
      { k: "crown", cat: "q", name: "圣诞活动 Crown Rush", zh: "圣诞冠军赛", src: "活动中心 › 圣诞活动", scene: "登录 / 游客 Home", elig: "预热中或进行中", who: ALL, period: true, status: "进行中", btns: [B("go", "Let's Go!", "去看看", "jump", J("act", { a: "Crown Rush 圣诞活动" }))] },
      { k: "newSpin", cat: "q", name: "新用户 / 首充转盘", zh: "新人转盘", src: "活动中心 › 新用户转盘活动", scene: "登录 Home", elig: "新用户有转盘次数；首充到账", who: ["new"], period: true, status: "进行中", btns: [B("go", "GO", "去抽奖", "action"), B("dep", "Deposit", "去充值", "jump", J("page", { id: 3 }), "无次数时"), B("inv", "Invite", "邀请好友", "jump", J("page", { id: 11 }), "结果弹窗")] },
      { k: "oldSpin", cat: "q", name: "老用户充值转盘", zh: "充值转盘", src: "活动中心 › 老用户充值转盘", scene: "登录 Home", elig: "充值后获得转盘次数", who: ["old", "wl"], period: true, status: "已结束", btns: [B("go", "GO", "去抽奖", "action"), B("dep", "Deposit Now", "立即充值", "jump", J("page", { id: 3 }), "无次数时"), B("inv", "Invite", "邀请好友", "jump", J("page", { id: 11 }), "结果弹窗")] },
      { k: "taskEgg", cat: "q", name: "任务砸金蛋", zh: "任务金蛋", src: "活动中心 › 任务砸金蛋", scene: "登录 Home", elig: "有可砸的金蛋", who: LOGIN, period: true, status: "进行中", btns: [B("kyc", "Go", "认证任务", "jump", J("page", { id: 13 }), "任务：实名认证"), B("dep", "Go", "充值任务", "jump", J("page", { id: 3 }), "任务：充值"), B("app", "Go", "下载任务", "jump", J("page", { id: 16 }), "任务：下载 App")] },
      { k: "wlBonus", cat: "q", name: "白名单登录彩金", zh: "回归彩金", src: "活动中心 › 登录送彩金活动（白名单）", scene: "登录 Home", elig: "有可领的白名单彩金", who: ["wl"], period: true, status: "进行中", btns: [B("claim", "Claim", "领取", "action")] },
      { k: "loginBonus", cat: "q", name: "登录彩金", zh: "登录彩金", src: "活动中心 › 登录送彩金活动", scene: "登录 Home", elig: "有可领的登录彩金", who: ["old", "wl"], period: true, status: "进行中", btns: [B("claim", "Claim", "领取", "action")] },
      { k: "loss", cat: "q", name: "亏损返利", zh: "亏损返利", src: "活动中心 › 新盈利活动（待前端确认）", scene: "登录 Home", elig: "有亏损返利到账", who: ["old", "wl"], period: true, status: "进行中", protect: true, btns: [B("ok", "Confirm", "确认", "action")] },
      { k: "actImg", cat: "q", name: "活动图弹窗", zh: "精选活动", src: "活动配置 › 活动图素材管理 › 弹窗活动 › 首页弹窗", scene: "登录 Home", elig: "后台配了展示中的活动图", who: LOGIN, period: false, status: "进行中", material: true, btns: [B("img", "（点击图片）", "查看活动", "jump", J("page", { id: 7 }))] },
      { k: "notify", cat: "q", name: "开启通知引导", zh: "开启通知", src: "系统", scene: "登录 Home", elig: "未开启推送通知", who: LOGIN, period: false, status: "-", btns: [B("close", "Close", "关闭", "sys")] },
      { k: "loginNotice", cat: "q", name: "登录公告", zh: "公告", src: "公告管理 › 公告配置", scene: "登录 Home", elig: "有生效的登录公告", who: LOGIN, period: false, status: "-", notice: true, btns: [] },
      { k: "guestSpin", cat: "q", name: "游客转盘 New Player Welcome Bonus", zh: "登录赢大奖", src: "活动中心 › 新用户转盘活动", scene: "游客 Home", elig: "游客", who: ["guest"], period: true, status: "进行中", btns: [B("go", "GO", "去注册", "jump", J("page", { id: 15 })), B("reg", "LOGIN TO WIN BIG REWARDS", "登录赢大奖", "jump", J("page", { id: 15 }))] },
      { k: "guestNotice", cat: "q", name: "游客公告", zh: "公告", src: "公告管理 › 公告配置", scene: "游客 Home", elig: "有生效的游客公告", who: ["guest"], period: false, status: "-", notice: true, btns: [] },
      BAR(""),
      { k: "appGuide", cat: "inst", name: "下载 App 引导", zh: "下载 App", src: "系统管理 › 系统参数管理 › 注册登陆", scene: "即时弹窗", elig: "后台开启且非桌面图标打开", btns: [B("dl", "Download Now", "立即下载", "jump", J("page", { id: 16 }))] },
      { k: "invRw", cat: "inst", name: "邀请奖励到账 Invite Rewards", zh: "邀请奖励已到账", src: "活动中心 › 邀请好友活动", scene: "即时弹窗", elig: "有邀请奖励到账", btns: [B("more", "Invite More", "继续邀请", "jump", J("page", { id: 11 }))] },
      { k: "excl", cat: "inst", name: "专属奖励提示 Exclusive Reward", zh: "专属奖励", src: "专属奖励下发菜单（资料未覆盖）", scene: "即时弹窗", elig: "后台下发", btns: [B("ok", "Confirm", "确认", "jump", J("close"))] },
      { k: "vip", cat: "inst", ro: true, name: "VIP 升级 / 生日奖励", zh: "VIP 升级", src: "VIP", scene: "即时弹窗", elig: "升级或生日奖励到账", btns: [] },
      { k: "kycRes", cat: "inst", ro: true, name: "实名认证结果", zh: "认证结果", src: "KYC", scene: "即时弹窗", elig: "认证通过或需补充资料", btns: [B("dep", "Deposit", "去充值", "sys", null, "通过"), B("more", "Complete", "去补充", "sys", null, "需补充")] },
      { k: "payFail", cat: "inst", ro: true, name: "充值失败 / 提款失败", zh: "订单失败", src: "钱包", scene: "即时弹窗", elig: "订单失败", btns: [B("ok", "OK", "确定", "sys"), B("cs", "Contact Support", "联系客服", "sys")] }
    ]);
  }
  function games() {
    return fixed("789Games").concat([
      { k: "newSpin", cat: "q", name: "新用户转盘", zh: "新人转盘", src: "活动中心 › 新用户转盘", scene: "登录 Home", elig: "新用户有剩余转盘次数", who: ["new"], period: true, status: "进行中", btns: [B("go", "GO", "去抽奖", "action"), B("play", "Play Now", "去游戏", "jump", J("page", { id: 2 }), "结果弹窗"), B("inv", "Invite", "邀请好友", "jump", J("page", { id: 11 }), "结果弹窗")] },
      { k: "oldSpin", cat: "q", name: "老用户转盘 Deposit & Spin", zh: "充值转盘", src: "活动中心 › 老用户转盘", scene: "登录 Home", elig: "老用户且活动进行中", who: ["old", "wl"], period: true, status: "已结束", btns: [B("go", "GO", "去抽奖", "action"), B("dep", "Deposit", "去充值", "jump", J("page", { id: 3 }), "无次数时"), B("play", "Play Now", "去游戏", "jump", J("page", { id: 2 }), "结果弹窗")] },
      { k: "egg", cat: "q", name: "砸金蛋", zh: "砸金蛋领奖", src: "活动中心 › 砸金蛋", scene: "登录 Home", elig: "有待领取金蛋", who: LOGIN, period: true, status: "进行中", btns: [B("claim", "Confirm & Claim ₱{amount}", "确认领取 ₱8.88", "action")] },
      { k: "wlBonus", cat: "q", name: "登录送彩金（白名单）", zh: "回归彩金", src: "活动中心 › 登录送彩金活动（白名单）", scene: "登录 Home", elig: "命中白名单且未领取", who: ["wl"], period: true, status: "进行中", btns: [B("claim", "Claim", "领取", "action")] },
      { k: "promoLogin", cat: "q", name: "登录促销", zh: "登录奖励", src: "活动中心 › 登录促销", scene: "登录 Home", elig: "活动进行中且未领取", who: ["old", "wl"], period: true, status: "进行中", btns: [B("claim", "Claim Now", "立即领取", "action")] },
      { k: "loss", cat: "q", name: "亏损促销", zh: "亏损返利", src: "活动中心 › 亏损促销", scene: "登录 Home", elig: "昨日亏损达标", who: ["old", "wl"], period: true, status: "进行中", protect: true, btns: [B("claim", "Claim", "领取", "action")] },
      { k: "gold", cat: "q", name: "黄金蛋", zh: "黄金蛋", src: "活动中心 › 黄金蛋", scene: "登录 Home", elig: "待前端提供（Q1）", who: [], period: true, status: "待核对", btns: [B("tbd", "（按钮待前端提供）", "领取", "sys")] },
      { k: "actImg", cat: "q", name: "活动弹窗（Home 轮播）", zh: "精选活动", src: "活动配置 › Home 页轮播弹窗", scene: "登录 Home", elig: "有展示中的轮播素材", who: LOGIN, period: false, status: "进行中", material: true, btns: [B("img", "（点击图片）", "查看活动", "jump", J("act", { a: "Christmas Lucky Spin" }))] },
      { k: "notify", cat: "q", name: "通知引导", zh: "开启通知", src: "系统", scene: "登录 Home", elig: "未授权推送", who: LOGIN, period: false, status: "-", btns: [B("allow", "Allow", "开启", "sys"), B("later", "Later", "稍后", "sys")] },
      { k: "notice", cat: "q", name: "公告", zh: "公告", src: "公告管理 › 公告配置", scene: "登录 / 游客 Home", elig: "有生效公告", who: ALL, period: false, status: "-", notice: true, btns: [] },
      { k: "okGame", cat: "q", name: "游客转盘 New Player Welcome Bonus", zh: "新人转盘", src: "活动中心 › 新用户转盘", scene: "游客 Home", elig: "游客", who: ["guest"], period: true, status: "进行中", btns: [B("reg", "Login To Win Big Rewards", "登录赢大奖", "jump", J("page", { id: 15 }))] },
      BAR("")   /* 789Games 提示条出现条件以前端弹窗清单为准（PRD Q1、Q33） */
    ]);
  }
  /* 789Play：现网弹窗清单资料未覆盖，只放最少示例，待前端提供 789Play 现网清单（PRD Q22） */
  function play() {
    var SRC = "示例，待前端提供 789Play 现网清单";
    return fixed("789Play").concat([
      { k: "newSpin", cat: "q", name: "新用户转盘（示例）", zh: "新人转盘", src: "活动中心 › 新用户转盘（示例）", scene: "登录 Home", elig: "示例：新用户有转盘次数", who: ["new"], period: true, status: "进行中", btns: [B("go", "GO", "去抽奖", "action"), B("dep", "Deposit", "去充值", "jump", J("page", { id: 3 }), "无次数时")] },
      { k: "notice", cat: "q", name: "公告（示例）", zh: "公告", src: "公告管理 › 公告配置（789Play 待确认）", scene: "登录 / 游客 Home", elig: "示例：有生效公告", who: ALL, period: false, status: "-", notice: true, btns: [] },
      { k: "guestReg", cat: "q", name: "游客注册引导（示例）", zh: "注册领奖励", src: "活动中心 › 游客注册引导（示例）", scene: "游客 Home", elig: "示例：游客", who: ["guest"], period: false, status: "进行中", btns: [B("reg", "Register Now", "立即注册", "jump", J("page", { id: 15 }))] },
      BAR("（示例）")
    ]);
  }
  var Q0 = {
    "789Play": { login: [["newSpin"], ["notice"]], guest: [["guestReg"], ["notice"]] },
    "789Bingo": { login: [["oldEgg"], ["crown", "daily"], ["newSpin"], ["oldSpin"], ["taskEgg", "daily"], ["wlBonus"], ["loginBonus"], ["loss"], ["actImg"], ["notify", "once"], ["loginNotice"]], guest: [["crown", "daily"], ["guestSpin"], ["guestNotice"]] },
    "789Games": { login: [["newSpin"], ["oldSpin"], ["egg", "daily"], ["wlBonus"], ["promoLogin"], ["loss"], ["gold"], ["actImg"], ["notify", "once"], ["notice"]], guest: [["okGame"], ["notice"]] }
  };
  /* 变更 CH16（2026-11-25）：活动弹窗里玩家能触发的其他事件（evs），只在活动配置页「事件触发信息」里列出和配置。
     logic：点击后执行活动逻辑的事件写触发逻辑，不配链接；sty：同一活动调用的另一种弹窗样式（如首充后在充值页弹出的第 3 次转盘）。
     清单为原型示例，以前端现网清单为准（PRD 待确认 Q1） */
  var S3 = "首充转盘（第 3 次）· 首充成功后在充值页弹出";
  function E(id, label, zh, kind, def, where, logic, sty) { var b = B(id, label, zh, kind, def, where); if (logic) b.logic = logic; if (sty) b.sty = sty; return b; }
  function RULES() { return E("rules", "Rules", "活动规则", "sys", null, "弹窗右上角「?」", "在弹窗内展开活动规则说明"); }
  var EVX = {
    newSpin: function () { return [RULES(), E("play", "Play Now", "去游戏", "jump", J("page", { id: 2 }), "结果弹窗"),
      E("go3", "GO", "去抽奖", "action", null, "", "转动第 3 次转盘，显示大礼包结果", S3), E("play3", "Play Now", "去游戏", "jump", J("page", { id: 2 }), "结果弹窗", null, S3), E("rules3", "Rules", "活动规则", "sys", null, "弹窗右上角「?」", "在弹窗内展开活动规则说明", S3)]; },
    oldSpin: function () { return [RULES(), E("play", "Play Now", "去游戏", "jump", J("page", { id: 2 }), "结果弹窗"), E("fb", "Follow Us", "关注我们", "jump", J("url", { u: "https://www.facebook.com/789bingo.official" }), "结果弹窗")]; },
    guestSpin: function () { return [E("spin", "SPIN", "转一下", "jump", J("page", { id: 15 }), "转盘中心"), RULES()]; },
    okGame: function () { return [E("spin", "SPIN", "转一下", "jump", J("page", { id: 15 }), "转盘中心"), RULES()]; },
    crown: function () { var S = "进行中 · 升级奖励弹窗（每升一级弹出）"; return [RULES(), E("lvClaim", "Claim", "领取", "action", null, "", "领取本级奖励", S), E("rank", "View Rank", "看排名", "jump", J("act", { a: "Crown Rush 圣诞活动" }), "", null, S)]; }, oldEgg: function () { return [RULES()]; }, egg: function () { return [RULES()]; }, taskEgg: function () { return [RULES()]; }
  };
  /* 变更 CH18（2026-11-25）：活动配置页「事件触发信息」的示例活动（cat=act：第一个弹窗不在首页队列，不进首页弹窗管理中心），
     每个说明一种特殊情况；feat 为页面上显示的「本活动特点」。依据 789Bingo 平台知识库活动清单，按钮以前端现网为准（Q1） */
  function DEMO() {
    var A = function (k, name, src, elig, feat, btns) { return { k: k, cat: "act", name: name, zh: name, src: src, scene: "活动自身逻辑", elig: elig, feat: feat, btns: btns }; };
    return [
      A("signIn", "签到弹窗", "活动中心 › 签到活动（7 天）", "玩家点首页签到浮标打开",
        "同一个位置的按钮随玩家状态变化：满足条件时是「Claim」领取，未满足当日充值 / 投注要求时变成「Deposit & Bet to Claim」去充值，领完变成「Come Back Tomorrow」不可点；漏签 24 小时内可补领。第一个弹窗由玩家点浮标打开，不在首页队列。",
        [E("claim", "Claim", "领取", "action", null, "满足当日条件时", "领取今日签到彩金，按钮变为「Come Back Tomorrow」"),
         E("dep", "Deposit & Bet to Claim", "去充值", "jump", J("page", { id: 3 }), "未满足当日充值 / 投注要求时"),
         E("tmr", "Come Back Tomorrow", "明天再来", "sys", null, "今日已领取", "按钮置灰，点击无反应"),
         E("kyc", "Verify Now", "去认证", "jump", J("page", { id: 13 }), "签到资格要求 KYC 且未完成时"),
         E("make", "Make Up", "补领", "action", null, "漏签 24 小时内", "补领漏签日的签到彩金"),
         E("task", "Go", "去完成", "jump", J("page", { id: 2 }), "额外任务（投注任务）"),
         RULES()]),
      A("kycBonus", "认证通过到账弹窗", "活动中心 › KYC认证送彩金活动", "KYC 状态变为 Verified 时自动发放并弹出",
        "奖励自动到账，弹窗只做通知：第一个弹窗由「认证通过」事件触发，任何页面都可能出现，不受首页弹窗管理中心控制；未认证时的引导是浮标气泡，不是弹窗。",
        [E("bubble", "Verify", "去认证", "jump", J("page", { id: 13 }), "", null, "未认证浮标气泡（不是弹窗，常驻首页右侧）"),
         E("play", "Play Now", "去游戏", "jump", J("page", { id: 2 }), "到账弹窗"),
         E("ok", "OK", "知道了", "sys", null, "到账弹窗", "关闭弹窗（奖励已自动到账）")]),
      A("freeSpin", "免费旋转领取", "活动中心 › 免费旋转", "系统自动发放后，玩家下次进入时弹出",
        "跳转目标是指定游戏：领取后直接进入活动配置的游戏；次数有过期时间，过期提醒弹窗只有确认按钮。",
        [E("claim", "Claim", "领取", "action", null, "领取弹窗", "领取免费旋转次数（有效期 X 小时）"),
         E("play", "Play Now", "去游戏", "jump", J("game", { v: "JDB", g: "14001" }), "领取成功后"),
         E("exp", "OK", "知道了", "sys", null, "次数快过期提醒", "关闭弹窗", "过期提醒弹窗 · 次数到期前 1 小时弹出")]),
      A("redRain", "红包雨开场", "红包雨管理", "活动时段开始时在线玩家弹出",
        "限时、多次点击：开场弹窗之后进入红包雨，玩家在倒计时内反复点红包，结束后出结算弹窗；整个系列都按活动时段和点击逻辑走。",
        [E("start", "Start", "开始", "action", null, "开场弹窗", "进入红包雨，倒计时内点击红包"),
         (function (e) { e.evn = "点击红包"; return e; })(E("tap", "（无按钮文字）", "点红包", "sys", null, "红包雨进行中", "每点中一个红包累计一次奖励", "红包雨进行中")),
         E("claim", "Claim", "领取", "action", null, "结算弹窗", "领取本场累计奖励", "结算弹窗 · 倒计时结束后弹出"),
         E("play", "Play Now", "去游戏", "jump", J("page", { id: 2 }), "结算弹窗", null, "结算弹窗 · 倒计时结束后弹出"),
         RULES()])
    ];
  }
  function site(name) {
    var pops = (name === "789Bingo" ? bingo() : name === "789Play" ? play() : games()).concat(DEMO());
    var FEAT = {
      newSpin: "一个活动调用多种转盘样式：登录新用户的转盘、游客转盘、首充后在充值页弹出的第 3 次转盘；首页弹窗管理中心只管首页弹出的第一个转盘，结果弹窗和第 3 次转盘跟活动逻辑走。",
      oldSpin: "按钮随次数变化：有次数时抽奖，没次数时变成「Deposit Now」去充值；抽奖后出结果弹窗。",
      taskEgg: "一个弹窗里多个任务按钮，各自跳到不同页面（认证、充值、下载 App）。",
      crown: "按活动阶段换样式：预热 / 进行中在首页弹出入口弹窗；进行中每升一级再弹升级奖励弹窗（后续弹窗，跟活动逻辑走）。",
      invBar: "同一活动有两种弹出形式：首页顶部提示条（首页弹窗管理中心管理）和邀请奖励到账弹窗（事件触发，跟活动逻辑走）。"
    };
    pops.forEach(function (p) {
      if (!p.feat && FEAT[p.k]) p.feat = FEAT[p.k];
      p.evs =EVX[p.k] ? EVX[p.k]().filter(function (e) { return !p.btns.some(function (b) { return b.id === e.id; }); }) : [];
      p.btns.concat(p.evs).forEach(function (b) { b.cfg = { text: "", split: false, h5: clone(b.def), app: clone(b.def) }; }); p.upd = "2026-11-20 10:02"; p.on = true;
    });
    var q = {};
    /* 现网「每次打开 / 登录后进 Home 弹一次」对应显示方式 first（变更 CH04） */
    ["login", "guest"].forEach(function (k) { q[k] = Q0[name][k].map(function (x) { return { k: x[0], on: x[0] !== "gold", freq: x[1] || "first", today: false }; }); });
    /* 变更 CH08（2026-11-25）：没有「不适用」。每个排队弹窗在未登录、登录两种状态下都由运营勾选「展示」决定；
       上线初始化按现网：现网在该状态下不弹的，初始为不勾选。两个队列按合并后的统一顺序排 */
    var L = q.login.map(function (x) { return x.k; }), G = q.guest.map(function (x) { return x.k; }), ord = [], i = 0, j = 0;
    function put(k) { if (ord.indexOf(k) < 0) ord.push(k); }
    while (i < L.length && j < G.length) {
      var a = L[i], b = G[j];
      if (ord.indexOf(a) >= 0) { i++; continue; } if (ord.indexOf(b) >= 0) { j++; continue; }
      if (a === b) { put(a); i++; j++; } else if (L.indexOf(b, i) > i) { put(a); i++; } else if (G.indexOf(a, j) > j) { put(b); j++; } else { put(a); i++; }
    }
    L.slice(i).concat(G.slice(j)).forEach(put);
    ["login", "guest"].forEach(function (k) {
      q[k] = ord.map(function (key) { for (var n = 0; n < q[k].length; n++) if (q[k][n].k === key) return q[k][n]; return { k: key, on: false, freq: "first", today: false }; });
    });
    return {
      targets: targets(), popups: pops, queues: q, cap: { login: 0, guest: 0 }, after: "resume",
      wl: wlInit(name),   /* 外部链接白名单（【系统管理 › 系统参数管理 › 注册登陆 › 合规】，每站一份，合规负责人或超级管理员维护） */
      matDef: J("page", { id: 7 }),   /* 素材「默认跳转」放在原素材菜单（PRD N6），上线初始化为现网实际表现（去活动列表） */
      logs: [{ t: "2026-11-20 10:02:11", who: "系统", type: "初始化", obj: "全部", chg: "按现网顺序和两种状态下是否弹出初始化；单次上限 不限；跳走后 回 Home 继续弹剩余；当日免打扰全部关闭" }],
      oplogs: [{ t: "2026-11-20 10:02:11", who: "系统", type: "初始化", obj: "各活动弹窗按钮跳转", chg: "按现网按钮跳转初始化" }]   /* 后台【日志管理 › 操作日志】里活动按钮跳转的记录（PRD N45），不进 B5 */
    };
  }
  /* 外部链接白名单条目（演示值）：type domain = 域名（含子域名），只用于本站域名和 PAGCOR 官网；prefix = 网址前缀，社交平台、应用商店只登记本站官方账号 / App 页面 */
  function wlInit(name) {
    var own = name === "789Games" ? "789games.com" : name === "789Play" ? "789play.com" : "789bingo.com", acc = own.replace(".com", "") + ".official";
    return [
      { type: "domain", v: own, note: "本站" },
      { type: "domain", v: "pagcor.ph", note: "PAGCOR 官网" },
      { type: "prefix", v: "facebook.com/" + acc, note: "官方社交主页" },
      { type: "prefix", v: "instagram.com/" + acc, note: "官方社交主页" },
      { type: "prefix", v: "apps.apple.com/ph/app/" + own.replace(".com", "") + "/id1234567890", note: "应用商店（App Store）" },
      { type: "prefix", v: "play.google.com/store/apps/details?id=com.example." + own.replace(".com", ""), note: "应用商店（Google Play）" },
      { type: "prefix", v: "appgallery.huawei.com/app/C000000001", note: "应用商店（华为）" }
    ];
  }
  /* 链接规范化（按浏览器规则）：解析 URL，域名转小写；含反斜杠、「../」「./」路径段、编码的「/」「\」「@」「.」、
     域名部分（主机名前）含「@」、非默认端口的，返回 null（一律不命中）。路径里的「@」（如 tiktok.com/@账号）允许 */
  function wlNorm(u) {
    u = String(u || "").trim();
    if (!/^https?:\/\//i.test(u) || u.indexOf("\\") >= 0 || /%(2f|5c|40|2e)/i.test(u)) return null;
    var auth = u.replace(/^https?:\/\//i, "").split(/[\/?#]/)[0];
    if (auth.indexOf("@") >= 0) return null;
    var x; try { x = new URL(u); } catch (e) { return null; }
    if (x.port || /(^|\/)\.\.?(\/|$|[?#])/.test(u.replace(/^https?:\/\/[^\/]+/i, ""))) return null;
    var h = x.hostname.toLowerCase();
    return { host: h, bare: h.replace(/^(www|m)\./, "") + x.pathname + x.search + x.hash };
  }
  function wlBare(x) { var m = /^(?:https?:\/\/)?([^\/?#]+)(.*)$/i.exec(String(x || "").trim()); return m ? m[1].toLowerCase().replace(/^(www|m)\./, "") + m[2].replace(/\/+$/, "") : ""; }
  /* 站外链接是否命中白名单：域名条目要求规范化后的域名等于或属于该域名；前缀条目（忽略 http(s)://、www.、m.）要求规范化后的链接与前缀完全相同，或前缀之后紧跟「/」「?」「#」 */
  function wlHit(list, u) {
    var n = wlNorm(u); if (!n) return false;
    return (list || []).some(function (w) {
      if (w.type === "domain") { var d = w.v.toLowerCase(); return n.host === d || n.host.slice(-(d.length + 1)) === "." + d; }
      var bp = wlBare(w.v), bu = n.bare.toLowerCase(), lp = bp.toLowerCase();
      return bu === lp || (bu.indexOf(lp) === 0 && "/?#".indexOf(bu.charAt(lp.length)) >= 0);
    });
  }
  /* 是否本站域名（本站链接一律按站内路径走系统页面清单校验） */
  function ownHost(name, u) { var n = wlNorm(u), own = name === "789Games" ? "789games.com" : name === "789Play" ? "789play.com" : "789bingo.com"; if (!n) { var m = /^https?:\/\/([^\/?#\\@]+)/i.exec(String(u || "").trim()); if (!m) return false; n = { host: m[1].toLowerCase() }; } return n.host === own || n.host.slice(-(own.length + 1)) === "." + own; }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function fresh() { return { "789Bingo": site("789Bingo"), "789Games": site("789Games"), "789Play": site("789Play") }; }
  /* 三个站的管理后台各有一个首页弹窗管理中心，各自配置、各自生效，没有跨站切换（变更 CH01）；原型里每站一份独立数据 */
  var PM = window.PM = {
    SITES: ["789Bingo", "789Games", "789Play"], GAMES: GAMES, ACTS: ACTS, game: game,
    gname: function (v, id) { var g = game(v, id); return g ? g.n : id; },
    /* 显示方式（变更 CH04）：first 在登录状态指「每次登录后首次打开」，未登录状态指「每次打开 App / 网站后首次打开」；enter 指每次进入 Home 都弹（含从其他页面返回） */
    FREQ: { enter: "每次进入页面", first: "每次登录后首次打开", daily: "每天首次打开", period: "活动期间一次", once: "永久一次" },
    freqName: function (f, q) { return f === "first" && q === "guest" ? "每次打开 App / 网站后首次打开" : PM.FREQ[f]; },
    /* 可用「当日免打扰」的显示方式 */
    todayOk: function (f) { return f === "enter" || f === "first"; },
    /* 弹窗类型（01E，2026-11-25）：类型决定能配什么，开发登记弹窗时定类型 */
    TYPES: {
      A: { n: "合规类", c: "#909399", can: "常开，不能关；固定在最前；显示方式沿用现网，只读；不计单次上限" },
      B: { n: "领取类", c: "#D46B08", can: "可关，关闭或选「不显示」时二次确认；可排序；显示方式不提供「永久一次」；没有当日免打扰；不计单次上限，保证玩家能领到" },
      C: { n: "活动类", c: "#409EFF", can: "可关；可排序；全部显示方式可选，「活动期间一次」要活动有起止时间；「每次进入页面」「首次打开」时登录状态可开当日免打扰；计入单次上限" },
      D: { n: "素材类", c: "#8E5CD9", can: "可关；可排序；没有「活动期间一次」（素材没有起止时间）；登录状态可开当日免打扰；计入单次上限；图片和跳转在素材菜单配置" },
      E: { n: "公告类", c: "#13A8A8", can: "可关；可排序；没有「活动期间一次」（公告没有起止时间）；登录状态可开当日免打扰；计入单次上限；内容在公告管理配置" },
      F: { n: "引导类", c: "#389E0D", can: "可关；通知引导可排序、默认「永久一次」、没有当日免打扰、计入单次上限；下载 App 引导即时弹出，场景和频率沿用系统参数，不计单次上限" },
      G: { n: "即时通知类", c: "#F56C6C", can: "可关；事件发生就弹，不排队、不排序，不计单次上限" },
      H: { n: "结果类", c: "#606266", can: "常开，只读；交易、认证结果通知，不排序" }
    },
    typeOf: function (p) {
      if (p.cat === "fix") return "A"; if (p.protect) return "B"; if (p.material) return "D"; if (p.notice) return "E";
      if (p.k === "notify" || p.k === "appGuide") return "F"; if (p.ro) return "H"; if (p.cat === "inst" || p.cat === "bar") return "G"; return "C";
    },
    /* 某个显示方式对这个弹窗能不能选：能选返回空串，不能选返回原因 */
    freqWhy: function (p, f) {
      var t = PM.typeOf(p);
      if (f === "period" && !p.period) return t === "D" ? "素材没有起止时间" : t === "E" ? "公告没有起止时间" : "没有起止时间";
      if (f === "once" && t === "B") return "领取类不提供：只弹一次，玩家错过后无法再领取";
      return "";
    },
    /* 这一类能不能开「当日免打扰」 */
    todayType: function (p) { var t = PM.typeOf(p); return t === "C" || t === "D" || t === "E"; },
    AFTER: { resume: "回 Home 继续弹剩余", stop: "本次剩余不再弹" },
    clone: clone, fresh: fresh, wlHit: wlHit, wlInit: wlInit, wlNorm: wlNorm, wlBare: wlBare, ownHost: ownHost, initial: function (s) { return site(s); },
    load: function () { try { var t = sessionStorage.getItem(KEY); if (t) { var s = JSON.parse(t); PM.SITES.forEach(function (n) { if (!s[n]) s[n] = site(n); if (!s[n].wl) s[n].wl = wlInit(n); }); return s; } } catch (e) {} return fresh(); },
    save: function (st) { try { sessionStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} },
    reset: function () { try { sessionStorage.removeItem(KEY); } catch (e) {} },
    pop: function (S, k) { for (var i = 0; i < S.popups.length; i++) if (S.popups[i].k === k) return S.popups[i]; return null; },
    target: function (S, id) { for (var i = 0; i < S.targets.length; i++) if (S.targets[i].id === +id) return S.targets[i]; return null; },
    /* 跳转配置的文字说明（后台显示用） */
    jtext: function (S, j) {
      if (!j || j.t === "close") return "关闭弹窗";
      if (j.t === "page" || j.t === "ext") { var t = PM.target(S, j.id); if (!t) return "未选目标"; return (j.t === "ext" ? "外部链接 · " : "") + t.name; }
      if (j.t === "game") return "指定游戏 · " + (j.g ? j.v + " · " + PM.gname(j.v, j.g) : "未选");
      if (j.t === "act") return "活动详情 · " + (j.a || "未选");
      if (j.t === "mdef") return "使用首页弹窗管理中心默认跳转";
      return "-";
    },
    stopped: function (S, j) { if (!j || (j.t !== "page" && j.t !== "ext")) return false; var t = PM.target(S, j.id); return !!(t && t.st === "stop"); },
    /* 有可配按钮的弹窗（合规、公告、素材、钱包 / 认证 / 系统类除外）——按钮跳转在来源菜单配置（PRD N38） */
    configurable: function (p) { return p.cat !== "fix" && !p.notice && !p.material && !p.ro && p.btns.some(function (b) { return b.kind !== "sys"; }); },
    /* 按来源菜单分组：活动中心各活动一组，非活动来源各一组 */
    groups: function (S) { var g = []; S.popups.forEach(function (p) { if (PM.configurable(p) && g.indexOf(p.src) < 0) g.push(p.src); }); return g; },
    /* 弹窗在某状态下的情况：{ fix } / { na } / { inst } / { on, pos } */
    stateOf: function (S, p, q) {
      if (p.cat === "fix") return { fix: true };
      if (p.cat === "inst" || p.cat === "bar") return { inst: true };
      var a = S.queues[q]; for (var i = 0; i < a.length; i++) if (a[i].k === p.k) return { on: a[i].on, pos: i + 1, it: a[i] };
      return { na: true };
    }
  };
})();
