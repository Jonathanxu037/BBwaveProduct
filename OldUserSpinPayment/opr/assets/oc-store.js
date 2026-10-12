/* 只读地取出「运营需求确认」页保存在本机浏览器的数据（意见列表、已提交版本、封板状态）。
   入口页的「运营需求修改记录」和「需求修改总结」页共用。数据存在 IndexedDB（库名 = KEY，表 kv，键 state），不可用时在 localStorage 的 KEY + "-state"。 */
window.OCStore = {
  key: function (topic) { return topic + "功能需求-运营需求确认"; },   /* 不含版本号，和运营需求确认页一致 */
  read: function (key) {
    return new Promise(function (res) {
      function fromLS() { try { var s = localStorage.getItem(key + "-state"); res(s ? JSON.parse(s) : null); } catch (e) { res(null); } }
      try {
        var r = indexedDB.open(key, 1);
        r.onupgradeneeded = function () { r.result.createObjectStore("kv"); };
        r.onerror = r.onblocked = fromLS;
        r.onsuccess = function () {
          try {
            var q = r.result.transaction("kv").objectStore("kv").get("state");
            q.onsuccess = function () { r.result.close(); if (q.result) res(q.result); else fromLS(); };
            q.onerror = fromLS;
          } catch (e) { fromLS(); }
        };
      } catch (e) { fromLS(); }
    });
  },
  /* 版本按提交时间倒序（最新在最上面），时间相同按版本号倒序 */
  byTime: function (vs) {
    return (vs || []).slice().sort(function (a, b) { return (b.at || "").localeCompare(a.at || "") || b.major - a.major || b.minor - a.minor; });
  },
  byVersion: function (vs) {
    return (vs || []).slice().sort(function (a, b) { return b.major - a.major || b.minor - a.minor; });
  },
  stats: function (v) {
    var c = { "确认修改": 0, "部分修改": 0, "不修改": 0, "待确认": 0 }, replied = 0;
    (v.rows || []).forEach(function (r) { var d = r.decision || "待确认"; c[d] = (c[d] || 0) + 1; if ((r.reply || "").trim() || d !== "待确认") replied++; });
    return { total: (v.rows || []).length, replied: replied, dec: c };
  }
};
