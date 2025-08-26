import { gql, useQuery } from '@apollo/client'
import DashboardLayout from 'components/Dashboard/Layout'
import { ReportingMenu } from 'components/Dashboard/Menu'
import Panel from 'components/display/Panel'
import TypedQuery, { TypedQueryReturn } from 'components/Graphql/TypedQuery'
import EmergingThemesAnalysis from 'components/reporting/EmergingThemesAnalysis'
import KnowledgeGapAnalysis from 'components/reporting/KnowledgeGapAnalysis'
import SectionHelpText from 'components/reporting/SectionHelpText'
import UpskillingRecommendations from 'components/reporting/UpskillingRecommendations'
import UserGoalsAnalysis from 'components/reporting/UserGoalsAnalysis'
import { CAREER_DEVELOPMENT_RECOMMENDATIONS_QUERY } from 'graphql/queries/careerDevelopmentRecommendations'
import { EMERGING_THEMES_ANALYSIS_QUERY } from 'graphql/queries/emergingThemesAnalysis'
import { KNOWLEDGE_GAP_ANALYSIS_QUERY } from 'graphql/queries/knowledgeGapAnalysis'
import { USER_GOALS_ANALYSIS_QUERY } from 'graphql/queries/userGoalsAnalysis'
import { useCurrentGroup } from 'lib/GroupContext'
import { connectServerSideProps } from 'lib/ssg'
import { useCurrentUser } from 'lib/UserContext'
import React, { useEffect, useState } from 'react'
import { Award, Briefcase } from 'react-feather'
import { useIntl } from 'react-intl'
import Skeleton from 'react-loading-skeleton'
import {
  GroupDashboardInsightsQuery,
  GroupDashboardInsightsQueryVariables,
  useGroupDashboardInsightsQuery,
} from 'types/graphql'

// Define component types for testing selectors
type ComponentType =
  | 'emergingThemes'
  | 'userGoals'
  | 'knowledgeGap'
  | 'careerDevelopment'
  | 'peopleSkillsBreakdown'

// Components list - all available components
const ALL_COMPONENTS: ComponentType[] = [
  'emergingThemes',
  'userGoals',
  'knowledgeGap',
  'careerDevelopment',
  'peopleSkillsBreakdown',
]

// Default components to show - only show knowledgeGap by default for development
const DEFAULT_COMPONENTS: ComponentType[] = ['knowledgeGap']

// localStorage key for component preferences
const STORAGE_KEY = 'mentorly-insights-components'

gql`
  query groupDashboardInsights($groupId: ID!) {
    group: managedGroup(id: $groupId) {
      id
      name
      analyticsRestricted
      dashboard {
        groupInfo
        surveyAnalytics
      }
    }
  }
`

