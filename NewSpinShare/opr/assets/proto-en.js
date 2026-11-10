/* 前台原型英文对照表（所有需求通用，需求包框架规范第 1 节第 ⑤ 步、第 4 节「原型语言」）。
   制作需求时，前台原型的手机画面和其他所有内容一样用中文；打包前，把手机画面里的每一条中文和对应英文写进本表。
   发布站点（打包生成的四个角色站点）的前台原型画面按本表显示英文；规则批注、模拟场景、模拟操作、演示反馈不翻译。
   本地预览英文效果：原型页地址加 ?lang=en（漏翻的中文会用红框标出，左下角显示漏翻条数），加 ?lang=zh 切回中文。
   写法：一行一条；键是画面里的中文原文（去掉首尾空格后完全一致），值是英文（和线上用词一致）。
         带变量的写成 "剩余 {n} 次": "{n} spins left"，{} 里的名字两边一致。
   PRD 附录 C「前台文案中英对照」自动读取本表显示，不用另写。
   本需求两个弹窗的英文还没定稿：待确认条目列在 assets/copy-items.js（文案确认页），定稿后改这里并从 copy-items.js 删掉对应条目。 */
window.PROTO_EN = {
  /* 本需求新增：绑定谷歌邮箱弹窗 */
  "绑定谷歌邮箱": "Link Google Email",
  "绑定后即可开始游戏": "Link it to start playing",
  "绑定后继续提款": "Link it to continue your withdrawal",
  "使用 Google 绑定": "Continue with Google",
  "或": "or",
  "注册 Google 账号": "Create Google Account",
  "注册后点「使用 Google 绑定」": "After signing up, tap \"Continue with Google\"",
  "授权中…": "Connecting…",
  "绑定成功": "Linked successfully",
  "该邮箱已绑定其他账号": "This email is linked to another account",
  "绑定失败，请重试": "Linking failed. Please try again.",
  /* 本需求新增：提款分享任务弹窗 */
  "完成分享即可提款": "Share to Withdraw",
  "完成以下分享，永久解锁提款": "Complete these shares to unlock withdrawals for good",
  "去分享": "Share",
  "已完成": "Done",
  "分享任务已完成": "Share task completed",
  "无法打开分享，请稍后重试": "Unable to open sharing. Please try again later.",
  /* 现有页面（沿用线上文案） */
  "余额 ₱1,289.00": "Balance ₱1,289.00",
  "热门游戏": "Hot Games",
  "全部 ›": "All ›",
  "首页": "Home",
  "活动": "Promos",
  "钱包": "Wallet",
  "我的": "Me",
  "游戏加载中…": "Loading game…",
  "返回": "Back",
  "关闭": "Close",
  "提款": "Withdraw",
  "可提款余额": "Withdrawable balance",
  "提款金额": "Withdrawal amount",
  "提款方式": "Withdrawal method",
  "提交": "Submit",
  "提款申请已提交": "Withdrawal submitted"
};
