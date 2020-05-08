<!--<template src="./TinyMCE.html"></template>-->

<script>
import tinymce from 'tinymce/tinymce'
import lists from 'tinymce/plugins/lists/index'
import paste from 'tinymce/plugins/paste/index'
import 'tinymce/themes/modern/theme'
import sanitizeOptions from './sanitizeOptions'

export default {
  name: 'TinyMCE',

  template: require('./TinyMCE.html'),

  props: [
    'value',
    'id'
  ],

  mounted: function () {
    let vm = this
    let options
    this.allowSetContent = true

    options = {
      selector: '#' + this.id,
      height: 200,
      menubar: 'edit format',
      plugins: 'lists paste',
      toolbar: 'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview media | forecolor backcolor emoticons | codesample | subscript superscript | elleft elright | register endash',
      valid_elements: '*[*]',
      image_title: true,
      language_url: '/theme/tinymce/ru.js',
      block_formats: 'Paragraph=p;Heading 3=h3;Heading 4=h4;Heading 5=h5;Heading 6=h6;Preformatted=pre',
      style_formats: [
        {
          title: 'Headers',
          items: [
            {title: 'Header 3', format: 'h3'},
            {title: 'Header 4', format: 'h4'},
            {title: 'Header 5', format: 'h5'},
            {title: 'Header 6', format: 'h6'}
          ]
        },
        {
          title: 'Inline',
          items: [
            {title: 'Bold', icon: 'bold', format: 'bold'},
            {title: 'Italic', icon: 'italic', format: 'italic'},
            {title: 'Underline', icon: 'underline', format: 'underline'},
            {title: 'Strikethrough', icon: 'strikethrough', format: 'strikethrough'},
            {title: 'Superscript', icon: 'superscript', format: 'superscript'},
            {title: 'Subscript', icon: 'subscript', format: 'subscript'},
            {title: 'Code', icon: 'code', format: 'code'}
          ]
        },
        {
          title: 'Blocks',
          items: [
            {title: 'Paragraph', format: 'p'},
            {title: 'Blockquote', format: 'blockquote'},
            {title: 'Div', format: 'div'},
            {title: 'Pre', format: 'pre'}
          ]
        },
        {
          title: 'Alignment',
          items: [
            {title: 'Left', icon: 'alignleft', format: 'alignleft'},
            {title: 'Center', icon: 'aligncenter', format: 'aligncenter'},
            {title: 'Right', icon: 'alignright', format: 'alignright'},
            {title: 'Justify', icon: 'alignjustify', format: 'alignjustify'}
          ]
        }
      ],
      paste_preprocess: function (plugin, args) {
        let dirty = args.content
        args.content = sanitizeHtml(dirty, sanitizeOptions)
      }
    }

    options.setup = function (editor) {
      editor.on('keyup SetContent', function (e) {
        vm.$emit('input', editor.getContent())
      })

      editor.on('blur', function () {
        vm.allowSetContent = true
      })

      editor.on('focus', function () {
        vm.allowSetContent = false
      })

      editor.addButton('register', {
        text: '®',
        tooltip: 'Вставить символ ®',
        onclick: function () {
          editor.insertContent('®')
        }
      })

      editor.addButton('elleft', {
        text: '«',
        tooltip: 'Вставить символ «',
        onclick: function () {
          editor.insertContent('«')
        }
      })

      editor.addButton('elright', {
        text: '»',
        tooltip: 'Вставить символ »',
        onclick: function () {
          editor.insertContent('»')
        }
      })

      editor.addButton('endash', {
        text: '–',
        tooltip: 'Вставить символ –',
        onclick: function () {
          editor.insertContent('–')
        }
      })
    }

    tinymce.remove(options.selector)

    let that = this
    tinymce.init(options).then(function (editors) {
      if (!vm.editor) {
        vm.editor = editors[0]
        if (that.value && that.allowSetContent) {
          that.editor.setContent(that.value)
        }
      }
    })
  },

  watch: {
    value: function (content) {
      if (content && this.editor && this.allowSetContent) {
        this.editor.setContent(content)
      }
    }
  }
}
</script>
