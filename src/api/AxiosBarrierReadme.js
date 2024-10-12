/* eslint-disable no-undef */
import axios from 'axios'


// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.post['Content-Type'] = 'application/json';


const config = {
  // baseURL: 'http://127.0.0.1:8081/deoapp-indonesia/asia-southeast2',
  baseURL: import.meta.env.VITE_FUNCTIONS_HOST,
  timeout: 60 * 1000, // Timeout
}


const _axiosReadme = axios.create(config,)


_axiosReadme.interceptors.request.use(async (config,) => {

  const token = import.meta.env.VITE_FUNCTIONS_KEY_README

  if(token){
    config.headers['x-api-key'] = `${ token }`
  }
  return config
},) 

// Add a response interceptor
_axiosReadme.interceptors.response.use(
  function (response,) {
    // Do something with response data
    response = typeof response.data !== 'undefined' ? response.data : response
    return response
  },
  
  function (error,) {
    if (error.response.status===404) {
      // return window.location.href = '/error/error-404'
    }
    else if(error.response.status===401){
    //  return window.location.href = '/error/error-401'
    }
    return Promise.reject(error,)
  },
)


export default _axiosReadme