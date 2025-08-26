/* eslint-disable no-undef */
/// <reference types="Cypress" />

describe('Program tab - Info', () => {
  beforeEach(() => {
    cy.PMLogin()
    cy.visit('en/dashboard/program')
  })

  it('Checks for correct page', () => {
    cy.contains('Full name')
  })
  it('Fills out new program information', () => {
    cy.get('[data-testid=name').clear().type('Test Magnum Foundation')
    cy.get('[data-testid=title')
      .clear()
      .type('Test Social Justice and Photography')
    cy.get('[data-testid=subtitle')
      .clear()
      .type('Bringing test subtitle into view.')
    cy.get('[data-testid=aboutText').clear().type('Testing About text.')
    // @TODO add testId to DatePicker
    cy.get('[data-testid=enableCohorts]').eq(0).should('be.checked')
  })
})
