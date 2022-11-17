import { slugify } from '@rulesorg/sdk-core'

import { ROLES } from '@/constants'
import { RoleName } from '@/types'

export function getRoleNamesFromCardSlug(slug: string): RoleName[] {
  const rolesNames: RoleName[] = ['Collectionneurs']

  if ((/-platinium-\d+$/).test(slug)) rolesNames.push('C-Platine')
  const artistSlug = slug.match(/^(.+)-season-\d+-[a-z]+-\d+$/)?.[1] ?? ''

  for (const roleName of (Object.keys(ROLES) as RoleName[])) {
    if (slugify(roleName) === `c-${artistSlug}`) {
      rolesNames.push(roleName)
      break
    }
  }

  return rolesNames
}
