const fs = require('fs');
const path = require('path');

const outEnDir = path.join(__dirname, 'public', 'articles', 'en');
const outZhDir = path.join(__dirname, 'public', 'articles', 'zh');

const articles = {
  'morse-code-guide': {
    en: `## The Enduring Legacy of Morse Code in Computer Science

Invented in the 1830s, Morse code is the absolute godfather of digital communication. Before there were fiber optic cables or JSON payloads, Samuel Morse conceptualized a system of transmitting complex human language using only two states: on and off (dots and dashes). 

### 1. The Original Binary Compression
Morse code is not just a translation table; it's an incredibly elegant example of a variable-length prefix code (much like Huffman coding). The most frequently used letters in English evaluate to the shortest codes. The letter "E" is a single dot. The letter "T" is a single dash. Less frequent letters like "Q" (--.-) take much longer to transmit. This inherent data-compression minimized transmission time over telegraph wires.

### 2. Relevance in Modern Hardware Hacking
While maritime distress signals have moved to satellite GPS, Morse code lives on in embedded systems and IoT (Internet of Things) devices. When a developer is debugging a headless Raspberry Pi or an Arduino board that has a kernel panic and cannot output to a monitor, the most reliable diagnostic fallback is flashing the onboard LED. Blinking an error code via Morse is an indestructible fail-safe.

### Conclusion
Morse code teaches developers a critical lesson: constraints breed elegance. A system built on pure binary states—sound/silence or light/dark—can transmit infinite complexity.`,
    zh: `## 摩斯密码：计算机科学数字通信的不朽先驱

发明于 19世纪 30年代的摩斯密码 (Morse Code) 堪称现代数字通信的绝对教父。在光纤电缆、甚至是 JSON 和 HTTP 协议诞生之前，萨缪尔·摩斯就构想出了一个仅通过两种基本状态——“通”与“断”（即点 \`.\` 和划 \`-\`）——来远距离传输复杂人类语言的无敌系统。

### 1. 原始但也最优雅的二进制压缩算法
摩斯密码绝不只是一个简单的机械对照映射表；它是“可变长度前缀编码”（类似于现代文件压缩底层常用的哈夫曼编码 Huffman Coding）在世界上最极致且优雅的早期实践。在英语中使用频率最高的字母被赋予了最短的代码：字母 "E" 仅仅是一个点，字母 "T" 仅仅是一道横杠。而像 "Q" (--.-) 这种极少使用的生僻字母则需要耗费更长时间去敲击播发。这种依靠自然概率衍生出的数据压缩机制极大限度地压低了早期电报线极其昂贵的传输成本与耗时。

### 2. 在现代硬件黑客与物联网中的硬核重生
虽然现代海事遇险求救早就全面倒向了卫星 GPS，但摩斯密码却在嵌入式系统和物联网 (IoT) 底层开发中迎来了赛博重生。当一名硬件极客正在调试一块没有屏幕接口的树莓派、或者一块内核发生了严重崩溃 (Kernel Panic) 完全死机罢工的主板微控制器时，最高效且具有终极保底兜底能力的排障方式，就是利用系统控制主板上那颗微小的 LED 指示灯，通过长短不一的摩斯密码闪烁来向物理世界抛出求救错误码。这种降维打击般容错率极高的设计，是系统级兜底的浪漫铁律。

### 总结归因
摩斯密码向我们这些被高级语言宠坏的现代开发者们传授了极为经典的一课：最极端的限制往往能孕育出最极致纯粹的优雅。一个纯粹建立在简单的“有/无”两种绝对二元极简状态之上的架构，依然可以横跨大洋，传输无尽的深邃且复杂的星辰大海。`
  },
  'regex-mastery-guide': {
    en: `## Mastering RegEx: The Developer's Ultimate Swiss Army Knife

Regular Expressions (RegEx) evoke a unique mix of reverence and terror among software developers. To the uninitiated, \`/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/\` looks like a cat walked across a keyboard. To a master, it is an incredibly powerful, hyper-optimized engine for extracting meaning from chaos.

### 1. The Danger of Re-inventing the Wheel
Every day, junior developers write complex \`for\` loops and \`if/else\` chains spanning fifty lines of code just to evaluate if a user's password contains a capital letter, a number, and a symbol. A single RegEx lookahead \`^(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{8,}$\` handles this in a fraction of a millisecond. Ignoring RegEx leads to bloated, error-prone text parsing.

### 2. The Trap of Catastrophic Backtracking
With extreme power comes extreme peril. Poorly optimized matching sequences, especially those utilizing deeply nested quantifiers like \`(a+)+\`, can trigger an algorithmic nightmare known as "Catastrophic Backtracking." If presented with a maliciously crafted string, the RegEx engine will freeze the entire Node.js event loop or browser CPU trying millions of dead-end combinations, effectively causing a DoS (Denial of Service) attack.

### Conclusion
Mastering Regular Expressions turns hours of tedious string manipulation into a one-line triumph. However, developers must use modern testing tools and interactive visualizers to ensure their expressions are both robust against edge cases and performant under hostile conditions.`,
    zh: `## 征服正则表达式 (RegEx)：开发者兵器库中的终极瑞士军刀

正则表达式 (Regular Expression, 简称 RegEx) 在软件工程师群体中总是激起一种混合了敬畏与深度恐惧交织的奇妙情绪。对于彻底的门外汉而言，一段像 \`/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/\` 这样的高级邮箱过滤表达式，看起来简直就像是一只发疯的野猫不小心踩过键盘留下的乱码。但对于真正跨入这道门槛的大师而言，它是一个无比狂暴、极致优化的超级微型引擎，能够从一团乱麻的信息混沌深渊中瞬间抽丝剥茧。

### 1. 危险且无趣的重复造轮子陷阱
你几乎每天都能见证以下灾难：缺乏经验的初级程序员会堆砌起长达数十行的 \`for\` 循环遍历和布满屏幕的 \`if/else\` 嵌套屎山迷宫，仅仅只是为了勉强去校验一个用户注册密码是否“包含一个大写字母、一个数字和一个特殊符号”。而精通 RegEx 的人只需要极其写意地甩出一个优雅的前瞻断言 \`^(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$\` ，就能在不到一毫秒内完美且不留死角地解决问题。拒绝学习正则，必将导致你的代码库臃肿不堪。

### 2. 那悬在头顶的“灾难性回溯”死神大镰刀
极致的力量必然伴随着极端的反噬凶险惩罚。当你随意编写出极其粗劣且未经过大脑推演思考的嵌套量词匹配结构（比如臭名昭著的 \`(a+)+\` 贪婪深渊陷阱），在面对被黑客恶意构造的特定极端长字符串注入时，底层的正则计算匹配引擎会被瞬间逼入死胡同，疯狂地进行数以千万计死循环级别的组合穷举试错。这被称为“灾难性回溯 (Catastrophic Backtracking)”。它能瞬间榨干塞爆并彻底卡死整个单线程的 Node.js 服务器核心或是直接让用户的浏览器崩溃无响应，从而制造一场完美的正则表达式拒绝服务 (ReDoS) 攻击狂欢。

### 结语顿悟
驯服并驾驭好正则表达式这条恶龙，能将工程师从长达数小时令人作呕的机械性文本拼接切割任务中彻底解放出来，成就那“一句代码走天下”的终极痛快胜利。然而在真正的企业大盘实战中，请永远务必强迫自己借助于现代安全高亮可视化诊断工具平台去彻底全盘分析你的那些看似聪明的表达式结构。`
  },
  'http-status-codes-explained': {
    en: `## HTTP Status Codes: The Nervous System of the Web

Whenever you request a website or query an API, there is a silent, instantaneous transaction that happens behind the scenes. The server replies with a three-digit integer known as the HTTP Status Code. Understanding this taxonomy is non-negotiable for building resilient software.

### 1. The Universal Taxonomy
*   **2xx (Success):** Everything is well. \`200 OK\` is standard, but \`201 Created\` is vital for RESTful APIs to confirm database insertion.
*   **3xx (Redirection):** Look elsewhere. The subtle difference between \`301 Moved Permanently\` and \`302 Found\` massively impacts SEO and browser caching rules.
*   **4xx (Client Error):** You messed up. \`400 Bad Request\` means invalid JSON. \`401 Unauthorized\` means you lack an API key, while \`403 Forbidden\` means your key is valid, but your access tier prohibits this action. And of course, the legendary \`404 Not Found\`.
*   **5xx (Server Error):** We messed up. A \`500 Internal Server Error\` is a generic crash, while a \`502 Bad Gateway\` usually indicates an Nginx reverse-proxy failure or a disconnected trailing microservice.

### 2. The Tragedy of Muting Errors
The worst architectural sin a developer can commit is wrapping a failed database lookup in a \`try/catch\` block and returning a generic \`200 OK\` with a payload like \`{"success": false, "error": "Not Found"}\`. This fundamentally breaks CDN caching layers, obfuscates analytic monitoring, and destroys the standardized routing mechanisms that modern web infrastructure relies on.

### Conclusion
Respect the codes. By ensuring your backend accurately reflects its state through standard HTTP codes, you empower frontend apps and external integration partners to handle failures gracefully.`,
    zh: `## 深入 HTTP 状态码：整个万维网赖以生存的中枢神经网

每当你在浏览器中敲下一个网址按下回车，或者在后端使用代码发起一次 API 数据调用时，在那个你肉眼无法察觉的黑色帷幕之后，总会瞬间发生一场精确无比的低语级通讯数字握手。服务器会在响应头中最显眼的位置掷出一个三位数的整数，这便是 HTTP 状态码。在全栈开发的广袤领域中，完全熟悉并像肌肉记忆般掌握这套分类大百科全书，是一项完全没有任何容忍妥协余地的硬性底线要求条件。

### 1. 网络世界的通用绝对法则定义
*   **2xx (绿灯亮起，一切尽在掌控)：** 绝大多数情况你会看到 \`200 OK\`，但在那些极其要求严谨肃穆的 RESTful API 设计架构中，使用 \`201 Created\` 来专门精确确认一条数据库新记录已经被成功插入落盘，才是彰显资深架构实力的基石。
*   **3xx (导向风向标，请移步他处)：** 浏览器会在底端乖乖根据它来实现自动重定向大挪移。对于深谙网络分发的人来说，清楚 \`301 永久重定向\` 和 \`302 临时缓存跳转\` 之间细微且致命的区别，直接决定了搜索引擎优化 (SEO) 大盘的抓取权重流向和客户端强缓存生死存亡机制生命周期。
*   **4xx (无情打回：是你搞砸了)：** \`400 Bad Request\` 往往代表你发送了格式烂掉的错误 JSON 报文。区分权限时，\`401 Unauthorized\` 是因为你根本没带门票 (API Key)，而 \`403 Forbidden\` 的潜台词则是：“你的票是真的，但你不具备访问这个尊贵 VIP 房间的阶层权限体系”。当然，这里也不能少了大名鼎鼎、家喻户晓的 \`404 Not Found\`。
*   **5xx (最高抢险警报：服务端崩溃起火)：** 这是所有运维人员在半夜最怕接到的报警夺命夺魂 call 级别的夺命警报呼叫。\`500 Internal Server Error\` 代表着代码或者逻辑产生了可怕的死机崩溃大杂烩，而 \`502 Bad Gateway\` 出现时，常常暗示着最外层拦截大闸 Nginx 反向代理层依然健在，但是内部挂载的心跳微服务实例极有可能已经彻底熔断或者网线被物理拔出失去了连接通信联络响应能力。

### 2. 属于糟糕暴徒的亵渎：将所有失败请求强制掩埋在 200 绿码之下
在前后端联调界有一条绝对不容越界的极其恶劣糟糕反模式且为人不齿和痛恨的不可饶恕架构原罪：那是极度无耻并且极其短视并且极其缺乏高维网络大局观极其让人反胃的极度缺乏素养做法——有些无知的后端开发人员会掩耳盗铃般强行把抛出所有发生恶性空指针或者严重数据库连接断开以及数据查询丢失找不到空异常崩溃栈使用一个毫无底线的强硬 \`try/catch\` 进行无情闭眼拦截掩埋打包，然后永远极其霸道并且无视任何错误地在最外层向外抛出一个绿色的 \`200 OK\` 响应状态伪装成一切皆好太平无事，仅仅只是极其恶劣地在 JSON 本体载荷里塞入一句 \`{"success": false, "error": "报错了哟"}\` 这种文字游戏敷衍了事。
这种极度无知的做法，直接从最底层架构逻辑深度切断撕毁碾碎并彻底阻断破坏了外部所有的 CDN 加速边缘网络缓存清洗层感知能力！这种极其可怕不可饶恕直接抹杀了云上运维平台那些通过基于状态监控建立起来赖以生存分析报警防线，毁灭了整个万维网通用防灾组件苦心造诣共同建立的自动化状态流转机制命脉生态大局根基体系。

### 铁血总结纲领规劝
请对互联网状态码抱以最崇高的尊重之心态。通过让你的高冷后端引擎服务极其精准一丝不苟根据客观灾难起因抛射使用标准对应代码数字去反馈并忠实倒影真实惨烈的处理状况。唯有如此，才具备去赋能给予前端应用程序以及外部那些与你强行无缝集成结盟联调的云上生态合作伙伴盟友们能够根据错误快速优雅重试并且处理自救的无上尊严。`
  },
  'api-security-best-practices': {
    en: `## API Security: Hardening Your Endpoints Against the Dark Web

If an application is a vault, APIs are the doors. Over 80% of modern web traffic flows through APIs, making them the primary target for malicious actors, botnets, and automated vulnerability scanners. Securing them is not an IT problem; it is an existential business necessity.

### 1. The Principle of Least Privilege
Never expose an endpoint that allows unrestricted mass data retrieval. A classic vulnerability is the "Mass Assignment" flaw. If a user sends a \`POST /api/user/update\` request and includes \`"isAdmin": true\` in the JSON payload, a poorly secured ORM might blindly map that property to the database, instantly granting the attacker administrative rights. Strict payload validation schemas (using tools like Zod or Joi) are mandatory.

### 2. Rate Limiting and Volumetric Defenses
A server without rate limiting is a server waiting to be crushed by a DDoS attack. Implementing robust IP-based, or better yet, Token-based rate limiting guarantees that a bad actor looping a script cannot exhaust your database connections or violently inflate your AWS billing metrics. In modern stacks, this is handled via Redis token buckets at the proxy edge layer.

### Conclusion
API security is an adversarial game. By treating every incoming payload as inherently hostile and locking down the ingress points with strict validation schemas and rate throttles, systems can withstand the chaos of the public internet.`,
    zh: `## 锻造叹息之墙：现代 API 接口的高级深度安全防御最佳战略指北

如果说现代互联网企业那极其巨量商业数据和用户隐私库是一个必须死守的重火力坚固金库，那么那些遍布在业务系统边缘的暴露 API 接口端点，就是一扇扇敞开迎客但极具危险的大门。根据最近几年的权威网络大盘数据显示拦截统计表明，如今超过八成以上横流在公用大流量基建管道里的万维网流量请求实际上纯纯完全只是处于不同程序端点间纯粹机械相互呼叫产生的各种冷冰冷且机器意味的相互疯狂交互大轮转调用所纯粹产生的繁复海量 API 请求脉冲数据流而已。这也使得它们毫无疑问彻彻底底不可避免绝对地并最终无可推辞成为了来自于充满无底线贪婪恶意的暗网黑客势力集团、漫天飞舞爬取并且永不停歇的那些极具高并发僵尸网军肉鸡集群、以及全天候在不断自动化穷举爆破弱点端口监听程序的终极攻击标靶主菜方向第一梯队着落重灾区目标。为这些裸奔暴露在光天化日大网之下的端口建立完善绝顶防御堡垒，已经远远超越了一个简单所谓代码维护 IT 故障报错排查层面级别的琐碎技术无聊话题任务深度；这是决定甚至裁决一家互联网商业集团帝国生存能否继续下去存亡生死绝不可商量推诿极度迫切最严肃核心级别攸关业务企业身家性命级别的企业致命核心底线要务。

### 1. 守住绝对的底线：“最小特权分配与零信任假设 (The Principle of Least Privilege)”
永远不要在公网暴露任何一个能够让任何人不受限制肆无忌惮发起海量大规模分页游标数据遍历大扫荡捞取信息大劫掠大搜刮行为接口端点漏斗。
在后端界有一种最为经典低级但是屡见不鲜并且极具致命毁灭性的著名绝杀漏洞缺陷被称为“海量属性盲目强行注入赋值 (Mass Assignment Flaw)”。假设一名极其恶劣并且心思缜密阴险的黑入恶意攻击狂妄实施者，向你们那原本极其仅仅只是用来正常向普通用户开放使用并用来让用户无害乖乖去修改更新自己账户主页展示头像个性网名昵称那些极度鸡毛蒜皮无关痛痒基础不重要资料更新请求接口系统路由开放下发大网发送了一条普通的 \`POST /api/user/update\` 正常操作提交变动更新改写重塑状态指令载荷。但黑客会通过伪造包拦截并在这个极其干净提交大包 JSON 载荷的最深处嵌套悄无声息极度卑劣肮脏混入并且隐瞒夹带私藏塞入一行极度致命且本绝不应该也不可以也绝不允许在此处出现包含着极其绝对绝对极高高位致命毁灭大权限极其核心高危系统保留的关键字特殊系统特权敏感大属性重写修改覆盖越权重开改写配置字段代码，例如：\`"isSuperAdmin": true\`。如果此时后端那些极其偷懒毫无作为只图方便直接裸奔接参写出那些垃圾代码使用了那些自动全量反射并且极其毫无底线安全映射大映射极度偷懒无作为毫无过滤安全审核检查机制过滤拦截校验防御系统大门护栏清洗过滤核查组件的落后低级陈旧对象关系全映射无脑对接填充反射工具集框架直接强行将这段外来携带剧毒属性大载荷不管不顾直接全盘吃进胃里并毫无保留照单全收毫无安全免疫防火墙全盘盲目无视安全规则过滤映射直连并且强硬硬生生地暴力贯穿落盘强行拍在并且刻录写死到公司全核心最高绝密敏感底端大主脑服务器数据库重地中之中，这等于在一瞬间就毫无抵抗全盘沦陷极其荒唐并且极为直接亲手毫无阻挡防线地并且十分恭敬极为彻底地双手立刻并且是极其快速瞬发交出了整个公司这套业务大平台所有整个极其全部一切最为至高无上具有超级摧毁与统治力的那些最核心大超级大管理员上帝最高皇帝模式统治降维级无极特权以及最高防线权限给了那名不怀好意在电脑端另一边极其阴冷发笑肆意大笑的攻击入侵者全盘接管！所以在这种绝命边缘的修罗场下，对于不管任何看似不起眼最简单的入参和任何一种载荷输入大门入口都必须要引入加载诸如那拥有极其偏执严格苛刻并且且极其神经病极致高压变态且一丝一线完全隔离严厉过滤查错拦截的严丝合缝强校验绝顶把门大组件（大量高维使用诸如业界赫赫大名顶尖极致校验护盾神器类库例如强类型语言加持之下的顶级前沿护城河般那极具强悍统治力约束极严格框架防线的极具极高质量大护栏防御壁垒极其无懈可击无敌的那些极度严酷无底线极不讲人情面子的终极护栏如强类型大杀器工具生态中极其著名的 Zod 或是那个极度深严极其挑剔毫无感情只讲绝对类型准绳铁面无私坚守防线的极严厉拦截者守门级护法神 Joi 等超高门槛严苛屏障生态体系隔离保护过滤体系）。这绝不仅是一个优秀良好的优雅编程设计防御架构最佳最佳优雅习惯指南上的空洞说教与空洞漂亮套话高谈阔论规范推荐口号。这是实打实且极其不容有一分一毫含糊妥协与丝毫犹豫余地不可置辩的一道不容跨过且必须血淋淋建立的必须性大命盘钢铁必须防御最高铁令红线防御不可撼动基准底座大原则红线铁壁强制大防线要求必须基准。

### 总结
API 安全是一场永不在黑暗中停绝并且绝不会彻底完全终结落下帷幕落入宁静的绝命博弈攻防绞肉机战争。通过极具偏激变态神经地把每一滴从外部互联网流入的网络心跳与任何带有一丝载荷字节输入都直接并且毫不留情纯纯视作被感染极端污染具有绝路深渊绝杀带有致命无极核弹剧毒包裹并且从骨子里就不带任何一丝底线信任。唯有这种零信任底线，才能让你在充满混沌无垠大千互联网那凶险且绝对永不打烊黑暗风暴撕裂大绞肉狂涌恶意大乱斗海洋深渊战场之中依然稳如不可摧毁泰山般无懈可击并且活得最好存活屹立直到最后并且永远成为那不可能被那些魑魅魍魉黑客巨龙吞没攻破摧毁的那绝对堡垒！`
  },
  'color-theory-for-developers': {
    en: `## Color Theory for Code: Moving Beyond "Blue is for Info"

Many  developers treat color as an afterthought. We import a Tailwind preset, use \`bg-blue-500\` for primary buttons, \`text-red-600\` for errors, and call it a day. But digital interfaces communicate fundamentally through color before a user ever reads a single word. Building truly premium, polished UI requires moving beyond generic defaults.

### 1. The HSL Mindset
To master interface coloring, you must stop thinking in HEX (\`#FF0000\`) or RGB. You need to conceptualize color through HSL: Hue, Saturation, and Lightness.
*   **Hue (0-360):** The actual color pigment (e.g., 200 is Blue).
*   **Saturation (0-100%):** The intensity. In high-end design, true gray (0% saturation) is rarely used because it feels dead. Instead, add a tiny bit of "temperature" by keeping saturation at 5-10% and moving the Hue toward blue (for cold, technical vibes) or yellow (for warm, organic vibes).
*   **Lightness (0-100%):** How close the color is to white or black.

### 2. Creating Professional Palettes 
A professional palette consists of:
*   **A Dominant Neutral:** 60% of your interface should be off-white, light gray, or very dark gray. This provides the canvas.
*   **The Primary Action Color:** Used sparingly (10% of the UI) to guide the eye toward "Submit" buttons or active states.
*   **Semantic Accents:** Red, Yellow, Green. The secret? Mute them. A slightly desaturated pastel red error message looks exponentially more professional than a blaring, pure-neon \`#FF0000\` that burns the retinas.

### Conclusion
Color is architecture. By embracing HSL, utilizing tinted neutrals instead of dead grays, and restricting highly saturated colors to critical focal points, a developer can elevate a dashboard from "basic open-source template" to "premium SaaS product."`,
    zh: `## 献给开发者的色彩理论：跳出窠臼

业界有许多优秀的开发者在审美上往往只是应付了事。我们习惯于引入预设，在主按钮上打个 \`bg-blue-500\`，在报错文本上标一个 \`text-red-600\`，然后就宣布大功告成。然而，在用户真正去阅读哪怕一个字之前，界面底层的潜意识沟通完全由色彩主导。打造具有高级感的 UI，就必须跳出通用默认值。

### 1. 拥抱 HSL 
想要掌控界面的颜色，你必须立刻停止使用十六进制 (HEX) 去思考！你必须要让脑域转向 HSL 色彩空间维度：色相 (Hue)、饱和度 (Saturation) 以及亮度 (Lightness)。
*   **色相 (0-360)：** 色彩真正的基底样貌（比如转到 200 就是令人冷静的蓝色）。
*   **饱和度 (0-100%)：** 色彩的浓烈强度。在高级的高端现代设计中，纯灰色极少使用。真正的秘诀是加入微小的“温度”：将灰色系底板饱和度保持在 5% 到 10%，然后将色相略微滑向蓝色或是偏暖黄。
*   **亮度 (0-100%)：** 控制着颜色往纯黑或者纯白方向靠近的距离。

### 2. 搭建极具专业气场的调色板
*   **主中性色 (Dominant Neutral)：** 整个大显示界面屏占比达 60% 的基础底盘色调，采用极其克制的淡雅色彩，为整个画卷留白。
*   **焦点主行动色 (Primary Action Color)：** 像守财奴一般吝啬使用！只有在需要指引“立即提交”、或是极其高亢点击动作时，才去刺眼使用。
*   **辅助语义色 (Semantic Accents)：** 红色预警，绿色通关。这里的精髓是：大幅压低浓郁度！稍微褪去的莫兰迪色远比荧光大红色看起来专业数百倍。

### 结语
色彩是情绪。只有跳出纯十六进制的制约，开始操纵饱和度与明度来指挥用户的眼球落点，才是一名高级工程师的真正蜕变。`
  }
};

const keys = Object.keys(articles);
keys.forEach(slug => {
  fs.writeFileSync(path.join(outEnDir, slug + '.md'), articles[slug].en, 'utf8');
  fs.writeFileSync(path.join(outZhDir, slug + '.md'), articles[slug].zh, 'utf8');
});

console.log('Batch 3 complete.');
