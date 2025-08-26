import { SEO } from 'components/SEO/SEO'
import { StringParam, useQueryParam } from 'lib/next-query-params'
import Link from 'next/link'
import { VFC } from 'react'

const sectionContent = {
  'case-studies': {
    title: 'Case Studies',
    description: 'Real success stories from our customers',
    content:
      'Discover how organizations across industries have transformed their mentorship programs with Mentorly.',
  },
  guides: {
    title: 'Downloadable Guides',
    description: 'Comprehensive resources for mentorship success',
    content:
      'Access our library of in-depth guides covering every aspect of building and managing successful mentorship programs.',
  },
  webinars: {
    title: 'Webinars',
    description: 'Live and recorded learning sessions',
    content:
      'Join our expert-led webinars to learn best practices and stay up-to-date with the latest in mentorship.',
  },
  'why-mentorship': {
    title: 'Why Mentorship?',
    description: 'The business case for mentoring programs',
    content:
      'Understand the proven ROI and benefits of implementing mentorship programs in your organization.',
  },
  'getting-started': {
    title: 'How to Start a Mentoring Program',
    description: 'Step-by-step implementation guide',
    content:
      'Our comprehensive guide walks you through every step of launching a successful mentorship program.',
  },
  'matching-best-practices': {
    title: 'Best Practices for Mentor Matching',
    description: 'Optimize your mentor-mentee pairings',
    content:
      'Learn proven strategies for creating meaningful and effective mentor-mentee relationships.',
  },
  'measuring-success': {
    title: 'Measuring Program Success',
    description: 'ROI and impact metrics for mentorship',
    content:
      'Discover key metrics and measurement strategies to demonstrate the value of your mentorship program.',
  },
}

const ResourcesPage: VFC = () => {
  const [section] = useQueryParam('section', StringParam)

  const currentSection =
    section && sectionContent[section as keyof typeof sectionContent]
      ? sectionContent[section as keyof typeof sectionContent]
      : {
          title: 'Mentorly Resources',
          description:
            'Everything you need to build successful mentorship programs',
          content:
            "Explore our comprehensive library of resources, guides, and insights to maximize your mentorship program's impact.",
        }

  return (
    <>
      <SEO title={currentSection.title} />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {currentSection.title}
              </h1>
              <p className="text-xl md:text-2xl text-green-100 mb-8">
                {currentSection.description}
              </p>
              <button className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-200">
                Download Resources
              </button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                About This Resource
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                {currentSection.content}
              </p>

              {/* Featured Resources Grid */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-2">
                    📚 Implementation Guide
                  </h3>
                  <p className="text-green-700">
                    Complete step-by-step guide to launching your mentorship
                    program
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    📊 ROI Calculator
                  </h3>
                  <p className="text-blue-700">
                    Calculate the potential return on investment for your
                    program
                  </p>
                </div>
              </div>

              {/* Coming Soon Notice */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-6 w-6 text-orange-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-orange-900">
                      Resources Coming Soon
                    </h3>
                    <p className="text-orange-700 mt-1">
                      We&apos;re building our comprehensive resource library.
                      Contact us to get early access to our guides and tools.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Back */}
            <div className="mt-8 text-center">
              <Link href="/">
                <a className="inline-flex items-center text-green-600 hover:text-green-800 font-medium">
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

export default ResourcesPage
