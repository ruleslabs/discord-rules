import { ROLES } from '@/constants'

export interface DiscordMember {
  id: string
  username: string
  discriminator: string
  roles: string[]
}

export type RoleName = keyof typeof ROLES

export type DiscordRoles = { [roleName: string]: number }
