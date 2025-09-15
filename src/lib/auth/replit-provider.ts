import type { OAuthConfig, OAuthUserConfig } from 'next-auth/providers/oauth'

export interface ReplitProfile {
  id: string
  login: string
  name: string
  email: string
  avatar_url: string
  bio?: string
  url?: string
}

export default function ReplitProvider<P extends ReplitProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: 'replit',
    name: 'Replit',
    type: 'oauth',
    authorization: {
      url: 'https://replit.com/oauth2/authorize',
      params: {
        scope: 'user:read',
        response_type: 'code',
      },
    },
    token: 'https://replit.com/oauth2/token',
    userinfo: 'https://replit.com/api/user',
    profile(profile) {
      const name = profile.name || profile.login
      const [firstName, ...rest] = (name || '').split(' ')
      const lastName = rest.join(' ')
      return {
        id: profile.id,
        name,
        email: profile.email,
        image: profile.avatar_url,
        username: profile.login,
        firstName: firstName || profile.login,
        lastName: lastName || '',
        role: 'patient',
      } as any
    },
    style: {
      logo: '/replit-logo.svg',
      logoDark: '/replit-logo.svg',
      bg: '#0D101E',
      text: '#fff',
      bgDark: '#0D101E',
      textDark: '#fff',
    },
    options,
  }
}
