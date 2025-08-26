import { H2 } from 'components/Headings'
import {
  ContentSection,
  FeatureGrid,
  HowItWorks,
  InfoBlock,
  LandingHero,
  LandingTestimonials,
  StatsBlock,
} from 'components/landing'
import { PartnersHardcodedScrolling } from 'components/pages/Pricing/PartnersHardcodedScrolling'
import { Panel } from 'components/Panel'
import { SEO } from 'components/SEO/SEO'
import { ViewportVideo } from 'components/ViewportVideo'
import Link from 'next/link'
import { VFC } from 'react'

// Custom Analytics Dashboard Preview
const AnalyticsDashboard: VFC = () => {
  return (
    <Panel color="yellow" className="py-24">
      <Panel.Container>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <H2 className="mb-6">Mentorship That Moves the Numbers</H2>
            <p className="text-xl text-gray-700 mb-8">
              Track engagement, measure impact, and prove ROI with real-time
              analytics that show exactly how mentorship drives business
              results.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-4xl font-bold text-black mb-2">87%</div>
                <p className="text-gray-700">
                  Higher retention for mentored employees
                </p>
              </div>
              <div>
                <div className="text-4xl font-bold text-black mb-2">5x</div>
                <p className="text-gray-700">More likely to get promoted</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-black mb-2">94%</div>
                <p className="text-gray-700">
                  Say mentorship improved their careers
                </p>
              </div>
              <div>
                <div className="text-4xl font-bold text-black mb-2">2.3x</div>
                <p className="text-gray-700">Higher engagement scores</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <img
              src="/images/stats.png"
              alt="Mentorly Analytics Dashboard"
              className="rounded-lg shadow-2xl"
            />
            <div className="absolute -bottom-4 -right-4 bg-white rounded-lg shadow-lg p-4">
              <p className="text-sm font-semibold text-gray-900">
                Real-time insights
              </p>
              <p className="text-xs text-gray-600">
                Track program success instantly
              </p>
            </div>
          </div>
        </div>
      </Panel.Container>
    </Panel>
  )
}

// Platform Overview Section
const PlatformOverview: VFC = () => {
  return (
    <Panel color="green" className="py-24 text-white">
      <Panel.Container>
        <div className="text-center mb-16">
          <H2 className="mb-6 text-white">
            Everything You Need to Run World-Class Mentorship
          </H2>
          <p className="text-xl text-green-100 max-w-3xl mx-auto">
            From smart matching to real-time analytics, our platform handles the
            complexity so you can focus on what matters—your people.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <ViewportVideo
              src="/images/program-design-matching-video.mp4"
              className="rounded-lg shadow-2xl"
            />
          </div>
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <span className="text-xl">🎯</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  AI-Powered Smart Matching
                </h3>
                <p className="text-green-100">
                  Our algorithm creates perfect mentor-mentee pairs based on
                  goals, skills, and compatibility—saving you weeks of manual
                  work.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <span className="text-xl">📊</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Real-Time Analytics & Insights
                </h3>
                <p className="text-green-100">
                  Track engagement, measure impact, and uncover insights with
                  AI-powered dashboards that prove your program&apos;s ROI.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <span className="text-xl">🚀</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Automated Communications
                </h3>
                <p className="text-green-100">
                  From invitations to reminders, our platform handles all
                  communications automatically—keeping everyone engaged.
                </p>
              </div>
            </div>
            <Link href="/en/product">
              <a className="inline-flex items-center text-white font-semibold hover:text-green-200 transition-colors mt-4">
                Explore All Features
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </a>
            </Link>
          </div>
        </div>
      </Panel.Container>
    </Panel>
  )
}

