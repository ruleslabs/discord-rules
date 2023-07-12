import { COLLECTOR_ROLE_NAME } from '../constants'

// regex
export function parseCardSlug(slug: string) {
  const match = slug.match(/^(.+)-season-(\d)+-([a-z]+)-\d+$/)

  return {
    artistSlug: match?.[1] ?? '',
    season: +(match?.[2] ?? 0),
    scarcityName: match?.[3] ?? '',
  }
}

export function parseCardModelSlug(slug: string) {
  const match = slug.match(/^(.+)-season-(\d)+-([a-z]+)$/)

  return {
    artistSlug: match?.[1] ?? '',
    season: +(match?.[2] ?? 0),
    scarcityName: match?.[3] ?? '',
  }
}

export function getRoleNamesFromCardSlugs(cardsSlugs: string[], allCardModelsSlugs: string[]): string[] {
  const parsedCardsSlugs = cardsSlugs.map((slug) => parseCardSlug(slug))
  const rolesNames: { [roleName: string]: boolean } = {}

  if (cardsSlugs.length) rolesNames[COLLECTOR_ROLE_NAME] = true

  // count max card models per scarcities and current season
  const cardModelsScarcitiesCounts: Record<string, number> = {}
  let currentSeason = 0

  for (const slug of allCardModelsSlugs) {
    const { scarcityName, season } = parseCardModelSlug(slug)

    cardModelsScarcitiesCounts[scarcityName] ??= 0
    ++cardModelsScarcitiesCounts[scarcityName]

    currentSeason = Math.max(currentSeason, season)
  }

  // Fullsets
  const fullsets: { [scarcityName: string]: Set<string> } = {}

  for (const { artistSlug, scarcityName, season } of parsedCardsSlugs) {
    // init fullset if needed and
    fullsets[scarcityName] ??= new Set()

    // add artist if card model is from current season
    if (season === currentSeason) {
      fullsets[scarcityName].add(artistSlug)
    }

    // artists channels
    rolesNames[`C-${artistSlug}`] = true
  }

  // fullsets role mgmt
  for (const scarcityName of Object.keys(fullsets)) {
    if (fullsets[scarcityName].size >= cardModelsScarcitiesCounts[scarcityName]) {
      rolesNames[`C-Fullset-${scarcityName}`] = true
    }
  }

  return Object.keys(rolesNames)
}
