## HTTP Status Codes: Practical Rules for APIs and Pages

Every website request and API call returns a three-digit HTTP status code. That code tells browsers, clients, crawlers, CDNs, monitoring tools, and support teams how to treat the response.

### 1. The Universal Taxonomy
*   **2xx (Success):** The request worked. `200 OK` is standard, and `201 Created` tells an API client that the server created a new resource.
*   **3xx (Redirection):** The client needs another URL. `301 Moved Permanently` and `302 Found` affect SEO and browser caching in different ways.
*   **4xx (Client Error):** The client sent something the server cannot accept. `400 Bad Request` can mean invalid JSON. `401 Unauthorized` points to missing authentication. `403 Forbidden` means the user or key lacks permission. `404 Not Found` means the resource does not exist at that URL.
*   **5xx (Server Error):** The server or upstream service failed. `500 Internal Server Error` signals a generic server crash, while `502 Bad Gateway` often points to a proxy or upstream service problem.

### 2. Do Not Hide Errors Behind 200
Avoid wrapping a failed database lookup in a `try/catch` block and returning `200 OK` with a payload like `{"success": false, "error": "Not Found"}`. That pattern breaks CDN caching rules, makes monitoring noisy, and forces every client to invent custom error handling.

### Conclusion
Return the status code that matches the failure. Frontend apps, API clients, and monitoring systems can then react without parsing a custom error convention first.

### 3. Status Codes as Product Signals
Status codes are not only for backend engineers. They shape how browsers, crawlers, monitoring tools, and customer support teams understand the health of a product. A checkout page that returns `500` during a payment provider outage should trigger a different alert than a login form returning `401` because a password expired. When the code is accurate, the whole stack can react with the right severity.

For SEO-heavy pages, redirects deserve special care. Use `301` only when a URL has permanently moved and the old address should transfer ranking signals to the new one. Use `302` or `307` for temporary campaigns, A/B tests, or maintenance routing. A careless permanent redirect can lock browsers and search engines into a path you did not intend.

### 4. A Practical Debugging Checklist
When an endpoint behaves strangely, capture three things before changing code: the request method, the response status, and the response body. A `405 Method Not Allowed` often means the URL is correct but the verb is wrong. A `415 Unsupported Media Type` points to missing or incorrect `Content-Type`. A `429 Too Many Requests` means the client needs retry logic, backoff, or a different quota strategy.

Frontend teams can use status codes to design better error states. `404` should help the user recover or search. `409 Conflict` should explain what changed and how to retry. `422 Unprocessable Entity` should map validation errors back to individual form fields. A single generic toast saying "Something went wrong" wastes information the server already provided.

ToolOrbit workflows that help: format API responses with the [JSON Formatter](/tools/dev/json-formatter), inspect encoded URLs with the [URL Encoder](/tools/dev/url-encoder), and compare changed error payloads with the [Text Diff Tool](/tools/dev/text-diff).
