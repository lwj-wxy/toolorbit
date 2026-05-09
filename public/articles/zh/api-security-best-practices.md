# API 安全最佳实践：从 JWT 泄露到 SSRF 防御

> *互联网充满了危险。这里有五条现代 Web 应用中保护 API 安全的金科玉律，旨在保护您的每一项数据。*

Welcome to another insight from ToolOrbit.

<h4>应用的安全护城河</h4><p>现代 web 应用程序的安全性很大程度上取决于其 API 的安全性。在没有任何防护措施的情况下暴露端点，就像是敞开大门迎接数据泄露。以下是实用的安全检查清单。</p><ul><li><strong>身份验证与授权 (AuthN & AuthZ):</strong> 实施健壮的 JWT 验证。确保令牌具有严格的过期时间，并使用定期轮换的签名密钥。严格区分“你是谁”和“你能做什么”。</li><li><strong>严格的 CORS 策略:</strong> 绝对不要在携带凭证的请求中使用 <code>Access-Control-Allow-Origin: *</code>。通过手动白名单配置信任的域名，防止跨域资源共享漏洞。</li><li><strong>限流与防止滥用:</strong> 通过限制每个 IP 以及每个用户 Token 的访问频率，防止暴力破解和 DDoS 攻击。</li><li><strong>输入校验与审查:</strong> 永远不要相信用户的输入。深度嵌套的恶意 JSON 数据可能会导致服务器 CPU 指数级飙升 (JSON 拒绝服务攻击)。</li></ul><h4>防御 SSRF 攻击</h4><p>服务端请求伪造(SSRF)极具破坏性。如果您的 API 会去请求用户提供的 URL（例如 Webhook 测试功能），请确保后端解析器严格屏蔽了内网 IP 段（如 <code>127.0.0.1</code> 或 <code>169.254.169.254</code> AWS 元数据服务）。</p><h4>日志审计机制</h4><p>记录所有异常和访问指标。没有日志，您对正在发生的攻击将一无所知。在数据流入日志服务器之前，通过脱敏算法屏蔽密码、手机号等 PII 隐私字段。</p>


## Conclusion
We hope this brief guide sheds some light on the subject. Feel free to explore our suite of tools designed exactly for tasks like these.