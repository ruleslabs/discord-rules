import { slugify } from '@rulesorg/sdk-core'

import { ROLES, HALLOWEEN_ARTISTS_COUNT } from '@/constants'
import { RoleName, AchievementRoleName } from '@/types'

// regex
export function parseCardSlug(slug: string) {
  const match = slug.match(/^(.+)-season-\d+-([a-z]+)-\d+$/)

  return {
    artist: match?.[1] ?? '',
    scarcity: match?.[2] ?? '',
  }
}

export function getRoleNamesFromCardSlug(slug: string): RoleName[] {
  const rolesNames: RoleName[] = ['Collectionneurs']

  const parsedSlug = parseCardSlug(slug)

  if (parsedSlug.scarcity === 'platinium') rolesNames.push('C-Platine')

  for (const roleName of (Object.keys(ROLES) as RoleName[])) {
    if (slugify(roleName) === `c-${parsedSlug.artist}`) {
      rolesNames.push(roleName)
      break
    }
  }

  return rolesNames
}

export function getAchievementRoleNamesFromCardSlugs(slugs: string[]): AchievementRoleName[] {
  const parsedSlugs = slugs.map((slug) => parseCardSlug(slug))
  const rolesNames: AchievementRoleName[] = []

  // Halloween fullset
  const halloweenArtists: { [slug: string]: boolean } = {}
  let halloweenArtistsCount = 0

  for (const parsedSlug of parsedSlugs) {
    if (parsedSlug.scarcity === 'halloween' && !halloweenArtists[parsedSlug.artist]) {
      halloweenArtists[parsedSlug.artist] = true
      ++halloweenArtistsCount
    }
  }

  if (HALLOWEEN_ARTISTS_COUNT === halloweenArtistsCount) rolesNames.push('C-Halloween-Fullset')

  return rolesNames
}
