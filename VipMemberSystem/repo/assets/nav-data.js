/* 目录数据只维护这一份；路径相对于包根目录。复制模板后按本需求改写（见模板 README）。
   type：page = 前台页面，admin = 后台页面，doc = 文档。不要改成 JSON + fetch（本地双击打开会被拦截）。
   roles：除产品（pdm，能看所有页面）外，还有哪些角色能看；不写表示所有角色都能看。opr = 运营，dev = 开发，repo = 报告。
   需求不涉及前台或后台时，删掉对应的三级目录和原型文件；不涉及后台时删掉「后台操作手册」。 */
window.NAV_DATA = {
  role: "repo",   /* 发布站点的角色：报告 */
  title: "VIP会员体系（v1.3）", href: "index.html",
  siteTag: "789Bingo&789Games",   /* 目录栏和产品密码页最上方的站点标识：本需求覆盖两个站（用户 2026-11-18 确认）；只针对老站写 "789Bingo"，只针对新站写 "789Games"（需求包框架规范第 3.2 节） */
  showChanges: false,   /* 运营需求确认页是否显示原型修改标注（版本痕迹）：默认 false 不显示，需要时改成 true（需求包框架规范第 6.1 节） */
  roles: [],   /* 入口页「需求与原型中心」只有产品能看 */
  home: { opr: "docs/v1.3/VIP会员体系-需求修改总结.html", dev: "docs/v1.3/VIP会员体系-需求要点.html", repo: "docs/v1.3/VIP会员体系-需求开发PRD文档.html" },   /* 各角色打开后的默认页；产品是入口页。2026-10-27 v1.0、v1.1、完整需求已移入「版本规划 › 历史版本」封存，只有产品可看；同日新建 v1.2 迭代；2026-10-31 v1.2 移入历史版本封存，新建 v1.3 迭代（由 v1.2 复制），默认页改为 v1.3 的页面 */
  children: [
    { title: "版本规划", href: "prototype/v1.3/front/VIP会员体系-VIP中心页面.html", bar: "#D8242F", children: [
      { title: "v1.3 迭代", href: "prototype/v1.3/front/VIP会员体系-VIP中心页面.html", bar: "#E8C06A", children: [
          { title: "原型页面", href: "prototype/v1.3/front/VIP会员体系-VIP中心页面.html", children: [
            { title: "前台页面", href: "prototype/v1.3/front/VIP会员体系-VIP中心页面.html", children: [
              { title: "VIP中心页面", href: "prototype/v1.3/front/VIP会员体系-VIP中心页面.html", type: "page" },
              { title: "VIP通知页面", href: "prototype/v1.3/front/VIP会员体系-VIP通知页面.html", type: "page" }
            ]},
            { title: "后台页面", href: "prototype/v1.3/admin/VIP会员体系-后台VIP配置页面.html", children: [
              { title: "后台VIP会员等级配置页面", href: "prototype/v1.3/admin/VIP会员体系-后台VIP配置页面.html", type: "admin" }   /* 2026-10-28 按现网【用户管理 › 会员等级】三个页签重做，合并为一个页面；文件名沿用以保留已有链接和运营意见；2026-10-29 名称统一为「后台VIP会员等级配置页面」；Q125、Q129（用户 2026-11-18）：本需求不涉及免打扰、金额区间，「消息通知配置页面」目录项已删除 */
            ]}
          ]},
          { title: "需求文档", href: "docs/v1.3/VIP会员体系-需求开发PRD文档.html", children: [
            { title: "开发文档", href: "docs/v1.3/VIP会员体系-需求开发PRD文档.html", children: [
              { title: "需求开发PRD文档", href: "docs/v1.3/VIP会员体系-需求开发PRD文档.html", type: "doc", roles: ["dev", "repo"], children: [
              { title: "附录 D 页面控件说明", href: "docs/v1.3/VIP会员体系-需求开发PRD文档.html#appD" }   /* 2026-10-30 规范 v5.99 研发说明标签 */
            ] },
            ]},
          ]}
      ]},
    ]}
  ]
};
window.PROTO_LANG = "en";   /* 发布站点的前台原型画面显示英文（assets/proto-en.js，需求包框架规范第 4 节「原型语言」） */
window.PROTO_PUBLISH = true;   /* 发布站点的后台原型只显示运营操作的页面，规则批注、模拟面板、需求说明不显示（需求包框架规范第 4 节） */
