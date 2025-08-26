'use strict'

/*
  source: https://github.com/jsdom/abab/blob/master/lib/atob.js
*/
export const atob = (data: string) => {
  data = `${data}`
  data = data.replace(/[ \t\n\f\r]/g, '')
  if (data.length % 4 === 0) {
    data = data.replace(/==?$/, '')
  }
  if (data.length % 4 === 1 || /[^+/0-9A-Za-z]/.test(data)) {
    return null
  }
  let output = ''
  let buffer = 0
  let accumulatedBits = 0
  for (let i = 0; i < data.length; i++) {
    buffer <<= 6
    buffer |= atobLookup(data[i]) || 0
    accumulatedBits += 6
    if (accumulatedBits === 24) {
      output += String.fromCharCode((buffer & 0xff0000) >> 16)
      output += String.fromCharCode((buffer & 0xff00) >> 8)
      output += String.fromCharCode(buffer & 0xff)
      buffer = accumulatedBits = 0
    }
  }
  if (accumulatedBits === 12) {
    buffer >>= 4
    output += String.fromCharCode(buffer)
  } else if (accumulatedBits === 18) {
    buffer >>= 2
    output += String.fromCharCode((buffer & 0xff00) >> 8)
    output += String.fromCharCode(buffer & 0xff)
  }
  return output
}

const keystr =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

export const atobLookup = (chr: string) => {
  const index = keystr.indexOf(chr)
  return index < 0 ? undefined : index
}
