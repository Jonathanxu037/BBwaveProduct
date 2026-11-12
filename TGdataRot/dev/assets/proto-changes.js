/* 原型修改标注数据：「运营需求确认」页据此在原型上标出各版本改过的地方，并显示版本号角标。
   只记录「页面」类修改：前台、后台页面上看得到的控件、文案、布局、交互。
   逻辑层修改（判定规则、接口、数据口径）不记在这里，只在 PRD 里标注；误写 type: "逻辑" 的条目也不会显示。
   首版 v1.0 不做标注。每新增一个需求版本，把这个版本对原型页面的修改逐条加进来，格式：
   {
     ver: "v1.1",                                        // 需求版本号，和 PRD 需求版本管理表一致
     date: "2026-10-12",                                 // 版本日期
     page: "prototype/admin/Telegram报表-后台XX页面.html",   // 原型页面路径，和 nav-data.js 一致
     view: "new",                                        // 修改所在视图（页面没有视图时不写）
     target: "[data-ch='xx-field']",                   // 被修改的元素，CSS 选择器；建议在原型元素上加 data-ch 属性
     title: "XX 下拉",                               // 修改的内容项名称
     items: ["选项名称由「旧名称」改为「新名称」"]    // 这个版本改了什么，一行一条，写清改前和改后
   }
   同一个元素在多个版本都改过时，每个版本各写一条；原型上只显示最新版本的角标，点开可看到更早的修改。 */
