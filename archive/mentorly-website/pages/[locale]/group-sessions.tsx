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

// Custom component for session types comparison
const SessionTypesComparison: VFC = () => {
  return (
    <Panel color="blue" className="py-24 text-white">
      <Panel.Container>
        <div className="text-center mb-16">
          <H2 className="mb-6 text-white">
            Two Powerful Formats for Group Learning
          </H2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Choose the right format for your learning objectives—from open
            knowledge sharing to focused cohort discussions.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg overflow-hidden">
            <div className="bg-green-500 bg-opacity-30 p-6">
              <h3 className="text-2xl font-bold text-white mb-2">
                🎓 Masterclasses
              </h3>
              <p className="text-green-100">Open Learning at Scale</p>
            </div>
            <div className="p-8">
              <ul className="space-y-4 text-blue-100">
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-400 mr-3 mt-1 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Open to all program participants</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-400 mr-3 mt-1 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Dedicated landing page for each session</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-400 mr-3 mt-1 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Featured on mentor profiles</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-400 mr-3 mt-1 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Easy RSVP and calendar integration</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-400 mr-3 mt-1 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Perfect for thought leadership</span>
                </li>
              </ul>
              <div className="mt-8 bg-white bg-opacity-10 rounded-lg p-4">
                <p className="text-green-300 font-semibold mb-1">Best for:</p>
                <p className="text-blue-100 text-sm">
                  Company-wide learnings, expert presentations, skill workshops
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg overflow-hidden">
            <div className="bg-purple-500 bg-opacity-30 p-6">
              <h3 className="text-2xl font-bold text-white mb-2">
                👥 Group Sessions
              </h3>
              <p className="text-purple-100">Focused, Intimate Learning</p>
            </div>
            <div className="p-8">
              <ul className="space-y-4 text-blue-100">
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-purple-400 mr-3 mt-1 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Private, invitation-only format</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-purple-400 mr-3 mt-1 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Ideal for cohort-specific topics</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-purple-400 mr-3 mt-1 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Deeper, more targeted discussions</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-purple-400 mr-3 mt-1 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Safe space for sensitive topics</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-purple-400 mr-3 mt-1 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Breakout room support</span>
                </li>
              </ul>
              <div className="mt-8 bg-white bg-opacity-10 rounded-lg p-4">
                <p className="text-purple-300 font-semibold mb-1">Best for:</p>
                <p className="text-blue-100 text-sm">
                  Leadership circles, peer coaching, department-specific needs
                </p>
              </div>
            </div>
          </div>
        </div>
      </Panel.Container>
    </Panel>
  )
}

