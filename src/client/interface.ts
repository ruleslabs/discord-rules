import { UserDocument } from '@rulesorg/mongoose-rules'

import { DiscordMember, RoleName } from '../types'

export abstract class DiscordClientInterface {

  public abstract getMemberFromCode(code: string): Promise<DiscordMember | null>

  public abstract getMemberById(memberId: string): Promise<DiscordMember | null>

  public abstract refreshRolesForMemberById(roles: UserDocument['discordRoles'], memberId: string): void

  public abstract grantRoleToMemberById(roleName: RoleName, memberId?: string): void

  public abstract revokeRoleForMemberById(roleName: RoleName, memberId?: string): void
}
