/* 前台原型英文对照表（所有需求通用，需求包框架规范第 1 节第 ⑤ 步、第 4 节「原型语言」）。
   制作需求时，前台原型的手机画面和其他所有内容一样用中文；打包前，把手机画面里的每一条中文和对应英文写进本表。
   发布站点（打包生成的四个角色站点）的前台原型画面按本表显示英文；规则批注、模拟场景、模拟操作、演示反馈不翻译。
   本地预览英文效果：原型页地址加 ?lang=en（漏翻的中文会用红框标出，左下角显示漏翻条数），加 ?lang=zh 切回中文。
   写法：一行一条；键是画面里的中文原文（去掉首尾空格后完全一致），值是英文（和线上用词一致）。
         带变量的写成 "剩余 {n} 次": "{n} spins left"，{} 里的名字两边一致。
   PRD 附录 C「前台文案中英对照」自动读取本表显示，不用另写。 */
window.PROTO_EN = {
  "闯关": "Quest",
  // v1.0 游戏页浮动侧栏（书记员王德发 2026-11-20）
  "示例老虎机": "Sample Slot",
  "余额": "Balance",
  "旋转": "Spin",
  "投注": "Bet",
  "首页": "Home",
  "充值": "Deposit",
  "刷新": "Reload",
  "展开或收起侧栏": "Open or close sidebar",
  "此端不显示按钮，侧栏保持现状。": "Button not shown on this platform. Sidebar unchanged.",
  "PC 端不在本需求范围：PC 游戏页不显示入口，保持现状。": "Button not shown on PC. Sidebar unchanged.",
  // v1.0 活动落地页跳转示意（落地页文字为示意，线上沿用 Crown Rush 现有文案）
  "返回": "Back",
  "登录": "Log In",
  "登录后查看奖励": "Log in to view rewards",
  "登录后查看闯关进度和奖励": "Log in to view progress and rewards",
  "游戏": "Game",
  "进入游戏": "Play Game",
  "活动即将开始": "Event starts soon",
  "查看圣诞闯关进度和奖励": "View your progress and rewards",
  "活动已结束，下架前可领取奖励": "Event ended. Claim rewards before the deadline.",
  "活动公告（示意）": "Event notice",
  "活动已下架": "This event has ended.",
  "圣诞期 · 活动已下架": "Christmas · Taken down",
  "圣诞期 · {s}": "Christmas · {s}",
  "预热页": "Warm-up page",
  "进行中页": "Live page",
  "结束页": "Ended page",
  "已挂起 · 公告": "Suspended · Notice",
};