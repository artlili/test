export default class SmoothScrollService {
  constuctor () {
    this.timeout = null
  }

  scrollToTop () {
    if (document.body.scrollTop !== 0 || document.documentElement.scrollTop !== 0) {
      window.scrollBy(0, -50)
      this.timeOut = setTimeout(this.scrollToTop.bind(this), 10)
    } else {
      clearTimeout(this.timeOut)
    }
  }

  scrollToAnchor (aid) {
    let aTag = $('#' + aid)
    if (typeof aTag !== 'undefined') {
      if (typeof aTag.offset() !== 'undefined') {
        $('html,body').animate({scrollTop: aTag.offset().top - 200}, 'slow')
      }
    }
  }

  scrollToAnchorExact (aid) {
    let aTag = $('#' + aid)
    if (typeof aTag !== 'undefined') {
      if (typeof aTag.offset() !== 'undefined') {
        $('html,body').animate({scrollTop: aTag.offset().top}, 'slow')
      }
    }
  }
}
