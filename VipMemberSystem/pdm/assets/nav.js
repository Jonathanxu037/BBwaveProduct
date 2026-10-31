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
      u.searchParams.set("role", REAL);
      /* 发布模式预览（publish）和原型语言（lang）参数也一起带上，跳到别的页面后保持同样的预览方式 */
      ["publish", "lang"].forEach(function (k) { var v = new URLSearchParams(location.search).get(k); if (v && !u.searchParams.has(k)) u.searchParams.set(k, v); });
      a.href = u.href;
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
      var nm = document.createElement("span"); nm.className = "nm"; nm.textContent = n.title; a.appendChild(nm); if (n.desc) { var ds = document.createElement("span"); ds.className = "nd"; ds.textContent = n.desc; a.appendChild(ds); }   /* 目录节点可选的说明小字（多迭代需求包的 plan、latest、前台全量 + 后台精简等），需求包框架规范第 3 节 */
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
    aside.innerHTML = '<div class="sn-brand"><div class="k">789BINGO</div><div class="t"></div></div>' +
      '<div class="sn-tools"><input type="search" placeholder="搜索当前需求下的页" aria-label="搜索目录"><button type="button" data-a="all">全部展开</button><button type="button" data-a="reset">恢复默认</button></div>' +
      '<div class="sn-tree"></div>';
    var treeBox = aside.querySelector(".sn-tree");
    var tree = buildTree(treeBox, {});
    var empty = document.createElement("div"); empty.className = "sn-empty"; empty.textContent = "没有匹配的页面"; empty.hidden = true; treeBox.appendChild(empty);
    aside.querySelector("input").addEventListener("input", function () { empty.hidden = tree.filter(this.value) !== false; });
    aside.querySelector('[data-a="all"]').onclick = function () { tree.expandAll(); };
    aside.querySelector('[data-a="reset"]').onclick = function () { aside.querySelector("input").value = ""; tree.filter(""); empty.hidden = true; tree.reset(); };
    /* 目录栏标题显示需求标题（2026-10-23 用户要求，所有需求通用，需求包框架规范第 3.2 节）：取 nav-data 的 brand；没写时取根节点标题去掉「（v版本号）」；都没有时退回按角色的名称 */
    var reqTitle = String(DATA.brand || DATA.title || "").replace(/\s*[（(]v?\d+(\.\d+)*[)）]\s*$/, "").trim();
    aside.querySelector(".sn-brand .t").textContent = reqTitle || BRAND[ROLE] || "需求中心";
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

/* 后台字段的「?」帮助按钮：点击开关说明；再点一次、点外部或按 Esc 关闭；同一时间只显示一个（需求包框架规范第 4 节） */
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

/* 弹窗右上角关闭图标（所有需求通用，需求包框架规范第 4 节）：原型和通用页面里的 .dlg（前台）、.bo-dlg（后台）、.cfm>div（确认框）
   和带 data-xclose 的弹窗框，缺「×」时自动补上。点「×」等同点弹窗里的取消按钮（data-cancel，没有时找文字为「取消 / 关闭 / Cancel / Close」的按钮），
   不提交；没有取消按钮时直接关掉遮罩。取消按钮置灰（提交中）时「×」同步置灰不可点。页面手写了 .x-close 的不重复添加。 */
