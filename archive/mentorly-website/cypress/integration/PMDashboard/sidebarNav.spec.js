/* eslint-disable no-undef */
/// <reference types="Cypress" />

import { capitalize } from 'lodash'

const PM_MENU_ITEMS = [
  {
    id: 'home',
    href: '/en/dashboard',
  },
  {
    id: 'program',
    href: '/en/dashboard/program',
  },
  {
    id: 'members',
    href: '/en/dashboard/members',
  },
  {
    id: 'matching',
    href: '/en/dashboard/matching',
  },
  {
    id: 'sessions',
    href: '/en/dashboard/sessions',
  },
  {
    id: 'messaging',
    href: '/en/dashboard/messaging',
  },
  {
    id: 'reporting',
    href: '/en/dashboard/reporting',
  },
]

describe('Login', () => {
  beforeEach(() => {
    cy.PMLogin()
    cy.visit('en/dashboard')
    cy.wait(5000)
  })

  it('Checks for correct navigation links', () => {
    cy.get('nav')
      .not('.header')
      .within(() => {
        PM_MENU_ITEMS.map(({ id, href }) => {
          cy.contains(capitalize(id)).should('have.attr', 'href', href)
        })
      })
  })
})
