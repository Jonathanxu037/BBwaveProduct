/* 前台原型英文对照表（所有需求通用，需求包框架规范第 1 节第 ⑤ 步、第 4 节「原型语言」）。
   制作需求时，前台原型的手机画面和其他所有内容一样用中文；打包前，把手机画面里的每一条中文和对应英文写进本表。
   发布站点（打包生成的四个角色站点）的前台原型画面按本表显示英文；规则批注、模拟场景、模拟操作、演示反馈不翻译。
   本地预览英文效果：原型页地址加 ?lang=en（漏翻的中文会用红框标出，左下角显示漏翻条数），加 ?lang=zh 切回中文。
   写法：一行一条；键是画面里的中文原文（去掉首尾空格后完全一致），值是英文（和线上用词一致）。
         带变量的写成 "剩余 {n} 次": "{n} spins left"，{} 里的名字两边一致。
   PRD 附录 C「前台文案中英对照」自动读取本表显示，不用另写。 */
window.PROTO_EN = {
  /* 客服窗口现有界面（用词和线上一致，2026-10-22 截图） */
  "💬 联系我们": "💬 Chat with us",
  "在线客服": "Customer Support",
  "在线 · 实时": "Online · Live",
  "结束对话": "End Chat",
  "需要什么帮助？": "How can we help?",
  "热门问题": "Hot Questions",
  "充值与提现": "Deposits & Withdrawals",
  "账号": "Account",
  "我忘记了登录密码，怎么办？": "I forgot my login password. What should I do?",
  "我的充值没到账，怎么办？": "My deposit is missing. What do I do?",
  "我的提现延迟了，要多久？": "My withdrawal is delayed. How long does it take?",
  "🎧 转人工": "🎧 Live Agent",
  "输入消息": "Type a message",
  "关闭": "Close",
  "🧾 最近一笔充值 / 提现": "🧾 Latest deposit / withdrawal",
  "暂无充值或提现记录": "No deposit or withdrawal records yet",
  "查看订单": "View Orders",
  "订单": "Orders",
  "充值 (0)": "Deposits (0)",
  "提现 (0)": "Withdrawals (0)",
  "最近 0 条记录 · 点一行可复制订单号": "Latest 0 records · tap a row to copy its order number",
  "暂无记录": "No records yet",
  "充值 (1)": "Deposits (1)",
  "最近 1 条记录 · 点一行可复制订单号": "Latest 1 record · tap a row to copy its order number",
  "没有更多了": "No more records",
  "🎧 人工客服": "🎧 Live Support",
  /* 自助问题优化新增文案（研发依据平台现行方案定稿，PRD 9.1） */
  "登录后即可查看订单。": "Log in to view your orders.",
  "登录": "Log In",
  "加载失败，请刷新重试": "Failed to load. Please refresh and try again.",
  "刷新": "Refresh",
  "操作过于频繁，请 1 分钟后再试": "Too many attempts. Please try again in 1 minute.",
  "关闭，回到对话窗": "Close and return to chat",
  "返回对话窗": "Back to chat",
  /* 原型里的示例数据和演示反馈 */
  "充值 ₱500.00 · 处理中": "Deposit ₱500.00 · Processing",
  "2026-10-22 14:05 · 订单号 D2026102214051234": "2026-10-22 14:05 · Order No. D2026102214051234",
  "（现有自动回复，本需求不改）": "(Existing auto-reply, unchanged)",
  "正在为你转接人工客服…（回到原对话转人工，不新开会话）": "Connecting you to a live agent… (in the same chat, no new conversation)",
  "已重新获取记录": "Records reloaded",
  "已复制订单号": "Order number copied",
  "登录成功，已回到客服对话窗": "Logged in. Back to the chat.",
  "关闭整个客服窗口（现有方式，不变）": "Close the whole chat window (existing behavior, unchanged)",
  "跳转到平台现有登录页": "Go to the existing login page"
};
