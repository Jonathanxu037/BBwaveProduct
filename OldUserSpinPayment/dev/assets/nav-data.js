/* 目录数据只维护这一份；路径相对于包根目录。
   type：page = 前台页面，admin = 后台页面，doc = 文档。不要改成 JSON + fetch（本地双击打开会被拦截）。
   本需求只改后台，没有前台页面，所以不显示「前台页面」目录。
   roles：除产品（pdm，能看所有页面）外，还有哪些角色能看；不写表示所有角色都能看（公共页面）。opr = 运营，dev = 开发，repo = 报告。 */
window.NAV_DATA = {
  role: "dev",   /* 发布站点的角色：开发 */
  title: "老用户充值转盘（v1.0）", href: "index.html",
  roles: [],   /* 入口页「需求与原型中心」只有产品能看 */
  home: { opr: "docs/老用户充值转盘-需求修改总结.html", dev: "docs/老用户充值转盘-需求要点.html", repo: "docs/老用户充值转盘-需求开发PRD文档.html" },   /* 各角色打开后的默认页；产品是入口页 */
  children: [
    { title: "原型页面", href: "prototype/admin/老用户充值转盘-后台活动管理页面.html", bar: "#D8242F", children: [
      { title: "后台页面", href: "prototype/admin/老用户充值转盘-后台活动管理页面.html", bar: "#8C6EDC", children: [
        { title: "后台活动管理页面", href: "prototype/admin/老用户充值转盘-后台活动管理页面.html", type: "admin" }
      ]}
    ]},
    { title: "文档资料", href: "docs/老用户充值转盘-需求要点.html", bar: "#2E9A58", children: [
      { title: "需求要点", href: "docs/老用户充值转盘-需求要点.html", type: "doc", roles: ["dev"] },
      { title: "需求开发PRD文档", href: "docs/老用户充值转盘-需求开发PRD文档.html", type: "doc", roles: ["dev", "repo"], children: [
        { title: "版本与目录", href: "docs/老用户充值转盘-需求开发PRD文档.html#ver" },
        { title: "0. 本迭代范围", href: "docs/老用户充值转盘-需求开发PRD文档.html#c0" },
        { title: "1. 项目概述", href: "docs/老用户充值转盘-需求开发PRD文档.html#c1" },
        { title: "2. 整体业务流程", href: "docs/老用户充值转盘-需求开发PRD文档.html#c2" },
        { title: "3. 业务规则", href: "docs/老用户充值转盘-需求开发PRD文档.html#c3" },
        { title: "4. 运营后台需求", href: "docs/老用户充值转盘-需求开发PRD文档.html#c4" },
        { title: "5. 接口与异常", href: "docs/老用户充值转盘-需求开发PRD文档.html#c5" },
        { title: "6. 验收标准", href: "docs/老用户充值转盘-需求开发PRD文档.html#c6" },
        { title: "7. 上线方式", href: "docs/老用户充值转盘-需求开发PRD文档.html#c7" },
        { title: "8. 风险与依赖", href: "docs/老用户充值转盘-需求开发PRD文档.html#c8" },
        { title: "9. 待确认事项", href: "docs/老用户充值转盘-需求开发PRD文档.html#c9" },
        { title: "10. 各角色协作 Tips", href: "docs/老用户充值转盘-需求开发PRD文档.html#c10" }
      ]},
      { title: "开发自查清单", href: "docs/老用户充值转盘-开发自查清单.html", type: "doc", roles: ["dev"] },
      { title: "后台操作手册", href: "docs/老用户充值转盘-后台操作手册.html", type: "doc", roles: ["opr"] },
      { title: "客服QA", href: "docs/老用户充值转盘-客服QA.html", type: "doc", roles: ["opr"] },
      { title: "需求修改总结", href: "docs/老用户充值转盘-需求修改总结.html", type: "doc", roles: ["opr"] },
      { title: "运营需求确认", href: "docs/老用户充值转盘-运营需求确认.html", type: "doc", roles: ["opr"] }
    ]}
  ]
};
