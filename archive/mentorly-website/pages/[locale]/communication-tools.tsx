import { H2 } from 'components/Headings'
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
import { Panel } from 'components/Panel'
import { SEO } from 'components/SEO/SEO'
import { VFC } from 'react'

// Custom component for messaging interface preview
const MessagingWorkflow: VFC = () => {
  return (
    <Panel color="green" className="py-24 text-white">
      <Panel.Container>
        <div className="text-center mb-16">
          <H2 className="mb-6 text-white">See How Smart Communication Works</H2>
          <p className="text-xl text-green-100 max-w-3xl mx-auto">
            From targeted filters to automated email logic, our platform makes
            program communication effortless and effective.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-8">
              <h3 className="text-2xl font-bold text-white mb-6">
                Smart Filtering System
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'By Role', options: 'Mentors, Mentees, or Both' },
                  { label: 'By Status', options: 'Active, Inactive, New' },
                  { label: 'By Cohort', options: 'Specific program groups' },
                  { label: 'Individual', options: 'Hand-pick recipients' },
                ].map((filter, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-white bg-opacity-10 rounded-lg p-4"
                  >
                    <span className="text-white font-semibold">
                      {filter.label}
                    </span>
                    <span className="text-green-100 text-sm">
                      {filter.options}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-8">
              <h3 className="text-2xl font-bold text-white mb-6">
                Intelligent Email Logic
              </h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">
                      Message Sent in Platform
                    </h4>
                    <p className="text-green-100 text-sm">
                      Your message appears instantly in participant&apos;s inbox
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">
                      Smart Detection
                    </h4>
                    <p className="text-green-100 text-sm">
                      System checks if participant has seen the message
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">
                      Automated Email (If Needed)
                    </h4>
                    <p className="text-green-100 text-sm">
                      Only sends email if message hasn&apos;t been read
                      in-platform
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Panel.Container>
    </Panel>
  )
}

