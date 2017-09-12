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
    const HALF_PI = Math.PI/180

    let cam = document.querySelector('a-camera').object3D.children[1] // get the THREE.js PerspectiveCamera
    const DISTANCE = 400
    const SCALE = 0.025

    let Y_FOV = cam.fov*HALF_PI
    let X_FOV = 2*Math.atan(Math.tan(Y_FOV*0.5)*cam.aspect) // r = tan(H/2)/tan(Y/2)

    const height = Number(document.querySelector('a-camera').getAttribute('userHeight'))
    const scene = document.querySelector('a-scene')

    let winWidth = window.innerWidth
    let winHeight = window.innerHeight

    let RANGE_X = DISTANCE*Math.tan(X_FOV)
    let RANGE_Y = DISTANCE*Math.tan(Y_FOV)

    // recalculate aspect values when orientation changes
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        winWidth = window.innerWidth
        winHeight = window.innerHeight

        cam = document.querySelector('a-camera').object3D.children[1]

        Y_FOV = cam.fov*HALF_PI
        X_FOV = 2*Math.atan(Math.tan(Y_FOV*0.5)*cam.aspect)

        RANGE_X = DISTANCE*Math.tan(X_FOV)
        RANGE_Y = DISTANCE*Math.tan(Y_FOV)
      }, 1000)
    })

    placeCircleAtTouch = touch => {
      const circle = document.createElement(`a-${this.data.primitive}`)

      const camPhi = document.querySelector('a-camera').getAttribute('rotation').x*HALF_PI
      const camTheta = document.querySelector('a-camera').getAttribute('rotation').y*HALF_PI

      const horizontalShift = SCALE*RANGE_X/(winWidth*0.5)*(touch.pageX - winWidth*0.5)
      const verticalShift = SCALE*RANGE_Y/(winHeight*0.5)*(winHeight*0.5 - touch.pageY)

      const posX = Number(-Math.sqrt(DISTANCE)*Math.sin(camTheta)) + Number(horizontalShift*Math.cos(camTheta)) || horizontalShift
      const posY = Number(Math.sqrt(DISTANCE)*Math.sin(camPhi)) + Number((verticalShift + height)*Math.cos(camPhi)) || height + verticalShift
      const posZ = Number(-1*Math.sqrt(DISTANCE)*Math.cos(camTheta)*Math.abs(Math.cos(camPhi))) + Number(verticalShift*Math.sin(camPhi)) - Number(horizontalShift*Math.sin(camTheta)) || DISTANCE

      console.log(`(${posX}, ${posY}, ${posZ}), (${camPhi}, ${camTheta})`)

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
