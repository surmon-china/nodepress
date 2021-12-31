/**
 * @file Disqus API
 * @module utils/disqus
 * @author Surmon <https://github.com/surmon-china>
 */

import axios from 'axios'

const AUTHORIZE_URL = 'https://disqus.com/api/oauth/2.0/authorize'
const ACCESS_TOKEN_URL = 'https://disqus.com/api/oauth/2.0/access_token/'
const getApiURL = (resource: string) => `https://disqus.com/api/3.0/${resource}.json`

const normalizeAxiosError = (error: any) => {
  return error?.response?.data?.response || error?.response?.data || error?.toJSON() || error?.message || error
}

const resourcesRequiringPost = [
  'blacklists/add',
  'blacklists/remove',
  'categories/create',
  'exports/exportForum',
  'forums/addModerator',
  'forums/create',
  'forums/removeModerator',
  'posts/approve',
  'posts/create',
  'posts/highlight',
  'posts/remove',
  'posts/report',
  'posts/restore',
  'posts/spam',
  'posts/unhighlight',
  'posts/update',
  'posts/vote',
  'reactions/remove',
  'reactions/restore',
  'threads/close',
  'threads/create',
  'threads/open',
  'threads/remove',
  'threads/restore',
  'threads/subscribe',
  'threads/unsubscribe',
  'threads/update',
  'threads/vote',
  'users/checkUsername',
  'users/follow',
  'users/unfollow',
  'whitelists/add',
  'whitelists/remove',
]

// https://stackoverflow.com/questions/16444602/creating-an-anonymous-post-with-disqus-api-fails
// http://jonathonhill.net/2013-07-11/disqus-guest-posting-via-api/
// https://blog.fooleap.org/disqus-api-permissions.html
export const DISQUS_PUBKEY = `E8Uh5l5fHZ6gD8U3KycjAIAk46f68Zw7C6eW8WSjZvCLXebZ7p0r1yrYDrLilk2F`

export interface AccessToken {
  username: string
  user_id: number
  access_token: string
  /** seconds */
  expires_in: number
  token_type: string
  state: any
  scope: string
  refresh_token: string
}

export interface RequestParams {
  access_token?: string
  [key: string]: any
}

export interface DisqusConfig {
  apiKey: string
  apiSecret: string
}

// fork form: https://github.com/rcurrier666/node-disqus
export class Disqus {
  private config: DisqusConfig
  constructor(config: DisqusConfig) {
    this.config = config
  }

  // https://disqus.com/api/docs/
  public request<T = any>(resource: string, params: RequestParams = {}, usePublic = false) {
    const api = getApiURL(resource)
    const queryParams = { ...params }
    // https://github.com/fooleap/disqus-php-api/blob/master/api/init.php#L342
    if (usePublic) {
      queryParams.api_key = DISQUS_PUBKEY
    } else {
      queryParams.api_key = this.config.apiKey
      queryParams.api_secret = this.config.apiSecret
    }
    const requester = resourcesRequiringPost.includes(resource)
      ? axios.post<{ code: number; response: T }>(api, null, { params: queryParams })
      : axios.get<{ code: number; response: T }>(api, { params: queryParams })
    return requester
      .then((response) => {
        return response.data.code !== 0 ? Promise.reject(response.data) : Promise.resolve(response.data)
      })
      .catch((error) => {
        // https://disqus.com/api/docs/errors/
        return error?.response?.data?.response
          ? Promise.reject(`[code=${error.response.data.code}] ${error.response.data.response}`)
          : Promise.reject(normalizeAxiosError(error))
      })
  }

  // https://disqus.com/api/docs/auth/
  public getAuthorizeURL(type = 'code', scope: string, uri: string) {
    const url = new URL(AUTHORIZE_URL)
    url.searchParams.set('client_id', this.config.apiKey)
    url.searchParams.set('response_type', type)
    url.searchParams.set('scope', scope)
    url.searchParams.set('redirect_uri', uri)
    return url.href
  }

  public getOAuthAccessToken(code: string, uri: string) {
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
    const formData = new URLSearchParams()
    formData.append('code', code)
    formData.append('grant_type', 'authorization_code')
    formData.append('client_id', this.config.apiKey)
    formData.append('client_secret', this.config.apiSecret)
    formData.append('redirect_uri', uri)
    return axios
      .post<AccessToken>(ACCESS_TOKEN_URL, formData.toString(), config)
      .then((response) => response.data)
      .catch((error) => Promise.reject(normalizeAxiosError(error)))
  }

  public refreshOAuthAccessToken<T = any>(refreshtoken: string) {
    const url = new URL(ACCESS_TOKEN_URL)
    url.searchParams.set('grant_type', 'refresh_token')
    url.searchParams.set('refresh_token', refreshtoken)
    url.searchParams.set('client_id', this.config.apiKey)
    url.searchParams.set('client_secret', this.config.apiSecret)
    return axios
      .get<T>(url.href)
      .then((response) => response.data)
      .catch((error) => Promise.reject(normalizeAxiosError(error)))
  }
}
