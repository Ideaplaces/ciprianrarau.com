const sizes = {
  en: ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
  fr: ['o', 'Ko', 'Mo', 'Go', 'To', 'Po', 'Eo', 'Zo', 'Yo'],
}

export const formatBytes = (
  bytes: number,
  decimals: number,
  locale?: string
) => {
  const localizedSizes = sizes[locale as keyof typeof sizes] || sizes.en

  if (bytes == 0) return '0 ' + localizedSizes[0]

  const k = 1024,
    dm = decimals || 2,
    i = Math.floor(Math.log(bytes) / Math.log(k))

  return (
    parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + localizedSizes[i]
  )
}
