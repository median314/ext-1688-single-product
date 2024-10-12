/* eslint-disable no-undef */
import axios from 'axios'

const config = {
  // baseURL: 'http://127.0.0.1:8081/deoapp-indonesia/asia-southeast2',
  // baseURL: process.env.REACT_APP_FUNCTIONS_HOST,
  baseURL: import.meta.env.VITE_FUNCTIONS_HOST,
  timeout: 60 * 1000, // Timeout
}


const _axios = axios.create(config,)


_axios.interceptors.request.use(async (config,) => {

  // const token = process.env.REACT_APP_PAYMENT_KEY
  const token = import.meta.env.VITE_FUNCTIONS_KEY
  if(token){
    config.headers['Authorization'] = `${ token }`
  }
  return config
},) 

// Add a response interceptor
_axios.interceptors.response.use(
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


export default _axios