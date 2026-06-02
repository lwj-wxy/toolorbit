## API Security: Practical Endpoint Hardening

APIs carry user data, payment events, account changes, and internal automation. Attackers target them because a single weak endpoint can expose records, trigger expensive work, or bypass business rules.

### 1. The Principle of Least Privilege
Never expose an endpoint that allows unrestricted mass data retrieval. A classic vulnerability is the "Mass Assignment" flaw. If a user sends a `POST /api/user/update` request and includes `"isAdmin": true` in the JSON payload, a poorly secured ORM might map that property to the database and grant the attacker administrative rights. Use strict payload validation schemas with tools like Zod or Joi.

### 2. Rate Limiting and Volumetric Defenses
A server without rate limiting lets one client consume too much capacity. Add IP-based and token-based limits so a script cannot exhaust database connections or inflate cloud costs. Modern stacks often handle this with Redis token buckets at the proxy edge layer.

### Conclusion
Treat each incoming payload as untrusted input. Validate request shape, enforce authorization on every object access, and add rate limits before expensive work runs.

### 3. Authentication Is Not Authorization
Many API incidents happen because a system verifies who the caller is but forgets to verify what that caller may do. A valid token should not automatically grant access to every object in a database. Every request that reads or mutates user-owned resources should check object-level authorization: does this user, service account, or tenant actually own the record being requested?

This matters most in predictable URL patterns such as `/api/invoices/1842` or `/api/users/73/settings`. Attackers will enumerate identifiers and watch for inconsistent responses. Return precise errors internally, but avoid leaking sensitive object existence details to unauthorized clients. Logging should capture enough context for investigation without storing secrets, tokens, or full personal records.

### 4. Design for Abuse Cases, Not Happy Paths
A secure API is designed around hostile input. Validate body shape, content type, length, numeric ranges, enum values, and file types before business logic runs. Reject unexpected fields instead of silently ignoring them. For file uploads, scan metadata, enforce size limits, and store user content outside the executable application path.

Production teams should also add replay and automation defenses. Use short-lived tokens, rotate signing keys, verify webhook signatures, and make idempotency keys mandatory for payment-like operations. Rate limits should exist at multiple layers: global edge limits for abuse, tenant limits for fairness, and sensitive endpoint limits for login, password reset, and export routes.

ToolOrbit can support the secure review loop: decode non-sensitive JWT structure with the [JWT Debugger](/tools/dev/jwt-debugger), hash test strings with the [Hash Generator](/tools/dev/hash-generator), and compare policy changes with the [Text Diff Tool](/tools/dev/text-diff). Never paste real production secrets into any online utility unless your security policy explicitly allows it.
