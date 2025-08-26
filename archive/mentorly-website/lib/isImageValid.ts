const isImageValid = (url: string) => {
  const image = new Image()
  image.src = url

  if (!image.complete) {
    return false
  } else if (image.height === 0) {
    return false
  }

  return true
}

export default isImageValid
