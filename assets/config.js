/* 产品需求管理系统 · 配置
 * gate：登录密码（随机盐 + SHA-256 哈希，不存明文）。修改密码用 工具\set-password.ps1。
 * maxAttempts / lockSeconds：连续输错多少次后锁定多少秒。
 */
window.PRDHUB_CONFIG = {
  gate: { salt: "f3245a721d95ccff036b331d6193d84a", hash: "36c7429267f5a25599c546880179656d761104ae4da865003d71d5e5c6e9c952" },
  maxAttempts: 5,
  lockSeconds: 30,
  initialVersion: "v1.0"
};
