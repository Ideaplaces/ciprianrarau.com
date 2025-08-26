import { ButtonLink } from 'components/Button/Button'
import { H2 } from 'components/Headings'
import {
  ContentSection,
  FeatureGrid,
  HowItWorks,
  InfoBlock,
  LandingCTA,
  LandingHero,
  LandingTestimonials,
} from 'components/landing'
import { Panel } from 'components/Panel'
import { SEO } from 'components/SEO/SEO'
import Link from 'next/link'
import { VFC } from 'react'

// Custom component for Enterprise Flexibility section
const EnterpriseFlexibility: VFC = () => {
  return (
    <Panel color="purple" className="pt-24 text-white">
      <Panel.Container className="md:flex items-center">
        <div className="md:w-1/2 md:pr-8">
          <H2 className="mb-6 text-white">Enterprise Flexibility</H2>
          <p className="text-xl text-purple-100 mb-8">
            Take customization to the next level with our Enterprise features
            designed for large organizations with specific branding
            requirements.
          </p>
          <div className="space-y-6">
            {[
              {
                title: 'Fully White-Labeled Portals',
                description:
                  'Complete brand integration with no Mentorly branding visible anywhere.',
              },
              {
                title: 'Custom URL Options',
                description:
                  'Use your own domain to create a seamless brand experience.',
              },
              {
                title: 'Editable Transactional Emails',
                description:
                  'Customize every email that goes out to maintain consistent messaging.',
              },
              {
                title: 'Dedicated Customer Success',
                description:
                  'Get hands-on support from our Customer Success Managers.',
              },
            ].map((item, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-white rounded-full flex items-center justify-center mr-4 mt-1">
                  <svg
                    className="w-4 h-4 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">
                    {item.title}
                  </h4>
                  <p className="text-purple-100">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="md:w-1/2 mt-12 md:mt-0">
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-8 text-center">
            <h3 className="text-3xl font-black text-white mb-6">
              Ready for Enterprise?
            </h3>
            <p className="text-purple-100 mb-8 text-lg leading-relaxed">
              Schedule a consultation to discuss your specific customization
              needs and enterprise requirements.
            </p>
            <Link href="https://mentorly.com/en/thank-you" passHref>
              <ButtonLink variant="primary" full>
                Show Me How It Works
              </ButtonLink>
            </Link>
          </div>
        </div>
      </Panel.Container>
    </Panel>
  )
}

// Custom Visual Showcase section
const VisualShowcase: VFC = () => {
  return (
    <Panel color="gray" className="pt-24">
      <Panel.Container>
        <div className="text-center mb-16">
          <H2 className="mb-6">See the Transformation</H2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Watch how our portal design features transform a generic platform
            into a branded experience that feels uniquely yours.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">
              Before: Generic Platform
            </h3>
            <div className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-lg">
              <div className="w-full h-64 bg-gray-100 rounded flex items-center justify-center">
                <p className="text-gray-500 text-lg">Generic Portal Preview</p>
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">
              After: Your Brand
            </h3>
            <div className="bg-white border-2 border-blue-200 rounded-lg p-6 shadow-lg">
              <div className="w-full h-64 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center">
                <p className="text-white text-lg font-semibold">
                  Your Branded Portal
                </p>
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-4 bg-blue-200 rounded w-3/4"></div>
                <div className="h-4 bg-blue-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </Panel.Container>
    </Panel>
  )
}

const PortalDesignPage: VFC = () => {
  return (
    <>
      <SEO
        title="Portal Design - Customizable Mentorship Platform | Mentorly"
        description="Create a branded mentorship portal that reflects your organization's identity. Customize colors, logos, content, and more with Mentorly's Portal Design features."
      />

      <LandingHero
        color="blue"
        title="Design a Mentorship Portal That Reflects Your Brand"
        subtitle="Bring your mentorship program to life with customizable design, content, and structure—no tech skills required."
        primaryCTA={{
          text: 'Show Me How It Works',
          href: 'https://mentorly.com/en/thank-you',
        }}
        secondaryCTA={{
          text: 'Explore Features',
          href: '/product',
        }}
        image={{
          src: '/images/program-manager-design.png',
          alt: 'Portal Design Platform',
        }}
      />

      <ContentSection>
        <InfoBlock
          badge={{
            text: 'White Label Available',
            icon: '✨',
            color: 'yellow',
          }}
          title="Complete Brand Control"
          subtitle="Remove all Mentorly branding and create a portal that's 100% yours. Custom URLs, personalized emails, and seamless brand integration included."
          cta={{
            text: 'Show Me How It Works',
            href: 'https://mentorly.com/en/thank-you',
          }}
        />
      </ContentSection>

      <FeatureGrid
        title="Why Portal Design Matters"
        subtitle="Your mentorship portal is often the first touchpoint participants have with your program. Make it count with a design that reflects your organization's values and mission."
        features={[
          {
            icon: '✓',
            title: 'Aligns with Your Brand',
            description:
              "Seamlessly integrate your mentorship program with your organization's visual identity and mission statement.",
          },
          {
            icon: '⚡',
            title: 'Enhances Credibility',
            description:
              'Build trust and confidence among mentors and mentees with a professional, polished platform experience.',
          },
          {
            icon: '❤️',
            title: 'Drives Engagement',
            description:
              'Create an intuitive, on-brand experience that encourages adoption and active participation.',
          },
        ]}
        columns={3}
        backgroundColor="white"
      />

      <FeatureGrid
        title="What You Can Customize"
        subtitle="Take complete control over your portal's look, feel, and functionality with our comprehensive customization options."
        features={[
          {
            title: 'Program Descriptions',
            description:
              'Share your mission, goals, and expected outcomes with compelling program descriptions that inspire participation.',
            icon: '📝',
            color: 'blue',
          },
          {
            title: 'Branding & Design',
            description:
              "Use your brand's colors, logos, and imagery to create a cohesive experience that feels like home.",
            icon: '🎨',
            color: 'green',
          },
          {
            title: 'Sectors & Industries',
            description:
              "Tailor profile options and categories to match your organization's specific demographics and needs.",
            icon: '🏢',
            color: 'blue',
          },
          {
            title: 'Email Communications',
            description:
              'Customize transactional messages to feel personal, professional, and on-brand (Enterprise only).',
            icon: '✉️',
            color: 'green',
            highlights: ['Enterprise Only'],
          },
          {
            title: 'Portal URL',
            description:
              'Choose a white-label or custom URL that reinforces your brand identity (Enterprise only).',
            icon: '🌐',
            color: 'blue',
            highlights: ['White Label Available'],
          },
          {
            title: 'Content Structure',
            description:
              "Organize information and navigation to match your organization's workflow and priorities.",
            icon: '📊',
            color: 'green',
          },
        ]}
        variant="shadowed"
        columns={3}
      />

      <HowItWorks
        title="How It Works"
        subtitle="Getting your custom portal up and running is simple. Follow these four easy steps to create a branded experience your people will love."
        steps={[
          {
            number: '1',
            title: 'Navigate to Program Tab',
            description:
              'Access the customization tools directly from your admin dashboard with just one click.',
            color: 'yellow',
          },
          {
            number: '2',
            title: 'Add Your Branding',
            description:
              "Upload your logo, set brand colors, and customize content to match your organization's identity.",
            color: 'blue',
          },
          {
            number: '3',
            title: 'Preview Changes',
            description:
              'See your changes in real-time with the "View Website" button before going live.',
            color: 'green',
          },
          {
            number: '4',
            title: 'Launch Your Portal',
            description:
              'Publish your fully branded mentorship portal and start engaging your participants.',
            color: 'black',
          },
        ]}
        backgroundColor="white"
      />

      <VisualShowcase />

      <EnterpriseFlexibility />

      <LandingTestimonials
        title="What Our Clients Say"
        subtitle="Hear from L&D and HR leaders who have transformed their mentorship programs with custom portal design."
        testimonials={[
          {
            quote:
              'The customization options made our mentorship portal feel like a natural extension of our company culture. The setup was incredibly intuitive.',
            author: 'Jane Doe',
            role: 'L&D Director, Tech Corp',
          },
          {
            quote:
              'Our employees immediately recognized the portal as part of our ecosystem. The branding integration was seamless and professional.',
            author: 'Michael Smith',
            role: 'HR Manager, Global Inc',
          },
          {
            quote:
              "The ability to customize everything from colors to content helped us create an experience that truly reflects our startup's innovative spirit.",
            author: 'Amy Liu',
            role: 'Chief People Officer, Startup',
          },
        ]}
        backgroundColor="white"
      />

      <LandingCTA
        title="Ready to Create Your Branded Portal?"
        subtitle="Join hundreds of organizations who have transformed their mentorship programs with customizable portal design. No technical skills required – just your vision and our platform."
        buttons={[
          {
            text: 'Show Me How It Works',
            href: 'https://mentorly.com/en/thank-you',
          },
          {
            text: 'Talk to Sales',
            href: '/pricing',
            variant: 'secondary',
          },
        ]}
        backgroundColor="blue"
        bottomText="✓ No setup fees ✓ Enterprise support included"
      />
    </>
  )
}

export default PortalDesignPage
