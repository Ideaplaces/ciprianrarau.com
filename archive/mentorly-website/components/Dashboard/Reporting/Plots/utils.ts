import { minutesToHourString } from 'lib/date'

export const formatter = (value: number, name: string) => {
  return name === 'duration' ? minutesToHourString(value) : value
}

export const getValue = (val: string) => {
  return val.split(' ').shift()
}