const PeopleAnalytics = () => {
  const { formatMessage, locale } = useIntl()
  const { currentGroup } = useCurrentGroup()
  const { currentUser: _currentUser } = useCurrentUser()

  // State for active components - default to all components or URL param override
  const [activeComponents, setActiveComponents] = useState<ComponentType[]>(
    // In production, show all components by default
    process.env.NODE_ENV === 'production' ? ALL_COMPONENTS : DEFAULT_COMPONENTS
  )

  // Check URL for test mode parameters and localStorage on initial load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // First try URL parameters (these take priority)
      const urlParams = new URLSearchParams(window.location.search)
      const testComponents = urlParams.get('testComponents')

      if (testComponents) {
        try {
          // Parse the components from the URL parameter
          const components = testComponents.split(',') as ComponentType[]
          if (components.length > 0) {
            setActiveComponents(components)
            // Save to localStorage for persistence
            localStorage.setItem(STORAGE_KEY, JSON.stringify(components))
          }
        } catch (error) {
          console.error('Error parsing test components:', error)
        }
      } else {
        // If no URL parameters, check localStorage
        try {
          const savedComponents = localStorage.getItem(STORAGE_KEY)
          if (savedComponents) {
            const components = JSON.parse(savedComponents) as ComponentType[]
            if (components.length > 0) {
              setActiveComponents(components)
            }
          }
        } catch (error) {
          console.error('Error loading saved components:', error)
        }
      }
    }
  }, [])

  // Helper to check if component should be shown
  const shouldShowComponent = (component: ComponentType) => {
    return activeComponents.includes(component)
  }

  // Only make queries for active components
  const { data: goalsData, loading: goalsLoading } = useQuery(
    USER_GOALS_ANALYSIS_QUERY,
    {
      variables: { groupId: currentGroup?.id, locale },
      skip:
        !currentGroup?.id ||
        !shouldShowComponent('userGoals') ||
        currentGroup?.analyticsRestricted,
    }
  )

  const { data: knowledgeGapData, loading: knowledgeGapLoading } = useQuery(
    KNOWLEDGE_GAP_ANALYSIS_QUERY,
    {
      variables: { groupId: currentGroup?.id, locale },
      skip:
        !currentGroup?.id ||
        !shouldShowComponent('knowledgeGap') ||
        currentGroup?.analyticsRestricted,
      onError: (error) => {
        console.error('Knowledge Gap Error:', error)
      },
    }
  )

  const {
    data: careerRecommendationsData,
    loading: careerRecommendationsLoading,
  } = useQuery(CAREER_DEVELOPMENT_RECOMMENDATIONS_QUERY, {
    variables: { groupId: currentGroup?.id, locale },
    skip:
      !currentGroup?.id ||
      !shouldShowComponent('careerDevelopment') ||
      currentGroup?.analyticsRestricted,
    onError: (error) => {
      console.error('Career Development Recommendations Error:', error)
    },
  })

  const { data: emergingThemesData, loading: emergingThemesLoading } = useQuery(
    EMERGING_THEMES_ANALYSIS_QUERY,
    {
      variables: { groupId: currentGroup?.id, locale },
      skip:
        !currentGroup?.id ||
        !shouldShowComponent('emergingThemes') ||
        currentGroup?.analyticsRestricted,
      onError: (error) => {
        console.error('Emerging Themes Analysis Error:', error)
      },
    }
  )

  // If analytics are restricted for this group, show a message
  if (currentGroup?.analyticsRestricted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ReportingMenu openModal={() => {}} loading={false} />
        <div className="mt-8 bg-white p-8 rounded-lg shadow text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Analytics Features Not Available
          </h2>
          <p className="text-gray-600">
            Advanced analytics features are not available for this group due to
            data privacy requirements. Please contact your Mentorly account
            manager for more information.
          </p>
        </div>
      </div>
    )
  }

  // Add test mode component selector UI
  const renderTestModeUI = () => {
    if (process.env.NODE_ENV !== 'development') return null

    return (
      <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <div className="mb-2 font-bold">Test Mode Controls</div>
        <div className="flex flex-wrap gap-2">
          {ALL_COMPONENTS.map((component) => (
            <label
              key={component}
              className="flex items-center mr-4 cursor-pointer"
            >
              <input
                type="checkbox"
                className="mr-1"
                checked={activeComponents.includes(component)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setActiveComponents((prev) => {
                      const newSelection = [...prev, component]
                      localStorage.setItem(
                        STORAGE_KEY,
                        JSON.stringify(newSelection)
                      )
                      return newSelection
                    })
                  } else {
                    setActiveComponents((prev) => {
                      const newSelection = prev.filter((c) => c !== component)
                      localStorage.setItem(
                        STORAGE_KEY,
                        JSON.stringify(newSelection)
                      )
                      return newSelection
                    })
                  }
                }}
              />
              <span className="text-sm">{component}</span>
            </label>
          ))}
        </div>
        <div className="mt-2 text-xs text-gray-600">
          URL Parameter: ?testComponents=emergingThemes
        </div>
      </div>
    )
  }

  if (!currentGroup) {
    return null
  }

  return (
    <TypedQuery<GroupDashboardInsightsQueryVariables>
      typedQuery={useGroupDashboardInsightsQuery}
      variables={{ groupId: currentGroup.id }}
      skip={false}
      passLoading
    >
      {({ group, loading }: TypedQueryReturn & GroupDashboardInsightsQuery) => {
        const { dashboard } = group || {}

        return (
          <div className="space-y-8">
            <ReportingMenu
              loading={loading}
              openModal={() => {
                // Optional: implement download functionality
              }}
            />

            {renderTestModeUI()}

            {/* User Goals Analysis - Now first */}
            {shouldShowComponent('userGoals') &&
              (goalsLoading ? (
                <Panel>
                  <Panel.Header
                    heading={formatMessage({ id: 'analytics.goalsAnalysis' })}
                  />
                  <Panel.Body>
                    <div className="h-40 flex items-center justify-center">
                      <Skeleton count={3} />
                    </div>
                  </Panel.Body>
                </Panel>
              ) : goalsData?.userGoalsAnalysis ? (
                <UserGoalsAnalysis
                  analysisData={goalsData.userGoalsAnalysis}
                  metadata={goalsData.userGoalsAnalysis.metadata}
                />
              ) : null)}

            {/* Emerging Themes Analysis */}
            {shouldShowComponent('emergingThemes') &&
              (emergingThemesLoading ? (
                <Panel>
                  <Panel.Header
                    heading={formatMessage({ id: 'analytics.emergingThemes' })}
                  />
                  <Panel.Body>
                    <div className="h-40 flex items-center justify-center">
                      <Skeleton count={3} />
                    </div>
                  </Panel.Body>
                </Panel>
              ) : emergingThemesData?.emergingThemesAnalysis ? (
                <EmergingThemesAnalysis
                  analysisData={emergingThemesData.emergingThemesAnalysis}
                  metadata={emergingThemesData.emergingThemesAnalysis.metadata}
                />
              ) : null)}

            {/* Knowledge Gap */}
            {shouldShowComponent('knowledgeGap') &&
              (knowledgeGapLoading ? (
                <Panel>
                  <Panel.Header
                    heading={formatMessage({ id: 'analytics.knowledgeGap' })}
                  />
                  <Panel.Body>
                    <div className="h-40 flex items-center justify-center">
                      <Skeleton count={3} />
                    </div>
                  </Panel.Body>
                </Panel>
              ) : knowledgeGapData?.knowledgeGapAnalysis ? (
                <KnowledgeGapAnalysis
                  analysisData={knowledgeGapData.knowledgeGapAnalysis}
                  metadata={knowledgeGapData.knowledgeGapAnalysis.metadata}
                  rawData={knowledgeGapData.knowledgeGapAnalysis.rawData}
                />
              ) : null)}

            {/* Upskilling Recommendations */}
            {shouldShowComponent('careerDevelopment') &&
              (careerRecommendationsLoading ? (
                <Panel>
                  <Panel.Header
                    heading={formatMessage({
                      id: 'analytics.upskillingRecommendations',
                    })}
                  />
                  <Panel.Body>
                    <div className="h-40 flex items-center justify-center">
                      <Skeleton count={3} />
                    </div>
                  </Panel.Body>
                </Panel>
              ) : careerRecommendationsData?.careerDevelopmentRecommendations ? (
                <UpskillingRecommendations
                  analysisData={
                    careerRecommendationsData.careerDevelopmentRecommendations
                  }
                  metadata={
                    careerRecommendationsData.careerDevelopmentRecommendations
                      .metadata
                  }
                />
              ) : null)}

            {/* People Skills Breakdown */}
            {shouldShowComponent('peopleSkillsBreakdown') && dashboard && (
              <Panel>
                <Panel.Header
                  heading={formatMessage({ id: 'term.peopleSkillsBreakdown' })}
                  subheading={formatMessage({
                    id: 'term.topSkillsAndIndustries',
                  })}
                />
                <Panel.Body className="p-4">
                  <SectionHelpText
                    text="Highlights the top skills identified by mentors and mentees, along with the industries represented across your program."
                    translationId="dashboard.insights.peopleSkillsBreakdown.helpText"
                  />
                  {loading ? (
                    <Skeleton count={3} />
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Hard Skills */}
                      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                        <div className="p-3 border-b bg-orange-50 flex items-center">
                          <Award size={16} className="text-orange-500 mr-2" />
                          <div className="font-medium">
                            {formatMessage({ id: 'term.hardSkills' })}
                          </div>
                        </div>
                        <div className="p-3">
                          {dashboard.surveyAnalytics.hard_skills &&
                          dashboard.surveyAnalytics.hard_skills.length > 0 ? (
                            <div className="space-y-2">
                              {dashboard.surveyAnalytics.hard_skills
                                .slice(0, 8)
                                .map((skill: any, index: number) => (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between p-2 border-b"
                                  >
                                    <span className="flex items-center text-sm font-medium text-gray-700">
                                      {skill.name}
                                    </span>
                                    <span className="text-xs font-semibold bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                                      {skill.count}
                                    </span>
                                  </div>
                                ))}
                            </div>
                          ) : (
                            <div className="text-center text-gray-500 py-4">
                              {formatMessage({ id: 'term.noData' })}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Soft Skills */}
                      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                        <div className="p-3 border-b bg-teal-50 flex items-center">
                          <Award size={16} className="text-teal-500 mr-2" />
                          <div className="font-medium">
                            {formatMessage({ id: 'term.softSkills' })}
                          </div>
                        </div>
                        <div className="p-3">
                          {dashboard.surveyAnalytics.soft_skills &&
                          dashboard.surveyAnalytics.soft_skills.length > 0 ? (
                            <div className="space-y-2">
                              {dashboard.surveyAnalytics.soft_skills
                                .slice(0, 8)
                                .map((skill: any, index: number) => (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between p-2 border-b"
                                  >
                                    <span className="flex items-center text-sm font-medium text-gray-700">
                                      {skill.name}
                                    </span>
                                    <span className="text-xs font-semibold bg-teal-100 text-teal-800 px-2 py-1 rounded-full">
                                      {skill.count}
                                    </span>
                                  </div>
                                ))}
                            </div>
                          ) : (
                            <div className="text-center text-gray-500 py-4">
                              {formatMessage({ id: 'term.noData' })}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Industries */}
                      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                        <div className="p-3 border-b bg-blue-50 flex items-center">
                          <Briefcase size={16} className="text-blue-500 mr-2" />
                          <div className="font-medium">
                            {formatMessage({ id: 'term.industries' })}
                          </div>
                        </div>
                        <div className="p-3">
                          {dashboard.surveyAnalytics.industries &&
                          dashboard.surveyAnalytics.industries.length > 0 ? (
                            <div className="space-y-2">
                              {dashboard.surveyAnalytics.industries
                                .slice(0, 8)
                                .map((industry: any, index: number) => (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between p-2 border-b"
                                  >
                                    <span className="flex items-center text-sm font-medium text-gray-700">
                                      {industry.name}
                                    </span>
                                    <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                      {industry.count}
                                    </span>
                                  </div>
                                ))}
                            </div>
                          ) : (
                            <div className="text-center text-gray-500 py-4">
                              {formatMessage({ id: 'term.noData' })}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </Panel.Body>
              </Panel>
            )}
          </div>
        )
      }}
    </TypedQuery>
  )
}

PeopleAnalytics.Layout = DashboardLayout
export const getServerSideProps = connectServerSideProps(PeopleAnalytics)
export default PeopleAnalytics
