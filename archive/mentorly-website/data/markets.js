export const marketNames = [
  { name: 'None', value: null },
  { name: 'North America', value: 'North America' },
  { name: 'EMEA', value: 'EMEA' },
  { name: 'APAC', value: 'APAC' },
  { name: 'China', value: 'China' },
]

export const markets = [
  { id: 'North America', name: 'North America' },
  { id: 'EMEA', name: 'EMEA' },
  { id: 'APAC', name: 'APAC' },
  { id: 'China', name: 'China' },
]

export const peopleNetworkList = [
  'Middle Eastern & North African (MENA) People Network',
  'Jewish People Network',
  'Size Inclusivity People Network',
  'Asian People Network',
  'Black People Network',
  'Chronic Illness, Mental Health & Disabilities Network',
  'Indigenous People Network',
  'Latine People Network',
  'LGBTQ2IA+ People Network',
  'South Asian People Network',
  "Global Women's People Network",
]

export const peopleNetworkNames = peopleNetworkList.map((v) => ({
  name: v,
  id: v,
}))
