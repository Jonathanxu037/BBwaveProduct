/* 目录数据只维护这一份；路径相对于包根目录。一行只写一个目录项（build_role_sites.ps1 按行读取）。
   type：page = 前台页面，admin = 后台页面，doc = 文档。不要改成 JSON + fetch（本地双击打开会被拦截）。
   roles：除产品（pdm，能看所有页面）外，还有哪些角色能看；不写表示所有角色都能看。opr = 运营，dev = 开发，repo = 报告。
   多迭代结构（需求包框架规范第 3 节「多迭代需求包」）：v1.0 迅速版 + 完整需求（文件夹 full）。 */
window.NAV_DATA = {
  role: "pdm",   /* 发布站点的角色：产品 */
  title: "游戏页侧栏圣诞闯关入口（v1.0）", href: "index.html",
  api: "https://oc-feedback.jonathanxu037.workers.dev", oprKey: "opr-7e295e9a66a7f703410b6d0465a447d00dc311f40eb66150",   /* 云端存储接口和运营写入口令；用 .claude/tools/set_cloud_api.ps1 修改 */
  gate: { salt: "5f202a3109204c31149af70c1e39d0f7", hash: "8235a12748d17c8d8bf9661c8708d27a28b080b4738427d22272cb51dbb63faf" },   /* 产品入口密码（只存哈希，不存明文）；用 .claude/tools/set_pdm_password.ps1 修改 */
  siteTag: "789Bingo",   /* 只针对老站（需求包框架规范第 3.2 节） */
  showChanges: false,   /* 运营需求确认页是否显示原型修改标注（需求包框架规范第 6.1 节） */
  roles: [],   /* 入口页「需求与原型中心」只有产品能看 */
  home: { opr: "docs/v1.0/游戏页侧栏圣诞闯关入口-需求修改总结.html", dev: "docs/v1.0/游戏页侧栏圣诞闯关入口-需求要点.html", repo: "docs/v1.0/游戏页侧栏圣诞闯关入口-需求开发PRD文档.html" },   /* 各角色默认页指向最新迭代 v1.0；产品是入口页 */
  children: [
    { title: "版本规划", desc: "plan", href: "prototype/v1.0/front/游戏页侧栏圣诞闯关入口-游戏页浮动侧栏.html", bar: "#D8242F", children: [
      { title: "v1.0 迭代", desc: "迅速版：只认圣诞这一期，先上线", href: "prototype/v1.0/front/游戏页侧栏圣诞闯关入口-游戏页浮动侧栏.html", bar: "#E8C06A", children: [
          { title: "原型页面", href: "prototype/v1.0/front/游戏页侧栏圣诞闯关入口-游戏页浮动侧栏.html", children: [
            { title: "前台页面", href: "prototype/v1.0/front/游戏页侧栏圣诞闯关入口-游戏页浮动侧栏.html", children: [
              { title: "游戏页浮动侧栏", href: "prototype/v1.0/front/游戏页侧栏圣诞闯关入口-游戏页浮动侧栏.html", type: "page" },
              { title: "活动落地页跳转示意", href: "prototype/v1.0/front/游戏页侧栏圣诞闯关入口-活动落地页跳转示意.html", type: "page" }
            ]}
          ]},
          { title: "需求文档", href: "docs/v1.0/游戏页侧栏圣诞闯关入口-需求要点.html", children: [
            { title: "开发文档", href: "docs/v1.0/游戏页侧栏圣诞闯关入口-需求要点.html", children: [
              { title: "需求要点", href: "docs/v1.0/游戏页侧栏圣诞闯关入口-需求要点.html", type: "doc", roles: ["dev"] },
              { title: "需求开发PRD文档", href: "docs/v1.0/游戏页侧栏圣诞闯关入口-需求开发PRD文档.html", type: "doc", roles: ["dev", "repo"] },
              { title: "开发自查清单", href: "docs/v1.0/游戏页侧栏圣诞闯关入口-开发自查清单.html", type: "doc", roles: ["dev"] }
            ]},
            { title: "运营文档", href: "docs/v1.0/游戏页侧栏圣诞闯关入口-需求修改总结.html", children: [
              { title: "需求修改总结", href: "docs/v1.0/游戏页侧栏圣诞闯关入口-需求修改总结.html", type: "doc", roles: ["opr"] },
              { title: "运营需求确认", href: "docs/v1.0/游戏页侧栏圣诞闯关入口-运营需求确认.html", type: "doc", roles: ["opr"] },
              { title: "文案确认", href: "docs/v1.0/游戏页侧栏圣诞闯关入口-文案确认.html", type: "doc", roles: ["opr"] },
              { title: "客服QA", href: "docs/v1.0/游戏页侧栏圣诞闯关入口-客服QA.html", type: "doc", roles: ["opr"] }
            ]}
          ]}
      ]},
      { title: "完整需求", roles: [], desc: "完整版：适用所有期，带后台设置页，以后排期", href: "prototype/full/front/游戏页侧栏圣诞闯关入口-游戏页浮动侧栏.html", bar: "#E8C06A", children: [
          { title: "原型页面", href: "prototype/full/front/游戏页侧栏圣诞闯关入口-游戏页浮动侧栏.html", children: [
            { title: "前台页面", href: "prototype/full/front/游戏页侧栏圣诞闯关入口-游戏页浮动侧栏.html", children: [
              { title: "游戏页浮动侧栏", href: "prototype/full/front/游戏页侧栏圣诞闯关入口-游戏页浮动侧栏.html", type: "page" },
              { title: "活动落地页跳转示意", href: "prototype/full/front/游戏页侧栏圣诞闯关入口-活动落地页跳转示意.html", type: "page" }
            ]},
            { title: "后台页面", href: "prototype/full/admin/游戏页侧栏圣诞闯关入口-后台游戏页侧栏入口设置.html", children: [
              { title: "后台游戏页侧栏入口设置", href: "prototype/full/admin/游戏页侧栏圣诞闯关入口-后台游戏页侧栏入口设置.html", type: "admin" }
            ]}
          ]},
          { title: "需求文档", href: "docs/full/游戏页侧栏圣诞闯关入口-需求要点.html", children: [
            { title: "开发文档", href: "docs/full/游戏页侧栏圣诞闯关入口-需求要点.html", children: [
              { title: "需求要点", href: "docs/full/游戏页侧栏圣诞闯关入口-需求要点.html", type: "doc", roles: ["dev"] },
              { title: "需求开发PRD文档", href: "docs/full/游戏页侧栏圣诞闯关入口-需求开发PRD文档.html", type: "doc", roles: ["dev", "repo"] },
              { title: "开发自查清单", href: "docs/full/游戏页侧栏圣诞闯关入口-开发自查清单.html", type: "doc", roles: ["dev"] }
            ]},
            { title: "运营文档", href: "docs/full/游戏页侧栏圣诞闯关入口-需求修改总结.html", children: [
              { title: "需求修改总结", href: "docs/full/游戏页侧栏圣诞闯关入口-需求修改总结.html", type: "doc", roles: ["opr"] },
              { title: "运营需求确认", href: "docs/full/游戏页侧栏圣诞闯关入口-运营需求确认.html", type: "doc", roles: ["opr"] },
              { title: "文案确认", href: "docs/full/游戏页侧栏圣诞闯关入口-文案确认.html", type: "doc", roles: ["opr"] },
              { title: "后台操作手册", href: "docs/full/游戏页侧栏圣诞闯关入口-后台操作手册.html", type: "doc", roles: ["opr"] },
              { title: "客服QA", href: "docs/full/游戏页侧栏圣诞闯关入口-客服QA.html", type: "doc", roles: ["opr"] }
            ]}
          ]}
      ]}
    ]}
  ]
};
window.PROTO_LANG = "en";   /* 发布站点的前台原型画面显示英文（assets/proto-en.js，需求包框架规范第 4 节「原型语言」） */
window.PROTO_PUBLISH = true;   /* 发布站点的后台原型只显示运营操作的页面，规则批注、模拟面板、需求说明不显示（需求包框架规范第 4 节） */
