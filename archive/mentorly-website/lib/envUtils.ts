import { find } from 'lodash'
import { Maybe } from 'types/graphql'

type GroupInfoType = {
  groupId: Maybe<string>
  branch: Maybe<string>
  root: boolean
  activeRoot: Maybe<string>
}

export const findRoot = (host: string, roots: string[]) => {
  return find(roots, (root) => host.endsWith(root))
}

export const parseDomain = (
  host: string,
  roots: string[],
  forceCustomDomain = false
): GroupInfoType => {
  const activeRoot = findRoot(host, roots)

  if (forceCustomDomain || !activeRoot) {
    return { root: false, groupId: host, branch: null, activeRoot: host }
  }

  const parts = host.replace(activeRoot, '').split('.')

  if (parts[0] === 'www') {
    parts.shift()
  }

  if (parts.length <= 1 || parts[0] === '') {
    return { groupId: null, branch: null, root: true, activeRoot }
  }

  // Special case for web-100.mentorly.dev style URLs (PR branches)
  if (parts[0].startsWith('web-') || parts[0].match(/pr-\d+/)) {
    return { groupId: null, branch: parts[0], root: true, activeRoot }
  }

  if (parts.length === 2 && parts[1] === '') {
    return { groupId: parts[0], branch: null, root: false, activeRoot }
  }

  if (parts.length === 3) {
    return { groupId: parts[0], branch: parts[1], root: false, activeRoot }
  }

  return { groupId: parts[0], branch: null, root: false, activeRoot }
}
