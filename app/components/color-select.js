AFRAME.registerComponent('color-select', {
  init: function() {
    console.log('init color-select')
  },
  play: function() {
    const Y_THRESHOLD = window.innerHeight - window.innerHeight/3.5

    const cycleColor = () => {
      if (this.el.sceneEl.systems['magic-window-drawing'].data.currentColor === this.el.sceneEl.systems['magic-window-drawing'].data.colors.length - 1) {
        this.el.sceneEl.systems['magic-window-drawing'].data.currentColor = 0
      }
      else{
        this.el.sceneEl.systems['magic-window-drawing'].data.currentColor ++
      }

      this.el.setAttribute('color', this.el.sceneEl.systems['magic-window-drawing'].data.colors[this.el.sceneEl.systems['magic-window-drawing'].data.currentColor])
    }

    window.addEventListener('touchstart', event => {
      if (event.touches[0].pageY > Y_THRESHOLD)
        cycleColor()
    })
  },
  pause: function() {

  }
})
