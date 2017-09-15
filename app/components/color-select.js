AFRAME.registerComponent('color-select', {
  init: function() {
    console.log('init color-select')
  },
  play: function() {
    const systemData = this.el.sceneEl.systems['magic-window-drawing'].data

    const colors = systemData.colors
    let curr = systemData.currentColor

    const cycleColor = () => {
      if (curr === colors.length - 1) {
        curr = 0
      }
      else{
        curr ++
      }

      this.el.setAttribute('color', colors[curr])

      this.el.sceneEl.systems['magic-window-drawing'].data.currentColor = curr
    }

    window.addEventListener('touchstart', event => {
      if (event.touches[0].pageY > this.el.sceneEl.systems['magic-window-drawing'].data.yThreshold)
        cycleColor()
    })
  },
  pause: function() {

  }
})
