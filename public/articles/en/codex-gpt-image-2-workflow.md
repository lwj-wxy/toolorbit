# Codex and GPT Image 2: A Practical Workflow for Project Assets

## TL;DR

Use Codex image generation when the output is a real raster asset: blog covers, hero images, product mockups, thumbnails, textures, or reference visuals. Keep prompts specific, inspect the result, copy the chosen asset into the project, and update the consuming code so the site never depends on a temporary generation path. For repeatable results, document your house style and treat generated images like code: versioned, reviewed, and optimized.

Post updated: 2026-05-27. Maintained by the [ToolOrbit Editorial Team](/authors/toolorbit-editorial-team).

Codex can connect design intent to shipped assets. You can ask Codex to generate the image, inspect it, resize or convert it, save it into the repository, and update the page that uses it in one conversation.

OpenAI's [GPT Image 2 model documentation](https://developers.openai.com/api/docs/models/gpt-image-2) is the reference point for model capabilities. In a Codex workflow, the important practical distinction is simpler: use the built-in image generation path for normal project images, and use a CLI/API path only when you explicitly need model-level controls, automation, or fallback behavior.

## Understanding GPT Image 2's capabilities

Before writing prompts, it helps to know what the model does well and where it struggles.

**Strengths:** GPT Image 2 excels at photorealistic scenes, editorial compositions, product mockups on realistic surfaces, architectural and interior renders, food and lifestyle photography, and abstract technological backgrounds. It handles lighting, depth of field, and material texture with surprising accuracy. For blog covers, hero sections, and marketing assets, it produces output that rivals stock photography.

**Weaknesses:** The model struggles with precise text rendering inside images. Generated text often contains misspelled words, broken kerning, or glyph artifacts. It also has difficulty with exact UI reproductions — a screenshot of a dashboard or a specific button style will not match pixel-for-pixel. Complex multi-subject scenes with very specific spatial relationships can produce inconsistent results.

**Resolution and format:** Generated images typically output at high resolution, but the exact dimensions depend on the aspect ratio you request. Square (1:1), landscape (16:9), and portrait (3:4) are well-supported. Always request the aspect ratio explicitly rather than assuming a default.

**Style range:** The model supports a wide style vocabulary: editorial photography, 3D render, flat illustration, isometric, watercolor, line art, cyberpunk, minimalist, and more. The key is being explicit — "photorealistic editorial desk scene" produces a very different result from "3D isometric illustration of a developer workspace."

## When should Codex generate an image?

Use image generation when the output is meant to be a bitmap asset. Good examples include blog cover images, Open Graph graphics, product mockups, onboarding illustrations, presentation backgrounds, ecommerce scenes, and marketing thumbnails.

Do not use image generation for assets that should stay deterministic and editable as code. Icons, simple diagrams, UI wireframes, chart mockups, and interface primitives are usually better as SVG, HTML/CSS, or direct component code.

For ToolOrbit work, a good split is:

- Blog and landing images: generate with Codex, then save as optimized JPG or WebP.
- UI controls, icons, and layout: implement in code.
- Prompt drafts: prepare with [AI Prompt Generator](/tools/ai/prompt-generator).
- Final image optimization: compress or convert with [Image Compressor](/tools/image/image-compressor) and [Image Converter](/tools/image/image-converter).

### The bitmap vs. vector decision

This distinction avoids rework. If you can describe the asset as a set of shapes, paths, and colors, such as an icon, a diagram, or a chart, build it in code or SVG. The result will be resolution-independent, accessible, and easy to modify.

If the asset depends on photography, texture, lighting, or organic composition, generation is usually the better path. Hero images, product scenes, and mood boards fit this category. Generated images are raster assets, so accept that tradeoff upfront.

### When stock photography is the better choice

For some projects, a licensed stock photo is still the right answer. If you need a recognizable landmark, a specific product shot with exact branding, or an image that will face legal review, use a stock service. Generated images are useful for original compositions, but they are not a substitute for licensed, attributable photography in every context.

## A reliable prompt structure

Strong prompts describe the asset's job, format, visual style, constraints, and things to avoid. Avoid vague prompts such as "make a good blog image." Give Codex enough context to judge whether the image fits the page.

Use this structure:

