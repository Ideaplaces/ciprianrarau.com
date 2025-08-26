export type DropdownItem = {
  label: string
  href: string
  description?: string
  icon?: string
  isNew?: boolean
}

export type DropdownSection = {
  title: string
  items: DropdownItem[]
}

export const productSections: DropdownSection[] = [
  {
    title: 'CORE PLATFORM',
    items: [
      {
        label: 'Portal Design',
        href: '/en/portal-design',
        description: 'Customizable mentorship platform',
      },
      {
        label: 'Smart Matching',
        href: '/en/smart-matching',
        description: 'AI-powered mentor-mentee pairing',
      },
      {
        label: 'A La Carte Mentorship',
        href: '/en/a-la-carte',
        description: 'Employee-driven mentor selection',
      },
      {
        label: 'Reporting & Insights',
        href: '/en/reporting-insights',
        description: 'Real-time analytics dashboard',
      },
    ],
  },
  {
    title: 'AI & INTELLIGENCE',
    items: [
      {
        label: 'People Analytics',
        href: '/en/people-analytics',
        description: 'AI-powered program insights',
        isNew: true,
      },
      {
        label: 'Ratings & Reviews',
        href: '/en/ratings-reviews',
        description: 'Real-time feedback system',
      },
    ],
  },
  {
    title: 'COMMUNICATION',
    items: [
      {
        label: 'Chat & Inbox',
        href: '/en/chat-inbox',
        description: 'Secure messaging system',
      },
      {
        label: 'Communication Tools',
        href: '/en/communication-tools',
        description: 'Smart messaging & announcements',
      },
      {
        label: 'Automated Emails',
        href: '/en/automated-emails',
        description: 'Smart email workflows',
      },
    ],
  },
  {
    title: 'LEARNING & INTEGRATION',
    items: [
      {
        label: 'Group Sessions & Masterclasses',
        href: '/en/group-sessions',
        description: 'Scale beyond 1:1 mentoring',
      },
      {
        label: 'Integrations',
        href: '/en/integrations',
        description: 'HRIS, SSO, Calendar sync',
      },
    ],
  },
]

export const resourceSections: DropdownSection[] = [
  {
    title: 'CONTENT',
    items: [
      {
        label: 'Blog',
        href: '/blog',
        description: 'Latest insights and tips',
      },
      {
        label: 'Case studies',
        href: '/en/resources?section=case-studies',
        description: 'Real success stories',
      },
      {
        label: 'Downloadable Guides',
        href: '/en/resources?section=guides',
        description: 'Comprehensive resources',
      },
      {
        label: 'Webinars',
        href: '/en/resources?section=webinars',
        description: 'Live and recorded sessions',
      },
    ],
  },
  {
    title: 'FEATURED RESOURCES',
    items: [
      {
        label: 'Why Mentorship?',
        href: '/en/resources?section=why-mentorship',
        description: 'The business case for mentoring',
      },
      {
        label: 'How to Start a Mentoring Program',
        href: '/en/resources?section=getting-started',
        description: 'Step-by-step implementation guide',
      },
      {
        label: 'Best Practices for Mentor Matching',
        href: '/en/resources?section=matching-best-practices',
        description: 'Optimize your pairings',
      },
      {
        label: 'Measuring Program Success',
        href: '/en/resources?section=measuring-success',
        description: 'ROI and impact metrics',
      },
    ],
  },
]

export const solutionSections: DropdownSection[] = [
  {
    title: 'CORPORATIONS',
    items: [
      {
        label: 'Employee Engagement and Retention',
        href: '/en/solutions?section=engagement',
        description: 'Boost employee satisfaction',
      },
      {
        label: 'Leadership Development',
        href: '/en/solutions?section=leadership',
        description: 'Cultivate future leaders',
      },
      {
        label: 'Career Development',
        href: '/en/solutions?section=career',
        description: 'Accelerate career growth',
      },
      {
        label: 'Employee Upskilling',
        href: '/en/solutions?section=upskilling',
        description: 'Continuous learning programs',
      },
      {
        label: 'Employee Resource Groups',
        href: '/en/solutions?section=erg',
        description: 'Support diverse communities',
      },
      {
        label: 'Diversity, Equity & Inclusion',
        href: '/en/solutions?section=dei',
        description: 'Build inclusive workplaces',
      },
      {
        label: 'Intern Mentorship Programs',
        href: '/en/solutions?section=internships',
        description: 'Onboard the next generation',
      },
    ],
  },
  {
    title: 'NONPROFITS',
    items: [
      {
        label: 'Youth & Community Mentorship',
        href: '/en/solutions?section=youth',
        description: 'Empower young leaders',
      },
      {
        label: 'Volunteer & Leadership Development',
        href: '/en/solutions?section=volunteers',
        description: 'Strengthen volunteer programs',
      },
      {
        label: 'Fundraising & Board Member Mentorship',
        href: '/en/solutions?section=fundraising',
        description: 'Strategic leadership support',
      },
      {
        label: 'Peer-to-Peer Support',
        href: '/en/solutions?section=peer-support',
        description: 'Community-driven mentoring',
      },
    ],
  },
  {
    title: 'PROFESSIONAL ORGANIZATIONS',
    items: [
      {
        label: 'Member Engagement',
        href: '/en/solutions?section=engagement',
        description: 'Increase member value',
      },
      {
        label: 'Networking & Peer Mentorship',
        href: '/en/solutions?section=networking',
        description: 'Facilitate meaningful connections',
      },
      {
        label: 'Industry-Specific Career Guidance',
        href: '/en/solutions?section=industry',
        description: 'Specialized career support',
      },
      {
        label: 'Upskilling & Certification Support',
        href: '/en/solutions?section=certification',
        description: 'Professional development programs',
      },
    ],
  },
]
