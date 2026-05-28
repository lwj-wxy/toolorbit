## URL 编码详解：安全字符、查询参数与浏览器行为

URL 看起来简单，直到某个字符破坏登录跳转、支付回调、搜索筛选或统计链接。空格、`&`、`/`、`?`、`#`、Unicode 字符和百分号，在不同位置都有特殊含义。URL 编码的作用，就是让数据安全地穿过这套既要给人读、又要给机器解析的语法。

核心是上下文。某个字符在路径片段中可能安全，在查询参数值中却不安全。斜杠可以分隔路径，但如果它是商品 ID 的一部分，就可能需要编码。`&` 可以连接查询参数，但如果它是搜索词的一部分，不编码就会被服务器误认为新参数。

### 百分号编码是什么

URL 编码通常指百分号编码：把不安全字节表示为 `%` 加两位十六进制。空格可以变成 `%20`。当 `&` 是数据而不是参数分隔符时，会变成 `%26`。非 ASCII 文本会先转成 UTF-8 字节，再把每个字节进行百分号编码。

所以 Unicode 编码后的 URL 会变长。中文“工具”在人看来只有两个字，但每个字会变成多个 UTF-8 字节，每个字节又会变成百分号序列。这是正常现象。URL 变长了，但更容易安全通过浏览器、代理、日志和服务器。

### 路径、查询和片段是不同区域

URL 包含 scheme、host、path、query 和 fragment 等区域。不同区域的编码规则并不完全相同。在查询字符串中，`?` 开始查询，`&` 分隔参数，`=` 分隔参数名和值。`#` 后面的 fragment 通常由浏览器在客户端处理，不一定发送给服务器。

常见错误有两类：把整个 URL 一次性编码，或完全不编码用户输入。更安全的方式是只对动态值按目标位置编码。查询值按查询值编码，路径片段按路径片段编码。不要把 `https://`、`?` 和 `&` 这些结构符号一起编码掉。

### JavaScript 中该用哪个函数

JavaScript 有 `encodeURI` 和 `encodeURIComponent`，两者不能混用。`encodeURI` 面向完整 URL，会保留 `:`, `/`, `?`, `&` 等结构字符。`encodeURIComponent` 面向单个组件，例如查询参数值，会编码更多字符。

```js
const search = "red shoes & socks";
const url = `/search?q=${encodeURIComponent(search)}`;
// /search?q=red%20shoes%20%26%20socks
```

如果这里用 `encodeURI(search)`，`&` 会保留，可能被解释成参数分隔符。如果对整个 URL 使用 `encodeURIComponent`，斜杠和问号也会被编码，结果就不再是正常可点击的 URL。

### 常见生产问题

第一类是二次编码。已经包含 `%20` 的值又被编码一次，变成 `%2520`，因为 `%` 自身会变成 `%25`。这通常发生在前端和后端都试图负责编码时。

第二类是过早解码。如果反向代理、框架或路由在安全检查前解码路径，编码后的斜杠或点路径可能出现意外行为。涉及安全的路由不应该只测试正常路径，还要测试编码变体。

第三类是把 `+` 和 `%20` 总是当成等价。在 `application/x-www-form-urlencoded` 查询字符串里，`+` 常常代表空格；但在其他 URL 位置，`+` 可能就是字面量加号。搜索、OAuth 跳转和支付回调都会受影响。

### ToolOrbit 实用流程

可以用 [URL 编解码工具](/tools/dev/url-encoder) 对单个值进行编码，再放入查询参数或回调地址。查询参数里包含 JSON 时，先用 [JSON 格式化](/tools/dev/json-formatter) 检查结构。对比正常和异常回调 URL 时，用 [文本对比](/tools/dev/text-diff) 找差异。如果文本含非 ASCII 字符，再用 [Unicode 转换](/tools/dev/unicode-converter) 判断问题来自编码还是字符规范化。

构造营销链接时，建议显式管理参数：

```js
const params = new URLSearchParams({
  utm_source: "newsletter",
  utm_campaign: "spring launch",
  q: "image tools & pdf tools"
});

const url = `https://example.com/search?${params.toString()}`;
```

`URLSearchParams` 可以减少忘记分隔符或错误编码的概率，也让代码评审更清楚地看到每个参数。

### 最后检查清单

编码动态值，而不是整个 URL 结构。查询参数值使用 `encodeURIComponent`。警惕二次编码。测试 Unicode、空格、`&`、斜杠、加号和 hash 片段。JavaScript 中构造查询字符串时优先使用 `URLSearchParams`。只在负责解释该值的层进行解码。

URL 编码并不华丽，但它是可靠 Web 系统的基础细节。安全的 URL 能在浏览器、服务器、日志、重定向和分析工具之间保持语义一致。
