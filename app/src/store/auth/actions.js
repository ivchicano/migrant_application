import { axiosInstance } from 'boot/axios'
import { Cookies } from 'quasar'

const REGISTER_ROUTE = '/auth/register'
const VERIFICATION_ROUTE = '/auth/verify'
const LOGIN_ROUTE = '/auth/login'
const FETCH_USER_ROUTE = '/auth/user'
const PASSWORD_FORGOT_ROUTE = '/auth/password/forgot'
const PASSWORD_RESET_ROUTE = '/auth/password/reset'

export function register (state, data) {
  return axiosInstance.post(REGISTER_ROUTE, data)
}

export function login (state, data) {
  console.log("before login")
  console.log(data)
  return new Promise(function (resolve, reject) {
    axiosInstance
      .post("https://localhost:9443/api/identity/auth/v1.1/authenticate", data.body, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
      .then(response => {
        console.log("received responsa from ID")
        console.log(response)
        // state.commit('setUser', response.data.user.data)
        const token = response.data.token
        axiosInstance.defaults.headers.common['Authorization'] =
          'Bearer ' + token
        state.dispatch('setToken', {
          token: token,
          rememberMe: data.rememberMe
        })
        return resolve()
      })
      .catch(error => {
        return reject(error)
      })
  })

}

export function setToken (state, data) {
  axiosInstance.defaults.headers.common['Authorization'] =
    'Bearer ' + data.token
  if (data.rememberMe) {
    Cookies.set('authorization_token', data.token, {
      expires: 365
    })
  } else {
    Cookies.set('authorization_token', data.token)
  }
}

export async function fetch (state) {
  console.log("in fetch")
  if (state.user) {
    console.log("found user")
    console.log(state.user)
    return true
  }
  var token = Cookies.get('authorization_token')
  console.log(token)
  if (token) {
    console.log("found token in cookies and fetching user")
    axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + token
    return axiosInstance.get(FETCH_USER_ROUTE).then(response => {
      state.commit('setUser', response.data.data)
    })
  }
}

export function logout (state) {
  Cookies.remove('authorization_token')
  state.commit('setUser', null)
}

export function verify (state, token) {
  return axiosInstance.get(VERIFICATION_ROUTE + '?token=' + token)
}
export function passwordForgot (state, data) {
  return axiosInstance.post(PASSWORD_FORGOT_ROUTE, data)
}

export function passwordReset (state, { token, data }) {
  return axiosInstance.post(PASSWORD_RESET_ROUTE + '?token=' + token, data)
}
