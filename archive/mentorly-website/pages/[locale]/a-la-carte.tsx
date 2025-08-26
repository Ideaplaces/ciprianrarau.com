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

// Custom component for Perfect For Programs section
const PerfectForPrograms: VFC = () => {
  const programTypes = [
    {
      icon: '🤝',
      title: 'Networking Programs',
      description:
        'Enable organic connections and relationship building across departments, seniority levels, and locations.',
      color: '#03c18e',
    },
    {
      icon: '📈',
      title: 'Professional Development',
      description:
        'Support individual career growth with mentor selection based on specific skills and experience areas.',
      color: '#989DFF',
    },
    {
      icon: '🚀',
      title: 'Entrepreneurship Programs',
      description:
        'Connect aspiring entrepreneurs with experienced business leaders and industry experts.',
      color: '#FDDE35',
    },
  ]

  return (
    <Panel color="gray-50" className="py-24">
      <Panel.Container>
        <div className="text-center mb-16">
          <H2 className="mb-6">Perfect for These Program Types</H2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            A La Carte Mentorship excels in programs where relationship
            building, networking, and self-directed development are key goals.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {programTypes.map((program, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl"
                style={{
                  backgroundColor: program.color + '20',
                  color: program.color === '#FDDE35' ? '#111' : program.color,
                }}
              >
                {program.icon}
              </div>
              <H3 className="mb-4 text-center">{program.title}</H3>
              <p className="text-gray-600 text-center">{program.description}</p>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h4 className="text-2xl font-bold mb-4">
                Why These Programs Love A La Carte
              </h4>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div
                    className="flex-shrink-0 w-6 h-6 rounded-full mt-1 mr-4"
                    style={{ backgroundColor: '#03c18e' }}
                  ></div>
                  <p className="text-gray-600">
                    <strong>Socialization Focus:</strong> Builds
                    cross-functional relationships and networks naturally
                  </p>
                </div>
                <div className="flex items-start">
                  <div
                    className="flex-shrink-0 w-6 h-6 rounded-full mt-1 mr-4"
                    style={{ backgroundColor: '#03c18e' }}
                  ></div>
                  <p className="text-gray-600">
                    <strong>Individual Agency:</strong> Participants feel
                    empowered to drive their own development
                  </p>
                </div>
                <div className="flex items-start">
                  <div
                    className="flex-shrink-0 w-6 h-6 rounded-full mt-1 mr-4"
                    style={{ backgroundColor: '#03c18e' }}
                  ></div>
                  <p className="text-gray-600">
                    <strong>Diverse Connections:</strong> Creates opportunities
                    for unexpected, valuable relationships
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-8 text-center">
              <div
                className="text-5xl font-bold mb-4"
                style={{ color: '#03c18e' }}
              >
                3x
              </div>
              <p className="text-xl font-semibold mb-2">More Connections</p>
              <p className="text-gray-600">
                Programs using A La Carte see 3x more cross-departmental
                connections compared to traditional matching.
              </p>
            </div>
          </div>
        </div>
      </Panel.Container>
    </Panel>
  )
}

const ALaCarte: VFC = () => {
  return (
    <>
      <SEO
        title="A La Carte Mentorship - Employee-Driven Mentor Selection | Mentorly"
        description="Empower employees to choose their own mentors with Mentorly's A La Carte Mentorship. Boost engagement with flexible, self-directed professional development."
        image="/images/a-la-carte-og.png"
      />

      <LandingHero
        color="green"
        title="Empower Employees to Choose Their Own Mentors"
        subtitle="Give your team the autonomy they crave. With A La Carte Mentorship, employees browse, filter, and connect with mentors that align perfectly with their goals and aspirations."
        primaryCTA={{
          text: 'Request a Demo',
          href: 'https://mentorly.com/en/thank-you',
        }}
        secondaryCTA={{
          text: 'See How It Works',
          href: '#how-it-works',
        }}
        image={{
          src: '/images/a-la-carte.png',
          alt: 'A La Carte Mentorship - Browse and Choose Mentors',
        }}
        badge={{
          text: 'One of Two Mentorship Styles',
          icon: '💡',
        }}
      />

      <ContentSection>
        <InfoBlock
          badge={{
            text: 'Two Mentorship Approaches',
            icon: '📚',
            color: 'yellow',
          }}
          title="Choose Your Mentorship Style"
          gradient={{ from: '#eff6ff', to: '#dcfce7' }}
        />
        <div className="max-w-5xl mx-auto mt-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-8 border-2 border-blue-200">
              <h4 className="text-2xl font-bold text-blue-600 mb-4">
                Smart Matching
              </h4>
              <p className="text-gray-600 mb-4">
                AI-powered algorithm creates optimal mentor-mentee pairings
                based on compatibility, goals, and preferences. Perfect for
                structured programs.
              </p>
              <div className="text-blue-500 font-semibold">
                → Automated & Optimized
              </div>
            </div>
            <div
              className="bg-white rounded-lg p-8 border-2"
              style={{ borderColor: '#03c18e' }}
            >
              <h4
                className="text-2xl font-bold mb-4"
                style={{ color: '#03c18e' }}
              >
                A La Carte Mentorship
              </h4>
              <p className="text-gray-600 mb-4">
                Employees browse and choose their own mentors from a curated
                directory. Ideal for networking and self-directed development.
              </p>
              <div className="font-semibold" style={{ color: '#03c18e' }}>
                → Employee-Driven & Flexible
              </div>
            </div>
          </div>
          <p className="text-gray-600 max-w-3xl mx-auto text-center mt-8">
            Both approaches can work together in the same program, giving you
            maximum flexibility to meet diverse employee needs and program
            goals.
          </p>
        </div>
      </ContentSection>

      <FeatureGrid
        title="Why A La Carte Mentorship Works"
        subtitle="When employees have the freedom to choose, they're more invested in the relationship. This leads to higher engagement and better outcomes for everyone."
        features={[
          {
            icon: '🎯',
            title: 'Employee Autonomy',
            description:
              'Employees browse and select mentors that align with their specific goals, ensuring meaningful connections from day one.',
          },
          {
            icon: '🔄',
            title: 'Ultimate Flexibility',
            description:
              'Fits every career path and development style. No rigid structures—just personalized mentorship that adapts to individual needs.',
          },
          {
            icon: '📈',
            title: 'Increased Engagement',
            description:
              'When employees choose their mentors, participation rates soar. Experience higher satisfaction and program completion.',
          },
          {
            icon: '⚡',
            title: 'No Admin Overload',
            description:
              'Scales effortlessly with minimal manual work. Automated matching requests and intelligent suggestions reduce admin burden.',
          },
        ]}
        columns={4}
        variant="bordered"
        backgroundColor="white"
      />

      <HowItWorks
        id="how-it-works"
        title="How A La Carte Mentorship Works"
        subtitle="A simple 3-step process that puts employees in the driver's seat of their professional development."
        steps={[
          {
            number: '01',
            title: 'Browse Mentor Directory',
            description:
              'Employees explore a curated directory of mentors with detailed profiles, expertise areas, and availability.',
            color: 'blue',
          },
          {
            number: '02',
            title: 'Filter by Needs',
            description:
              'Smart filters help employees find mentors by skills, department, goals, location, or any custom criteria.',
            color: 'yellow',
          },
          {
            number: '03',
            title: 'Request & Connect',
            description:
              'One-click mentor requests with optional introduction messages. Mentors accept based on their capacity.',
            color: 'green',
          },
        ]}
        bottomNote="For HR Teams: Maintain control with mentor capacity limits, and program guidelines while giving employees the freedom they want."
      />

      <PerfectForPrograms />

      <LandingTestimonials
        title="Trusted by Leading Organizations"
        subtitle="See how A La Carte Mentorship is driving engagement and learning outcomes."
        testimonials={[
          {
            quote:
              'A La Carte mentorship transformed our program. Engagement went from 40% to 85% in just three months.',
            author: 'Sarah Chen',
            role: 'VP of People, TechCorp',
          },
          {
            quote:
              "Our employees love the freedom to choose. It's led to more meaningful connections and better outcomes.",
            author: 'Michael Roberts',
            role: 'L&D Director, Global Finance Inc',
          },
          {
            quote:
              "The admin burden decreased significantly while employee satisfaction soared. It's a win-win.",
            author: 'Lisa Martinez',
            role: 'HR Manager, Healthcare Plus',
          },
        ]}
      />

      <LandingCTA
        title="Ready to Give Your Employees the Freedom They Deserve?"
        subtitle="Join forward-thinking organizations using A La Carte Mentorship to boost engagement, satisfaction, and professional development outcomes."
        buttons={[
          {
            text: 'Request a Demo',
            href: 'https://mentorly.com/en/thank-you',
          },
          {
            text: 'Get Started',
            href: '/pricing',
            variant: 'secondary',
          },
        ]}
        backgroundColor="green"
      />
    </>
  )
}

export default ALaCarte
