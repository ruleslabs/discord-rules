import { DiscordClientInterface } from './interface'
import { DISCORD_API_BASE_URL, DISCORD_GUILD_ID, ROLES } from '../constants'
import { DiscordMember, DiscordGuildMember, RoleName, OauthCredentials, RolesRefreshOptions } from '../types'

export class DiscordClient implements DiscordClientInterface {
  protected oauthCredentials?: OauthCredentials
  protected botToken: string

  constructor(botToken: string, oauthCredentials?: OauthCredentials) {
    this.botToken = botToken
    this.oauthCredentials = oauthCredentials
  }

  public async getMemberFromCode(code: string, redirectPath: string): Promise<DiscordMember | null> {
    if (!this.oauthCredentials) return null

    // get access token
    const formData = new URLSearchParams()

    formData.append('client_id', this.oauthCredentials.id)
    formData.append('client_secret', this.oauthCredentials.secret)
    formData.append('grant_type', 'authorization_code')
    formData.append('redirect_uri', `${this.oauthCredentials.baseRedirectUri}${redirectPath}`)
    formData.append('scope', 'identify')
    formData.append('code', code)

    const tokenRes = await fetch(`${DISCORD_API_BASE_URL}/oauth2/token`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData
    })
    const { token_type, access_token } = (await tokenRes.json() ?? {}) as any

    if (!token_type || !access_token) return null

    // get user
    const memberRes = await fetch(`${DISCORD_API_BASE_URL}/users/@me`, {
      headers: {
        authorization: `${token_type} ${access_token}`,
      },
    })

    const member = (await memberRes.json() ?? null) as DiscordMember
    if (!member) return null

    await fetch(
      `${DISCORD_API_BASE_URL}/guilds/${DISCORD_GUILD_ID}/members/${member.id}`, {
      method: 'PUT',
      body: JSON.stringify({ access_token }),
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bot ${this.botToken}`,
      },
    })

    return member
  }

  public async getMemberById(memberId: string): Promise<DiscordMember | null> {
    const memberRes = await fetch(`${DISCORD_API_BASE_URL}/users/${memberId}`, {
      headers: {
        authorization: `Bot ${this.botToken}`,
      },
    })

    return (await memberRes.json() ?? null) as DiscordMember
  }

  public async refreshRolesForMemberById(
    roleNames: string[],
    memberId?: string,
    options: RolesRefreshOptions = {}
  ): Promise<DiscordGuildMember | null> {
    if (!memberId) return null

    // getting currnet user roles
    const res = await fetch(
      `${DISCORD_API_BASE_URL}/guilds/${DISCORD_GUILD_ID}/members/${memberId}`, {
      method: 'GET',
      headers: {
        authorization: `Bot ${this.botToken}`,
      },
    })
    const member = (await res.json() ?? null) as DiscordGuildMember
    if (!member?.roles) return null

    const roleNamesTable = roleNames.reduce<{ [roleName: string]: boolean }>((acc, roleName) => {
      acc[roleName] = true
      return acc
    }, {})

    for (const roleName of (Object.keys(ROLES) as RoleName[])) {
      let method: string | null = null

      if (member.roles.includes(ROLES[roleName])) {
        // need roles revokation
        if (!roleNamesTable[roleName]) method = 'DELETE'
      } else {
        // need roles grant
        if (roleNamesTable[roleName]) method = 'PUT'
      }

      if (!method) continue

      await fetch(
        `${DISCORD_API_BASE_URL}/guilds/${DISCORD_GUILD_ID}/members/${memberId}/roles/${ROLES[roleName]}`, {
        method,
        headers: {
          authorization: `Bot ${this.botToken}`,
        },
      })

      // sleep if needed
      if (options.fetchDelay) await new Promise(resolve => setTimeout(resolve, options.fetchDelay))
    }

    return member
  }

  public async grantRoleToMemberById(roleName: RoleName, memberId?: string) {
    await this.grantRawRoleToMemberById(ROLES[roleName], memberId)
  }

  public async grantRawRoleToMemberById(roleId: string, memberId?: string) {
    if (!memberId) return

    await fetch(
      `${DISCORD_API_BASE_URL}/guilds/${DISCORD_GUILD_ID}/members/${memberId}/roles/${roleId}`, {
      method: 'PUT',
      headers: {
        authorization: `Bot ${this.botToken}`,
      },
    })
  }

  public async revokeRoleForMemberById(roleName: RoleName, memberId?: string) {
  if (!memberId) return

  await fetch(
    `${DISCORD_API_BASE_URL}/guilds/${DISCORD_GUILD_ID}/members/${memberId}/roles/${ROLES[roleName]}`, {
    method: 'DELETE',
    headers: {
      authorization: `Bot ${this.botToken}`,
    },
  })
}
}
