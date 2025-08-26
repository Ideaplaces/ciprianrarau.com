import { SEO } from 'components/SEO/SEO'
import { StringParam, useQueryParam } from 'lib/next-query-params'
import Link from 'next/link'
import { VFC } from 'react'

const sectionContent = {
  'portal-design': {
    title: 'Portal Design',
    description: 'Customizable mentorship platform tailored to your brand',
    content:
      "Build a mentorship platform that reflects your brand and culture. Our portal design features allow you to customize the look, feel, and functionality to match your organization's unique needs.",
  },
  matching: {
    title: 'AI-Powered Matching',
    description:
      'Intelligent mentor-mentee pairing based on skills, goals, and preferences',
    content:
      'Our advanced matching algorithm considers multiple factors including skills, career goals, personality, and availability to create meaningful mentorship connections that drive results.',
  },
  alacarte: {
    title: 'A la Carte Mentorship',
    description: 'Flexible mentorship options for diverse organizational needs',
    content:
      'Choose from various mentorship formats including one-on-one sessions, group mentoring, peer circles, and reverse mentoring to create a program that fits your unique requirements.',
  },
  reporting: {
    title: 'Analytics & Reporting',
    description: 'Comprehensive insights dashboard for program optimization',
    content:
      'Track engagement, measure outcomes, and optimize your mentorship program with detailed analytics including participation rates, goal achievement, and satisfaction scores.',
  },
  'ai-intelligence': {
    title: 'AI Intelligence',
    description: 'Smart program optimization powered by machine learning',
    content:
      "Leverage AI to automatically identify skill gaps, suggest optimal pairings, and provide personalized recommendations to enhance your mentorship program's effectiveness.",
    isNew: true,
  },
  feedback: {
    title: 'Real-time Feedback',
    description: 'Instant feedback system for continuous improvement',
    content:
      'Enable mentors and mentees to provide real-time feedback, rate sessions, and share insights that help improve the mentorship experience for everyone.',
  },
  chat: {
    title: 'Chat & Inbox',
    description: 'Built-in messaging system for seamless communication',
    content:
      'Facilitate easy communication between mentors and mentees with our integrated chat system, including file sharing, scheduling integration, and conversation history.',
  },
  communication: {
    title: 'Communication Tools',
    description: 'Video calls, scheduling, and collaboration features',
    content:
      'Integrated video conferencing, calendar scheduling, and collaboration tools make it easy for mentors and mentees to connect and work together effectively.',
  },
  emails: {
    title: 'Automated Email Workflows',
    description: 'Smart email automation for program management',
    content:
      'Automate reminder emails, program updates, milestone celebrations, and engagement campaigns to keep your mentorship program running smoothly.',
  },
  learning: {
    title: 'Masterclass & Group Learning',
    description: 'Group sessions and structured learning programs',
    content:
      'Supplement one-on-one mentoring with group learning sessions, masterclasses, and structured development programs to maximize learning outcomes.',
  },
  integrations: {
    title: 'Enterprise Integrations',
    description: 'Seamless integration with your existing tools',
    content:
      'Connect with HRIS systems (Workday, Rippling, ADP, Gusto, BambooHR), Google Workspace, Outlook, Microsoft Teams, calendar systems, SAML, and SSO solutions.',
  },
}

const ProductPage: VFC = () => {
  const [section] = useQueryParam('section', StringParam)

  const currentSection =
    section && sectionContent[section as keyof typeof sectionContent]
      ? sectionContent[section as keyof typeof sectionContent]
      : {
          title: 'Mentorly Product Suite',
          description:
            'Comprehensive mentorship platform for modern organizations',
          content:
            'Explore our complete suite of mentorship tools designed to help organizations build, manage, and scale successful mentorship programs.',
        }

  return (
    <>
      <SEO title={currentSection.title} />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center mb-4">
                <h1 className="text-4xl md:text-5xl font-bold">
                  {currentSection.title}
                </h1>
                {'isNew' in currentSection && currentSection.isNew && (
                  <span className="ml-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    New
                  </span>
                )}
              </div>
              <p className="text-xl md:text-2xl text-blue-100 mb-8">
                {currentSection.description}
              </p>
              <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-200">
                Request Demo
              </button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                About This Feature
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                {currentSection.content}
              </p>

              {/* Coming Soon Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-6 w-6 text-blue-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-blue-900">
                      Page Under Development
                    </h3>
                    <p className="text-blue-700 mt-1">
                      We&apos;re working on creating detailed pages for each
                      feature. In the meantime, you can learn more by requesting
                      a demo or contacting our team.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Back */}
            <div className="mt-8 text-center">
              <Link href="/">
                <a className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
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

export default ProductPage
