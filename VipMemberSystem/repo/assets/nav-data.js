/* 目录数据只维护这一份；路径相对于包根目录。复制模板后按本需求改写（见模板 README）。
   type：page = 前台页面，admin = 后台页面，doc = 文档。不要改成 JSON + fetch（本地双击打开会被拦截）。
   roles：除产品（pdm，能看所有页面）外，还有哪些角色能看；不写表示所有角色都能看。opr = 运营，dev = 开发，repo = 报告。
   需求不涉及前台或后台时，删掉对应的三级目录和原型文件；不涉及后台时删掉「后台操作手册」。 */
window.NAV_DATA = {
  role: "repo",   /* 发布站点的角色：报告 */
  title: "VIP会员体系（v1.2）", href: "index.html",
  showChanges: false,   /* 运营需求确认页是否显示原型修改标注（版本痕迹）：默认 false 不显示，需要时改成 true（需求包框架规范第 6.1 节） */
  roles: [],   /* 入口页「需求与原型中心」只有产品能看 */
  home: { opr: "docs/v1.2/VIP会员体系-需求修改总结.html", dev: "docs/v1.2/VIP会员体系-需求要点.html", repo: "docs/v1.2/VIP会员体系-需求开发PRD文档.html" },   /* 各角色打开后的默认页；产品是入口页。2026-10-27 v1.0、v1.1、完整需求已移入「版本规划 › 历史版本」封存，只有产品可看；同日新建 v1.2 迭代，默认页改为 v1.2 的页面 */
  children: [
    { title: "版本规划", href: "prototype/v1.2/front/VIP会员体系-VIP中心页面.html", bar: "#D8242F", children: [
      { title: "v1.2 迭代", href: "prototype/v1.2/front/VIP会员体系-VIP中心页面.html", bar: "#E8C06A", children: [
          { title: "原型页面", href: "prototype/v1.2/front/VIP会员体系-VIP中心页面.html", children: [
            { title: "前台页面", href: "prototype/v1.2/front/VIP会员体系-VIP中心页面.html", children: [
              { title: "VIP中心页面", href: "prototype/v1.2/front/VIP会员体系-VIP中心页面.html", type: "page" },
              { title: "VIP通知页面", href: "prototype/v1.2/front/VIP会员体系-VIP通知页面.html", type: "page" }
            ]},
            { title: "后台页面", href: "prototype/v1.2/admin/VIP会员体系-后台VIP配置页面.html", children: [
              { title: "后台VIP会员等级配置页面", href: "prototype/v1.2/admin/VIP会员体系-后台VIP配置页面.html", type: "admin" }   /* 2026-10-28 按现网【用户管理 › 会员等级】三个页签重做，合并为一个页面；文件名沿用以保留已有链接和运营意见；2026-10-29 名称统一为「后台VIP会员等级配置页面」 */
            ]}
          ]},
          { title: "需求文档", href: "docs/v1.2/VIP会员体系-需求要点.html", children: [
            { title: "开发文档", href: "docs/v1.2/VIP会员体系-需求要点.html", children: [
              { title: "需求要点", href: "docs/v1.2/VIP会员体系-需求要点.html", type: "doc", roles: ["dev"] },
              { title: "需求开发PRD文档", href: "docs/v1.2/VIP会员体系-需求开发PRD文档.html", type: "doc", roles: ["dev", "repo"] },
              { title: "开发自查清单", href: "docs/v1.2/VIP会员体系-开发自查清单.html", type: "doc", roles: ["dev"] }
            ]},
            { title: "运营文档", href: "docs/v1.2/VIP会员体系-需求修改总结.html", children: [
              { title: "需求修改总结", href: "docs/v1.2/VIP会员体系-需求修改总结.html", type: "doc", roles: ["opr"] },
              { title: "运营需求确认", href: "docs/v1.2/VIP会员体系-运营需求确认.html", type: "doc", roles: ["opr"] },
              { title: "文案确认", href: "docs/v1.2/VIP会员体系-文案确认.html", type: "doc", roles: ["opr"] },
              { title: "后台操作手册", href: "docs/v1.2/VIP会员体系-后台操作手册.html", type: "doc", roles: ["opr"] },
              { title: "客服QA", href: "docs/v1.2/VIP会员体系-客服QA.html", type: "doc", roles: ["opr"] },
              { title: "需求问题", href: "docs/v1.2/VIP会员体系-需求问题.html", type: "doc", roles: ["opr"] }
            ]},
            { title: "文档资料", href: "docs/v1.2/VIP会员体系-等级规则推演.html", roles: ["opr"], children: [   /* 2026-10-29 新建，只有产品和运营可看 */
              { title: "等级规则推演", href: "docs/v1.2/VIP会员体系-等级规则推演.html", type: "doc", roles: ["opr"] }   /* 升级、保级、降级、恢复规则与情况推演、风险分析 */
            ]}
          ]}
      ]},
      { title: "历史版本", desc: "封存于 2026-10-27", href: "prototype/v1.0/front/VIP会员体系-VIP中心页面.html", bar: "#9AA0A6", roles: [], children: [
        { title: "v1.0 迭代", href: "prototype/v1.0/front/VIP会员体系-VIP中心页面.html", bar: "#E8C06A", children: [
            { title: "原型页面", href: "prototype/v1.0/front/VIP会员体系-VIP中心页面.html", children: [
              { title: "前台页面", href: "prototype/v1.0/front/VIP会员体系-VIP中心页面.html", children: [
                { title: "VIP中心页面", href: "prototype/v1.0/front/VIP会员体系-VIP中心页面.html", type: "page", roles: [] },
                { title: "VIP通知页面", href: "prototype/v1.0/front/VIP会员体系-VIP通知页面.html", type: "page", roles: [] }
              ]},
              { title: "后台页面", href: "prototype/v1.0/admin/VIP会员体系-后台VIP特权配置页面.html", children: [
                { title: "后台VIP特权配置页面", href: "prototype/v1.0/admin/VIP会员体系-后台VIP特权配置页面.html", type: "admin", roles: [] },
                { title: "后台会员福利页面", href: "prototype/v1.0/admin/VIP会员体系-后台会员福利页面.html", type: "admin", roles: [] },
                { title: "后台VIP数据报表页面", href: "prototype/v1.0/admin/VIP会员体系-后台VIP数据报表页面.html", type: "admin", roles: [] }
              ]}
            ]},
            { title: "需求文档", href: "docs/v1.0/VIP会员体系-需求要点.html", children: [
              { title: "开发文档", href: "docs/v1.0/VIP会员体系-需求要点.html", children: [
                { title: "需求要点", href: "docs/v1.0/VIP会员体系-需求要点.html", type: "doc", roles: [] },
                { title: "需求开发PRD文档", href: "docs/v1.0/VIP会员体系-需求开发PRD文档.html", type: "doc", roles: [] },
                { title: "开发自查清单", href: "docs/v1.0/VIP会员体系-开发自查清单.html", type: "doc", roles: [] }
              ]},
              { title: "运营文档", href: "docs/v1.0/VIP会员体系-需求修改总结.html", children: [
                { title: "需求修改总结", href: "docs/v1.0/VIP会员体系-需求修改总结.html", type: "doc", roles: [] },
                { title: "运营需求确认", href: "docs/v1.0/VIP会员体系-运营需求确认.html", type: "doc", roles: [] },
                { title: "文案确认", href: "docs/v1.0/VIP会员体系-文案确认.html", type: "doc", roles: [] },
                { title: "后台操作手册", href: "docs/v1.0/VIP会员体系-后台操作手册.html", type: "doc", roles: [] },
                { title: "客服QA", href: "docs/v1.0/VIP会员体系-客服QA.html", type: "doc", roles: [] },
                { title: "需求问题", href: "docs/v1.0/VIP会员体系-需求问题.html", type: "doc", roles: [] }
              ]}
            ]}
        ]},
        { title: "v1.1 迭代", href: "prototype/v1.1/front/VIP会员体系-VIP中心页面.html", bar: "#E8C06A", children: [
            { title: "原型页面", href: "prototype/v1.1/front/VIP会员体系-VIP中心页面.html", children: [
              { title: "前台页面", href: "prototype/v1.1/front/VIP会员体系-VIP中心页面.html", children: [
                { title: "VIP中心页面", href: "prototype/v1.1/front/VIP会员体系-VIP中心页面.html", type: "page", roles: [] },
                { title: "VIP通知页面", href: "prototype/v1.1/front/VIP会员体系-VIP通知页面.html", type: "page", roles: [] }
              ]},
              { title: "后台页面", href: "prototype/v1.1/admin/VIP会员体系-后台会员等级配置页面.html", children: [
                { title: "后台会员等级配置页面", href: "prototype/v1.1/admin/VIP会员体系-后台会员等级配置页面.html", type: "admin", roles: [] },
                { title: "后台VIP特权配置页面", href: "prototype/v1.1/admin/VIP会员体系-后台VIP特权配置页面.html", type: "admin", roles: [] },
                { title: "后台会员福利页面", href: "prototype/v1.1/admin/VIP会员体系-后台会员福利页面.html", type: "admin", roles: [] },
                { title: "后台VIP数据报表页面", href: "prototype/v1.1/admin/VIP会员体系-后台VIP数据报表页面.html", type: "admin", roles: [] }
              ]}
            ]},
            { title: "需求文档", href: "docs/v1.1/VIP会员体系-需求要点.html", children: [
              { title: "开发文档", href: "docs/v1.1/VIP会员体系-需求要点.html", children: [
                { title: "需求要点", href: "docs/v1.1/VIP会员体系-需求要点.html", type: "doc", roles: [] },
                { title: "需求开发PRD文档", href: "docs/v1.1/VIP会员体系-需求开发PRD文档.html", type: "doc", roles: [] },
                { title: "开发自查清单", href: "docs/v1.1/VIP会员体系-开发自查清单.html", type: "doc", roles: [] }
              ]},
              { title: "运营文档", href: "docs/v1.1/VIP会员体系-需求修改总结.html", children: [
                { title: "需求修改总结", href: "docs/v1.1/VIP会员体系-需求修改总结.html", type: "doc", roles: [] },
                { title: "运营需求确认", href: "docs/v1.1/VIP会员体系-运营需求确认.html", type: "doc", roles: [] },
                { title: "文案确认", href: "docs/v1.1/VIP会员体系-文案确认.html", type: "doc", roles: [] },
                { title: "后台操作手册", href: "docs/v1.1/VIP会员体系-后台操作手册.html", type: "doc", roles: [] },
                { title: "客服QA", href: "docs/v1.1/VIP会员体系-客服QA.html", type: "doc", roles: [] },
                { title: "需求问题", href: "docs/v1.1/VIP会员体系-需求问题.html", type: "doc", roles: [] }
              ]}
            ]}
        ]},
        { title: "完整需求", desc: "全部功能", href: "prototype/full/front/VIP会员体系-VIP中心页面.html", bar: "#E8C06A", children: [
            { title: "原型页面", href: "prototype/full/front/VIP会员体系-VIP中心页面.html", children: [
              { title: "前台页面", href: "prototype/full/front/VIP会员体系-VIP中心页面.html", children: [
                { title: "VIP中心页面", href: "prototype/full/front/VIP会员体系-VIP中心页面.html", type: "page", roles: [] },
                { title: "VIP通知页面", href: "prototype/full/front/VIP会员体系-VIP通知页面.html", type: "page", roles: [] }
              ]},
              { title: "后台页面", href: "prototype/full/admin/VIP会员体系-后台会员等级配置页面.html", children: [
                { title: "后台会员等级配置页面", href: "prototype/full/admin/VIP会员体系-后台会员等级配置页面.html", type: "admin", roles: [] },
                { title: "后台VIP特权配置页面", href: "prototype/full/admin/VIP会员体系-后台VIP特权配置页面.html", type: "admin", roles: [] },
                { title: "后台会员福利页面", href: "prototype/full/admin/VIP会员体系-后台会员福利页面.html", type: "admin", roles: [] },
                { title: "后台VIP数据报表页面", href: "prototype/full/admin/VIP会员体系-后台VIP数据报表页面.html", type: "admin", roles: [] }
              ]}
            ]},
            { title: "需求文档", href: "docs/full/VIP会员体系-需求要点.html", children: [
              { title: "开发文档", href: "docs/full/VIP会员体系-需求要点.html", children: [
                { title: "需求要点", href: "docs/full/VIP会员体系-需求要点.html", type: "doc", roles: [] },
                { title: "需求开发PRD文档", href: "docs/full/VIP会员体系-需求开发PRD文档.html", type: "doc", roles: [] },
                { title: "开发自查清单", href: "docs/full/VIP会员体系-开发自查清单.html", type: "doc", roles: [] }
              ]},
              { title: "运营文档", href: "docs/full/VIP会员体系-需求修改总结.html", children: [
                { title: "需求修改总结", href: "docs/full/VIP会员体系-需求修改总结.html", type: "doc", roles: [] },
                { title: "运营需求确认", href: "docs/full/VIP会员体系-运营需求确认.html", type: "doc", roles: [] },
                { title: "文案确认", href: "docs/full/VIP会员体系-文案确认.html", type: "doc", roles: [] },
                { title: "后台操作手册", href: "docs/full/VIP会员体系-后台操作手册.html", type: "doc", roles: [] },
                { title: "客服QA", href: "docs/full/VIP会员体系-客服QA.html", type: "doc", roles: [] },
                { title: "需求问题", href: "docs/full/VIP会员体系-需求问题.html", type: "doc", roles: [] }
              ]}
            ]}
        ]}
      ]}
    ]}
  ]
};
window.PROTO_LANG = "en";   /* 发布站点的前台原型画面显示英文（assets/proto-en.js，需求包框架规范第 4 节「原型语言」） */
window.PROTO_PUBLISH = true;   /* 发布站点的后台原型只显示运营操作的页面，规则批注、模拟面板、需求说明不显示（需求包框架规范第 4 节） */