const CommunicationTools: VFC = () => {
  return (
    <>
      <SEO
        title="Communication Tools - Smart Messaging for Mentorship Programs | Mentorly"
        description="Ditch the email lists. Message mentors and mentees directly with Mentorly's built-in communication tools. Smart filters, announcements, and automated follow-ups included."
        image="/images/communication-tools-og.png"
      />

      <LandingHero
        color="green"
        title="Ditch the Email Lists. Message Everyone Directly, Instantly."
        subtitle="Mentorly's built-in Communication Tools give Program Managers an effortless way to stay in touch with participants—right inside the platform."
        primaryCTA={{
          text: 'Request a Demo',
          href: 'https://mentorly.com/en/thank-you',
        }}
        secondaryCTA={{
          text: 'See How It Works',
          href: '#how-it-works',
        }}
        image={{
          src: '/images/communication-dashboard.png',
          alt: 'Communication Tools Dashboard',
        }}
      />

      <ContentSection>
        <InfoBlock
          badge={{
            text: 'Built for Scale',
            icon: '📢',
            color: 'green',
          }}
          title="Why Program Managers Love This"
          subtitle="No more pulling email lists or navigating messy external communication. Send messages directly from within Mentorly using smart filters and messaging types."
          description="Whether it's nudges, reminders, updates, or encouragement, you stay connected—and your program stays on track."
          gradient={{ from: '#dcfce7', to: '#dbeafe' }}
        />
      </ContentSection>

      <FeatureGrid
        title="Powerful Features, Simple Experience"
        subtitle="Everything you need to communicate effectively with your mentorship program participants—all in one place."
        features={[
          {
            icon: '🎯',
            title: 'Send Messages from Anywhere',
            description:
              'Start a thread from the Chat tab or go to the Members tab to send messages based on participant filters. Flexibility built in.',
            highlights: [
              'Multiple entry points',
              'Context-aware messaging',
              'Seamless workflow',
            ],
          },
          {
            icon: '🔍',
            title: 'Smart Filtering System',
            description:
              'Target your messages precisely. Filter by role (mentor/mentee), participation status, cohort, or select specific individuals.',
            highlights: [
              'Role-based targeting',
              'Activity-based filters',
              'Individual selection',
            ],
          },
          {
            icon: '💬',
            title: 'Two Message Types',
            description:
              'Group Chat for interactive discussions where all can reply, or Announcements for one-way updates where replies go only to you.',
            highlights: [
              'Interactive group chats',
              'Broadcast announcements',
              'Reply management',
            ],
          },
          {
            icon: '📧',
            title: 'Intelligent Email Backup',
            description:
              'If a participant misses a message, Mentorly emails them automatically. Already seen it in-platform? No duplicate email sent.',
            highlights: [
              'Smart email logic',
              'No inbox flooding',
              'Guaranteed delivery',
            ],
          },
        ]}
        variant="detailed"
        columns={2}
        backgroundColor="white"
      />

      <HowItWorks
        id="how-it-works"
        title="Communication Made Simple"
        subtitle="From composing to delivery, our streamlined workflow saves you hours of administrative work every month."
        steps={[
          {
            number: '1',
            title: 'Choose Your Audience',
            description:
              'Select who to message using our smart filters or pick individuals directly from your member list.',
            color: 'green',
          },
          {
            number: '2',
            title: 'Compose Your Message',
            description:
              'Write your message and choose between group chat (interactive) or announcement (one-way) format.',
            color: 'blue',
          },
          {
            number: '3',
            title: 'Send & Track',
            description:
              'Hit send and watch engagement in real-time. Our system handles email notifications intelligently.',
            color: 'purple',
          },
        ]}
        backgroundColor="gray-50"
      />

      <MessagingWorkflow />

      <StatsBlock
        title="The Impact of Better Communication"
        subtitle="Organizations using Mentorly's communication tools see dramatic improvements in program efficiency and engagement."
        stats={[
          {
            value: '85%',
            label: 'Less Time',
            description: 'spent on admin communication',
          },
          {
            value: '3x',
            label: 'Higher Response',
            description: 'rates vs. traditional email',
          },
          {
            value: '92%',
            label: 'Participants',
            description: 'stay engaged throughout',
          },
          {
            value: '0',
            label: 'External Tools',
            description: 'needed for messaging',
          },
        ]}
        backgroundColor="green"
      />

      <FeatureGrid
        title="Built for Every Communication Need"
        subtitle="Whether you're running a small pilot or a company-wide program, our tools scale with you."
        features={[
          {
            icon: '📣',
            title: 'Program Announcements',
            description:
              'Share updates, celebrate milestones, or provide resources to your entire program with one-way announcements.',
          },
          {
            icon: '🔔',
            title: 'Engagement Nudges',
            description:
              'Send targeted reminders to inactive participants or encourage mentors to open more session slots.',
          },
          {
            icon: '🎯',
            title: 'Cohort Communications',
            description:
              'Message specific groups within your program, perfect for department-specific or location-based initiatives.',
          },
        ]}
        columns={3}
        backgroundColor="white"
      />

      <LandingTestimonials
        title="Program Managers Love the Simplicity"
        subtitle="See how organizations are transforming their mentorship communication with our built-in tools."
        testimonials={[
          {
            quote:
              "We used to manage dozens of mentorship threads in email. Now it's all in one place—and it's seamless. It saves me hours every week.",
            author: 'Sarah Mitchell',
            role: 'Program Manager',
            company: 'Tech Solutions Inc',
          },
          {
            quote:
              'The smart filtering means I can target exactly who needs to hear what. No more mass emails that get ignored.',
            author: 'Michael Torres',
            role: 'L&D Director',
            company: 'Global Finance Corp',
          },
          {
            quote:
              'The fact that emails only go out if needed is brilliant. Our participants aren&apos;t overwhelmed, and important messages don&apos;t get lost.',
            author: 'Lisa Chen',
            role: 'HR Manager',
            company: 'Innovation Labs',
          },
        ]}
        cardColor="green"
      />

      <LandingCTA
        title="Mentorship Communication, Finally Streamlined"
        subtitle="Join forward-thinking organizations that have eliminated the chaos of external email lists and disconnected communication tools."
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
        backgroundColor="green"
      />
    </>
  )
}

export default CommunicationTools
