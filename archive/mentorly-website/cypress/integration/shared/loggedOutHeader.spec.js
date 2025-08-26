/* eslint-disable no-undef */
/// <reference types="Cypress" />

describe('Logged out header', () => {
  it('Checks for correct headers', () => {
    cy.visit('en/')
    cy.get('.header').within(() => {
      cy.contains('Home').should('have.attr', 'href', '/en')
      cy.contains('Mentors').should('have.attr', 'href', '/en/mentors')
      // cy.contains('Schedule').should('not.exist')
      cy.contains('My Dashboard').should('not.exist')
      cy.get('[data-testid=login-header-button]').contains('Login')
      cy.get('[data-testid=signup-header-button]').contains('Sign Up')
    })
  })
})
