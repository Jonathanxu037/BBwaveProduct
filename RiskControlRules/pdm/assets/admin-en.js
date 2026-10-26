/* 后台原型语言切换（本需求的三个后台原型页共用）：顶栏「简体中文」改为语言下拉（简体中文 / English），和线上后台一样切换整个后台画面的语言。
   范围：后台画面（.bo）、后台弹窗（.bo-mask）、操作提示（.bo-msg）里的文字和 placeholder、title、aria-label、data-tip。
   不翻译：规则批注和模拟面板（.notes）、需求说明（.ui-reqnote）、「查看需求方案」标签和弹窗（.wr-orig、#dlgOrig）——这些是给内部看的说明，始终中文。
   语言记在当前标签页（sessionStorage「adm-lang」），三页共用；地址加 ?lang=en / ?lang=zh 也可切换。默认简体中文。
   本地预览英文时，对照表里没有英文的中文用红框标出，左下角显示漏翻条数，控制台列出原文（window.ADMIN_EN_MISSING）。
   对照表 window.ADMIN_EN 在 admin-en-dict.js：键是中文原文（去掉首尾空格后完全一致），值是英文；带变量的写成 "已选 {a} / {b} 个层级": "{a} / {b} tiers selected"。 */
(function () {
  var KEY = "adm-lang", q = /[?&]lang=(en|zh)\b/.exec(location.search), lang;
  try { if (q) sessionStorage.setItem(KEY, q[1]); lang = q ? q[1] : sessionStorage.getItem(KEY); } catch (e) { lang = q && q[1]; }
  lang = lang === "en" ? "en" : "zh";
  var preview = !window.PROTO_PUBLISH;

  /* 顶栏语言下拉：切换后重新载入当前页 */
  function langSwitch() {
    var sp = document.querySelector(".bo-top1 .sp"); if (!sp || sp.tagName === "SELECT") return;
    var sel = document.createElement("select"); sel.className = "sp wr-lang"; sel.setAttribute("aria-label", "语言");
    sel.style.cssText = "background:transparent;color:#fff;border:1px solid rgba(255,255,255,.45);border-radius:3px;font:inherit;font-size:12px;padding:0 4px;height:22px;cursor:pointer";
    [["zh", "简体中文"], ["en", "English"]].forEach(function (x) { var o = document.createElement("option"); o.value = x[0]; o.textContent = x[1]; o.style.color = "#303133"; sel.appendChild(o); });
    sel.value = lang;
    sel.onchange = function () {
      try { sessionStorage.setItem(KEY, sel.value); } catch (e) {}
      var u = location.href.replace(/([?&])lang=(en|zh)(&|$)/, function (_, a, b, c) { return c ? a : ""; });
      location.href = u;
    };
    sp.parentNode.replaceChild(sel, sp);
  }

  var D = window.ADMIN_EN || {}, exact = {}, pats = [], missing = {}, DONE = {}, bd = null;
  Object.keys(D).forEach(function (k) {
    if (!/\{\w+\}/.test(k)) { exact[k.trim()] = D[k]; return; }
    var names = [], pat = "^" + k.trim().replace(/[.*+?^$()|[\]\\]/g, "\\$&").replace(/\{(\w+)\}/g, function (_, n) { names.push(n); return "([\\s\\S]+?)"; }) + "$";
    pats.push({ re: new RegExp(pat), names: names, v: D[k] });
  });
  var CJK = /[㐀-鿿　-〿！-｠]/;
  /* 返回译文；null 表示不需要翻译；undefined 表示对照表里没有 */
  function tr(s) {
    var t = String(s).trim(); if (!t || !CJK.test(t) || DONE[t]) return null;
    var out = exact[t];
    if (out == null) for (var i = 0; i < pats.length; i++) {
      var m = pats[i].re.exec(t); if (!m) continue;
      out = pats[i].v.replace(/\{(\w+)\}/g, function (all, n) { var j = pats[i].names.indexOf(n); if (j < 0) return all; var x = tr(m[j + 1]); return x == null ? m[j + 1] : x === undefined ? m[j + 1] : x.trim(); });
      break;
    }
    if (out == null) { missing[t] = 1; return undefined; }
    DONE[out] = 1;
    return String(s).replace(t, out);
  }
  /* 同一个中文在不同位置英文不同时，对照表用「.类名 中文」写专用译法，例如 ".wr-st 关闭": "Disabled"（层级状态），优先于通用译法 */
  function ctx(n) { var p = n.parentNode, t = String(n.nodeValue).trim(); if (p && p.classList) for (var i = 0; i < p.classList.length; i++) { var v = D["." + p.classList[i] + " " + t]; if (v != null) { DONE[v] = 1; return n.nodeValue.replace(t, v); } } return tr(n.nodeValue); }
  var ROOT = ".bo, .bo-mask, .bo-msg", SKIP = ".notes, .ui-reqnote, .wr-orig, #dlgOrig, script, style";
  var ATTRS = ["placeholder", "title", "aria-label", "alt", "data-tip"];
  function miss(el) { if (preview && el && el.classList) el.classList.add("en-miss"); }
  function walk(n, on) {
    if (n.nodeType === 3) { if (!on) return; var r = ctx(n); if (typeof r === "string") n.nodeValue = r; else if (r === undefined) miss(n.parentNode); return; }
    if (n.nodeType !== 1 || n.matches(SKIP)) return;
    if (!on && n.matches(ROOT)) on = true;
    if (on) ATTRS.forEach(function (a) {
      var v = n.getAttribute(a); if (!v) return;
      var r = tr(v); if (typeof r === "string") n.setAttribute(a, r); else if (r === undefined) miss(n);
    });
    for (var c = n.firstChild; c; c = c.nextSibling) walk(c, on);
  }
  function badge() {
    if (!preview) return;
    var k = Object.keys(missing).length;
    if (!bd) { bd = document.createElement("div"); bd.className = "en-badge"; bd.setAttribute("role", "status"); document.body.appendChild(bd); }
    var s = k ? "英文预览：后台画面有 " + k + " 条中文没有英文（红框标出，原文见控制台）" : "英文预览：后台画面已全部显示英文";
    if (bd.textContent !== s) bd.textContent = s;
    bd.classList.toggle("ok", !k);
  }
  var raf = 0, busy = false, obs = null;
  function scan() {
    raf = 0; missing = {}; busy = true;
    [].forEach.call(document.querySelectorAll(".en-miss"), function (e) { e.classList.remove("en-miss"); });
    walk(document.body, false);
    var prev = (window.ADMIN_EN_MISSING || []).join("\n");
    window.ADMIN_EN_MISSING = Object.keys(missing);
    badge();
    if (obs) obs.takeRecords();   /* 本次翻译和角标改动不再触发下一轮检查，避免循环 */
    busy = false;
    if (window.ADMIN_EN_MISSING.length && window.ADMIN_EN_MISSING.join("\n") !== prev && window.console) console.warn("后台英文：以下中文在 assets/admin-en-dict.js 里没有英文（共 " + window.ADMIN_EN_MISSING.length + " 条）：\n" + window.ADMIN_EN_MISSING.join("\n"));
  }
  function later() { if (!busy && !raf) raf = setTimeout(scan, 0); }   /* 不用 requestAnimationFrame：页面在后台时不触发 */
  function start() {
    langSwitch();
    if (lang !== "en") return;
    document.documentElement.setAttribute("lang", "en");
    scan();
    obs = new MutationObserver(later);
    obs.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS.concat(["hidden"]) });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
