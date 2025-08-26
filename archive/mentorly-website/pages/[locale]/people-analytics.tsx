import { H2, H3 } from 'components/Headings'
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

// Custom Visual Examples Section
const VisualExamples: VFC = () => {
  const examples = [
    {
      title: 'Goals Analysis Dashboard',
      description:
        'Understand participant motivations with categorized goals and direct quotes',
      icon: '📊',
    },
    {
      title: 'Knowledge Gap Radar',
      description:
        'Visualize supply and demand mismatches to optimize your mentor pool',
      icon: '🎯',
    },
    {
      title: 'Skills Breakdown Chart',
      description:
        'See top skills across your program with role-based filtering',
      icon: '📈',
    },
  ]

  return (
    <Panel color="blue" className="py-24 text-white">
      <Panel.Container>
        <div className="text-center mb-16">
          <H2 className="mb-6 text-white">
            Visualize Your Program Like Never Before
          </H2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Our intuitive visualizations make complex data easy to understand
            and act upon.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {examples.map((example, index) => (
            <div
              key={index}
              className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg overflow-hidden"
            >
              <div className="aspect-w-16 aspect-h-9 bg-white bg-opacity-20">
                <div className="flex items-center justify-center h-48">
                  <span className="text-6xl">{example.icon}</span>
                </div>
              </div>
              <div className="p-6">
                <H3 className="mb-3 text-white text-xl">{example.title}</H3>
                <p className="text-blue-100">{example.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Panel.Container>
    </Panel>
  )
}

// Custom Feature Breakdown with expanded view
const AnalyticsFeatures: VFC = () => {
  const features = [
    {
      title: 'Goals Analysis',
      description:
        'See what mentees are actually working toward—confidence, leadership, career change, and more. Real quotes bring goals to life so you can design programming that resonates.',
      icon: '🎯',
      color: 'blue',
      highlights: [
        'Categorized goal insights',
        'Direct participant quotes',
        'Trend identification',
      ],
    },
    {
      title: 'Emerging Themes Analysis',
      description:
        'AI identifies recurring themes in mentorship sessions to give you a pulse on what matters most. Get strategic recommendations to respond to emerging trends.',
      icon: '📊',
      color: 'green',
      highlights: [
        'Pattern recognition',
        'Theme prioritization',
        'Actionable recommendations',
      ],
    },
    {
      title: 'Knowledge Gaps',
      description:
        "Visual dashboards show where mentee needs and mentor skills don't align. Use insights to improve training, mentor recruitment, and matching.",
      icon: '🔍',
      color: 'yellow',
      highlights: [
        'Gap Level Radar',
        'Demand vs. Supply Radar',
        'Gap Analysis Chart',
      ],
    },
    {
      title: 'Upskilling Recommendations',
      description:
        'Based on the data, get AI-suggested development areas like communication or problem-solving. Clear next steps to support mentee growth.',
      icon: '🚀',
      color: 'purple',
      highlights: [
        'Personalized recommendations',
        'Skill development paths',
        'Resource suggestions',
      ],
    },
    {
      title: 'People Skills Breakdown',
      description:
        'Get a full view of top skills across your program, filtered by mentor/mentee and industry context.',
      icon: '💡',
      color: 'blue',
      highlights: [
        'Skills inventory',
        'Role-based filtering',
        'Industry benchmarking',
      ],
    },
  ]

  return (
    <div id="analytics-features">
      <Panel color="gray-50" className="py-24">
        <Panel.Container>
          <div className="text-center mb-16">
            <H2 className="mb-6">Five Powerful Analytics Views</H2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Each view gives you a different lens into your mentorship program,
              helping you understand and optimize every aspect.
            </p>
          </div>
          <div className="space-y-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="md:flex">
                  <div
                    className="md:w-1/3 p-8 flex items-center justify-center"
                    style={{
                      backgroundColor:
                        feature.color === 'blue'
                          ? '#7582fb20'
                          : feature.color === 'green'
                          ? '#03c18e20'
                          : feature.color === 'yellow'
                          ? '#fddd3620'
                          : '#989DFF20',
                    }}
                  >
                    <div className="text-center">
                      <div className="text-6xl mb-4">{feature.icon}</div>
                      <H3 className="text-2xl">{feature.title}</H3>
                    </div>
                  </div>
                  <div className="md:w-2/3 p-8">
                    <p className="text-gray-600 mb-6 text-lg">
                      {feature.description}
                    </p>
                    <div className="grid md:grid-cols-3 gap-4">
                      {feature.highlights.map((highlight, idx) => (
                        <div
                          key={idx}
                          className="flex items-center text-sm text-gray-700"
                        >
                          <svg
                            className="w-5 h-5 mr-2 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            style={{
                              color:
                                feature.color === 'blue'
                                  ? '#7582fb'
                                  : feature.color === 'green'
                                  ? '#03c18e'
                                  : feature.color === 'yellow'
                                  ? '#fddd36'
                                  : '#989DFF',
                            }}
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {highlight}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel.Container>
      </Panel>
    </div>
  )
}

const PeopleAnalytics: VFC = () => {
  return (
    <>
      <SEO
        title="People Analytics - AI-Powered Mentorship Intelligence | Mentorly"
        description="Uncover goals, gaps, and growth patterns in your mentorship program with AI-powered People Analytics. Get actionable insights without surveys or manual tracking."
        image="/images/people-analytics-og.png"
      />

      <LandingHero
        color="purple"
        title="Mentorship Data That Actually Means Something"
        subtitle="With Mentorly Intelligence: People Analytics, uncover the goals, gaps, and growth patterns driving your program—from the inside out."
        primaryCTA={{
          text: 'Request a Demo',
          href: 'https://mentorly.com/en/thank-you',
        }}
        secondaryCTA={{
          text: 'See People Analytics in Action',
          href: '#analytics-features',
        }}
        image={{
          src: '/images/people-analytics-dashboard.png',
          alt: 'People Analytics Dashboard',
        }}
      />

      <ContentSection>
        <InfoBlock
          badge={{
            text: 'AI-Powered Intelligence',
            icon: '🧠',
            color: 'purple',
          }}
          title="From Data Chaos to Strategic Clarity"
          subtitle="Most mentorship programs operate in the dark. People Analytics brings clarity: what goals people are working toward, where they're struggling, and how to close the gap."
          description="Designed for HR, L&D, and DEI teams ready to level up their people strategy."
          gradient={{ from: '#f3e8ff', to: '#dbeafe' }}
        />
      </ContentSection>

      <AnalyticsFeatures />

      <HowItWorks
        title="Zero Extra Work. Maximum Insight."
        subtitle="People Analytics works seamlessly in the background, analyzing your existing program data to surface actionable insights."
        steps={[
          {
            number: '1',
            title: 'Automatic Data Collection',
            description:
              "Insights are automatically generated from your program's real data: profiles, session agendas, feedback, matching questions.",
            color: 'purple',
          },
          {
            number: '2',
            title: 'AI Analysis & Processing',
            description:
              'No additional surveys or manual tracking required. Our AI analyzes patterns and surfaces meaningful insights.',
            color: 'blue',
          },
          {
            number: '3',
            title: 'Actionable Dashboards',
            description:
              'AI organizes everything into digestible, actionable dashboards that help you make informed decisions.',
            color: 'green',
          },
        ]}
        bottomNote="The Result: You understand what's really happening in your program and can take action to improve it."
        backgroundColor="white"
      />

      <VisualExamples />

      <FeatureGrid
        title="Built for Every Team's Success"
        subtitle="People Analytics provides the insights each team needs to achieve their specific mentorship goals."
        features={[
          {
            icon: '👥',
            title: 'HR Teams',
            description:
              'Align mentorship with organizational goals • Identify skill gaps across departments • Measure program ROI with concrete data • Improve employee retention strategies',
          },
          {
            icon: '📚',
            title: 'L&D Teams',
            description:
              'Design targeted learning programs • Track skill development progress • Identify high-potential employees • Create data-driven development paths',
          },
          {
            icon: '🌈',
            title: 'DEI Teams',
            description:
              'Ensure equitable access to mentorship • Track diversity metrics and outcomes • Identify and address bias in matching • Support underrepresented groups effectively',
          },
        ]}
        columns={3}
        backgroundColor="gray-50"
      />

      <LandingTestimonials
        title="Leaders Love People Analytics"
        subtitle="See how organizations are using AI-powered insights to transform their mentorship programs."
        testimonials={[
          {
            quote:
              'People Analytics helped us align mentorship with real learning needs—and get buy-in across leadership. The insights are invaluable.',
            author: 'Rachel Kim',
            role: 'Chief Learning Officer',
            company: 'Fortune 500 Tech Company',
          },
          {
            quote:
              'We finally understand what our participants actually need. The AI-powered insights have transformed how we design our programs.',
            author: 'Marcus Johnson',
            role: 'VP of Talent Development',
            company: 'Global Healthcare Leader',
          },
          {
            quote:
              'The knowledge gap analysis alone saved us months of guesswork. We now recruit mentors strategically based on actual needs.',
            author: 'Priya Patel',
            role: 'DEI Program Director',
            company: 'Financial Services Firm',
          },
        ]}
        cardColor="purple"
      />

      <LandingCTA
        title="Ready to Build a Data-Driven Mentorship Program?"
        subtitle="Unlock the power of AI-driven insights to understand what's really happening in your program and make informed decisions that drive success."
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

export default PeopleAnalytics
