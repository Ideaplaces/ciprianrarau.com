import { H2, H3 } from 'components/Headings'
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
import { ViewportVideo } from 'components/ViewportVideo'
import { VFC } from 'react'

// Custom component for Perfect for Teams section
const PerfectForTeams: VFC = () => {
  const teams = [
    {
      icon: '👥',
      title: 'HR Teams',
      items: [
        'Reduce employee turnover through better connections',
        'Scale mentorship without administrative burden',
        'Improve employee satisfaction and engagement',
        'Track program ROI with detailed analytics',
      ],
    },
    {
      icon: '📚',
      title: 'L&D Teams',
      items: [
        'Accelerate skill development through targeted matches',
        'Create learning paths that stick and deliver results',
        'Identify high-potential employees for development',
        'Measure knowledge transfer effectiveness',
      ],
    },
    {
      icon: '🌈',
      title: 'DEI Teams',
      items: [
        'Create inclusive matches across all demographics',
        'Support underrepresented groups with targeted mentorship',
        'Build bridges between different organizational levels',
        'Track diversity metrics and program impact',
      ],
    },
  ]

  return (
    <Panel color="purple" className="pt-24 text-white">
      <Panel.Container>
        <div className="text-center mb-16">
          <H2 className="mb-6 text-white">
            Perfect for HR, L&D, and DEI Teams
          </H2>
          <p className="text-xl text-purple-100 max-w-4xl mx-auto">
            Smart Matching is designed to support the unique needs of different
            teams running mentorship programs across your organization.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {teams.map((team, index) => (
            <div
              key={index}
              className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-8"
            >
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">{team.icon}</span>
              </div>
              <H3 className="mb-4 text-white text-center">{team.title}</H3>
              <ul className="text-purple-100 space-y-2 text-left">
                {team.items.map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Panel.Container>
    </Panel>
  )
}

// Custom component for Customization Options section
const CustomizationOptions: VFC = () => {
  return (
    <Panel color="gray" className="pt-24">
      <Panel.Container>
        <div className="text-center mb-16">
          <H2 className="mb-6">Fully Customizable to Your Organization</H2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Smart Matching adapts to your unique organizational structure,
            culture, and matching requirements. No one-size-fits-all solutions
            here.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-bold mb-6 text-gray-900">
              Flexible Matching Rules
            </h3>
            <div className="space-y-4">
              {[
                {
                  title: 'Custom Survey Questions',
                  description:
                    "Design surveys that capture what matters most for your organization's mentorship success.",
                },
                {
                  title: 'Weighted Scoring',
                  description:
                    "Prioritize certain matching criteria based on your program's specific goals and requirements.",
                },
                {
                  title: 'Approval Workflows',
                  description:
                    'Review and approve matches before they go live, with full transparency into match reasoning.',
                },
                {
                  title: 'Continuous Optimization',
                  description:
                    "Track match success rates and continuously refine the algorithm based on your program's outcomes.",
                },
              ].map((item, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-4 mt-1">
                    <svg
                      className="w-4 h-4 text-white"
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
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {item.title}
                    </h4>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg">
              <ViewportVideo
                src="/images/program-design-matching-video.mp4"
                className="w-full h-80"
              />
            </div>
          </div>
        </div>
      </Panel.Container>
    </Panel>
  )
}

// Algorithm Explanation Section
const AlgorithmExplanation: VFC = () => {
  const techniques = [
    {
      icon: '📊',
      title: 'Weighted Scoring',
      description:
        'Assigns importance levels to different compatibility factors based on your program goals.',
    },
    {
      icon: '⚡',
      title: 'Similarity Analysis',
      description:
        'Uses TF-IDF algorithms to find semantic similarities in text responses and interests.',
    },
    {
      icon: '❓',
      title: 'Stable Matching',
      description:
        'Implements Gale-Shapley algorithms to create optimal pairings that maximize mutual satisfaction.',
    },
    {
      icon: '🔄',
      title: 'Learning Loop',
      description:
        'Continuously improves based on feedback and successful match patterns in your organization.',
    },
  ]

  return (
    <Panel color="blue" className="pt-32 text-white">
      <Panel.Container>
        <div className="text-center mb-16">
          <H2 className="mb-6 text-white">The Science Behind Smart Matching</H2>
          <p className="text-xl text-blue-100 max-w-4xl mx-auto">
            Our proprietary algorithm combines multiple proven matching
            techniques to create pairings that work in the real world.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {techniques.map((technique, index) => (
            <div
              key={index}
              className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 text-center"
            >
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">{technique.icon}</span>
              </div>
              <h4 className="font-bold text-white mb-2">{technique.title}</h4>
              <p className="text-blue-100 text-sm">{technique.description}</p>
            </div>
          ))}
        </div>
      </Panel.Container>
    </Panel>
  )
}

const SmartMatchingPage: VFC = () => {
  return (
    <>
      <SEO
        title="Smart Matching - AI-Powered Mentor-Mentee Pairing | Mentorly"
        description="Transform your mentorship program with AI-powered Smart Matching. Our proprietary algorithm creates high-quality mentor-mentee pairings that drive real results and save 90% of admin time."
      />

      <LandingHero
        color="blue"
        title="AI-Powered Smart Matching That Actually Works"
        subtitle="Stop playing guessing games with mentor-mentee pairings. Our proprietary algorithm uses survey data, preferences, and goals to create matches that drive real results."
        primaryCTA={{
          text: 'See Smart Matching in Action',
          href: 'https://mentorly.com/en/thank-you',
        }}
        secondaryCTA={{
          text: 'Request a Demo',
          href: '/product',
        }}
        image={{
          src: '/images/matching.gif',
          alt: 'Smart Matching Algorithm in Action',
        }}
      />

      <ContentSection>
        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <InfoBlock
            badge={{
              text: 'The Problem',
              icon: '⚠️',
              color: 'red',
            }}
            title="Most Mentorship Programs Struggle with Poor Matching"
            subtitle="Manual matching is time-consuming, subjective, and often leads to mismatched pairs who don't connect, don't meet, and don't achieve program goals."
            gradient={{ from: '#fef2f2', to: '#fed7aa' }}
          />
          <InfoBlock
            badge={{
              text: 'The Solution',
              icon: '✨',
              color: 'green',
            }}
            title="AI-Powered Smart Matching That Actually Works"
            subtitle="Our proprietary algorithm analyzes personality, goals, experience, location, and preferences to create matches that stick, meet regularly, and achieve real outcomes."
            cta={{
              text: 'See Smart Matching in Action',
              href: 'https://mentorly.com/en/thank-you',
            }}
            gradient={{ from: '#dcfce7', to: '#dbeafe' }}
          />
        </div>
      </ContentSection>

      <FeatureGrid
        title="Why Smart Matching Outperforms Manual Matching"
        subtitle="Our algorithm doesn't guess—it analyzes dozens of data points to create matches that lead to meaningful, long-lasting mentorship relationships."
        features={[
          {
            icon: '💡',
            title: 'Science-Based Algorithm',
            description:
              'Uses validated psychological frameworks and machine learning to identify compatibility patterns that predict successful mentorship outcomes.',
          },
          {
            icon: '📈',
            title: 'Data-Driven Precision',
            description:
              'Analyzes survey responses, career goals, personality traits, experience levels, and preferences to eliminate guesswork from the matching process.',
          },
          {
            icon: '⏱️',
            title: 'Dramatically Reduces Admin Time',
            description:
              'What used to take weeks of manual review and matching now happens in minutes, freeing up your team to focus on program success instead of logistics.',
          },
        ]}
        columns={3}
        backgroundColor="white"
      />

      <HowItWorks
        title="How Smart Matching Works"
        subtitle="Our proprietary algorithm uses multiple data points and advanced matching techniques to create pairs that have the highest probability of success."
        steps={[
          {
            number: '1',
            title: 'Data Collection',
            description:
              'Participants complete comprehensive surveys covering goals, preferences, experience, personality traits, and availability.',
            color: 'purple',
          },
          {
            number: '2',
            title: 'Algorithm Analysis',
            description:
              'Our AI analyzes compatibility across multiple dimensions using weighted scoring, similarity matching, and stable pairing algorithms.',
            color: 'blue',
          },
          {
            number: '3',
            title: 'Smart Recommendations',
            description:
              'The system generates ranked match suggestions with compatibility scores and reasoning, giving you confidence in each pairing.',
            color: 'green',
          },
          {
            number: '4',
            title: 'Continuous Learning',
            description:
              'The algorithm learns from successful matches and feedback to continuously improve match quality for your organization.',
            color: 'black',
          },
        ]}
      />

      <FeatureGrid
        title="What Smart Matching Analyzes"
        subtitle="Our algorithm considers dozens of compatibility factors to ensure each match has the highest probability of success and mutual benefit."
        features={[
          {
            title: 'Career Goals & Interests',
            description:
              'Matches people with complementary career aspirations, shared interests, and aligned professional development goals.',
            icon: '🎯',
            color: 'blue',
          },
          {
            title: 'Skills & Experience',
            description:
              'Pairs mentees with mentors who have relevant expertise while ensuring appropriate experience level gaps for effective knowledge transfer.',
            icon: '💼',
            color: 'green',
          },
          {
            title: 'Communication Styles',
            description:
              'Considers personality types, communication preferences, and working styles to create pairs that naturally connect and collaborate.',
            icon: '💬',
            color: 'blue',
          },
          {
            title: 'Location & Availability',
            description:
              'Factors in time zones, geographical preferences, and schedule compatibility to enable regular, convenient meetings.',
            icon: '🌍',
            color: 'green',
          },
          {
            title: 'Department & Role',
            description:
              'Understands organizational structures and career paths to create matches that provide relevant, actionable career guidance.',
            icon: '🏢',
            color: 'blue',
          },
          {
            title: 'Custom Criteria',
            description:
              "Adapts to your organization's unique matching requirements through customizable survey questions and matching rules.",
            icon: '⚙️',
            color: 'green',
          },
        ]}
        variant="shadowed"
        columns={3}
        backgroundColor="white"
      />

      <PerfectForTeams />

      <CustomizationOptions />

      <StatsBlock
        title="Proven Results That Matter to Your Bottom Line"
        subtitle="Organizations using Smart Matching see measurable improvements in program success rates, participant satisfaction, and ROI."
        stats={[
          {
            value: '✓',
            label: 'High-Quality Matches',
            description: 'using proven algorithms',
          },
          {
            value: '⚡',
            label: 'Dramatically Faster',
            description: 'than manual matching',
          },
          {
            value: '📈',
            label: 'Better Engagement',
            description: 'through compatibility scoring',
          },
          {
            value: '🎯',
            label: 'Goal-Focused Pairs',
            description: 'aligned for success',
          },
        ]}
        backgroundColor="green"
      />

      <AlgorithmExplanation />

      <LandingTestimonials
        title="What Smart Matching Users Say"
        subtitle="HR, L&D, and DEI leaders are seeing transformative results with our AI-powered matching system."
        testimonials={[
          {
            quote:
              'Smart Matching eliminated the guesswork from our mentorship program. We went from 60% successful matches to 95% in just one quarter.',
            author: 'Sarah Johnson',
            role: 'VP of People, TechFlow',
          },
          {
            quote:
              "The algorithm understands our organization better than we do. It consistently creates matches that just 'click' and drive real career growth.",
            author: 'Marcus Chen',
            role: 'L&D Director, Global Dynamics',
          },
          {
            quote:
              'Smart Matching helped us create more diverse, inclusive pairings while maintaining high compatibility. Our program participation doubled.',
            author: 'Raj Patel',
            role: 'DEI Manager, Innovation Labs',
          },
        ]}
      />

      <LandingCTA
        title="Ready to Transform Your Mentorship Program?"
        subtitle="Join innovative organizations who have revolutionized their mentorship outcomes with Smart Matching. Stop settling for hit-or-miss pairings and start seeing real results."
        buttons={[
          {
            text: 'See Smart Matching in Action',
            href: 'https://mentorly.com/en/thank-you',
          },
          {
            text: 'Request a Demo',
            href: '/pricing',
            variant: 'secondary',
          },
          {
            text: 'Get Started',
            href: '/product',
            variant: 'outline',
          },
        ]}
        backgroundColor="yellow"
        bottomText="✓ AI-Powered Matching ✓ Proven Algorithms ✓ No Setup Fees"
      />
    </>
  )
}

export default SmartMatchingPage