```text
Create a 16:9 editorial blog cover for a tutorial about using Codex with GPT Image 2.
Scene: realistic developer desk, laptop with blurred image generation workspace, prompt notes, color swatches, and camera lens.
Style: professional tech blog, dark navy and cyan accents, realistic lighting.
Constraints: no readable text, no logos, no watermark, no 3D render.
```

### Why each component matters

**Aspect ratio first.** Leading with the ratio tells the model the canvas shape before it composes the scene. A 16:9 landscape and a 1:1 square need fundamentally different compositions.

**Scene description.** Be concrete about what objects appear and their spatial relationship. Instead of "developer desk," say "wooden desk with a laptop on the left, a notebook and pen on the right, and a camera lens in the foreground." The model uses spatial cues to build depth.

**Style keywords.** "Professional tech blog" sets the tone. "Dark navy and cyan accents" constrains the palette. "Realistic lighting" prevents the model from defaulting to flat studio lighting. Stack multiple style keywords to narrow the output distribution.

**Negative constraints matter.** Blog cards often crop images aggressively, and generated text inside images usually looks broken. Ask for no readable text unless exact text is required. Similarly, "no 3D render" pushes the model toward photography when that is what the page needs.

### More prompt examples

For a product mockup:

```text
Create a 1:1 square product scene for a note-taking app.
Scene: a smartphone resting on a wooden cafe table, the screen showing a clean note editor interface with placeholder text blocks. A coffee cup in the background, out of focus.
Style: warm natural lighting, shallow depth of field, modern minimalist.
Constraints: no readable text on the screen, no brand logos, no human hands.
```

For a technical illustration:

```text
Create a 16:9 technical illustration explaining API request flow.
Scene: abstract diagram showing arrows between a client icon, a server icon, and a database icon, using clean geometric shapes.
Style: flat vector illustration, blue and teal palette, white background, thin consistent stroke width.
Constraints: no text labels, no 3D perspective, no gradients.
```

For an abstract background:

```text
Create a 16:9 abstract background for a cybersecurity blog.
Scene: flowing digital particles forming network-like patterns, with subtle grid lines and depth fog.
Style: dark background, cyan and electric blue accents, subtle glow effects, cinematic.
Constraints: no recognizable shapes, no text, no sharp edges.
```

## Save the image into the project

Generated files are usually created outside the repository first. That is fine for preview, but project pages should not reference temporary paths. After selecting the final image, copy it into the repository, normally under a stable path such as:

```text
public/images/articles/codex-gpt-image-2-workflow.jpg
```

Then update the data source that powers the page. For a blog list, that might be a `blogData.ts` entry. For a hero image, it may be a component prop or asset import.

This step is easy to miss. If the image only exists in a local generated-images folder, the production site will not have it.

### Framework-specific integration patterns

**Next.js (pages or app router):** Place images in `public/images/` and reference them with a leading slash: `/images/articles/cover.jpg`. For optimized images, use the `next/image` component with the static import or public path.

```tsx
import Image from 'next/image';
import coverImg from '@/public/images/articles/cover.jpg';

<Image src={coverImg} alt="Blog cover" width={1200} height={675} priority />
```

Or for public directory references:

```tsx
<Image src="/images/articles/cover.jpg" alt="Blog cover" width={1200} height={675} />
```

**Plain HTML or static sites:** Place images in an `images/` or `assets/` directory and reference them with a relative or root-relative path. Use the `<img>` tag with explicit `width` and `height` to prevent layout shift.

**React (Vite or CRA):** Import the image at the top of the component file. The bundler will handle hashing and optimization.

```tsx
import coverImg from './assets/blog-cover.jpg';

<img src={coverImg} alt="Blog cover" width={1200} height={675} loading="lazy" />
```

### Updating blog metadata

For ToolOrbit and similar sites, blog images often live in a data file rather than directly in a component. After saving an image, update the corresponding entry:

```typescript
{
  slug: 'codex-gpt-image-2-workflow',
  title: 'Codex and GPT Image 2: A Practical Workflow for Project Assets',
  // ...
}
```

If your site supports Open Graph images, generate and save a separate OG version at the recommended 1200x630 size.

## Resize and convert deliberately

Most generated images are larger than needed. Resize to the exact display ratio before saving. For a typical blog card and hero image, `1200 x 675` is a practical 16:9 size. JPG works well for photographic covers; PNG is better for flat graphics or screenshots; WebP can be a good production format when the site supports it.

