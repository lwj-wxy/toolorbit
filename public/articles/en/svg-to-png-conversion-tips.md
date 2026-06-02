## Convert SVG to PNG Without Blurry Edges

SVG files describe shapes with paths, text, fills, strokes, and filters. PNG files store pixels. Quality problems start when a renderer turns the vector instructions into a fixed pixel grid.

You still need PNG output for app stores, email clients, social previews, native apps, CMS uploads, and older systems that cannot render SVG with the same feature support as a browser.

Use the export size, fonts, filters, and `viewBox` as the main controls.

### Why Quality Loss Happens During Conversion

An SVG uses XML code to describe shapes (paths, circles, polygons) and colors. A PNG uses a grid of square pixels.

When you convert SVG to PNG, a renderer rasterizes the file. It calculates which pixels on the grid should represent the vector shapes.
1. **Low Density Grid:** If you render it to a small grid (e.g., converting at 100x100 pixels), a curve becomes jagged.
2. **Missing fonts:** If your SVG uses `<text>` with a custom font like "Inter", the conversion tool must have "Inter" installed. If it does not, it falls back to another font and changes the design.
3. **Complex filters:** CSS filters or SVG filters such as `feGaussianBlur` require renderer support. Basic conversion libraries may skip or misrender them.

### Tip 1: Export Larger Than the Display Size

Because SVG is vector, you can export it at any size without the source file getting larger. 

**Rule:** Convert at 2x or 4x the target display size when the PNG must look sharp on high-density screens.

If you need a 500x500 banner, export a 1000x1000 or 2000x2000 PNG. Downscale with Lanczos or Bicubic resampling if the file size matters, or serve the larger asset with CSS such as `max-width: 500px`.

### Tip 2: Outline Your Fonts (Convert Text to Paths)

Missing fonts cause many bad SVG exports. If you send an SVG to an automated API or another machine, do not assume the renderer has the same font files installed.

**The Fix:** Before converting, open the SVG in your vector editor (Illustrator, Figma, Inkscape) and convert all text elements to vector paths. 
* *In Figma:* Right-click the text layer -> "Outline Stroke" (Shift + Cmd + O).
* *In Illustrator:* Type -> Create Outlines.

Now the text becomes explicit shapes, so the conversion engine no longer needs the font file.

### Tip 3: Flatten Complex CSS and SVG Filters

Some SVGs exported from web tools rely on inline `<style>` tags and CSS variables. Basic converters may ignore those styles.

**The Fix:** Whenever possible, bake the presentation attributes directly into the SVG nodes. 
Instead of:
```xml
<style>.my-red { fill: red; } </style>
<circle class="my-red" />
```
Export as:
```xml
<circle fill="red" />
```
This creates an SVG that simpler rasterizers can parse.

### Tip 4: Handle the ViewBox Safely

Give the SVG a defined `viewBox` so the converter knows the internal coordinate system.

**Bad:** `<svg width="100" height="100">`
**Good:** `<svg viewBox="0 0 100 100" width="100%" height="100%">`

A proper `viewBox` lets the conversion tool scale the canvas up without cropping or distorting internal elements.

### Conclusion

Sharp PNG output comes from a clean source SVG and an export size that matches the use case. Outline fonts, keep the `viewBox`, flatten fragile CSS, and test filters in the renderer you plan to use.
