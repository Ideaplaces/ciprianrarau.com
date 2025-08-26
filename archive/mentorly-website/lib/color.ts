// Borrowed from https://github.com/twbs/bootstrap/blob/main/scss/_functions.scss

import Color from 'color'
import { Maybe } from 'types/graphql'

export const white = Color('#ffffff')
export const black = Color('#111111')

export const contrastBW = (color?: Maybe<string>) => {
  if (!color) return 'white'
  try {
    return Color(color).isLight() ? 'black' : 'white'
  } catch {
    return 'white'
  }
}

/**
 * Tint a color by mixing it with white
 * @param {string} color
 * @param {number} weight - A value from 0 to 1
 */
export const tintColor = (color: string, weight: number) => {
  return white.mix(Color(color), weight)
}

/**
 * Shade a color by mixing it with black
 * @param {string} color
 * @param {number} weight - A value from 0 to 1
 */
export const shadeColor = (color: string, weight: number) => {
  return black.mix(Color(color), weight)
}

/**
 * Shade the color if the weight is positive, else tint it
 * @param {string} color
 * @param {number} weight - A value from -1 to 1
 */
export const scaleColor = (color: string, weight: number) => {
  return weight > 0 ? shadeColor(color, weight) : tintColor(color, weight)
}
