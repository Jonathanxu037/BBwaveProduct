/* 产品需求管理系统 · 前端逻辑
 * 写入通道（新增需求时创建文件夹并更新 data/requirements.json）按以下顺序选择：
 *   1. 本地管理模式：由 工具\prd-hub-server.ps1 提供的 api/（只在本机运行）
 *   2. GitHub 模式：浏览器用访问令牌调用 GitHub API，直接向仓库提交（一次提交，原子操作）
 *   3. 都没有时为只读模式：可以浏览列表，新增时先引导配置 GitHub 连接
 */
(function () {
  'use strict';

  var CFG = window.PRDHUB_CONFIG || {};
  var GATE = CFG.gate || {};
  var MAX_TRY = CFG.maxAttempts || 5;
  var LOCK_SEC = CFG.lockSeconds || 30;
  var INIT_VER = CFG.initialVersion || 'v1.0';
  var DATA_PATH = 'data/requirements.json';
  var K_AUTH = 'prdhub.auth', K_FAIL = 'prdhub.fail', K_GH = 'prdhub.github';
  // 仓库根目录已占用或有特殊含义的名字，不能作为需求文件夹名
  var RESERVED = ['assets', 'data', 'api', 'tools', 'index', 'readme', 'pdm', 'opr', 'dev', 'docs', 'node_modules'];
  var FOLDER_RE = /^[A-Za-z][A-Za-z0-9_-]{1,39}$/;

  var state = { mode: 'readonly', items: [], gh: null, roleTimes: {} };

  function $(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function sGet(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }
  function sSet(k, v) { try { v == null ? sessionStorage.removeItem(k) : sessionStorage.setItem(k, v); } catch (e) {} }
  function lGet(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } }
  function lSet(k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function fmt(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    if (isNaN(d)) return '';
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }

  var toastTimer;
  function toast(msg) {
    var t = $('toast');
    t.textContent = msg; t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.hidden = true; }, 3200);
  }

  /* ---------- 登录 ---------- */

  function sha256Hex(text) {
    if (!(window.crypto && crypto.subtle)) return Promise.reject(new Error('nocrypto'));
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)).then(function (buf) {
      return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
    });
  }

  function isAuthed() { return !!GATE.hash && sGet(K_AUTH) === GATE.hash; }

  var lockTimer;
  function lockLeft() {
    var f = lGet(K_FAIL);
    return f && f.until ? Math.max(0, Math.ceil((f.until - Date.now()) / 1000)) : 0;
  }
  function renderLock() {
    clearInterval(lockTimer);
    var left = lockLeft();
    var btn = $('loginBtn'), pwd = $('pwd'), err = $('loginErr');
    if (left > 0) {
      btn.disabled = true; pwd.disabled = true;
      var tick = function () {
        var l = lockLeft();
        if (l <= 0) {
          clearInterval(lockTimer);
          btn.disabled = false; pwd.disabled = false; err.textContent = ''; pwd.focus();
          return;
        }
        err.textContent = '连续输错 ' + MAX_TRY + ' 次，请 ' + l + ' 秒后再试。';
      };
      tick();
      lockTimer = setInterval(tick, 1000);
    } else {
      btn.disabled = false; pwd.disabled = false;
    }
  }

  function onLogin(e) {
    e.preventDefault();
    if (lockLeft() > 0) return;
    var pwd = $('pwd'), err = $('loginErr'), v = pwd.value;
    if (!v) { err.textContent = '请输入密码。'; pwd.focus(); return; }
    $('loginBtn').disabled = true;
    sha256Hex((GATE.salt || '') + v).then(function (h) {
      $('loginBtn').disabled = false;
      if (h === GATE.hash) {
        lSet(K_FAIL, null);
        sSet(K_AUTH, GATE.hash);
        pwd.value = ''; err.textContent = '';
        enterHome();
        return;
      }
      var f = lGet(K_FAIL) || { count: 0 };
      f.count = (f.count || 0) + 1;
      if (f.count >= MAX_TRY) { f = { count: 0, until: Date.now() + LOCK_SEC * 1000 }; }
      lSet(K_FAIL, f);
      pwd.value = ''; pwd.focus();
      if (f.until) renderLock();
      else err.textContent = '密码错误，还可以再试 ' + (MAX_TRY - f.count) + ' 次。';
    }).catch(function () {
      $('loginBtn').disabled = false;
      err.textContent = '当前打开方式不支持密码校验，请通过 GitHub Pages 网址或本地服务（localhost）访问。';
    });
  }

  function showLogin() {
    $('home').hidden = true; $('login').hidden = false;
    renderLock();
    setTimeout(function () { $('pwd').focus(); }, 0);
  }

  function logout() {
    sSet(K_AUTH, null);
    closeAll();
    showLogin();
  }

  /* ---------- 写入通道 ---------- */

  function detectLocal() {
    return fetch('api/ping', { cache: 'no-store' }).then(function (r) {
      if (!r.ok) return false;
      return r.json().then(function (j) {
        if (!(j && j.mode === 'local')) return false;
        state.pagesBase = j.pagesBase || null;
        return true;
      });
    }).catch(function () { return false; });
  }

  function ghGuess() {
    // 在 <所有者>.github.io/<仓库名>/ 上自动推断仓库
    var h = location.hostname, m = h.match(/^([^.]+)\.github\.io$/i);
    if (!m) return {};
    var seg = location.pathname.split('/').filter(Boolean)[0];
    var repo = seg && !/\.html?$/i.test(seg) ? seg : (m[1] + '.github.io');
    return { owner: m[1], repo: repo };
  }

  function ghApi(method, path, body) {
    var gh = state.gh;
    return fetch('https://api.github.com/repos/' + encodeURIComponent(gh.owner) + '/' + encodeURIComponent(gh.repo) + path, {
      method: method,
      cache: 'no-store',
      headers: {
        'Accept': 'application/vnd.github+json',
        'Authorization': 'Bearer ' + gh.token,
        'X-GitHub-Api-Version': '2022-11-28'
      },
      body: body ? JSON.stringify(body) : undefined
    }).then(function (r) {
      if (r.status === 204) return null;
      return r.json().catch(function () { return null; }).then(function (j) {
        if (!r.ok) { var e = new Error((j && j.message) || ('HTTP ' + r.status)); e.status = r.status; throw e; }
        return j;
      });
    });
  }

  function b64ToUtf8(b64) {
    var bin = atob(String(b64).replace(/\s/g, ''));
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder('utf-8').decode(bytes);
  }

  function ghErrText(e) {
    if (e.status === 401) return '令牌无效或已过期（401）。';
    if (e.status === 403) return '令牌没有权限，或调用次数超限（403）。';
    if (e.status === 404) return '找不到仓库或分支，或令牌没有该仓库的访问权限（404）。';
    if (e.status === 409) return '仓库为空，请先提交至少一个文件（409）。';
    if (e.status === 422) return '仓库在提交过程中被其他人更新，请刷新后重试（422）。';
    return '连接 GitHub 失败：' + (e.message || '网络错误') + '。';
  }

  /* ---------- 数据 ---------- */

  function normalize(data) {
    var list = (data && Array.isArray(data.items)) ? data.items : [];
    // 按创建时间倒序：最新创建的排在最上面。按时间值比较（本地模式和 GitHub 模式写入的时区格式不同，不能按字符串比）
    var t = function (it) { var v = Date.parse(it.createdAt); return isNaN(v) ? 0 : v; };
    return list.slice().sort(function (a, b) {
      return t(b) - t(a) || (b.id || 0) - (a.id || 0);
    });
  }

  function loadItems() {
    if (state.mode === 'local') {
      return fetch('api/requirements', { cache: 'no-store' }).then(function (r) {
        if (!r.ok) throw new Error('本地服务返回 ' + r.status);
        return r.json();
      });
    }
    if (state.mode === 'github') {
      return ghApi('GET', '/contents/' + DATA_PATH + '?ref=' + encodeURIComponent(state.gh.branch))
        .then(function (j) { return JSON.parse(b64ToUtf8(j.content)); })
        .catch(function (e) { if (e.status === 404) return { items: [] }; throw e; });
    }
    return fetch(DATA_PATH + '?t=' + Date.now(), { cache: 'no-store' }).then(function (r) {
      if (r.status === 404) return { items: [] };
      if (!r.ok) throw new Error('读取需求列表失败（HTTP ' + r.status + '）');
      return r.json();
    });
  }

  /* ---------- 角色访问地址 ---------- */

  var ROLES = [
    { code: 'pdm', name: '产品' },
    { code: 'opr', name: '运营' },
    { code: 'dev', name: '开发' },
    { code: 'repo', name: '报告' }   // 只读的报告角色：全部原型页面 + 完整 PRD（生成内容规范 v4.57）
  ];
  var avail = {};   // 「文件夹/角色」→ true 已上传 / false 未上传；每次刷新列表时重新检查

  // 公开网址的根：本地管理模式用服务端从仓库配置推算的 GitHub Pages 网址；其他情况用当前页面所在目录
  function siteBase() {
    if (state.mode === 'local' && state.pagesBase) return state.pagesBase;
    if (state.mode === 'github' && state.gh && /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname)) {
      var o = state.gh.owner.toLowerCase(), r = state.gh.repo;
      return r.toLowerCase() === o + '.github.io' ? 'https://' + o + '.github.io/' : 'https://' + o + '.github.io/' + r + '/';
    }
    return new URL('.', location.href).href;
  }
  function roleUrl(folder, code) { return siteBase() + folder + '/' + code + '/'; }

  // 检查角色站点是否已上传：请求本站同一相对路径，404 或「待上传」占位页都算未上传
  function checkAvail(folder, code) {
    var key = folder + '/' + code;
    if (key in avail) return;
    avail[key] = null;
    fetch(folder + '/' + code + '/', { cache: 'no-store' }).then(function (r) {
      if (!r.ok) return false;
      return r.text().then(function (t) { return t.indexOf('name="prdhub-placeholder"') < 0; });
    }).catch(function () { return false; }).then(function (ok) {
      avail[key] = ok;
      if (ok) fetchRoleTime(folder, code);
      scheduleRender();
    });
  }

  /* 各角色站点最后一次更新的时间（state.roleTimes[文件夹][角色]）
   * 本地管理模式：由本地服务按仓库的 Git 提交记录计算，随需求列表一起返回。
   * 其他模式：用 GitHub 接口查该角色文件夹最后一次提交的时间，结果在本浏览器缓存 10 分钟；
   * 接口不可用（如未登录时的调用次数限制）时，沿用需求列表里记录的最后上传时间。 */
  var K_RT = 'prdhub.rt.', RT_TTL = 10 * 60 * 1000, rtPending = {};

  function repoInfo() {
    if (state.gh) return { owner: state.gh.owner, repo: state.gh.repo, token: state.gh.token };
    var g = ghGuess();
    return g.owner ? { owner: g.owner, repo: g.repo } : null;
  }

  function setRoleTime(folder, code, t) {
    (state.roleTimes[folder] = state.roleTimes[folder] || {})[code] = t;
  }
  function getRoleTime(folder, code) {
    var m = state.roleTimes[folder];
    return m && m.hasOwnProperty(code) ? m[code] : undefined;
  }

  function fetchRoleTime(folder, code) {
    if (state.mode === 'local') return;           // 本地服务已经给出
    if (getRoleTime(folder, code) !== undefined) return;
    var info = repoInfo(), key = folder + '/' + code;
    if (!info || rtPending[key]) return;
    var ck = K_RT + info.owner + '/' + info.repo + '/' + key, c = lGet(ck);
    if (c && Date.now() - c.at < RT_TTL) { setRoleTime(folder, code, c.t); scheduleRender(); return; }
    rtPending[key] = true;
    var headers = { 'Accept': 'application/vnd.github+json' };
    if (info.token) headers.Authorization = 'Bearer ' + info.token;
    fetch('https://api.github.com/repos/' + encodeURIComponent(info.owner) + '/' + encodeURIComponent(info.repo) +
      '/commits?per_page=1&path=' + encodeURIComponent(key), { headers: headers, cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (list) {
        var t = (list && list[0] && list[0].commit && list[0].commit.committer && list[0].commit.committer.date) || null;
        lSet(ck, { t: t, at: Date.now() });
        setRoleTime(folder, code, t);
        scheduleRender();
      })
      .catch(function () {})
      .then(function () { delete rtPending[key]; });
  }

  function clearRtCache() {
    try {
      for (var i = localStorage.length - 1; i >= 0; i--) {
        var k = localStorage.key(i);
        if (k && k.indexOf(K_RT) === 0) localStorage.removeItem(k);
      }
    } catch (e) {}
  }

  // 需求的最后上传时间 = 已上传的各角色站点里最晚的更新时间；还拿不到时沿用需求列表里记录的时间
  function lastUp(it) {
    var best = null;
    ROLES.forEach(function (r) {
      var t = getRoleTime(it.folder, r.code);
      if (t && avail[it.folder + '/' + r.code] !== false && (!best || Date.parse(t) > Date.parse(best))) best = t;
    });
    return best || it.lastUploadAt || null;
  }

  function roleStatus(folder, code) {
    var key = folder + '/' + code, ok = avail[key], t = getRoleTime(folder, code);
    if (ok === false) return { text: '未上传', cls: '' };
    if (ok && t) return { text: '更新于 ' + fmt(t), cls: 'ok' };
    return null;
  }

  var renderTimer;
  function scheduleRender() {
    clearTimeout(renderTimer);
    renderTimer = setTimeout(function () { render(); }, 120);
  }

  function linksHtml(it) {
    return '<div class="links">' + ROLES.map(function (r) {
      var url = roleUrl(it.folder, r.code), key = it.folder + '/' + r.code, st = roleStatus(it.folder, r.code);
      return '<div class="link" data-key="' + esc(key) + '">' +
        '<span class="role">' + r.name + '<b>' + r.code + '</b></span>' +
        '<a class="addr" href="' + esc(url) + '" target="_blank" rel="noopener">' + esc(url) + '</a>' +
        (st ? '<span class="st ' + st.cls + '">' + esc(st.text) + '</span>' : '') +
        '<button class="btn btn-line btn-xs" type="button" data-copy="' + esc(url) + '" aria-label="复制' + r.name + '角色地址">复制</button>' +
        '</div>';
    }).join('') + '</div>';
  }

  // 旧式复制：用隐藏文本框 + execCommand，兼容剪贴板接口不可用或被浏览器拒绝的情况
  function legacyCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.top = '0'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
    return ok;
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).catch(function () {
        if (!legacyCopy(text)) throw new Error('copy');
      });
    }
    return legacyCopy(text) ? Promise.resolve() : Promise.reject(new Error('copy'));
  }

  function onCopy(btn) {
    var url = btn.getAttribute('data-copy');
    copyText(url).then(function () {
      btn.textContent = '已复制'; btn.classList.add('done');
      setTimeout(function () { btn.textContent = '复制'; btn.classList.remove('done'); }, 1500);
      toast('已复制地址：' + url);
    }).catch(function () {
      // 两种方式都失败时，选中地址文字，方便按 Ctrl + C 复制
      var a = btn.parentNode.querySelector('.addr'), sel = window.getSelection(), range = document.createRange();
      range.selectNodeContents(a); sel.removeAllRanges(); sel.addRange(range);
      toast('浏览器不允许自动复制，已选中地址，请按 Ctrl + C 复制');
    });
  }

  function refresh(flashFolder) {
    avail = {};
    state.roleTimes = {};
    $('listMeta').textContent = '加载中…';
    $('loadErr').hidden = true;
    return loadItems().then(function (data) {
      state.items = normalize(data);
      state.items.forEach(function (it) {
        if (it.roleTimes) { state.roleTimes[it.folder] = it.roleTimes; delete it.roleTimes; }
      });
      render(flashFolder);
    }).catch(function (e) {
      $('listMeta').textContent = '';
      $('loadErr').textContent = state.mode === 'github' ? ghErrText(e) : ('需求列表加载失败：' + e.message);
      $('loadErr').hidden = false;
    });
  }

  /* ---------- 查询条件 ---------- */

  var filter = { name: '', owner: '', cFrom: '', cTo: '', uFrom: '', uTo: '' };

  function localDay(iso) {   // 按本机时区取日期 YYYY-MM-DD，用于和日期框比较
    var d = new Date(iso);
    return isNaN(d) ? '' : d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }
  function norm(s) { return String(s || '').toLowerCase().replace(/\s+/g, ''); }
  function hasFilter() { return !!(filter.name || filter.owner || filter.cFrom || filter.cTo || filter.uFrom || filter.uTo); }

  function inRange(iso, from, to) {
    if (!from && !to) return true;
    if (!iso) return false;   // 设置了上传时间区间时，「未上传」的需求不在结果里
    var d = localDay(iso);
    return (!from || d >= from) && (!to || d <= to);
  }

  function matches(it) {
    if (filter.name && norm(it.name).indexOf(norm(filter.name)) < 0) return false;
    if (filter.owner && it.owner !== filter.owner) return false;
    return inRange(it.createdAt, filter.cFrom, filter.cTo) && inRange(lastUp(it), filter.uFrom, filter.uTo);
  }

  // 需求方下拉：列出当前列表里所有不重复的需求方；已选的需求方不在列表里了（如被改名）就回到「全部」
  function renderOwnerOptions() {
    var sel = $('qOwner'), seen = {}, owners = [];
    state.items.forEach(function (it) { if (it.owner && !seen[it.owner]) { seen[it.owner] = 1; owners.push(it.owner); } });
    owners.sort(function (a, b) { return a.localeCompare(b, 'zh-CN'); });
    if (filter.owner && !seen[filter.owner]) filter.owner = '';
    sel.innerHTML = '<option value="">全部（' + owners.length + '）</option>' + owners.map(function (o) {
      return '<option value="' + esc(o) + '">' + esc(o) + '</option>';
    }).join('');
    sel.value = filter.owner;
  }

  function readFilter() {
    var f = {
      name: $('qName').value.trim(), owner: $('qOwner').value,
      cFrom: $('qCFrom').value, cTo: $('qCTo').value, uFrom: $('qUFrom').value, uTo: $('qUTo').value
    };
    var msgs = [];
    $('qCFrom').classList.toggle('bad', !!(f.cFrom && f.cTo && f.cFrom > f.cTo));
    $('qCTo').classList.toggle('bad', !!(f.cFrom && f.cTo && f.cFrom > f.cTo));
    $('qUFrom').classList.toggle('bad', !!(f.uFrom && f.uTo && f.uFrom > f.uTo));
    $('qUTo').classList.toggle('bad', !!(f.uFrom && f.uTo && f.uFrom > f.uTo));
    if (f.cFrom && f.cTo && f.cFrom > f.cTo) msgs.push('创建时间的开始日期不能晚于结束日期');
    if (f.uFrom && f.uTo && f.uFrom > f.uTo) msgs.push('最后上传时间的开始日期不能晚于结束日期');
    $('qErr').textContent = msgs.length ? msgs.join('；') + '。' : '';
    return msgs.length ? null : f;
  }

  function onQuery(e) {
    if (e) e.preventDefault();
    var f = readFilter();
    if (!f) return;
    filter = f;
    render();
  }

  function resetFilter() {
    filter = { name: '', owner: '', cFrom: '', cTo: '', uFrom: '', uTo: '' };
    ['qName', 'qCFrom', 'qCTo', 'qUFrom', 'qUTo'].forEach(function (id) { $(id).value = ''; $(id).classList.remove('bad'); });
    $('qOwner').value = '';
    $('qErr').textContent = '';
    render();
  }

  function render(flashFolder) {
    var all = state.items, tb = $('rows');
    renderOwnerOptions();
    // 序号按完整列表（创建时间倒序）从上到下编号，查询后保持不变
    var shown = [];
    all.forEach(function (it, i) { if (matches(it)) shown.push({ it: it, no: i + 1 }); });
    $('listMeta').textContent = hasFilter()
      ? '共 ' + all.length + ' 个需求，符合查询条件 ' + shown.length + ' 个 · 点击任意一行进入该需求的产品角色页面'
      : '共 ' + all.length + ' 个需求 · 点击任意一行进入该需求的产品角色页面';
    $('empty').hidden = all.length > 0;
    $('noMatch').hidden = !(all.length > 0 && shown.length === 0);
    document.querySelector('.table-scroll').hidden = shown.length === 0;
    var local = state.mode === 'local';
    $('colOps').hidden = !local;
    tb.innerHTML = shown.map(function (row) {
      var it = row.it, i = row.no - 1;
      var lu = lastUp(it);
      var up = lu ? esc(fmt(lu)) : '<span class="none">未上传</span>';
      var ops = local ? '<td class="ops">' +
        '<button class="btn btn-line btn-sm" type="button" data-op="upload">上传需求包</button>' +
        '<button class="btn btn-line btn-sm" type="button" data-op="version">改版本号</button></td>' : '';
      return '<tr tabindex="0" data-folder="' + esc(it.folder) + '"' + (it.folder === flashFolder ? ' class="flash"' : '') + '>' +
        '<td><span class="no">' + (i + 1) + '</span></td>' +
        '<td><span class="r-name">' + esc(it.name) + '</span><span class="r-folder">/' + esc(it.folder) + '/</span></td>' +
        '<td><span class="own">' + esc(it.owner) +
          '<button class="edit-ico" type="button" data-op="owner" title="修改需求方" aria-label="修改需求方">✎</button></span></td>' +
        '<td><span class="ver">' + esc(it.version || INIT_VER) + '</span></td>' +
        '<td>' + esc(fmt(it.createdAt)) + '</td>' +
        '<td>' + up + '</td>' + ops + '</tr>' +
        '<tr class="links-row' + (it.folder === flashFolder ? ' flash' : '') + '"><td></td><td colspan="' + (local ? 6 : 5) + '">' + linksHtml(it) + '</td></tr>';
    }).join('');
    // 检查全部需求（不只是当前显示的），这样按最后上传时间查询时，各需求的时间都是完整的
    all.forEach(function (it) {
      ROLES.forEach(function (r) {
        var key = it.folder + '/' + r.code;
        if (!(key in avail)) checkAvail(it.folder, r.code);
        else if (avail[key]) fetchRoleTime(it.folder, r.code);
      });
    });
  }

  function findItem(folder) {
    for (var i = 0; i < state.items.length; i++) if (state.items[i].folder === folder) return state.items[i];
    return null;
  }

  function openRequirement(folder) {
    if (!FOLDER_RE.test(folder)) return;
    location.href = folder + '/pdm/';
  }

  function renderMode() {
    var c = $('modeChip');
    c.classList.toggle('on', state.mode !== 'readonly');
    if (state.mode === 'local') { c.textContent = '本地管理模式'; c.title = '新增的需求直接写入本机文件夹'; }
    else if (state.mode === 'github') { c.textContent = 'GitHub：' + state.gh.owner + '/' + state.gh.repo; c.title = '新增的需求直接提交到 GitHub 仓库；点击修改连接'; }
    else { c.textContent = '只读 · 未连接'; c.title = '点击连接 GitHub 仓库后才能新增需求'; }
  }

  /* ---------- 新增需求 ---------- */

  var lastFocus = null;
  function openMask(id) {
    lastFocus = document.activeElement;
    $(id).hidden = false;
  }
  function closeMask(id) {
    $(id).hidden = true;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function closeAll() { ['addMask', 'ghMask', 'ownMask', 'upMask', 'verMask'].forEach(function (id) { $(id).hidden = true; }); }

  function resetAdd() {
    ['fName', 'fOwner', 'fFolder'].forEach(function (id) { $(id).value = ''; $(id).classList.remove('bad'); });
    document.querySelectorAll('#addForm .f-err').forEach(function (el) { el.textContent = ''; });
    $('addErr').textContent = '';
    setBusy(false);
  }

  function setBusy(b) {
    $('addOk').disabled = b; $('addCancel').disabled = b;
    $('addOk').textContent = b ? '正在创建…' : '确定';
  }

  function openAdd() {
    if (state.mode === 'readonly') {
      openGh('当前是只读模式，新增需求需要先连接 GitHub 仓库（或在本机用本地管理模式打开）。');
      return;
    }
    resetAdd();
    $('fVer').textContent = INIT_VER;
    openMask('addMask');
    setTimeout(function () { $('fName').focus(); }, 0);
  }

  function cancelAdd() {
    if ($('addCancel').disabled) return;
    resetAdd();
    closeMask('addMask');
  }

  function fieldErr(id, msg) {
    var el = document.querySelector('.f-err[data-for="' + id + '"]');
    el.textContent = msg || '';
    $(id).classList.toggle('bad', !!msg);
    return !msg;
  }

  function validateFolder(v) {
    if (!v) return '请填写文件夹名称。';
    if (!FOLDER_RE.test(v)) return '只能用英文字母、数字、「-」和「_」，以字母开头，2–40 个字符。';
    if (RESERVED.indexOf(v.toLowerCase()) >= 0) return '「' + v + '」是系统保留名称，请换一个。';
    var hit = state.items.some(function (it) { return String(it.folder).toLowerCase() === v.toLowerCase(); });
    if (hit) return '文件夹「' + v + '」已被其他需求使用（不区分大小写），请换一个。';
    return '';
  }

  function validateAll() {
    var name = $('fName').value.trim(), owner = $('fOwner').value.trim(), folder = $('fFolder').value.trim();
    var ok = fieldErr('fName', name ? '' : '请填写需求名称。');
    ok = fieldErr('fOwner', owner ? '' : '请填写需求方。') && ok;
    ok = fieldErr('fFolder', validateFolder(folder)) && ok;
    return ok ? { name: name, owner: owner, folder: folder } : null;
  }

  function placeholderPage(name) {
    return '<!doctype html>\n<html lang="zh-CN"><head><meta charset="utf-8">' +
      '<meta name="viewport" content="width=device-width, initial-scale=1">' +
      '<meta name="prdhub-placeholder" content="1"><title>需求待上传</title></head>' +
      '<body style="margin:0;font-family:\'Microsoft YaHei\',sans-serif;background:#F6F3EE;color:#1B1720">' +
      '<div style="max-width:520px;margin:12vh auto;padding:32px 24px;background:#fff;border:1px solid #D9D2E4;border-radius:14px;text-align:center">' +
      '<div style="font-size:11px;font-weight:700;letter-spacing:.24em;color:#C89A3C">789BINGO</div>' +
      '<h1 style="font-size:20px;color:#16052F;margin:8px 0 6px">' + esc(name) + '</h1>' +
      '<p style="color:#6A6076;line-height:1.7">该需求还没有上传产品角色页面。上传需求包后，这里会显示需求与原型中心。</p>' +
      '<p><a href="../../" style="color:#1677FF">← 返回需求列表</a></p></div></body></html>\n';
  }
  function redirectPage() {
    return '<!doctype html>\n<html lang="zh-CN"><head><meta charset="utf-8">' +
      '<meta name="prdhub-placeholder" content="1"><meta http-equiv="refresh" content="0; url=pdm/">' +
      '<title>跳转中</title></head><body><a href="pdm/">进入产品角色页面</a></body></html>\n';
  }

  function createLocal(rec) {
    return fetch('api/requirements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(rec)
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) {
        if (!r.ok) throw new Error(j.error || ('本地服务返回 ' + r.status));
        return j;
      });
    });
  }

  /* 向仓库做一次原子提交：读取分支最新的需求列表 → build 修改数据并返回要一起提交的文件 → 提交并移动分支。
   * build(data, headSha) 返回 Promise 或对象：{ message, files: [{path, content}], result } */
  function ghCommit(build, retried) {
    var branch = state.gh.branch, headSha, data, plan;
    return ghApi('GET', '/git/ref/heads/' + encodeURIComponent(branch)).then(function (ref) {
      headSha = ref.object.sha;
      return ghApi('GET', '/contents/' + DATA_PATH + '?ref=' + headSha)
        .then(function (j) { return JSON.parse(b64ToUtf8(j.content)); })
        .catch(function (e) { if (e.status === 404) return { items: [] }; throw e; });
    }).then(function (d) {
      data = d && Array.isArray(d.items) ? d : { items: [] };
      return build(data, headSha);
    }).then(function (p) {
      plan = p;
      return ghApi('GET', '/git/commits/' + headSha);
    }).then(function (commit) {
      var tree = [{ path: DATA_PATH, mode: '100644', type: 'blob', content: JSON.stringify(data, null, 2) + '\n' }];
      (plan.files || []).forEach(function (f) { tree.push({ path: f.path, mode: '100644', type: 'blob', content: f.content }); });
      return ghApi('POST', '/git/trees', { base_tree: commit.tree.sha, tree: tree });
    }).then(function (tree) {
      return ghApi('POST', '/git/commits', { message: plan.message, tree: tree.sha, parents: [headSha] });
    }).then(function (c) {
      return ghApi('PATCH', '/git/refs/heads/' + encodeURIComponent(branch), { sha: c.sha, force: false });
    }).then(function () { return plan.result; }).catch(function (e) {
      // 提交期间分支被别人更新：重新读取后再试一次
      if (e.status === 422 && !retried) return ghCommit(build, true);
      throw e;
    });
  }

  function createGithub(rec) {
    return ghCommit(function (data, headSha) {
      var dup = data.items.some(function (it) { return String(it.folder).toLowerCase() === rec.folder.toLowerCase(); });
      if (dup) throw new Error('文件夹「' + rec.folder + '」已被其他需求使用，请换一个。');
      return ghApi('GET', '/contents/' + encodeURIComponent(rec.folder) + '?ref=' + headSha).then(function () {
        throw new Error('仓库里已经有名为「' + rec.folder + '」的文件或文件夹，请换一个名称。');
      }, function (e) { if (e.status !== 404) throw e; }).then(function () {
        var maxId = data.items.reduce(function (m, it) { return Math.max(m, it.id || 0); }, 0);
        var item = {
          id: maxId + 1, name: rec.name, owner: rec.owner, folder: rec.folder,
          version: INIT_VER, createdAt: new Date().toISOString(), lastUploadAt: null
        };
        data.items.push(item);
        return {
          message: '新增需求：' + rec.name + '（' + rec.folder + '/）',
          files: [
            { path: rec.folder + '/index.html', content: redirectPage() },
            { path: rec.folder + '/pdm/index.html', content: placeholderPage(rec.name) }
          ],
          result: item
        };
      });
    });
  }

  /* ---------- 修改需求方（本地管理模式、GitHub 模式都可用） ---------- */

  var editing = null;   // 当前在弹窗里编辑的需求

  function postJson(url, obj) {
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(obj)
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) {
        if (!r.ok) throw new Error(j.error || ('本地服务返回 ' + r.status));
        return j;
      });
    });
  }

  function openOwner(it) {
    if (state.mode === 'readonly') {
      openGh('当前是只读模式，修改需求方需要先连接 GitHub 仓库（或在本机用本地管理模式打开）。');
      return;
    }
    editing = it;
    $('ownName').textContent = it.name;
    $('ownCur').textContent = it.owner;
    $('ownVal').value = it.owner;
    fieldErr('ownVal', '');
    $('ownErr').textContent = '';
    btnBusy('ownOk', 'ownCancel', false, '确定');
    openMask('ownMask');
    setTimeout(function () { $('ownVal').focus(); $('ownVal').select(); }, 0);
  }

  function btnBusy(okId, cancelId, busy, label) {
    $(okId).disabled = busy; $(cancelId).disabled = busy;
    $(okId).textContent = label;
  }

  function onOwnerSubmit(e) {
    e.preventDefault();
    if ($('ownOk').disabled || !editing) return;
    var v = $('ownVal').value.trim(), it = editing;
    if (!fieldErr('ownVal', !v ? '请填写需求方。' : (v === it.owner ? '和当前需求方相同，无需修改。' : ''))) { $('ownVal').focus(); return; }
    $('ownErr').textContent = '';
    btnBusy('ownOk', 'ownCancel', true, '正在保存…');
    var job = state.mode === 'local'
      ? postJson('api/requirements/' + encodeURIComponent(it.folder) + '/owner', { owner: v })
      : ghCommit(function (data) {
          var hit = data.items.filter(function (x) { return x.folder === it.folder; })[0];
          if (!hit) throw new Error('仓库里找不到这个需求，可能已被删除，请刷新列表。');
          hit.owner = v;
          return { message: '修改需求方：' + it.name + '（' + it.owner + ' → ' + v + '）', files: [], result: hit };
        });
    job.then(function () {
      btnBusy('ownOk', 'ownCancel', false, '确定');
      closeMask('ownMask');
      toast('已将「' + it.name + '」的需求方改为「' + v + '」');
      editing = null;
      return refresh(it.folder);
    }).catch(function (err) {
      btnBusy('ownOk', 'ownCancel', false, '确定');
      $('ownErr').textContent = state.mode === 'github' && err.status ? ghErrText(err) : ('修改失败：' + err.message);
    });
  }

  /* ---------- 上传需求包、修改版本号（仅本地管理模式） ---------- */

  var VER_RE = /^v(\d{1,3})\.(\d{1,3})$/;
  function verNum(v) { var m = VER_RE.exec(String(v || '')); return m ? (+m[1]) * 1000 + (+m[2]) : -1; }
  function nextVer(v) {
    var m = VER_RE.exec(String(v || ''));
    if (!m) return INIT_VER;
    var major = +m[1], minor = +m[2] + 1;
    if (minor >= 10) { major += 1; minor = 0; }   // 每次加 0.1：v1.9 → v2.0
    return 'v' + major + '.' + minor;
  }
  function checkVer(v, cur) {
    if (!v) return '请填写版本号。';
    if (verNum(v) < 0) return '格式应为 v主版本.次版本，例如 v1.1。';
    if (cur && verNum(v) < verNum(cur)) return '不能低于当前版本 ' + cur + '。';
    return '';
  }

  function openUpload(it) {
    editing = it;
    $('upName').textContent = it.name;
    $('upFolder').textContent = '/' + it.folder + '/';
    $('upCur').textContent = (it.version || INIT_VER) + (it.lastUploadAt ? '' : '（未上传）');
    $('upFile').value = '';
    $('upVer').value = it.lastUploadAt ? nextVer(it.version) : (it.version || INIT_VER);
    fieldErr('upFile', ''); fieldErr('upVer', '');
    $('upErr').textContent = '';
    btnBusy('upOk', 'upCancel', false, '上传');
    openMask('upMask');
  }

  function onUploadSubmit(e) {
    e.preventDefault();
    if ($('upOk').disabled || !editing) return;
    var it = editing, file = $('upFile').files[0], v = $('upVer').value.trim();
    var okFile = fieldErr('upFile', !file ? '请选择需求包压缩包。' : (!/\.zip$/i.test(file.name) ? '只支持 .zip 压缩包。' : ''));
    var okVer = fieldErr('upVer', checkVer(v, it.version));
    if (!okFile || !okVer) return;
    $('upErr').textContent = '';
    btnBusy('upOk', 'upCancel', true, '正在上传…');
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'api/requirements/' + encodeURIComponent(it.folder) + '/upload?version=' + encodeURIComponent(v));
    xhr.setRequestHeader('Content-Type', 'application/zip');
    xhr.upload.onprogress = function (ev) {
      if (ev.lengthComputable) $('upOk').textContent = ev.loaded < ev.total ? ('正在上传… ' + Math.floor(ev.loaded / ev.total * 100) + '%') : '正在解压…';
    };
    xhr.onload = function () {
      var j = {};
      try { j = JSON.parse(xhr.responseText); } catch (er) {}
      btnBusy('upOk', 'upCancel', false, '上传');
      if (xhr.status >= 200 && xhr.status < 300) {
        closeMask('upMask');
        toast('「' + it.name + '」已上传 ' + v + (j.kind === 'single' ? '（旧版单站点包，已放进 pdm/）' : '') + '，共 ' + (j.files || 0) + ' 个文件');
        editing = null;
        refresh(it.folder);
      } else {
        $('upErr').textContent = '上传失败：' + (j.error || ('本地服务返回 ' + xhr.status));
      }
    };
    xhr.onerror = function () {
      btnBusy('upOk', 'upCancel', false, '上传');
      $('upErr').textContent = '上传失败：连接本地服务中断，请确认本地管理服务仍在运行。';
    };
    xhr.send(file);
  }

  function openVersion(it) {
    editing = it;
    $('verName').textContent = it.name;
    $('verCur').textContent = it.version || INIT_VER;
    $('verVal').value = nextVer(it.version);
    fieldErr('verVal', '');
    $('verErr').textContent = '';
    btnBusy('verOk', 'verCancel', false, '确定');
    openMask('verMask');
    setTimeout(function () { $('verVal').focus(); $('verVal').select(); }, 0);
  }

  function onVersionSubmit(e) {
    e.preventDefault();
    if ($('verOk').disabled || !editing) return;
    var it = editing, v = $('verVal').value.trim();
    var msg = checkVer(v, null) || (v === it.version ? '和当前版本相同，无需修改。' : '');
    if (!fieldErr('verVal', msg)) { $('verVal').focus(); return; }
    $('verErr').textContent = '';
    btnBusy('verOk', 'verCancel', true, '正在保存…');
    postJson('api/requirements/' + encodeURIComponent(it.folder) + '/version', { version: v }).then(function () {
      btnBusy('verOk', 'verCancel', false, '确定');
      closeMask('verMask');
      toast('已将「' + it.name + '」的版本号改为 ' + v);
      editing = null;
      refresh(it.folder);
    }).catch(function (err) {
      btnBusy('verOk', 'verCancel', false, '确定');
      $('verErr').textContent = '修改失败：' + err.message;
    });
  }

  function cancelMask(maskId, cancelId) {
    if ($(cancelId).disabled) return;   // 正在提交时不能关闭
    editing = null;
    closeMask(maskId);
  }

  function onAddSubmit(e) {
    e.preventDefault();
    if ($('addOk').disabled) return;
    $('addErr').textContent = '';
    var rec = validateAll();
    if (!rec) { var bad = document.querySelector('#addForm input.bad'); if (bad) bad.focus(); return; }
    setBusy(true);
    var job = state.mode === 'local' ? createLocal(rec) : createGithub(rec);
    job.then(function () {
      setBusy(false);
      resetAdd();
      closeMask('addMask');
      toast('已新增需求「' + rec.name + '」，并创建文件夹 /' + rec.folder + '/');
      return refresh(rec.folder);
    }).catch(function (err) {
      setBusy(false);
      $('addErr').textContent = state.mode === 'github' && err.status ? ghErrText(err) : ('新增失败：' + err.message);
    });
  }

  /* ---------- GitHub 连接设置 ---------- */

  function openGh(intro) {
    var g = state.gh || lGet(K_GH) || {}, guess = ghGuess();
    $('ghIntro').textContent = intro || (state.mode === 'local'
      ? '当前是本地管理模式，新增的需求直接写入本机文件夹，不需要连接 GitHub。'
      : '连接后，新增需求会直接提交到 GitHub 仓库：创建需求文件夹并更新需求列表。GitHub Pages 通常 1 分钟左右重新发布。');
    $('gOwner').value = g.owner || guess.owner || '';
    $('gRepo').value = g.repo || guess.repo || '';
    $('gBranch').value = g.branch || 'main';
    $('gToken').value = g.token || '';
    $('ghErr').textContent = '';
    $('ghDisconnect').hidden = !lGet(K_GH);
    $('ghOk').disabled = false; $('ghOk').textContent = '测试并保存';
    openMask('ghMask');
    setTimeout(function () { $(($('gOwner').value ? 'gToken' : 'gOwner')).focus(); }, 0);
  }

  function onGhSubmit(e) {
    e.preventDefault();
    var g = {
      owner: $('gOwner').value.trim(), repo: $('gRepo').value.trim(),
      branch: $('gBranch').value.trim(), token: $('gToken').value.trim()
    };
    if (!g.owner || !g.repo || !g.branch || !g.token) { $('ghErr').textContent = '四项都要填写。'; return; }
    $('ghOk').disabled = true; $('ghOk').textContent = '正在测试…'; $('ghErr').textContent = '';
    var prev = state.gh; state.gh = g;
    ghApi('GET', '').then(function (repo) {
      if (!repo.permissions || !repo.permissions.push) { var er = new Error('该令牌对仓库没有写入权限'); er.status = 403; throw er; }
      return ghApi('GET', '/git/ref/heads/' + encodeURIComponent(g.branch));
    }).then(function () {
      lSet(K_GH, g);
      if (state.mode !== 'local') state.mode = 'github';
      renderMode();
      closeMask('ghMask');
      toast('已连接 GitHub 仓库 ' + g.owner + '/' + g.repo);
      refresh();
    }).catch(function (err) {
      state.gh = prev;
      $('ghOk').disabled = false; $('ghOk').textContent = '测试并保存';
      $('ghErr').textContent = ghErrText(err);
    });
  }

  function onGhDisconnect() {
    lSet(K_GH, null);
    state.gh = null;
    if (state.mode === 'github') state.mode = 'readonly';
    renderMode();
    closeMask('ghMask');
    toast('已断开 GitHub 连接，令牌已从本浏览器删除');
    refresh();
  }

  /* ---------- 启动 ---------- */

  var homeReady = false;
  function enterHome() {
    $('login').hidden = true; $('home').hidden = false;
    if (homeReady) { refresh(); return; }
    homeReady = true;
    detectLocal().then(function (isLocal) {
      var saved = lGet(K_GH);
      if (isLocal) state.mode = 'local';
      else if (saved && saved.token) { state.mode = 'github'; state.gh = saved; }
      renderMode();
      refresh();
    });
  }

  function bind() {
    $('loginForm').addEventListener('submit', onLogin);
    $('logoutBtn').addEventListener('click', logout);
    $('refreshBtn').addEventListener('click', function () { clearRtCache(); refresh(); });
    $('addBtn').addEventListener('click', openAdd);
    $('addCancel').addEventListener('click', cancelAdd);
    $('addForm').addEventListener('submit', onAddSubmit);
    $('fFolder').addEventListener('input', function () {
      var v = this.value.trim();
      if (v) fieldErr('fFolder', validateFolder(v)); else fieldErr('fFolder', '');
    });
    ['fName', 'fOwner'].forEach(function (id) {
      $(id).addEventListener('input', function () { if (this.value.trim()) fieldErr(id, ''); });
    });
    $('modeChip').addEventListener('click', function () { openGh(); });
    $('ghCancel').addEventListener('click', function () { closeMask('ghMask'); });
    $('ghDisconnect').addEventListener('click', onGhDisconnect);
    $('ghForm').addEventListener('submit', onGhSubmit);
    $('rows').addEventListener('click', function (e) {
      var cp = e.target.closest('[data-copy]');
      if (cp) { onCopy(cp); return; }
      var tr = e.target.closest('tr[data-folder]');
      if (!tr) return;
      var folder = tr.getAttribute('data-folder'), op = e.target.closest('[data-op]');
      if (!op) { openRequirement(folder); return; }
      // 行内按钮只打开对应弹窗，不跳转
      e.stopPropagation();
      var it = findItem(folder);
      if (!it) return;
      var kind = op.getAttribute('data-op');
      if (kind === 'owner') openOwner(it);
      else if (kind === 'upload') openUpload(it);
      else if (kind === 'version') openVersion(it);
    });
    $('rows').addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      if (e.target.closest('button')) return;   // 按钮自己处理回车
      var tr = e.target.closest('tr[data-folder]');
      if (tr) { e.preventDefault(); openRequirement(tr.getAttribute('data-folder')); }
    });
    $('filterForm').addEventListener('submit', onQuery);
    $('qReset').addEventListener('click', resetFilter);
    $('qReset2').addEventListener('click', resetFilter);
    $('qOwner').addEventListener('change', onQuery);
    $('ownForm').addEventListener('submit', onOwnerSubmit);
    $('ownCancel').addEventListener('click', function () { cancelMask('ownMask', 'ownCancel'); });
    $('ownVal').addEventListener('input', function () { if (this.value.trim()) fieldErr('ownVal', ''); });
    $('upForm').addEventListener('submit', onUploadSubmit);
    $('upCancel').addEventListener('click', function () { cancelMask('upMask', 'upCancel'); });
    $('upFile').addEventListener('change', function () { fieldErr('upFile', ''); });
    $('upVer').addEventListener('input', function () { fieldErr('upVer', ''); });
    $('verForm').addEventListener('submit', onVersionSubmit);
    $('verCancel').addEventListener('click', function () { cancelMask('verMask', 'verCancel'); });
    $('verVal').addEventListener('input', function () { fieldErr('verVal', ''); });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (!$('addMask').hidden) cancelAdd();
      else if (!$('ownMask').hidden) cancelMask('ownMask', 'ownCancel');
      else if (!$('upMask').hidden) cancelMask('upMask', 'upCancel');
      else if (!$('verMask').hidden) cancelMask('verMask', 'verCancel');
      else if (!$('ghMask').hidden) closeMask('ghMask');
    });
  }

  bind();
  if (isAuthed()) enterHome(); else showLogin();
})();
