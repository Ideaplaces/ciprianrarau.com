/* eslint-disable no-undef */
/// <reference types="Cypress" />

Cypress.on('uncaught:exception', () => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})

// @TODO: try using API to login once, then store token to local storage
// describe('Login', () => {
//   before(() => {
//     user = cy.PMLogin()
//   })
//
//   beforeEach('setUser', () => {
//     cy.log(user)
//     cy.visit('en/dashboard', {
//       onBeforeLoad(win) {
//         win.localStorage.setItem('user', JSON.stringify(user))
//       },
//     })
//   })

describe('Program Overview', () => {
  beforeEach(() => {
    cy.PMLogin()
    cy.visit('en/dashboard')
  })

  // Program Overview Panel
  it('Program Overview button links direct to correct pages', () => {
    cy.get('[data-testid=mentees-info-block]').should(
      'have.attr',
      'href',
      '/en/dashboard/members?page=1&segment=mentees'
    )
    cy.get('[data-testid=mentors-info-block]').should(
      'have.attr',
      'href',
      '/en/dashboard/members?page=1&segment=mentors'
    )
    cy.get('[data-testid=matches-info-block]').should(
      'have.attr',
      'href',
      '/en/dashboard/members/matching'
    )

    cy.get('[data-testid=sessions-info-block]').should(
      'have.attr',
      'href',
      '/en/dashboard/sessions'
    )

    cy.get('[data-testid=total-hours-info-block]').should(
      'have.attr',
      'href',
      '/en/dashboard/reporting'
    )
    cy.get('[data-testid=inactive-users-info-block]').should(
      'have.attr',
      'href',
      '/en/dashboard/reporting'
    )
  })

  // User Progress Panel
  it('Progress pills are clickable and open correct modal', () => {
    const progress = [
      'invited',
      'signed-up',
      'completed-profile',
      'matched',
      'booked',
    ]
    progress.map((it) => {
      cy.get(`[data-testid=${it}-progress-pill]`)
        .eq(0)
        .click()
        .get('h3')
        .contains('User progress explained')
      cy.get('[data-testid=close-modal]').click()
    })
    progress.map((it) => {
      cy.get(`[data-testid=${it}-progress-pill]`)
        .eq(1)
        .click()
        .get('h3')
        .contains('User progress explained')
      cy.get('[data-testid=close-modal]').click()
    })
  })

  // Program Activity Panel
  it('Program Activity chart legend toggles', () => {
    cy.get('[class=recharts-default-legend]>li').each((legendItem) => {
      legendItem.click()
      cy.get(legendItem).should('have.class', 'inactive')
    })
    cy.get('[class=recharts-default-legend]>li').each((legendItem) => {
      legendItem.click()
      cy.get(legendItem).should('not.have.class', 'inactive')
    })
  })

  //Recent Activity Panel
  it('Activity View More buttons link to correct page', () => {
    cy.get('[data-testid=activity-view-more-button]').should(
      'have.attr',
      'href',
      `/en/dashboard/activity`
    )
  })

  // Ratings Panel
  it('Ratings & Reviews View More button links to correct page', () => {
    cy.get('[data-testid=ratings-view-more-button]').should(
      'have.attr',
      'href',
      `/en/dashboard/ratings`
    )
  })

  // Upcoming Sessions Panel
  it('Upcoming sessions View More button links to correct page', () => {
    cy.wait(10000)
    cy.get('[data-testid=sessions-view-more-button]').should(
      'have.attr',
      'href',
      '/en/dashboard/sessions'
    )
  })
})
