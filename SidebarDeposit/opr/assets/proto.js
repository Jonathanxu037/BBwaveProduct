/* 原型公共脚本（通用）：页面之间共享的模拟状态、清空原型状态、模拟操作面板、Toast、弹窗、跳转、倒计时。
   全部为模拟数据，不调用任何接口。由各原型页面按需配置，本文件不写任何业务内容。

   用法（在原型页面里，nav.js 之后引用 ../../assets/proto.js）：
     P.init({ defaults: { platform: "H5", status: "normal", codeEnd: 0 } });   // 本需求用到的模拟状态和默认值
     P.panel(document.getElementById("simPanel"), [                           // 模拟操作面板，按分组配置，用不到的分组删掉
       { title: "切换端", items: [{ type: "select", key: "platform", label: "端", options: ["H5", "iOS", "Flutter"] }] },
       { title: "切换后台配置项", items: [{ type: "select", key: "cfgA", label: "【配置项名称】", options: [["1", "1 · 【含义】"], ["0", "0 · 【含义】"]] },
                                         { type: "check", key: "cfgB", label: "【开关名称】" }] },
       { title: "设置用户状态", items: [{ type: "radio", key: "status", options: [["normal", "正常"], ["frozen", "已冻结"]] }] },
       { title: "注入异常", items: [{ type: "button", label: "【异常名称】", run: function () { ... } }] },
       { title: "倒计时", items: [{ type: "countdown", key: "codeEnd", label: "让倒计时立即结束" }] },
       { title: "短信", items: [{ type: "sms", code: "2468", label: "模拟收到短信", fill: function (code) { ... } }] },
       { title: "演示值说明", items: [{ type: "note", text: "演示密码：【演示值】；所有数据均为虚构" }] },
       { items: [{ type: "reset" }] }                                         // 清空原型状态（建议每个页面都放）
     ]);
     window.addEventListener("proto-change", function (e) { e.detail.key; e.detail.value; ... });   // 模拟状态变化后重画页面
   两种提示要分清：
     P.note(文字, 控件)  原型操作的演示反馈（如「已设为：处理中」），只显示在模拟操作面板里，带「原型演示」标签，研发不用实现；面板控件已自动调用。
     P.toast(文字)       需求本身要求页面显示的提示（属于页面效果，研发要实现），显示在手机画面或后台页面里。
   状态存在 sessionStorage（同一标签页里跨页面保留，关掉标签页就清空）；浏览器不允许时退回内存（只在当前页面有效）。 */
