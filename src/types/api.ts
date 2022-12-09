export interface RolesRefreshOptions {
  fetchDelay?: number
}

export interface DiscordMember {
  id: string
  username: string
  discriminator: string
  avatar: string
}

export interface DiscordGuildMember {
  avatar: string | null
  roles?: string[]
  user: DiscordMember
}

export interface OauthCredentials {
  id: string
  secret: string
  baseRedirectUri: string
}
