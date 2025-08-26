/* eslint-disable no-undef */
/// <reference types="Cypress" />

describe('Program tab - Members', () => {
  beforeEach(() => {
    cy.PMLogin()
    cy.visit('en/dashboard/members')
  })

  it('Checks that pagination works ', () => {
    cy.get('[data-testid=right-nav-button]').click()
    cy.get('[data-testid=page-2-button]').should('be.disabled')
  })

  // Test failing because database no longer contains any onboarded mentees
  it.skip('Checks that pagination works with active filters: mentees filter and onboarded filter ', () => {
    cy.get('[data-testid=type-filter]').click()
    cy.get('[data-testid=mentees-dropdown-button]').click()
    cy.get('[data-testid=right-nav-button]').click()
    cy.get('[data-testid=type-filter]').contains('Mentees')
    cy.get('[data-testid=page-2-button]').should('be.disabled')
    cy.get('[data-testid=status-filter]').click()
    cy.get('[data-testid=onboarded-dropdown-button]').click()
    cy.get('[data-testid=right-nav-button]').click()
    cy.get('[data-testid=status-filter]').contains('Onboarded')
    cy.get('[data-testid=page-2-button]').should('be.disabled')
    cy.get('[data-testid=right-nav-button]').click()
    cy.get('[data-testid=page-3-button]').should('be.disabled')
    cy.get('[data-testid=right-nav-button]').click()
    cy.get('[data-testid=page-4-button]').should('be.disabled')
    cy.get('[data-testid=left-nav-button]').click()
    cy.get('[data-testid=page-3-button]').should('be.disabled')
  })

  it('Checks that searching for a non existing user returns No data', () => {
    cy.get('[data-testid=search-input]')
      .clear()
      .type('nousershouldmatchiththisquery')
      .type('{enter}')
    cy.contains('No data')
  })

  it('Checks that removing query reloads users', () => {
    cy.get('[data-testid=search-input]')
      .clear()
      .type('nousershouldmatchiththisquery')
      .type('{enter}')
    cy.get('[data-testid=cancel-search]').click()
    cy.get('table').should('be.visible')
  })

  it('Checks new member button links to correct page', () => {
    cy.get('[data-testid=new-member-button]').should(
      'have.attr',
      'href',
      '/en/dashboard/members/new'
    )
  })
})