window.PROTO_CHANGES = [
  /* ===== v1.1（2026-11-10）机器人对话页 ===== */
  { ver: "v1.1", date: "2026-11-10", page: "prototype/front/Telegram报表-机器人对话页.html", view: "menu", target: ".tg-head", title: "群名称",
    items: ["示意群「运营数据群」改为授权群「BBwave平台数据」，机器人名称改为「BBWave报表助手」", "群名旁新增原型标注「数据风险」（本期群内共享，不按人隔离）", "（v1.2 已改为私聊，群名称和「数据风险」标注已删除，标注定位到顶栏）"] },
  { ver: "v1.1", date: "2026-11-10", page: "prototype/front/Telegram报表-机器人对话页.html", view: "menu", target: "#menuBtn", title: "「/」命令列表",
    items: ["输入框左侧蓝色「菜单」按钮改为「/」命令列表，点「/」或在输入框输入「/」展开", "命令说明改为「/menu 显示首页菜单」「/agent 按代理线查询」"] },
  { ver: "v1.1", date: "2026-11-10", page: "prototype/front/Telegram报表-机器人对话页.html", view: "menu", target: "#chat", title: "进群首页菜单",
    items: ["打开群就显示的按钮矩阵改为：人员进群时机器人 @ 他发本人首页菜单，只有他能点", "按群配置站点范围改为按人员在各子站后台的权限显示：两个及以上子站有权限为一级按钮（789BINGO、789GAMES、全网数据），只有一个子站权限直接为该子站二级菜单", "一级菜单下方新增「🔍 代理线查询」"] },
  { ver: "v1.1", date: "2026-11-10", page: "prototype/front/Telegram报表-机器人对话页.html", view: "menu", target: "#kbdTg", title: "底部按钮键盘",
    items: ["打开群默认显示改为默认收起，点「⌨」展开", "固定 3 列按钮矩阵改为：先选一级范围，再一次列出本人可查看的全部层级渠道，其下「🔍 代理线查询」和「⬅ 返回上一级」「🏠 首页菜单」"] },
  { ver: "v1.1", date: "2026-11-10", page: "prototype/front/Telegram报表-机器人对话页.html", view: "lv3", target: "#chat .tg-msg:last-child .tg-kb", title: "二级、下一级菜单",
    items: ["新增二级渠道菜单和不限层级的下一级菜单（「📊 父级·全渠道」+ 子渠道）", "各级菜单下方新增「🔍 代理线查询」和「⬅ 返回上一级」「🏠 首页菜单」", "已发出的菜单按发出时的权限保留按钮，点已不可用的按钮只弹提示"] },
  { ver: "v1.1", date: "2026-11-10", page: "prototype/front/Telegram报表-机器人对话页.html", view: "report", target: "#chat .tg-banner", title: "报表快照图片",
    items: ["消息里的文字表格改为按 Excel 格式生成的图片，聊天里显示 banner 缩略图，点开全屏查看", "「今日 / 昨日全天」改为今日、昨日、前日三列和「较昨日同时段」", "两站汇总群的三列改为全网数据报表：「全网合计」和各子站工作表上下拼接", "统计时间每个子站一行，写子站名、时区和具体日期"] },
  { ver: "v1.1", date: "2026-11-10", page: "prototype/front/Telegram报表-机器人对话页.html", view: "report", target: "#chat .tg-cap", title: "报表下方文字和按钮",
    items: ["新增菜单路径和统计时间区间：每个子站一组「🕒 子站（时区）今日 / 昨日 / 前日 / 对比」，一律写具体日期", "新增自动删除时间「⏱ MM-DD HH:mm 自动删除（GMT+8）」，由发出满 1 小时改为满 15 分钟", "报表下方新增「🔍 代理线查询」「⬅ 返回上一级」「🏠 首页菜单」"] },
  { ver: "v1.1", date: "2026-11-10", page: "prototype/front/Telegram报表-机器人对话页.html", view: "agent", target: "#msg", title: "代理线查询",
    items: ["回复完整代理账号改为可只输入一部分，模糊搜索：只搜到 1 个直接出报表；2 个及以上列出代理按钮（最多 10 个），点代理按钮生成报表", "没搜到时回复「未找到」，输入框自动进入回复状态，直接输入新账号即可", "全网数据下只查部分子站时注明原因（没有代理线查询权限、另一站暂停中）", "提问、搜索结果和「未找到」回复归属提问人，发出满 15 分钟删除"] },
  { ver: "v1.1", date: "2026-11-10", page: "prototype/front/Telegram报表-机器人对话页.html", view: "nostaff", target: "#chat [data-dev='D104']", title: "群内拒绝回复",
    items: ["最后一行新增删除时间「⏱ MM-DD HH:mm 自动删除（GMT+8）」，发出满 1 分钟删除", "新增「该渠道已不可用，请选择其他渠道。」「你没有可查看的渠道，请联系管理员开通。」"] },
  { ver: "v1.1", date: "2026-11-10", page: "prototype/front/Telegram报表-机器人对话页.html", view: "menu", target: "#chat", title: "机器人进群一级菜单",
    items: ["新增：机器人进群时发一条一级菜单消息，不 @ 人，所有人可点，按点击人权限判断", "（v1.2 已删除：改为私聊，机器人被拉进群或频道后自动退出，原型上不显示）"] },
  { ver: "v1.1", date: "2026-11-10", page: "prototype/front/Telegram报表-机器人对话页.html", view: "fail", target: "#chat [data-dev='D15']", title: "失败提示与「重试」",
    items: ["新增排队超时提示「排队超时，报表未发出，请稍后重试。」，两条失败提示都不带 @", "「重试」只有生成这份报表的人员能点"] },
  /* ===== v1.1 后台页面 ===== */
  { ver: "v1.1", date: "2026-11-10", page: "prototype/admin/Telegram报表-后台渠道配置页面.html", view: "list", target: ".bo-tabs", title: "页签",
    items: ["「渠道配置、授权群」改为「人员配置、渠道配置、机器人管理」", "删除授权群页面（对接的群由技术配置，后台不设置）"] },
  { ver: "v1.1", date: "2026-11-10", page: "prototype/admin/Telegram报表-后台渠道配置页面.html", view: "list", target: ".bo-content > .ui-reqnote", title: "页面说明",
    items: ["固定 5 个渠道改为运营自行新建、编辑、删除渠道，支持父级渠道，层级不限", "渠道即群里按钮，「群里显示」控制按钮是否出现"] },
  { ver: "v1.1", date: "2026-11-10", page: "prototype/admin/Telegram报表-后台渠道配置页面.html", view: "list", target: "#addCh", title: "「+ 新建渠道」按钮",
    items: ["新增按钮，自建渠道最多 20 个（含子渠道）"] },
  { ver: "v1.1", date: "2026-11-10", page: "prototype/admin/Telegram报表-后台渠道配置页面.html", view: "list", target: "#rows", title: "渠道列表",
    items: ["列由「渠道、绑定代理、代理数、最后修改时间、操作人、操作」改为「位置、渠道名称、父级渠道、绑定代理、群里显示、最后修改、操作」", "新增默认渠道「全站」「自然流量」（只能查看）", "新增「范围重叠」「无可用代理」标记"] },
  { ver: "v1.1", date: "2026-11-10", page: "prototype/admin/Telegram报表-后台渠道配置页面.html", view: "add", target: "#dlg .bo-dlg", title: "新建 / 编辑渠道弹窗",
    items: ["输入代理账号逐个添加改为：渠道名称、父级渠道、绑定代理树状勾选", "保存时校验顶层渠道之间不重叠、子渠道不超出父级范围"] },
  { ver: "v1.1", date: "2026-11-10", page: "prototype/admin/Telegram报表-后台人员配置页面.html", view: "list", target: ".bo-main", title: "人员配置页面",
    items: ["新增页面：各子站后台按 Telegram ID 登记人员，设置可查看渠道和状态"] },
  { ver: "v1.1", date: "2026-11-10", page: "prototype/admin/Telegram报表-后台机器人管理页面.html", view: "list", target: ".bo-main", title: "机器人管理页面",
    items: ["新增页面：登记机器人、启用停用、总停用开关、疑似封禁处理、「服务中」和「未删除 N 份」标签"] },
  /* ===== v1.2（2026-11-11）群内使用改为私聊一对一 · 机器人对话页 ===== */
  { ver: "v1.2", date: "2026-11-11", page: "prototype/front/Telegram报表-机器人对话页.html", view: "start", target: ".tg-head", title: "顶栏",
    items: ["群名「BBwave平台数据」和成员数改为机器人名「BBWave报表助手」和「机器人」字样，头像改为机器人头像", "删除原型标注「数据风险」"] },
  { ver: "v1.2", date: "2026-11-11", page: "prototype/front/Telegram报表-机器人对话页.html", view: "start", target: "#startBtn", title: "「开始」按钮和机器人简介",
    items: ["新增：首次打开机器人私聊时显示机器人简介「内部工具，仅限已登记人员使用。」（未定稿，上方标题由 Telegram 客户端显示）和「开始」按钮，点「开始」收到本人首页菜单", "删除人员进群、机器人进群时自动发菜单"] },
  { ver: "v1.2", date: "2026-11-11", page: "prototype/front/Telegram报表-机器人对话页.html", view: "menu", target: "#chat", title: "菜单消息",
    items: ["菜单、提问和报表改为在本人私聊里一对一收发，消息里不再 @ 人", "删除按钮归属：其他人点击时的提示「仅 @xxx 可操作，请发 /menu 打开你的菜单」", "菜单类消息由只被新菜单替换改为：被新菜单替换时删除，未被替换的发出满 24 小时删除", "配置变更后点已不可用的按钮：提示由「该渠道已不可用，请发 /menu 重新打开菜单」改为发新首页菜单并只弹「该渠道已不可用，请在新菜单里选择」；这次操作本身会打开菜单或生成报表时不另发首页菜单", "配置变更后这次操作已回复「你没有可查看的渠道」或未开通回复时，不再补发首页菜单，只回复一次"] },
  { ver: "v1.2", date: "2026-11-11", page: "prototype/front/Telegram报表-机器人对话页.html", view: "report", target: "#chat [data-dev='D14']", title: "报表自动删除时间",
    items: ["报表由发出满 15 分钟删除改为满 24 小时删除", "生成新报表不再删除之前的报表"] },
  { ver: "v1.2", date: "2026-11-11", page: "prototype/front/Telegram报表-机器人对话页.html", view: "nostaff", target: "#chat [data-dev='D104']", title: "未开通回复",
    items: ["群内回复「@昵称 你还没有报表查看权限…」改为私聊的未开通回复，不 @、不自动删除；未登记或已停用的人员发任何命令（含不支持的命令）都回复这句", "新增：同一 Telegram ID 10 分钟内只回复 1 次，其余消息不回应", "删除未授权群的回复和私聊「引导到群」的回复"] },
  { ver: "v1.2", date: "2026-11-11", page: "prototype/front/Telegram报表-机器人对话页.html", view: "agent", target: "#msg", title: "代理线查询",
    items: ["提问、搜索结果和「未找到」回复不再 @ 人，由发出满 15 分钟删除改为被新菜单替换时删除、未被替换的发出满 24 小时删除；人员回复的代理账号文字一并删除", "提问文案末尾加「（请直接回复本条）」", "提问和「未找到」回复最后一行新增「⬅ 返回上一级」「🏠 首页菜单」", "演示代理新增 kk_sms_g16–g19、kk_sms_a02、kk_sms_a03，在全网数据输入「kk」可演示超过 10 个"] },
  { ver: "v1.2", date: "2026-11-11", page: "prototype/front/Telegram报表-机器人对话页.html", view: "fail", target: "#chat [data-dev='D15']", title: "生成中与「重试」",
    items: ["「本群已有报表生成中」改为「本人已有报表生成中」，同一人员同时只生成一份", "「重试」不再限制只有生成者能点"] },
  { ver: "v1.2", date: "2026-11-11", page: "prototype/front/Telegram报表-机器人对话页.html", view: "botchg", target: "#chat [data-dev='D133']", title: "服务机器人已更换",
    items: ["新增：原机器人私聊通知「报表机器人已更换，请打开 @当前服务机器人用户名 并点「开始」。」和「打开 @当前服务机器人用户名」按钮，发出满 24 小时删除", "点非服务机器人（含原服务机器人、备用机器人）旧按钮的提示由「请发 /menu 打开你的菜单」改为同一句更换通知"] },
  { ver: "v1.2", date: "2026-11-11", page: "prototype/front/Telegram报表-机器人对话页.html", view: "all", target: "#chat .tg-cap", title: "统计时间的时区",
    items: ["789Games 的时区由「时区待确认」改为按技术确定的平台时区显示（原型示意 UTC+8）"] },
  /* ===== v1.2 后台页面 ===== */
  { ver: "v1.2", date: "2026-11-11", page: "prototype/admin/Telegram报表-后台渠道配置页面.html", view: "list", target: "#rows", title: "「菜单显示」列",
    items: ["列名「群里显示」改为「菜单显示」，开关提示同步改为菜单"] },
  { ver: "v1.2", date: "2026-11-11", page: "prototype/admin/Telegram报表-后台渠道配置页面.html", view: "list", target: ".bo-content > .ui-reqnote", title: "页面说明",
    items: ["「一个渠道就是群里的一个按钮」改为「菜单里的一个按钮」"] },
  { ver: "v1.2", date: "2026-11-11", page: "prototype/admin/Telegram报表-后台人员配置页面.html", view: "list", target: "#rows", title: "Telegram 昵称",
    items: ["昵称由从授权群获取改为人员私聊机器人时获取，未获取时由「未进群」改为「待获取」"] },
  { ver: "v1.2", date: "2026-11-11", page: "prototype/admin/Telegram报表-后台人员配置页面.html", view: "list", target: "[data-ch='tgid']", title: "Telegram ID 说明",
    items: ["「?」说明改为开通流程：人员打开机器人私聊链接点「开始」，收到带 ID 的未开通回复，手动抄写发来，按其提供的 ID 填入"] },
  { ver: "v1.2", date: "2026-11-11", page: "prototype/admin/Telegram报表-后台人员配置页面.html", view: "list", target: "[data-ch='at']", title: "添加时间",
    items: ["表头「添加时间」改为「添加时间（GMT+8）」"] },
  { ver: "v1.2", date: "2026-11-11", page: "prototype/admin/Telegram报表-后台人员配置页面.html", view: "new", target: "#fmNick", title: "添加弹窗的昵称提示",
    items: ["提示改为「登记后，人员下次私聊机器人时按 Telegram ID 自动获取」"] },
  { ver: "v1.2", date: "2026-11-11", page: "prototype/admin/Telegram报表-后台渠道配置页面.html", view: "list", target: "[data-ch='mt']", title: "最后修改",
    items: ["表头「最后修改」改为「最后修改（GMT+8）」"] },
  { ver: "v1.2", date: "2026-11-11", page: "prototype/admin/Telegram报表-后台机器人管理页面.html", view: "new", target: "#fmTest", title: "测试连接与用户名核对",
    items: ["测试连接成功由「连接正常」改为「连接正常：@实际用户名」", "新增：保存时核对 Token 对应的用户名与填写的一致，不一致提示「用户名与 Token 不匹配」"] },
  { ver: "v1.2", date: "2026-11-11", page: "prototype/admin/Telegram报表-后台人员配置页面.html", view: "del", target: "#cfmP", title: "删除确认文案",
    items: ["「仍在群里时能看到别人查询的报表，需要时请把他移出群」改为「他已收到的报表按原定时间删除」"] },
  { ver: "v1.2", date: "2026-11-11", page: "prototype/admin/Telegram报表-后台机器人管理页面.html", view: "list", target: "#srv", title: "当前服务机器人和私聊链接",
    items: ["新增：显示当前服务机器人和私聊链接（t.me/用户名），可复制；原机器人发不出更换通知时提示后台管理员转告", "没有可接替的机器人时红字分两种：原机器人手动停用「本子站和全网数据暂停出报表，其他子站仍由原机器人服务」；原机器人疑似封禁或 Token 失效「服务机器人不可用，也没有可接替的机器人：全部子站和全网数据停止出报表，人员私聊收不到回复」", "新增：没有可接替期间，启用或添加可接替的机器人时自动切换为服务机器人；原服务机器人重新启用、确认已恢复或更换 Token 后仍是服务机器人，恢复出报表，红字消失"] },
  { ver: "v1.2", date: "2026-11-11", page: "prototype/admin/Telegram报表-后台机器人管理页面.html", view: "list", target: "#rows", title: "状态和标签",
    items: ["删除状态「异常（不在群或权限不足）」", "「未删除 N 份」改为统计发出满 48 小时仍未删除的报表"] },
  { ver: "v1.2", date: "2026-11-11", page: "prototype/admin/Telegram报表-后台机器人管理页面.html", view: "undel", target: "#und .bo-dlg", title: "未删除的报表弹窗",
    items: ["新增涉及人员（昵称、Telegram ID）和「已通知，清除标记」按钮", "删除在群里 @ 群主和群管理员的合并提醒"] },
  { ver: "v1.2", date: "2026-11-11", page: "prototype/admin/Telegram报表-后台机器人管理页面.html", view: "delpend", target: "#cfm .bo-dlg", title: "删除限制",
    items: ["新增：还有报表等待自动删除或有「未删除 N 份」标记的机器人不能删除；待删除提示为「这个机器人还有 N 份报表等待自动删除，最晚 MM-DD HH:mm（GMT+8）删除完，之后再删除机器人。」", "新增：原服务机器人更换未满 7 天不能删除，提示「更换未满 7 天，MM-DD HH:mm（GMT+8）后可删除。」", "「这个机器人正在服务群」改为「这个机器人正在服务」"] },
  { ver: "v1.2", date: "2026-11-11", page: "prototype/admin/Telegram报表-后台机器人管理页面.html", view: "list", target: ".bo-top2 [data-dev='D131']", title: "告警类型",
    items: ["「机器人不在群或权限不足」「删除提醒发不出」改为「更换机器人需转告人员」「报表满 48 小时未删除」"] },
  { ver: "v1.2", date: "2026-11-11", page: "prototype/admin/Telegram报表-后台机器人管理页面.html", view: "ban", target: "#banRes", title: "故障材料排除项",
    items: ["生成故障材料的提示由「不含 Token 和玩家信息」改为「不含 Token、人员信息和报表数据」"] },
  { ver: "v1.2", date: "2026-11-11", page: "prototype/admin/Telegram报表-后台人员配置页面.html", view: "list", target: "[data-ch='chs']", title: "可查看渠道说明",
    items: ["「?」说明由「本子站按钮下可查看的渠道」改为「本子站可查看的渠道」，与 PRD 5.5 一致"] },
  { ver: "v1.2", date: "2026-11-11", page: "prototype/admin/Telegram报表-后台渠道配置页面.html", view: "list", target: "[data-ch='bind']", title: "绑定代理说明",
    items: ["「?」说明新增「未归入任何自建渠道的用户计入「自然流量」（投注站按大代理处理）」，与 PRD 5.5 一致"] }
];
