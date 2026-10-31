/* 前台原型英文对照表（所有需求通用，需求包框架规范第 1 节第 ⑤ 步、第 4 节「原型语言」）。
   制作需求时，前台原型的手机画面和其他所有内容一样用中文；打包前，把手机画面里的每一条中文和对应英文写进本表。
   发布站点（打包生成的四个角色站点）的前台原型画面按本表显示英文；规则批注、模拟场景、模拟操作、演示反馈不翻译。
   本地预览英文效果：原型页地址加 ?lang=en（漏翻的中文会用红框标出，左下角显示漏翻条数），加 ?lang=zh 切回中文。
   写法：一行一条；键是画面里的中文原文（去掉首尾空格后完全一致），值是英文（和线上用词一致）。
         带变量的写成 "剩余 {n} 次": "{n} spins left"，{} 里的名字两边一致。
   PRD 附录 C「前台文案中英对照」自动读取本表显示，不用另写。
   本需求（VIP会员体系）：英文为原型此前定稿的英文（含 Claire 原文英文），原样保留；英文后标「（示意）」的是还没定的英文
   2026-10-17：实物相关文案（实物按钮、我的奖品申请、实物领取页）和 Level 段文案（等级奖励表、Lv 卡）已删除；新增普通用户、降级恢复、KYC 提示文案；短信货币改为 PHP。
   2026-10-17（续）：「暂无可显示的等级」删除，改为普通用户卡片说明；新增恢复不发保级奖励的提示和规则（用户 2026-10-17 定）。
   2026-10-17（再续）：按原文倾向升级、保级奖励自动到账（撤销 10-16 一键领取），生日奖励在生日卡片领取：删除卡片合计行、领取结果弹窗、「当前可领取」和升级弹窗「立即领取」的对照，新增「已到账」「知道了」「生日奖励已到账」；当月有升级的达标照常发保级奖励（用户 2026-10-17 定）。
   2026-10-17（KYC）：未完成 KYC 不参与 VIP 体系（已定，用户 2026-10-17）：删除 KYC 拦截弹窗（需要完成 KYC 认证、请先完成 KYC 认证再领取、立即认证）；新增 KYC 引导卡、通知页「未完成 KYC」场景说明；改写 KYC 规则条。
   2026-10-17（Claire 原文与答复调整）：恢复当次照常发保级奖励（删除「恢复时不发保级奖励」「下月恢复等级，不发放」，新增「下月恢复到 {level}」）；KYC 引导卡改为「享受之后的…」；奖励表表头「累计投注」改为「累计有效投注」（删除「累计投注」）；恢复规则条改写（含 VIP1 回到 VIP1）；生日短信改为「明天可领取」、金额写「PHP488」。
   2026-10-17（英文精简）：所有英文名称（标题、按钮、表头、状态、标签、交易类型）按最短、最精炼的方式显示（用户 2026-10-17）；整句说明、规则、短信正文不在此列（短信沿用 Claire 原文英文）。能缩写的用缩写（Ret.、Dep.、Amt、B-day、/m），以不换行、不破版为准；现有 App 已有的文案（返回、登录、手机号码、交易记录等）保持线上用词。
   2026-10-17（两处领取）：生日奖励在生日卡片和等级卡「详情」弹窗都可领取（用户 2026-10-17）：删除「请在生日卡片领取」；改写详情弹窗底部小字和 VIP 规则第 8、9 条的对照。
   2026-10-17（第二轮复核）：「?」弹窗标题「等级与 VIP 规则」改为「VIP 规则」（删除「等级与 VIP 规则」）；VIP 规则新增末条「如有疑问，请联系客服。」；生日条款改为「按你生日当天的 VIP 等级」（英文去掉有歧义的 current）；恢复条款括号改为「次月 1 日结算时照常获得…」；详情弹窗底部小字的流水倍数改为模板 {n}；生日短信领取期限写到 23:59。
   2026-10-19（决策第 6 项）：新增「当前等级 LEVEL {n}」→「Level {n}」（后台「前台会员等级显示」为「显示会员等级」时普通用户显示；示意，待文档同步）。
   2026-10-19（待确认清单）：新增成长值模式「成长值还差 {n}」「成长值」（第 6 条）；详情弹窗「已达标，下月 1 日到账」改为图标 + 「下月 1 日到账」，新增图标说明「已达标」「下月恢复」（第 32 条）；
     通知页新增 Level 升级弹窗「恭喜升级！」「（现有平台样式，示意）」和开关关闭说明（第 17–19 条）；删除「已达标，下月 1 日到账」（示意，待文档同步）。
   2026-10-19（第 2 轮）：前台不显示成长值（F2）：删除「成长值还差 {n}」「成长值」，新增「升级进度」→ Progress；老版本 App 的 VIP 玩家显示 VIP（F3）：新增「当前等级 {level}」「请更新 App 查看 VIP 权益。」；
     开关改名「前台会员等级显示」（第 20 条）：通知页开关关闭说明改为「（前台会员等级显示为「都显示为普通会员」：…）」（删除原关闭说明）（示意，待文档同步）。
   2026-10-19（第 3 轮）：保级短信时间改为「11月1日 周日 · 00:05」并加灰字「（结算完成后立即发送，时间为示意）」（删除「11月1日 周日 · 10:00」，第 2 条）；新增老版本 App 未完成 KYC 提示「完成 KYC 即可加入 VIP 会员体系。」（第 6 条）；
     新增「你当前为会员 LEVEL {n}」（第 7 条）；新增场景灰字「（10-08 已升 VIP14，本月按 VIP14 考核）」「（离线期间升级，下次进入时补弹）」（第 19 条）；VIP 规则英文改用奖励表表头名称 Total Bet / Total Dep. / Ret. Bet/m（第 16 条）；
     追加「前台不显示流水倍数」：删除「升级奖励、保级奖励和生日奖励需完成」「倍流水，」「全部游戏」「Slot 游戏」「的有效投注计入该流水。」「倍流水」「已到账 ·」，详情弹窗底部小字去掉「奖励均需 {n} 倍流水」（示意，待文档同步）。
     追加 2「VIP 短信和推送避开 21:00–10:00」：保级短信时间改为「11月1日 周日 · 10:00」，灰字改为「（1 日 00:05 结算完成，处于 21:00–10:00 免打扰时段，顺延到 10:00 发送）」（删除「11月1日 周日 · 00:05」「（结算完成后立即发送，时间为示意）」）；到账页新增「（21:00–10:00 触发的推送顺延到 10:00 发送，站内信即时生成）」（示意，待文档同步）。
     追加 3「Level 跟随开关」：老版本 App 未完成 KYC 的卡片也跟随开关显示「LEVEL {n}」「你当前为会员 LEVEL {n}」，「完成 KYC 即可加入 VIP 会员体系。」改为单独一行保留；对照条目不增不删。
   2026-10-19（第 4 轮）：保级短信为 Claire 原文十六，画面不再显示示意标签，保级短信场景灰字英文去掉「（示意）」；生日过期口径统一：「（过期次日 00:00 起生日卡片已隐藏）」改为「（10-29 00:00 起不再显示生日卡片）」（删除原条目）；「示例文案」「示意 · 待运营定稿」仍用于生日短信，保留（待文档同步）。
   2026-10-19（游戏中不弹窗）：通知页新增场景「游戏中升级」：「第三方游戏」「返回大厅」和两条场景灰字（待文档同步）。
   2026-10-19（当前卡升级差额）：当前等级卡新增小标题「升级到 {level}」→ Next: {level}（用户 2026-10-19，待文档同步）。
   2026-10-19（当前卡升级差额改为一行）：去掉当前卡的两条升级进度，保级金额后同一行追加「投注差 {amount} · 充值差 {amount}」→ Bet {amount} · Dep {amount}，成长值模式「进度 {n}」→ Prog. {n}（已达到的一项沿用「投注」「充值」+ 对勾；删除「升级到 {level}」；用户 2026-10-19，待文档同步）。
   2026-10-19（前台金额统一 · 当前卡精简）：前台金额统一按「₱9,999 及以下完整、₱10,000 起 K、₱1,000,000 起 M、十亿起 B」显示（用户 2026-10-19，pending 第 105 条），本表无含具体 ₱ 金额的条目（金额都走 {amount} 或单独文字节点），不用改；
     当前卡去掉保级进度条，改为一行「阶段标签 + 内容」（默认保级、保级达成后升级、降级玩家恢复）：新增阶段标签「保级」「升级」「恢复」「恢复 {level}」→ Keep / Up / Back、「下月 {level}」、「投注\u2060」「充值\u2060」（带 U+2060）→ Bet / Dep 和 SUPER VIP 的「已是最高等级」→ Top level（用户 2026-10-19，待文档同步）。
   2026-10-19（当前卡进度条）：当前卡保级 / 升级 / 恢复改为「阶段标签 + 进度条 + 还差金额」，不显示百分比（进度行沿用「投注还差 {amount}」「充值还差 {amount}」「投注」「充值」，已达恢复沿用「下月恢复到 {level}」）：
     新增「进度」→ Progress（成长值模式）；删除「投注 {amount}」「充值 {amount}」「进度 {n}」「投注⁠」「充值⁠」「恢复」「下月 {level}」；下一级未解锁卡的进度同样去掉百分比，对照条目不变（用户 2026-10-19，待文档同步）。
     再改（用户 2026-10-19，覆盖「保级达成后切换为升级」）：当前卡只显示保级，达成后「本月保级成功」→ Retained；删除「升级」「恢复 {level}」「已是最高等级」（待文档同步）。
     追加：VIP1 前新增普通用户卡：新增「达到 VIP1 即可成为 VIP 会员」「本月达到恢复条件即可回到 VIP1」；满格条上方「100%」小标签删除（无对照条目）（用户 2026-10-19，待文档同步）。
     追加 2：等级卡「详情」改为卡片底部按钮「查看详情」→ Details（删除「详情」）（用户 2026-10-19，待文档同步）。
     追加 3：普通用户有等级奖励时卡片也有「查看详情」，新增弹窗「普通用户奖励」「LEVEL {n} 奖励」「生日礼包」、底部小字和领取提示（用户 2026-10-19，待文档同步）。
   （画面上的示意标记由页面的「（示意）」小字显示，本表的「（示意）」不显示在画面上，只用于 PRD 附录 C 和未定文案清单）。
   英文里有前后空格的，是为了和相邻的金额、等级等拼成原句，不要删。 */
