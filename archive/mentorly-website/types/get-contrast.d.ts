declare module 'get-contrast' {
  type GetContrastOptions = {
    ignoreAlpha: boolean
  }

  export function ratio(
    colorOne: string,
    colorTwo: string,
    options?: GetContrastOptions
  ): number

  export function score(
    colorOne: string,
    colorTwo: string,
    options?: GetContrastOptions
  ): string

  export function isAccesible(
    colorOne: string,
    colorTwo: string,
    options?: GetContrastOptions
  ): boolean

  export function isNotTransparent(
    color: string,
    options?: GetContrastOptions
  ): boolean
}
