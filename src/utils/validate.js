/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validPassword(str) {
  const reg = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&amp;*()_+`\-={}:";'<>?,.\/]).{8,18}$/
  return reg.test(str)
}

export function validPhone(phone) {
  if (phone && ((/^1[3-8]\d{9}$/).test(phone))) {
    return true
  }
  return false
}