window.PROTO_EN = {
  /* ===== 通用（3 个前台页面共用） ===== */
  "返回": "Back",
  "等级中心": "Level Center",
  "领取": "Claim",
  "已领取": "Claimed",
  "已过期": "Expired",
  "待核验": "Verifying",
  "取消": "Cancel",
  "关闭": "Close",
  "生日快乐！": "Happy Birthday!",
  "有效期至 {date}（GMT+8）": "Valid until {date} (GMT+8)",
  "VIP 奖励": "VIP Rewards",
  "升级奖励": "Upgrade",
  "已完成": "Completed",   /* 圆形对勾图标的无障碍说明（aria-label / title） */
  "保级奖励": "Retain",   /* \u00AD 为软连字符：VIP 奖励表窄列内可断词，不显示（用户 2026-10-17 去横向滚动） */
  "生日奖励": "B-day",
  "。": ".",
  "）": ")",

  /* ===== VIP中心页面（Level Center） ===== */
  "等级刻度": "Levels",
  "当前": "Current",
  "普通用户": "Regular（示意）",
  "当前等级 LEVEL {n}": "Level {n}",   /* 后台「前台会员等级显示」为「显示会员等级」时普通会员级别玩家头像下的一行；徽章「LEVEL n」保持原样（用户 2026-10-19 决策第 6 项，示意，待文档同步） */
  "你当前为会员 LEVEL {n}": "You're Level {n}（示意）",   /* 普通用户卡片说明（开关为「显示会员等级」时，卡片标签为「LEVEL n」；用户 2026-10-19 第 3 轮第 7 条） */
  "完成 KYC 即可加入 VIP 会员体系。": "Complete KYC to join VIP.（示意）",   /* 老版本 App 未完成 KYC 的卡片提示行（第 3 轮第 6 条；追加 3 起与 LEVEL 说明并存） */
  "（10-08 已升 VIP14，本月按 VIP14 考核）": "(Reached VIP14 on Oct 8; assessed at VIP14)（示意）",   /* 场景灰字说明（第 3 轮第 19 条） */
  /* 老版本 App 的 VIP 玩家（用户 2026-10-19 第 2 轮第 F3 条）：必须放在「当前等级 LEVEL {n}」之后，避免抢先匹配 LEVEL 那一行 */
  "当前等级 {level}": "Current: {level}（示意）",
  "请更新 App 查看 VIP 权益。": "Update the app to see VIP perks.（示意）",
  "你当前为普通用户，暂不显示 VIP 等级、进度和奖励。": "You are a Regular User. VIP levels, progress and rewards are not shown for now.（示意）",
  "本月有效投注达到 {amount} 可在下月恢复到 {level}": "Reach {amount} in valid bets this month to return to {level} next month（示意）",
  "已达到恢复条件，下月恢复到 {level} ✓": "Recovery reached — back to {level} next month ✓（示意）",
  "本月达到恢复条件可在下月恢复到 {level}": "Meet target to return to {level}（示意）",   /* 计算方式 = 成长值时的恢复说明，不写金额（用户 2026-10-20） */
  "跳到现有 KYC 认证页（示意）": "Opens the existing KYC verification page（示意）",
  "跳到现有 KYC 认证页": "Opens the existing KYC verification page（示意）",
  /* 未完成 KYC 的引导卡（已定，用户 2026-10-17） */
  "加入 VIP 会员体系": "Join VIP（示意）",
  "完成 KYC 后即可加入 VIP 会员体系，享受之后的升级、保级和生日奖励。": "Complete KYC to join the VIP Program and enjoy Upgrade, Retention and Birthday Bonuses from then on.（示意）",
  "你的 KYC 正在审核中，审核通过后即可加入 VIP 会员体系，享受之后的升级、保级和生日奖励。": "Your KYC is under review. Once approved, you can join the VIP Program and enjoy Upgrade, Retention and Birthday Bonuses from then on.（示意）",
  "去完成 KYC": "Verify KYC（示意）",
  "查看 KYC 进度": "KYC Status（示意）",
  "已达成": "Achieved",
  "🔓 已解锁": "🔓 Unlocked",
  "🔒 未解锁": "🔒 Locked",
  "历史最高：": "Highest: ",
  "投注": "Bet",
  "充值": "Deposit",
  "投注还差 {amount}": "Bet {amount} more",
  "充值还差 {amount}": "Deposit {amount} more",
  /* 当前等级卡只显示保级（用户 2026-10-19 再改，待文档同步）：未达成「保级」标签 + 「投注还差 {amount}」（成长值模式为「进度」）+ 进度条；达成后「本月保级成功」+ 绿色满格。英文用最短写法 */
  "进度": "Progress（示意）",
  "保级": "Keep（示意）",
  /* v1.2 恢复组合块的读屏说明（用户 2026-10-28） */
  "本月保级进行中": "Keeping level this month（示意）",
  "升级目标": "Next level（示意）",
  "本月有效投注": "Valid bets this month（示意）",
  "恢复 {level}": "Back to {level}（示意）",
  "{level} 详情": "{level} Details（示意）",
  "享有奖励": "Your rewards（示意）",
  "等级要求": "Requirements（示意）",
  "等级奖励": "Rewards（示意）",
  "保级成功": "Level kept（示意）",
  "升到 {level} 升级奖金": "{level} Upgrade Bonus（示意）",
  "已达恢复条件": "Back next month（示意）",
  "保级达标后次月恢复": "Keep this level to go back next month（示意）",
  "本月保级成功": "Retained（示意）",
  /* 保级达成后切换为升级（用户 2026-10-27）：当前卡「本月保级成功 ✓」下方的阶段标签 */
  "升级": "Upgrade（示意）",
  /* 普通用户卡（VIP1 前，用户 2026-10-19 追加，待文档同步）：普通用户时的一行说明；徽章和刻度沿用「普通用户」→ Regular */
  "达到 VIP1 即可成为 VIP 会员": "Reach VIP1 to join VIP（示意）",
  "本月达到恢复条件即可回到 VIP1": "Meet VIP1's monthly bet to return（示意）",
  /* 普通用户等级奖励弹窗（用户 2026-10-19 追加，待文档同步）：「前台会员等级显示」开时标题为「LEVEL {n} 奖励」 */
  "普通用户奖励": "Regular Rewards（示意）",
  "LEVEL {n} 奖励": "Level {n} Rewards（示意）",
  "生日礼包": "B-day Gift（示意）",
  "升级奖励到达后次日自动到账；生日礼包可在此领取。": "Upgrade reward is credited the next day; claim the B-day Gift here.（示意）",
  "{amount} 生日礼包已到账。": "{amount} B-day Gift credited.（示意）",
  "领取失败，请重试。": "Claim failed. Please try again.",
  "{amount} 生日奖励已到账。": "{amount} Birthday Bonus credited.",
  /* 等级卡「详情」与奖励详情弹窗（用户 2026-10-17 新增） */
  "查看详情": "Details（示意）",   /* 卡片底部横跨卡片宽度的按钮（原行内小按钮「详情」，用户 2026-10-19 改） */
  "{level} 奖励详情": "{level} Rewards（示意）",
  "奖金类别": "Bonus（示意）",
  "金额": "Amt（示意）",
  "状态": "Status（示意）",
  "已到账": "Credited（示意）",
  "未解锁": "Locked",
  "本月进行中": "In progress（示意）",
  "下月 1 日到账": "On 1st（示意）",   /* 详情弹窗：日历金勾图标右侧的简短文字（原「已达标，下月 1 日到账」，用户 2026-10-19 待确认清单第 32 条） */
  "已达标": "Reached（示意）",   /* 日历金勾图标的 aria-label / title */
  "下月恢复": "Back up（示意）",   /* 向上箭头图标的 aria-label / title */
  "下月恢复到 {level}": "{level} next month（示意）",
  /* 成长值模式等级（用户 2026-10-19 待确认清单第 6 条）：前台不显示成长值（第 2 轮第 F2 条），下一级卡只显示「升级进度」+ 进度条（不显示百分比，用户 2026-10-19） */
  "升级进度": "Progress（示意）",
  "成为当前等级后可获得": "If current（示意）",
  "待领取": "Claimable",
  "生日当天发放": "On B-day（示意）",
  "生日当天为该等级时可领取": "B-day if current（示意）",
  "升级奖励、保级奖励自动到账；生日奖励可在生日卡片或此处领取。": "Upgrade and Retention Bonuses are credited automatically; claim the Birthday Bonus here or on the birthday card.（示意）",   /* 前台不显示流水倍数，原句尾「奖励均需 {n} 倍流水」已删除（用户 2026-10-19 第 3 轮追加） */
  "累计有效投注": "Total Bet",   /* 奖励表表头（用户 2026-10-17 由「累计投注」改）与「?」弹窗共用；软连字符保证窄列不溢出 */
  "累计充值": "Total Dep.",
  "每月保级投注": "Ret. Bet/m",
  "保级投注/月": "Ret. Bet/m",   /* 奖励表表头（用户 2026-10-17：表头缩短，最多两行） */
  "{amount} / 月": "{amount}/m",
  "VIP 等级": "Level",
  "加载失败，点击重试": "Tap to retry",
  "加载中…": "Loading…",
  "登录": "Log In",
  "请登录后查看等级中心。": "Please log in to view Level Center.",
  "手机号码": "Mobile Number",
  "密码": "Password",
  "现有登录页（示意，本需求不改）。": "Existing login page (illustrative; not changed by this requirement).（示意）",
  /* VIP 规则（全文为示意，由运营定稿）：按片段对照，片段顺序与英文一致 */
  "VIP 规则": "VIP Rules（示意）",
  "要达到某个 VIP 等级，你的累计充值和累计有效投注都必须达到该等级的要求（见本弹窗上方）。升级实时判定。两项均自注册起累计（历史累计）。": "To reach a VIP level, your Total Dep. (Cumulative Deposit) and Total Bet (Cumulative Valid Bet) must both meet that level's requirements (shown at the top of this window). Upgrades are checked in real time. Both are counted from your registration (all-time totals).（示意）",
  "VIP 奖励表中的升级奖励，": "The Upgrade Bonus shown in the VIP Rewards table ",
  "在你首次到达每个 VIP 等级时立即发放到账": "is credited to your account instantly the first time you reach each VIP level",
  "。每个等级的升级奖励只": ". Each level's Upgrade Bonus is ",
  "发放": "given",
  "一次；降级后再次到达同一等级不会重复发放。": " only once; reaching the same level again after a downgrade does not give it again.（示意）",
  "每月保级：在自然月内（GMT+8）有效投注达到当前等级的每月保级投注，即可在次月保持当前等级并获得保级奖励": "Monthly retention: reach your current level's Monthly Retention Bet in valid bets within the calendar month (GMT+8) to keep your level next month and receive the Retention Bonus （示意）",
  "（每月 1 日结算时自动到账）": "(credited automatically at settlement on the 1st)",
  "未达到的，不发放保级奖励，次月 VIP 等级降 1 级（VIP1 未达到的，次月不再是 VIP 会员）。每月最多降 1 级。历史最高 VIP 等级不会下降。": "If you do not reach it, no Retention Bonus is paid and your VIP level drops by 1 next month (at VIP1, you are no longer a VIP member next month). You can drop at most 1 level per month. Your Highest VIP Level never drops.（示意）",
  "当月有升级的，按升级后的 VIP 等级考核，达到即保持并获得保级奖励。": "If you were upgraded during the month, you are assessed at your new VIP level; reach its Ret. Bet/m to keep it and receive the Retention Bonus.（示意）",
  "降级后，当月有效投注达到高一级的每月保级投注，次月恢复 1 级（次月 1 日结算时照常获得当前等级的保级奖励），最多恢复到你的历史最高 VIP 等级；该等级已停用时，以其上一个开放的等级为准。VIP1 未达到保级、不再是 VIP 会员的，当月有效投注达到 VIP1 的每月保级投注，次月回到 VIP1。累计充值和累计有效投注达到比历史最高 VIP 等级更高的等级要求时，立即升级。": "After a downgrade, reach the next level's Ret. Bet/m in valid bets within the month to move back up 1 level next month (you still receive your current level's Retention Bonus at settlement on the 1st), up to your Highest VIP Level, or the next open level above it if that level is no longer offered. If you are no longer a VIP member after missing retention at VIP1, reach VIP1's Ret. Bet/m in valid bets within the month to return to VIP1 next month. If your Total Dep. and Total Bet meet the requirements of a level above your Highest VIP Level, you are upgraded immediately.（示意）",
  "有效投注统计到每月最后一天 23:59:59（GMT+8），次月 1 日结算。": "Valid bets are counted until 23:59:59 on the last day of each month (GMT+8). Settlement runs on the 1st of the following month.（示意）",
  "生日奖励：每年生日当天生成一次，按你生日当天的 VIP 等级和 VIP 奖励表发放。你的 KYC 须在生日当天开始（00:00，GMT+8）前通过认证。": "Birthday Bonus: generated once a year on your birthday, based on your VIP level that day and the VIP Rewards table. Your KYC must be verified before your birthday begins (00:00, GMT+8). （示意）",
  "请在过期前在生日卡片或等级卡「详情」中领取。": "Claim it on the birthday card or in your level card's Details before it expires.（示意）",
  "升级奖励、保级奖励自动到账；生日奖励可在生日卡片或等级卡「详情」中领取。": "Upgrade and Retention Bonuses are credited automatically; claim your Birthday Bonus on the birthday card or in your level card's Details.（示意）",
  /* 2026-10-21 v1.0 检查报告 Q-52：规则弹窗「详情」改为按钮实际文字「查看详情」（英文按钮为 Details，英文不变） */
  "请在过期前在生日卡片或等级卡「查看详情」中领取。": "Claim it on the birthday card or in your level card's Details before it expires.（示意）",
  "升级奖励、保级奖励自动到账；生日奖励可在生日卡片或等级卡「查看详情」中领取。": "Upgrade and Retention Bonuses are credited automatically; claim your Birthday Bonus on the birthday card or in your level card's Details.（示意）",
  "须先完成 KYC 认证，才能加入 VIP 会员体系。完成 KYC 时按你的历史累计确定 VIP 等级，完成 KYC 前已达到的等级不发放升级奖励。": "You must complete KYC verification to join the VIP Program. When your KYC is approved, your VIP level is set based on your all-time totals; no Upgrade Bonus is given for levels already reached before KYC approval.（示意）",
  /* 原流水倍数条款的片段（需完成 / 倍流水， / 全部游戏 / Slot 游戏 / 的有效投注计入该流水。）已删除：前台不显示流水倍数（用户 2026-10-19 第 3 轮追加） */
  "如有疑问，请联系客服。": "Questions? Contact Customer Service.（示意）",   /* VIP 规则末条（用户 2026-10-17） */
  /* v1.0 恢复条款（没有关闭等级，去掉「该等级已停用时…」一句；用户 2026-10-20 版本拆分） */
  "降级后，当月有效投注达到高一级的每月保级投注，次月恢复 1 级（次月 1 日结算时照常获得当前等级的保级奖励），最多恢复到你的历史最高 VIP 等级。VIP1 未达到保级、不再是 VIP 会员的，当月有效投注达到 VIP1 的每月保级投注，次月回到 VIP1。累计充值和累计有效投注达到比历史最高 VIP 等级更高的等级要求时，立即升级。": "After a downgrade, reach the next level's Ret. Bet/m in valid bets within the month to move back up 1 level next month (you still receive your current level's Retention Bonus at settlement on the 1st), up to your Highest VIP Level. If you are no longer a VIP member after missing retention at VIP1, reach VIP1's Ret. Bet/m in valid bets within the month to return to VIP1 next month. If your Total Dep. and Total Bet meet the requirements of a level above your Highest VIP Level, you are upgraded immediately.（示意）",
  /* 计算方式 = 成长值时的规则条（不写门槛、不出现「成长值」字样；用户 2026-10-20）：第 1、3、5、6、7 条（第 6 条 full / v1.0 两版） */
  "要达到某个 VIP 等级，须达到该等级的升级要求，升级实时判定。升级和保级进度见等级卡上的进度条。": "To reach a VIP level, meet that level's upgrade target. Upgrades are checked in real time. See your progress on the level cards.（示意）",
  "每月保级：在自然月内（GMT+8）达到当前等级的每月保级要求，即可在次月保持当前等级并获得保级奖励": "Monthly retention: meet your current level's monthly retention target within the calendar month (GMT+8) to keep your level next month and receive the Retention Bonus （示意）",
  "当月有升级的，按升级后的 VIP 等级考核，达到该等级的每月保级要求即保持并获得保级奖励。": "If you were upgraded during the month, you are assessed at your new VIP level; meet its monthly retention target to keep it and receive the Retention Bonus.（示意）",
  "降级后，当月达到高一级的每月保级要求，次月恢复 1 级（次月 1 日结算时照常获得当前等级的保级奖励），最多恢复到你的历史最高 VIP 等级；该等级已停用时，以其上一个开放的等级为准。VIP1 未达到保级、不再是 VIP 会员的，当月达到 VIP1 的每月保级要求，次月回到 VIP1。达到比历史最高 VIP 等级更高的等级要求时，立即升级。": "After a downgrade, meet the next level's monthly retention target within the month to move back up 1 level next month (you still receive your current level's Retention Bonus at settlement on the 1st), up to your Highest VIP Level, or the next open level above it if that level is no longer offered. If you are no longer a VIP member after missing retention at VIP1, meet VIP1's monthly retention target within the month to return to VIP1 next month. If you meet the target of a level above your Highest VIP Level, you are upgraded immediately.（示意）",
  "降级后，当月达到高一级的每月保级要求，次月恢复 1 级（次月 1 日结算时照常获得当前等级的保级奖励），最多恢复到你的历史最高 VIP 等级。VIP1 未达到保级、不再是 VIP 会员的，当月达到 VIP1 的每月保级要求，次月回到 VIP1。达到比历史最高 VIP 等级更高的等级要求时，立即升级。": "After a downgrade, meet the next level's monthly retention target within the month to move back up 1 level next month (you still receive your current level's Retention Bonus at settlement on the 1st), up to your Highest VIP Level. If you are no longer a VIP member after missing retention at VIP1, meet VIP1's monthly retention target within the month to return to VIP1 next month. If you meet the target of a level above your Highest VIP Level, you are upgraded immediately.（示意）",
  "每月保级统计到每月最后一天 23:59:59（GMT+8），次月 1 日结算。": "Monthly retention is counted until 23:59:59 on the last day of each month (GMT+8). Settlement runs on the 1st of the following month.（示意）",

  /* 原「实物奖励领取页面（含 我的奖品申请 My Prize Claims）」对照已删除：该页已移出本需求包，实物见实体奖品管理需求（用户 2026-10-17） */

  /* ===== VIP通知页面（升级弹窗、生日卡片、短信、到账通知、交易记录） ===== */
  "宾果": "Bingo（示意）",
  "老虎机": "Slots（示意）",
  "真人": "Live（示意）",
  "捕鱼": "Fishing（示意）",
  "体育": "Sports（示意）",
  "优惠活动": "Promotions（示意）",
  "恭喜你！": "Congratulations!（示意）",
  "你已升至": "You've reached",
  "升级奖励合计（VIP13–VIP17）": "Upgrade Total (VIP13–VIP17)",
  /* 原升级弹窗「已到账 ·」「倍流水」已删除：弹窗只显示「已到账」（前台不显示流水倍数，用户 2026-10-19 第 3 轮追加） */
  "知道了": "OK（示意）",
  /* Level 升级弹窗（后台「前台会员等级显示」为「显示会员等级」时沿用现有平台行为；用户 2026-10-19 待确认清单第 17–19 条、第 2 轮第 20 条） */
  "恭喜升级！": "Level Up!（示意）",
  "（现有平台样式，示意）": "(current style)（示意）",
  "（前台会员等级显示为「都显示为普通会员」：Level 升级不弹窗，与现有口径一致）": "(All shown as Regular: no Level-up pop-up, as today.)（示意）",
  "短信": "SMS",
  "11月1日 周日 · 10:00": "Sun, Nov 1 · 10:00",   /* 保级短信：结算后触发，21:00–10:00 免打扰时段内顺延到 10:00（用户 2026-10-19 第 3 轮追加 2） */
  "（1 日 00:05 结算完成，处于 21:00–10:00 免打扰时段，顺延到 10:00 发送）": "(Settled 00:05, in 21:00–10:00 quiet hours; sent at 10:00)",   /* 保级短信场景（Claire 原文十六），不标示意（用户 2026-10-19 第 4 轮） */
  "10月12日 周一 · 10:00": "Mon, Oct 12 · 10:00",
  "10月13日 周二 · 10:00": "Tue, Oct 13 · 10:00",
  "₱1,500 VIP 保级奖励已到账！登录 789Bingo 查看奖励。": "₱1,500 VIP Retention Bonus credited! Log in to 789Bingo to check your reward.",
  "你的 PHP488 VIP 生日奖励明天可领取！请在 10 月 27 日 23:59（GMT+8）前到等级中心领取。使用旧版 App？请更新 App 或登录 789Bingo 网站领取。": "Your PHP488 VIP Birthday Bonus will be ready to claim tomorrow! Claim it in Level Center by 23:59 Oct 27 (GMT+8). Using an older app? Update it or log in on the 789Bingo website to claim.（示意）",
  "789Bingo 祝你生日快乐！你的 PHP488 VIP 生日奖励已可领取。请在 10 月 27 日 23:59（GMT+8）前到等级中心领取。使用旧版 App？请更新 App 或登录 789Bingo 网站领取。": "Happy Birthday from 789Bingo! Your PHP488 VIP Birthday Bonus is ready to claim in Level Center by 23:59 Oct 27 (GMT+8). Using an older app? Update it or log in on the 789Bingo website to claim.（示意）",
  "示例文案": "Sample",
  "示意 · 待运营定稿": "Draft（示意）",
  "（上方刻度和等级卡与 VIP中心页面相同，此处省略）": "(The level scale and level cards above are the same as on the VIP Center page and are omitted here.)（示意）",
  "（10-29 00:00 起不再显示生日卡片）": "(Card hidden from Oct 29 00:00)（示意）",   /* 过期口径统一（用户 2026-10-19 第 4 轮，待文档同步） */
  "（奖励表与规则说明见 VIP中心页面）": "(See the VIP Center page for the rewards table and rules.)（示意）",
  "（现有「奖励到账」APP 推送模板，示意）": "(existing \"Reward credited\" app push template, draft)（示意）",
  "你的 VIP 升级奖励已到账。": "Your VIP Upgrade Bonus has been credited.（示意）",
  "刚刚": "now",
  "消息": "Messages",
  "（现有站内消息列表，示意；本需求只由 VIP 发放流程发送下面这类消息；": "(Existing inbox list, draft. This requirement only sends messages like the one below through the VIP payout flow; （示意）",
  "升级、保级奖励到账时发送，生日奖励领取成功时发送，示意": "sent when Upgrade and Retention Bonuses are credited, and when a Birthday Bonus is claimed, draft（示意）",
  "奖励已到账": "Credited",
  "（现有模板，示意）": "(existing template, draft)（示意）",
  "（21:00–10:00 触发的推送顺延到 10:00 发送，站内信即时生成）": "(Pushes from 21:00–10:00 go out at 10:00; inbox is instant)（示意）",   /* 免打扰时段（用户 2026-10-19 第 3 轮追加 2） */
  "VIP 升级奖励 {amount} 已存入你的账户。": "VIP Upgrade Bonus {amount} has been credited to your account.（示意）",
  "（奖励处于「暂停发放（风控）」，不发站内信和 APP 推送；运营放行入账时再发：规则 N55）": "(The reward is \"paused (risk control)\": no inbox message or app push is sent until Ops releases and credits it. Rule N55)（示意）",
  "交易记录": "Transaction",
  "（现有交易记录页，示意，本需求不改页面；以下为 VIP 奖励入账后的显示名）": "(Existing transaction page, illustrative; this requirement does not change the page. Below are the display names after VIP rewards are credited.)（示意）",
  "VIP 升级奖励": "VIP Upgrade",
  "VIP 保级奖励": "VIP Retain",
  "VIP 生日奖励": "VIP B-day",
  "奖金": "Bonus",
  "（离线期间升级，下次进入时补弹）": "(Upgraded offline; shown on next visit)（示意）",   /* 第 3 轮第 19 条 */
  /* 游戏中升级：在第三方游戏页面不弹，返回平台原生页面后弹出（用户 2026-10-19，待文档同步） */
  "第三方游戏": "3rd-party game（示意）",
  "返回大厅": "Back to Lobby（示意）",
  "（正在第三方游戏中，不弹出升级弹窗；返回平台页面后弹出）": "(In game: pop-up shows once back on platform)（示意）",
  "（从第三方游戏返回大厅，弹出升级弹窗）": "(Back from game: pop-up shown)（示意）",
  "（风控暂停：玩家已升到 VIP11，升级奖励为「暂停发放（风控）」，不弹升级弹窗）": "(Risk-control pause: the player has reached VIP11; the Upgrade Bonus is \"paused (risk control)\", so no upgrade pop-up is shown.)（示意）",
  "（风控放行后：VIP11 升级奖励立即自动到账，不补弹升级弹窗）": "(After risk-control release: the VIP11 Upgrade Bonus is credited automatically right away. The upgrade pop-up is not shown again.)（示意）",
  "（老版本 App：玩家升到 VIP11，升级奖励照常自动到账，不弹升级弹窗）": "(Older app version: the player reaches VIP11 and the Upgrade Bonus is credited automatically as usual, but no upgrade pop-up is shown.)（示意）",
  /* 未完成 KYC：不参与 VIP 体系（已定，用户 2026-10-17） */
  "（未完成 KYC：玩家不参与 VIP 体系，没有 VIP 等级和升级奖励，不弹升级弹窗）": "(KYC not completed: the player is not in the VIP Program, has no VIP level or Upgrade Bonus, and no upgrade pop-up is shown.)（示意）",
  "（未完成 KYC：不参与 VIP 体系，没有生日奖励，不显示生日卡片；等级中心只显示 KYC 引导卡）": "(KYC not completed: the player is not in the VIP Program and has no Birthday Bonus, so no birthday card is shown. Level Center only shows the KYC prompt card.)（示意）",
  "（未完成 KYC：玩家不参与 VIP 体系，没有 VIP 奖励，不发站内信和 APP 推送）": "(KYC not completed: the player is not in the VIP Program and has no VIP rewards, so no inbox message or app push is sent.)（示意）",
  "（生日奖励已在 10:00 前领取，不发当天提醒短信）": "(B-day Bonus claimed before 10:00 — no same-day SMS.)（示意）",
  "（未完成 KYC：玩家不参与 VIP 体系，不会收到 VIP 短信）": "(KYC not completed: the player is not in the VIP Program and does not receive VIP SMS.)（示意）",
  /* 「KYC 限制」关闭时（用户 2026-10-26）：未完成 KYC 的玩家可参与 VIP 体系，但生日奖励始终要求 KYC */
  "（未完成 KYC：「KYC 限制」关闭时可参与 VIP 体系，但生日奖励始终要求 KYC，没有生日奖励，不显示生日卡片）": "(KYC not completed: with the KYC Restriction off, the player can join the VIP Program, but the Birthday Bonus always requires KYC, so there is no Birthday Bonus and no birthday card is shown.)（示意）",
  "（未完成 KYC：生日奖励始终要求 KYC，「KYC 限制」关闭时也没有生日奖励，不发生日提醒短信）": "(KYC not completed: the Birthday Bonus always requires KYC, so even with the KYC Restriction off there is no Birthday Bonus and no birthday reminder SMS.)（示意）",
  "（当前账号状态或「VIP 体系状态」下，该玩家不会收到这条短信：规则 N48、N43、N40）": "(With the current account status or VIP program status, this player does not receive this SMS. Rules N48, N43, N40)（示意）",
  "（「VIP 体系状态」关闭期间不发 VIP 短信：规则 N43、N40）": "(No VIP SMS while the VIP Program is off. Rules N43, N40)（示意）",   /* 关闭期间一律不发保级、生日短信（用户 2026-10-20） */

  /* ===== 领取方式：自动领取 / 手动领取（用户 2026-10-20，完整需求 / v1.1）：只新增，英文用最短写法 ===== */
  /* VIP中心页面：待领取卡片、详情弹窗、小红点、提示 */
  "{level} 升级奖励": "{level} Upgrade（示意）",
  "上月保级奖励": "Last mo. Retain（示意）",
  "请在 {md} 日 23:59（GMT+8）前领取": "Claim by 23:59 {md} (GMT+8)（示意）",
  "{amount} 升级奖励已到账。": "{amount} Upgrade Bonus credited.（示意）",
  "{amount} 保级奖励已到账。": "{amount} Retention Bonus credited.（示意）",
  "下月 1 日可领取": "Claim on 1st（示意）",
  "已自动到账": "Auto-credited（示意）",
  "{level} 奖励详情（有待领取）": "{level} Rewards (to claim)（示意）",
  /* VIP中心页面：规则说明、详情弹窗底部小字（非默认组合时逐类一句） */
  "升级奖励自动到账。": "Upgrade auto-credited. （示意）",
  "保级奖励自动到账。": "Retain auto-credited. （示意）",
  "生日奖励自动到账。": "B-day auto-credited. （示意）",
  "升级奖励须在有效期内手动领取。": "Claim Upgrade before it expires. （示意）",
  "保级奖励须在有效期内手动领取。": "Claim Retain before it expires. （示意）",
  "生日奖励须在有效期内手动领取。": "Claim B-day before it expires. （示意）",
  "手动领取的奖励可在奖励卡片或等级卡「详情」中领取，过期作废。": "Claim on the reward card or in Details; unclaimed rewards expire.（示意）",
  "生日当天自动到账。": "Credited automatically on your birthday.（示意）",
  "VIP 奖励表中的升级奖励，在你首次到达每个 VIP 等级时发放，须在 {n} 天内（含当天）领取，过期作废。每个等级的升级奖励只发放一次；降级后再次到达同一等级不会重复发放。": "The Upgrade Bonus in the VIP Rewards table is issued the first time you reach each VIP level; claim it within {n} days (incl. that day) or it expires. Each level's Upgrade Bonus is given only once; reaching the same level again after a downgrade does not give it again.（示意）",
  "（每月 1 日结算后发放，须在 {n} 天内（含当天）领取，过期作废）": "(issued at settlement on the 1st; claim within {n} days incl. that day, or it expires)（示意）",
  /* VIP通知页面：升级弹窗、短信、生日卡片 */
  "可领取，请在 {md} 日 23:59（GMT+8）前领取": "Ready · claim by 23:59 {md} (GMT+8)（示意）",
  "去领取": "Go claim（示意）",
  "PHP1,500 VIP 保级奖励已可领取！请在 {md} 日 23:59（GMT+8）前到等级中心领取。": "PHP1,500 VIP Retention Bonus ready! Claim it in Level Center by 23:59 {md} (GMT+8).（示意）",
  "你的 PHP488 VIP 生日奖励将于明天自动到账！登录 789Bingo 查看奖励。": "Your PHP488 VIP Birthday Bonus will be credited tomorrow! Log in to 789Bingo to check your reward.（示意）",
  "789Bingo 祝你生日快乐！你的 PHP488 VIP 生日奖励已到账！登录 789Bingo 查看奖励。": "Happy Birthday from 789Bingo! Your PHP488 VIP Birthday Bonus has been credited! Log in to 789Bingo to check your reward.（示意）",
  "你的 PHP488 VIP 生日奖励明天可领取！请在 {md} 日 23:59（GMT+8）前到等级中心领取。使用旧版 App？请更新 App 或登录 789Bingo 网站领取。": "Your PHP488 VIP Birthday Bonus will be ready to claim tomorrow! Claim it in Level Center by 23:59 {md} (GMT+8). Using an older app? Update it or log in on the 789Bingo website to claim.（示意）",   /* 有效期不是 15 天时（默认 15 天走上方原条目） */
  "789Bingo 祝你生日快乐！你的 PHP488 VIP 生日奖励已可领取。请在 {md} 日 23:59（GMT+8）前到等级中心领取。使用旧版 App？请更新 App 或登录 789Bingo 网站领取。": "Happy Birthday from 789Bingo! Your PHP488 VIP Birthday Bonus is ready to claim in Level Center by 23:59 {md} (GMT+8). Using an older app? Update it or log in on the 789Bingo website to claim.（示意）",
  /* 领取期限英文日期统一写「23:59 {Mon} {d} (GMT+8)」（例「by 23:59 Oct 27 (GMT+8)」，检查报告 R3-23）：上面带期限的句子用 {md} 取「m 月 d」，再按下面 12 条换成英文月份缩写 */
  /* 第 11 批：「10 月达成…」两句须排在「1 月 {d}」…「12 月 {d}」之前，否则会被「10 月 {d}」先匹配（原顺序时英文预览译错） */
  "10 月达成 {lv} 保级投注，{a} 待领取，{e}有效。": "October: {lv} Ret. Bet reached! Claim {a} {e}.（示意）",   /* {e} =「MM-DD 前」→「by Nov 15」（第 11 批 C14） */
  "10 月达成 {lv} 保级投注，{a} 已到账。": "October: {lv} Ret. Bet reached! {a} credited.（示意）",
  "1 月 {d}": "Jan {d}",
  "2 月 {d}": "Feb {d}",
  "3 月 {d}": "Mar {d}",
  "4 月 {d}": "Apr {d}",
  "5 月 {d}": "May {d}",
  "6 月 {d}": "Jun {d}",
  "7 月 {d}": "Jul {d}",
  "8 月 {d}": "Aug {d}",
  "9 月 {d}": "Sep {d}",
  "10 月 {d}": "Oct {d}",
  "11 月 {d}": "Nov {d}",
  "12 月 {d}": "Dec {d}",
  "（{date} 00:00 起不再显示生日卡片）": "(Card hidden from {date} 00:00)（示意）",
  "（风控放行后：VIP11 升级奖励回到待领取，有效期从放行日重算，不补弹升级弹窗）": "(After release: VIP11 Upgrade claimable again, validity restarts; no pop-up.)（示意）",
  "（老版本 App：玩家升到 VIP11，升级奖励待领取，需到 H5 或新版本 App 的等级中心领取，不弹升级弹窗）": "(Older app: reached VIP11; claim Upgrade in Level Center on H5 or the new app; no pop-up.)（示意）",

  /* ===== 跨多级合并、强制审核、新增场景说明（用户 2026-10-20，完整需求 / v1.1）：只新增 ===== */
  "{range} 升级奖励（{n} 笔）": "{range} Upgrade ({n})（示意）",
  "升级奖励（{n} 笔）": "Upgrade ({n})（示意）",
  "与 {range} 升级奖励一起领取": "Claims {range} Upgrade together（示意）",
  "审核中": "Under review（示意）",
  "未通过": "Rejected（示意）",
  "审核通过后到账": "Credited after review（示意）",
  "审核未通过：{reason}": "Not approved: {reason}（示意）",
  "同一设备多账号投注": "Multiple accounts on one device（示意）",
  "已提交领取，审核通过后到账。": "Claim submitted. Credited after review.（示意）",
  "（10-08 从 VIP11 升到 VIP14，3 笔升级奖励待领取）": "(Oct 8: VIP11 → VIP14, 3 Upgrade Bonuses to claim)（示意）",
  "（9-01 降到 VIP16，10-01 结算时保持 VIP16）": "(Down to VIP16 on Sep 1; kept VIP16 at Oct 1 settlement)（示意）",

  /* ===== 强制审核生效时替换「已到账」、驳回统一文案（用户 2026-10-20，三个迭代共用）：只新增 ===== */
  "审核中，审核通过后到账": "Under review · credited once approved（示意）",
  "审核未通过，如有疑问请联系客服": "Not approved. Contact CS for help.（示意）",
  "（风控放行后：VIP11 升级奖励审核中，审核通过后到账，不补弹升级弹窗）": "(After release: VIP11 Upgrade under review, credited once approved; no pop-up.)（示意）",
  "（老版本 App：玩家升到 VIP11，升级奖励审核中，审核通过后到账，不弹升级弹窗）": "(Older app: reached VIP11; Upgrade under review, credited once approved; no pop-up.)（示意）",
  "（强制审核生效：审核通过到账时才发送，审核中、未通过不发）": "(Review on: sent only when approved & credited)（示意）",

  /* ===== 强制审核短信与驳回后显示（用户 2026-10-20，三个迭代共用）：只新增 ===== */
  "审核通过到账时": "On approval（示意）",
  "（审核通过、实际到账时发送；21:00–10:00 免打扰时段内通过的顺延到 10:00）": "(Sent on approval & credit; 21:00–10:00 → 10:00)（示意）",
  "PHP2,000 VIP 升级奖励已到账！登录 789Bingo 查看奖励。": "PHP2,000 VIP Upgrade Bonus credited! Log in to 789Bingo to check your reward.（示意）",
  "PHP488 VIP 生日奖励已到账！登录 789Bingo 查看奖励。": "PHP488 VIP Birthday Bonus credited! Log in to 789Bingo to check your reward.（示意）",
  "（强制审核不生效：不在审核时发短信）": "(Review off: no review SMS)（示意）",
  "（审核中：不发短信，审核通过、实际到账时才发）": "(Under review: no SMS until approved)（示意）",
  "（审核未通过：不发短信；页面显示「审核未通过，如有疑问请联系客服」）": "(Rejected: no SMS; page shows \"Not approved. Contact CS for help.\")（示意）",
  "（审核未通过：{date} 00:00 起生日卡片不再显示）": "(Rejected: card hidden from {date} 00:00)（示意）",

  /* ===== 列表分页「加载更多」（用户 2026-10-20 / 规范 v5.41，三个迭代共用）：只新增；「加载中…」「加载失败，点击重试」沿用上方已有条目 ===== */
  "加载更多": "Load more",
  "没有更多了": "No more",
  "暂无消息": "No messages",
  "暂无交易记录": "No records",
  "其他消息": "Other msg（示意）",
  "其他交易": "Other txn（示意）",
  "其他": "Other",

  /* ===== 强制审核 + 生日奖励自动领取：生日前一天提醒短信（用户 2026-10-20，三个迭代共用）：只新增 ===== */
  "明天是你的生日，VIP 生日奖励审核通过后到账。": "Tomorrow is your birthday! Your VIP Birthday Bonus will be credited once approved.（示意）",
  "明天是你的生日，PHP488 VIP 生日奖励审核通过后到账，登录 789Bingo 查看。": "Tomorrow is your birthday! Your PHP488 VIP Birthday Bonus will be credited once approved. Log in to 789Bingo to check your reward.（示意）",
  "789Bingo 祝你生日快乐！你的 PHP488 VIP 生日奖励审核中，审核通过后到账！登录 789Bingo 查看奖励。": "Happy Birthday from 789Bingo! Your PHP488 VIP Birthday Bonus is under review and will be credited once approved! Log in to 789Bingo to check your reward.（示意）",
  "明天是你的生日！你的 VIP 生日奖励按明天月度结算后的 VIP 等级发放，届时登录 789Bingo 查看。": "Tomorrow is your birthday! Your VIP Birthday Bonus will be based on your VIP level after tomorrow's monthly settlement. Log in to 789Bingo to check.（示意）",

  /* ===== 后台 VIP0「沿用普通会员级别」不勾选时的「普通会员 / VIP」tab 与个人中心账号区（用户 2026-10-21，v1.1 / full）：只新增 ===== */
  "普通会员": "Level（示意）",
  "等级类型": "Level type（示意）",
  "你当前为普通会员。": "You're a regular member.（示意）",
  "我的": "Me（示意）",
  "（不勾选沿用：同时为 LEVEL 10 与 VIP2，两边奖励、返水各自达标都可领）": "(Separate systems: Level 10 and VIP2 at once; both sides' rewards & rebates claimable)（示意）",

  /* ===== 个人中心账号区：可点击进入等级中心；还没有 VIP 等级时旁边显示置灰「VIP1」（用户 2026-10-21，v1.1 / full）：只新增 ===== */
  "账号等级": "Account level（示意）",
  "未达到 VIP1": "VIP1 not reached（示意）",

  /* ===== VIP 规则弹窗：「详情」统一为按钮实际文字「查看详情」（检查报告 Q-52，2026-10-21，full）：只新增 ===== */
  "请在过期前在生日卡片或等级卡「查看详情」中领取。": "Claim it on the birthday card or in your level card's Details before it expires.（示意）",
  "升级奖励、保级奖励自动到账；生日奖励可在生日卡片或等级卡「查看详情」中领取。": "Upgrade and Retention Bonuses are credited automatically; claim your Birthday Bonus on the birthday card or in your level card's Details.（示意）",
  "手动领取的奖励可在奖励卡片或等级卡「查看详情」中领取，过期作废。": "Claim on the reward card or in Details; unclaimed rewards expire.（示意）",
  /* VIP通知页面「普通用户 Level 升级」场景说明（检查报告 Q-39）：只新增 */
  "（前台显示方式为「会员身份」：Level 升级不弹窗，与现有口径一致）": "(Display mode is Member status: no Level-up pop-up, as today.)（示意）",

  /* ===== VIP 规则弹窗：只计 6 大类游戏（用户 2026-10-21，检查问题第二批 Q-21，v1.0）：只新增 ===== */
  "只有 Slot、Casino、Poker、Bingo、Arcade、Fishing 游戏的有效投注计入 VIP 进度和保级；Perya、ESports 等其他游戏的投注不计入。": "Only valid bets on Slot, Casino, Poker, Bingo, Arcade and Fishing games count toward VIP progress and retention; bets on other games, such as Perya and ESports, do not count.（示意）",

  /* ===== VIP通知页面：审核到账短信示例与后台系统预设一致（中文以后台预设为准，用户 2026-10-22）：只新增；英文为示意，待运营定稿 ===== */
  "恭喜升级到 VIP14！PHP2,000 VIP 升级奖励已到账！登录 789Bingo 查看奖励。": "Congrats on reaching VIP14! PHP2,000 VIP Upgrade Bonus credited! Log in to 789Bingo to check your reward.（示意）",
  "789Bingo 祝你生日快乐！PHP488 VIP14 生日奖励已到账！登录 789Bingo 查看奖励。": "Happy Birthday from 789Bingo! PHP488 VIP14 Birthday Bonus credited! Log in to 789Bingo to check your reward.（示意）",

  /* ===== v1.2 迭代（2026-10-27）：只新增，不改其他迭代的条目。已有的同名条目（如「领取」「已领取」「累计有效投注」「交易记录」）直接沿用原英文；带变量的写成 {lv}、{a} 等 ===== */
  "VIP中心": "VIP Center（示意）",
  "历史最高 {lv}": "Highest: {lv}（示意）",
  "我的 VIP 进度": "My VIP Progress（示意）",
  "升级到 {lv}，{a} 待领取，{e}有效。": "Reached {lv}! Claim {a} {e}.（示意）",   /* {e} =「MM-DD 前」，按下方「MM-DD 前」条目换成「by Oct 27」（第 11 批 C14 英文日期） */
  "升级到 {lv}，{a} 已到账。": "Reached {lv}! {a} credited.（示意）",
  "升级到 {lv}": "Upgrade to {lv}（示意）",
  "VIP 等级一览": "VIP Levels（示意）",
  "当前等级": "Current（示意）",
  "未到达": "Locked（示意）",
  "已到达": "Reached（示意）",
  "升级奖金": "Upgrade Bonus（示意）",
  "月度奖金": "Monthly Bonus（示意）",
  "生日奖金": "Birthday Bonus（示意）",
  "升级条件": "To upgrade（示意）",
  "累计有效投注 {a} 且 累计充值 {b}": "Total Bet {a} and Total Dep. {b}（示意）",
  "每月保级投注 {a}": "Monthly retention bet {a}（示意）",
  "VIP 等级表": "VIP Level Table（示意）",
  "等级": "Level（示意）",
  "保级投注": "Ret. Bet（示意）",
  "上一级": "Previous level（示意）",
  "下一级": "Next level（示意）",
  "本月保级": "This month's retention（示意）",
  "还差 {a}": "{a} to go（示意）",
  "本月保级成功 ✓": "Retention achieved ✓（示意）",
  "恢复": "Restore（示意）",
  "达到 {a} 有效投注，次月恢复到 {lv}": "Bet {a} this month to return to {lv} next month（示意）",
  "已达到恢复条件 ✓": "Restore requirement met ✓（示意）",
  "超过历史最高 {lv} 才能直接升级": "Go beyond your highest level ({lv}) to upgrade instantly（示意）",
  "你已是最高等级": "You're at the top level（示意）",
  "未加入 VIP": "Not in VIP（示意）",
  "未登录": "Not logged in（示意）",
  "领取中…": "Claiming…（示意）",
  "降级后，当月有效投注达到高一级的保级投注，次月恢复 1 级，最多恢复到你到达过的最高等级；累计有效投注和累计充值达到比你到达过的最高等级更高的要求时，立即升级。": "After dropping, reach the retention bet of the level above in a month and you go back up 1 level next month, up to your highest level reached. Reach the requirements of a level above your highest level and you are upgraded instantly.（示意）",
  "大厅": "Lobby",
  "升级奖金 {a} 已到账": "{a} Upgrade Bonus credited（示意）",

  "查看 VIP 权益": "View VIP Benefits（示意）",
  "你已从 {a} 升级到 {b}": "You've upgraded from {a} to {b}!（示意）",
  "升级奖金合计 {a} 已到账": "{a} in Upgrade Bonuses credited（示意）",
  "现在": "now",
  "站内信": "Inbox",
  "VIP 月度奖金": "VIP Monthly Bonus（示意）",
  "VIP 升级奖金": "VIP Upgrade Bonus（示意）",
  "VIP 生日奖金": "VIP Birthday Bonus（示意）",
  /* v1.2 VIP中心改为「弧形等级刻度 + 等级卡轮播」（用户 2026-10-27）：只新增；其余卡片文案（当前、保级、升级、恢复、投注还差、已解锁、未解锁、查看详情、奖励详情弹窗等）沿用上方已有条目 */
  /* v1.2 降级与恢复规则改为「达到当前等级保级投注即次月恢复 1 级」（用户 2026-10-27）：只新增；原 v1.2 第 7 条「降级后，当月有效投注达到高一级的保级投注…」已不用，条目保留 */
  /* v1.2 用户 2026-10-28：VIP0 显示名改为「普通玩家」、「下月」统一为「次月」：只新增，不改旧键（封存版和 v1.2 原有键都保留） */
  /* v1.2 前台文字精简（用户 2026-10-28）：普通玩家前台显示名精简（2026-10-29 起统一为 VIP0）；卡片、弹窗、提示、规则、通知、短信中文精简，英文同样精简。只新增，v1.2 不再使用的旧条目已删除（封存版在用的保留） */
  "部分 VIP 奖金暂未发放，有疑问联系客服": "Some VIP bonuses are on hold. Questions? Contact CS.（示意）",
  "登录查看 VIP 进度": "Log in to view VIP progress（示意）",
  "完成 KYC 加入 VIP": "Complete KYC to join VIP（示意）",
  "加入时按累计定级，补发升级奖金": "Level set by your totals; past Upgrade Bonuses paid（示意）",
  "去认证": "Verify（示意）",
  "未达 VIP1，无奖金": "Below VIP1, no bonuses（示意）",
  "结算中": "Settling（示意）",   /* 封存版本在用；v1.2 前台不显示结算（规则 N12 ⑤） */
  "历史最高": "Highest（示意）",
  "次月恢复": "Back next month（示意）",
  "达到保级投注可得": "Hit its Ret. Bet（示意）",
  "升级后可得": "After upgrade（示意）",
  "进行中": "In progress（示意）",
  "生日当天为该级可领": "If this level on B-day（示意）",
  "领取成功，已到账": "Claimed & credited（示意）",
  "领取失败，请重试": "Claim failed. Try again.（示意）",
  "VIP 暂未开放": "VIP is not available yet（示意）",
  "左右滑动查看": "Swipe for more（示意）",
  "VIP 等级从 VIP1 到 SUPER VIP，VIP1 以下为 VIP0。累计有效投注和累计充值同时达到某级要求，立即升到该级。": "VIP levels run from VIP1 to SUPER VIP; below VIP1 is VIP0. Meet both a level's Total Bet and Total Dep. to upgrade to it instantly.（示意）",
  "累计有效投注、累计充值从注册起计算，有效投注包括平台所有游戏。": "Total Bet and Total Dep. count from registration; valid bets on all platform games count.（示意）",   /* 第 11 批：VIP 规则第 2 条 */
  "当月有效投注达到当前等级保级投注即保级，次月保持等级；当月升级的按新等级考核。": "Reach your level's Ret. Bet in valid bets in a calendar month to keep your level next month. If you upgrade mid-month, the new level applies.（示意）",
  "未保级：次月降 1 级（每月最多降 1 级），VIP1 降为 VIP0；月度奖金照第 5 条发放。": "Miss it: you drop 1 level next month (at most 1 per month); VIP1 drops to VIP0. The Monthly Bonus still follows rule 5.（示意）",
  "降级后（含降为 VIP0）：当月达到哪一级的保级投注，次月直接恢复到该级，最高到历史最高等级；超过历史最高的等级按累计立即升级。例：VIP5 降为 VIP2 后，当月有效投注 ₱80,000 达到 VIP4 保级投注 → 次月回到 VIP4，可领 ₱28。": "After dropping (incl. to VIP0): reach a level's Ret. Bet in a month and you go straight back to that level next month, up to your highest level; levels above your highest are reached instantly by your totals. E.g. dropped from VIP5 to VIP2, bet ₱80,000 in a month (VIP4's Ret. Bet) → back to VIP4 next month, ₱28 to claim.（示意）",
  "每月初按上月有效投注评定等级和月度奖金。": "At the start of each month, your level and Monthly Bonus are set by last month's valid bets.（示意）",   /* 第 11 批：VIP 规则第 8 条 */
  "须完成 KYC 才能加入 VIP；加入时按累计定级，已达到等级的升级奖金一并补发。": "KYC is required to join VIP. Your level is then set by your totals, and Upgrade Bonuses for levels already reached are paid too.（示意）",
  "已升级到 {lv}": "You've reached {lv}!（示意）",
  "明天是你的生日！明天到 789Bingo VIP中心领取 VIP 生日奖金。": "Your birthday is tomorrow! Claim your VIP Birthday Bonus in 789Bingo VIP Center tomorrow.（示意）",
  "789Bingo 祝你生日快乐！PHP488 VIP 生日奖金请在 10 月 27 日 23:59（GMT+8）前到 VIP中心领取。": "Happy Birthday from 789Bingo! Claim your PHP488 VIP Birthday Bonus in VIP Center by 23:59 Oct 27 (GMT+8).（示意）",
  /* v1.2 检查报告 R5 修复（2026-10-29）：KYC 审核中 */
  "KYC 审核中": "KYC under review（示意）",
  "生日当天可领": "Claimable on your birthday（示意）",
  /* 第 11 批（2026-10-31）前台无结算感知（规则 N12 ⑤）：1 日生日、奖金还没生成显示「待发放」；本月预计月度奖金「下月可领 / 下月到账」 */
  "待发放": "Pending（示意）",
  "下月可领": "Claim next month（示意）",
  "下月到账": "Credited next month（示意）",
  /* v1.2 新规则（用户 2026-10-29）：VIP0 统一命名（原「会员 / Member」条目已删除）；保级、月度奖金按 k 级单独核算（可一次恢复多级）；KYC 定级补发升级奖金；不设审核（审核相关的 v1.2 条目已删除，封存版在用的保留） */
  "{level} 月度奖金": "{level} Monthly Bonus（示意）",
  "未达成": "Not reached（示意）",
  "达到 {level}": "Reached {level}（示意）",
  "次月等级": "Next month's level（示意）",
  "完成 KYC，已定级 {lv}": "KYC done! You're now {lv}（示意）",
  /* v1.2 规则 6–8（用户 2026-10-29）：手动领取（等级卡上领取、升级确认弹窗点 OK 领取、登录提醒）；旧的「已到账」生成时文案、生日卡片、升级奖金发放中等 v1.2 条目已删除 */
  "首次到达某级得该级升级奖金（跨多级逐级生成），每级只发一次，降级后再到达不重发。": "Get a level's Upgrade Bonus the first time you reach it (one for each level you pass). Each is given once only, even if you drop and reach it again.（示意）",
  "月度奖金：当月有效投注达到哪一级的保级投注（最高到历史最高等级），下月可领取哪一级的月度奖金。": "Monthly Bonus: next month, claim the Monthly Bonus of the highest level whose Ret. Bet your valid bets reached this month (up to your highest level).（示意）",   /* 第 11 批：VIP 规则第 5 条 */
  "升级、月度、生日奖金在等级卡「查看详情」里领取，自获得当天起 {n} 天内有效（生日奖金自生日当天起，含当天），过期不能再领。": "Claim Upgrade, Monthly and Birthday Bonuses in a level card's Details within {n} days from the day you get them (Birthday Bonus: from your birthday; incl. that day). Unclaimed bonuses expire.（示意）",   /* 第 11 批：VIP 规则第 9 条 · 全手动（待运营定稿） */
  "生日奖金：每年一次，金额按生日所在月份评定后的等级确定；生日当天起在当前等级详情里领取。": "Birthday Bonus: once a year. The amount follows your level as set for your birthday month; claim it in your current level's Details from your birthday.（示意）",   /* 第 11 批：VIP 规则第 10 条 */
  "升级、月度、生日奖金在此处领取，过期作废": "Claim bonuses here. Unclaimed bonuses expire.（示意）",
  "升级奖金 {a}": "Upgrade Bonus {a}（示意）",
  /* 第 11 批 C14 英文日期统一「Oct 27」：「MM-DD 前」按月份换成「by Mon D」（日为个位时去掉前导 0，「0{d}」条目须在前）；未命中时退回下方「{d} 前」 */
  "01-0{d} 前": "by Jan {d}",
  "01-{d} 前": "by Jan {d}",
  "02-0{d} 前": "by Feb {d}",
  "02-{d} 前": "by Feb {d}",
  "03-0{d} 前": "by Mar {d}",
  "03-{d} 前": "by Mar {d}",
  "04-0{d} 前": "by Apr {d}",
  "04-{d} 前": "by Apr {d}",
  "05-0{d} 前": "by May {d}",
  "05-{d} 前": "by May {d}",
  "06-0{d} 前": "by Jun {d}",
  "06-{d} 前": "by Jun {d}",
  "07-0{d} 前": "by Jul {d}",
  "07-{d} 前": "by Jul {d}",
  "08-0{d} 前": "by Aug {d}",
  "08-{d} 前": "by Aug {d}",
  "09-0{d} 前": "by Sep {d}",
  "09-{d} 前": "by Sep {d}",
  "10-0{d} 前": "by Oct {d}",
  "10-{d} 前": "by Oct {d}",
  "11-0{d} 前": "by Nov {d}",
  "11-{d} 前": "by Nov {d}",
  "12-0{d} 前": "by Dec {d}",
  "12-{d} 前": "by Dec {d}",
  "{d} 前": "By {d}（示意）",
  "{d} 前有效": "Valid until {d}（示意）",
  "暂停发放": "On hold（示意）",
  /* 第 11 批：领取结果提示统一按 PRD 第 4 章「领取结果」表 */
  "奖金已过期": "Bonus expired（示意）",
  "暂不可领取，有疑问联系客服": "Can't claim now. Questions? Contact CS.（示意）",
  "奖金已领取": "Bonus already claimed（示意）",
  "部分奖金领取失败，请重试": "Some bonuses failed. Try again.（示意）",
  "没有可领取的奖金": "No bonuses to claim（示意）",
  "恭喜升级到 {lv}": "Level up! {lv}（示意）",
  "VIP 奖金待领取": "VIP bonuses to claim（示意）",
  "你有 {n} 笔 VIP 奖金待领取，共 {a}": "You have {n} VIP bonus(es) to claim, {a} in total（示意）",
  "稍后": "Later（示意）",
  "去领取": "Claim（示意）",
  "‹ 返回平台": "‹ Back（示意）",
  "第三方游戏": "Third-party game（示意）",
  "VIP 月度奖金待领取": "VIP Monthly Bonus to claim（示意）",
  "VIP 升级奖金待领取": "VIP Upgrade Bonus to claim（示意）",
  "VIP 生日奖金待领取": "VIP Birthday Bonus to claim（示意）",
  "生日快乐！{a} 待领取，{e}有效。": "Happy Birthday! Claim {a} {e}.（示意）",

  "{t} · 成功": "{t} · Success",
  /* 升级确认弹窗按钮（用户 2026-10-29 已定，英文为用户给定）：「OK」改为「领取奖金」「查看权益」 */
  "领取奖金": "Claim Bonus",
  "查看权益": "View Benefits",
  /* KYC 定级补发确认弹窗逐级列出、最后一行合计（用户 2026-10-29 已定）；三种奖金共用「领奖有效期」，VIP 规则第 9、10 条改写（用户 2026-10-29） */
  "合计": "Total（示意）",
  /* 未领取红点移到「查看详情」按钮上，按钮读屏文字带「有待领取」（用户 2026-10-29） */
  "{level} 奖励详情，有待领取": "{level} Rewards, bonus to claim（示意）",
  /* 状态标签锁图标改为 SVG，文字单独成节点（用户 2026-10-29） */
  "已解锁": "Unlocked",
  /* 等级表右上角「?」奖金领取规则弹窗（用户 2026-10-30） */
  "奖金领取规则": "Bonus Rules（示意）",
  "表格说明": "How to read（示意）",
  /* 第 11 批 D03：「?」弹窗精简为 PRD 4.2.1 第 6 条新文案（文案确认 T12） */
  "累计有效投注和累计充值都达到门槛即升级，每级发一次，{n} 天内领取。": "Reach both the Total Bet and Total Dep. targets to level up. Paid once per level; claim within {n} days.（示意）",
  "按本月有效投注达到的最高保级等级发放，下月领取，{n} 天内有效。": "Paid for the highest level whose Ret. Bet your valid bets reach this month. Claim next month, within {n} days.（示意）",
  "按生日月评定的等级发放，生日当天起 {n} 天内领取。": "Based on your level for your birthday month. Claim within {n} days from your birthday.（示意）",
  "底色表示进度，对勾表示已达成；生日奖金列的对勾表示若下月是你的生日月，按此等级发放。": "Shading shows progress; a tick means reached. In the Birthday Bonus column, the tick shows the level paid if next month is your birthday month.（示意）",
  /* 升级 3 秒提示动画（用户 2026-10-30 新增「升级通知动画页面」，VIP通知页面同一实现）：段位徽章 +「LEVEL UP」+ 等级名，中英文界面都显示 LEVEL UP（用户 2026-10-30），替代原「恭喜升级到 {lv}」（该条保留给其他迭代） */
  "LEVEL UP": "LEVEL UP",
  /* 自动领取的到账通知（用户 2026-10-30：领取方式按奖金类型设置，默认手动领取）；奖金到账提醒短信（替代月度奖金可领取短信） */
  "VIP 升级奖金已到账": "VIP Upgrade Bonus credited（示意）",
  "VIP 月度奖金已到账": "VIP Monthly Bonus credited（示意）",
  "VIP 生日奖金已到账": "VIP Birthday Bonus credited（示意）",
  "生日快乐！{a} 已到账。": "Happy Birthday! {a} credited.（示意）",
  "{a} VIP 月度奖金已到账！登录 789Bingo 查看。": "{a} VIP Monthly Bonus credited! Log in to 789Bingo to check.（示意）",
  "生日当天到账": "Credited on B-day（示意）",
  "VIP 奖金到账后直接进入余额，无需领取。": "VIP bonuses go straight to your balance. No need to claim.（示意）",
  "升级奖金到账后直接进入余额；月度、生日奖金在当前等级「查看详情」里领取，自获得当天起 {n} 天内有效（生日奖金自生日当天起，含当天），过期不能再领。": "Upgrade Bonuses go straight to your balance. Claim Monthly and Birthday Bonuses in your current level's Details within {n} days from the day you get them (Birthday Bonus: from your birthday; incl. that day). Unclaimed bonuses expire.（示意）"   /* 第 11 批：VIP 规则第 9 条 · 混合（示例：升级自动、月度和生日手动；待运营定稿） */
};
