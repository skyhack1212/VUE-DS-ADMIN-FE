import Cookies from 'js-cookie'

const userKey = 'authcenter_usr'

export function getUser() {
  return Cookies.get(userKey)
}

export function setUser(user) {
  return Cookies.set(userKey, user)
}

export function removeUser() {
  return Cookies.remove(userKey)
}