(function () {
  /* 模拟状态按需求区分；多迭代需求包（需求包框架规范第 3 节）再按迭代区分：路径里有 prototype/<迭代>/ 时自动加上迭代名，
     避免不同迭代的同名原型互相覆盖模拟状态 */
  var ITER = (/\/prototype\/(v\d+\.\d+|full)\//.exec(decodeURIComponent(location.pathname)) || [])[1] || "";
  var KEY = "proto-" + String((window.NAV_DATA && NAV_DATA.title) || document.title || "proto") + (ITER ? "-" + ITER : ""), mem = {}, D = {};
  function load() { try { var t = sessionStorage.getItem(KEY); return t ? JSON.parse(t) : mem; } catch (e) { return mem; } }
  function save(s) { mem = s; try { sessionStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }
  function fire(k, v) { try { window.dispatchEvent(new CustomEvent("proto-change", { detail: { key: k, value: v } })); } catch (e) {} }
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  function tag(t) { return el("span", "simtag", t); }
  function opts(o) { return (o || []).map(function (x) { return Array.isArray(x) ? x : [x, x]; }); }

  var P = window.P = {
    /* 设置本需求的模拟状态默认值；key 可选（默认按需求标题区分，不同需求的原型互不影响） */
    init: function (cfg) { cfg = cfg || {}; if (cfg.key) KEY = "proto-" + cfg.key; D = cfg.defaults || {}; return P; },
    get: function (k) { var s = load(); return k in s ? s[k] : D[k]; },
    set: function (k, v) { var s = load(); s[k] = v; save(s); fire(k, v); },
    /* 清空原型状态：回到默认值 */
    reset: function () { mem = {}; try { sessionStorage.removeItem(KEY); } catch (e) {} fire("*", null); },
    $: function (id) { return document.getElementById(id); },
    /* 演示反馈：只显示在模拟操作面板里、紧跟被操作的控件，带「原型演示」标签，告诉看原型的人这一步操作已生效。
       它不是页面效果，不会出现在手机画面或后台页面上；研发不用实现。anchor 是被操作的控件或它所在的那一行。 */
    note: function (msg, anchor) {
      var row = anchor && (anchor.closest(".simrow, label") || anchor), box = row && row.closest(".sim");
      if (!row || !box) return;
      var fb = row.nextElementSibling && row.nextElementSibling.classList.contains("simfb") ? row.nextElementSibling : null;
      if (!fb) { fb = el("div", "simfb"); fb.setAttribute("role", "status"); row.parentNode.insertBefore(fb, row.nextSibling); }
      fb.textContent = ""; fb.appendChild(el("span", "simfbtag", "原型演示")); fb.appendChild(document.createTextNode(msg)); fb.appendChild(el("span", "simfbtip", "演示反馈，页面上不显示"));
    },
    /* Toast：只用于需求本身要求页面显示的提示（属于页面效果，研发要实现）。页面里放 <div class="toast" id="toast" hidden></div>。
       原型操作的反馈不要用它，用 P.note。 */
    toast: function (msg, ms) {
      var t = document.getElementById("toast"); if (!t) return;
      t.textContent = msg; t.hidden = false;
      clearTimeout(P._t); P._t = setTimeout(function () { t.hidden = true; }, ms || 2200);
    },
    go: function (page, delay) { if (delay) setTimeout(function () { location.href = page; }, delay); else location.href = page; },
    /* 弹窗：页面里放 id 为 ov（遮罩）、ov-t（标题）、ov-p（正文）、ov-ok（按钮）的元素 */
    dialog: function (title, text, after) {
      if (!P.$("ov")) return alert(title + "\n" + text);
      P.$("ov-t").textContent = title; P.$("ov-p").textContent = text; P.$("ov").hidden = false;
      P.$("ov-ok").onclick = function () { P.$("ov").hidden = true; if (after) after(); };
    },
    /* 倒计时：按结束时间戳计算，离开页面再进入剩余秒数连续。start 开始，left 取剩余秒数，end 立即结束 */
    start: function (k, seconds) { P.set(k, Date.now() + seconds * 1000); },
    left: function (k) { return Math.max(0, Math.ceil(((+P.get(k) || 0) - Date.now()) / 1000)); },
    end: function (k) { P.set(k, Date.now()); },

    /* 模拟操作面板：按分组生成，控件文字全部用 textContent 写入 */
    panel: function (box, groups) {
      if (!box) return;
      box.textContent = "";
      (groups || []).forEach(function (g) {
        if (g.title) box.appendChild(el("div", "simgrp", g.title));
        (g.items || []).forEach(function (it) { var n = P.item(it); if (n) box.appendChild(n); });
      });
    },
    item: function (it) {
      var n, lb;
      switch (it.type) {
        case "select":   /* 下拉：切换端、后台配置项（取值写进模拟状态 it.key） */
          lb = el("label"); lb.appendChild(document.createTextNode((it.label || it.key) + " "));
          n = el("select");
          opts(it.options).forEach(function (o) { var op = el("option", "", o[1]); op.value = String(o[0]); n.appendChild(op); });
          n.value = String(P.get(it.key));
          n.onchange = function () { var v = n.value; if (typeof D[it.key] === "number") v = Number(v); P.set(it.key, v); P.note("已设为：" + n.options[n.selectedIndex].text, n); if (it.change) it.change(v); };
          lb.appendChild(n); return lb;
        case "check":    /* 勾选：后台开关、用户条件 */
          lb = el("label"); n = el("input"); n.type = "checkbox"; n.checked = !!P.get(it.key);
          n.onchange = function () { P.set(it.key, n.checked); P.note((n.checked ? "已开启：" : "已关闭：") + (it.label || it.key), n); if (it.change) it.change(n.checked); };
          lb.appendChild(n); lb.appendChild(document.createTextNode(" " + (it.label || it.key))); return lb;
        case "radio":    /* 一组按钮：设置用户状态（正常、冻结、停用…） */
          var wrap = el("div", "simrow");
          opts(it.options).forEach(function (o) {
            var b = el("button"); b.type = "button"; b.appendChild(tag(it.tag || "状态")); b.appendChild(document.createTextNode(o[1]));
            b.setAttribute("aria-pressed", String(P.get(it.key)) === String(o[0]));
            b.onclick = function () { P.set(it.key, o[0]); wrap.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", x === b); }); P.note("已设为：" + o[1], b); if (it.change) it.change(o[0]); };
            wrap.appendChild(b);
          });
          return wrap;
        case "button":   /* 注入异常等一次性操作 */
          n = el("button"); n.type = "button"; n.appendChild(tag(it.tag || "模拟")); n.appendChild(document.createTextNode(it.label));
          n.onclick = function () { P.note("已模拟：" + it.label, n); if (it.run) it.run(); }; return n;
        case "countdown":   /* 让倒计时立即结束 */
          n = el("button"); n.type = "button"; n.appendChild(tag("模拟")); n.appendChild(document.createTextNode(it.label || "让倒计时立即结束"));
          n.onclick = function () { P.end(it.key); P.note("倒计时已结束", n); if (it.run) it.run(); }; return n;
        case "sms":      /* 模拟收到短信：把演示验证码交给页面填入 */
          n = el("button"); n.type = "button"; n.appendChild(tag("模拟")); n.appendChild(document.createTextNode((it.label || "模拟收到短信") + (it.code ? "（自动填入 " + it.code + "）" : "")));
          n.onclick = function () { P.note("已模拟收到短信，验证码 " + (it.code || "") + " 已填入", n); if (it.fill) it.fill(it.code || ""); }; return n;
        case "note":     /* 演示值说明 */
          return el("p", "simnote", it.text);
        case "reset":    /* 清空原型状态 */
          n = el("button"); n.type = "button"; n.appendChild(tag("模拟")); n.appendChild(document.createTextNode(it.label || "清空原型状态（回到默认值）"));
          n.onclick = function () { P.reset(); location.reload(); }; return n;
      }
      return null;
    }
  };
})();

/* 前台原型英文化（所有需求通用，需求包框架规范第 4 节「原型语言」）：只翻译手机画面 .app 里的文字和 placeholder、title、aria-label、alt、按钮 value，
   规则批注、模拟场景、模拟操作不在 .app 里，不翻译。对照表在 assets/proto-en.js（window.PROTO_EN）。
   语言：发布站点由 build_role_sites.ps1 在 nav-data.js 里写 window.PROTO_LANG = "en"；本地预览地址加 ?lang=en / ?lang=zh 切换（当前标签页记住）。
   本地 ?lang=en 预览时，没有英文的中文用红框标出，左下角显示漏翻条数，控制台列出全部漏翻原文。 */
(function () {
  var q = /[?&]lang=(en|zh)\b/.exec(location.search), mode;
  try { if (q) sessionStorage.setItem("proto-lang", q[1]); mode = q ? q[1] : sessionStorage.getItem("proto-lang"); } catch (e) { mode = q && q[1]; }
  var preview = !!mode; mode = mode || window.PROTO_LANG || "zh";
  if (mode !== "en") return;
  var D = window.PROTO_EN || {}, exact = {}, pats = [], missing = {}, bd = null;
  Object.keys(D).forEach(function (k) {
    if (!/\{\w+\}/.test(k)) { exact[k.trim()] = D[k]; return; }
    var names = [], src = "^" + k.trim().replace(/[.*+?^$()|[\]\\]/g, "\\$&").replace(/\{(\w+)\}/g, function (_, n) { names.push(n); return "(.+?)"; }) + "$";
    pats.push({ re: new RegExp(src), names: names, v: D[k] });
  });
  var CJK = /[㐀-鿿　-〿！-｠]/;
  /* 返回译文；null 表示不需要翻译（没有中文）；undefined 表示对照表里没有 */
  function tr(s) {
    var t = String(s).trim(); if (!t || !CJK.test(t)) return null;
    var out = exact[t];
    if (out == null) for (var i = 0; i < pats.length; i++) {
      var m = pats[i].re.exec(t); if (!m) continue;
      out = pats[i].v.replace(/\{(\w+)\}/g, function (all, n) { var j = pats[i].names.indexOf(n); if (j < 0) return all; var x = tr(m[j + 1]); return x == null ? m[j + 1] : x === undefined ? m[j + 1] : x; });
      break;
    }
    if (out == null) { missing[t] = 1; return undefined; }
    return String(s).replace(t, out);
  }
  var ATTRS = ["placeholder", "title", "aria-label", "alt", "value"];
  function miss(el) { if (preview && el && el.classList) el.classList.add("en-miss"); }
  function walk(n) {
    if (n.nodeType === 3) { var r = tr(n.nodeValue); if (r) n.nodeValue = r; else if (r === undefined) miss(n.parentNode); return; }
    if (n.nodeType !== 1 || n.tagName === "SCRIPT" || n.tagName === "STYLE") return;
    ATTRS.forEach(function (a) {
      if (a === "value" && !(n.tagName === "BUTTON" || (n.tagName === "INPUT" && /^(button|submit|reset)$/i.test(n.type)))) return;
      var v = n.getAttribute(a); if (!v) return;
      var r = tr(v); if (r) n.setAttribute(a, r); else if (r === undefined) miss(n);
    });
    for (var c = n.firstChild; c; c = c.nextSibling) walk(c);
  }
  function badge() {
    if (!preview) return;
    var k = Object.keys(missing).length;
    if (!bd) { bd = document.createElement("div"); bd.className = "en-badge"; bd.setAttribute("role", "status"); document.body.appendChild(bd); }
    bd.textContent = k ? "英文预览：" + k + " 条中文没有英文（红框标出，原文见控制台）" : "英文预览：手机画面已全部显示英文";
    bd.classList.toggle("ok", !k);
  }
  function report() { var k = Object.keys(missing); if (k.length && window.console) console.warn("前台原型英文化：以下中文在 assets/proto-en.js 里没有英文（共 " + k.length + " 条）：\n" + k.join("\n")); badge(); }
  function start() {
    var apps = document.querySelectorAll(".app");
    [].forEach.call(apps, function (app) {
      for (var ch = app.firstChild; ch; ch = ch.nextSibling) walk(ch);   /* .app 外框本身的 aria-label（如「手机画面」）是原型说明，不翻译 */
      new MutationObserver(function (ms) {
        ms.forEach(function (m) {
          if (m.type === "childList") [].forEach.call(m.addedNodes, walk);
          else walk(m.target);
        });
        badge();
      }).observe(app, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
    });
    if (apps.length) { document.documentElement.setAttribute("data-proto-lang", "en"); report(); }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();