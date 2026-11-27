/* 目录数据只维护这一份；路径相对于包根目录。复制模板后按本需求改写（见模板 README）。
   type：page = 前台页面，admin = 后台页面，doc = 文档。不要改成 JSON + fetch（本地双击打开会被拦截）。
   roles：除产品（pdm，能看所有页面）外，还有哪些角色能看；不写表示所有角色都能看。opr = 运营，dev = 开发，repo = 报告。
   需求不涉及前台或后台时，删掉对应的三级目录和原型文件；不涉及后台时删掉「后台操作手册」。 */
window.NAV_DATA = {
  role: "pdm",   /* 发布站点的角色：产品 */
  title: "NDRP名单定期同步（v1.0）", href: "index.html",
  api: "https://oc-feedback.jonathanxu037.workers.dev", oprKey: "opr-7e295e9a66a7f703410b6d0465a447d00dc311f40eb66150",   /* 云端存储接口和运营写入口令；用 .claude/tools/set_cloud_api.ps1 修改 */
  gate: { salt: "5f202a3109204c31149af70c1e39d0f7", hash: "8235a12748d17c8d8bf9661c8708d27a28b080b4738427d22272cb51dbb63faf" },   /* 产品入口密码（只存哈希，不存明文）；用 .claude/tools/set_pdm_password.ps1 修改 */
  siteTag: "789Bingo & 789Games & 789Play",   /* 目录栏和产品密码页最上方的站点标识（需求包框架规范第 3.2 节） */
  showChanges: false,   /* 运营需求确认页是否显示原型修改标注（版本痕迹）：默认 false 不显示（需求包框架规范第 6.1 节） */
  roles: [],   /* 入口页「需求与原型中心」只有产品能看 */
  home: { opr: "docs/NDRP名单定期同步-需求修改总结.html", dev: "docs/NDRP名单定期同步-需求要点.html", repo: "docs/NDRP名单定期同步-需求开发PRD文档.html" },   /* 各角色打开后的默认页；产品是入口页 */
  children: [
    { title: "原型页面", href: "prototype/front/NDRP名单定期同步-填写姓名页.html", bar: "#D8242F", children: [
      { title: "前台页面", href: "prototype/front/NDRP名单定期同步-填写姓名页.html", bar: "#3B82F6", children: [
        { title: "填写姓名页", href: "prototype/front/NDRP名单定期同步-填写姓名页.html", type: "page" },
        { title: "KYC 结果提示页", href: "prototype/front/NDRP名单定期同步-KYC结果提示页.html", type: "page" }
      ]},
      { title: "后台页面", href: "prototype/admin/NDRP名单定期同步-后台KYC审核页.html", bar: "#8C6EDC", children: [
        { title: "KYC审核页", href: "prototype/admin/NDRP名单定期同步-后台KYC审核页.html", type: "admin" }
      ]}
    ]},
    { title: "文档资料", href: "docs/NDRP名单定期同步-需求要点.html", bar: "#2E9A58", children: [
      { title: "需求要点", href: "docs/NDRP名单定期同步-需求要点.html", type: "doc", roles: ["dev"] },
      { title: "需求开发PRD文档", href: "docs/NDRP名单定期同步-需求开发PRD文档.html", type: "doc", roles: ["dev", "repo"], children: [
        { title: "版本与目录", href: "docs/NDRP名单定期同步-需求开发PRD文档.html#ver" },
        { title: "1. 背景与问题", href: "docs/NDRP名单定期同步-需求开发PRD文档.html#c1" },
        { title: "2. 需求目标与范围", href: "docs/NDRP名单定期同步-需求开发PRD文档.html#c2" },
        { title: "3. 业务流程", href: "docs/NDRP名单定期同步-需求开发PRD文档.html#c3" },
        { title: "4. 功能需求", href: "docs/NDRP名单定期同步-需求开发PRD文档.html#c4" },
        { title: "5. 同步与核对记录", href: "docs/NDRP名单定期同步-需求开发PRD文档.html#c5" },
        { title: "6. 非功能需求", href: "docs/NDRP名单定期同步-需求开发PRD文档.html#c6" },
        { title: "7. 验收标准", href: "docs/NDRP名单定期同步-需求开发PRD文档.html#c7" },
        { title: "8. 待确认", href: "docs/NDRP名单定期同步-需求开发PRD文档.html#c8" },
        { title: "9. 各站工单", href: "docs/NDRP名单定期同步-需求开发PRD文档.html#c9" },
        { title: "10. 备用方案", href: "docs/NDRP名单定期同步-需求开发PRD文档.html#c10" }
      ]},
      { title: "备用方案 A：人工维护", href: "docs/NDRP名单定期同步-备用方案A-人工维护.html", type: "doc", roles: ["dev"] },
      { title: "备用方案 B：PAGCOR 定期文件", href: "docs/NDRP名单定期同步-备用方案B-PAGCOR定期文件.html", type: "doc", roles: ["dev"] },
      { title: "备用方案 C：批量复查存量会员", href: "docs/NDRP名单定期同步-备用方案C-批量复查存量会员.html", type: "doc", roles: ["dev"] },
      { title: "开发自查清单", href: "docs/NDRP名单定期同步-开发自查清单.html", type: "doc", roles: ["dev"] },
      { title: "后台操作手册", href: "docs/NDRP名单定期同步-后台操作手册.html", type: "doc", roles: ["opr"] },
      { title: "客服QA", href: "docs/NDRP名单定期同步-客服QA.html", type: "doc", roles: ["opr"] },
      { title: "需求修改总结", href: "docs/NDRP名单定期同步-需求修改总结.html", type: "doc", roles: ["opr"] },
      { title: "运营需求确认", href: "docs/NDRP名单定期同步-运营需求确认.html", type: "doc", roles: ["opr"] },
      { title: "文案确认", href: "docs/NDRP名单定期同步-文案确认.html", type: "doc", roles: ["opr"] }
    ]}
  ]
};
window.PROTO_LANG = "en";   /* 发布站点的前台原型画面显示英文（assets/proto-en.js，需求包框架规范第 4 节「原型语言」） */
window.PROTO_PUBLISH = true;   /* 发布站点的后台原型只显示运营操作的页面，规则批注、模拟面板、需求说明不显示（需求包框架规范第 4 节） */
