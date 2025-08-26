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

// Custom Dashboard Preview Section
const DashboardPreview: VFC = () => {
  return (
    <Panel color="blue" className="py-24 text-white">
      <Panel.Container>
        <div className="text-center mb-16">
          <H2 className="mb-6 text-white">
            See Your Mentorship Data Come to Life
          </H2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Our intuitive dashboards transform complex data into clear,
            actionable insights that drive program success.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 text-center">
            <div className="text-5xl font-bold text-white mb-4">92%</div>
            <p className="text-blue-100 font-semibold">Average Satisfaction</p>
            <p className="text-blue-200 text-sm mt-2">
              Track participant happiness in real-time
            </p>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 text-center">
            <div className="text-5xl font-bold text-white mb-4">3.2x</div>
            <p className="text-blue-100 font-semibold">Engagement Increase</p>
            <p className="text-blue-200 text-sm mt-2">
              When using data-driven insights
            </p>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 text-center">
            <div className="text-5xl font-bold text-white mb-4">85%</div>
            <p className="text-blue-100 font-semibold">Time Saved</p>
            <p className="text-blue-200 text-sm mt-2">
              On manual reporting and analysis
            </p>
          </div>
        </div>
      </Panel.Container>
    </Panel>
  )
}

const ReportingInsights: VFC = () => {
  return (
    <>
      <SEO
        title="Reporting & Engagement Insights - Real-Time Mentorship Analytics | Mentorly"
        description="Track mentorship engagement, measure impact, and uncover insights with AI-powered dashboards. Get real-time reporting that drives program success without spreadsheets or guesswork."
        image="/images/reporting-insights-og.png"
      />

      <LandingHero
        color="yellow"
        title="Real-Time Reporting That Drives Mentorship Success"
        subtitle="Track engagement, measure impact, and uncover insights with AI-powered dashboards."
        primaryCTA={{
          text: 'Request a Demo',
          href: 'https://mentorly.com/en/thank-you',
        }}
        secondaryCTA={{
          text: 'See Reporting in Action',
          href: '#reporting-features',
        }}
        image={{
          src: '/images/reporting-dashboard.png',
          alt: 'Reporting & Engagement Insights Dashboard',
        }}
        textColor="text-black"
      />

      <ContentSection>
        <InfoBlock
          badge={{
            text: 'Data-Driven Mentorship',
            icon: '📊',
            color: 'blue',
          }}
          title="Stop Guessing. Start Knowing."
          subtitle="Without data, mentorship programs struggle to scale or show ROI. Mentorly gives you everything you need to measure what matters most: adoption, participation, and how people feel."
          description="Designed for HR and L&D leaders who need to prove value and make decisions fast."
        />
      </ContentSection>

      <FeatureGrid
        id="reporting-features"
        title="Everything You Need to Measure Success"
        subtitle="Each feature is designed to give you actionable insights that help you optimize your mentorship program in real-time."
        features={[
          {
            icon: '📈',
            title: 'Program Overview',
            description:
              'A real-time snapshot of total activity across your program. See active participants, session counts, and engagement trends at a glance.',
            color: 'blue',
          },
          {
            icon: '🎯',
            title: 'Mentee Adoption Rate',
            description:
              'Instantly see how many mentees are actively connecting with mentors. Track adoption trends and identify engagement gaps early.',
            color: 'green',
          },
          {
            icon: '🌐',
            title: 'Mentor Distribution',
            description:
              'Understand how often mentors are engaged—and with whom. Balance workloads and ensure every mentor is utilized effectively.',
            color: 'yellow',
          },
          {
            icon: '🤖',
            title: 'AI-Powered Sentiment Review',
            description:
              'Automatically surface key themes and tone from participant feedback—positive, neutral, or negative. No manual analysis needed.',
            color: 'purple',
          },
        ]}
        columns={2}
        variant="bordered"
        backgroundColor="gray-50"
      />

      <HowItWorks
        title="Simple, Automated, Powerful"
        subtitle="Getting insights from your mentorship program has never been easier. Everything is automated and updated in real-time."
        steps={[
          {
            number: '01',
            title: 'Access Your Dashboard',
            description:
              'View data in your dashboard under the "Engagement" tab with one click.',
            icon: '🖥️',
          },
          {
            number: '02',
            title: 'Real-Time Updates',
            description:
              'No manual tracking or spreadsheets. Data flows automatically as your program runs.',
            icon: '⚡',
          },
          {
            number: '03',
            title: 'AI-Powered Insights',
            description:
              'AI processes feedback and activity data, turning it into easy-to-read reports.',
            icon: '🤖',
          },
        ]}
        variant="icon"
        backgroundColor="white"
      />

      <DashboardPreview />

      <FeatureGrid
        title="Transform Your Mentorship Program"
        subtitle="With real-time reporting and AI-powered insights, you can build a mentorship program that delivers measurable results."
        features={[
          {
            icon: '💰',
            title: 'Prove ROI Instantly',
            description:
              'Show leadership the value of your mentorship program with concrete data and measurable outcomes.',
          },
          {
            icon: '🚨',
            title: 'Identify Issues Early',
            description:
              'Spot engagement drops, mentor burnout, or matching problems before they impact your program.',
          },
          {
            icon: '⚡',
            title: 'Optimize in Real-Time',
            description:
              'Make data-driven decisions to improve mentor-mentee matches, session quality, and overall satisfaction.',
          },
          {
            icon: '📈',
            title: 'Scale with Confidence',
            description:
              'Grow your program knowing exactly what works and what needs improvement at every stage.',
          },
        ]}
        columns={4}
        backgroundColor="gray-50"
      />

      <LandingTestimonials
        title="Trusted by Leading Teams"
        subtitle="See how organizations are using Mentorly's reporting to drive mentorship success."
        testimonials={[
          {
            quote:
              'The reporting dashboard helped us increase program adoption by 40% in just two months. We finally had the data to make informed decisions.',
            author: 'Jennifer Martinez',
            role: 'VP of People Operations',
            company: 'TechForward Inc',
          },
          {
            quote:
              'Being able to see sentiment analysis in real-time transformed how we support our participants. Issues are addressed before they escalate.',
            author: 'David Chen',
            role: 'L&D Director',
            company: 'Global Solutions Corp',
          },
          {
            quote:
              'These insights helped us align mentorship with real learning needs—and get buy-in across leadership.',
            author: 'Sarah Thompson',
            role: 'DEI Program Manager',
            company: 'Innovation Labs',
          },
        ]}
        cardColor="yellow"
      />

      <LandingCTA
        title="Ready to Build a Data-Driven Mentorship Program?"
        subtitle="Join organizations that are transforming their mentorship programs with real-time insights and AI-powered analytics."
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
        backgroundColor="yellow"
      />
    </>
  )
}

export default ReportingInsights
