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
import { VFC } from 'react'

// Custom component for messaging interface preview
const MessagingInterface: VFC = () => {
  return (
    <Panel color="blue" className="py-24 text-white">
      <Panel.Container>
        <div className="text-center mb-16">
          <H2 className="mb-6 text-white">
            See How Seamless Communication Looks
          </H2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Our intuitive messaging interface keeps everything organized by
            session, making it easy to track progress and maintain context.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
              <h4 className="text-lg font-semibold text-white mb-4">
                Session-Based Threading
              </h4>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-300 rounded-full mt-2 mr-3"></div>
                  <p className="text-blue-100">
                    Messages automatically organized by session
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-300 rounded-full mt-2 mr-3"></div>
                  <p className="text-blue-100">
                    Notes from video calls sync automatically
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-300 rounded-full mt-2 mr-3"></div>
                  <p className="text-blue-100">
                    Group chats for masterclasses and workshops
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
              <h4 className="text-lg font-semibold text-white mb-4">
                Privacy & Security First
              </h4>
              <p className="text-blue-100 mb-4">
                No email addresses are ever shared. All communication happens
                within Mentorly&apos;s secure platform, protecting participant
                privacy while enabling meaningful connections.
              </p>
              <div className="flex items-center text-blue-200">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>End-to-end encrypted</span>
              </div>
            </div>
          </div>
          <div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
              <div className="bg-white bg-opacity-20 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-white bg-opacity-30 rounded-full mr-3"></div>
                  <div>
                    <p className="text-white font-semibold">Sarah Chen</p>
                    <p className="text-blue-200 text-sm">
                      Re: Career Development Session
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-white bg-opacity-10 rounded-lg p-3">
                    <p className="text-blue-100 text-sm">
                      Thanks for the great session! I&apos;ve attached my
                      notes...
                    </p>
                  </div>
                  <div className="bg-blue-600 bg-opacity-30 rounded-lg p-3 ml-auto max-w-[80%]">
                    <p className="text-white text-sm">
                      Great to connect! Here are the resources I mentioned...
                    </p>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-lg p-3 border-l-4 border-green-400">
                    <p className="text-green-300 text-xs mb-1">
                      📝 Session Notes Added
                    </p>
                    <p className="text-blue-100 text-sm">
                      Key takeaways from today&apos;s discussion...
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

const ChatInbox: VFC = () => {
  return (
    <>
      <SEO
        title="Chat & Inbox - Secure Mentorship Communication | Mentorly"
        description="Keep mentorship conversations going with Mentorly's built-in Chat & Inbox. Connect securely, share notes, and maintain context—all without sharing email addresses."
        image="/images/chat-inbox-og.png"
      />

      <LandingHero
        color="blue"
        title="Keep the Conversation Going—Securely and Seamlessly"
        subtitle="Mentorly's built-in Chat & Inbox lets participants connect, share resources, and track progress—all without ever exchanging personal contact information."
        primaryCTA={{
          text: 'Request a Demo',
          href: 'https://mentorly.com/en/thank-you',
        }}
        secondaryCTA={{
          text: 'See It In Action',
          href: '#how-it-works',
        }}
        image={{
          src: '/images/chat-interface.png',
          alt: 'Mentorly Chat Interface',
        }}
      />

      <ContentSection>
        <InfoBlock
          badge={{
            text: 'Privacy Protected',
            icon: '🔒',
            color: 'blue',
          }}
          title="Great Mentorship Happens Between Sessions Too"
          subtitle="Our secure messaging system enables continuous learning and support without compromising privacy. Participants can prepare, reflect, and follow up—all within the platform."
          description="No email addresses shared. No external tools needed. Just seamless, secure communication."
          gradient={{ from: '#dbeafe', to: '#e0e7ff' }}
        />
      </ContentSection>

      <FeatureGrid
        title="Why Secure Messaging Matters"
        subtitle="Create a safe space for meaningful mentorship conversations while maintaining professional boundaries and participant privacy."
        features={[
          {
            icon: '🛡️',
            title: 'Privacy-First Design',
            description:
              "Email addresses are never exposed. All communication stays within Mentorly's secure platform, protecting both mentors and mentees.",
          },
          {
            icon: '📍',
            title: 'Context-Rich Conversations',
            description:
              'Messages are tied to specific sessions, keeping discussions organized and relevant. No more searching through email threads.',
          },
          {
            icon: '🤝',
            title: 'Build Stronger Connections',
            description:
              'Enable participants to prepare questions, share resources, and follow up on action items—deepening the mentorship relationship.',
          },
        ]}
        columns={3}
        backgroundColor="white"
      />

      <HowItWorks
        id="how-it-works"
        title="Seamless Communication at Every Stage"
        subtitle="Our messaging system integrates naturally into the mentorship journey, enhancing connections without adding complexity."
        steps={[
          {
            icon: '📅',
            title: 'Pre-Session Preparation',
            description:
              'Once a session is booked, participants can message to set expectations, share agendas, or ask preliminary questions.',
            details: 'Better prepared sessions',
          },
          {
            icon: '📝',
            title: 'Automatic Note Sync',
            description:
              'Notes taken during video sessions are automatically saved to the chat thread, creating a valuable record of insights and action items.',
            details: 'Never lose important insights',
          },
          {
            icon: '👥',
            title: 'Group Conversations',
            description:
              'After masterclasses or group sessions, dedicated group chats open automatically to encourage peer learning and networking.',
            details: 'Extended learning opportunities',
          },
        ]}
        variant="icon"
      />

      <FeatureGrid
        title="Powerful Features for Better Mentorship"
        subtitle="Everything you need to facilitate meaningful conversations and track mentorship progress—all in one secure platform."
        features={[
          {
            icon: '💬',
            title: 'Session-Based Threading',
            description:
              'Conversations are automatically organized by session, maintaining context and making it easy to track progress over time.',
            highlights: [
              'Chronological message history',
              'Session context preserved',
              'Easy progress tracking',
            ],
          },
          {
            icon: '📎',
            title: 'Resource Sharing',
            description:
              'Share documents, links, and resources directly in chat. Everything stays organized and accessible for future reference.',
            highlights: [
              'File attachments supported',
              'Link previews',
              'Searchable history',
            ],
          },
          {
            icon: '🔔',
            title: 'Smart Notifications',
            description:
              'Participants receive timely notifications for new messages while respecting boundaries and preventing overwhelm.',
            highlights: [
              'Customizable alerts',
              'Email digest options',
              'Do not disturb settings',
            ],
          },
          {
            icon: '🔍',
            title: 'Search & Archive',
            description:
              'Powerful search functionality helps participants find past conversations, shared resources, and important insights quickly.',
            highlights: [
              'Full-text search',
              'Filter by date/session',
              'Permanent archive',
            ],
          },
        ]}
        variant="detailed"
        columns={2}
        backgroundColor="gray-50"
      />

      <MessagingInterface />

      <FeatureGrid
        title="Built for Every Mentorship Scenario"
        subtitle="Our flexible messaging system adapts to different program types and organizational needs."
        features={[
          {
            icon: '🎯',
            title: 'For 1:1 Mentoring',
            description:
              'Private channels for mentor-mentee pairs • Pre-session preparation tools • Progress tracking through conversation history • Action item follow-ups',
          },
          {
            icon: '🎓',
            title: 'For Group Programs',
            description:
              'Automatic group chat creation • Peer-to-peer learning • Mentor-facilitated discussions • Community building features',
          },
          {
            icon: '🏢',
            title: 'For Organizations',
            description:
              'Complete privacy protection • Compliance-ready archiving • Usage analytics for admins • No IT integration required',
          },
        ]}
        columns={3}
        backgroundColor="white"
      />

      <LandingTestimonials
        title="Trusted Communication for Trusted Programs"
        subtitle="See how organizations use Mentorly's secure messaging to enhance their mentorship programs."
        testimonials={[
          {
            quote:
              'The chat feature kept our teams connected and aligned, without the need for external tools or sharing personal information.',
            author: 'Maria Rodriguez',
            role: 'L&D Manager',
            company: 'Global Tech Corp',
          },
          {
            quote:
              'Having session notes automatically saved to our conversations has been a game-changer. Nothing gets lost, and progress is always visible.',
            author: 'David Park',
            role: 'Head of Talent Development',
            company: 'Innovation Partners',
          },
          {
            quote:
              'The privacy protection gives our executives confidence to participate as mentors. They can give back without worrying about boundaries.',
            author: 'Jennifer Adams',
            role: 'VP of People Operations',
            company: 'Finance Leaders Inc',
          },
        ]}
        cardColor="blue"
      />

      <LandingCTA
        title="Ready to Enable Secure Mentorship Conversations?"
        subtitle="Join organizations that trust Mentorly to facilitate meaningful connections while protecting participant privacy."
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

export default ChatInbox
