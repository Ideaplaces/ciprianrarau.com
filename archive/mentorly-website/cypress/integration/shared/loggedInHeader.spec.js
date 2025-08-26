/* eslint-disable no-undef */
/// <reference types="Cypress" />

describe('Logged in header', () => {
  beforeEach(() => {
    cy.PMLogin()
    cy.visit('en/')
  })

  // @TODO it('Checks for group logo')

  it('Checks for correct headers', () => {
    cy.get('.header').within(() => {
      cy.contains('Home').should('have.attr', 'href', '/en')
      cy.contains('Mentors').should('have.attr', 'href', '/en/mentors')
      cy.contains('Schedule').should('have.attr', 'href', '/en/schedule')
      cy.contains('My Dashboard').should('have.attr', 'href', '/en/personal')
    })
  })
})

// @TODO it('Checks for user avatar')

// @TODO it('Checks for user name and correct role')
