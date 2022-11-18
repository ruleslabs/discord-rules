import { DiscordMember, RoleName, DiscordRoles } from '../types'

export abstract class DiscordClientInterface {

  public abstract getMemberFromCode(code: string, redirectPath: string): Promise<DiscordMember | null>

  public abstract getMemberById(memberId: string): Promise<DiscordMember | null>

  public abstract refreshRolesForMemberById(roles: DiscordRoles, memberId: string): void

  public abstract grantRoleToMemberById(roleName: RoleName, memberId?: string): void

  public abstract revokeRoleForMemberById(roleName: RoleName, memberId?: string): void
}
