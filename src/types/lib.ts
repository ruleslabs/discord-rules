import { ROLES, ACHIEVEMENT_ROLES } from '@/constants'

export type RoleName = keyof typeof ROLES
export type AchievementRoleName = keyof typeof ACHIEVEMENT_ROLES

export type DiscordRoles = { [roleName: string]: number }
