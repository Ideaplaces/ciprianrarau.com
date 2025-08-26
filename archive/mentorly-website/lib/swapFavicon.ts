import { GroupEssentialsFieldsFragment } from 'types/graphql'

export type GetGroupFaviconGroupProp = Pick<
  GroupEssentialsFieldsFragment,
  'files' | 'url'
>

export const getGroupFavicon = (group: GetGroupFaviconGroupProp) =>
  group.files.find((f) => f.type === 'favicon')
    ? group.files.find((f) => f.type === 'favicon')?.imageUrl
    : `https://s2.googleusercontent.com/s2/favicons?domain=${
        group.url || 'http://localhost'
      }`

export const swapFavicon = (group: GetGroupFaviconGroupProp) => {
  if (!group) return null

  const favicon = group.files.some((f) => f.type === 'favicon')
    ? (getGroupFavicon(group) as string)
    : 'https://s2.googleusercontent.com/s2/favicons?domain=www.mentorly.co'

  let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement
  if (!link) {
    link = document.createElement('link') as HTMLLinkElement
    link.rel = 'icon'
    document.getElementsByTagName('head')[0].appendChild(link)
  }
  link.href = favicon
}
