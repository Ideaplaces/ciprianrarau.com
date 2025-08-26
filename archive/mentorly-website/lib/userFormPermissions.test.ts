import { Group } from 'types/graphql'

import { groupUserPermissionsForForm } from './userFormPermissions'

const group = { id: '1', slug: 'sxsw-2022' } as Group
const mentor = { mentor: true }
const mentee = { mentor: false }

describe('test sxsw groupUserPremissionsForForm', () => {
  test('fields returned for limited form', () => {
    const limitedForm = groupUserPermissionsForForm(
      group,
      mentor,
      'userProfile'
    )
    expect(limitedForm).toHaveProperty('readOnlyFormFields')
    expect(limitedForm).toHaveProperty('hasReadOnly')
    expect(limitedForm.hasReadOnly).toBe(true)
    expect(Array.isArray(limitedForm.readOnlyFormFields)).toBe(true)
  })
  test('no fields returned for non-limited form', () => {
    const nonLimitedForm = groupUserPermissionsForForm(
      group,
      mentor,
      'xxxfakeformxxx'
    )
    expect(nonLimitedForm).toHaveProperty('readOnlyFormFields')
    expect(nonLimitedForm).toHaveProperty('hasReadOnly')
    expect(nonLimitedForm.hasReadOnly).toBe(false)
    expect(nonLimitedForm.readOnlyFormFields.length).toBe(0)
  })
  test('no fields returned for limied form with mentee', () => {
    const limitedForm = groupUserPermissionsForForm(
      group,
      mentee,
      'userProfile'
    )
    expect(limitedForm).toHaveProperty('readOnlyFormFields')
    expect(limitedForm).toHaveProperty('hasReadOnly')
    expect(limitedForm.hasReadOnly).toBe(false)
    expect(limitedForm.readOnlyFormFields.length).toBe(0)
  })
  test('no fields returned for non-limited form with mentee', () => {
    const nonLimitedForm = groupUserPermissionsForForm(
      group,
      mentee,
      'xxxfakeformxxx'
    )
    expect(nonLimitedForm).toHaveProperty('readOnlyFormFields')
    expect(nonLimitedForm).toHaveProperty('hasReadOnly')
    expect(nonLimitedForm.hasReadOnly).toBe(false)
    expect(nonLimitedForm.readOnlyFormFields.length).toBe(0)
  })
})
