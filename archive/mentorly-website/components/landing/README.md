# Landing Page Components

This directory contains reusable components for creating landing pages quickly and consistently.

## Components

### LandingHero
The main hero section with customizable colors, CTAs, and images.
```tsx
<LandingHero
  color="blue" // blue, green, yellow, purple, white
  title="Main Headline"
  subtitle="Supporting text"
  primaryCTA={{ text: 'Get Started', href: '/demo' }}
  secondaryCTA={{ text: 'Learn More', href: '#features' }}
  image={{ src: '/image.png', alt: 'Description' }}
  badge={{ text: 'New', icon: '✨' }}
/>
```

### FeatureGrid
Flexible grid for displaying features with multiple variants.
```tsx
<FeatureGrid
  title="Features"
  subtitle="What we offer"
  features={[
    { icon: '🎯', title: 'Feature', description: 'Details' }
  ]}
  columns={3} // 2, 3, or 4
  variant="default" // default, bordered, shadowed, detailed
/>
```

### HowItWorks
Step-by-step process sections.
```tsx
<HowItWorks
  title="How It Works"
  steps={[
    { number: '01', title: 'Step', description: 'Details', color: 'blue' }
  ]}
  variant="numbered" // numbered, icon, timeline
/>
```

### LandingTestimonials
Customer testimonials with optional partner logos.
```tsx
<LandingTestimonials
  title="What Customers Say"
  testimonials={[
    { quote: 'Great!', author: 'Name', role: 'Title', company: 'Company' }
  ]}
  cardColor="blue" // gray, blue, green, purple, yellow
  showPartners={true}
/>
```

### LandingCTA
Call-to-action section.
```tsx
<LandingCTA
  title="Ready to Start?"
  subtitle="Join thousands of users"
  buttons={[
    { text: 'Get Started', href: '/demo' }
  ]}
  backgroundColor="blue"
/>
```

### ContentSection & Helpers
Wrapper for custom content and pre-built blocks.
```tsx
<ContentSection>
  <InfoBlock
    badge={{ text: 'New', color: 'blue' }}
    title="Important Information"
    subtitle="Details here"
  />
</ContentSection>

<StatsBlock
  stats={[
    { value: '95%', label: 'Success Rate' }
  ]}
/>
```

## Usage

1. Copy the `landing-page-template.tsx` file
2. Modify the content and colors to match your needs
3. Remove any sections you don't need
4. Add custom sections using `ContentSection` wrapper

## Color Palette
- Blue: #7582fb
- Green: #03c18e
- Yellow: #fddd36
- Purple: #989DFF

## Best Practices
- Keep hero titles under 10 words
- Use consistent color themes throughout the page
- Include testimonials for social proof
- Always end with a strong CTA
- Use descriptive alt text for images