/* 需求文档架构图：按角色和需求文件画出整体结构，数据全部来自 assets/nav-data.js（页面的 roles、各角色默认页 home）。
   入口页（产品主页）调用 ARCH.render(容器)。新增页面或调整权限时不用改本文件。 */
window.ARCH = (function () {
  var ROLES = [
    { k: "pdm", name: "产品角色", code: "pdm", who: "产品经理、行政管理人员", note: "顶端角色：可看全部页面，顶栏可切换运营、开发视角；进入需输入密码" },
    { k: "opr", name: "运营角色", code: "opr", who: "运营、客服、商务", note: "提出修改意见、配置后台、对外解释规则" },
    { k: "dev", name: "技术开发角色", code: "dev", who: "UI 设计、前端、后端、测试", note: "按需求设计、开发和验证" }
  ];
  var TYPE = { page: "前台", admin: "后台", doc: "文档" };
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function canFor(n, r) { return r === "pdm" || !n.roles || n.roles.indexOf(r) >= 0; }

  function collect(D) {
    var pages = [];
    pages.push({ title: "需求与原型中心（入口页）", href: D.href, type: "home", group: "入口", roles: D.roles });
    (function walk(n, group) {
      (n.children || []).forEach(function (c) {
        var g = n === D ? c.title : group;
        if (c.type && c.href && c.href.indexOf("#") < 0) pages.push({ title: c.title, href: c.href, type: c.type, group: g, roles: c.roles });
        else walk(c, g);
      });
    })(D, "");
    return pages;
  }
  function homeOf(D, r) { return r === "pdm" ? D.href : (D.home && D.home[r]) || D.href; }

  function render(box) {
    var D = window.NAV_DATA, ROOT = window.NAV_ROOT || "";
    if (!box || !D) return;
    var pages = collect(D);
    var name = String(D.title || "").replace(/\s*[（(]v[\d.]+[）)]\s*$/, ""), ver = (/[（(](v[\d.]+)[）)]/.exec(D.title || "") || [])[1] || "";
    function link(p, r) {
      var isHome = homeOf(D, r) === p.href;
      return '<a class="arch-doc t-' + p.type + (isHome ? " home" : "") + '" href="' + esc(ROOT + p.href) + '">' +
        '<span class="arch-tg">' + (p.type === "home" ? "主页" : TYPE[p.type] || "") + "</span>" + esc(p.title) +
        (isHome ? '<span class="arch-def">默认页</span>' : "") + "</a>";
    }
    function lane(r) {
      var mine = pages.filter(function (p) { return canFor(p, r.k); });
      var groups = [];
      mine.forEach(function (p) { if (groups.indexOf(p.group) < 0) groups.push(p.group); });
      return '<div class="arch-lane r-' + r.k + '"><div class="arch-node role"><b>' + r.name + '<code>' + r.code + "</code></b><small>" + esc(r.who) + "</small><em>" + esc(r.note) + "</em>" +
        '<span class="arch-cnt">可访问 ' + mine.length + " 个页面</span></div>" +
        groups.map(function (g) {
          return '<div class="arch-grp"><div class="arch-gt">' + esc(g) + "</div>" + mine.filter(function (p) { return p.group === g; }).map(function (p) { return link(p, r.k); }).join("") + "</div>";
        }).join("") + "</div>";
    }
    var html = '<div class="arch-tree">' +
      '<div class="arch-node pkg"><b>' + esc(name) + (ver ? " · " + esc(ver) : "") + "</b><small>需求包：按角色发布为 pdm / opr / dev 三个站点</small></div>" +
      '<div class="arch-v"></div>' +
      '<div class="arch-lanes">' + ROLES.map(lane).join("") + "</div></div>";

    /* 页面 × 角色对照表 */
    html += '<div class="tbl arch-mx"><table class="mini"><thead><tr><th>页面</th><th>类型</th><th>分组</th>' +
      ROLES.map(function (r) { return "<th>" + r.name.replace("角色", "") + " " + r.code + "</th>"; }).join("") + "</tr></thead><tbody>" +
      pages.map(function (p) {
        return '<tr><td class="w"><a href="' + esc(ROOT + p.href) + '">' + esc(p.title) + "</a></td><td>" + (p.type === "home" ? "主页" : TYPE[p.type] || "") + "</td><td>" + esc(p.group) + "</td>" +
          ROLES.map(function (r) {
            if (!canFor(p, r.k)) return '<td class="no">—</td>';
            return homeOf(D, r.k) === p.href ? '<td class="def">★ 默认页</td>' : '<td class="ok">✓</td>';
          }).join("") + "</tr>";
      }).join("") + "</tbody></table></div>" +
      '<p class="arch-foot">✓ 可访问　★ 打开后的默认页　— 不可访问（该角色站点里没有这个页面）。产品能看全部页面；架构图按目录数据自动生成。</p>';
    box.innerHTML = html;
  }
  return { render: render };
})();
