export const VideoMixin = {
  methods: {
    /**
         * Add carousel in article content
         */
    initYoutubeWrapper () {
      if (typeof window.youtubeInitialized !== 'undefined') {
        return
      }

      let $ytIframes = $('iframe[src*="youtube.com"]')
      $ytIframes.each(function (i, e) {
        let $ytFrame = $(e)
        $ytFrame.parent().addClass('video')
      })

      let $vmIframes = $('iframe[src*="vimeo.com"]')
      $vmIframes.each(function (i, e) {
        let $vmFrame = $(e)
        $vmFrame.parent().addClass('video')
      })

      window.youtubeInitialized = true
    }
  }
}
