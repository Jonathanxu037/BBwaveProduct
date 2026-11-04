/* VIP会员体系 · 本需求专属脚本（2026-10-22 从 assets/proto.js、nav.js 移出）。
   assets/style.css、nav.js、proto.js 按需求包框架规范第 12.2 节整份同步模板，本包特有的脚本统一放在本文件，同步模板时不替换、不删除。
   只给原型页使用：原型页在 proto-en.js 之后、proto.js 之前引用本文件。
   （2026-10-22 规范 v5.58：英文画面去掉「（示意）」已由模板 proto.js 统一处理，本文件原先的同类处理已删除，避免重复。） */

/* 右侧批注栏（说明、模拟场景、模拟操作、规则批注）整体默认收进屏幕右侧，点右边缘的「说明与模拟」按钮滑出，
   再点「收起」或按 Esc 收回（2026-10-13 用户要求）。只改显示方式，不影响模拟功能。
   本包用自己的滑出面板，不用模板 nav.js 的「‹ 显示」批注框：模板生成的按钮和收起状态在这里移除（vip.css 另有兜底隐藏）。 */
(function () {
  function dropTemplateNotes(aside) {
    [].forEach.call(document.querySelectorAll(".notes-tab"), function (x) { x.remove(); });
    if (aside) [].forEach.call(aside.querySelectorAll(".notes-bar"), function (x) { x.remove(); });
    document.body.classList.remove("notes-off");
  }
  function setup() {
    var aside = document.querySelector("aside.notes");
    if (!aside || document.getElementById("ndBtn")) return;
    dropTemplateNotes(aside);
    if (!aside.id) aside.id = "pageNotes";
    document.body.classList.add("nd-on");
    var btn = document.createElement("button");
    btn.type = "button"; btn.id = "ndBtn"; btn.className = "nd-btn";
    btn.setAttribute("aria-controls", aside.id);
    document.body.appendChild(btn);
    function set(open) {
      document.body.classList.toggle("nd-open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.textContent = open ? "收起 ▶" : "◀ 说明与模拟";
      btn.title = open ? "收起右侧说明与模拟面板" : "展开右侧说明与模拟面板";
      aside.setAttribute("aria-hidden", open ? "false" : "true");
      if (open) aside.removeAttribute("inert"); else aside.setAttribute("inert", "");
    }
    set(false);
    btn.addEventListener("click", function () { set(!document.body.classList.contains("nd-open")); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && document.body.classList.contains("nd-open") && !document.querySelector(".ov:not([hidden]), .mask:not([hidden])")) set(false); });
    /* 模板 nav.js 和本文件都在 DOMContentLoaded 时执行；万一模板的按钮晚于这里生成，再清理一次 */
    setTimeout(function () { dropTemplateNotes(aside); }, 0);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", setup); else setup();
})();

/* 手机画面保持 390 × 844，按可用宽高共同缩放；固定列宽随缩放同步，避免窄屏居中裁切。仅当前 v1.3 启用宽度修正，历史版本保持原样。 */
(function () {
  function fit() {
    var col = document.querySelector('.vip-phonecol'), app = col && col.querySelector('.app');
    if (!col || !app) return;
    var stage = col.parentElement, current = /\/v1\.3\//.test(location.pathname);
    col.style.zoom = '';
    if (current) stage.style.gridTemplateColumns = '';
    var top = Math.max(0, app.getBoundingClientRect().top + window.scrollY);
    var s = Math.min(1, (window.innerHeight - top - 12) / app.offsetHeight);
    if (current) {
      var css = getComputedStyle(stage), available = stage.clientWidth - parseFloat(css.paddingLeft) - parseFloat(css.paddingRight);
      s = Math.max(0.1, Math.min(s, available / app.offsetWidth));
      stage.style.gridTemplateColumns = (app.offsetWidth * s) + 'px';
    } else s = Math.max(0.5, s);
    if (s < 1) col.style.zoom = String(s);
  }
  function setup() { fit(); window.scrollTo(0, 0); window.addEventListener('resize', fit); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup); else setup();
})();