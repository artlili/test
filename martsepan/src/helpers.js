import { isProduction } from '@/constants'

export const uniqueId = function generateUniqueId () {
  return Math.round(Date.now() * Math.random())
}

export class Personal {
  constructor ({ name = '', id = uniqueId() } = {}) {
    this.name = name
    this.id = id
  }
}

/*
*  Функция принимает объект в виде {ключ: значение} и возвращает POST парамерты
* */
export function createPostParams (credentials) {
  const params = new URLSearchParams()
  Object.entries(credentials).forEach(([key, value]) => params.append(key, value))
  return params
}

export const filesEditDateFormat = function filesEditDateFormat (timestamp) {
  if (typeof timestamp !== 'number') return timestamp
  let date = new Date(timestamp * 1000)
  return `${date.toLocaleDateString('ru', { hour: 'numeric', minute: 'numeric', second: 'numeric' })}`
}

export function formatPrice (value, num = 2) {
  let _value = 0
  switch (typeof value) {
    case 'string':
      _value = parseFloat(value)
      if (isNaN(_value)) return 0
      break

    case 'number':
      _value = value
      break

    default:
      break
  }
  _value = formatMoney(_value, num, ' ', '.')
  return _value
}

export function formatNumber (value, num = void 0) {
  let _value = 0
  switch (typeof value) {
    case 'string':
      _value = parseFloat(value)
      if (isNaN(_value)) return 0
      break

    case 'number':
      _value = value
      break

    default:
      break
  }
  let a = _value % 1
  a.toString()
  // if (num !== void 0) _value = _value.toFixed(num)
  return _value
}

export function formatSize (size) {
  if (size === void 0) return '-'
  if (size <= 0) {
    return '0 bytes'
  }
  const abbreviations = ['bytes', 'kB', 'MB', 'GB']
  const index = Math.floor(Math.log(size) / Math.log(1000))
  return `${+(size / Math.pow(1000, index)).toPrecision(3)} ${abbreviations[index]}`
}

export function formatDate (dateString) {
  return new Date(dateString).toLocaleDateString('ru')
}

export class ErrorResponse {
  constructor (
    {
      errorMessage = '',
      data = null,
      responseCode = null
    } = {}
  ) {
    this.errorMessage = errorMessage
    this.data = data
    this.responseCode = responseCode
  }
}

export function validateResponse (response, config = {}) {
  let validator = void 0
  if (typeof config === 'function') {
    validator = config
  } else {
    validator = config.validator
  }
  if (config.log !== false && !(process.env.NODE_ENV === 'production')) {
    console.log('response', response)
  }
  const status = response.status
  if (status >= 200 && status < 300) {
    if (validator) {
      console.log('response.data', response.data)
      if (validator(response)) return response.data
      throw new ErrorResponse({ errorMessage: 'Error message', data: response.data })
    }
    return response.data
  }
  if (status === 401 || status === 403) {
    // show global error => logout => route to login page
    let message
    if (status === 401) {
      message = 'Unauthorized'
    } else {
      message = 'Forbidden. You have not enough rights.'
    }
    console.error(message)
    console.log(isProduction)
    if (isProduction) {
      console.log('adsasdasd')
      window.location = '/dilerlogin'
    } else {
      console.log('NE adsasdasd')
      // window.location = '/login.html'
    }
    // store.commit('setGlobalError', message)
    // store.dispatch('logout')
    // router.push({ name: 'sign' })
    throw new ErrorResponse({ responseCode: status })
  }
  if (status === 400) {
    // ошибки данных , тут у response будет тело ответа, где содержится инфа об ошибке
    throw new ErrorResponse({ data: response.data, responseCode: status })
  }
  if (status === 404) {
    // не найдено => global error
    // не глобальная
    // store.commit('setGlobalError', 'Nothing found on your request');
    throw new ErrorResponse(
      { errorMessage: 'Nothing found on your request', responseCode: status })
  }
  if (status === 409) {
    // conflict => show global error
    // store.commit('setGlobalError', 'Conflicted.');
    throw new ErrorResponse({ errorMessage: 'Conflicted.', responseCode: status })
  }
  if (status === 408) {
    // timeout => show global error
    // store.commit('setGlobalError', 'Request timeout.')
    throw new ErrorResponse({ responseCode: status })
  }
  if (status >= 500) {
    // внутренняя ошибка сервера => global error
    // store.commit('setServerError')
    throw new ErrorResponse({ responseCode: status })
  }
  throw new ErrorResponse({ errorMessage: response.statusText, responseCode: status })
}

/* eslint-disable */
function formatMoney (num, decPlaces, thouSeparator, decSeparator) {
  var n = num,
    decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces,
    decSeparator = decSeparator == undefined ? '.' : decSeparator,
    thouSeparator = thouSeparator == undefined ? ',' : thouSeparator,
    sign = n < 0 ? '-' : '',
    i = parseInt(n = Math.abs(+n || 0).toFixed(decPlaces)) + '',
    j = (j = i.length) > 3 ? j % 3 : 0;
  return sign + (j ? i.substr(0, j) + thouSeparator : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thouSeparator) + (decPlaces ? decSeparator + Math.abs(n - i).toFixed(decPlaces).slice(2) : '');
}

/* eslint-enable */

export function getCookie (name, decode = false) {
  let cookies = document.cookie.split(';')
  let result = cookies.find(cookie => cookie.indexOf(name) > -1)
  if (result && decode) return decodeURIComponent(result.trim().slice(name.length + 1))
  if (result) return result.trim().slice(name.length + 1)
  return void 0
}

// Подставка параметров для нового api
export function createParams (credentials) {
  const params = {
    'id': 1576735749898,
    'key': 'jksd32m9fdw03fjds9323jj9',
    'params': credentials
  }
  return params
}
