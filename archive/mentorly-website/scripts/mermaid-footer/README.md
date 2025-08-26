# Mermaid Footer Generator

This folder contains everything needed to generate professional footer images for blog posts and presentations.

## Files

- `ciprian-rarau.html` - HTML template for Ciprian's footer
- `chip-big.jpg` - Ciprian's photo
- `mentorly.com-small.png` - Mentorly logo  
- `ciprian-rarau.png` - Generated output image

## Usage

From the `mentorly-website` directory:

```bash
# Generate footer image (automatically creates ciprian-rarau.png)
node scripts/html-to-image.js scripts/mermaid-footer/ciprian-rarau.html --selector .footer-container

# Example with custom name
node scripts/html-to-image.js scripts/mermaid-footer/ciprian-rarau.html my-footer.png --selector .footer-container
```

This creates a perfectly cropped footer image (typically ~83KB) with:
- Mentorly.com branding on the left
- Personal branding on the right  
- Professional styling with proper image containment

## Scaling for Other Employees

To create footers for other team members, simply:
1. Copy `ciprian-rarau.html` to `employee-name.html`
2. Update the employee's name, title, and photo path in the HTML
3. Add their photo to this folder
4. Run: `node scripts/html-to-image.js scripts/mermaid-footer/employee-name.html --selector .footer-container`

## Automatic Mermaid Integration

The footer system is **automatically integrated** with the mermaid diagram processor! 

When you run the mermaid processing script, it will:
1. 📊 Extract the author from the markdown frontmatter (e.g., `author: Ciprian Rarau`)
2. 🔄 Convert the name to filename format (`ciprian-rarau`)  
3. 🎯 Find the corresponding footer in this directory (`ciprian-rarau.png`)
4. 🔗 Automatically attach it to all mermaid diagrams in that blog post

### Mermaid Processing Commands

```bash
# Process all blog posts (normal mode)
./scripts/process-mermaid.sh

# Force regenerate all diagrams (useful when footer changes)
./scripts/process-mermaid.sh --force

# Or use the Node.js script directly
node scripts/process-mermaid-diagrams.js --force
```

## Manual Footer Generation

If you need to generate footers manually for other purposes:

## Requirements

The `html-to-image.js` and `html-to-image.sh` scripts are located in the parent `scripts/` directory. 