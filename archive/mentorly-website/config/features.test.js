import features from './features'

test('featuresShouldHaveDefault', () => {
  // This tests that all feature flags have a default value
  const allDefaultFeatures = Object.keys(features['default'])
  const allGroupFeatures = []
  const featuresNotInDefault = []

  Object.keys(features).forEach((group) => {
    Object.keys(features[group]).forEach((feature) => {
      if (!allGroupFeatures.includes(feature)) {
        allGroupFeatures.push(feature)
      }
    })
  })
  allGroupFeatures.forEach((feature) => {
    if (!allDefaultFeatures.includes(feature)) {
      featuresNotInDefault.push(feature)
    }
  })

  expect(featuresNotInDefault).toEqual([])
})
