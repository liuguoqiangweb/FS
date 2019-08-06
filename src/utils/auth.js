import Cookies from 'js-cookie'

const TokenKey = 'token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

const UserInfo = JSON.stringify({ UserNo: 'xxx', UserName: 'xxx', FirstLogin: false })

export function getUserInfo() {
  return Cookies.get(UserInfo)
}

export function setUserInfo(data) {
  return Cookies.set(UserInfo, JSON.stringify(data))
}

export function removeUserInfo() {
  return Cookies.remove(UserInfo)
}

const SecretKey = 'string'

export function getSecretKey() {
  return Cookies.get(SecretKey)
}

export function setSecretKey(secret) {
  return Cookies.set(SecretKey, secret)
}

export function removeSecretKey() {
  return Cookies.remove(SecretKey)
}
