/* 目录数据只维护这一份；路径相对于包根目录。复制模板后按本需求改写（见模板 README）。
   type：page = 前台页面，admin = 后台页面，doc = 文档。不要改成 JSON + fetch（本地双击打开会被拦截）。
   roles：除产品（pdm，能看所有页面）外，还有哪些角色能看；不写表示所有角色都能看。opr = 运营，dev = 开发，repo = 报告。
   需求不涉及前台或后台时，删掉对应的三级目录和原型文件；不涉及后台时删掉「后台操作手册」。 */
window.NAV_DATA = {
  role: "dev",   /* 发布站点的角色：开发 */
  title: "会员手机号隐藏与查看验证（v1.0）", href: "index.html",
  siteTag: "789Bingo&789Games",   /* 目录栏和产品密码页最上方的站点标识，按需求覆盖的站点选：三站都覆盖 "789Bingo & 789Games & 789Play"（& 两边必须有空格，目录栏才能折行，不会压住「隐藏」按钮）；两站都覆盖 "789Bingo&789Games"；只针对老站 "789Bingo"；只针对新站 "789Games"。新建需求时由 new_requirement.ps1 -Site 写入；不写时退回显示「789BINGO」（只为兼容旧包）（需求包框架规范第 3.2 节） */
  // brand: "【左侧目录栏标题，不写时自动取上面 title 去掉版本号】",   /* 目录栏顶部显示需求标题（需求包框架规范第 3.2 节） */
  showChanges: false,   /* 运营需求确认页是否显示原型修改标注（版本痕迹）：默认 false 不显示，需要时改成 true（需求包框架规范第 6.1 节） */
  roles: [],   /* 入口页「需求与原型中心」只有产品能看 */
  home: { opr: "docs/会员手机号隐藏与查看验证-需求修改总结.html", dev: "docs/会员手机号隐藏与查看验证-需求要点.html", repo: "docs/会员手机号隐藏与查看验证-需求开发PRD文档.html" },   /* 各角色打开后的默认页；产品是入口页 */
  children: [
    { title: "原型页面", href: "prototype/admin/会员手机号隐藏与查看验证-后台会员列表页面.html", bar: "#D8242F", children: [
      { title: "后台页面", href: "prototype/admin/会员手机号隐藏与查看验证-后台会员列表页面.html", bar: "#8C6EDC", children: [
        { title: "后台会员列表页面", href: "prototype/admin/会员手机号隐藏与查看验证-后台会员列表页面.html", type: "admin" }
      ]}
    ]},
    { title: "文档资料", href: "docs/会员手机号隐藏与查看验证-需求要点.html", bar: "#2E9A58", children: [
      { title: "需求要点", href: "docs/会员手机号隐藏与查看验证-需求要点.html", type: "doc", roles: ["dev"] },
      { title: "需求开发PRD文档", href: "docs/会员手机号隐藏与查看验证-需求开发PRD文档.html", type: "doc", roles: ["dev", "repo"], children: [
        { title: "版本与目录", href: "docs/会员手机号隐藏与查看验证-需求开发PRD文档.html#ver" },
        { title: "0. 本迭代范围", href: "docs/会员手机号隐藏与查看验证-需求开发PRD文档.html#c0" },
        { title: "1. 项目概述", href: "docs/会员手机号隐藏与查看验证-需求开发PRD文档.html#c1" },
        { title: "2. 整体业务流程", href: "docs/会员手机号隐藏与查看验证-需求开发PRD文档.html#c2" },
        { title: "3. 业务规则", href: "docs/会员手机号隐藏与查看验证-需求开发PRD文档.html#c3" },
        { title: "4. 运营后台需求", href: "docs/会员手机号隐藏与查看验证-需求开发PRD文档.html#c4" },
        { title: "5. 接口与异常", href: "docs/会员手机号隐藏与查看验证-需求开发PRD文档.html#c5" },
        { title: "6. 验收标准", href: "docs/会员手机号隐藏与查看验证-需求开发PRD文档.html#c6" },
        { title: "7. 上线方式", href: "docs/会员手机号隐藏与查看验证-需求开发PRD文档.html#c7" },
        { title: "8. 风险与依赖", href: "docs/会员手机号隐藏与查看验证-需求开发PRD文档.html#c8" },
        { title: "9. 待确认事项", href: "docs/会员手机号隐藏与查看验证-需求开发PRD文档.html#c9" },
        { title: "10. 各角色协作 Tips", href: "docs/会员手机号隐藏与查看验证-需求开发PRD文档.html#c10" },
        { title: "附录 A 评审清单核对", href: "docs/会员手机号隐藏与查看验证-需求开发PRD文档.html#appA" },
        { title: "附录 B 原型对照表", href: "docs/会员手机号隐藏与查看验证-需求开发PRD文档.html#appB" },
        { title: "附录 D 页面控件说明", href: "docs/会员手机号隐藏与查看验证-需求开发PRD文档.html#appD" }
      ]},
      { title: "开发自查清单", href: "docs/会员手机号隐藏与查看验证-开发自查清单.html", type: "doc", roles: ["dev"] },
    ]}
  ]
};
window.PROTO_LANG = "en";   /* 发布站点的前台原型画面显示英文（assets/proto-en.js，需求包框架规范第 4 节「原型语言」） */
window.PROTO_PUBLISH = true;   /* 发布站点的后台原型只显示运营操作的页面，规则批注、模拟面板、需求说明不显示（需求包框架规范第 4 节） */
