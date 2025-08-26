const fileExt = (url: string) => {
  if (url?.includes('.')) {
    return url?.trim().split('.').pop()
  }

  return null
}

export default fileExt
