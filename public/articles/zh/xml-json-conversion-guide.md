## XML 与 JSON 转换时要注意什么

XML（可扩展标记语言）和 JSON（JavaScript 对象表示法）都用于数据交换。JSON 常见于现代 Web API，XML 仍常见于企业系统、SOAP、文档配置和行业协议。

两者可以互转，但不能只做字符串替换。属性、数组、命名空间和类型推断都可能改变数据结构。

### 1. 核心差异的本质

转换前先理解结构差异。

*   **XML 面向文档 (Document-Oriented)：** 它最初的设计目的是标记文本，天生支持混合内容（文本与子节点混合）以及通过属性（Attributes）附加元数据。
* **JSON 面向对象 (Object-Oriented)：** 它用于表示对象、数组、字符串、数字和布尔值。JSON 没有 XML 属性和命名空间的原生概念。

### 2. 转换过程中的技术陷阱

XML 转 JSON 时，转换器必须做规则选择：属性怎么表示？单个重复元素是否仍保留为数组？文本和子节点混合时怎么处理？

#### 陷阱 A：属性 (Attributes) 与元素 (Elements)
考虑以下 XML 片段：
```xml
<employee id="123">
  <name>John Doe</name>
</employee>
```

标准的 JSON 转换必须决定如何表达 `id` 这个属性。业界常见的转换约定（如 BadgerFish 或 Parker 约定）通常会为属性添加特异性前缀，例如 `@` 符号：
```json
{
  "employee": {
    "@id": "123",
    "name": "John Doe"
  }
}
```

#### 陷阱 B：数组歧义 (Array Ambiguity)
XML 本身没有 JSON 那样的数组语法。它通常依靠重复元素表示列表。
```xml
<users>
  <user>Alice</user>
</users>
```
这里的 `user` 是普通字段，还是只有一项的数组？如果转换器没有 Schema，很可能会将其转换成：
```json
{ "users": { "user": "Alice" } }
```
当加入第二个用户后，JSON 结构可能突然变成 `[ "Alice", "Bob" ]`。这种结构变化会导致前端组件或后端消费者出错。因此，转换工具应允许你强制某些字段始终输出数组。

### 3. 现代开发工作流的最佳实践

在 API 网关、中间件或 CI/CD 流程里做 XML/JSON 转换时，可以遵守这些原则：

1. **使用标准库与公认约定：** 不要用正则表达式解析 XML。使用 `fast-xml-parser`、`xml2js` 等成熟库。
2. **做 Schema 校验：** 消费转换结果前，用 JSON Schema 或业务 schema 校验结构。
3. **注意类型推断 (Type Casting)：** XML 中的值通常是字符串，例如 `<age>30</age>`。是否转成数字或布尔值，要由明确规则决定。

### 4. 结语

JSON 常见于 Web API，XML 仍存在于金融交易 (FpML)、医疗通信 (HL7) 和出版系统。转换时最重要的不是“能转”，而是结构稳定、类型明确、边界情况可测试。
