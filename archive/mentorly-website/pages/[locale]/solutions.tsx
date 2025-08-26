import { SEO } from 'components/SEO/SEO'
import { StringParam, useQueryParam } from 'lib/next-query-params'
import Link from 'next/link'
import { VFC } from 'react'

const sectionContent = {
  engagement: {
    title: 'Employee Engagement and Retention',
    description: 'Boost employee satisfaction and reduce turnover',
    content:
      'Create meaningful connections that keep your top talent engaged and committed to your organization.',
    category: 'corporate',
  },
  leadership: {
    title: 'Leadership Development',
    description: 'Cultivate future leaders within your organization',
    content:
      'Develop your next generation of leaders through structured mentorship and guidance programs.',
    category: 'corporate',
  },
  career: {
    title: 'Career Development',
    description: 'Accelerate career growth for your employees',
    content:
      'Provide clear pathways for career advancement through expert mentorship and skill development.',
    category: 'corporate',
  },
  upskilling: {
    title: 'Employee Upskilling',
    description: 'Continuous learning and development programs',
    content:
      'Keep your workforce competitive with ongoing skill development and knowledge transfer.',
    category: 'corporate',
  },
  erg: {
    title: 'Employee Resource Groups',
    description: 'Support diverse communities within your organization',
    content:
      'Foster inclusion and community through targeted mentorship within employee resource groups.',
    category: 'corporate',
  },
  dei: {
    title: 'Diversity, Equity & Inclusion',
    description: 'Build inclusive workplaces through mentorship',
    content:
      'Advance your DEI initiatives with structured mentorship programs that promote equity and inclusion.',
    category: 'corporate',
  },
  internships: {
    title: 'Intern Mentorship Programs',
    description: 'Onboard the next generation effectively',
    content:
      'Set up your interns for success with dedicated mentorship and guidance programs.',
    category: 'corporate',
  },
  youth: {
    title: 'Youth & Community Mentorship',
    description: 'Empower young leaders in your community',
    content:
      'Make a lasting impact on young people through structured community mentorship programs.',
    category: 'nonprofit',
  },
  volunteers: {
    title: 'Volunteer & Leadership Development',
    description: 'Strengthen volunteer programs and leadership',
    content:
      'Develop volunteer leaders and improve retention through peer mentorship and guidance.',
    category: 'nonprofit',
  },
  fundraising: {
    title: 'Fundraising & Board Member Mentorship',
    description: 'Strategic leadership support for nonprofits',
    content:
      'Connect with experienced board members and fundraising experts to advance your mission.',
    category: 'nonprofit',
  },
  'peer-support': {
    title: 'Peer-to-Peer Support',
    description: 'Community-driven mentoring programs',
    content:
      'Foster mutual support and shared learning within your nonprofit community.',
    category: 'nonprofit',
  },
  networking: {
    title: 'Networking & Peer Mentorship',
    description: 'Facilitate meaningful professional connections',
    content:
      'Connect your members through structured networking and peer mentorship opportunities.',
    category: 'professional',
  },
  industry: {
    title: 'Industry-Specific Career Guidance',
    description: 'Specialized career support for your industry',
    content:
      'Provide targeted career guidance that understands the unique challenges of your industry.',
    category: 'professional',
  },
  certification: {
    title: 'Upskilling & Certification Support',
    description: 'Professional development programs',
    content:
      "Support your members' professional growth with certification and skill development programs.",
    category: 'professional',
  },
}

const categoryInfo = {
  corporate: {
    color: 'blue',
    icon: '🏢',
    name: 'Corporate Solutions',
  },
  nonprofit: {
    color: 'purple',
    icon: '❤️',
    name: 'Nonprofit Solutions',
  },
  professional: {
    color: 'indigo',
    icon: '🤝',
    name: 'Professional Organizations',
  },
}

const SolutionsPage: VFC = () => {
  const [section] = useQueryParam('section', StringParam)

  const currentSection =
    section && sectionContent[section as keyof typeof sectionContent]
      ? sectionContent[section as keyof typeof sectionContent]
      : {
          title: 'Mentorly Solutions',
          description: 'Tailored mentorship solutions for every organization',
          content:
            "Discover how Mentorly can be customized to meet the unique needs of your organization, whether you're a corporation, nonprofit, or professional organization.",
          category: 'corporate',
        }

  const categoryData =
    categoryInfo[currentSection.category as keyof typeof categoryInfo]

  return (
    <>
      <SEO title={currentSection.title} />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div
          className={`bg-gradient-to-r from-${categoryData.color}-600 to-${categoryData.color}-700 text-white`}
        >
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center mb-4">
                <span className="text-4xl mr-4">{categoryData.icon}</span>
                <div>
                  <p className="text-sm uppercase tracking-wide text-blue-200 mb-2">
                    {categoryData.name}
                  </p>
                  <h1 className="text-4xl md:text-5xl font-bold">
                    {currentSection.title}
                  </h1>
                </div>
              </div>
              <p className="text-xl md:text-2xl text-blue-100 mb-8">
                {currentSection.description}
              </p>
              <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-200">
                Get Started
              </button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                About This Solution
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                {currentSection.content}
              </p>

              {/* Key Benefits */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div
                  className={`bg-${categoryData.color}-50 border border-${categoryData.color}-200 rounded-lg p-6 text-center`}
                >
                  <div className="text-2xl mb-2">🎯</div>
                  <h3
                    className={`text-lg font-semibold text-${categoryData.color}-900 mb-2`}
                  >
                    Targeted Matching
                  </h3>
                  <p className={`text-${categoryData.color}-700 text-sm`}>
                    AI-powered pairing based on your specific needs
                  </p>
                </div>
                <div
                  className={`bg-${categoryData.color}-50 border border-${categoryData.color}-200 rounded-lg p-6 text-center`}
                >
                  <div className="text-2xl mb-2">📊</div>
                  <h3
                    className={`text-lg font-semibold text-${categoryData.color}-900 mb-2`}
                  >
                    Measurable Results
                  </h3>
                  <p className={`text-${categoryData.color}-700 text-sm`}>
                    Track progress and demonstrate ROI
                  </p>
                </div>
                <div
                  className={`bg-${categoryData.color}-50 border border-${categoryData.color}-200 rounded-lg p-6 text-center`}
                >
                  <div className="text-2xl mb-2">🚀</div>
                  <h3
                    className={`text-lg font-semibold text-${categoryData.color}-900 mb-2`}
                  >
                    Scalable Platform
                  </h3>
                  <p className={`text-${categoryData.color}-700 text-sm`}>
                    Grow your program as your organization expands
                  </p>
                </div>
              </div>

              {/* Coming Soon Notice */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-6 w-6 text-yellow-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-yellow-900">
                      Custom Solution Development
                    </h3>
                    <p className="text-yellow-700 mt-1">
                      We&apos;re building detailed solution pages for each use
                      case. Contact us to discuss your specific requirements and
                      get a custom demo.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Back */}
            <div className="mt-8 text-center">
              <Link href="/">
                <a
                  className={`inline-flex items-center text-${categoryData.color}-600 hover:text-${categoryData.color}-800 font-medium`}
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Back to Home
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SolutionsPage