(function () {
  var BOX = ".dlg, .bo-dlg, .cfm > div, [data-xclose]";
  var CANCEL = /^(取消|关闭|cancel|close)$/i;
  function cancelBtn(box) {
    var b = box.querySelector("[data-cancel]"); if (b) return b;
    return [].filter.call(box.querySelectorAll("button, a"), function (x) { return !x.classList.contains("x-close") && CANCEL.test((x.textContent || "").replace(/[\s×✕]/g, "")); })[0] || null;
  }
  function overlay(box) { return box.closest(".ov, .bo-mask, .cfm, .oc-modal, [data-xmask]") || box; }
  function sync(box, x) { var c = cancelBtn(box), off = !!(c && (c.disabled || c.getAttribute("aria-disabled") === "true")); if (x.disabled !== off) x.disabled = off; }
  function add(box) {
    if (box.querySelector(":scope > .x-close")) return;
    var x = document.createElement("button"); x.type = "button"; x.className = "x-close"; x.setAttribute("aria-label", "关闭"); x.title = "关闭"; x.textContent = "×";
    x.onclick = function (e) {
      e.preventDefault(); e.stopPropagation(); if (x.disabled) return;
      var c = cancelBtn(box); if (c) { c.click(); return; }
      var m = overlay(box); m.hidden = true; if (getComputedStyle(m).display !== "none") m.remove();   /* 页面里固定的弹窗隐藏，脚本临时生成的弹窗移除 */
    };
    box.insertBefore(x, box.firstChild); sync(box, x);
  }
  function scan(root) {
    if (!root || !root.querySelectorAll) return;
    if (root.matches && root.matches(BOX)) add(root);
    [].forEach.call(root.querySelectorAll(BOX), add);
  }
  function start() {
    scan(document.body);
    new MutationObserver(function (ms) {
      ms.forEach(function (m) {
        if (m.type === "childList") [].forEach.call(m.addedNodes, function (n) { if (n.nodeType === 1 && !n.classList.contains("x-close")) scan(n); });
        else if (!m.target.classList.contains("x-close")) { var box = m.target.closest && m.target.closest(BOX), x = box && box.querySelector(":scope > .x-close"); if (x) sync(box, x); }
      });
    }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["disabled", "aria-disabled"] });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();

/* 原型页右侧批注框（模拟场景、模拟操作、规则批注）默认收起（所有需求通用，需求包框架规范第 4 节）：
   每次打开原型页时批注框都收起，贴在右侧页边只留「‹ 显示」按钮，原型画面占满；点「‹ 显示」展开，
   展开后批注框内右上角有吸顶的「隐藏 ›」按钮，滚动时一直可见，点了再收起。只作用于 .stage / .adm-stage 里的批注框。 */
(function () {
  function start() {
    if (isPubAdmin()) document.body.classList.add("pub-admin");
    var notes = document.querySelector(document.body.classList.contains("pub-admin") ? ".stage > .notes" : ".stage > .notes, .adm-stage > .notes");
    if (!notes || notes.querySelector(".notes-bar")) return;
    if (!notes.id) notes.id = "protoNotes";
    var tab = document.createElement("button"); tab.type = "button"; tab.className = "notes-tab"; tab.textContent = "‹ 显示";
    tab.title = "显示模拟场景、模拟操作和规则批注"; tab.setAttribute("aria-controls", notes.id); tab.setAttribute("aria-expanded", "false");
    var bar = document.createElement("div"); bar.className = "notes-bar";
    var hide = document.createElement("button"); hide.type = "button"; hide.className = "notes-hide"; hide.textContent = "隐藏 ›";
    hide.title = "隐藏批注框，原型画面占满"; hide.setAttribute("aria-controls", notes.id);
    bar.appendChild(hide); notes.insertBefore(bar, notes.firstChild); document.body.appendChild(tab);
    function set(open) {
      document.body.classList.toggle("notes-off", !open);
      tab.hidden = open; tab.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) hide.focus(); else tab.focus({ preventScroll: true });
      window.dispatchEvent(new Event("notestoggle"));
    }
    tab.onclick = function () { set(true); };
    hide.onclick = function () { set(false); };
    document.body.classList.add("notes-off"); tab.hidden = false;
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();

/* 发布时精简后台原型（需求包框架规范第 4 节）：发布站点（window.PROTO_PUBLISH）或本地预览加 ?publish=1 时，后台原型页只显示运营操作的页面本身 */
function isPubAdmin() {
  if (!document.querySelector(".adm-stage")) return false;
  /* ?publish=1 / ?publish=0 在当前标签页里记住，页面脚本跳转（如 P.go）丢了参数也保持同样的预览方式 */
  var q = /[?&]publish=(1|0)\b/.exec(location.search), v = q ? q[1] : null;
  try { if (q) sessionStorage.setItem("proto-publish", v); else v = sessionStorage.getItem("proto-publish"); } catch (e) {}
  return v ? v === "1" : !!window.PROTO_PUBLISH;
}

/* 表格自动列宽（生成内容规范第五章第 2 节「表格排版」）：PRD 以外的文档页（如后台操作手册）里带 data-fit 的静态表格。
   算法和 PRD 页面里的一样：表格宽度等于容器宽度、不出现水平滚动，从有富余的列把宽度挪给撑高行的列。
   PRD 正文（#doc）由 PRD 页面自己的脚本计算，这里跳过，避免同一张表算两遍 */
(function () {
  function cols(tbl) {
    var cs = tbl.querySelectorAll("col"); if (cs.length) return cs;
    var first = tbl.rows[0]; if (!first) return cs;
    var n = 0; [].forEach.call(first.cells, function (c) { n += c.colSpan || 1; });
    var g = document.createElement("colgroup"); for (var i = 0; i < n; i++) g.appendChild(document.createElement("col"));
    tbl.insertBefore(g, tbl.firstChild); return tbl.querySelectorAll("col");
  }
  function fit(tbl, force) {
    var cl = cols(tbl); if (!cl.length) return;
    /* 表格直接放在带内边距的容器里（如手册的 .mcard）时，可用宽度要扣掉内边距 */
    var ps = getComputedStyle(tbl.parentNode), n = cl.length, W = tbl.parentNode.clientWidth - (parseFloat(ps.paddingLeft) || 0) - (parseFloat(ps.paddingRight) || 0); if (W <= 0) return;
    if (!force && tbl._fitW === W) return;
    tbl._fitW = W;
    var MIN = 44, STEP = Math.max(4, Math.round(W / 120));
    var rows = [].slice.call(tbl.rows), len = [];
    for (var c = 0; c < n; c++) { var m = 1; rows.forEach(function (r) { var cell = r.cells[c]; if (cell && cell.colSpan === 1) m = Math.max(m, cell.textContent.trim().length); }); len.push(Math.sqrt(m)); }
    var mn = []; for (var k = 0; k < n; k++) mn.push(MIN);
    rows.forEach(function (r) { for (var k = 0; k < r.cells.length && k < n; k++) { var cell = r.cells[k]; if (cell.colSpan !== 1) continue; [].forEach.call(cell.querySelectorAll(".fp,.nw,.ui-nw,code,nobr"), function (e) { mn[k] = Math.max(mn[k], e.offsetWidth + 18); }); } });
    var sum = len.reduce(function (a, b) { return a + b; }, 0), w = len.map(function (l, i) { return Math.max(mn[i], Math.floor(W * l / sum)); });
    var cells = [].slice.call(tbl.querySelectorAll("th,td")), rg = document.createRange();
    function apply() { var s = w.reduce(function (a, b) { return a + b; }, 0); for (var i = 0; i < n; i++) cl[i].style.width = (w[i] / s * 100).toFixed(3) + "%"; var t = 0; cells.forEach(function (x) { rg.selectNodeContents(x); t += rg.getBoundingClientRect().height; }); return tbl.offsetHeight * 1000 + t; }
    var best = apply(), guard = 0, improved = true;
    while (improved && guard++ < 150) {
      improved = false; var move = null;
      [1, 2, 4, 8].forEach(function (k) {
        var d = STEP * k;
        for (var to = 0; to < n; to++) for (var from = 0; from < n; from++) {
          if (to === from || w[from] - d < mn[from]) continue;
          w[from] -= d; w[to] += d; var h = apply();
          if (h < best - 0.5) { best = h; move = [from, to, d]; }
          w[from] += d; w[to] -= d;
        }
      });
      if (move) { w[move[0]] -= move[2]; w[move[1]] += move[2]; improved = true; }
      apply();
    }
  }
  function fitAll(force) { [].forEach.call(document.querySelectorAll("table[data-fit]"), function (t) { if (!t.closest("#doc")) fit(t, force === true); }); }
  var tm = 0; function later() { clearTimeout(tm); tm = setTimeout(fitAll, 150); }
  window.addEventListener("resize", later); window.addEventListener("navtoggle", later);
  var loaded = document.readyState === "complete" ? Promise.resolve() : new Promise(function (r) { window.addEventListener("load", r); });
  Promise.all([loaded, document.fonts && document.fonts.ready ? document.fonts.ready : null]).then(function () { fitAll(true); });
})();

/* 研发说明标签（所有需求通用，需求包框架规范第 4 节「研发说明标签」）：原型里带 data-dev="编号" 的控件，开发和产品角色查看时，
   在控件右侧（或列标题、表单标签文字后面）显示荧光绿小圆点；鼠标移上去展开成「研发说明·编号 控件名」标签；点击弹窗显示 assets/dev-notes.js（window.DEV_NOTES）里这条说明。
   运营、报告角色（含产品在顶栏切换成的运营、报告视角）不显示。标签绝对定位、不占位置，不改变页面排版；英文化不翻译标签。
   标签插在控件后面（表格单元格、列表项插在它里面的末尾），页面脚本不要依赖控件的下一个兄弟元素。 */
(function () {
  var role = window.NAV && NAV.role;
  if (role !== "dev" && role !== "pdm") return;
  var SRC = document.currentScript && document.currentScript.src;
  var ITER = (/\/prototype\/(v\d+\.\d+|full)\//.exec(decodeURIComponent(location.pathname)) || [])[1] || "";
  var FIELDS = [["what", "作用"], ["scene", "场景与状态"], ["result", "交互结果"], ["limit", "限制"], ["formula", "计算公式"], ["rules", "对应规则"]];
  var INSIDE = /^(TD|TH|LI|DT|DD)$/;   /* 这些元素后面不能插兄弟节点，标签放在它们里面的末尾 */
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function isTag(n) { return n && n.nodeType === 1 && n.classList.contains("ui-devtag"); }
  var tags = [], raf = 0;
  /* 挂法（按「离被说明的东西最近、不遮挡」选，优先级：控件旁 → 示例状态旁 → 列标题后 → 区块标题后）：
     ① 控件、示例状态元素 data-dev="D01"（按钮、状态标签、感叹号、角标、进度条、空状态文字等）：绿点紧贴在元素右侧、垂直居中（见 place），不占位置；
        右侧没有空间时放在元素右上角内侧。元素隐藏、滚出可见区域、被弹窗盖住时绿点一起隐藏；同类元素共用一个编号，只在第一个可见的上显示。
     ② 数据类说明挂列标题：data-dev 写在表格格子 td 上时，绿点自动挂到这一列表头文字后面（同一编号只挂一个）；也可以直接写在 th 上加 data-dev-inline。
     ③ 表单项：输入框、下拉框、多行文本的绿点放在它的标签文字后面（label[for]、包住它的 label，或紧挨在它前面的标签文字元素）；单选、复选放在选项文字后面（同一组只挂一个）；
        找不到标签文字时按 ① 放在输入框右侧。
     ④ 标题挂法 data-dev-inline 或写多个编号 data-dev="D10 D11"：滚动区域、轮播里的控件和会被遮住的控件，把编号挂到这一块不滚动的标题、表头上，
        绿点排在标题文字后面（行内显示，不隐藏），一个标题可以并排多个绿点，展开后带编号和控件名称。 */
  var FIELD = /^(INPUT|SELECT|TEXTAREA)$/, AUTO = {};
  function colHead(td) {   /* 格子所在列的表头单元格（按 colspan 算列号，取表头最后一行） */
    var table = td.closest("table"), row = td.parentElement; if (!table || !row) return null;
    var col = 0; for (var c = row.firstElementChild; c && c !== td; c = c.nextElementSibling) col += c.colSpan || 1;
    var hr = table.tHead && table.tHead.rows.length ? table.tHead.rows[table.tHead.rows.length - 1] : (table.rows[0] !== row && table.rows[0].querySelector("th") ? table.rows[0] : null);
    if (!hr) return null;
    for (var i = 0, n = 0; i < hr.cells.length; i++) { if (col < n + (hr.cells[i].colSpan || 1)) return hr.cells[i] === td ? null : hr.cells[i]; n += hr.cells[i].colSpan || 1; }
    return null;
  }
  function fieldLabel(el) {   /* 表单项的标签文字：返回 [宿主, 插在谁前面]；插在最后时第二项为 null */
    var type = (el.getAttribute("type") || "").toLowerCase(), lab = el.closest("label");
    if (type === "radio" || type === "checkbox") return lab ? [lab, null] : null;
    if (el.id) { var lf = document.querySelector('label[for="' + el.id.replace(/"/g, '\\"') + '"]'); if (lf) return [lf, null]; }
    if (lab) return [lab, el];
    var p = el.previousElementSibling || (el.parentElement && el.parentElement.children.length === 1 && el.parentElement.previousElementSibling);
    if (p && !p.matches(CLICKABLE) && !p.querySelector(CLICKABLE) && /\S/.test(p.textContent) && p.textContent.length <= 30) return [p, null];
    return null;
  }
  var CLICKABLE = "a,button,input,select,textarea,label,summary,option,[role=button],[role=tab],[role=link],[role=checkbox],[role=radio],[onclick],[data-dev],.ui-devtag";
  function make(el) {
    var ids = String(el.getAttribute("data-dev") || "").trim().split(/\s+/).filter(Boolean); if (!ids.length) return;
    var title = el.hasAttribute("data-dev-inline") || ids.length > 1, host = null, before = null;
    if (!title && el.tagName === "TD") host = colHead(el);
    else if (!title && FIELD.test(el.tagName)) { var fl = fieldLabel(el); if (fl) { host = fl[0]; before = fl[1]; } }
    el._devTag = null;
    ids.forEach(function (id) {
      if (host) {   /* 挂到列标题、标签文字上：同一编号只挂一个 */
        var old = AUTO[id];
        if (old && old.isConnected) { if (!el._devTag) el._devTag = old; return; }
      }
      var d = (window.DEV_NOTES || {})[id], t = document.createElement("span");
      t.className = "ui-devtag mini" + (title || host ? " inline" : "");
      t.textContent = ids.length > 1 ? "研发说明·" + String((d && d.name) || id).replace(/[「」【】]/g, "").slice(0, 8) : "研发说明";
      t.setAttribute("role", "button"); t.tabIndex = 0; t.title = "研发说明：" + id + (d && d.name ? " " + d.name : "");
      t._for = el; t._id = id; if (!el._devTag) el._devTag = t;
      if (title) { el.appendChild(t); hint(); }
      else if (host) { host.insertBefore(t, before); AUTO[id] = t; hint(); }
      else if (INSIDE.test(el.tagName)) { el.classList.add("ui-devhost"); el.appendChild(t); } else el.parentNode.insertBefore(t, el.nextSibling);
      function open(e) { e.preventDefault(); e.stopPropagation(); show(id); }
      t.addEventListener("click", open, true);
      t.addEventListener("mouseenter", function () { raise(t); }); t.addEventListener("focus", function () { raise(t); });
      t.addEventListener("mouseleave", function (e) { if (e.relatedTarget !== LIFT) drop(); }); t.addEventListener("blur", drop);
      t.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") open(e); });
      ["mousedown", "pointerdown", "touchstart"].forEach(function (ev) { t.addEventListener(ev, function (e) { e.stopPropagation(); }); });
      tags.push(t);
    });
    /* 鼠标移到任何一个同编号的元素上，显示出来的那个绿点都变清晰 */
    el.addEventListener("mouseenter", function () { tags.forEach(function (x) { if (ids.indexOf(x._id) >= 0) x.classList.add("on"); }); });
    el.addEventListener("mouseleave", function () { tags.forEach(function (x) { if (ids.indexOf(x._id) >= 0) x.classList.remove("on"); }); });
    /* 按住 Alt 点击控件也能打开说明（同类控件没显示绿点时也能用） */
    if (!title) el.addEventListener("click", function (e) { if (e.altKey) { e.preventDefault(); e.stopPropagation(); show(ids[0]); } }, true);
  }  /* 所有标签默认显示为绿点：看上去 8px，点击热区 16px；普通控件的绿点紧贴在控件右侧，挂到列标题、标签文字、区块标题上的绿点排在文字后面。
     鼠标移到绿点上或键盘聚焦时，在 body 下的独立浮层（position:fixed，层级高于页面元素、低于研发说明弹窗）展开成完整标签「研发说明·编号 控件名」，
     不被相邻的输入框、按钮、表格、卡片盖住；靠近视口边缘时往里收；鼠标在浮层上时保持展开，移开后收回绿点。点击绿点或展开的标签都打开说明，点击不传给下面的控件。
     被页面弹窗盖住的绿点本身已隐藏、移不上去，所以浮层不会浮在页面弹窗上面。按住 Alt 点击控件也能打开说明。 */
  var LIFT = null, liftFor = null;
  function label(id) { var d = (window.DEV_NOTES || {})[id], n = d && d.name ? " " + String(d.name).replace(/[「」【】]/g, "") : ""; return "研发说明·" + id + (n.length > 17 ? n.slice(0, 16) + "…" : n); }
  function raise(t) {
    if (t.style.visibility === "hidden") return;
    if (!LIFT) {
      LIFT = document.createElement("span"); LIFT.className = "ui-devtag ui-devlift"; LIFT.setAttribute("role", "button");
      LIFT.addEventListener("click", function (e) { e.preventDefault(); e.stopPropagation(); var id = liftFor && liftFor._id; drop(); if (id) show(id); }, true);
      LIFT.addEventListener("mouseleave", function (e) { if (e.relatedTarget !== liftFor) drop(); });
      ["mousedown", "pointerdown", "touchstart"].forEach(function (ev) { LIFT.addEventListener(ev, function (e) { e.stopPropagation(); }); });
      document.body.appendChild(LIFT);
    }
    liftFor = t;
    LIFT.textContent = label(t._id); LIFT.title = t.title; LIFT.style.display = "";
    var r = t.getBoundingClientRect(), w = LIFT.offsetWidth, h = LIFT.offsetHeight;
    var x = r.left, y = r.top + (r.height - h) / 2;   /* 从绿点位置向右展开，盖住绿点，鼠标直接落在浮层上 */
    LIFT.style.left = Math.round(Math.max(4, Math.min(x, innerWidth - w - 4))) + "px";
    LIFT.style.top = Math.round(Math.max(4, Math.min(y, innerHeight - h - 4))) + "px";
  }
  function drop() { if (LIFT) LIFT.style.display = "none"; liftFor = null; }
  /* 图例：页面上有绿点时，在顶栏（原型画面外，不盖住原型、规则批注和模拟面板）常驻一条说明，前面放同色圆点。
     只在开发、产品角色出现（本段开头已按角色返回）；内容不随英文化翻译，由这里按语言选择中文或英文；英文模式（发布站点 PROTO_LANG = "en"，或本地 ?lang=en）显示英文。没有顶栏时贴在页面左下角。 */
  var hinted = false;
  function hint() {
    if (hinted) return; hinted = true;
    var q = /[?&]lang=(en|zh)\b/.exec(location.search), mode = q && q[1];
    try { mode = mode || sessionStorage.getItem("proto-lang"); } catch (e) {}
    var en = (mode || window.PROTO_LANG || "zh") === "en";
    var d = document.createElement("div"); d.className = "ui-devhint";
    d.innerHTML = "<i></i><span>" + (en
      ? "Green dots mark dev notes: not in development scope, for developer reference only. Hover to expand, click to view."
      : "绿色圆点为研发说明标记，不在开发范围内，仅为给研发人员的信息提示；鼠标移入展开，点击查看说明") + "</span>";
    d.title = d.textContent;
    var bar = document.querySelector(".topbar"), crumb = bar && bar.querySelector(".crumb");
    if (bar) { d.classList.add("in-bar"); bar.insertBefore(d, crumb ? crumb.nextSibling : null); }
    else if (!document.documentElement.classList.contains("embedded")) document.body.appendChild(d);   /* 嵌在确认页等页面里的原型不显示，避免盖住原型 */
  }  /* 普通控件的绿点：控件隐藏、滚出可见区域、被页面弹窗盖住时隐藏；否则紧贴在控件右侧。只改绿点自己的 left / top。返回是否显示。 */
  function place(t) {
    var el = t._for;
    t.style.visibility = "hidden";
    if (!el.getClientRects().length) return false;
    var b = el.getBoundingClientRect(), clips = [{ left: 0, top: 0, right: innerWidth, bottom: innerHeight }];
    /* 控件在可滚动区域里被滚出可见范围时，绿点也隐藏（绿点的定位基准可能在滚动区域外面，不会跟着裁切） */
    for (var p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      if (getComputedStyle(p).overflow === "visible") continue;
      var r = p.getBoundingClientRect();
      if (b.bottom < r.top || b.top > r.bottom || b.right < r.left || b.left > r.right) return false;
      clips.push(r);
    }
    /* 控件被页面自己的弹窗、遮罩盖住时（控件中心点最上层的元素和控件无关），绿点也隐藏，不透到弹窗上面 */
    var cx = (b.left + b.right) / 2, cy = (b.top + b.bottom) / 2;
    if (cx >= 0 && cy >= 0 && cx < innerWidth && cy < innerHeight) {
      var hit = document.elementFromPoint(cx, cy);
      if (hit && !el.contains(hit) && !hit.contains(el) && !(hit.closest && hit.closest("label") && hit.closest("label").contains(el))) return false;
    }
    /* 紧贴右侧、垂直居中：圆点左边离元素 3px（16px 热区左边比元素右边少 1px）；右侧压到别的可点元素、绿点或超出可见范围时，放在元素右上角内侧 */
    var x = b.right - 1, y = (b.top + b.bottom) / 2 - 8;
    if (!free(x + 4, y + 4, 8, 8, el, clips)) { x = b.right - 15; y = b.top - 1; }
    t.style.left = "0px"; t.style.top = "0px";
    var a = t.getBoundingClientRect();
    t.style.left = Math.round(x - a.left) + "px";
    t.style.top = Math.round(y - a.top) + "px";
    t.style.visibility = "";
    hint();
    return true;
  }
  function free(x, y, w, h, el, clips) {   /* 这块区域在可见范围内，且没有压到别的可点元素和绿点 */
    for (var i = 0; i < clips.length; i++) { var c = clips[i]; if (x < c.left || y < c.top || x + w > c.right || y + h > c.bottom) return false; }
    var pts = [[x + 1, y + 1], [x + w - 1, y + 1], [x + 1, y + h - 1], [x + w - 1, y + h - 1], [x + w / 2, y + h / 2]];
    for (var j = 0; j < pts.length; j++) {
      var n = document.elementFromPoint(pts[j][0], pts[j][1]);
      if (!n || el.contains(n) || (n.closest && n.closest(CLICKABLE) && !n.closest(CLICKABLE).contains(el))) return false;
    }
    return true;
  }
  function refresh() {
    raf = 0;
    if (!window.DEV_NOTES && document.querySelector("[data-dev]")) loadNotes();   /* 打开时没有、后来由脚本加出的 data-dev */
    tags = tags.filter(function (t) { if (t._for.isConnected && t.isConnected) return true; if (t.isConnected) t.remove(); t._for._devTag = null; return false; });
    [].forEach.call(document.querySelectorAll("[data-dev]"), function (el) { if (!el._devTag || !el._devTag.isConnected) { tags = tags.filter(function (t) { if (t._for !== el) return true; t.remove(); return false; }); make(el); } });   /* 一个标题的多个标签被页面重画掉一部分时，整组重建 */
    /* 同类控件只显示一个标签：同一编号挂在多个控件上（列表每行的操作按钮、每张卡片上的同类按钮、同一组单选项）时，
       按页面顺序只在第一个可见的控件上显示，其余不显示；标题挂法的标签不受影响，始终显示 */
    var abs = tags.filter(function (t) { return !t.classList.contains("inline"); }), shown = {};
    abs.forEach(function (t) { t.style.visibility = "hidden"; });   /* 先全部收起再逐个放，避免和上一轮自己的位置互相避让 */
    abs.sort(function (x, y) { return x._for === y._for ? 0 : (x._for.compareDocumentPosition(y._for) & 4 ? -1 : 1); });
    abs.forEach(function (t) { if (!shown[t._id] && place(t)) shown[t._id] = 1; });
    if (liftFor && (!liftFor.isConnected || liftFor.style.visibility === "hidden")) drop();   /* 标签被隐藏（弹窗盖住、滚出）时浮层一起收起 */
  }
  function later() { if (!raf) raf = setTimeout(refresh, 40); }   /* 不用 requestAnimationFrame：后台或隐藏的标签页里它不执行，标签会停在旧位置 */
  /* 弹窗 */
  function prdHref(id) {
    var p = window.DEV_NOTES_PRD; if (!p) return "";
    return (window.NAV_ROOT || "") + String(p).replace("{iter}", ITER || "full") + "#dev-" + encodeURIComponent(id);
  }
  function show(id) {
    var d = (window.DEV_NOTES || {})[id], mask = document.createElement("div"); mask.className = "ui-devpop-mask";
    var h = '<div class="ui-devpop" role="dialog" aria-modal="true" aria-label="研发说明"><button type="button" class="x-close" aria-label="关闭" title="关闭">×</button>' +
      '<div class="dp-k">研发说明 · ' + esc(id) + "</div>";
    if (!d) h += '<h3>没有找到这条说明</h3><p class="dp-miss">assets/dev-notes.js 里没有编号「' + esc(id) + "」，请补上（PRD 附录 D 由它自动生成）。</p>";
    else {
      h += "<h3>" + esc(d.name || id) + "</h3>" + (d.page ? '<div class="dp-page">' + esc(d.page) + "</div>" : "") + "<dl>";
      FIELDS.forEach(function (f) { if (d[f[0]]) h += "<dt>" + f[1] + '</dt><dd class="' + (f[0] === "formula" ? "dp-f" : "") + '">' + esc(d[f[0]]).replace(/\n/g, "<br>") + "</dd>"; });
      h += "</dl>";
      var href = prdHref(id); if (href) h += '<a class="dp-prd" href="' + esc(href) + '">在 PRD 中查看 ›</a>';
    }
    mask.innerHTML = h + "</div>";
    function close() { mask.remove(); document.removeEventListener("keydown", esc2, true); }
    function esc2(e) { if (e.key === "Escape") { e.stopPropagation(); close(); } }
    mask.addEventListener("click", function (e) { if (e.target === mask || e.target.classList.contains("x-close")) close(); e.stopPropagation(); });
    document.addEventListener("keydown", esc2, true);
    document.body.appendChild(mask); mask.querySelector(".x-close").focus();
  }
  function start() {
    refresh();
    new MutationObserver(function (list) {
      for (var i = 0; i < list.length; i++) {
        var m = list[i];
        if (isTag(m.target) || (m.target.closest && m.target.closest(".ui-devpop-mask"))) continue;
        if (m.type === "childList" && [].every.call(m.addedNodes, isTag) && [].every.call(m.removedNodes, isTag)) continue;
        later(); return;
      }
    }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["class", "style", "hidden", "open", "data-dev"] });
    window.addEventListener("resize", later); window.addEventListener("navtoggle", later); window.addEventListener("load", later);
    document.addEventListener("scroll", function () { drop(); later(); }, true);   /* 手机画面、后台列表等滚动区域滚动时重新对齐（浮层先收起） */
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(later);
  }
  /* 说明数据：页面没有引用 dev-notes.js 时，按 nav.js 的地址自动加载同目录的 dev-notes.js（原型页面不用改）。
     页面上没有 data-dev 时不加载（文档页、还没写研发说明的需求不会请求一个不存在的文件）；之后脚本加出 data-dev 时再加载。 */
  var loading = false;
  function loadNotes(done) {
    if (window.DEV_NOTES || !SRC || loading) return done && done();
    loading = true;
    var s = document.createElement("script"); s.src = SRC.replace(/nav\.js(\?.*)?$/, "dev-notes.js"); s.onload = s.onerror = function () { if (done) done(); else later(); }; document.head.appendChild(s);
  }
  function ready() {
    if (document.querySelector("[data-dev]")) loadNotes(start); else start();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ready); else ready();
})();

/* 编号链接（所有需求通用，生成内容规范第五章第 2 节「引用编号」）：需求资料（PRD、需求要点、开发自查清单、后台操作手册、客服 QA、需求修改总结、
   原型规则批注等）里引用的编号，自动换成可点的编号按钮，点击弹出浮窗显示这条编号的内容，浮窗里「查看完整内容 ›」跳到 PRD 原位置。
   - 规则 N、待确认 Q：PRD 里 <tr id="n3"> / <tr id="q2"> 那一行的 data-brief（没写时取第二列）；
   - 功能点 F（F01、F01-01）：PRD 页面脚本里 FP 表的名称；
   - 控件说明 D：assets/dev-notes.js 的控件名和作用（跳到 PRD 附录 D）。
   内容统一从本迭代的 PRD 读取（PRD 页面直接读本页，其他页面读取 PRD 文件），PRD 里找不到的编号保持文字。当前角色看不到 PRD（运营）时不换。
   不换的地方：标题、目录、链接、按钮、输入框、功能点标签 .fp、编号定义行自己的编号格（PRD 规则表、待确认表、附录 D，开发自查清单的功能点标题）、引用其他文档编号的 .no-ref、研发说明标记和弹窗。
   让用户确认问题的页面（检查报告、问题确认页）不用编号链接；运营需求确认、文案确认页在引入 nav.js 前设置 window.NO_REF_LINKS = true 关闭。
   页面自己（旧版 PRD 页面脚本）已经换好的 .ref-btn[data-ref] 按原来的方式处理，这里不重复。 */
(function () {
  if (window.NO_REF_LINKS || !window.NAV || !NAV.data) return;
  var ROOT = window.NAV_ROOT || "", RE = /\b(N\d{1,3}|Q\d{1,3}|F\d{2}(?:-\d{2})?|D\d{2,3})\b/g;   /* 限制位数：订单号「D2026102214051234」之类长数字不会被当成编号 */
  var SKIP = "h1,h2,h3,h4,a,button,input,textarea,select,script,style,code,pre,[contenteditable],.toc-full,.ref-pop,.vtag,.chg,.no-ref,.fp,.ui-devtag,.ui-devpop-mask,.ui-devhint,.sidenav,.topbar,.app,.code,.code2";   /* .code / .code2：开发自查清单里功能点自己的编号 */
  var ITER = (/\/(?:prototype|docs)\/(v\d+\.\d+|full)\//.exec(decodeURIComponent(location.pathname)) || [])[1] || "";
  /* 本迭代的 PRD：目录数据里文件名是「…需求开发PRD文档.html」的页面，多迭代优先选同一迭代目录下的 */
  var prd = null;
  (function walk(n) {
    if (n.href && /需求开发PRD文档\.html$/.test(n.href) && (!prd || (ITER && n.href.indexOf("/" + ITER + "/") >= 0))) prd = n;
    (n.children || []).forEach(walk);
  })(NAV.data);
  if (!prd || !NAV.can(prd)) return;
  var PRD_URL = ROOT + prd.href, SRC = document.currentScript && document.currentScript.src;
  var onPrd = new URL(PRD_URL, location.href).pathname === location.pathname;
  var INDEX = null;
  function text(el) { return el ? el.textContent.replace(/\s+/g, " ").trim() : ""; }
  function build(root, src) {   /* 从 PRD 文档建编号索引：编号 → { brief, href } */
    var idx = {}, base = onPrd ? "" : PRD_URL;
    [].forEach.call(root.querySelectorAll("tr[id]"), function (tr) {
      if (!/^[nq]\d+$/.test(tr.id)) return;
      idx[tr.id.toUpperCase()] = { brief: tr.getAttribute("data-brief") || text(tr.cells[1]), href: base + "#" + tr.id };
    });
    var m = /var FP\s*=\s*\{([\s\S]*?)\};/.exec(src || ""), r = /"?(F\d{2}(?:-\d{2})?)"?\s*:\s*"((?:[^"\\]|\\.)*)"/g, x;
    if (m) while ((x = r.exec(m[1]))) idx[x[1]] = { brief: x[2], href: base + "#" + x[1] };
    var D = window.DEV_NOTES || {};
    Object.keys(D).forEach(function (k) { var d = D[k]; idx[k] = { brief: (d.name || k) + (d.what ? "：" + d.what : ""), href: base + "#dev-" + k }; });
    return idx;
  }
  function load(done) {
    if (onPrd) {
      var src = [].map.call(document.scripts, function (s) { return s.textContent; }).join("\n");
      return done(build(document, src));
    }
    if (!window.fetch || location.protocol === "file:") return done(null);   /* 本地双击打开读不到 PRD，编号保持文字 */
    /* 正文引用了控件说明 D 而页面没有加载 dev-notes.js 时，先加载它 */
    if (!window.DEV_NOTES && SRC && /\bD\d{2,3}\b/.test(document.body.textContent)) {
      var s = document.createElement("script"); s.src = SRC.replace(/nav\.js(\?.*)?$/, "dev-notes.js");
      s.onload = s.onerror = function () { load(done); }; document.head.appendChild(s); return;
    }
    fetch(PRD_URL.split("#")[0], { cache: "no-cache" }).then(function (r) { return r.ok ? r.text() : ""; }).then(function (html) {
      if (!html) return done(null);
      done(build(new DOMParser().parseFromString(html, "text/html"), html));
    }).catch(function () { done(null); });
  }
  function convert(root) {
    if (!INDEX) return;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), texts = [];
    while (walker.nextNode()) texts.push(walker.currentNode);
    texts.forEach(function (t) {
      var par = t.parentNode, s = t.nodeValue;
      if (!par || !/[NQFD]\d/.test(s) || !par.closest || par.closest(SKIP)) return;
      var td = par.closest("td"); if (td && td.cellIndex === 0 && /^([nq]\d+|dev-D\d+)$/.test(td.parentNode.id || "")) return;   /* 规则表、待确认表、附录 D 自己的编号格 */
      var frag = document.createDocumentFragment(), last = 0, m, hit = false; RE.lastIndex = 0;
      while ((m = RE.exec(s))) {
        if (!INDEX[m[1]]) continue;
        hit = true; frag.appendChild(document.createTextNode(s.slice(last, m.index)));
        var b = document.createElement("button"); b.type = "button"; b.className = "ref-btn"; b.textContent = m[1]; b.setAttribute("data-code", m[1]);
        b.title = "查看 " + m[1] + " 的内容"; frag.appendChild(b); last = m.index + m[0].length;
      }
      if (!hit) return;
      frag.appendChild(document.createTextNode(s.slice(last))); par.replaceChild(frag, t);
    });
  }
  var pop = null;
  function close() { if (pop) { pop.remove(); pop = null; } }
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest(".ref-btn[data-code]");
    if (!b) { if (pop && !pop.contains(e.target)) close(); return; }
    e.preventDefault(); e.stopPropagation();
    var code = b.getAttribute("data-code"), same = pop && pop.dataset.code === code; close(); if (same) return;
    var it = INDEX && INDEX[code]; if (!it) return;
    pop = document.createElement("div"); pop.className = "ref-pop"; pop.setAttribute("role", "tooltip"); pop.dataset.code = code;
    var h = document.createElement("b"); h.textContent = code; pop.appendChild(h);
    var p = document.createElement("p"); p.textContent = it.brief || "（这条编号还没写精炼描述）"; pop.appendChild(p);
    var a = document.createElement("a"); a.href = it.href; a.textContent = "查看完整内容 ›"; a.onclick = close; pop.appendChild(a);
    document.body.appendChild(pop);
    var r = b.getBoundingClientRect(), w = pop.offsetWidth;
    pop.style.left = Math.max(8, Math.min(r.left + scrollX, scrollX + innerWidth - w - 8)) + "px"; pop.style.top = (r.bottom + scrollY + 6) + "px";
  }, true);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  var t = 0;
  function start() {
    load(function (idx) {
      INDEX = idx; if (!INDEX) return;
      convert(document.body);
      /* 页面脚本后来画出的内容（开发自查清单、需求修改总结等）也换 */
      new MutationObserver(function (list) {
        if (list.every(function (m) { return [].every.call(m.addedNodes, function (n) { return n.nodeType === 1 && (n.classList.contains("ref-btn") || n.classList.contains("ref-pop")); }); })) return;
        clearTimeout(t); t = setTimeout(function () { convert(document.body); }, 60);
      }).observe(document.body, { childList: true, subtree: true });
    });
  }
  /* 等页面脚本（含 dev-notes.js、旧版 PRD 自带的编号按钮脚本）跑完再换 */
  if (document.readyState === "complete") start(); else window.addEventListener("load", start);
})();

/* 带锚点打开页面时的定位修正（所有需求通用）：浏览器先按网址里的 #锚点 滚动，之后表格自动列宽、字体加载、页面脚本画出内容会改变上方高度，
   目标行被挤出视口。页面加载完成后、字体就绪后，以及 400ms、1200ms 时各再定位一次；用户自己滚动、点击或按键后不再干预。
   PRD 附录 D 的 #dev-编号 由 PRD 页面自己定位（居中并高亮），这里跳过。 */
(function () {
  var moved = false;
  ["wheel", "touchstart", "keydown", "mousedown"].forEach(function (ev) { window.addEventListener(ev, function () { moved = true; }, { passive: true, capture: true }); });
  function go() {
    if (moved || !location.hash || /^#dev-/.test(location.hash)) return;
    var id; try { id = decodeURIComponent(location.hash.slice(1)); } catch (e) { id = location.hash.slice(1); }
    var el = document.getElementById(id); if (el) el.scrollIntoView({ block: "start", behavior: "instant" });
  }
  function again() { go(); setTimeout(go, 400); setTimeout(go, 1200); if (document.fonts && document.fonts.ready) document.fonts.ready.then(go); }
  if (document.readyState === "complete") again(); else window.addEventListener("load", again);
  window.addEventListener("hashchange", function () { moved = false; setTimeout(go, 0); });
})();