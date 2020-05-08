import Config from '../config/main.json'
import ConfigLocal from '../config/main-local.json'

let mergedConfig = Object.assign(Config, ConfigLocal)

export default {

  getSetting (param) {
    let value = mergedConfig[param]
    return value || null
  }

}