const GroupSessions: VFC = () => {
  return (
    <>
      <SEO
        title="Group Sessions & Masterclasses - Scale Mentorship Beyond 1:1 | Mentorly"
        description="Host masterclasses and group sessions within Mentorly. Scale mentorship from 1:1 to many-to-many learning. No extra tools needed."
        image="/images/group-sessions-og.png"
      />

      <LandingHero
        color="blue"
        title="Group Mentorship Made Effortless"
        subtitle="Host masterclasses or small group sessions—all within Mentorly. No extra tools. No extra work."
        primaryCTA={{
          text: 'Request a Demo',
          href: 'https://mentorly.com/en/thank-you',
        }}
        secondaryCTA={{
          text: 'See Group Sessions in Action',
          href: '#session-types',
        }}
        image={{
          src: '/images/group-sessions-dashboard.png',
          alt: 'Group Sessions Dashboard',
        }}
      />

      <ContentSection>
        <InfoBlock
          badge={{
            text: 'Scale Your Impact',
            icon: '🚀',
            color: 'blue',
          }}
          title="Why Group Learning Matters"
          subtitle="Not every mentorship need fits in a 1:1. Group learning builds community, shares diverse perspectives, and maximizes mentor reach."
          description="Programs with group sessions report higher engagement, more touchpoints, and stronger outcomes."
          gradient={{ from: '#dbeafe', to: '#e0e7ff' }}
        />
      </ContentSection>

      <SessionTypesComparison />

      <FeatureGrid
        title="Everything You Need, Nothing You Don't"
        subtitle="All the tools to run successful group sessions, integrated seamlessly into your mentorship platform."
        features={[
          {
            icon: '📅',
            title: 'Integrated Scheduling',
            description:
              'All scheduling, invites, and reminders happen within Mentorly. No juggling external calendar tools or sending manual invites.',
          },
          {
            icon: '🎥',
            title: 'Built-In Video Platform',
            description:
              'Host sessions directly in Mentorly with our video platform, complete with breakout rooms for small group discussions.',
          },
          {
            icon: '💬',
            title: 'Automatic Follow-Up',
            description:
              'Post-session group chats open automatically, keeping the conversation going and building community connections.',
          },
          {
            icon: '📊',
            title: 'Session Analytics',
            description:
              'Track attendance, engagement, and feedback for every session. Understand what topics resonate most with your participants.',
          },
        ]}
        columns={2}
        variant="bordered"
        backgroundColor="white"
      />

      <HowItWorks
        id="how-it-works"
        title="From Creation to Connection"
        subtitle="Setting up group learning experiences has never been easier. Our streamlined process gets you from idea to impact in minutes."
        steps={[
          {
            number: '01',
            title: 'Create Your Session',
            description:
              'Mentors create masterclasses or group sessions with a few clicks. Set topic, time, and capacity.',
            icon: '✨',
          },
          {
            number: '02',
            title: 'Participants Discover & Join',
            description:
              'Sessions appear on mentor profiles and in the platform. Participants RSVP with one click.',
            icon: '🔍',
          },
          {
            number: '03',
            title: 'Automated Management',
            description:
              'Mentorly handles invites, reminders, and video links. Everything syncs to participant calendars.',
            icon: '⚡',
          },
          {
            number: '04',
            title: 'Continuous Engagement',
            description:
              'Post-session chats and resources keep learning alive. Track impact through built-in analytics.',
            icon: '📈',
          },
        ]}
        variant="icon"
        backgroundColor="gray-50"
      />

      <FeatureGrid
        title="Designed for Different Learning Needs"
        subtitle="Whether you're running skill workshops, leadership circles, or peer coaching groups, we've got you covered."
        features={[
          {
            icon: '🎯',
            title: 'Skill Development Workshops',
            description:
              'Perfect for teaching specific competencies like presentation skills, data analysis, or project management to larger groups.',
            color: 'blue',
          },
          {
            icon: '👔',
            title: 'Leadership Circles',
            description:
              'Create intimate spaces for emerging leaders to discuss challenges, share experiences, and learn from senior mentors.',
            color: 'purple',
          },
          {
            icon: '🤝',
            title: 'Peer Coaching Groups',
            description:
              'Enable participants at similar levels to support each other through facilitated group discussions and shared learning.',
            color: 'green',
          },
          {
            icon: '🌟',
            title: 'Expert Spotlights',
            description:
              'Showcase internal or external experts through masterclasses that inspire and educate your entire program.',
            color: 'yellow',
          },
          {
            icon: '🌍',
            title: 'Cross-Team Collaboration',
            description:
              'Break down silos by bringing together participants from different departments or locations for shared learning.',
            color: 'blue',
          },
          {
            icon: '📚',
            title: 'Onboarding Cohorts',
            description:
              'Accelerate new employee integration through structured group sessions that complement 1:1 mentoring.',
            color: 'green',
          },
        ]}
        variant="shadowed"
        columns={3}
      />

      <LandingTestimonials
        title="Transforming Mentorship at Scale"
        subtitle="See how organizations are using group sessions to amplify their mentorship impact."
        testimonials={[
          {
            quote:
              "We used to run our mentorship and group sessions separately—now it's all under one roof, and adoption has skyrocketed.",
            author: 'Amanda Foster',
            role: 'Director of L&D',
            company: 'Tech Innovators Inc',
          },
          {
            quote:
              'Masterclasses gave our senior leaders a scalable way to share expertise. We&apos;re reaching 10x more employees with the same effort.',
            author: 'James Rodriguez',
            role: 'VP of Talent',
            company: 'Global Solutions Corp',
          },
          {
            quote:
              'The automatic group chats after sessions have created mini-communities within our program. The peer learning is incredible.',
            author: 'Priya Sharma',
            role: 'HR Manager',
            company: 'Innovation Labs',
          },
        ]}
        cardColor="blue"
      />

      <LandingCTA
        title="Ready to Scale Mentorship Through Group Learning?"
        subtitle="Join forward-thinking organizations using Mentorly to create rich, multi-dimensional mentorship experiences that drive real results."
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

export default GroupSessions
