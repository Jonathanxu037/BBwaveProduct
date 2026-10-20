/* 目录数据只维护这一份；路径相对于包根目录。复制模板后按本需求改写（见模板 README）。
   type：page = 前台页面，admin = 后台页面，doc = 文档。不要改成 JSON + fetch（本地双击打开会被拦截）。
   roles：除产品（pdm，能看所有页面）外，还有哪些角色能看；不写表示所有角色都能看。opr = 运营，dev = 开发，repo = 报告。
   需求不涉及前台或后台时，删掉对应的三级目录和原型文件；不涉及后台时删掉「后台操作手册」。 */
window.NAV_DATA = {
  role: "opr",   /* 发布站点的角色：运营 */
  title: "游戏快捷侧边栏（v1.1）", href: "index.html",
  api: "https://oc-feedback.jonathanxu037.workers.dev", oprKey: "opr-7e295e9a66a7f703410b6d0465a447d00dc311f40eb66150",   /* 云端存储接口和运营写入口令；用 .claude/tools/set_cloud_api.ps1 修改 */
  roles: [],   /* 入口页「需求与原型中心」只有产品能看 */
  home: { opr: "docs/游戏快捷侧边栏-需求修改总结.html", dev: "docs/游戏快捷侧边栏-需求要点.html", repo: "docs/游戏快捷侧边栏-需求开发PRD文档.html" },   /* 各角色打开后的默认页；产品是入口页 */
  children: [
    { title: "原型页面", href: "prototype/front/游戏快捷侧边栏-游戏页快捷侧边栏.html", bar: "#D8242F", children: [
      { title: "前台页面", href: "prototype/front/游戏快捷侧边栏-游戏页快捷侧边栏.html", bar: "#3B82F6", children: [
        { title: "游戏页快捷侧边栏", href: "prototype/front/游戏快捷侧边栏-游戏页快捷侧边栏.html", type: "page" },
        { title: "游戏内充值弹窗", href: "prototype/front/游戏快捷侧边栏-游戏内充值弹窗.html", type: "page" }
      ]},
      { title: "后台页面", href: "prototype/admin/游戏快捷侧边栏-后台游戏快捷侧边栏管理.html", bar: "#8C6EDC", children: [
        { title: "后台游戏快捷侧边栏管理", href: "prototype/admin/游戏快捷侧边栏-后台游戏快捷侧边栏管理.html", type: "admin" }
      ]}
    ]},
    { title: "文档资料", href: "docs/游戏快捷侧边栏-需求要点.html", bar: "#2E9A58", children: [
      { title: "需求要点", href: "docs/游戏快捷侧边栏-需求要点.html", type: "doc", roles: ["dev"] },
      { title: "需求开发PRD文档", href: "docs/游戏快捷侧边栏-需求开发PRD文档.html", type: "doc", roles: ["dev", "repo"], children: [
        { title: "版本与目录", href: "docs/游戏快捷侧边栏-需求开发PRD文档.html#ver" },
        { title: "0. 本迭代范围", href: "docs/游戏快捷侧边栏-需求开发PRD文档.html#c0" },
        { title: "1. 项目概述", href: "docs/游戏快捷侧边栏-需求开发PRD文档.html#c1" },
        { title: "2. 整体业务流程", href: "docs/游戏快捷侧边栏-需求开发PRD文档.html#c2" },
        { title: "3. 业务规则", href: "docs/游戏快捷侧边栏-需求开发PRD文档.html#c3" },
        { title: "4. 前台页面一：游戏页快捷侧边栏", href: "docs/游戏快捷侧边栏-需求开发PRD文档.html#c4" },
        { title: "5. 前台页面二：游戏内充值弹窗", href: "docs/游戏快捷侧边栏-需求开发PRD文档.html#c5" },
        { title: "6. 运营后台需求", href: "docs/游戏快捷侧边栏-需求开发PRD文档.html#c6" },
        { title: "7. 数据埋点", href: "docs/游戏快捷侧边栏-需求开发PRD文档.html#c7" },
        { title: "8. 接口与异常", href: "docs/游戏快捷侧边栏-需求开发PRD文档.html#c8" },
        { title: "9. 验收标准", href: "docs/游戏快捷侧边栏-需求开发PRD文档.html#c9" },
        { title: "10. 上线方式", href: "docs/游戏快捷侧边栏-需求开发PRD文档.html#c10" },
        { title: "11. 风险与依赖", href: "docs/游戏快捷侧边栏-需求开发PRD文档.html#c11" },
        { title: "12. 待确认事项", href: "docs/游戏快捷侧边栏-需求开发PRD文档.html#c12" },
        { title: "13. 各角色协作 Tips", href: "docs/游戏快捷侧边栏-需求开发PRD文档.html#c13" },
        { title: "附录 A 评审清单核对", href: "docs/游戏快捷侧边栏-需求开发PRD文档.html#appA" },
        { title: "附录 B 原型对照表", href: "docs/游戏快捷侧边栏-需求开发PRD文档.html#appB" },
        { title: "附录 C 前台文案中英对照", href: "docs/游戏快捷侧边栏-需求开发PRD文档.html#appC" }
      ]},
      { title: "开发自查清单", href: "docs/游戏快捷侧边栏-开发自查清单.html", type: "doc", roles: ["dev"] },
      { title: "后台操作手册", href: "docs/游戏快捷侧边栏-后台操作手册.html", type: "doc", roles: ["opr"] },
      { title: "客服QA", href: "docs/游戏快捷侧边栏-客服QA.html", type: "doc", roles: ["opr"] },
      { title: "需求修改总结", href: "docs/游戏快捷侧边栏-需求修改总结.html", type: "doc", roles: ["opr"] },
      { title: "运营需求确认", href: "docs/游戏快捷侧边栏-运营需求确认.html", type: "doc", roles: ["opr"] }
    ]}
  ]
};
window.PROTO_LANG = "en";   /* 发布站点的前台原型画面显示英文（assets/proto-en.js，需求包框架规范第 4 节「原型语言」） */
