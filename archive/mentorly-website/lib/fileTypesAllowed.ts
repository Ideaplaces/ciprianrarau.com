export const supportedImages = [
  'image/jpg',
  'image/webp',
  'image/jpeg',
  'image/gif',
  'image/png',
  'image/apng',
  'image/svg',
  'image/svg+xml',
]

export const supportedVideos = [
  'video/ogg',
  'video/mp4',
  'video/webm',
  // 'video/mkv', MKV is not natively supported in Safari
]

export const fileTypesAllowed = [...supportedImages, ...supportedVideos]

export const faviconTypesAllowed = [
  ...supportedImages,
  'image/x-icon',
  'image/vnd.microsoft.icon',
]
