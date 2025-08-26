const pluralize = (txt: string, n: string | number) => {
  if (typeof n === 'string' ? parseInt(n) : n >= 2) {
    return `${txt}s`
  }
  return txt
}

export default pluralize
