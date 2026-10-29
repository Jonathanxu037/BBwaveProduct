/* 原型修改标注数据：「运营需求确认」页据此在原型上标出各版本改过的地方，并显示版本号角标。
   只记录「页面」类修改：前台、后台页面上看得到的控件、文案、布局、交互。
   逻辑层修改（判定规则、接口、数据口径）不记在这里，只在 PRD 里标注；误写 type: "逻辑" 的条目也不会显示。
   首版 v1.0 不做标注。每新增一个需求版本，把这个版本对原型页面的修改逐条加进来，格式：
   {
     ver: "v1.1",                                        // 需求版本号，和 PRD 需求版本管理表一致
     date: "2026-10-12",                                 // 版本日期
     page: "prototype/admin/VIP会员体系-后台XX页面.html",   // 原型页面路径，和 nav-data.js 一致
     view: "new",                                        // 修改所在视图（页面没有视图时不写）
     target: "[data-ch='xx-field']",                   // 被修改的元素，CSS 选择器；建议在原型元素上加 data-ch 属性
     title: "XX 下拉",                               // 修改的内容项名称
     items: ["选项名称由「旧名称」改为「新名称」"]    // 这个版本改了什么，一行一条，写清改前和改后
   }
   同一个元素在多个版本都改过时，每个版本各写一条；原型上只显示最新版本的角标，点开可看到更早的修改。 */
