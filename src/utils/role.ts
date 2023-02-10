import {
  COMMON_ARTISTS_COUNT,
  PLATINIUM_ARTISTS_COUNT,
  HALLOWEEN_ARTISTS_COUNT,
  FULLSET_COMMON_ROLE_NAME,
  FULLSET_PLATINIUM_ROLE_NAME,
  FULLSET_HALLOWEEN_ROLE_NAME,
} from '@/constants'

// regex
export function parseCardSlug(slug: string) {
  const match = slug.match(/^(.+)-season-\d+-([a-z]+)-\d+$/)

  return {
    artist: match?.[1] ?? '',
    scarcity: match?.[2] ?? '',
  }
}

export function getRoleNamesFromCardSlugs(slugs: string[]): string[] {
  const parsedSlugs = slugs.map((slug) => parseCardSlug(slug))
  const rolesNames: { [roleName: string]: boolean } = {}

  if (slugs.length) rolesNames['Collectionneurs'] = true

  // Fullsets
  const fullsets: { [scarcityName: string]: Set<string> } = {}

  for (const parsedSlug of parsedSlugs) {
    // init fullset if needed and add artist
    if (!fullsets[parsedSlug.scarcity]) fullsets[parsedSlug.scarcity] = new Set()
    fullsets[parsedSlug.scarcity].add(parsedSlug.artist)

    // artists channels
    rolesNames[`C-${parsedSlug.artist}`] = true
  }

  // fullsets role mgmt
  for (const scarcityName of Object.keys(fullsets)) {
    if (scarcityName === 'common' && fullsets[scarcityName].size === COMMON_ARTISTS_COUNT)
      rolesNames[FULLSET_COMMON_ROLE_NAME] = true
    else if (scarcityName === 'platinium' && fullsets[scarcityName].size === PLATINIUM_ARTISTS_COUNT)
      rolesNames[FULLSET_PLATINIUM_ROLE_NAME] = true
    else if (scarcityName === 'halloween' && fullsets[scarcityName].size === HALLOWEEN_ARTISTS_COUNT)
      rolesNames[FULLSET_HALLOWEEN_ROLE_NAME] = true
  }

  return Object.keys(rolesNames)
}
