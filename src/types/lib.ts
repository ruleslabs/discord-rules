import { ACHIEVEMENT_ROLES, ARTISTS_ROLES, ROLES } from '../constants'

export type AchievementRoleName = keyof typeof ACHIEVEMENT_ROLES
export type ArtistsRoleName = keyof typeof ARTISTS_ROLES
export type RoleName = keyof typeof ROLES