window.PROTO_CHANGES = [
  /* v1.2（2026-10-29）：v1.2 迭代原型相对 2026-10-27 首版的页面修改，和 PRD 需求版本管理表 v1.2「涉及章节」第 4、5、7 章对应 */
  { ver: "v1.2", date: "2026-10-29", page: "prototype/v1.2/front/VIP会员体系-VIP中心页面.html", view: "vip0", target: "#arcwrap", title: "弧形等级刻度", items: ["VIP0 的刻度和等级卡改为前台显示「会员」（英文 Member），不显示等级号", "刻度和等级卡数量由固定 26 个改为随后台新增、删除等级变化（默认 26 个：会员 + VIP1–SUPER VIP）"] },
  { ver: "v1.2", date: "2026-10-29", page: "prototype/v1.2/front/VIP会员体系-VIP中心页面.html", view: "vip5", target: "#car", title: "当前等级卡", items: ["「本月保级成功 ✓」+「升级」+ 还差金额，改为图标进度行：🛡️ 保级进度、🎰 累计有效投注、钱包 累计充值，右侧差额或 ✓，不写「还差」", "标题行改为「UP VIPn」+ 右侧「保级成功」；进度下方新增奖金行：升到 VIPn 升级奖金、月度奖金、生日奖金", "卡片底部「查看详情」弹窗改为先显示「享有奖励」奖金表，再显示玩家在该等级的保级、升级数据"] },
  { ver: "v1.2", date: "2026-10-29", page: "prototype/v1.2/front/VIP会员体系-VIP中心页面.html", view: "demoted", target: "#car", title: "降级玩家等级卡", items: ["卡上不再显示「本月达到可在次月恢复到 VIPn」「历史最高：VIPm」，改到「查看详情」弹窗（历史最高框、「→ VIPn+1」次月恢复）", "高于当前、≤ 历史最高的卡显示「🔓 已解锁」；更高的卡显示「先恢复 VIPn」"] },
  { ver: "v1.2", date: "2026-10-29", page: "prototype/v1.2/front/VIP会员体系-VIP中心页面.html", view: "vip0back", target: "#car", title: "VIP1 降为会员的等级卡", items: ["「VIP1 保级失败 · 回到 VIP0」改为「降为 VIP0（前台显示「会员」）」", "「已达到恢复条件，下月恢复到 VIP1 ✓」改为 🎰 本月有效投注 ÷ VIP1 保级投注 +「恢复 VIP1」进度行"] },
  { ver: "v1.2", date: "2026-10-29", page: "prototype/v1.2/front/VIP会员体系-VIP中心页面.html", view: "settling", target: "#car", title: "结算中", items: ["「上月结算中，预计 13:00（GMT+8）前完成…」改为「⏳ 上月结算中，预计 13:00 完成」，只替换玩家数据部分，奖金行照常", "新增场景「结算中 · 13:30 后未完成」：显示「⏳ 上月结算中，完成后自动更新」"] },
  { ver: "v1.2", date: "2026-10-29", page: "prototype/v1.2/front/VIP会员体系-VIP中心页面.html", view: "bd-wait", target: "#bdCard", title: "生日卡片 · 1 日生日结算中", items: ["生日奖金金额由「生日当天 00:00 的等级」改为「生日所在月份 1 日 13:00 结算后的等级」", "新增场景：1 日 00:00 至结算完成，卡片金额显示「—」、状态「⏳ 结算完成后可领取」，无按钮", "「查看详情」弹窗生日奖金行同步：结算完成前金额显示「—」、状态「⏳ 结算完成后可领取」（2026-10-29）"] },
  { ver: "v1.2", date: "2026-10-29", page: "prototype/v1.2/front/VIP会员体系-VIP中心页面.html", view: "bd-rejected", target: "#bdCard", title: "生日卡片 · 已驳回", items: ["新增场景：已驳回显示「未通过审核，有疑问联系客服」，不显示按钮，保留到有效期结束后隐藏；「查看详情」生日奖金状态为「未通过审核」"] },
  { ver: "v1.2", date: "2026-10-29", page: "prototype/v1.2/front/VIP会员体系-VIP中心页面.html", view: "bd-pending", target: "#bdCard", title: "生日卡片 · 领取提示", items: ["领取成功 toast「领取成功，生日奖金已到账」改为「领取成功，已到账」", "领取失败 toast「领取失败，请稍后重试」改为「领取失败，请重试」"] },
  { ver: "v1.2", date: "2026-10-29", page: "prototype/v1.2/front/VIP会员体系-VIP中心页面.html", view: "risk", target: "#riskBar", title: "风控暂停提示条", items: ["「你的部分 VIP 奖金暂未发放，如有疑问请联系客服。」改为「部分 VIP 奖金暂未发放，有疑问联系客服」", "生日卡片「暂不可领取，如有疑问请联系客服」改为「暂不可领取，有疑问联系客服」，无按钮"] },
  { ver: "v1.2", date: "2026-10-29", page: "prototype/v1.2/front/VIP会员体系-VIP中心页面.html", view: "vip5", target: "#lvTable", title: "VIP 等级表", items: ["去掉「等级要求」页签，只显示等级奖励 4 列：等级、升级奖金、月度奖金、生日奖金，不横向滚动", "不列会员行，只列 VIP1–SUPER VIP，行数按后台配置（默认 25 行）", "限高由约 9 行改为约 13 行，表内上下滚动、表头固定"] },
  { ver: "v1.2", date: "2026-10-29", page: "prototype/v1.2/front/VIP会员体系-VIP中心页面.html", view: "vip5", target: "#infoBtn", title: "VIP 规则", items: ["页面上的「VIP 规则」区块改为标题栏右上角「i」按钮，点击弹窗显示", "规则每条精简为一句话，最多 13 条；流水第 10 条改为「VIP 奖金完成 1 倍流水后可提现」；生日奖金改为按生日所在月份 1 日结算后的等级"] },
  { ver: "v1.2", date: "2026-10-29", page: "prototype/v1.2/front/VIP会员体系-VIP中心页面.html", view: "nokyc", target: "#guide", title: "KYC 引导卡", items: ["按钮「去完成 KYC」改为「去认证」，标题改为「完成 KYC 加入 VIP」", "新增场景「未完成 KYC · 审核中」：按钮置灰并显示「KYC 审核中」"] },
  { ver: "v1.2", date: "2026-10-29", page: "prototype/v1.2/front/VIP会员体系-VIP中心页面.html", view: "off", target: "#vOff", title: "VIP 体系关闭", items: ["「VIP 会员体系暂未开放，敬请期待」改为「VIP 暂未开放」"] },
  { ver: "v1.2", date: "2026-10-29", page: "prototype/v1.2/front/VIP会员体系-VIP中心页面.html", view: "logout", target: "#car", title: "未登录", items: ["「登录后查看我的 VIP 进度」改为「登录查看 VIP 进度」"] },
  { ver: "v1.2", date: "2026-10-29", page: "prototype/v1.2/front/VIP会员体系-VIP通知页面.html", view: "up-one", target: "#upLine", title: "升级弹窗 · 单级", items: ["「你已升级到 VIP5」改为「已升级到 VIP5」", "按钮「查看 VIP 权益」改为「查看权益」"] },
  { ver: "v1.2", date: "2026-10-29", page: "prototype/v1.2/front/VIP会员体系-VIP通知页面.html", view: "up-multi", target: "#upLine", title: "升级弹窗 · 跨多级", items: ["「你已从 VIP0 升级到 VIP3」改为「已从会员升级到 VIP3」（VIP0 前台显示「会员」）"] },
  { ver: "v1.2", date: "2026-10-29", page: "prototype/v1.2/front/VIP会员体系-VIP通知页面.html", view: "up-audit", target: "#upAmt", title: "升级弹窗 · 强制审核", items: ["「升级奖金 ₱48 审核中，审核通过后到账」改为「升级奖金 ₱48 审核中，通过后到账」"] },
  { ver: "v1.2", date: "2026-10-29", page: "prototype/v1.2/front/VIP会员体系-VIP通知页面.html", view: "up-pending", target: "#upAmt", title: "升级弹窗 · 奖金发放中", items: ["新增场景：升级时到账接口失败，升级照常生效，金额行显示「升级奖金发放中」"] },
  { ver: "v1.2", date: "2026-10-29", page: "prototype/v1.2/front/VIP会员体系-VIP通知页面.html", view: "sms-monthly", target: "#smsText", title: "月度奖金到账短信", items: ["「…VIP 月度奖金已到账！登录 789Bingo 查看奖励。」改为「…VIP 月度奖金已到账！登录 789Bingo 查看。」"] },
  { ver: "v1.2", date: "2026-10-29", page: "prototype/v1.2/front/VIP会员体系-VIP通知页面.html", view: "sms-bd-before", target: "#smsText", title: "生日提醒短信 · 前一天", items: ["改为「明天是你的生日！明天到 789Bingo VIP中心领取 VIP 生日奖金。」（精简，不写金额）"] },
  { ver: "v1.2", date: "2026-10-29", page: "prototype/v1.2/front/VIP会员体系-VIP通知页面.html", view: "sms-bd-today", target: "#smsText", title: "生日提醒短信 · 当天", items: ["「你的 PHP488 VIP 生日奖金已可领取，请在…」改为「PHP488 VIP 生日奖金请在…前到 VIP中心领取」"] },
  { ver: "v1.2", date: "2026-10-29", page: "prototype/v1.2/front/VIP会员体系-VIP通知页面.html", view: "inbox", target: "#vInbox", title: "到账站内信与 APP 推送", items: ["正文精简：「₱38 VIP 月度奖金已到账」改为「₱38 已到账」；「恭喜升级到 VIP5，₱48 升级奖金已到账」改为「升级到 VIP5，₱48 已到账」；「₱488 VIP 生日奖金已到账」改为「₱488 已到账」"] },
  { ver: "v1.2", date: "2026-10-29", page: "prototype/v1.2/admin/VIP会员体系-后台VIP配置页面.html", view: "levels", target: ".bo-crumb", title: "菜单与面包屑", items: ["原 3 个后台页面（VIP配置、会员福利、VIP数据报表）合并为 1 个页面，按现网【用户管理 › 会员等级】改造", "菜单名「会员等级」改为「VIP会员等级配置」"] },
  { ver: "v1.2", date: "2026-10-29", page: "prototype/v1.2/admin/VIP会员体系-后台VIP配置页面.html", view: "levels", target: "#tab-levels", title: "页签", items: ["页签改为「VIP会员等级配置」「VIP会员等级奖励配置」「活动奖励统计」，新增第 4 个页签「VIP月度结算记录」"] },
  { ver: "v1.2", date: "2026-10-29", page: "prototype/v1.2/admin/VIP会员体系-后台VIP配置页面.html", view: "levels", target: "#lvTable", title: "门槛表", items: ["表头改为「会员等级｜累计有效投注｜累计充值｜保级投注｜操作」，每行直接修改，下方「保存」", "「普通会员 / 普通玩家」行改名 VIP0，一行全 0 只读", "保留「操作」列：VIP0 行「新增」，最高一级行「删除」"] },
  { ver: "v1.2", date: "2026-10-29", page: "prototype/v1.2/admin/VIP会员体系-后台VIP配置页面.html", view: "add-save", target: "#dPrev", title: "新增等级 · 影响预览", items: ["新增等级：最下方加新的 SUPER VIP，原 SUPER VIP 顺延为 VIPn，一次 1 行、最多 60 个 VIP 等级", "保存时在影响预览里一起填写新等级的升级奖金、月度奖金、生日奖金"] },
  { ver: "v1.2", date: "2026-10-29", page: "prototype/v1.2/admin/VIP会员体系-后台VIP配置页面.html", view: "del", target: "#dDel", title: "删除最高一级", items: ["新增：只能删除最高一级，确认后立即生效不可撤销；次高级改名 SUPER VIP，被删等级的玩家改为低一级，不发升级奖金；至少保留 1 个 VIP 等级"] },
  { ver: "v1.2", date: "2026-10-29", page: "prototype/v1.2/admin/VIP会员体系-后台VIP配置页面.html", view: "locked-fail", target: "#lockBar", title: "结算失败锁定", items: ["新增场景：月度结算失败、补跑完成前，等级配置锁定不可修改"] },
  { ver: "v1.2", date: "2026-10-29", page: "prototype/v1.2/admin/VIP会员体系-后台VIP配置页面.html", view: "global", target: "#sGlobal", title: "VIP会员等级奖励配置", items: ["顶部「活动状态」改名「VIP领取奖励」（开启 / 关闭，即 VIP 体系开关）", "小标题改为「VIP会员等级奖励规则」"] },
  { ver: "v1.2", date: "2026-10-29", page: "prototype/v1.2/admin/VIP会员体系-后台VIP配置页面.html", view: "global", target: ".lv-grey", title: "实体奖品表", items: ["新增：右侧实体奖品表保留但置灰，标「本期不做」，不可操作"] },
  { ver: "v1.2", date: "2026-10-29", page: "prototype/v1.2/admin/VIP会员体系-后台VIP配置页面.html", view: "list", target: "#sList", title: "活动奖励统计", items: ["原「会员福利 › VIP奖金记录」移到本页签「活动奖励统计」：升级、月度、生日奖金的发放记录，审核、放行、作废、补发、导出"] },
  { ver: "v1.2", date: "2026-10-29", page: "prototype/v1.2/admin/VIP会员体系-后台VIP配置页面.html", view: "settle", target: "#sSettle", title: "VIP月度结算记录", items: ["新增页签：每月结算汇总列表，只读，含结算失败、单人结算失败状态"] },
  { ver: "v1.2", date: "2026-10-29", page: "prototype/v1.2/admin/VIP会员体系-后台VIP配置页面.html", view: "settle-dtl", target: "#stDtl", title: "结算明细", items: ["新增：结算明细列表（会员账号、等级、结果筛选），分页和导出"] }
];
