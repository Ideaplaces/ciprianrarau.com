/* eslint-disable no-undef */
/// <reference types="Cypress" />

describe('Program tab - Design', () => {
  beforeEach(() => {
    cy.PMLogin()
    cy.visit('en/dashboard/program/design')
  })

  it('Checks for correct page', () => {
    cy.contains('Font Name')
  })
})
