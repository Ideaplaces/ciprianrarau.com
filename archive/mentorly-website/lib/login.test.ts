import { authProviderForGroup } from './login'

describe('authProviderForGroup', () => {
  test('null', () => {
    expect(authProviderForGroup({ slug: 'test', authProvider: undefined }))
      .toBeNull
  })
})
