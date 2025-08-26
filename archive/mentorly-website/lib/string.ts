export const escapeChars = (str: string, chars: string[]) => {
  if (!str || !chars || chars.length < 1) return undefined

  const esc = String.fromCharCode(92)
  let output = str
  for (let i = 0; i < chars?.length; i++) {
    const char = new RegExp('\\' + chars[i], 'g')
    output = output.replace(char, esc + chars[i])
  }
  return output
}
