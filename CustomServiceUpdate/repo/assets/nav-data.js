/* 目录数据只维护这一份；路径相对于包根目录。复制模板后按本需求改写（见模板 README）。
   type：page = 前台页面，admin = 后台页面，doc = 文档。不要改成 JSON + fetch（本地双击打开会被拦截）。
   roles：除产品（pdm，能看所有页面）外，还有哪些角色能看；不写表示所有角色都能看。opr = 运营，dev = 开发，repo = 报告。
   需求不涉及前台或后台时，删掉对应的三级目录和原型文件；不涉及后台时删掉「后台操作手册」。 */
window.NAV_DATA = {
  role: "repo",   /* 发布站点的角色：报告 */
  title: "客服系统优化（v1.0）", href: "index.html",
  showChanges: false,   /* 运营需求确认页是否显示原型修改标注（版本痕迹）：默认 false 不显示，需要时改成 true（需求包框架规范第 6.1 节） */
  /* 左侧目录栏标题显示需求标题（用户 2026-10-23 要求）；本需求包含两个需求，标题区列出两个需求，点选切换（需求包框架规范第 14 节「客服系统优化」例外）。
     k 与 assets/req-tabs.js 的需求标识一致；proto 是在原型页面点选时跳转的原型 */
  reqs: [
    { k: "a", title: "后台列表优化", proto: "prototype/admin/客服系统优化-客服后台会话列表.html" },
    { k: "b", title: "自助问题优化", proto: "prototype/front/客服系统优化-客服对话窗查看订单.html" }
  ],
  roles: [],   /* 入口页「需求与原型中心」只有产品能看 */
  home: { opr: "docs/客服系统优化-需求修改总结.html", dev: "docs/客服系统优化-需求要点.html", repo: "docs/客服系统优化-需求开发PRD文档.html" },   /* 各角色打开后的默认页；产品是入口页 */
  children: [
    { title: "原型页面", href: "prototype/front/客服系统优化-客服对话窗查看订单.html", bar: "#D8242F", children: [
      { title: "前台页面", href: "prototype/front/客服系统优化-客服对话窗查看订单.html", bar: "#3B82F6", children: [
        { title: "客服对话窗查看订单（自助问题优化）", href: "prototype/front/客服系统优化-客服对话窗查看订单.html", type: "page" }
      ]},
      { title: "后台页面", href: "prototype/admin/客服系统优化-客服后台会话列表.html", bar: "#8C6EDC", children: [
        { title: "客服后台会话列表（后台列表优化）", href: "prototype/admin/客服系统优化-客服后台会话列表.html", type: "admin" }
      ]}
    ]},
    { title: "文档资料", href: "docs/客服系统优化-需求要点.html", bar: "#2E9A58", children: [
      { title: "需求要点", href: "docs/客服系统优化-需求要点.html", type: "doc", roles: ["dev"] },
      { title: "需求开发PRD文档", href: "docs/客服系统优化-需求开发PRD文档.html", type: "doc", roles: ["dev", "repo"], children: [
        { title: "后台列表优化", href: "docs/客服系统优化-需求开发PRD文档.html#a-ver" },
        { title: "自助问题优化", href: "docs/客服系统优化-需求开发PRD文档.html#b-ver" }
      ]},
      { title: "开发自查清单", href: "docs/客服系统优化-开发自查清单.html", type: "doc", roles: ["dev"] },
      { title: "客服后台使用说明", href: "docs/客服系统优化-后台操作手册.html", type: "doc", roles: ["opr"] },
      { title: "客服QA", href: "docs/客服系统优化-客服QA.html", type: "doc", roles: ["opr"] },
      { title: "需求修改总结", href: "docs/客服系统优化-需求修改总结.html", type: "doc", roles: ["opr"] },
      { title: "运营需求确认", href: "docs/客服系统优化-运营需求确认.html", type: "doc", roles: ["opr"] },
      { title: "文案确认", href: "docs/客服系统优化-文案确认.html", type: "doc", roles: ["opr"] }
    ]}
  ]
};
window.PROTO_LANG = "en";   /* 发布站点的前台原型画面显示英文（assets/proto-en.js，需求包框架规范第 4 节「原型语言」） */
window.PROTO_PUBLISH = true;   /* 发布站点的后台原型只显示运营操作的页面，规则批注、模拟面板、需求说明不显示（需求包框架规范第 4 节） */
