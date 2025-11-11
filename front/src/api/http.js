import axios from 'axios'

// Prefer same-origin proxy path in production (Vercel rewrite: /api -> backend),
// and allow local/dev override via VUE_APP_API_BASE_URL.
// - In Vercel: baseURL defaults to '/api' (rewritten to backend by vercel.json)
// - In local dev: set VUE_APP_API_BASE_URL=http://125.6.40.169/api (or your dev server)
const baseURL = process.env.VUE_APP_API_BASE_URL || '/api'

const http = axios.create({
  baseURL,
  // headers: { 'Content-Type': 'application/json' }
})

export default http