After conversion, inspect the final asset. Do not only inspect the raw generated file. Cropping can remove the important subject, and compression can make small UI details muddy.

### Format decision matrix

| Format | Best for | Avoid for |
|--------|----------|-----------|
| JPG | Photographic covers, hero images, scenes with gradients | Screenshots, text-heavy images, flat graphics |
| PNG | Screenshots, diagrams, images with text, flat illustrations | Large photographic images |
| WebP | Modern production sites with broad browser support | Legacy email clients, older CMS platforms |
| AVIF | Next-gen production with best compression | Environments without decoding support |

### Resolution guidelines by use case

| Use case | Recommended size | Aspect ratio |
|----------|-----------------|--------------|
| Blog card thumbnail | 800 x 450 | 16:9 |
| Blog hero / header | 1200 x 675 | 16:9 |
| Open Graph image | 1200 x 630 | ~1.91:1 |
| Square social post | 1080 x 1080 | 1:1 |
| Product mockup | 1200 x 1200 | 1:1 |
| Twitter card | 1200 x 600 | 2:1 |
| Full-width hero | 1920 x 1080 | 16:9 |

Always generate at or above the target resolution, then downscale. Upscaling a small generated image produces blurry results, while downscaling from a larger source preserves detail.

### The optimization pipeline

A realistic optimization pipeline for a blog cover:

1. Generate at high resolution (e.g., requesting a 16:9 image from Codex).
2. Inspect the raw output and confirm composition and subject.
3. Resize to 1200x675 using an image tool or Codex itself.
4. Convert to the target format (JPG at 85% quality is a good default for photos).
5. Optionally create a WebP copy for browsers that support it.
6. Run both through [Image Compressor](/tools/image/image-compressor) for a final size pass.
7. Save both versions into `public/images/articles/`.

## A good Codex review loop

The best workflow is short and iterative:

1. Generate one focused image.
2. Inspect it visually.
3. If it is close, make one targeted change.
4. Save the accepted version into the project.
5. Update the page reference.
6. Verify the page or data source.

Avoid generating many unrelated variants before you know what is wrong. If the issue is "too much 3D illustration," say that directly and ask for a photorealistic editorial desk scene. If the issue is "does not match the existing blog covers," provide a reference screenshot or describe the common elements.

### Iteration Prompts That Work

Vague feedback produces random changes. Specific feedback produces targeted fixes. Compare:

- Weak: "Make it look better." → Random style change.
- Strong: "The lighting is too flat. Add a warm key light from the top-left and deepen the shadows." → Targeted lighting adjustment.

- Weak: "The composition feels off." → Model guesses what to change.
- Strong: "Move the laptop to the left third of the frame and add more negative space on the right." → Specific spatial instruction.

- Weak: "Make it more professional." → Unclear direction.
- Strong: "Reduce the saturation by 30%, remove the decorative elements, and use a clean white desk surface instead of wood grain." → Actionable constraints.

The pattern is the same: identify the symptom, name the fix, and keep everything else constant. This is how photographers and art directors give revision notes, and the model responds well to the same approach.

### When to start over vs. iterate

If the first generation has the wrong subject, style, or composition, start over with a rewritten prompt. Iterating on a bad base wastes time and the model may struggle to escape the initial composition.

If the first generation is close but has specific issues — lighting, color cast, one misplaced object — iterate with targeted feedback. One or two revision rounds is normal. More than three rounds usually means the initial prompt needs rethinking.

## Batch image workflows

For projects that need multiple images (a blog series, a set of tool page illustrations, a collection of category headers), a batch workflow saves time and ensures visual consistency.

### Define the batch spec first

Before generating anything, write down:

- Shared style constraints (lighting, palette, subject distance, mood).
- Per-image scene description.
- Shared negative constraints.
- Target format and resolution for all images.

A batch spec might look like:

```text
Series: Developer tool category headers (6 images)
Shared style: editorial tech photography, dark navy and warm amber accents, realistic lighting, shallow depth of field.
Shared constraints: no readable text, no logos, no 3D render, no human faces.
Format: 1200x675 JPG, 85% quality.

1. JSON tools: close-up of structured data glowing on a dark screen.
2. Image tools: camera lens and color swatches on a clean desk.
3. Security tools: abstract lock icon formed by circuit traces.
4. Text tools: fountain pen resting on a handwritten editing mark.
5. Encoding tools: abstract data streams converging into a single line.
6. PDF tools: clean document layout with subtle grid and margin guides.
```

