/* eslint-disable no-undef */
/// <reference types="Cypress" />

Cypress.on('uncaught:exception', () => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})

describe('PM Login', () => {
  it('Opens the Login page', () => {
    cy.visit('en/login')
  })
  it('Fills login information', () => {
    cy.get('[data-testid=email]').clear().type('cypresspm@mentorly.co')
    cy.get('[data-testid=password]').clear().type('8sTdUdLJ66L6xPeMiE56')
  })
  it('Navigates to profile on successful login', () => {
    cy.get('[data-testid=login-form-button]').click()
    cy.wait(10000)
    cy.location('pathname').should('include', 'personal')
  })
})