// ROI Video Section
const ROIVideoSection: VFC = () => {
  return (
    <Panel color="white" className="py-24">
      <Panel.Container>
        <div className="text-center mb-12">
          <H2 className="mb-6">See How Leading Organizations Use Mentorly</H2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Watch how companies like yours are transforming their workplace
            culture and driving measurable business results with mentorship.
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="relative aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-2xl">
            <iframe
              title="Mentorly Platform Demo Video"
              src="https://player.vimeo.com/video/839885453?h=8e2f472e93&color=fddd36&title=0&byline=0&portrait=0"
              className="absolute inset-0 w-full h-full"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <script src="https://player.vimeo.com/api/player.js"></script>
        </div>
      </Panel.Container>
    </Panel>
  )
}

const B2BHomePage: VFC = () => {
  return (
    <>
      <SEO
        title="AI-Powered Mentorship Platform for Organizations | Mentorly"
        description="Transform your workplace with Mentorly's AI-powered mentorship platform. Smart matching, real-time analytics, and automated communications. Trusted by leading organizations worldwide."
        image="/images/01.png"
      />

      <LandingHero
        color="yellow"
        title="Built for HR Leaders Who Need to Prove ROI"
        subtitle="The AI-powered mentorship platform that transforms workplace culture, drives retention, and delivers measurable results—all while saving you 90% of admin time."
        primaryCTA={{
          text: 'Show Me How It Works',
          href: 'https://mentorly.com/en/thank-you',
        }}
        secondaryCTA={{
          text: 'Get Started',
          href: '/en/sign-up',
        }}
        image={{
          src: '/images/masthead.png',
          alt: 'Mentorly Dashboard',
        }}
        textColor="text-black"
      />

      <ContentSection>
        <div className="py-12">
          <p className="text-center text-gray-600 font-semibold mb-8">
            TRUSTED BY LEADING ORGANIZATIONS
          </p>
          <PartnersHardcodedScrolling />
        </div>
      </ContentSection>

      <FeatureGrid
        title="Why Organizations Choose Mentorly"
        subtitle="We've built the most comprehensive mentorship platform on the market—designed specifically for modern organizations."
        features={[
          {
            icon: '🎯',
            title: 'Smart Matching That Works',
            description:
              'AI-powered algorithm creates perfect mentor-mentee pairs based on goals, skills, and compatibility. 95% match satisfaction rate.',
            color: 'blue',
          },
          {
            icon: '📊',
            title: 'Prove Your Impact',
            description:
              'Real-time dashboards show engagement, satisfaction, and ROI. Track everything from participation rates to career progression.',
            color: 'green',
          },
          {
            icon: '⚡',
            title: 'Zero Admin Burden',
            description:
              'Automated invites, reminders, and follow-ups. Smart scheduling and calendar sync. Everything runs on autopilot.',
            color: 'yellow',
          },
          {
            icon: '🔐',
            title: 'Enterprise-Ready Security',
            description:
              'SOC 2 compliant with SSO, SAML, and HRIS integrations. Your data is protected with bank-level security.',
            color: 'purple',
          },
          {
            icon: '🎨',
            title: 'Your Brand, Your Way',
            description:
              'Fully customizable portal with white-label options. Make it look and feel like your own platform.',
            color: 'blue',
          },
          {
            icon: '🚀',
            title: 'Scale Without Limits',
            description:
              'From 50 to 50,000 participants. Our platform grows with you, maintaining quality at any size.',
            color: 'green',
          },
        ]}
        variant="shadowed"
        columns={3}
        backgroundColor="gray-50"
      />

      <PlatformOverview />

      <AnalyticsDashboard />

      <HowItWorks
        title="Launch Your Program in Days, Not Months"
        subtitle="Our proven implementation process gets you up and running quickly with minimal effort from your team."
        steps={[
          {
            number: '1',
            title: 'Quick Setup',
            description:
              'Customize your portal, set matching criteria, and import participants. Our team guides you every step.',
            color: 'blue',
          },
          {
            number: '2',
            title: 'Smart Launch',
            description:
              'AI matches participants, automated emails go out, and your program launches smoothly without manual work.',
            color: 'green',
          },
          {
            number: '3',
            title: 'Track Success',
            description:
              'Monitor real-time analytics, gather feedback, and demonstrate ROI to leadership with beautiful reports.',
            color: 'purple',
          },
        ]}
        backgroundColor="white"
      />

      <ROIVideoSection />

      <StatsBlock
        title="The Numbers Speak for Themselves"
        subtitle="Organizations using Mentorly see transformative results across all key metrics."
        stats={[
          {
            value: '87%',
            label: 'Higher Retention',
            description: 'for mentored employees',
          },
          {
            value: '5x',
            label: 'Promotion Rate',
            description: 'compared to non-participants',
          },
          {
            value: '94%',
            label: 'Satisfaction',
            description: 'from program participants',
          },
          {
            value: '40hrs',
            label: 'Saved Monthly',
            description: 'on program administration',
          },
        ]}
        backgroundColor="blue"
      />

      <ContentSection>
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <InfoBlock
            badge={{
              text: 'For HR Teams',
              icon: '👥',
              color: 'blue',
            }}
            title="Drive Retention & Engagement"
            subtitle="Give your employees the development opportunities they crave. Mentorship programs increase retention by 87% and engagement scores by 2.3x."
            cta={{
              text: 'Learn More',
              href: '/en/solutions?section=engagement',
            }}
            gradient={{ from: '#dbeafe', to: '#e0e7ff' }}
          />
          <InfoBlock
            badge={{
              text: 'For L&D Teams',
              icon: '📚',
              color: 'green',
            }}
            title="Accelerate Skill Development"
            subtitle="Create targeted learning experiences that stick. Our AI identifies skill gaps and matches employees with the perfect mentors to close them."
            cta={{
              text: 'Learn More',
              href: '/en/solutions?section=upskilling',
            }}
            gradient={{ from: '#dcfce7', to: '#dbeafe' }}
          />
        </div>
      </ContentSection>

      <LandingTestimonials
        title="Loved by Program Managers Worldwide"
        subtitle="See why organizations trust Mentorly to power their mentorship programs."
        testimonials={[
          {
            quote:
              'Mentorly transformed how we approach talent development. The smart matching saved us weeks of work, and our engagement scores have never been higher.',
            author: 'Sarah Chen',
            role: 'VP of People Operations',
            company: 'TechCorp Global',
          },
          {
            quote:
              'The analytics are incredible. For the first time, we can actually prove the ROI of our mentorship program to leadership with real data.',
            author: 'Michael Rodriguez',
            role: 'Director of L&D',
            company: 'Fortune 500 Financial',
          },
          {
            quote:
              'We launched our program in just 2 weeks. The automation handles everything, and our participants love the experience. It&apos;s been a game-changer.',
            author: 'Priya Patel',
            role: 'Head of Talent Development',
            company: 'Healthcare Leaders Inc',
          },
        ]}
        cardColor="yellow"
      />

      <Panel color="yellow" className="py-24">
        <Panel.Container>
          <div className="max-w-4xl mx-auto text-center">
            <H2 className="mb-6">Your People Are Ready to Grow. Are You?</H2>
            <p className="text-xl text-gray-700 mb-12 max-w-2xl mx-auto">
              Join thousands of forward-thinking organizations using Mentorly to
              build stronger teams, develop future leaders, and create
              workplaces where people thrive.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="https://mentorly.com/en/thank-you">
                <a className="bg-black text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors text-center">
                  Request a Demo
                </a>
              </Link>
              <Link href="/en/pricing">
                <a className="bg-white text-black px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center border border-gray-300">
                  View Pricing
                </a>
              </Link>
            </div>
            <p className="mt-8 text-sm text-gray-600">
              No credit card required • Setup in minutes • Cancel anytime
            </p>
          </div>
        </Panel.Container>
      </Panel>
    </>
  )
}

export default B2BHomePage
