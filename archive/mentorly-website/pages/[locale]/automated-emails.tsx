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

// Custom component for email examples
const EmailExamples: VFC = () => {
  return (
    <Panel color="blue" className="py-24 text-white">
      <Panel.Container>
        <div className="text-center mb-16">
          <H2 className="mb-6 text-white">See How Your Branded Emails Look</H2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Professional, personalized, and perfectly timed—every email
            reinforces your brand while guiding participants through their
            mentorship journey.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-12">
          {/* Default Branded Email */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4 text-center">
              Standard Branding
            </h3>
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              <div className="bg-gray-100 p-4 border-b">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    From: YourProgram@mentorly.com
                  </span>
                  <span className="text-xs text-gray-500">Via Mentorly</span>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <div className="w-32 h-12 bg-blue-600 rounded flex items-center justify-center text-white font-bold">
                    Your Logo
                  </div>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  You&apos;ve been matched! 🎉
                </h4>
                <p className="text-gray-600 mb-4">
                  Great news! We&apos;ve found you a perfect mentor match based
                  on your goals and preferences.
                </p>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-700">
                    <strong>Your Mentor:</strong> Sarah Johnson
                    <br />
                    <strong>Expertise:</strong> Leadership Development
                    <br />
                    <strong>Next Step:</strong> Book your first session
                  </p>
                </div>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium">
                  View Match Details
                </button>
                <div className="mt-6 pt-4 border-t text-xs text-gray-500">
                  Powered by Mentorly
                </div>
              </div>
            </div>
          </div>

          {/* Enterprise White-Label Email */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4 text-center">
              Enterprise White-Label
            </h3>
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              <div className="bg-gray-100 p-4 border-b">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    From: mentorship@yourcompany.com
                  </span>
                  <span className="text-xs text-gray-500">
                    Your Company Domain
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <div className="w-32 h-12 bg-purple-600 rounded flex items-center justify-center text-white font-bold">
                    Your Brand
                  </div>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  You&apos;ve been matched! 🎉
                </h4>
                <p className="text-gray-600 mb-4">
                  Great news! We&apos;ve found you a perfect mentor match based
                  on your goals and preferences.
                </p>
                <div className="bg-purple-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-700">
                    <strong>Your Mentor:</strong> Sarah Johnson
                    <br />
                    <strong>Expertise:</strong> Leadership Development
                    <br />
                    <strong>Next Step:</strong> Book your first session
                  </p>
                </div>
                <button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium">
                  View Match Details
                </button>
                <div className="mt-6 pt-4 border-t text-xs text-gray-500">
                  © Your Company 2024
                </div>
              </div>
            </div>
          </div>
        </div>
      </Panel.Container>
    </Panel>
  )
}

// Custom component for trigger flow
const TriggerFlow: VFC = () => {
  const triggers = [
    {
      action: 'Program Invitation',
      timing: 'Instantly',
      purpose: 'Welcome participants and guide onboarding',
      icon: '📧',
    },
    {
      action: 'Match Confirmed',
      timing: 'Within minutes',
      purpose: 'Introduce pairs and encourage first meeting',
      icon: '🤝',
    },
    {
      action: 'Session Booked',
      timing: '24 hours before',
      purpose: 'Send reminders with meeting details',
      icon: '📅',
    },
    {
      action: 'New Message',
      timing: 'If unread for 24h',
      purpose: 'Ensure important messages aren&apos;t missed',
      icon: '💬',
    },
    {
      action: 'Session Complete',
      timing: 'Post-session',
      purpose: 'Prompt feedback and next steps',
      icon: '✅',
    },
  ]

  return (
    <Panel color="gray-50" className="py-24">
      <Panel.Container>
        <div className="text-center mb-16">
          <H2 className="mb-6">Smart Triggers, Perfect Timing</H2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Each email is triggered by specific actions and delivered at the
            optimal moment to maximize engagement without overwhelming
            participants.
          </p>
        </div>
        <div className="max-w-5xl mx-auto">
          <div className="space-y-6">
            {triggers.map((trigger, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm p-6 flex items-center"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                  <span className="text-2xl">{trigger.icon}</span>
                </div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {trigger.action}
                    </h3>
                    <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      {trigger.timing}
                    </span>
                  </div>
                  <p className="text-gray-600">{trigger.purpose}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Panel.Container>
    </Panel>
  )
}

const AutomatedEmails: VFC = () => {
  return (
    <>
      <SEO
        title="Automated Emails - Smart Mentorship Communications | Mentorly"
        description="Keep your mentorship program running smoothly with automated emails. Timely, branded messages triggered by user actions—no manual work required."
        image="/images/automated-emails-og.png"
      />

      <LandingHero
        color="blue"
        title="Automated Emails That Power Your Program—Quietly and Seamlessly"
        subtitle="Timely, branded messages triggered by user actions—so nothing slips through the cracks, and no one has to chase anyone down."
        primaryCTA={{
          text: 'Request a Demo',
          href: 'https://mentorly.com/en/thank-you',
        }}
        secondaryCTA={{
          text: 'See Sample Emails',
          href: '#email-examples',
        }}
        image={{
          src: '/images/automated-emails-dashboard.png',
          alt: 'Automated Emails Dashboard',
        }}
      />

      <ContentSection>
        <InfoBlock
          badge={{
            text: 'Fully Automated',
            icon: '⚡',
            color: 'blue',
          }}
          title="Set It and Forget It"
          subtitle="These emails keep your participants informed every step of the way—automatically. From match notifications to session confirmations, emails are triggered at just the right moment."
          description="Participants feel guided and supported without overwhelming them or requiring manual intervention."
          gradient={{ from: '#dbeafe', to: '#e0e7ff' }}
        />
      </ContentSection>

      <FeatureGrid
        title="Why Automated Emails Matter"
        subtitle="Smart communication is the backbone of successful mentorship programs. Our automated emails ensure nothing falls through the cracks."
        features={[
          {
            icon: '⏰',
            title: 'Perfect Timing',
            description:
              'Messages sent exactly when needed—not too early, not too late. Our intelligent timing ensures maximum engagement.',
          },
          {
            icon: '🎯',
            title: 'Action-Based Triggers',
            description:
              'Emails respond to participant behavior, sending relevant information based on what they actually do in the platform.',
          },
          {
            icon: '🎨',
            title: 'On-Brand Experience',
            description:
              'Every email reinforces your program identity with customizable branding that participants recognize and trust.',
          },
        ]}
        columns={3}
        backgroundColor="white"
      />

      <TriggerFlow />

      <FeatureGrid
        title="Powerful Benefits, Zero Effort"
        subtitle="Our automated email system works tirelessly in the background, delivering value without demanding your time."
        features={[
          {
            icon: '💰',
            title: 'Saves Time',
            description:
              'Replaces the work of two full-time program managers. No more manual reminder emails or follow-ups.',
            highlights: [
              '40+ hours saved monthly',
              'Zero manual work',
              'Set once, runs forever',
            ],
          },
          {
            icon: '📈',
            title: 'Increases Engagement',
            description:
              'Keeps participants in the loop and on track. Timely nudges ensure sessions happen and connections thrive.',
            highlights: [
              '3x higher response rates',
              'Better session attendance',
              'Reduced drop-offs',
            ],
          },
          {
            icon: '🎯',
            title: 'Just-in-Time Delivery',
            description:
              'Smart spacing prevents inbox fatigue. Participants get what they need, when they need it—nothing more.',
            highlights: [
              'No email overload',
              'Contextual messaging',
              'Optimal send times',
            ],
          },
          {
            icon: '🚀',
            title: 'Guided Experience',
            description:
              'Gently walks participants through your program. From onboarding to ongoing engagement, every step is supported.',
            highlights: [
              'Clear next steps',
              'Progress reminders',
              'Celebration moments',
            ],
          },
        ]}
        variant="detailed"
        columns={2}
        backgroundColor="gray-50"
      />

      <EmailExamples />

      <ContentSection>
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-12 text-center">
          <H2 className="mb-6">Branding & Customization Options</H2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Teams</h3>
              <ul className="text-left space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Your program name
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Basic color theming
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">✗</span>
                  Mentorly branding visible
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-blue-200">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Pro & Enterprise
              </h3>
              <ul className="text-left space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Your logo & colors
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Custom email templates
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Minimal Mentorly branding
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-purple-200">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Enterprise White-Label
              </h3>
              <ul className="text-left space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Fully white-labeled
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Custom domain sending
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  100% your brand
                </li>
              </ul>
            </div>
          </div>
        </div>
      </ContentSection>

      <StatsBlock
        title="The Impact of Automated Communication"
        subtitle="Organizations using our automated emails see dramatic improvements across all program metrics."
        stats={[
          {
            value: '95%',
            label: 'Open Rate',
            description: 'for program emails',
          },
          {
            value: '3x',
            label: 'Higher Engagement',
            description: 'vs. manual emails',
          },
          {
            value: '0',
            label: 'Emails Missed',
            description: 'or forgotten to send',
          },
          {
            value: '40hrs',
            label: 'Saved Monthly',
            description: 'on admin work',
          },
        ]}
        backgroundColor="blue"
      />

      <LandingTestimonials
        title="Program Managers Love the Automation"
        subtitle="See how automated emails are transforming mentorship program management."
        testimonials={[
          {
            quote:
              'These automated emails work like having a full-time assistant. Participants stay engaged, and I can focus on strategy instead of logistics.',
            author: 'Maria Rodriguez',
            role: 'Program Manager',
            company: 'Tech Innovators Inc',
          },
          {
            quote:
              'The timing is perfect—reminders go out exactly when needed. Our no-show rate dropped by 75% after implementing automated emails.',
            author: 'James Chen',
            role: 'L&D Director',
            company: 'Global Finance Corp',
          },
          {
            quote:
              'Being able to brand the emails makes such a difference. Participants recognize them instantly and engagement has soared.',
            author: 'Sarah Thompson',
            role: 'VP of Talent',
            company: 'Healthcare Leaders Network',
          },
        ]}
        cardColor="blue"
      />

      <LandingCTA
        title="Let Your Emails Work for You"
        subtitle="Join organizations that have automated their mentorship communications and seen engagement soar while effort plummets."
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
        backgroundColor="blue"
      />
    </>
  )
}

export default AutomatedEmails
