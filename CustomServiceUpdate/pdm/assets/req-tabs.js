/* 需求切换标签：本需求包含两个互不相关的需求，每份文档顶部用标签切换。
   用法：页面里放 <div id="reqTabs"></div>，需求专属内容用 data-req="a" / data-req="b" 包起来，没有 data-req 的内容两个需求都显示；
   在页面脚本之前引入本文件。当前选中的需求记在本机浏览器，切换页面时保持；网址带 #F01… / #F02… 或某个需求里的锚点时自动切到对应需求。
   切换时触发 window 事件 "reqchange"（detail.req），页面可据此重画；嵌在其他页面里时接收 {type:"req-set", req} 消息。 */
(function () {
  var REQS = [
    { k: "a", fp: "F01", name: "后台列表优化", desc: "身份和等级标签、按等级排序" },
    { k: "b", fp: "F02", name: "自助问题优化", desc: "点「充值没到账」后查看订单" }
  ];
  var KEY = "客服系统优化功能需求-req", cur = null;
  var css = ".req-tabs{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 14px}" +
    ".req-tabs button{all:unset;box-sizing:border-box;cursor:pointer;border:1px solid #D0C3E8;border-radius:8px;padding:8px 14px;background:#fff;color:#3A2A5C;font-size:14px;font-weight:700;line-height:1.3;font-family:inherit}" +
    ".req-tabs button small{display:block;font-weight:400;font-size:12px;color:#7A6F8F}" +
    ".req-tabs button[aria-selected=true]{background:#16052F;border-color:#16052F;color:#F0D291}" +
    ".req-tabs button[aria-selected=true] small{color:#D9CBA6}" +
    ".req-tabs button:focus-visible{outline:2px solid #C89A3C;outline-offset:2px}" +
    "@media print{.req-tabs{display:none}[data-req]{display:block!important}[data-req][hidden]{display:block!important}}";
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  function byK(k) { for (var i = 0; i < REQS.length; i++) if (REQS[i].k === k) return REQS[i]; return null; }
  function fromHash() {
    var h = decodeURIComponent(location.hash.slice(1)); if (!h) return null;
    var m = /^F0(\d)/.exec(h); if (m && REQS[+m[1] - 1]) return REQS[+m[1] - 1].k;
    var el = document.getElementById(h), s = el && el.closest("[data-req]");
    return s ? s.dataset.req : null;
  }
  function stored() { try { var v = localStorage.getItem(KEY); return byK(v) ? v : null; } catch (e) { return null; } }
  function set(k) {
    if (!byK(k)) k = REQS[0].k;
    var changed = k !== cur; cur = k;
    document.querySelectorAll("[data-req]").forEach(function (e) { e.hidden = e.dataset.req !== k; });
    document.querySelectorAll(".req-tabs button").forEach(function (b) { b.setAttribute("aria-selected", b.dataset.k === k); });
    try { localStorage.setItem(KEY, k); } catch (e) {}
    if (changed) window.dispatchEvent(new CustomEvent("reqchange", { detail: { req: k, fp: byK(k).fp } }));
  }
  function build() {
    var box = document.getElementById("reqTabs"); if (!box) return;
    box.className = "req-tabs"; box.setAttribute("role", "tablist"); box.setAttribute("aria-label", "切换需求");
    REQS.forEach(function (r) {
      var b = document.createElement("button"); b.type = "button"; b.dataset.k = r.k; b.setAttribute("role", "tab");
      b.innerHTML = r.name + "<small>" + r.desc + "</small>";
      b.onclick = function () { set(r.k); if (location.hash) history.replaceState(null, "", location.pathname + location.search); window.scrollTo(0, 0); };
      box.appendChild(b);
    });
  }
  window.REQ = { list: REQS, get: function () { return cur; }, set: set, of: function (fp) { var m = /^F0(\d)/.exec(fp || ""); return m && REQS[+m[1] - 1] ? REQS[+m[1] - 1].k : null; } };
  function init() { build(); set(fromHash() || stored() || REQS[0].k); }
  /* 本文件放在页面内容之后、页面脚本之前引入，此时内容已解析，直接初始化，页面脚本拿到的就是已切换好的状态 */
  if (document.getElementById("reqTabs") || document.readyState !== "loading") init(); else document.addEventListener("DOMContentLoaded", init);
  window.addEventListener("hashchange", function () { var k = fromHash(); if (k && k !== cur) set(k); });

  /* 左侧目录栏：主标题（模板 nav.js 生成的需求标题）下面加需求标签，点选切换（需求包框架规范第 14 节「客服系统优化」例外）。
     放在本文件而不是 nav.js 里，整份同步模板 nav.js 时不会被覆盖（第 12.2 节）。标签数据取 nav-data 的 reqs：{ k, title, proto } */
  function sideTabs() {
    var SR = (window.NAV_DATA && NAV_DATA.reqs) || [], t = document.querySelector(".sidenav .sn-brand .t");
    if (!SR.length || !t || document.querySelector(".sn-reqs")) return;
    var box = document.createElement("div"); box.className = "sn-reqs"; box.setAttribute("role", "tablist"); box.setAttribute("aria-label", "切换需求");
    SR.forEach(function (r) { var b = document.createElement("button"); b.type = "button"; b.className = "sn-req"; b.setAttribute("role", "tab"); b.dataset.rk = r.k; b.textContent = r.title; box.appendChild(b); });
    t.after(box);
    var s2 = document.createElement("style");
    s2.textContent = ".sn-reqs{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:8px}.sn-req{all:unset;box-sizing:border-box;cursor:pointer;display:block;text-align:center;border:1px solid rgba(240,210,145,.35);border-radius:6px;padding:6px 4px;color:#E9DFC8;font-size:13px;font-weight:700;line-height:1.35;font-family:inherit}" +
      ".sn-req:hover{border-color:#C89A3C}.sn-req[aria-selected=true]{background:#C89A3C;border-color:#C89A3C;color:#16052F}.sn-req:focus-visible{outline:2px solid #F0D291;outline-offset:1px}";
    document.head.appendChild(s2);
    var path = decodeURIComponent(location.pathname), inProto = /\/prototype\//.test(path);
    function protoK() { for (var i = 0; i < SR.length; i++) if (path.indexOf(SR[i].proto) >= 0) return SR[i].k; return null; }
    function mark() { var k = (inProto && protoK()) || cur; box.querySelectorAll(".sn-req").forEach(function (b) { b.setAttribute("aria-selected", b.dataset.rk === k); }); }
    box.addEventListener("click", function (e) {
      var b = e.target.closest(".sn-req"); if (!b) return;
      var r = SR.filter(function (x) { return x.k === b.dataset.rk; })[0];
      if (inProto) { try { localStorage.setItem(KEY, r.k); } catch (x) {} if (protoK() !== r.k) location.href = (window.NAV_ROOT || "") + r.proto + location.search; return; }
      set(r.k); mark();
    });
    window.addEventListener("reqchange", mark);
    mark();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", sideTabs); else sideTabs();
  window.addEventListener("message", function (e) { var d = e.data || {}; if (d.type === "req-set" && byK(d.req)) set(d.req); });
})();
