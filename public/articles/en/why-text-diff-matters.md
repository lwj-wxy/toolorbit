## Text Diff Tools Beyond Git

Most developers meet text diffing through `git merge` and pull request reviews. The red and green highlights are familiar, but the same comparison workflow helps outside source control too.

Text comparison also helps with payload audits, configuration checks, log analysis, and document review.

### The Algorithm Under the Hood

Modern text diffing relies on solving the Longest Common Subsequence (LCS) problem. The most famous implementation is the Myers Difference Algorithm, developed by Eugene W. Myers in 1986. 

Myers' algorithm calculates the shortest sequence of edit commands, insertions and deletions, needed to turn sequence A into sequence B. It treats the texts as a grid and finds the shortest path from the top-left to the bottom-right corner, favoring diagonal moves for matches over horizontal or vertical moves for edits.

### Everyday Non-Git Use Cases
If you only use diff tools in your IDE's Git panel, try them in these everyday workflows:

#### 1. API Payload Auditing
When refactoring a legacy backend endpoint to a modern microservice, the goal is parity. The new endpoint must return the same fields and values as the old one. Put the old JSON payload on the left and the new payload on the right; the diff will show whether a boolean changed deep inside a nested array.

#### 2. Environment Configuration Troubleshooting
*Why does staging work, but production fails?* 
Compare the staging `.env` file and production `.env` file side by side. Missing keys, different feature flags, and trailing slashes in database URLs become easier to spot.

#### 3. Log File Forensic Analysis
When a system crashes sporadically, raw logs are hard to scan by eye. SREs can compare a healthy initialization log against a crash log and jump to the first meaningful difference.

### Structured Formats Need Smarter Comparison

Standard diff tools compare line by line. That can fail when formatting changes hide or exaggerate the real difference.

*   **JSON Minification:** If File A is a formatted JSON tree of 500 lines, and File B is the same JSON dataset minified onto 1 line, a line diff shows a large change. A structured diff can parse the JSON, normalize both sides, and then compare the content.
*   **Whitespace & Case Insensitivity:** Sometimes you only care about the substantive content. Good tools allow you to ignore trailing whitespace or casing changes.

### Security Implications

A major reason to use local or client-side diff utilities is security. Do not paste proprietary application code, customer API payloads, or `.env` file contents into a random free "online text diff" site. Use trusted local tools or client-side tools that keep data in your browser tab.
