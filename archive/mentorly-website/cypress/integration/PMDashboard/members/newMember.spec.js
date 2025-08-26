/* eslint-disable no-undef */
/// <reference types="Cypress" />

describe('Program tab - Cohorts', () => {
  beforeEach(() => {
    cy.PMLogin()
    cy.visit('en/dashboard/members/new')
  })

  it('Checks for correct page', () => {
    cy.get('h2').contains('Members')
  })
})
