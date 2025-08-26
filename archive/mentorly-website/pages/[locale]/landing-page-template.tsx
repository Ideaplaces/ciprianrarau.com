import {
  ContentSection,
  FeatureGrid,
  HowItWorks,
  InfoBlock,
  LandingCTA,
  LandingHero,
  LandingTestimonials,
  StatsBlock,
} from 'components/landing'
import { SEO } from 'components/SEO/SEO'
import { VFC } from 'react'

/**
 * LANDING PAGE TEMPLATE
 *
 * This template demonstrates how to use the refactored landing page components
 * to quickly create new landing pages. Simply copy this file and modify the
 * content as needed.
 *
 * Available Components:
 * - LandingHero: Hero section with title, subtitle, CTAs, and image
 * - FeatureGrid: Grid of features with various display options
 * - HowItWorks: Step-by-step process sections
 * - LandingTestimonials: Customer testimonials with partner logos
 * - LandingCTA: Call-to-action section
 * - ContentSection: Wrapper for custom content
 * - InfoBlock: Highlighted information blocks
 * - StatsBlock: Statistics display
 *
 * Color Options: 'blue', 'green', 'yellow', 'purple', 'white'
 * Background Options: 'white', 'gray-50'
 */

const LandingPageTemplate: VFC = () => {
  return (
    <>
      <SEO
        title="Page Title - Feature Description | Mentorly"
        description="Page meta description for SEO purposes. Keep it under 160 characters."
        image="/images/page-og-image.png"
      />

      {/* HERO SECTION */}
      <LandingHero
        color="blue" // Options: blue, green, yellow, purple, white
        title="Your Compelling Headline Here"
        subtitle="A supporting subtitle that explains the value proposition in one or two sentences."
        primaryCTA={{
          text: 'Request a Demo',
          href: 'https://mentorly.com/en/thank-you',
        }}
        secondaryCTA={{
          text: 'Learn More',
          href: '#features',
        }}
        image={{
          src: '/images/feature-screenshot.png',
          alt: 'Feature Screenshot',
        }}
        badge={{
          text: 'New Feature',
          icon: '✨',
        }}
      />

      {/* OPTIONAL: Info Block for highlighting key message */}
      <ContentSection>
        <InfoBlock
          badge={{
            text: 'The Problem',
            icon: '⚠️',
            color: 'red',
          }}
          title="Most Programs Struggle With X"
          subtitle="Explain the problem your feature solves in a compelling way that resonates with your audience."
          cta={{
            text: 'See the Solution',
            href: '#solution',
          }}
        />
      </ContentSection>

      {/* FEATURE GRID - Default variant */}
      <FeatureGrid
        title="Key Benefits"
        subtitle="How this feature transforms your mentorship program"
        features={[
          {
            icon: '🎯',
            title: 'Benefit One',
            description: 'Clear description of the first key benefit.',
          },
          {
            icon: '⚡',
            title: 'Benefit Two',
            description: 'Clear description of the second key benefit.',
          },
          {
            icon: '📈',
            title: 'Benefit Three',
            description: 'Clear description of the third key benefit.',
          },
        ]}
        columns={3}
        backgroundColor="gray-50"
      />

      {/* FEATURE GRID - Detailed variant with highlights */}
      <FeatureGrid
        id="features"
        title="Feature Breakdown"
        subtitle="Everything you need to know about our features"
        features={[
          {
            icon: '🔍',
            title: 'Feature One',
            description:
              'Detailed description of this feature and how it works.',
            color: 'blue',
            highlights: ['Highlight 1', 'Highlight 2', 'Highlight 3'],
          },
          {
            icon: '🚀',
            title: 'Feature Two',
            description:
              'Detailed description of this feature and how it works.',
            color: 'green',
            highlights: ['Highlight 1', 'Highlight 2', 'Highlight 3'],
          },
        ]}
        variant="detailed"
        columns={2}
      />

      {/* HOW IT WORKS - Numbered variant */}
      <HowItWorks
        title="How It Works"
        subtitle="Get started in three simple steps"
        steps={[
          {
            number: '01',
            title: 'Step One',
            description: 'Description of the first step in the process.',
            color: 'blue',
          },
          {
            number: '02',
            title: 'Step Two',
            description: 'Description of the second step in the process.',
            color: 'yellow',
          },
          {
            number: '03',
            title: 'Step Three',
            description: 'Description of the third step in the process.',
            color: 'green',
          },
        ]}
        bottomNote="Additional note or disclaimer about the process"
      />

      {/* STATS BLOCK */}
      <StatsBlock
        title="Proven Results"
        subtitle="See the impact our solution delivers"
        stats={[
          {
            value: '95%',
            label: 'Satisfaction Rate',
            description: 'Among program participants',
          },
          {
            value: '3x',
            label: 'Faster Implementation',
            description: 'Compared to manual processes',
          },
          {
            value: '85%',
            label: 'Time Saved',
            description: 'On administrative tasks',
          },
        ]}
        backgroundColor="blue"
      />

      {/* TESTIMONIALS */}
      <LandingTestimonials
        title="What Our Customers Say"
        subtitle="See how organizations are transforming their programs"
        testimonials={[
          {
            quote:
              'This feature transformed how we run our mentorship program. The results speak for themselves.',
            author: 'Jane Smith',
            role: 'VP of People',
            company: 'Tech Company Inc',
          },
          {
            quote:
              'Implementation was seamless and the impact was immediate. Highly recommended.',
            author: 'John Doe',
            role: 'L&D Director',
            company: 'Global Corp',
          },
          {
            quote:
              'The insights we gained helped us make better decisions and improve outcomes.',
            author: 'Sarah Johnson',
            role: 'HR Manager',
            company: 'Innovation Labs',
          },
        ]}
        cardColor="blue" // Match your theme color
      />

      {/* FINAL CTA */}
      <LandingCTA
        title="Ready to Transform Your Program?"
        subtitle="Join thousands of organizations using Mentorly to build better mentorship programs."
        buttons={[
          {
            text: 'Request a Demo',
            href: 'https://mentorly.com/en/thank-you',
          },
          {
            text: 'Talk to Sales',
            href: '/pricing',
            variant: 'secondary',
          },
        ]}
        backgroundColor="blue" // Match your theme color
        bottomText="✓ No credit card required ✓ 14-day free trial"
      />
    </>
  )
}

export default LandingPageTemplate
