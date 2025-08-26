# Mermaid Diagram Export Process

## Quick Steps

1. **Copy the mermaid code** from the commented section in your blog post
2. **Go to [mermaid.live](https://mermaid.live)** or [mermaidchart.com](https://mermaidchart.com)
3. **Paste the code** in the editor
4. **Export as PNG** (recommended settings):
   - **Resolution**: 2x or 3x for high DPI displays
   - **Background**: White (for better readability)
   - **Format**: PNG (for blog posts) or SVG (for scalable graphics)
5. **Save the file** in `/public/images/diagrams/` with a descriptive name
6. **Update the blog post** image reference

## Recommended Export Settings

### For Blog Posts:
- **Format**: PNG
- **Resolution**: 2x (retina ready)
- **Background**: White
- **Theme**: Default (or match your site's theme)

### For Documentation:
- **Format**: SVG (scalable)
- **Background**: Transparent
- **Theme**: Neutral

## File Naming Convention

Use descriptive names that match the content:
- `mentorly-intelligence-architecture.png`
- `user-journey-flow.png`
- `data-pipeline-overview.png`

## Blog Post Pattern

```markdown
<!--
Original Mermaid Diagram (for editing):
```mermaid
[your mermaid code here]
```
-->

![Descriptive Alt Text](/images/diagrams/filename.png)
```

This keeps the original code accessible while using a production-ready image. 