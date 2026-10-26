/* 待确认文案清单（所有需求通用，需求包框架规范第 6.4 节「文案确认」）。
   「文案确认」页自动列出两类文案给运营确认：
     ① 本文件里写的条目：PRD「未定文案清单」、短信 / push / 弹窗 / 后台提示等还没定稿或缺失的文案；
     ② assets/proto-en.js 英文对照表里英文带「（示意）」的条目（自动读取，不用在这里重复写）。
   写法：一行一条；id 用 T01、T02…（不改号，删了也不复用）；page 页面名称，place 页面里的位置，zh 中文，en 英文（没有写 ""），
         note 为什么待确认（缺失 / 示意 / 有歧义…）。可选：lang 语言（如「前台英文」「后台中文」），use 用途（如「短信」「弹窗」）。
   多迭代需求包：每条加 iter 写所属迭代（"v1.0"、"v1.1"…，完整需求写 "完整需求" 或 "full"），各迭代的文案确认页只显示本迭代的条目；编号每个迭代从 T01 起，没写 iter 的条目所有迭代都显示。文案定稿后，把定稿内容写回 PRD 和 proto-en.js，再从这里删掉这条。 */
window.COPY_ITEMS = [
  { id: "T01", lang: "后台英文", page: "后台每日提款限制设置 / 后台提现风控审核", place: "规则名称（10 条）", zh: "单笔大额提现、当日提现次数、当日累计提现金额、充提差风控、无充值提现风控、当日低投注风控、拆分提现风控、资料变更风控、静默账号风控、异常返奖率风控", en: "Single Large Withdrawal, Daily Withdrawal Count, Daily Withdrawal Total, Deposit-Withdrawal Gap Control, No-Deposit Withdrawal Control, Low Daily Turnover Control, Split Withdrawal Control, Account Change Control, Dormant Account Control, Abnormal Payout Ratio Control（示意）", note: "后台英文用词由产品拟定，待运营确认" },
  { id: "T02", lang: "后台英文", page: "后台提现风控审核", place: "命中详情弹窗表头", zh: "序号、优先级、命中规则、类型、触发原因、统计区间、实际值、阈值", en: "No., Priority, Triggered Rule, Type, Trigger Reason, Statistics Period, Actual Value, Threshold（示意）", note: "后台英文用词由产品拟定，待运营确认" },
  { id: "T03", lang: "后台英文", page: "后台提现风控审核", place: "规则计算异常的名称和触发原因", zh: "规则计算异常；风控判定服务不可用", en: "Rule Check Error; Risk check service unavailable（示意）", note: "后台英文用词由产品拟定，待运营确认" },
  { id: "T04", lang: "后台英文", page: "后台支付层级配置", place: "提款风控规则选项", zh: "执行、豁免", en: "Enforce, Exempt（示意）", note: "后台英文用词由产品拟定，待运营确认" },
  { id: "T05", lang: "后台英文", page: "三张后台页面", place: "其余后台文字", zh: "见 assets/admin-en-dict.js 全表", en: "见 assets/admin-en-dict.js（示意）", note: "后台英文全表待运营确认" },
  // { id: "T01", page: "【页面名称】", place: "【位置，如：领取成功弹窗标题】", zh: "【中文文案】", en: "【English copy（示意）】", note: "【英文未定稿】" },
  // 多迭代示例：{ id: "T01", iter: "v1.0", lang: "前台英文", use: "弹窗", page: "【页面名称】", place: "【位置】", zh: "【中文】", en: "【English（示意）】", note: "【英文未定稿】" },
];