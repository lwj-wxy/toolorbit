## XML vs JSON: Conversion Rules That Prevent Data Loss

JSON handles most modern web API payloads. XML still appears in enterprise systems, SOAP services, publishing pipelines, healthcare data, finance formats, and document-heavy integrations.

Converting between them needs a few explicit rules. A naive converter can drop XML attributes, flatten one-item arrays, or turn typed values into strings in ways that break application code.

### 1. The Core Differences

Start with the structural mismatch:

*   **XML is document-oriented:** It marks up text, supports mixed content, and stores metadata through attributes and namespaces.
*   **JSON is object-oriented:** It represents objects, arrays, strings, numbers, booleans, and null. It has no native attribute or namespace model.

### 2. The Conversion Challenges

XML can express structures that JSON cannot represent directly. A converter must decide how to handle attributes, namespaces, repeated elements, text nodes, and values that may appear once in one payload and many times in another.

#### Challenge A: Attributes vs. Elements
Consider this XML:
```xml
<employee id="123">
  <name>John Doe</name>
</employee>
```

A standard JSON conversion must decide how to represent the `id` attribute. A common convention (like the BadgerFish or Parker convention) prefixes attributes with an `@` symbol:
```json
{
  "employee": {
    "@id": "123",
    "name": "John Doe"
  }
}
```

#### Challenge B: The Array Ambiguity
XML has no native array syntax. Repeated elements indicate a list.
```xml
<users>
  <user>Alice</user>
</users>
```
Should `user` become a string or an array with one item? If a converter reads this without a schema, it may compile it as:
```json
{ "users": { "user": "Alice" } }
```
When a second user appears, the converter may switch the structure to `[ "Alice", "Bob" ]`. That shape change breaks code that expects the first form. Use array rules or a schema when the payload has repeatable fields.

### 3. Best Practices for Modern Workflows

Use these rules in backend middleware, imports, exports, and CI checks:

1.  **Use documented conventions:** Use maintained parsers such as `fast-xml-parser` in Node.js. Do not parse XML with regex.
2.  **Validate the result:** Check converted JSON against a JSON Schema so one-item arrays, missing attributes, and unexpected objects fail before they reach business logic.
3.  **Preserve types on purpose:** XML stores text (`<age>30</age>`). Decide which fields should become numbers, booleans, dates, or strings instead of relying on blind casting.

### 4. Conclusion

JSON dominates web APIs, but XML still powers finance formats such as FpML, healthcare messages such as HL7, publishing workflows, and legacy enterprise systems. Good conversion code documents each mapping choice so future maintainers can predict the output shape before they run it.
