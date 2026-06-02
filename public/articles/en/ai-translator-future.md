## Context-Aware AI Translation for Real Localization

Early machine translation relied on rules and phrase tables. Statistical systems such as early Google Translate improved fluency by learning from large bilingual corpora, but they still struggled when the source text depended on tone, intent, or product context.

Large language models changed the workflow. A good translation request now includes audience, field, tone, format constraints, and examples, not only the source sentence.

### 1. From Translation to Transcreation
Traditional systems struggle with tone, idioms, humor, and field-specific jargon. A literal translation of "It's raining cats and dogs" into Mandarin can produce nonsense if the system treats each word as the unit of meaning.

Modern translation tools can handle a lighter form of transcreation: they preserve the intended effect instead of copying the wording. With the right instruction, the model treats the phrase as "heavy rain" and chooses a natural local expression in the target language.

### 2. Context Prompting in Translation
Standard translation APIs often receive only the text. AI translation tools work better when you provide context: product type, audience, UI location, brand tone, and words that must stay unchanged.

Consider translating an app interface containing the word "Book." Is it a noun (a collection of pages) or a verb (to reserve a flight)? 
Use a prompt such as:
*"You are an expert UX localization engineer. Translate the following UI string for a flight reservation application maintaining an encouraging, professional tone,"* 
The model can then choose "预订" (reserve) instead of "书" (bound pages). Context does not replace localization QA, but it reduces obvious wrong-word errors before a reviewer sees the string.

### 3. Preserve Markdown, Links, and Code
Developers often need to translate technical documentation or README files without damaging Markdown formatting, URLs, inline code, commands, or HTML.

You can instruct an AI translation tool to translate prose only and preserve structural tokens. A good workflow isolates readable text, keeps URL links and `inline code` unchanged, and then checks the rendered Markdown after translation.

### Conclusion
AI translation works best when you treat it as localization assistance. Give it context, protect formatting, review the output with a native speaker or domain owner, and keep a glossary for product terms that must stay consistent.
