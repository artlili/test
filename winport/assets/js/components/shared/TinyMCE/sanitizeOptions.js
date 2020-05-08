export default {
  allowedTags: ['h3', 'h4', 'h5', 'h6', 'p', 'strong', 'em', 'sup', 'sub', 'pre', 'ul', 'ol', 'li', 'b', 'i', 'code', 'blockquote', 'div'],
  allowedAttributes: {
    'p': ['style']
  },
  allowedStyles: {
    'p': {
      'text-align': [/^left$/, /^right$/, /^center$/, '/^justify$/']
    }
  }
}
