const env = process.env.NODE_ENV
let _NEXT_URL = process.env.NEXT_PUBLIC_LOCAL_URL
if (env == "production"){
  _NEXT_URL = process.env.NEXT_PUBLIC_SITE_URL
}
export const NEXT_URL = _NEXT_URL
export const API_URL = process.env.NEXT_PUBLIC_API_URL
export const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL