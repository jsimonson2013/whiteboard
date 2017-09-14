AFRAME.registerComponent('touch-listener', {
  schema: {
    dragEnabled: {default: true},
    position: {default: '0 0 0'},
    primitive: {default: 'circle'},
    rotation: {default: '0 0 0'},
    scale: {default: '1 1 1'}
  },
  init: function() {

  },
  play: function() {
    const NULL_VAL = -9999999
    const HALF_PI = Math.PI/180
    const DISTANCE = 400
    const SCALE = 0.025

    const cam = document.querySelector('a-camera')
    const scene = document.querySelector('a-scene')

    let Y_THRESHOLD = scene.systems['magic-window-drawing'].data.yThreshold

    const height = Number(cam.getAttribute('userHeight'))
    let camTHREE = cam.object3D.children[1] // get the THREE.js PerspectiveCamera

    let Y_FOV = camTHREE.fov*HALF_PI
    let X_FOV = 2*Math.atan(Math.tan(Y_FOV*0.5)*camTHREE.aspect) // r = tan(H/2)/tan(Y/2)

    let RANGE_X = DISTANCE*Math.tan(X_FOV)
    let RANGE_Y = DISTANCE*Math.tan(Y_FOV)

    let winWidth = window.innerWidth
    let winHeight = window.innerHeight

    // recalculate aspect values when orientation changes
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        camTHREE = document.querySelector('a-camera').object3D.children[1]

        Y_FOV = camTHREE.fov*HALF_PI
        X_FOV = 2*Math.atan(Math.tan(Y_FOV*0.5)*camTHREE.aspect)

        RANGE_X = DISTANCE*Math.tan(X_FOV)
        RANGE_Y = DISTANCE*Math.tan(Y_FOV)

        winWidth = window.innerWidth
        winHeight = window.innerHeight

        Y_THRESHOLD = winHeight - winHeight/3.5
        scene.systems['magic-window-drawing'].data.yThreshold = Y_THRESHOLD
      }, 1000)
    })

    placeCircleAtTouch = touch => {
      if (touch.pageY > Y_THRESHOLD) {return}

      const camPhi = cam.getAttribute('rotation').x*HALF_PI
      const camTheta = cam.getAttribute('rotation').y*HALF_PI

      const horizontalShift = SCALE*RANGE_X/(winWidth*0.5)*(touch.pageX - winWidth*0.5)
      const verticalShift = SCALE*RANGE_Y/(winHeight*0.5)*(winHeight*0.5 - touch.pageY)

      const circle = document.createElement(`a-${this.data.primitive}`)

      const posX = Number(-Math.sqrt(DISTANCE)*Math.sin(camTheta)) + Number(horizontalShift*Math.cos(camTheta))
      const posY = Number(Math.sqrt(DISTANCE)*Math.sin(camPhi)) + Number((verticalShift + height)*Math.cos(camPhi))
      const posZ = Number(-1*Math.sqrt(DISTANCE)*Math.cos(camTheta)*Math.abs(Math.cos(camPhi))) + Number(verticalShift*Math.sin(camPhi)) - Number(horizontalShift*Math.sin(camTheta))

      if (!posX || !posY || !posZ) {return} // return if NaN during position calculations

      circle.setAttribute('position', {
        'x': posX,
        'y': posY,
        'z': posZ
      })

      circle.setAttribute('rotation', {
        'x': camPhi/HALF_PI,
        'y': camTheta/HALF_PI,
        'z': 0
      })

      circle.setAttribute('material', {
        'side': 'double',
        'color': scene.systems['magic-window-drawing'].data.colors[scene.systems['magic-window-drawing'].data.currentColor]
      })

      circle.setAttribute('geometry',{
        'radius': 0.1
      })

      scene.appendChild(circle)
    }

    window.addEventListener('touchstart', event => {
      placeCircleAtTouch(event.touches[0])
    })

    window.addEventListener('touchmove', event => {
      if (!this.data.dragEnabled) {return}

      placeCircleAtTouch(event.touches[0])
    })

    window.addEventListener('touchend', event => {
      placeCircleAtTouch(event.changedTouches[0])
    })
  },
  pause: function() {

  }
})
