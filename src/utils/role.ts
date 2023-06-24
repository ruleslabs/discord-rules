// regex
export function parseCardSlug(slug: string) {
  const match = slug.match(/^(.+)-season-\d+-([a-z]+)-\d+$/)

  return {
    artistSlug: match?.[1] ?? '',
    scarcityName: match?.[2] ?? '',
  }
}

export function parseCardModelSlug(slug: string) {
  const match = slug.match(/^(.+)-season-\d+-([a-z]+)$/)

  return {
    artistSlug: match?.[1] ?? '',
    scarcityName: match?.[2] ?? '',
  }
}

export function getRoleNamesFromCardSlugs(cardsSlugs: string[], allCardModelsSlugs: string[]): string[] {
  const parsedCardsSlugs = cardsSlugs.map((slug) => parseCardSlug(slug))
  const rolesNames: { [roleName: string]: boolean } = {}

  if (cardsSlugs.length) rolesNames['Collectionneurs'] = true

  // count max card models per scarcities
  const cardModelsScarcitiesCounts = allCardModelsSlugs.reduce<Record<string, number>>((acc, slug) => {
    const { scarcityName } = parseCardModelSlug(slug)

    acc[scarcityName] ??= 0
    ++acc[scarcityName]

    return acc
  }, {})

  // Fullsets
  const fullsets: { [scarcityName: string]: Set<string> } = {}

  for (const { artistSlug, scarcityName } of parsedCardsSlugs) {
    // init fullset if needed and add artist
    if (!fullsets[scarcityName]) fullsets[scarcityName] = new Set()
    fullsets[scarcityName].add(artistSlug)

    // artists channels
    rolesNames[`C-${artistSlug}`] = true
  }

  // fullsets role mgmt
  for (const scarcityName of Object.keys(fullsets)) {
    if (fullsets[scarcityName].size >= cardModelsScarcitiesCounts[scarcityName])
      rolesNames[`C-Fullset-${scarcityName}`] = true
  }

  return Object.keys(rolesNames)
}
