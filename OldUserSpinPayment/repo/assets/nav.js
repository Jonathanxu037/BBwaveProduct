/* 外壳：左侧四级目录栏 + 顶栏。读取 window.NAV_DATA，每个页面自动生成。
   页面在引入本文件前设置 window.NAV_ROOT（到包根目录的相对路径，如 "../../"）。
   被嵌入（如自查清单右栏里的 PRD）时不生成外壳。 */
(function () {
  var ROOT = window.NAV_ROOT || "";
  var DATA = window.NAV_DATA;
  if (!DATA) return;
  var embedded = window.self !== window.top;

  /* 角色权限：访问链接带 ?role=pdm（产品）/ opr（运营）/ dev（开发）。
     第一次带参数打开后记在本机浏览器，之后在包内跳转不用再带；换一个链接打开会覆盖。
     目录节点写 roles: ["opr"] 之类，表示除产品外只有这些角色能看；不写 roles 表示所有角色都能看。
     产品（pdm）能看所有页面。没带角色时只能看不写 roles 的公共页面。
     注意：静态页面没有登录，这只是页面上的区分，不是真正的权限控制。 */
  function norm(p) { p = decodeURIComponent(p); return /\/$/.test(p) ? p + "index.html" : p; }
  function absPath(href) { return norm(new URL(ROOT + href.split("#")[0], location.href).pathname); }
  var here = norm(location.pathname);

  var ROLE_NAMES = { pdm: "产品", opr: "运营", dev: "开发", repo: "报告" };
  var BRAND = { pdm: "需求与原型中心", opr: "运营需求中心", dev: "开发需求中心", repo: "需求报告中心" };
  /* REAL：访问者的真实角色。发布后的角色站点（pdm/、opr/、dev/）在 nav-data.js 里写死 role，以它为准 */
  /* 没有分身份的链接（不带 ?role=、也不是角色站点，即本地源文件夹预览）：
     先用本标签页记住的角色（sessionStorage，每个标签页单独保存，不会被其他标签页或其他对话改掉），
     再用这台电脑上次使用的角色（localStorage，只给新开的标签页用），都没有时按产品角色（要输密码） */
  var FIXED_ROLE = !!(DATA && ROLE_NAMES[DATA.role]);
  var REAL = (function () {
    var r = "";
    if (FIXED_ROLE) r = DATA.role;
    else {
      var m = /[?&]role=(pdm|opr|dev|repo)(?:&|$)/.exec(location.search); r = m ? m[1] : "";
      if (!r) { try { r = sessionStorage.getItem("req-role-tab") || ""; } catch (e) {} }
      if (!r) { try { r = localStorage.getItem("req-role") || ""; } catch (e) {} }
    }
    if (!ROLE_NAMES[r]) r = "pdm";
    if (!FIXED_ROLE) { try { sessionStorage.setItem("req-role-tab", r); } catch (e) {} }   /* 本标签页的角色 */
    try { localStorage.setItem("req-role", r); } catch (e) {}   /* 记下本机最近使用的角色 */
    return r;
  })();
  /* 本地源文件夹预览时，点击站内链接自动带上当前角色（?role=），点到哪一页都保持原来的角色；发布后的角色站点不需要 */
  if (!FIXED_ROLE) {
    document.addEventListener("click", function (e) {
      var a = e.target && e.target.closest ? e.target.closest("a[href]") : null;
      if (!a) return;
      var u; try { u = new URL(a.getAttribute("href"), location.href); } catch (x) { return; }
      if (u.origin !== location.origin || !/\.html?$|\/$/.test(u.pathname)) return;
      if (u.pathname === location.pathname && u.hash && !u.search) return;   /* 同页锚点不处理 */
      u.searchParams.set("role", REAL); a.href = u.href;
    }, true);
  }
  /* 产品入口密码：真实角色是产品、且 nav-data 设了 gate（盐 + SHA-256 哈希，不存明文）时，先输入密码；
     本标签页验证通过后不再询问。注意：静态页面的密码只能挡住随手打开，不能防止有人直接读取页面文件。 */
  var GATE = REAL === "pdm" && !embedded && DATA.gate && DATA.gate.hash ? DATA.gate : null;
  var GATE_KEY = GATE ? "req-pdm-ok-" + GATE.hash.slice(0, 16) : "";
  function gateOk() { try { return sessionStorage.getItem(GATE_KEY) === "1"; } catch (e) { return false; } }
  if (GATE && !gateOk()) {
    document.documentElement.classList.add("gate-lock");
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", showGate); else showGate();
  }
  function showGate() {
    var g = document.createElement("div"); g.className = "pdm-gate"; g.setAttribute("role", "dialog"); g.setAttribute("aria-modal", "true"); g.setAttribute("aria-labelledby", "pgT");
    g.innerHTML = '<form class="pdm-gate-box" autocomplete="off"><div class="k">789BINGO</div><h1 id="pgT"></h1><p>请输入访问密码</p>' +
      '<input type="password" inputmode="numeric" autocomplete="current-password" aria-label="访问密码" maxlength="64"><div class="err" role="alert"></div>' +
      '<button type="submit">进入</button><p class="pg-tip">密码请向该需求的产品管理人获取。</p></form>';
    /* 标题：<当前需求名称>-产品管理（需求名称取目录根节点标题，去掉版本号） */
    g.querySelector("#pgT").textContent = String(DATA.title || "").replace(/\s*[（(]v[\d.]+[）)]\s*$/, "") + "-产品管理";
    document.body.appendChild(g);
    var inp = g.querySelector("input"), err = g.querySelector(".err"), btn = g.querySelector("button"), fails = 0;
    inp.focus();
    g.querySelector("form").onsubmit = function (e) {
      e.preventDefault();
      var v = inp.value; if (!v) { err.textContent = "请输入密码"; return; }
      if (!(window.crypto && crypto.subtle)) { err.textContent = "当前浏览器环境无法校验密码，请用 https 地址或本地预览地址打开"; return; }
      btn.disabled = true;
      crypto.subtle.digest("SHA-256", new TextEncoder().encode(GATE.salt + v)).then(function (buf) {
        var hex = Array.prototype.map.call(new Uint8Array(buf), function (b) { return ("0" + b.toString(16)).slice(-2); }).join("");
        if (hex === GATE.hash) {
          try { sessionStorage.setItem(GATE_KEY, "1"); sessionStorage.setItem("req-pdm-key", v); } catch (x) {}   /* 产品密码只留在本标签页，用于向云端证明产品身份 */
          g.remove(); document.documentElement.classList.remove("gate-lock");
          window.dispatchEvent(new Event("pdm-unlocked"));   /* 通知页面：已拿到产品身份，可以读写云端 */
          return;
        }
        fails++; inp.value = ""; inp.focus();
        if (fails >= 5) {
          err.textContent = "密码错误次数过多，请 30 秒后再试";
          setTimeout(function () { fails = 0; btn.disabled = false; err.textContent = ""; }, 30000);
        } else { err.textContent = "密码不正确，请重新输入"; btn.disabled = false; }
      });
    };
  }

  /* ROLE：当前按哪个角色显示。产品可以在顶栏随时切换成运营、开发或报告的视角（只在本标签页有效）；运营和开发不能切换 */
  var ROLE = REAL;
  if (REAL === "pdm") { try { var vr = sessionStorage.getItem("req-view-role"); if (ROLE_NAMES[vr]) ROLE = vr; } catch (e) {} }
  function can(n) { return ROLE === "pdm" || !n.roles || (!!ROLE && n.roles.indexOf(ROLE) >= 0); }
  /* 各角色的默认页：只有产品是入口页「需求与原型中心」；运营、开发的默认页写在 nav-data 的 home 里。
     非产品角色（含产品切换成的视角）打开入口页时，直接跳到该角色的默认页 */
  function homeOf(r) { r = r || ROLE; return (r && r !== "pdm" && DATA.home && DATA.home[r]) || DATA.href; }
  if (!embedded && homeOf() !== DATA.href && absPath(DATA.href) === here) { location.replace(ROOT + homeOf()); return; }

  var all = [];
  (function walk(n, level, parent) {
    n.level = level; n.parent = parent; n.idx = all.length; all.push(n);
    (n.children || []).forEach(function (c) { walk(c, level + 1, n); });
  })(DATA, 1, null);

  var current = null;
  all.forEach(function (n) {
    if (n.href && n.href.indexOf("#") < 0 && absPath(n.href) === here && (!current || n.level > current.level)) current = n;
  });
  /* 「项」按页面和文档计数；PRD 章节锚点不计 */
  function leafCount(n) { if (!can(n)) return 0; return n.type || !n.children ? 1 : n.children.reduce(function (s, c) { return s + leafCount(c); }, 0); }
  /* 当前角色能看到的节点：自己有权限，并且分组下至少有一项能看 */
  function visible(n) { return can(n) && (n.type || !n.children || leafCount(n) > 0); }
  /* 分组的链接指向当前角色看不到的页面时，改指向分组里第一个能看的页面 */
  var pageOf = {};
  all.forEach(function (n) { if (n.type && n.href) pageOf[n.href.split("#")[0]] = n; });
  function hrefOf(n) {
    if (n === DATA) return homeOf();
    if (!n.href || n.type) return n.href;
    var p = pageOf[n.href.split("#")[0]];
    if (!p || visible(p)) return n.href;
    var first = null;
    (function f(x) { if (first) return; if (x.type && x.href && visible(x)) { first = x.href; return; } (x.children || []).forEach(function (c) { if (visible(c)) f(c); }); })(n);
    return first || n.href;
  }
  /* 默认展开：一级、二级栏目常开；另外只展开当前页面所在的那一条（点到哪一级，就展开那一级的列表） */
  var KEEP = 2;
  function defaultOpen() {
    var o = {};
    all.forEach(function (n) { if (n.level <= KEEP) o[n.idx] = true; });
    for (var n = current; n; n = n.parent) o[n.idx] = true;
    return o;
  }

  /* 生成一棵目录树（侧栏和入口页共用） */
  function buildTree(container, opts) {
    opts = opts || {};
    var open = opts.allOpen ? null : defaultOpen();
    var lis = [];
    function li(n) {
      var el = document.createElement("li");
      var isOpen = open ? !!open[n.idx] : true;
      if (n.children && !isOpen) el.className = "closed";
      var row = document.createElement("div");
      row.className = "sn-row" + (n.children && !n.type ? " grp" : "") + (n === current && !opts.light ? " cur" : "");
      var tw = document.createElement("button");
      tw.type = "button"; tw.className = "sn-tw" + (n.children ? (isOpen ? " open" : "") : " leaf");
      tw.textContent = "▶"; tw.setAttribute("aria-label", "展开或收起");
      tw.onclick = function () { if (el.classList.contains("closed")) expand(el); else setOpen(el, false); };
      var a = document.createElement("a");
      if (n.href) a.href = ROOT + hrefOf(n);
      if (n.bar) row.style.setProperty("--bar", n.bar);
      if (n.type) { var t = document.createElement("span"); t.className = "tg " + n.type; t.textContent = { page: "页面", admin: "后台", doc: "文档" }[n.type]; a.appendChild(t); }
      var nm = document.createElement("span"); nm.className = "nm"; nm.textContent = n.title; a.appendChild(nm);
      if (n.children && !n.type && n.level > 1) { var ct = document.createElement("span"); ct.className = "ct"; ct.textContent = leafCount(n) + " 项"; a.appendChild(ct); }
      a.onclick = function () { if (n.children) expand(el); document.body.classList.remove("nav-open"); };
      if (n === current && !opts.light) a.setAttribute("aria-current", "page");
      row.appendChild(tw); row.appendChild(a); el.appendChild(row);
      n["el" + (opts.light ? "L" : "")] = row;
      if (n.children) {
        var ul = document.createElement("ul");
        n.children.forEach(function (c) { if (visible(c)) ul.appendChild(li(c)); });
        el.appendChild(ul);
      }
      el.dataset.text = n.title; el.dataset.idx = n.idx; lis.push(el);
      return el;
    }
    function setOpen(el, on) {
      el.classList.toggle("closed", !on);
      var tw = el.querySelector(":scope > .sn-row > .sn-tw");
      if (tw && !tw.classList.contains("leaf")) tw.classList.toggle("open", on);
    }
    /* 点到某个栏目：只展开它自己的下一级列表；
       三级及以下的其他栏目（包括它自己的子栏目）全部收起；一级、二级栏目保持常开 */
    function lv(el) { return all[el.dataset.idx].level; }
    function expand(el) {
      lis.forEach(function (d) {
        if (d === el || !d.querySelector(":scope > ul")) return;
        if (lv(d) <= KEEP) { setOpen(d, true); return; }
        if (d.contains(el)) return;   /* 它的上级保持展开 */
        setOpen(d, false);
      });
      setOpen(el, true);
    }
    var ul = document.createElement("ul");
    ul.appendChild(li(DATA));
    container.appendChild(ul);
    return {
      expandAll: function () { lis.forEach(function (el) { if (el.querySelector(":scope > ul")) setOpen(el, true); }); },
      collapseAll: function () { lis.forEach(function (el) { if (el.querySelector(":scope > ul")) setOpen(el, lv(el) <= KEEP); }); },
      reset: function () { var o = defaultOpen(); lis.forEach(function (el) { if (el.querySelector(":scope > ul")) setOpen(el, !!o[el.dataset.idx]); }); },
      filter: function (q) {
        q = q.trim().toLowerCase();
        lis.forEach(function (el) { el.hidden = false; });
        if (!q) return true;
        var any = false;
        lis.slice().reverse().forEach(function (el) {
          var self = el.dataset.text.toLowerCase().indexOf(q) >= 0;
          var kid = [].some.call(el.querySelectorAll(":scope > ul > li"), function (c) { return !c.hidden; });
          el.hidden = !(self || kid);
          if (kid) setOpen(el, true);
          if (self) any = true;
        });
        return any;
      }
    };
  }
  window.NAV = { buildTree: buildTree, data: DATA, current: function () { return current; }, role: ROLE, realRole: REAL, roleName: ROLE_NAMES[ROLE] || "", can: can };

  if (embedded) { document.documentElement.classList.add("embedded"); document.addEventListener("DOMContentLoaded", function () { document.body.classList.add("embedded"); }); return; }

  function mount() {
    /* 目录栏 */
    var aside = document.createElement("aside");
    aside.className = "sidenav"; aside.setAttribute("aria-label", "目录");
    aside.innerHTML = '<div class="sn-brand"><div class="k">789BINGO</div><div class="t">' + (BRAND[ROLE] || "需求中心") + '</div></div>' +
      '<div class="sn-tools"><input type="search" placeholder="搜索当前需求下的页" aria-label="搜索目录"><button type="button" data-a="all">全部展开</button><button type="button" data-a="reset">恢复默认</button></div>' +
      '<div class="sn-tree"></div>';
    var treeBox = aside.querySelector(".sn-tree");
    var tree = buildTree(treeBox, {});
    var empty = document.createElement("div"); empty.className = "sn-empty"; empty.textContent = "没有匹配的页面"; empty.hidden = true; treeBox.appendChild(empty);
    aside.querySelector("input").addEventListener("input", function () { empty.hidden = tree.filter(this.value) !== false; });
    aside.querySelector('[data-a="all"]').onclick = function () { tree.expandAll(); };
    aside.querySelector('[data-a="reset"]').onclick = function () { aside.querySelector("input").value = ""; tree.filter(""); empty.hidden = true; tree.reset(); };
    var mask = document.createElement("div"); mask.className = "navmask";
    mask.onclick = function () { document.body.classList.remove("nav-open"); };
    /* 目录栏右上角「隐藏」；隐藏后顶栏左侧只留「展开目录」按钮 */
    var hide = document.createElement("button"); hide.type = "button"; hide.className = "sn-hide"; hide.textContent = "« 隐藏";
    hide.title = "隐藏目录栏"; hide.setAttribute("aria-label", "隐藏目录栏");
    hide.onclick = function () { setNav(false); };
    aside.querySelector(".sn-brand").appendChild(hide);

    /* 顶栏：面包屑 + 右侧按钮 */
    var bar = document.createElement("div"); bar.className = "topbar";
    var menu = document.createElement("button"); menu.type = "button"; menu.className = "tb-btn tb-menu"; menu.textContent = "☰ 目录";
    menu.onclick = function () { document.body.classList.toggle("nav-open"); };
    bar.appendChild(menu);
    var ex = document.createElement("button"); ex.type = "button"; ex.className = "tb-btn tb-expand"; ex.textContent = "☰ 展开目录";
    ex.setAttribute("aria-label", "展开目录栏");
    ex.onclick = function () { setNav(true); };
    bar.appendChild(ex);
    (window.NAV_TOP_LEFT || []).forEach(function (b) { bar.appendChild(b); });
    var crumb = document.createElement("div"); crumb.className = "crumb";
    var path = []; for (var n = current; n; n = n.parent) path.unshift(n.title);
    crumb.innerHTML = path.map(function (t, i) { var s = t.replace(/[<>&]/g, ""); return i === path.length - 1 ? "<b>" + s + "</b>" : s; }).join(" › ");
    bar.appendChild(crumb);
    var rc;
    if (REAL === "pdm") {
      /* 产品：角色标签是下拉框，可随时切换成运营、开发或报告的视角，切换后跳到该角色的默认页 */
      rc = document.createElement("select"); rc.className = "tb-role r-" + ROLE; rc.setAttribute("aria-label", "切换查看角色");
      rc.title = "产品可以切换成运营、开发或报告的视角，查看他们看到的页面";
      ["pdm", "opr", "dev", "repo"].forEach(function (r) { var o = document.createElement("option"); o.value = r; o.textContent = "角色：" + ROLE_NAMES[r] + (r === "pdm" ? "" : "（视角）"); if (r === ROLE) o.selected = true; rc.appendChild(o); });
      rc.onchange = function () {
        try { if (rc.value === "pdm") sessionStorage.removeItem("req-view-role"); else sessionStorage.setItem("req-view-role", rc.value); } catch (e) {}
        location.href = ROOT + homeOf(rc.value);
      };
    } else {
      rc = document.createElement("span"); rc.className = "tb-role r-" + (ROLE || "none");
      rc.textContent = ROLE ? "角色：" + ROLE_NAMES[ROLE] : "未指定角色";
      rc.title = ROLE ? "按「" + ROLE_NAMES[ROLE] + "」角色显示可访问的页面" : "没有用角色访问链接打开，只显示公共页面";
    }
    bar.appendChild(rc);
    var nw = document.createElement("a"); nw.className = "tb-btn tb-newwin"; nw.href = location.href; nw.target = "_blank"; nw.rel = "noopener";
    nw.textContent = window.NAV_NEWWIN_TEXT || "新窗口打开 ↗";
    bar.appendChild(nw);

    document.body.insertBefore(mask, document.body.firstChild);
    document.body.insertBefore(aside, document.body.firstChild);
    var main = document.querySelector(".with-nav");
    if (main) main.insertBefore(bar, main.firstChild);
    if (current && current.el) current.el.scrollIntoView({ block: "center" });
    if (current && !can(current)) deny(main, bar); else { unlinkHidden(); trackSections(); }
  }

  /* 正文里指向当前角色看不到的页面的链接，改成普通文字（发布站点里这些页面已删除，脚本 build_role_sites.ps1 也会同样处理） */
  function unlinkHidden() {
    var hidden = {};
    all.forEach(function (n) { if (n.type && n.href && !visible(n)) hidden[absPath(n.href)] = true; });
    document.querySelectorAll(".with-nav a[href]").forEach(function (a) {
      if (a.closest(".topbar")) return;
      var u; try { u = new URL(a.getAttribute("href"), location.href); } catch (e) { return; }
      if (u.origin !== location.origin || !hidden[norm(u.pathname)]) return;
      var s = document.createElement("span"); s.className = "link-off"; s.textContent = a.textContent.replace(/\s*[›↗]\s*$/, "");
      s.title = "当前角色不能查看这个页面";
      a.replaceWith(s);
    });
  }

  /* 当前角色无权查看本页：清掉正文，只留提示和可访问页面的链接 */
  function deny(main, bar) {
    document.body.classList.remove("nav-collapsed");
    document.body.classList.add("role-denied");
    if (!main) return;
    [].slice.call(main.children).forEach(function (c) { if (c !== bar) c.remove(); });
    var links = all.filter(function (n) { return n.type && n.href && visible(n) && n.href.indexOf("#") < 0; })
      .map(function (n) { var a = document.createElement("a"); a.href = ROOT + n.href; a.textContent = n.title + " ›"; return a; });
    var box = document.createElement("div"); box.className = "oc-deny";
    box.innerHTML = '<div class="oc-deny-box"><div class="k">无权访问</div><h1></h1><p></p><p class="oc-deny-links"></p></div>';
    box.querySelector("h1").textContent = "「" + (current.title || "本页") + "」" + (ROLE ? "不对" + ROLE_NAMES[ROLE] + "角色开放" : "需要用角色访问链接打开");
    box.querySelector("p").textContent = ROLE ? "你可以查看以下页面：" : "请使用发给你的访问链接打开；目前可以查看以下公共页面：";
    links.forEach(function (a) { box.querySelector(".oc-deny-links").appendChild(a); });
    main.appendChild(box);
  }

  /* 同一页面的章节（带 #）：按滚动位置高亮 */
  function trackSections() {
    var secs = all.filter(function (n) { return n.href && n.href.indexOf("#") > 0 && absPath(n.href) === here && n.el; });
    if (!secs.length) return;
    function update() {
      var y = window.scrollY + 120, hit = null;
      secs.forEach(function (n) { var el = document.getElementById(n.href.split("#")[1]); if (el && el.getBoundingClientRect().top + window.scrollY <= y) hit = n; });
      secs.forEach(function (n) { n.el.classList.toggle("cur-sec", n === hit); });
    }
    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  /* 显示或隐藏目录栏。手机宽度下目录栏本来就是弹出式，只开关弹层。
     页面设置 window.NAV_AUTO_HIDE = true 时，打开页面默认隐藏（如运营需求确认页，要看原型的全部宽度） */
  function setNav(show) {
    if (window.matchMedia("(max-width:819px)").matches) { document.body.classList.toggle("nav-open", show); return; }
    document.body.classList.toggle("nav-collapsed", !show);
    window.dispatchEvent(new Event("navtoggle"));
  }
  window.NAV.setNav = setNav;
  if (window.NAV_AUTO_HIDE) document.body.classList.add("nav-collapsed");

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount); else mount();
})();

/* 后台字段的「?」帮助按钮：点击开关说明；再点一次、点外部或按 Esc 关闭；同一时间只显示一个（规范第十章第 4 节） */
(function () {
  function closeAll(except) { [].forEach.call(document.querySelectorAll(".qm.on"), function (q) { if (q !== except) { q.classList.remove("on"); q.setAttribute("aria-expanded", "false"); } }); }
  document.addEventListener("click", function (e) {
    var q = e.target.closest && e.target.closest(".qm");
    if (!q) return closeAll(null);
    e.preventDefault();
    closeAll(q);
    var on = !q.classList.contains("on");
    q.classList.toggle("on", on); q.setAttribute("aria-expanded", on ? "true" : "false");
  });
  document.addEventListener("keydown", function (e) {
    var q = e.target.closest && e.target.closest(".qm");
    if (e.key === "Escape") return closeAll(null);
    if (q && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); q.click(); }
  });
})();