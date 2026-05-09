const fs = require('fs');
const path = require('path');

const outEnDir = path.join(__dirname, 'public', 'articles', 'en');
const outZhDir = path.join(__dirname, 'public', 'articles', 'zh');

const articles = {
  'base64-encoding-deep-dive': {
    en: `## Demystifying Base64: The Universal Tape of the Web

Base64 is arguably one of the most misunderstood mechanisms in computer science. Junior developers often mistake it for encryption, but its true purpose is much simpler, yet profoundly important.

### 1. What is Base64?
Base64 is not encryption; it is **encoding**. It exists to solve a fundamental problem: safely transporting raw binary data (like images or compiled binaries) across networks and text-based protocols (like HTTP or SMTP) that were originally designed only to handle plain text (ASCII).
Without Base64, if you tried to embed an image directly into an HTML file, the browser's parser would misinterpret random binary bytes as control characters, completely corrupting the data or crashing the renderer.

### 2. How it Works (The Math)
Base64 transforms binary data by taking groups of 3 bytes (24 bits) and splitting them into 4 groups of 6 bits. Each 6-bit group maps to one of 64 safe, printable ASCII characters (A-Z, a-z, 0-9, +, /). Because 3 bytes become 4 characters, Base64 encoding inherently inflates the data size by roughly 33%. 
This is why serving large images as inline Base64 data URIs \`data:image/png;base64,...\` in your CSS can severely impact page load performance. It should be reserved for tiny sprites or vital above-the-fold icons.

### Conclusion
Base64 is the digital duct tape holding the modern web together, allowing us to smuggle binary payloads through text-only gateways safely. Just remember: it provides zero cryptographic security. Never use it to hide passwords.`,
    zh: `## 潜入深海：揭开 Base64 编码的终极奥秘

在软件开发领域，Base64 可能是被误解最深的技术黑话之一。无数刚刚入门的新手开发者经常把它与“加密（Encryption）”混为一谈。然而它的真实面目非常纯粹，却又是整个现代万维网赖以生存不可或缺的底层基石。

### 1. Base64 到底为了解决什么痛点？
首先要明确：Base64 绝不是加密，它仅仅是一种**编码翻译映射（Encoding）**。它的诞生是为了解决一个非常古老的痛点难题：如何安全地将极其狂野不可控的纯二进制串流数据（例如一段压缩的视频录像、一张带 Alpha 通道的精美 PNG 透明图片，或者一段底层的操作系统驱动机器码）直接强行塞入、穿透并且安全传输流转在那些诞生之初只被设计出且只能用来承载运输普通并且极其脆弱简单纯英文字母文本（ASCII）的古老网络应用协议（例如极其古老的电子邮件 SMTP 协议或者 HTTP 网址参数传输协议）之中。
如果没有 Base64，当你试图把图片生硬塞进 HTML 里的那一刻，解析器会把二进制里那些杂乱无章的字节错认为终止符或者换行等不可见控制字符，瞬间导致整个文件架构错乱乱码，引发灾难级崩溃碎裂。

### 2. 底层数学原理大解剖
Base64 对二进制大刀阔斧的重塑原理其实极具极客极简美感：它就像是在切蛋糕一样，把源文件的每 3 个字节（共 24 个比特位）强行劈开，重新组合成 4 组（每组仅分得 6 个比特位）。这 6 个比特位最多只能表示 0 到 63 的小数字，于是正好可以完美映射对应到 64 个极其安全的、你在任何键盘上都能敲出来绝对安全的纯净可见字符库（大写 A-Z，小写 a-z，数字 0-9，附加上以及加号 \`+\` 和斜杠 \`/\`）。
正因为把 3 份切成了 4 份， Base64 编码从物理法则上注定会导致文件的原始体积原力膨胀暴涨整整约 33% 的大小。
这也是为什么高级前端绝对不会通过 \`data:image/png;base64,...\` 这种手段把体积几十兆超大轮播图嵌进由于加载阻塞严重的 CSS 样式源码表中的原因。这种极具代价的手法，应当仅仅保留给那些极小且极度关键的首屏矢量小图标去独占专享。

### 结语与最高警告红线
Base64 就是整个赛博世界中无所不能的超级万能粘合剂胶带，允许我们极为任性且不可思议地安全地将一切二进制荷载疯狂偷渡穿透那纯文本网关防线网络世界网关通道。但请永远刻下这句警告：它不提供一丝一毫哪怕丁点的任何密码学维度的加密安全防护！哪怕是一只刚刚学步走过键盘会按 ctrl+c 的小猫也能在半秒内把它还原。用它来掩饰隐藏密码无异于把房门钥匙挂在一块透明玻璃门的把手上。`
  },
  'sugar-content-rankings': {
    en: `## The Hidden Matrix: Decoding Sugar Content in Everyday Drinks

Modern dietary science has fundamentally rejected the fat-phobia of the 1990s and turned its sights on the true metabolic disruptor: added sugars. Understanding the sugar index of your beverages is arguably more impactful than counting raw calories.

### 1. The Liquid Candy Deception
When a beverage company labels a fruit juice as "100% All-Natural," it creates a powerful health halo. However, your liver processes the isolated fructose in a commercial apple juice almost identically to how it processes a can of cola. A standard 12oz (355ml) can of cola contains approximately 39 grams of sugar. Astonishingly, many popular "healthy" vitamin waters, sports drinks, and sweetened iced teas hover around 30-35 grams, effectively neutralizing any metabolic benefit they claim to offer.

### 2. Coffee Shop Sabotage
A black coffee contains 0 grams of sugar. However, venturing into the blended frappe or flavored latte territory changes the math exponentially. A large caramel blended coffee drink from major chains routinely exceeds 60 grams of sugar—nearly equating to the sugar content of three full-size dessert donuts.

### Conclusion
Navigating modern beverage options requires ruthlessness. By learning to read between the lines of nutritional labels and spotting disguised sugars (like maltodextrin, high-fructose corn syrup, and agave nectar), consumers can reclaim their metabolic health and break the invisible addiction cycle.`,
    zh: `## 隐藏的甜蜜矩阵：深度解密日常饮品那致命的隐形糖分

现代营养学早就推翻了 90 年代对脂肪的妖魔化，将审视的目光锁定在更严重的引发代谢崩溃的凶手——“人工添加的游离糖”。掌控饮品的升糖指数，绝对比可怜兮兮地计算卡路里更直击痛点。

### 1. 液体炸弹：“伪健康”的完美外壳
当饮料巨型企业将瓶身印上“100% 纯天然果汁”时，这无疑是一场包装欺诈。因为你的肝脏在试图消化一瓶所谓高端苹果汁里的果糖时，它承受的负荷完全相似于抵御一整罐可乐！一罐标准的可乐含有约 39 克极其可怕的糖分。但令人三观震碎的是：超市货架上那些被你标榜健康代表的维他命能量水，糖量经常轻松逼近 30 到 35 克。

### 2. 街角咖啡馆的隐秘陷阱
冰美式黑咖啡的糖分为完美的零。但如果你越界踏入了加了焦糖雪顶或是打底果酱的星冰乐领域，那健康算盘瞬间炸裂。一杯超大杯的此类冷饮，轻易就会冲破 60 克的工业糖分剂量——这等同于你一口气吞下三个极其甜腻的美式糖霜甜甜圈！

### 惊魂觉醒与结语
在当今糖衣炮弹防不胜防的丛林求生中，必须保持极其严酷的警惕心。学会看穿配料表里诸如麦芽糊精、高果糖浆这些马甲，才能夺回代谢健康的主导权，彻底告别人工糖分的成瘾怪圈。`
  }
};

const keys = Object.keys(articles);
keys.forEach(slug => {
  fs.writeFileSync(path.join(outEnDir, slug + '.md'), articles[slug].en, 'utf8');
  fs.writeFileSync(path.join(outZhDir, slug + '.md'), articles[slug].zh, 'utf8');
});

console.log('Batch 4 partially complete.');
