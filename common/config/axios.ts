import axios from "axios"

axios.interceptors.request.use(
  config => config,
  error => Promise.reject(error.request.data),
)

axios.interceptors.response.use(
  config => config,
  error => Promise.reject(error.response.data),
)

export { axios }
