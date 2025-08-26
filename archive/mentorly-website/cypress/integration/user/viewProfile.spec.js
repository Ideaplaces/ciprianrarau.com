/* eslint-disable no-undef */
/// <reference types="Cypress" />
import { addMocksToSchema } from '@graphql-tools/mock'
import { makeExecutableSchema } from '@graphql-tools/schema'
import mocks from 'data/mocks'
import { graphql, print } from 'graphql'
import schemaString from 'graphql/schema.graphql'
import {
  CurrentUserDocument,
  GroupEssentialsDocument,
  MemberProfileDocument,
  MentorAvailabilityDocument,
} from 'types/graphql'

import { aliasQuery, hasOperationName } from '../../utils/graphql'

// @TODO: these could be put in a wrapper along with their imports
const schema = makeExecutableSchema({ typeDefs: schemaString })
const schemaWithMocks = addMocksToSchema({ schema, mocks })

Cypress.on('uncaught:exception', () => false)

context('Tests', () => {
  beforeEach(async () => {
    // @TODO: create helper util that can generate these for each query
    const mockGroupEssentialsData = await graphql({
      schema: schemaWithMocks,
      source: print(GroupEssentialsDocument),
    })
    const mockcurrentUserData = await graphql({
      schema: schemaWithMocks,
      source: print(CurrentUserDocument),
    })
    const mockmemberProfileData = await graphql({
      schema: schemaWithMocks,
      source: print(MemberProfileDocument),
      variableValues: { groupId: '1', userId: '1' },
    })
    const mockmentorAvailabilityData = await graphql({
      schema: schemaWithMocks,
      source: print(MentorAvailabilityDocument),
      variableValues: { id: '1' },
    })
    // @TODO: add mentorQuery in order to get module to work

    // @TODO: is there a better way to do overrides?
    mockGroupEssentialsData.data.group.endsAt = new Date('3000-01-01')
    mockGroupEssentialsData.data.group.menteeMaxSessions = 999999
    mockGroupEssentialsData.data.group.mentorMaxSessions = 999999
    mockmentorAvailabilityData.data.mentor.mentorSessionsRemaining = 1
    mockmentorAvailabilityData.data.mentor.group =
      mockGroupEssentialsData.data.group
    mockmentorAvailabilityData.data.mentor.bookable = true
    mockcurrentUserData.data.viewer.group = mockGroupEssentialsData.data.group
    mockcurrentUserData.data.viewer.menteeSessionsRemaining = 1
    mockmemberProfileData.data.group.member.mentor = true
    mockmemberProfileData.data.group.member.group =
      mockGroupEssentialsData.data.group

    cy.intercept('POST', 'https://api2.mentorly.co/graphql', (req) => {
      // @TODO: create helper util to generate these as well
      if (hasOperationName(req, 'GroupEssentials')) {
        req.alias = 'gqlGroupEssentialsQuery'
        req.reply((res) => {
          res.body = mockGroupEssentialsData
        })
      }
      if (hasOperationName(req, 'memberProfileQuery')) {
        req.alias = 'gqlmemberProfileQuery'
        req.reply((res) => {
          res.body = mockmemberProfileData
        })
      }
      if (hasOperationName(req, 'currentUser')) {
        req.alias = 'gqlcurrentUserQuery'
        req.reply((res) => {
          res.body = mockcurrentUserData
        })
      }
      if (hasOperationName(req, 'mentorAvailability')) {
        req.alias = 'gqlmentorAvailabilityQuery'
        req.reply((res) => {
          res.body = mockmentorAvailabilityData
        })
      }

      // @TODO: helper util to map  for these
      aliasQuery(req, 'GroupEssentials')
      aliasQuery(req, 'memberProfileQuery')
      aliasQuery(req, 'currentUser')
      aliasQuery(req, 'mentorAvailability')
    })
  })
  it('should have called all queries', () => {
    cy.visit('en/mentors/44')
    cy.wait('@gqlGroupEssentialsQuery')
      .its('response.body.data')
      .should('have.property', 'group')
    cy.wait('@gqlmemberProfileQuery')
      .its('response.body.data.group')
      .should('have.property', 'member')
    cy.wait('@gqlcurrentUserQuery')
      .its('response.body.data.viewer')
      .should('have.property', 'id')
  })
})
