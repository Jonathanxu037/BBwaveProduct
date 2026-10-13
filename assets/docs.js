/* 产品需求管理系统 · 方案文档管理
 * 文档来源：仓库 documents/ 文件夹里的文件（含子文件夹，忽略以「.」开头的文件和文件夹）。系统里没有上传按钮，
 *   把文件放进 documents/ 后提交推送即可。
 * 清单：data/documents.json  { items: [{id(=文件路径), name, file, size, uploadedAt, groupId, sig, hash}], groups: [{id, name, createdAt}] }
 *   本地管理模式：本地服务每次读取时扫描 documents/ 并更新清单（上传时间取 Git 提交时间，未提交的按文件时间；内容没变就不改时间）。
 *   网页上：读取清单，再用 GitHub 接口列出 documents/ 里的文件，补上清单里还没有的文件、去掉已删除的文件（结果缓存 10 分钟）。
 * 分组只改清单里的 groupId，不动文件；组里没有文档时自动去掉这个组。
 */
(function () {
  'use strict';
  var H = window.PRDHUB;
  if (!H) return;
  var $ = H.$, esc = H.esc, fmt = H.fmt, state = H.state;

  var DOCS_PATH = 'data/documents.json';
  var DOC_DIR = 'documents/';
  var K_EXPAND = 'prdhub.docExpand', K_TREE = 'prdhub.docTree.', TREE_TTL = 10 * 60 * 1000;
  var TEXT_EXT = ['txt', 'md', 'csv', 'json', 'log', 'xml', 'yaml', 'yml'];
  var NATIVE_EXT = ['pdf', 'png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg', 'html', 'htm', 'mp4', 'webm', 'mp3'];
  var OFFICE_EXT = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];

  var docs = { items: [], groups: [] };
  var online = null;                       // 网页上从 GitHub 列出的文件 { 路径: {size, uploadedAt} }；本地模式为 null
  var selected = {};                       // 已勾选的文档 id
  var expanded = H.lGet(K_EXPAND) || {};   // 展开的分组 id（只记在本浏览器）
  var filter = { name: '', from: '', to: '' };

  function normalize(d) {
    d = d || {};
    return { items: Array.isArray(d.items) ? d.items : [], groups: Array.isArray(d.groups) ? d.groups : [] };
  }
  function t(iso) { var v = Date.parse(iso); return isNaN(v) ? 0 : v; }
  function ext(name) { var m = /\.([^.]+)$/.exec(String(name || '')); return m ? m[1].toLowerCase() : ''; }
  function baseName(p) { var s = String(p).split('/'); return s[s.length - 1]; }
  function docUrl(it) { return String(it.file).split('/').map(encodeURIComponent).join('/'); }
  function sizeText(n) {
    if (!(n >= 0)) return '';
    if (n < 1024) return n + ' B';
    if (n < 1048576) return (n / 1024).toFixed(1) + ' KB';
    return (n / 1048576).toFixed(1) + ' MB';
  }
  function norm(s) { return String(s || '').toLowerCase().replace(/\s+/g, ''); }
  function groupById(id) { for (var i = 0; i < docs.groups.length; i++) if (docs.groups[i].id === id) return docs.groups[i]; return null; }
  function isDocPath(p) {
    if (String(p).indexOf(DOC_DIR) !== 0) return false;
    return !String(p).split('/').some(function (seg) { return seg.charAt(0) === '.'; });
  }
  function canWrite() {
    if (state.mode !== 'readonly') return true;
    H.openGh('当前是只读模式，分组需要先连接 GitHub 仓库（或在本机用本地管理模式打开）。');
    return false;
  }

  /* ---------- 读取 ---------- */

  function loadManifest() {
    if (state.mode === 'local') {
      return fetch('api/documents', { cache: 'no-store' }).then(function (r) {
        if (!r.ok) throw new Error('本地服务返回 ' + r.status);
        return r.json();
      });
    }
    if (state.mode === 'github') {
      return H.ghApi('GET', '/contents/' + DOCS_PATH + '?ref=' + encodeURIComponent(state.gh.branch))
        .then(function (j) { return JSON.parse(H.b64ToUtf8(j.content)); })
        .catch(function (e) { if (e.status === 404) return null; throw e; });
    }
    return fetch(DOCS_PATH + '?t=' + Date.now(), { cache: 'no-store' }).then(function (r) {
      if (r.status === 404) return null;
      if (!r.ok) throw new Error('读取文档清单失败（HTTP ' + r.status + '）');
      return r.json();
    });
  }

  // 网页上：用 GitHub 接口列出 documents/ 里的文件；清单里没有的文件再查一次最后提交时间
  function api(info, path) {
    var headers = { 'Accept': 'application/vnd.github+json' };
    if (info.token) headers.Authorization = 'Bearer ' + info.token;
    return fetch('https://api.github.com/repos/' + encodeURIComponent(info.owner) + '/' + encodeURIComponent(info.repo) + path,
      { headers: headers, cache: 'no-store' }).then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); });
  }

  function listOnline(manifest, force) {
    var info = H.repoInfo();
    if (state.mode === 'local' || !info) return Promise.resolve(null);
    var ck = K_TREE + info.owner + '/' + info.repo, c = H.lGet(ck);
    if (!force && c && Date.now() - c.at < TREE_TTL) return Promise.resolve(c.files);
    var known = {};
    manifest.items.forEach(function (it) { known[it.file] = it; });
    var branchP = state.gh ? Promise.resolve(state.gh.branch) : api(info, '').then(function (r) { return r.default_branch; });
    return branchP.then(function (branch) {
      return api(info, '/git/trees/' + encodeURIComponent(branch) + '?recursive=1');
    }).then(function (tree) {
      var files = {}, missing = [];
      (tree.tree || []).forEach(function (n) {
        if (n.type !== 'blob' || !isDocPath(n.path)) return;
        files[n.path] = { size: n.size };
        if (known[n.path]) files[n.path].uploadedAt = known[n.path].uploadedAt;
        else missing.push(n.path);
      });
      return Promise.all(missing.map(function (p) {
        return api(info, '/commits?per_page=1&path=' + encodeURIComponent(p)).then(function (list) {
          files[p].uploadedAt = (list && list[0] && list[0].commit && list[0].commit.committer && list[0].commit.committer.date) || null;
        }).catch(function () {});
      })).then(function () {
        H.lSet(ck, { files: files, at: Date.now() });
        return files;
      });
    }).catch(function () { return null; });   // 接口不可用时只按清单显示
  }

  // 清单 + 线上文件列表 → 当前显示的数据
  function merge(manifest, files) {
    if (!files) return manifest;
    var items = [], seen = {};
    manifest.items.forEach(function (it) {
      if (!files[it.file]) return;           // 文件已从仓库删除
      seen[it.file] = 1;
      items.push(it);
    });
    Object.keys(files).forEach(function (p) {
      if (seen[p]) return;
      items.push({ id: p, name: baseName(p), file: p, size: files[p].size, uploadedAt: files[p].uploadedAt, groupId: null });
    });
    return { items: items, groups: manifest.groups };
  }

  function refresh(force) {
    $('docMeta').textContent = '加载中…';
    $('docLoadErr').hidden = true;
    var manifest;
    return loadManifest().then(function (d) {
      manifest = normalize(d);
      return listOnline(manifest, force === true);
    }).then(function (files) {
      online = files;
      docs = merge(manifest, files);
      var ids = {};
      docs.items.forEach(function (it) { ids[it.id] = 1; });
      Object.keys(selected).forEach(function (k) { if (!ids[k]) delete selected[k]; });
      render();
    }).catch(function (e) {
      $('docMeta').textContent = '';
      $('docLoadErr').textContent = state.mode === 'github' && e.status ? H.ghErrText(e) : ('文档列表加载失败：' + e.message);
      $('docLoadErr').hidden = false;
    });
  }

  /* ---------- 查询与渲染 ---------- */

  function hasFilter() { return !!(filter.name || filter.from || filter.to); }
  function matches(it) {
    if (filter.name && norm(it.name).indexOf(norm(filter.name)) < 0) return false;
    if (filter.from || filter.to) {
      var d = H.localDay(it.uploadedAt);
      if (!d || (filter.from && d < filter.from) || (filter.to && d > filter.to)) return false;
    }
    return true;
  }

  // 列表结构：分组和未分组文档混排，按「组内最新文档的上传时间 / 文档上传时间」倒序
  function buildRows() {
    var byGroup = {}, loose = [];
    docs.items.forEach(function (it) {
      if (it.groupId && groupById(it.groupId)) (byGroup[it.groupId] = byGroup[it.groupId] || []).push(it);
      else loose.push(it);
    });
    var rows = [];
    docs.groups.forEach(function (g) {
      var all = (byGroup[g.id] || []).slice().sort(function (a, b) { return t(b.uploadedAt) - t(a.uploadedAt); });
      if (!all.length) return;
      var shown = all.filter(matches);
      if (hasFilter() && !shown.length) return;
      rows.push({ type: 'group', g: g, latest: all[0].uploadedAt, docs: shown });
    });
    loose.filter(matches).forEach(function (it) { rows.push({ type: 'doc', it: it, latest: it.uploadedAt }); });
    rows.sort(function (a, b) { return t(b.latest) - t(a.latest); });
    return rows;
  }

  function viewBtn(it) {
    var e = ext(it.name);
    if (NATIVE_EXT.indexOf(e) >= 0 || TEXT_EXT.indexOf(e) >= 0 || OFFICE_EXT.indexOf(e) >= 0) {
      return '<button class="btn btn-line btn-xs" type="button" data-dop="view">在线浏览</button>';
    }
    return '<button class="btn btn-line btn-xs" type="button" disabled title="这种格式不能在线浏览，请下载后查看">在线浏览</button>';
  }

  function docRow(it, no, child) {
    var sub = it.file.slice(DOC_DIR.length, it.file.length - it.name.length);   // documents/ 下的子文件夹
    return '<tr class="doc-row' + (child ? ' child' : '') + '" data-id="' + esc(it.id) + '">' +
      '<td class="c-chk"><input type="checkbox" class="dchk" aria-label="选择 ' + esc(it.name) + '"' + (selected[it.id] ? ' checked' : '') + '></td>' +
      '<td><span class="no' + (child ? ' no-sub' : '') + '">' + no + '</span></td>' +
      '<td><span class="d-name">' + (child ? '<i class="tree-line"></i>' : '') + '<span class="d-ico">📄</span>' + esc(it.name) + '</span>' +
        '<span class="d-size">' + esc(sizeText(it.size)) + (sub ? ' · ' + esc(sub.replace(/\/$/, '')) : '') + '</span></td>' +
      '<td>' + (it.uploadedAt ? esc(fmt(it.uploadedAt)) : '<span class="none">—</span>') + '</td>' +
      '<td class="ops">' + viewBtn(it) +
        '<a class="btn btn-line btn-xs" href="' + esc(docUrl(it)) + '" download="' + esc(it.name) + '">下载</a></td>' +
      '</tr>';
  }

  function render() {
    var rows = buildRows(), html = '', open = hasFilter(), visibleDocs = 0;
    $('tabDocsN').textContent = '（' + docs.items.length + '）';
    rows.forEach(function (r, i) {
      var no = i + 1;
      if (r.type === 'doc') { html += docRow(r.it, no, false); visibleDocs++; return; }
      var isOpen = open || !!expanded[r.g.id];
      var ids = r.docs.map(function (d) { return d.id; });
      var nSel = ids.filter(function (id) { return selected[id]; }).length;
      html += '<tr class="grp-row' + (isOpen ? ' open' : '') + '" data-gid="' + esc(r.g.id) + '">' +
        '<td class="c-chk"><input type="checkbox" class="gchk" aria-label="选择分组 ' + esc(r.g.name) + ' 里的文档"' +
          (nSel && nSel === ids.length ? ' checked' : '') + ' data-partial="' + (nSel && nSel < ids.length ? 1 : 0) + '"></td>' +
        '<td><span class="no">' + no + '</span></td>' +
        '<td><button class="grp-toggle" type="button" data-gop="toggle" aria-expanded="' + isOpen + '" title="' + (isOpen ? '收起' : '展开') + '">' +
          '<span class="caret">▸</span><span class="g-ico">' + (isOpen ? '📂' : '📁') + '</span><b>' + esc(r.g.name) + '</b></button></td>' +
        '<td>' + esc(fmt(r.latest)) + '</td>' +
        '<td class="ops"><button class="btn btn-line btn-xs" type="button" data-gop="rename">重命名</button>' +
          '<button class="btn btn-line btn-xs" type="button" data-gop="dissolve">解散分组</button></td>' +
        '</tr>';
      if (isOpen) r.docs.forEach(function (d, j) { html += docRow(d, no + '.' + (j + 1), true); });
      visibleDocs += r.docs.length;
    });
    $('docRows').innerHTML = html;
    Array.prototype.forEach.call(document.querySelectorAll('#docRows .gchk'), function (c) { c.indeterminate = c.getAttribute('data-partial') === '1'; });

    var total = docs.items.length;
    $('docMeta').textContent = hasFilter()
      ? '共 ' + total + ' 个文档，符合查询条件 ' + visibleDocs + ' 个 · 勾选文档后可以分组'
      : '共 ' + total + ' 个文档、' + rows.filter(function (r) { return r.type === 'group'; }).length + ' 个分组 · 勾选文档后可以分组';
    $('docEmpty').hidden = total > 0;
    $('docNoMatch').hidden = !(total > 0 && rows.length === 0);
    $('docTableWrap').hidden = rows.length === 0;
    updateBar();
  }

  function updateBar() {
    var ids = Object.keys(selected);
    var inGroup = ids.some(function (id) {
      for (var i = 0; i < docs.items.length; i++) if (docs.items[i].id === id) return !!docs.items[i].groupId;
      return false;
    });
    $('docGroupBtn').disabled = ids.length === 0;
    $('docUngroupBtn').disabled = !inGroup;
    $('docSel').textContent = ids.length ? '已选 ' + ids.length + ' 个文档' : '';
    var shownIds = Array.prototype.map.call(document.querySelectorAll('#docRows tr.doc-row'), function (tr) { return tr.getAttribute('data-id'); });
    var nSel = shownIds.filter(function (id) { return selected[id]; }).length;
    $('docChkAll').checked = shownIds.length > 0 && nSel === shownIds.length;
    $('docChkAll').indeterminate = nSel > 0 && nSel < shownIds.length;
  }

  function readFilter() {
    var f = { name: $('dqName').value.trim(), from: $('dqFrom').value, to: $('dqTo').value };
    var bad = !!(f.from && f.to && f.from > f.to);
    $('dqFrom').classList.toggle('bad', bad); $('dqTo').classList.toggle('bad', bad);
    $('dqErr').textContent = bad ? '上传时间的开始日期不能晚于结束日期。' : '';
    return bad ? null : f;
  }
  function onQuery(e) { if (e) e.preventDefault(); var f = readFilter(); if (!f) return; filter = f; render(); }
  function resetFilter() {
    filter = { name: '', from: '', to: '' };
    ['dqName', 'dqFrom', 'dqTo'].forEach(function (id) { $(id).value = ''; $(id).classList.remove('bad'); });
    $('dqErr').textContent = '';
    render();
  }

  /* ---------- 保存分组（本地 / GitHub） ---------- */

  function persist(mutate, message) {
    if (state.mode === 'local') {
      // 本地服务按自己扫描到的文件应用分组，不会因此增删文档
      return fetch('api/documents', { cache: 'no-store' }).then(function (r) { return r.json(); }).then(function (d) {
        var data = normalize(d);
        mutate(data);
        cleanup(data);
        return H.postJson('api/documents/save', data);
      });
    }
    var files = online;
    return H.ghCommit(function (data) {
      var cur = merge(data, files);      // 把清单里还没有的线上文件补进去、去掉已删除的
      data.items = cur.items;
      mutate(data);
      cleanup(data);
      return { message: message, files: [], result: true };
    }, { path: DOCS_PATH, normalize: normalize });
  }

  function cleanup(data) {
    var used = {};
    data.items.forEach(function (it) { if (it.groupId) used[it.groupId] = 1; });
    data.groups = data.groups.filter(function (g) { return used[g.id]; });
  }

  function newId(prefix) { return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function errText(err) { return state.mode === 'github' && err.status ? H.ghErrText(err) : err.message; }

  /* ---------- 分组 ---------- */

  function groupNameErr(name, exceptId) {
    if (!name) return '请填写组名。';
    if (name.length > 30) return '组名不超过 30 个字。';
    var dup = docs.groups.some(function (g) { return g.id !== exceptId && norm(g.name) === norm(name); });
    return dup ? '已经有同名的分组，请换一个名字，或选择「放入已有分组」。' : '';
  }

  function openGroup() {
    if (!canWrite()) return;
    var ids = Object.keys(selected);
    if (!ids.length) return;
    $('grpIntro').textContent = '把已选的 ' + ids.length + ' 个文档放进一个分组。文档原来在其他分组里的，会移到这个分组。';
    $('grpErr').textContent = '';
    $('grpName').value = '';
    H.fieldErr('grpName', '');
    var sel = $('grpSelect');
    var groups = docs.groups.slice().sort(function (a, b) { return a.name.localeCompare(b.name, 'zh-CN'); });
    sel.innerHTML = groups.map(function (g) { return '<option value="' + esc(g.id) + '">' + esc(g.name) + '</option>'; }).join('');
    $('grpModeExist').disabled = groups.length === 0;
    sel.disabled = groups.length === 0;
    document.querySelector('input[name="grpMode"][value="new"]').checked = true;
    H.btnBusy('grpOk', 'grpCancel', false, '确定');
    H.openMask('grpMask');
    setTimeout(function () { $('grpName').focus(); }, 0);
  }

  function onGroupSubmit(e) {
    e.preventDefault();
    if ($('grpOk').disabled) return;
    var ids = Object.keys(selected);
    var mode = document.querySelector('input[name="grpMode"]:checked').value;
    var name = $('grpName').value.trim(), gid = $('grpSelect').value, label;
    if (mode === 'new') {
      if (!H.fieldErr('grpName', groupNameErr(name, null))) { $('grpName').focus(); return; }
      label = name;
    } else {
      if (!gid) { $('grpErr').textContent = '请选择一个分组。'; return; }
      label = (groupById(gid) || {}).name || '';
    }
    $('grpErr').textContent = '';
    H.btnBusy('grpOk', 'grpCancel', true, '正在保存…');
    persist(function (data) {
      var target = gid;
      if (mode === 'new') {
        var exist = data.groups.filter(function (g) { return norm(g.name) === norm(name); })[0];
        if (exist) target = exist.id;
        else { target = newId('g'); data.groups.push({ id: target, name: name, createdAt: new Date().toISOString() }); }
      } else if (!data.groups.some(function (g) { return g.id === gid; })) {
        throw new Error('这个分组已经不存在，请刷新后重试。');
      }
      data.items.forEach(function (it) { if (ids.indexOf(it.id) >= 0) it.groupId = target; });
      expanded[target] = true; H.lSet(K_EXPAND, expanded);
    }, '文档分组：' + ids.length + ' 个文档放入「' + label + '」').then(function () {
      H.btnBusy('grpOk', 'grpCancel', false, '确定');
      H.closeMask('grpMask');
      selected = {};
      H.toast('已把 ' + ids.length + ' 个文档放入分组「' + label + '」');
      refresh();
    }).catch(function (err) {
      H.btnBusy('grpOk', 'grpCancel', false, '确定');
      $('grpErr').textContent = '分组失败：' + errText(err);
    });
  }

  function ungroupSelected() {
    if (!canWrite()) return;
    var ids = Object.keys(selected).filter(function (id) {
      return docs.items.some(function (it) { return it.id === id && it.groupId; });
    });
    if (!ids.length) return;
    persist(function (data) {
      data.items.forEach(function (it) { if (ids.indexOf(it.id) >= 0) it.groupId = null; });
    }, '文档移出分组：' + ids.length + ' 个').then(function () {
      selected = {};
      H.toast('已把 ' + ids.length + ' 个文档移出分组');
      refresh();
    }).catch(function (err) { H.toast('移出分组失败：' + errText(err)); });
  }

  var renaming = null;
  function openRename(gid) {
    if (!canWrite()) return;
    var g = groupById(gid);
    if (!g) return;
    renaming = g;
    $('renName').value = g.name;
    H.fieldErr('renName', '');
    $('renErr').textContent = '';
    H.btnBusy('renOk', 'renCancel', false, '确定');
    H.openMask('renMask');
    setTimeout(function () { $('renName').focus(); $('renName').select(); }, 0);
  }

  function onRenameSubmit(e) {
    e.preventDefault();
    if ($('renOk').disabled || !renaming) return;
    var g = renaming, name = $('renName').value.trim();
    var err = name === g.name ? '和当前组名相同，无需修改。' : groupNameErr(name, g.id);
    if (!H.fieldErr('renName', err)) { $('renName').focus(); return; }
    H.btnBusy('renOk', 'renCancel', true, '正在保存…');
    persist(function (data) {
      var hit = data.groups.filter(function (x) { return x.id === g.id; })[0];
      if (!hit) throw new Error('这个分组已经不存在，请刷新后重试。');
      hit.name = name;
    }, '重命名分组：' + g.name + ' → ' + name).then(function () {
      H.btnBusy('renOk', 'renCancel', false, '确定');
      H.closeMask('renMask');
      renaming = null;
      H.toast('已将分组改名为「' + name + '」');
      refresh();
    }).catch(function (err2) {
      H.btnBusy('renOk', 'renCancel', false, '确定');
      $('renErr').textContent = '重命名失败：' + errText(err2);
    });
  }

  function dissolve(gid) {
    if (!canWrite()) return;
    var g = groupById(gid);
    if (!g) return;
    if (!confirm('解散分组「' + g.name + '」？\n组内文档会回到列表里单独显示，文档本身不会删除。')) return;
    persist(function (data) {
      data.items.forEach(function (it) { if (it.groupId === gid) it.groupId = null; });
    }, '解散分组：' + g.name).then(function () {
      H.toast('已解散分组「' + g.name + '」');
      refresh();
    }).catch(function (err) { H.toast('解散失败：' + errText(err)); });
  }

  /* ---------- 在线浏览 ---------- */

  function view(it) {
    var e = ext(it.name), url = docUrl(it);
    if (NATIVE_EXT.indexOf(e) >= 0) { window.open(url, '_blank', 'noopener'); return; }
    if (OFFICE_EXT.indexOf(e) >= 0) {
      // Office 文档用微软在线预览打开，需要文档已经发布到 GitHub Pages（公开网址）
      var pub = H.siteBase() + url;
      if (/^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])/i.test(pub)) { H.toast('Office 文档要先推送到 GitHub 后才能在线浏览，现在请先下载查看'); return; }
      if (state.mode === 'local') H.toast('正在用微软在线预览打开；还没推送到 GitHub 的文档会打不开');
      window.open('https://view.officeapps.live.com/op/view.aspx?src=' + encodeURIComponent(pub), '_blank', 'noopener');
      return;
    }
    if (TEXT_EXT.indexOf(e) >= 0) {
      $('viewTitle').textContent = it.name;
      $('viewBody').textContent = '加载中…';
      $('viewDownload').setAttribute('href', url);
      $('viewDownload').setAttribute('download', it.name);
      H.openMask('viewMask');
      fetch(url, { cache: 'no-store' }).then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.arrayBuffer();
      }).then(function (buf) {
        var max = 2097152, text = new TextDecoder('utf-8').decode(buf.byteLength > max ? buf.slice(0, max) : buf);
        $('viewBody').textContent = text + (buf.byteLength > max ? '\n\n……（文件较大，只显示前 2 MB，完整内容请下载）' : '');
      }).catch(function (err) {
        $('viewBody').textContent = '打开失败：' + err.message + '。如果刚推送，GitHub Pages 约 1 分钟后才能访问。';
      });
    }
  }

  /* ---------- 事件 ---------- */

  function findDoc(id) { for (var i = 0; i < docs.items.length; i++) if (docs.items[i].id === id) return docs.items[i]; return null; }

  $('docFilter').addEventListener('submit', onQuery);
  $('dqReset').addEventListener('click', resetFilter);
  $('dqReset2').addEventListener('click', resetFilter);
  $('docRefresh').addEventListener('click', function () { refresh(true); });
  $('docGroupBtn').addEventListener('click', openGroup);
  $('docUngroupBtn').addEventListener('click', ungroupSelected);
  $('docExpandAll').addEventListener('click', function () { docs.groups.forEach(function (g) { expanded[g.id] = true; }); H.lSet(K_EXPAND, expanded); render(); });
  $('docCollapseAll').addEventListener('click', function () { expanded = {}; H.lSet(K_EXPAND, expanded); render(); });
  $('docChkAll').addEventListener('change', function () {
    var on = this.checked;
    Array.prototype.forEach.call(document.querySelectorAll('#docRows tr.doc-row'), function (tr) {
      var id = tr.getAttribute('data-id');
      if (on) selected[id] = true; else delete selected[id];
    });
    render();
  });
  $('docRows').addEventListener('change', function (e) {
    var c = e.target;
    if (c.classList.contains('dchk')) {
      var id = c.closest('tr').getAttribute('data-id');
      if (c.checked) selected[id] = true; else delete selected[id];
      render();
    } else if (c.classList.contains('gchk')) {
      var gid = c.closest('tr').getAttribute('data-gid'), on = c.checked;
      docs.items.forEach(function (it) { if (it.groupId === gid && matches(it)) { if (on) selected[it.id] = true; else delete selected[it.id]; } });
      render();
    }
  });
  $('docRows').addEventListener('click', function (e) {
    var g = e.target.closest('[data-gop]');
    if (g) {
      var gid = g.closest('tr').getAttribute('data-gid'), op = g.getAttribute('data-gop');
      if (op === 'toggle') { if (expanded[gid]) delete expanded[gid]; else expanded[gid] = true; H.lSet(K_EXPAND, expanded); render(); }
      else if (op === 'rename') openRename(gid);
      else if (op === 'dissolve') dissolve(gid);
      return;
    }
    var v = e.target.closest('[data-dop="view"]');
    if (v) { var it = findDoc(v.closest('tr').getAttribute('data-id')); if (it) view(it); }
  });
  $('grpForm').addEventListener('submit', onGroupSubmit);
  $('grpCancel').addEventListener('click', function () { if (!$('grpCancel').disabled) H.closeMask('grpMask'); });
  $('grpName').addEventListener('focus', function () { document.querySelector('input[name="grpMode"][value="new"]').checked = true; });
  $('grpName').addEventListener('input', function () { H.fieldErr('grpName', ''); });
  $('grpSelect').addEventListener('change', function () { $('grpModeExist').checked = true; });
  $('renForm').addEventListener('submit', onRenameSubmit);
  $('renCancel').addEventListener('click', function () { if (!$('renCancel').disabled) { renaming = null; H.closeMask('renMask'); } });
  $('renName').addEventListener('input', function () { H.fieldErr('renName', ''); });
  $('viewClose').addEventListener('click', function () { H.closeMask('viewMask'); });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (!$('grpMask').hidden && !$('grpCancel').disabled) H.closeMask('grpMask');
    else if (!$('renMask').hidden && !$('renCancel').disabled) { renaming = null; H.closeMask('renMask'); }
    else if (!$('viewMask').hidden) H.closeMask('viewMask');
  });

  window.PRDHUB_DOCS = { refresh: refresh };
})();
