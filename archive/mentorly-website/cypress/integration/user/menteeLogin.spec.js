/* eslint-disable no-undef */
/// <reference types="Cypress" />

Cypress.on('uncaught:exception', () => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})

describe('Mentee Login', () => {
  it('Opens the Login page', () => {
    cy.visit('en/login')
  })
  it('Fills login information', () => {
    cy.get('[data-testid=email]').clear().type('cypressmentee@mentorly.co')
    cy.get('[data-testid=password]').clear().type('KJN5zuq6mxj-kza0jme')
  })
  it('Navigates to Mentee profile on successful login', () => {
    cy.get('[data-testid=login-form-button]').click()
    cy.wait(10000)
    cy.location('pathname').should('include', 'personal')
  })
})