Generate each image individually against the shared constraints. Generating them one at a time with the same style description produces more consistent results than asking for six images in one prompt.

### Naming conventions for batch output

Use predictable, sortable filenames so the relationship between images is obvious:

```text
category-header-json.jpg
category-header-image.jpg
category-header-security.jpg
category-header-text.jpg
category-header-encoding.jpg
category-header-pdf.jpg
```

This makes it easy to see missing images and update references in bulk.

## Troubleshooting common generation issues

### The image looks "too AI"

The most common complaint is images that feel synthetic. This usually comes from one of these root causes:

- **Overly perfect lighting:** Ask for "natural lighting, subtle imperfections, realistic shadows."
- **Plastic skin or surfaces:** Add "photorealistic texture, surface grain, natural wear."
- **Generic composition:** Add a specific compositional rule: "rule of thirds, subject on the left third, leading lines from the bottom-right."
- **Saturated color palette:** Ask for "muted tones, desaturated by 20%, editorial color grade."

### The subject is cropped incorrectly

If the subject is cut off or poorly positioned, the aspect ratio and subject placement likely conflict. Try: "Center the main subject with generous padding on all sides" or "Use a wider composition with the subject occupying only the center 60% of the frame."

### The image does not match the site's existing style

This is the most common issue for established projects. The fix is to create a reusable style prompt that captures the house style. Store it in the project's contributing docs or a shared note:

```text
House style for ToolOrbit blog covers:
- 16:9 aspect ratio, 1200x675 final size.
- Editorial tech photography, not illustration or 3D.
- Dark navy background with a single warm accent (amber or copper).
- One focal object related to the article topic.
- Shallow depth of field, blurred background.
- No text, no logos, no human faces, no cartoon elements.
```

Share this with anyone generating images for the project. Consistency comes from constraints, not from describing the style fresh each time.

### Generation fails or produces an error

If Codex reports that image generation is unavailable or returns an error:

1. Check that the model endpoint supports image generation in your current session.
2. Simplify the prompt — very long or complex prompts can sometimes fail.
3. Remove potentially problematic constraints (some safety filters may trigger on specific words).
4. Try the API path directly as a fallback if the built-in path is unavailable.

## Common mistakes

The first mistake is using generated images as UI. A generated toolbar may look good in a mockup, but it is not accessible, responsive, selectable, or maintainable. Build UI in code.

The second mistake is leaving fake text in a cover. It distracts users and can make the image look low-quality. Use blurred screens, abstract documents, or icon-like shapes instead.

The third mistake is not checking the image at card size. A cover that looks rich at full size may become noisy when cropped into a small blog tile. Always preview at the actual display size before shipping.

The fourth mistake is not preserving the original output. Keep the generated original available until the final converted asset is confirmed. Disk is cheap; regenerating an image you almost liked is expensive.

The fifth mistake is inconsistent style across a site. If three blog covers use editorial photography and the fourth uses a flat illustration, the collection feels rushed. Define a house style and stick to it.

The sixth mistake is skipping the Open Graph version. A blog cover optimized for a 16:9 hero section will be awkwardly cropped when shared on social media. Generate a separate 1200x630 OG image or ensure the main cover works at both ratios.

## Where this fits in ToolOrbit

Codex image generation is most useful for improving content presentation. Pair it with [AI Prompt Generator](/tools/ai/prompt-generator) to draft image prompts, [Image Compressor](/tools/image/image-compressor) to reduce file size, and [Image Converter](/tools/image/image-converter) to prepare the format your page expects.

For color-critical work, use [Color Palette Generator](/tools/dev/color-palette) to define the palette for your house style and [Color Picker](/tools/dev/color-picker) to sample colors from reference images.

For repeatable content production, document your house style: aspect ratio, lighting, palette, subject matter, forbidden styles, and where files should be saved. The more stable the convention, the less time you spend fixing mismatched covers later.

## Conclusion

Codex with GPT Image 2 works best when you treat image generation as an engineering workflow. Write specific prompts with clear constraints. Save assets into versioned project paths. Optimize for the actual display size. Iterate with targeted feedback rather than random regeneration. Document your house style so images in the project follow the same visual rules.
