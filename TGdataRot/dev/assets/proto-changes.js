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
  { ver: "v1.1", date: "2026-11-10", page: "prototype/front/Telegram报表-机器人对话页.html", view: "menu", target: "#tgTitle", title: "群名称",
    items: ["示意群「运营数据群」改为授权群「BBwave平台数据」，机器人名称改为「BBWave报表助手」", "群名旁新增原型标注「数据风险」（本期群内共享，不按人隔离）"] },
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
  { ver: "v1.1", date: "2026-11-10", page: "prototype/front/Telegram报表-机器人对话页.html", view: "botjoin", target: "#chat", title: "机器人进群一级菜单",
    items: ["新增：机器人进群时发一条一级菜单消息，不 @ 人，所有人可点，按点击人权限判断"] },
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
    items: ["新增页面：登记机器人、启用停用、总停用开关、疑似封禁处理、「服务中」和「未删除 N 份」标签"] }
];
