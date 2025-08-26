import { H2 } from 'components/Headings'
import {
  FeatureGrid,
  HowItWorks,
  LandingCTA,
  LandingHero,
} from 'components/landing'
import { Panel } from 'components/Panel'
import { SEO } from 'components/SEO/SEO'
import { VFC } from 'react'

// Visual Dashboard Section (custom component for this page)
const VisualDashboard: VFC = () => {
  return (
    <Panel color="green" className="py-36 text-white mt-24">
      <Panel.Container>
        <div className="md:flex items-center gap-12">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <H2 className="mb-6 text-white">
              See Your Program&apos;s Pulse at a Glance
            </H2>
            <p className="text-xl text-green-100 mb-8">
              Our intuitive dashboard transforms feedback into actionable
              insights, helping you understand participant satisfaction and
              program effectiveness instantly.
            </p>
            <div className="space-y-4">
              {[
                {
                  icon: '📊',
                  title: 'Average Rating View',
                  description: 'Track overall satisfaction trends',
                },
                {
                  icon: '🔍',
                  title: 'Filters and Sorting Tools',
                  description: 'Find specific feedback instantly',
                },
                {
                  icon: '🤖',
                  title: 'Integrated Sentiment Analysis',
                  description: 'Understand the emotion behind ratings',
                },
              ].map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                    <span className="text-2xl">{item.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{item.title}</h4>
                    <p className="text-green-100">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8">
              <div className="bg-white bg-opacity-20 rounded-lg p-6 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-white font-semibold">
                    Average Satisfaction
                  </h4>
                  <span className="text-3xl font-bold text-white">4.7/5</span>
                </div>
                <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
                  <div
                    className="bg-white rounded-full h-3"
                    style={{ width: '94%' }}
                  ></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-white">342</div>
                  <p className="text-green-100 text-sm">Total Reviews</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-white">89%</div>
                  <p className="text-green-100 text-sm">Response Rate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Panel.Container>
    </Panel>
  )
}

const RatingsReviews: VFC = () => {
  return (
    <>
      <SEO
        title="Ratings & Reviews - Real-Time Mentorship Feedback | Mentorly"
        description="Capture authentic feedback after every mentorship session. Understand what's working, measure satisfaction, and improve your program with real-time insights."
        image="/images/ratings-reviews-og.png"
      />

      <LandingHero
        color="green"
        title="Capture What Really Matters—Every Session, Every Time"
        subtitle="Mentorly's Ratings & Reviews helps you understand what's working and what's not—without disrupting the flow."
        primaryCTA={{
          text: 'Request a Demo',
          href: 'https://mentorly.com/en/thank-you',
        }}
        secondaryCTA={{
          text: 'See It In Action',
          href: '#how-it-works',
        }}
        image={{
          src: '/images/ratings-reviews-dashboard.png',
          alt: 'Ratings & Reviews Dashboard',
        }}
      />

      <FeatureGrid
        title="Why Feedback is Your Secret Weapon"
        subtitle="Every mentorship session is an opportunity to learn and improve. Capture that knowledge effortlessly."
        features={[
          {
            icon: '💡',
            title: 'Real-Time Program Health',
            description:
              'Authentic feedback helps program managers improve mentor/mentee experiences in real time.',
          },
          {
            icon: '📊',
            title: 'Build Credibility',
            description:
              'A high satisfaction rating reflects strong program value—and builds credibility across your org.',
          },
          {
            icon: '🎯',
            title: 'Data-Driven Decisions',
            description:
              'Real feedback → smarter decisions → more successful mentorship outcomes.',
          },
        ]}
        columns={3}
        variant="bordered"
        backgroundColor="white"
      />

      <HowItWorks
        id="how-it-works"
        title="Seamless Feedback Collection"
        subtitle="Our intelligent system captures feedback at the perfect moment, ensuring high response rates and authentic insights."
        steps={[
          {
            icon: '📅',
            title: 'After Every Session',
            description:
              'At the end of every session, mentors and mentees are prompted to rate and review their experience.',
            details: 'Works for all session types',
          },
          {
            icon: '🔒',
            title: 'Safe & Private',
            description:
              'Feedback is only visible to program managers, keeping it safe and honest.',
            details: 'Encourages authentic responses',
          },
          {
            icon: '🌍',
            title: 'Works Everywhere',
            description:
              'Participants can leave reviews regardless of where the session occurred—Mentorly, Zoom, Google Meet, in-person—if their calendar is synced.',
            details: 'Universal feedback collection',
          },
        ]}
        variant="icon"
      />

      <FeatureGrid
        title="Powerful Features, Simple Interface"
        subtitle="Everything you need to capture, analyze, and act on participant feedback—all in one place."
        features={[
          {
            icon: '📊',
            title: 'Overview Dashboard',
            description:
              'See total reviews and average satisfaction score at a glance. Track trends over time and spot patterns instantly.',
            highlights: [
              'Real-time satisfaction metrics',
              'Trend visualization',
              'Quick health checks',
            ],
          },
          {
            icon: '🔍',
            title: 'Smart Filters',
            description:
              'Sort reviews by rating, user name/email, keywords, or date. Find exactly what you need in seconds.',
            highlights: [
              'Multi-criteria filtering',
              'Keyword search',
              'Date range selection',
            ],
          },
          {
            icon: '🤖',
            title: 'AI Sentiment Analysis',
            description:
              'Integrated with AI Sentiment Analysis in the Intelligence tab. Understand the emotion behind the ratings.',
            highlights: [
              'Automatic tone detection',
              'Theme identification',
              'Actionable insights',
            ],
          },
          {
            icon: '📈',
            title: 'Impact Measurement',
            description:
              'Helps measure connection quality, guide program improvements, and validate ROI with concrete data.',
            highlights: [
              'Connection quality metrics',
              'Program optimization data',
              'ROI validation',
            ],
          },
        ]}
        variant="detailed"
        columns={2}
        backgroundColor="white"
      />

      <VisualDashboard />

      <FeatureGrid
        title="Built for Every Team's Success"
        subtitle="Ratings & Reviews provides the insights each team needs to build better mentorship experiences."
        features={[
          {
            icon: '👔',
            title: 'For Program Managers',
            description:
              'Track program health in real-time • Identify and address issues quickly • Make data-driven improvements • Demonstrate program value to leadership',
          },
          {
            icon: '💼',
            title: 'For HR Leaders',
            description:
              'Measure employee satisfaction • Improve retention through better mentorship • Validate program ROI with metrics • Scale successful initiatives',
          },
          {
            icon: '📚',
            title: 'For L&D Teams',
            description:
              'Understand learning effectiveness • Optimize mentor-mentee matches • Track skill development progress • Create targeted interventions',
          },
        ]}
        columns={3}
        backgroundColor="gray-50"
      />

      <LandingCTA
        title="Ready to Capture Every Conversation's Impact?"
        subtitle="Join forward-thinking organizations using real-time feedback to build better mentorship programs and drive meaningful connections."
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

export default RatingsReviews
