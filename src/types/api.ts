export interface RolesRefreshOptions {
  fetchDelay?: number
}

export interface DiscordMember {
  id: string
  username: string
  discriminator: string
  roles: string[]
}

export interface OauthCredentials {
  id: string
  secret: string
  baseRedirectUri: string
}
