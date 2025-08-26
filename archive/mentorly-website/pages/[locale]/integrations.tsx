import { H2 } from 'components/Headings'
import {
  ContentSection,
  FeatureGrid,
  InfoBlock,
  LandingCTA,
  LandingHero,
  LandingTestimonials,
  StatsBlock,
} from 'components/landing'
import { Panel } from 'components/Panel'
import { SEO } from 'components/SEO/SEO'
import { VFC } from 'react'

// Custom component for integration showcase
const IntegrationShowcase: VFC = () => {
  const integrations = {
    calendar: ['Google Calendar', 'Outlook', 'iCal'],
    video: ['Mentorly Video', 'Google Meet', 'Microsoft Teams'],
    hris: ['Workday', 'Rippling', 'HiBob', 'Gusto', 'Zoho', '+ 28 more'],
    auth: ['SAML 2.0', 'OAuth 2.0', 'SSO'],
  }

  return (
    <Panel color="purple" className="py-24 text-white">
      <Panel.Container>
        <div className="text-center mb-16">
          <H2 className="mb-6 text-white">
            Seamlessly Connected to Your Tech Stack
          </H2>
          <p className="text-xl text-purple-100 max-w-3xl mx-auto">
            Mentorly integrates with the tools your teams already use, creating
            a frictionless mentorship experience from day one.
          </p>
        </div>
        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📅</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Calendar Sync</h3>
            <ul className="text-purple-100 space-y-1">
              {integrations.calendar.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🎥</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Video Platforms
            </h3>
            <ul className="text-purple-100 space-y-1">
              {integrations.video.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📊</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">HRIS Systems</h3>
            <ul className="text-purple-100 space-y-1">
              {integrations.hris.map((item, index) => (
                <li
                  key={index}
                  className={
                    index === integrations.hris.length - 1
                      ? 'font-semibold'
                      : ''
                  }
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🔐</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Authentication
            </h3>
            <ul className="text-purple-100 space-y-1">
              {integrations.auth.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </Panel.Container>
    </Panel>
  )
}

// Custom component for integration flow diagram
const IntegrationFlow: VFC = () => {
  return (
    <Panel color="gray-50" className="py-24">
      <Panel.Container>
        <div className="text-center mb-16">
          <H2 className="mb-6">How Integrations Work</H2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our integrations work together to create a seamless experience that
            fits naturally into your existing workflows.
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-2xl">👤</span>
                </div>
                <div>
                  <h4 className="font-semibold">User Logs In</h4>
                  <p className="text-sm text-gray-600">Via SSO/SAML</p>
                </div>
              </div>
              <p className="text-gray-700">
                Employees use their existing credentials—no new passwords to
                remember
              </p>
            </div>
            <div className="text-center">
              <svg
                className="w-8 h-8 text-gray-400 mx-auto transform rotate-90 md:rotate-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-2xl">📅</span>
                </div>
                <div>
                  <h4 className="font-semibold">Books Session</h4>
                  <p className="text-sm text-gray-600">Calendar syncs</p>
                </div>
              </div>
              <p className="text-gray-700">
                Availability pulled from their calendar, session added
                automatically
              </p>
            </div>
          </div>
          <div className="flex justify-center my-8">
            <svg
              className="w-8 h-8 text-gray-400 transform rotate-90"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </div>
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-2xl">🎥</span>
                </div>
                <div>
                  <h4 className="font-semibold">Joins Meeting</h4>
                  <p className="text-sm text-gray-600">Video platform</p>
                </div>
              </div>
              <p className="text-gray-700">
                Click to join via their preferred video tool—no separate links
                needed
              </p>
            </div>
            <div className="text-center">
              <svg
                className="w-8 h-8 text-gray-400 mx-auto transform rotate-90 md:rotate-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-2xl">📊</span>
                </div>
                <div>
                  <h4 className="font-semibold">Data Syncs</h4>
                  <p className="text-sm text-gray-600">To HRIS</p>
                </div>
              </div>
              <p className="text-gray-700">
                Participation data flows back to your HR systems for tracking
              </p>
            </div>
          </div>
        </div>
      </Panel.Container>
    </Panel>
  )
}

const Integrations: VFC = () => {
  return (
    <>
      <SEO
        title="Integrations - Connect Mentorly to Your Tech Stack | Mentorly"
        description="Mentorly integrates with calendars, video tools, HR systems, and authentication protocols. Embed mentorship into existing workflows without disruption."
        image="/images/integrations-og.png"
      />

      <LandingHero
        color="purple"
        title="Built to Fit Right Into Your Workflow"
        subtitle="Mentorly integrates with your calendars, video tools, HR systems, and authentication protocols—so mentorship just works."
        primaryCTA={{
          text: 'Request a Demo',
          href: 'https://mentorly.com/en/thank-you',
        }}
        secondaryCTA={{
          text: 'See Our Integrations',
          href: '#integration-types',
        }}
        image={{
          src: '/images/integrations-dashboard.png',
          alt: 'Mentorly Integrations',
        }}
      />

      <ContentSection>
        <InfoBlock
          badge={{
            text: 'Enterprise Ready',
            icon: '🔧',
            color: 'purple',
          }}
          title="Why Integration Matters"
          subtitle="Your people are already busy—we make sure mentorship fits effortlessly into their flow. From scheduling to login to reporting, Mentorly syncs with your existing tools."
          description="Less IT overhead, more engagement, higher success."
          gradient={{ from: '#f3e8ff', to: '#dbeafe' }}
        />
      </ContentSection>

      <FeatureGrid
        id="integration-types"
        title="Comprehensive Integration Suite"
        subtitle="Every integration is designed to reduce friction and increase adoption across your organization."
        features={[
          {
            icon: '📅',
            title: 'Calendar Sync',
            description:
              'Supports Google Calendar, Outlook, and iCal. Mentors sync their calendar for auto-booking based on real availability. Sessions appear instantly in calendars—no manual entry.',
            highlights: [
              'Real-time availability',
              'Automatic session creation',
              'No double-booking',
            ],
            color: 'blue',
          },
          {
            icon: '🎥',
            title: 'Video Conferencing',
            description:
              'Choose your preferred platform: Host on Mentorly Video or connect Google Meet/Microsoft Teams. Video links automatically added to session invites.',
            highlights: [
              'One-click joining',
              'Automatic link generation',
              'Platform flexibility',
            ],
            color: 'green',
          },
          {
            icon: '📊',
            title: 'HRIS Integration',
            description:
              'Connects to 33+ HR systems including Workday, Rippling, HiBob, Gusto, Zoho. Pull people data for seamless onboarding and smart program targeting.',
            highlights: [
              'Auto-enrollment',
              'Data synchronization',
              'Custom field mapping',
            ],
            color: 'purple',
          },
          {
            icon: '🔐',
            title: 'SAML + SSO',
            description:
              'Enterprise-grade security with SAML 2.0 and OAuth 2.0. Users log in with existing credentials—no new passwords, maximum security.',
            highlights: [
              'Single sign-on',
              'Enterprise security',
              'Zero password fatigue',
            ],
            color: 'yellow',
          },
        ]}
        variant="detailed"
        columns={2}
        backgroundColor="white"
      />

      <IntegrationShowcase />

      <IntegrationFlow />

      <StatsBlock
        title="The Power of Connected Systems"
        subtitle="Organizations using our integrations see dramatic improvements in adoption and efficiency."
        stats={[
          {
            value: '2x',
            label: 'Faster Adoption',
            description: 'with SSO enabled',
          },
          {
            value: '90%',
            label: 'Less Admin Time',
            description: 'with HRIS sync',
          },
          {
            value: '100%',
            label: 'Calendar Accuracy',
            description: 'with real-time sync',
          },
          {
            value: '0',
            label: 'New Passwords',
            description: 'to remember',
          },
        ]}
        backgroundColor="purple"
      />

      <FeatureGrid
        title="Built for Enterprise Scale"
        subtitle="Our integrations are designed to handle the complexity of large organizations while remaining simple to implement."
        features={[
          {
            icon: '⚡',
            title: 'Quick Setup',
            description:
              'Most integrations can be configured in minutes with guidance from our team. No lengthy implementation projects.',
          },
          {
            icon: '🛡️',
            title: 'Enterprise Security',
            description:
              'All integrations follow enterprise security standards. SOC 2 compliant with data encryption at rest and in transit.',
          },
          {
            icon: '🔄',
            title: 'Real-Time Sync',
            description:
              'Changes in connected systems reflect immediately in Mentorly. No batch processing delays or data inconsistencies.',
          },
        ]}
        columns={3}
        backgroundColor="gray-50"
      />

      <LandingTestimonials
        title="Trusted by IT and HR Teams"
        subtitle="See how organizations leverage our integrations to create seamless mentorship experiences."
        testimonials={[
          {
            quote:
              'Mentorly plugged into our systems within days—no friction, and adoption skyrocketed from day one.',
            author: 'David Chen',
            role: 'IT Director',
            company: 'Global Tech Corp',
          },
          {
            quote:
              'The HRIS integration saved us weeks of manual data entry. New employees are automatically enrolled in our mentorship program.',
            author: 'Sarah Williams',
            role: 'VP of People Ops',
            company: 'Innovation Partners',
          },
          {
            quote:
              'SSO was a game-changer. Our security team approved it immediately, and employees love not having another password.',
            author: 'Michael Park',
            role: 'CISO',
            company: 'Finance Leaders Inc',
          },
        ]}
        cardColor="purple"
      />

      <LandingCTA
        title="Let Mentorship Work the Way Your Company Already Does"
        subtitle="Join organizations that have seamlessly integrated mentorship into their existing tech stack—no disruption, just results."
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
        backgroundColor="purple"
      />
    </>
  )
}

export default Integrations
