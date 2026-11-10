/* 待确认文案清单（所有需求通用，需求包框架规范第 6.4 节「文案确认」）。
   「文案确认」页自动列出两类文案给运营确认：
     ① 本文件里写的条目：PRD「未定文案清单」、短信 / push / 弹窗 / 后台提示等还没定稿或缺失的文案；
     ② assets/proto-en.js 英文对照表里英文带「（示意）」的条目（自动读取，不用在这里重复写）。
   写法：一行一条；id 用 T01、T02…（不改号，删了也不复用）；page 页面名称，place 页面里的位置，zh 中文，en 英文（没有写 ""），
         note 为什么待确认（缺失 / 示意 / 有歧义…）。可选：lang 语言（如「前台英文」「后台中文」），use 用途（如「短信」「弹窗」）。
   多迭代需求包：每条加 iter 写所属迭代（"v1.0"、"v1.1"…，完整需求写 "完整需求" 或 "full"），各迭代的文案确认页只显示本迭代的条目；编号每个迭代从 T01 起，没写 iter 的条目所有迭代都显示。文案定稿后，把定稿内容写回 PRD 和 proto-en.js，再从这里删掉这条。
   本需求：两个弹窗的英文在这里逐条列出（带页面位置，标「示意」），proto-en.js 里同一条英文不再标「示意」，避免文案确认页重复列出。 */
window.COPY_ITEMS = [
  { id: "T01", lang: "前台英文", use: "弹窗", page: "绑定谷歌邮箱弹窗", place: "标题", zh: "绑定谷歌邮箱", en: "Link Google Email（示意）", note: "英文示意，未定稿" },
  { id: "T02", lang: "前台英文", use: "弹窗", page: "绑定谷歌邮箱弹窗", place: "说明（从游戏入口弹出）", zh: "绑定后即可开始游戏", en: "Link it to start playing（示意）", note: "英文示意，未定稿" },
  { id: "T03", lang: "前台英文", use: "弹窗", page: "绑定谷歌邮箱弹窗", place: "说明（从提款弹出）", zh: "绑定后继续提款", en: "Link it to continue your withdrawal（示意）", note: "英文示意，未定稿" },
  { id: "T04", lang: "前台英文", use: "弹窗", page: "绑定谷歌邮箱弹窗", place: "主按钮", zh: "使用 Google 绑定", en: "Continue with Google（示意）", note: "英文示意，未定稿；客服 QA 回复引用此按钮名" },
  { id: "T05", lang: "前台英文", use: "弹窗", page: "绑定谷歌邮箱弹窗", place: "主次按钮之间", zh: "或", en: "or（示意）", note: "英文示意，未定稿" },
  { id: "T06", lang: "前台英文", use: "弹窗", page: "绑定谷歌邮箱弹窗", place: "次按钮", zh: "注册 Google 账号", en: "Create Google Account（示意）", note: "英文示意，未定稿；客服 QA 回复引用此按钮名" },
  { id: "T07", lang: "前台英文", use: "弹窗", page: "绑定谷歌邮箱弹窗", place: "次按钮下方小字", zh: "注册后点「使用 Google 绑定」", en: "After signing up, tap \"Continue with Google\"（示意）", note: "英文示意，未定稿" },
  { id: "T08", lang: "前台英文", use: "弹窗", page: "绑定谷歌邮箱弹窗", place: "主按钮授权中状态", zh: "授权中…", en: "Connecting…（示意）", note: "英文示意，未定稿" },
  { id: "T09", lang: "前台英文", use: "Toast", page: "绑定谷歌邮箱弹窗", place: "授权成功提示", zh: "绑定成功", en: "Linked successfully（示意）", note: "英文示意，未定稿" },
  { id: "T10", lang: "前台英文", use: "Toast", page: "绑定谷歌邮箱弹窗", place: "邮箱已被其他账号绑定提示", zh: "该邮箱已绑定其他账号", en: "This email is linked to another account（示意）", note: "英文示意，未定稿；客服 QA 引用此提示" },
  { id: "T11", lang: "前台英文", use: "Toast", page: "绑定谷歌邮箱弹窗", place: "授权取消或失败提示", zh: "绑定失败，请重试", en: "Linking failed. Please try again.（示意）", note: "英文示意，未定稿" },
  { id: "T12", lang: "前台英文", use: "Toast", page: "绑定谷歌邮箱弹窗", place: "Google 注册页打不开提示", zh: "无法打开页面，请稍后重试", en: "Unable to open the page. Please try again later.（示意）", note: "英文示意，未定稿；原型未演示" },
  { id: "T13", lang: "前台英文", use: "Toast", page: "提款分享任务弹窗", place: "判断失败提示（提交提款；点游戏判断失败时放行，不提示）", zh: "网络异常，请重试", en: "Network error. Please try again.（示意）", note: "英文示意，未定稿；原型未演示" },
  { id: "T14", lang: "前台英文", use: "弹窗", page: "提款分享任务弹窗", place: "标题", zh: "完成分享即可提款", en: "Share to Withdraw（示意）", note: "英文示意，未定稿" },
  { id: "T15", lang: "前台英文", use: "弹窗", page: "提款分享任务弹窗", place: "说明", zh: "完成以下分享，永久解锁提款", en: "Complete these shares to unlock withdrawals for good（示意）", note: "英文示意，未定稿" },
  { id: "T16", lang: "前台英文", use: "弹窗", page: "提款分享任务弹窗", place: "渠道按钮（未完成）", zh: "去分享", en: "Share（示意）", note: "英文示意，未定稿；客服 QA 回复引用此按钮名" },
  { id: "T17", lang: "前台英文", use: "弹窗", page: "提款分享任务弹窗", place: "渠道按钮（已完成）", zh: "已完成", en: "Done（示意）", note: "英文示意，未定稿" },
  { id: "T18", lang: "前台英文", use: "Toast", page: "提款分享任务弹窗", place: "任务完成、弹窗自动关闭提示", zh: "分享任务已完成", en: "Share task completed（示意）", note: "英文示意，未定稿" },
  { id: "T19", lang: "前台英文", use: "Toast", page: "提款分享任务弹窗", place: "App 和 H5 页面都打不开提示", zh: "无法打开分享，请稍后重试", en: "Unable to open sharing. Please try again later.（示意）", note: "英文示意，未定稿" }
];
