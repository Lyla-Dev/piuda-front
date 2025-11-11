import axios from 'axios'

// Base URL is configurable via environment variable. Fallback to deployed IP.
// Note: Include "/api" path to match current backend routes.
const baseURL = process.env.VUE_APP_API_BASE_URL || 'http://125.6.40.169/api'

const http = axios.create({
  baseURL,
  // You can add common headers here if needed
  // headers: { 'Content-Type': 'application/json' }
})

export default http
