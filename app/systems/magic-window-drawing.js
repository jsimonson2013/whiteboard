AFRAME.registerSystem('magic-window-drawing', {
  schema: {
    'colors': {default: ['']},
    'currentColor': {default: 0}
  },
  init: function() {
    console.log('init magic-window-drawing')

    this.data.colors = [
      'red',
      'orange',
      'yellow',
      'green',
      'blue',
      'violet'
    ]

    this.data.currentColor = 0
  }
})
