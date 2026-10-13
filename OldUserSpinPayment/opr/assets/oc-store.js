/* 「运营需求确认」页的数据：本机保存（IndexedDB）+ 共享文件夹里的版本文件。
   入口页「运营需求修改记录」、需求修改总结、运营需求确认页共用。
   本机：IndexedDB 库名 = KEY，表 kv，键 state（数据）、dir（共享文件夹）；不可用时 localStorage 的 KEY + "-state"。 */
window.OCStore = {
  key: function (topic) { return topic + "功能需求-运营需求确认"; },   /* 不含版本号：升版本后数据保留 */
  open: function (key) {
    return new Promise(function (res) {
      try {
        var r = indexedDB.open(key, 1);
        r.onupgradeneeded = function () { r.result.createObjectStore("kv"); };
        r.onsuccess = function () { res(r.result); };
        r.onerror = r.onblocked = function () { res(null); };
      } catch (e) { res(null); }
    });
  },
  get: function (key, name) {
    return OCStore.open(key).then(function (db) {
      return new Promise(function (res) {
        if (!db) return res(null);
        try { var q = db.transaction("kv").objectStore("kv").get(name); q.onsuccess = function () { db.close(); res(q.result || null); }; q.onerror = function () { db.close(); res(null); }; }
        catch (e) { db.close(); res(null); }
      });
    });
  },
  put: function (key, name, val) {
    return OCStore.open(key).then(function (db) {
      return new Promise(function (res) {
        if (!db) return res(false);
        try { var tx = db.transaction("kv", "readwrite"); tx.objectStore("kv").put(val, name); tx.oncomplete = function () { db.close(); res(true); }; tx.onerror = tx.onabort = function () { db.close(); res(false); }; }
        catch (e) { db.close(); res(false); }
      });
    });
  },
  read: function (key) {
    return OCStore.get(key, "state").then(function (s) {
      if (s) return s;
      try { var t = localStorage.getItem(key + "-state"); return t ? JSON.parse(t) : null; } catch (e) { return null; }
    });
  },
  write: function (key, state) { return OCStore.put(key, "state", JSON.parse(JSON.stringify(state))); },
  /* 版本按提交时间倒序（最新在最上面），时间相同按版本号倒序 */
  byTime: function (vs) {
    return (vs || []).slice().sort(function (a, b) { return (b.at || "").localeCompare(a.at || "") || b.major - a.major || b.minor - a.minor; });
  },
  byVersion: function (vs) {
    return (vs || []).slice().sort(function (a, b) { return b.major - a.major || b.minor - a.minor; });
  },
  /* 这条意见产品是否已回复：已回复后运营不能修改或删除这条意见，产品也不能再改第一条回复，只能补充 */
  replied: function (r) { return !!(r && r.repliedAt && ((r.reply || "").trim() || (r.decision && r.decision !== "待确认"))); },
  /* 最新的「是否修改」结论：补充记录里最后一次调整的结论；没有调整过就是第一条回复的结论 */
  dec: function (r) {
    var d = (r && r.decision) || "待确认";
    ((r && r.notes) || []).forEach(function (n) { if (n.decision) d = n.decision; });
    return d;
  },
  stats: function (v) {
    var c = { "确认修改": 0, "部分修改": 0, "不修改": 0, "待确认": 0 }, replied = 0;
    (v.rows || []).forEach(function (r) { var d = OCStore.dec(r); c[d] = (c[d] || 0) + 1; if (OCStore.replied(r)) replied++; });
    return { total: (v.rows || []).length, replied: replied, dec: c };
  },
  /* 补充记录排序：按时间先后 */
  sortNotes: function (ns) { return (ns || []).slice().sort(function (a, b) { return (a.at || "").localeCompare(b.at || "") || (a.id || "").localeCompare(b.id || ""); }); },
  /* 当前时间，一律按 GMT+8（不依赖电脑时区），精确到秒：YYYY-MM-DD HH:mm:ss */
  stamp: function () { return new Date(Date.now() + 8 * 3600 * 1000).toISOString().slice(0, 19).replace("T", " "); },
  /* 截图：只接受苹果、Windows 常见的格式（PNG、JPG、WEBP、GIF、BMP），且只能是 base64 内容，与云端接口一致 */
  IMG_RE: /^data:image\/(png|jpeg|jpg|webp|gif|bmp);base64,[A-Za-z0-9+\/=]+$/,
  okImg: function (s) { return typeof s === "string" && OCStore.IMG_RE.test(s); },
  /* 显示截图：用 DOM 创建 img 并赋值 src，不拼进 innerHTML。旧数据里的截图只要是 data:image 开头就照常显示 */
  imgEl: function (src, alt) {
    var im = document.createElement("img");
    im.alt = alt || "截图"; im.loading = "lazy"; im.decoding = "async";
    if (typeof src === "string" && /^data:image\//.test(src)) im.src = src;
    return im;
  },
  /* 截图缩略图按钮（点了看大图）；没有截图时显示「无截图」 */
  thumbs: function (box, imgs, data) {
    imgs = imgs || [];
    if (!imgs.length) { var s = document.createElement("span"); s.className = "oc-noimg"; s.textContent = "无截图"; box.appendChild(s); return; }
    imgs.forEach(function (src, k) {
      var b = document.createElement("button"); b.type = "button"; b.className = "oc-th"; b.title = "查看大图";
      Object.keys(data || {}).forEach(function (x) { b.dataset[x] = data[x]; });
      b.dataset.img = k; b.dataset.k = k;
      b.appendChild(OCStore.imgEl(src, "截图 " + (k + 1)));
      box.appendChild(b);
    });
  },
  /* 封板记录：云端的记录；没有记录但本机有封板（旧数据）时按一条封板显示 */
  ROLE_NAME: { pdm: "产品", opr: "运营" },
  sealLog: function (S) {
    if (S && Array.isArray(S.sealLog) && S.sealLog.length) return S.sealLog;
    return S && S.sealed ? [{ at: S.sealed.at, role: S.sealed.role || "", action: "封板", ver: S.sealed.ver, name: S.sealed.name }] : [];
  },
  sealLine: function (e) {
    return (e.at || "—") + "（GMT+8）· " + (OCStore.ROLE_NAME[e.role] || "角色未记录") + " · " + e.action + (e.pending ? " · 未同步到云端" : "");
  },
  /* 封板记录列表元素（文字用 textContent 写入）；没有记录返回 null */
  sealLogEl: function (S) {
    var L = OCStore.sealLog(S); if (!L.length) return null;
    var box = document.createElement("div"); box.className = "oc-seallog";
    var h = document.createElement("b"); h.textContent = "封板记录"; box.appendChild(h);
    var ol = document.createElement("ol");
    L.forEach(function (e) { var li = document.createElement("li"); li.textContent = OCStore.sealLine(e); li.className = e.action === "封板" ? "a-seal" : "a-unseal"; ol.appendChild(li); });
    box.appendChild(ol);
    return box;
  },
  /* 封板提示条文字 */
  sealText: function (s) {
    var who = OCStore.ROLE_NAME[s.role];
    return "🔒 运营需求已于 " + s.at + "（GMT+8）" + (who ? "由" + who : "") + "封板，最终版本 v" + s.ver + "。本页不能再添加、修改或提交意见；产品仍可回复和补充，运营只能查看、复制和下载。";
  }
};

/* 共享文件夹：运营提交的每个版本、产品的回复都以文件形式写进同一个文件夹（如共享的 OneDrive 文件夹），
   产品、运营在任何窗口、浏览器打开页面时从这个文件夹读取，所以换浏览器、换电脑也能看到。
   需要 Chrome 或 Edge（读写本机文件夹的接口）；其他浏览器退回「自动下载版本文件 + 手动导入」。 */
window.OCSync = {
  supported: typeof window.showDirectoryPicker === "function",
  DEC: ["待确认", "确认修改", "部分修改", "不修改"],
  SEAL: "运营需求封板.json",
  fileName: function (v) { return String(v.name).replace(/[\\/:*?"<>|]/g, "").replace(/\s+/g, "-") + ".html"; },
  /* 取已连接的文件夹；ask 为 true 时（必须在点击里调用）可以弹出授权 */
  dir: function (key, ask) {
    return OCStore.get(key, "dir").then(function (h) {
      if (!h || !h.queryPermission) return { handle: null, state: "none" };
      return h.queryPermission({ mode: "readwrite" }).then(function (p) {
        if (p === "granted") return { handle: h, state: "ok" };
        if (!ask) return { handle: h, state: "prompt" };
        return h.requestPermission({ mode: "readwrite" }).then(function (p2) { return { handle: p2 === "granted" ? h : null, state: p2 === "granted" ? "ok" : "denied" }; });
      });
    }).catch(function () { return { handle: null, state: "none" }; });
  },
  connect: function (key) {
    return window.showDirectoryPicker({ id: "oc-share", mode: "readwrite" }).then(function (h) {
      return OCStore.put(key, "dir", h).then(function () { return h; });
    });
  },
  /* 读取文件夹里的全部版本文件（内嵌 <script id="oc-data"> 的 HTML）和封板文件 */
  readAll: async function (h, topic) {
    var vers = [], seal = null;
    for await (var entry of h.values()) {
      if (entry.kind !== "file") continue;
      try {
        if (entry.name === OCSync.SEAL) { var j = JSON.parse(await (await entry.getFile()).text()); if (j && j.topic === topic && j.sealed) seal = j.sealed; continue; }
        if (!/\.html?$/i.test(entry.name)) continue;
        var t = await (await entry.getFile()).text();
        var m = /<script type="application\/json" id="oc-data">([\s\S]*?)<\/script>/.exec(t);
        if (!m) continue;
        var d = JSON.parse(m[1]);
        if (d && d.kind === "oc-version" && d.topic === topic && d.version && Array.isArray(d.version.rows)) vers.push(d.version);
      } catch (e) { /* 读不了的文件跳过 */ }
    }
    return { versions: vers, sealed: seal };
  },
  writeFile: async function (h, name, text) {
    var f = await h.getFileHandle(name, { create: true });
    var w = await f.createWritable(); await w.write(text); await w.close();
  },
  /* 清理文件里的意见内容：在离线文档里只留文字格式和内嵌截图 */
  clean: function (html) {
    var box = new DOMParser().parseFromString(String(html || ""), "text/html").body;
    box.querySelectorAll("script,style,meta,link,iframe,object,embed,form,input,button,svg").forEach(function (n) { n.remove(); });
    box.querySelectorAll("img").forEach(function (im) { if (!/^data:image\//.test(im.getAttribute("src") || "")) im.remove(); });
    box.querySelectorAll("*").forEach(function (n) {
      [].slice.call(n.attributes).forEach(function (a) { if (!/^(src|alt|href|colspan|rowspan)$/.test(a.name)) n.removeAttribute(a.name); });
      if (n.hasAttribute("href") && !/^https?:/i.test(n.getAttribute("href"))) n.removeAttribute("href");
    });
    return box.innerHTML;
  },
  /* 补充记录清洗：只保留需要的字段 */
  cleanNotes: function (ns) {
    var DEC = OCSync.DEC;
    return (Array.isArray(ns) ? ns : []).filter(function (n) { return n && n.id && String(n.text || "").trim(); }).map(function (n) {
      return { id: String(n.id).slice(0, 40), role: n.role === "pdm" ? "pdm" : "opr", text: String(n.text).slice(0, 2000), at: String(n.at || ""),
        decision: n.decision && DEC.indexOf(n.decision) > 0 ? n.decision : "" };
    });
  },
  /* 把云端或文件里的数据合并进本机数据 S（只增不删，任何一方已有的内容都不会被删除）：
     本机没有的版本 → 加进来；同名版本 → 补充记录按编号合并；
     产品第一条回复：cloud 为 true（云端数据）时一律以云端为准，本机写的不同内容放进这条意见的补充草稿；
       文件数据时以先写入的为准（本机已回复的不再覆盖）。
     封板：云端数据时以云端状态和封板记录为准（本机还没传上去的封板 / 撤销除外）；文件数据时对方已封板而本机没有 → 记为封板。
     返回新增版本数、更新处数和回复冲突数。 */
  merge: function (S, data, cloud) {
    var added = 0, updated = 0, conflicts = 0, DEC = OCSync.DEC;
    S.versions = S.versions || [];
    (data.versions || []).forEach(function (iv) {
      var rows = iv.rows.map(function (r) {
        return { html: OCSync.clean(r.html), imgs: (r.imgs || []).filter(function (s) { return /^data:image\//.test(s); }),
          pri: ["高", "中", "低"].indexOf(r.pri) >= 0 ? r.pri : "中", reply: String(r.reply || ""),
          decision: DEC.indexOf(r.decision) >= 0 ? r.decision : DEC[0], repliedAt: String(r.repliedAt || ""),
          notes: OCSync.cleanNotes(r.notes), src: r.src && r.src.name ? { name: String(r.src.name), i: +r.src.i || 0 } : null };
      });
      var ex = S.versions.filter(function (x) { return x.name === iv.name; })[0];
      if (!ex) {
        S.seq = (S.seq || 0) + 1;
        S.versions.push({ id: "v" + S.seq, major: +iv.major || 1, minor: +iv.minor || 0, at: String(iv.at || ""), name: String(iv.name), from: iv.from ? String(iv.from) : "", rows: rows });
        added++; return;
      }
      ex.rows.forEach(function (r, i) {
        var f = rows[i]; if (!f) return;
        if (!r.notes) r.notes = [];
        if (!OCStore.replied(r) && OCStore.replied(f)) { r.reply = f.reply; r.decision = f.decision; r.repliedAt = f.repliedAt; updated++; }
        else if (cloud && OCStore.replied(r) && OCStore.replied(f) && (String(r.reply || "") !== f.reply || r.decision !== f.decision || r.repliedAt !== f.repliedAt)) {
          /* 两台电脑先后回复：第一条回复以云端为准，本机写的文字放进补充草稿，不丢 */
          var mine = String(r.reply || "").trim(), diff = mine !== f.reply.trim() || r.decision !== f.decision;
          if (diff && mine) {
            S.drafts = S.drafts || {};
            var dk = ex.name + "#" + i, dr = S.drafts[dk] = S.drafts[dk] || {};
            if ((dr.note || "").indexOf(mine) < 0) dr.note = dr.note ? dr.note + "\n" + mine : mine;
          }
          r.reply = f.reply; r.decision = f.decision; r.repliedAt = f.repliedAt;
          if (diff) { conflicts++; updated++; }
        }
        var have = {}; (r.notes || []).forEach(function (n) { have[n.id] = 1; });
        var more = f.notes.filter(function (n) { return !have[n.id]; });
        if (more.length) { r.notes = OCStore.sortNotes((r.notes || []).concat(more)); updated += more.length; }
      });
    });
    if (cloud) {
      /* 1.2.0 及以前本机封板了、但没传上云端（云端没有任何封板记录）：保留本机封板，记为待上传 */
      if (S.sealed && S.sealLog === undefined && !data.sealed && !(data.sealLog || []).length) S.sealPending = "seal";
      if (!S.sealPending) {
        if (JSON.stringify(S.sealed || null) !== JSON.stringify(data.sealed || null)) { S.sealed = data.sealed || null; updated++; }
        S.sealLog = Array.isArray(data.sealLog) ? data.sealLog : [];
      } else if (Array.isArray(data.sealLog)) {
        S.sealLog = data.sealLog.concat((S.sealLog || []).filter(function (e) { return e.pending; }));
      }
    } else if (data.sealed && !S.sealed) { S.sealed = data.sealed; updated++; }
    return { added: added, updated: updated, conflicts: conflicts };
  },
  /* 只读页面（入口页、需求修改总结）用：从云端（配置了接口时）或共享文件夹读取并合并进本机数据，返回 { state, name, count, res, S } */
  pull: function (key, topic, ask) {
    if (window.OCRemote && OCRemote.enabled()) {
      return Promise.all([OCStore.read(key), OCRemote.pull(topic)]).then(function (x) {
        var S = x[0] || { draft: "", items: [], versions: [], mod: null, seq: 0, sealed: null };
        var res = OCSync.merge(S, x[1], true);
        return OCStore.write(key, S).then(function () { return { state: "cloud", name: "云端", count: x[1].versions.length, res: res, S: S }; });
      }).catch(function (e) { return { state: "err", msg: OCRemote.explain(e) }; });
    }
    if (!OCSync.supported) return Promise.resolve({ state: "na" });
    return OCSync.dir(key, ask).then(function (r) {
      if (!r.handle) return { state: r.state, name: "" };
      return Promise.all([OCStore.read(key), OCSync.readAll(r.handle, topic)]).then(function (x) {
        var S = x[0] || { draft: "", items: [], versions: [], mod: null, seq: 0, sealed: null };
        var res = OCSync.merge(S, x[1]);
        return OCStore.write(key, S).then(function () { return { state: "ok", name: r.handle.name, count: x[1].versions.length, res: res, S: S }; });
      });
    }).catch(function (e) { return { state: "err", msg: e && e.message || String(e) }; });
  },
  /* 只读页面的「共享文件夹」小条：显示状态，按钮可连接、授权或同步；同步后调用 onDone(S) 重新显示 */
  bar: function (el, key, topic, onDone) {
    if (!el) return;
    el.innerHTML = '<span class="oc-sync-t"></span><button type="button" class="oc-a"></button>';
    var t = el.querySelector("span"), b = el.querySelector("button"), mode = "none";
    function show(r) {
      el.className = "oc-sync s-" + r.state;
      if (r.state === "na") { t.textContent = "当前浏览器不支持共享文件夹（请用 Chrome 或 Edge），只显示本机数据"; b.hidden = true; return; }
      mode = r.state;
      if (r.state === "loading") { t.textContent = "正在读取云端…"; b.textContent = "刷新"; return; }
      if (r.state === "cloud") { t.textContent = "云端：已同步 " + r.count + " 个版本" + (r.res && r.res.added ? "，新增 " + r.res.added + " 个" : "") + " · 每分钟自动刷新"; b.textContent = "刷新"; return; }
      if (r.state === "wait") { t.textContent = "云端：输入产品密码后自动读取"; b.textContent = "刷新"; return; }
      if (r.state === "err" && OCRemote.enabled()) { t.textContent = "云端读取失败：" + (r.msg || ""); b.textContent = "重试"; return; }
      if (r.state === "ok") { t.textContent = "共享文件夹：「" + r.name + "」 · 读取 " + r.count + " 个版本文件" + (r.res && r.res.added ? "，新增 " + r.res.added + " 个版本" : ""); b.textContent = "同步"; }
      else if (r.state === "prompt") { t.textContent = "共享文件夹需要重新授权"; b.textContent = "授权并同步"; }
      else if (r.state === "err") { t.textContent = "共享文件夹读取失败：" + (r.msg || ""); b.textContent = "重新连接"; }
      else { t.textContent = "共享文件夹：未连接，只显示本机数据。连接运营提交版本文件的文件夹后，换浏览器也能看到"; b.textContent = "连接文件夹"; }
    }
    function run(ask) {
      if (OCRemote.enabled() && !OCRemote.ready()) { show({ state: "wait" }); return Promise.resolve(); }
      return OCSync.pull(key, topic, ask).then(function (r) { show(r); if (r.S) onDone(r.S); });
    }
    if (OCRemote.enabled()) show({ state: "loading" });
    window.addEventListener("pdm-unlocked", function () { run(false); });
    b.onclick = function () {
      if (OCRemote.enabled()) return run(false);
      if (mode === "none" || mode === "err") OCSync.connect(key).then(function () { return run(false); }).catch(function () {});
      else run(true);
    };
    run(false);
    if (OCRemote.enabled()) setInterval(function () { if (!document.hidden) run(false); }, 60000);   /* 云端模式每分钟自动刷新 */
  }
};

/* 云端存储（Cloudflare Worker + KV，代码见 Product Materials\_共享服务\oc-worker.js）。
   nav-data.js 写了 api（接口地址）时启用；运营用 nav-data.js 里的运营写入口令 oprKey，产品用进入时输入的产品密码。
   所有电脑、浏览器读写同一份数据：运营提交的意见和截图、产品的回复、封板状态。 */
window.OCRemote = {
  api: function () { var d = window.NAV_DATA || {}; return d.api ? String(d.api).replace(/\/+$/, "") : ""; },
  enabled: function () { return !!OCRemote.api(); },
  /* 产品还没在密码页输入密码时没有身份凭证，先不访问云端（输入后 nav.js 发出 pdm-unlocked 事件再读） */
  ready: function () {
    if (!(window.NAV && NAV.realRole === "pdm")) return true;
    try { return !!sessionStorage.getItem("req-pdm-key"); } catch (e) { return false; }
  },
  auth: function () {
    if (window.NAV && NAV.realRole === "pdm") { var k = ""; try { k = sessionStorage.getItem("req-pdm-key") || ""; } catch (e) {} return { role: "pdm", key: k }; }
    return { role: "opr", key: (window.NAV_DATA && NAV_DATA.oprKey) || "" };
  },
  req: function (method, path, body) {
    var a = OCRemote.auth();
    return fetch(OCRemote.api() + path, {
      method: method, cache: "no-store",
      headers: { "Content-Type": "application/json", "X-OC-Role": a.role, "X-OC-Key": a.key },
      body: body ? JSON.stringify(body) : undefined
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) {
        if (!r.ok) { var e = new Error(j.error || ("接口返回 " + r.status)); e.status = r.status; e.body = j; throw e; }
        return j;
      });
    }, function (e) { var x = new Error(e && e.message || "网络错误"); x.status = 0; throw x; });
  },
  /* 把接口错误翻译成看得懂的原因和处理办法（页面顶部「云端：……」显示这段话） */
  explain: function (e) {
    var s = e && e.status, pdm = window.NAV && NAV.realRole === "pdm";
    if (s === 0) return "连不上云端。请先检查网络；网络正常仍连不上时，请联系该需求的产品管理人（可能是云端接口被停用）";
    if (s === 401) return pdm ? "产品密码不对，或云端接口里的产品密码没配置。请关闭页面后重新打开产品链接并输入正确的密码；仍不行请联系产品管理人核对 Cloudflare 里的 PDM_PASS"
                              : "运营写入口令不对，暂时不能读写。请联系该需求的产品管理人重新打包需求（或核对 Cloudflare 里的 OPR_KEY）";
    if (s === 400 || s === 403 || s === 409) return (e && e.message) || "提交被拒绝，请刷新后再试";
    if (s === 413) return (e.message || "这个版本太大") + "（可减少截图后分两次提交）";
    if (s === 423) return "运营需求已封板，不能再提交新版本；确实要继续提意见时，请联系产品管理人";
    if (s === 429) return "云端服务今天的免费次数已用完，请稍后再试；经常出现时请联系产品管理人";
    if (s >= 500) return "云端服务暂时不可用，请稍后再试；多次出现时请联系产品管理人（" + (e.message || s) + "）";
    return (e && e.message) || "未知错误";
  },
  path: function (topic) { return "/topics/" + encodeURIComponent(topic); },
  pull: function (topic) {
    return OCRemote.req("GET", OCRemote.path(topic)).then(function (j) {
      return { versions: (j.versions || []).filter(function (v) { return v && v.name && Array.isArray(v.rows); }), sealed: j.sealed || null,
        sealLog: Array.isArray(j.sealLog) ? j.sealLog : (j.sealed ? [{ at: j.sealed.at, role: j.sealed.role || "", action: "封板", ver: j.sealed.ver, name: j.sealed.name }] : []) };
    });
  },
  /* 产品第一条回复：单独提交；云端已有回复时返回 409，错误里带云端的回复（e.body.current） */
  pushReply: function (topic, name, i, r) {
    return OCRemote.req("PUT", OCRemote.path(topic) + "/versions/" + encodeURIComponent(name) + "/replies/" + i, { reply: r.reply || "", decision: r.decision || "待确认", repliedAt: r.repliedAt || "" });
  },
  pushVersion: function (topic, v) {
    var body = { name: v.name, major: v.major, minor: v.minor, at: v.at, from: v.from || "",
      rows: v.rows.map(function (r) { return { html: r.html, imgs: r.imgs, pri: r.pri, reply: r.reply || "", decision: r.decision || "待确认", repliedAt: r.repliedAt || "", src: r.src || null }; }) };
    return OCRemote.req("PUT", OCRemote.path(topic) + "/versions/" + encodeURIComponent(v.name), body);
  },
  /* 补充记录：只增不改；服务端记录角色和时间 */
  pushNote: function (topic, name, i, note) {
    return OCRemote.req("PUT", OCRemote.path(topic) + "/versions/" + encodeURIComponent(name) + "/notes", { i: i, id: note.id, text: note.text, at: note.at, decision: note.decision || "" });
  },
  /* 封板 / 撤销封板：action 为 "seal" 或 "unseal"；返回云端的封板状态和全部封板记录 */
  pushSeal: function (topic, action, ver, name) { return OCRemote.req("PUT", OCRemote.path(topic) + "/seal", { action: action, ver: ver || "", name: name || "" }); }
};
