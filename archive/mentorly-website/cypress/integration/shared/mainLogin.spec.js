/* eslint-disable no-undef */
/// <reference types="Cypress" />

Cypress.on('uncaught:exception', () => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})

describe('Login Page', () => {
  it('Opens the Login page', () => {
    cy.visit('en')
    cy.get('[data-testid=login-header-button]').click()
  })
  it('Greets with Login', () => {
    cy.get('h3').contains('Login')
  })
  it('Requires email', () => {
    cy.get('[data-testid=password]').type('8sTdUdLJ66L6xPeMiE56')
    cy.get('[data-testid=login-form-button]').click()
    cy.contains('email is a required')
  })
  it('Requires password', () => {
    cy.get('[data-testid=password]').clear()
    cy.get('[data-testid=email]').type('cypresspm@mentorly.co')
    cy.get('[data-testid=login-form-button]').click()
    cy.contains('password is a required')
  })
  it('Requires valid email', () => {
    cy.get('[data-testid=email]').clear().type('8sTdUdLJ66L6xPeMiE56')
    cy.contains('valid email')
  })
  it('Requires valid password', () => {
    cy.get('[data-testid=email]').clear().type('cypresspm@mentorly.co')
    cy.get('[data-testid=password]').type('WrongPassword')
    cy.get('[data-testid=login-form-button]').click()
    cy.contains('Invalid username or password')
  })
})
