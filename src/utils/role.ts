import { slugify } from '@rulesorg/sdk-core'

import { ROLES, HALLOWEEN_ARTISTS_COUNT } from '@/constants'

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

  // Halloween fullset
  const halloweenArtists: { [slug: string]: boolean } = {}
  let halloweenArtistsCount = 0

  for (const parsedSlug of parsedSlugs) {
    // Halloween fullset
    if (parsedSlug.scarcity === 'halloween' && !halloweenArtists[parsedSlug.artist]) {
      halloweenArtists[parsedSlug.artist] = true
      ++halloweenArtistsCount
    }

    // platinium club
    if (parsedSlug.scarcity === 'platinium') rolesNames['C-Platine'] = true

    // artists channels
    rolesNames[`C-${parsedSlug.artist}`] = true
  }

  if (HALLOWEEN_ARTISTS_COUNT === halloweenArtistsCount) rolesNames['C-Halloween-Fullset'] = true

  return Object.keys(rolesNames)
}
