import ConfigService from '@/services/ConfigService'

export default {
  setTags (title, keywords, description) {
    this.setTitle(title)
    this.setKeywords(keywords)
    this.setDescription(description)

    return true
  },

  setTitle (title) {
    document.title = title || ConfigService.getSetting('defaultTitle')
  },

  setKeywords (keywords) {
    var isMetaKeywordExists = document.head.querySelector('meta[name=keywords]')
    if (!keywords && isMetaKeywordExists) {
      document.head.querySelector('meta[name=keywords]').remove()
    }
    if (keywords) {
      if (!isMetaKeywordExists) {
        var meta = document.createElement('meta')
        meta.name = 'keywords'
        meta.content = ''
        document.getElementsByTagName('head')[0].appendChild(meta)
      }
      document.head.querySelector('meta[name=keywords]').content = keywords
    }
  },

  setDescription (description) {
    var realDescription = description || ConfigService.getSetting('defaultDescription')
    document.head.querySelector('meta[name=description]').content = realDescription
  },

  setCanonical (url) {
    var isCanonicalExists = document.head.querySelector('link[rel=canonical]')
    if (!isCanonicalExists) {
      var link = document.createElement('link')
      link.rel = 'canonical'
      link.href = ''
      document.getElementsByTagName('head')[0].appendChild(link)
    }
    document.head.querySelector('link[rel=canonical]').href = url
  }
}
