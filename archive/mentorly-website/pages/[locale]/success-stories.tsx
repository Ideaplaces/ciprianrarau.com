import { SEO } from 'components/SEO/SEO'
import Link from 'next/link'
import { VFC } from 'react'

const successStories = [
  {
    company: 'TechCorp',
    industry: 'Technology',
    size: '5,000+ employees',
    challenge: 'Low employee engagement and high turnover in engineering teams',
    solution:
      'Implemented mentorship program for career development and leadership growth',
    results: [
      '40% increase in employee engagement scores',
      '25% reduction in voluntary turnover',
      '60% of participants received promotions within 12 months',
    ],
    quote:
      "Mentorly transformed our company culture. Our engineers are more engaged, and we're retaining our top talent like never before.",
    author: 'Sarah Johnson',
    title: 'VP of Engineering',
    logo: '🚀',
  },
  {
    company: 'GreenFuture Foundation',
    industry: 'Nonprofit',
    size: '500+ volunteers',
    challenge:
      'Difficulty developing volunteer leadership and succession planning',
    solution:
      'Created peer mentorship network for volunteer development and leadership training',
    results: [
      '75% increase in volunteer retention',
      '50% improvement in leadership pipeline',
      '90% of mentees took on leadership roles',
    ],
    quote:
      'The mentorship program helped us build a sustainable leadership pipeline that ensures our mission continues to thrive.',
    author: 'Michael Chen',
    title: 'Executive Director',
    logo: '🌱',
  },
  {
    company: 'Healthcare Professionals Network',
    industry: 'Professional Association',
    size: '10,000+ members',
    challenge:
      'Members seeking career guidance and professional development opportunities',
    solution: 'Launched industry-specific mentorship matching platform',
    results: [
      '85% member satisfaction with mentorship quality',
      '300% increase in member engagement',
      '95% of mentees achieved career advancement goals',
    ],
    quote:
      'Our members now have access to the career guidance they need to advance in healthcare. The results speak for themselves.',
    author: 'Dr. Lisa Rodriguez',
    title: 'Board President',
    logo: '🏥',
  },
]

const SuccessStoriesPage: VFC = () => {
  return (
    <>
      <SEO title="Success Stories" />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Success Stories
              </h1>
              <p className="text-xl md:text-2xl text-green-100 mb-8">
                Real organizations achieving extraordinary results with Mentorly
              </p>
              <button className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-200">
                Start Your Success Story
              </button>
            </div>
          </div>
        </div>

        {/* Success Stories */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-12">
              {successStories.map((story, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-lg overflow-hidden"
                >
                  <div className="p-8">
                    {/* Company Header */}
                    <div className="flex items-center mb-6">
                      <span className="text-4xl mr-4">{story.logo}</span>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          {story.company}
                        </h2>
                        <p className="text-gray-600">
                          {story.industry} • {story.size}
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Challenge & Solution */}
                      <div>
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            🎯 Challenge
                          </h3>
                          <p className="text-gray-700">{story.challenge}</p>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            💡 Solution
                          </h3>
                          <p className="text-gray-700">{story.solution}</p>
                        </div>
                      </div>

                      {/* Results */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                          📈 Results
                        </h3>
                        <ul className="space-y-2">
                          {story.results.map((result, resultIndex) => (
                            <li key={resultIndex} className="flex items-start">
                              <span className="text-green-500 mr-2">✓</span>
                              <span className="text-gray-700">{result}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Testimonial */}
                    <div className="mt-8 pt-8 border-t border-gray-200">
                      <blockquote className="text-lg text-gray-800 italic mb-4">
                        &ldquo;{story.quote}&rdquo;
                      </blockquote>
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                          {story.author
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {story.author}
                          </p>
                          <p className="text-gray-600">
                            {story.title}, {story.company}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Call to Action */}
            <div className="mt-16 bg-blue-600 rounded-lg p-8 text-center text-white">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Create Your Own Success Story?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Join hundreds of organizations that have transformed their
                mentorship programs with Mentorly
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-200">
                  Request a Demo
                </button>
                <Link href="/case-studies">
                  <a className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors duration-200">
                    View Case Studies
                  </a>
                </Link>
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

export default SuccessStoriesPage
