const HALF_PI = Math.PI/180
const DISTANCE = 400
const SCALE = 0.025

/*
  Given the camera's rotation about the x and y axes, as well as the location of
  a touch event relative to the center of the screen (and scaled) this function
  returns a vec3 of the location of the touch event in coordinate space of the
  camera.
*/
function getSceneTouchLocation(camPhi, camTheta, horizontalShift, verticalShift, height) {
    const posX = Number(-Math.sqrt(DISTANCE)*Math.sin(camTheta)) + Number(horizontalShift*Math.cos(camTheta))
    const posY = Number(Math.sqrt(DISTANCE)*Math.sin(camPhi)) + Number((verticalShift + height)*Math.cos(camPhi))
    const posZ = Number(-1*Math.sqrt(DISTANCE)*Math.cos(camTheta)*Math.abs(Math.cos(camPhi))) + Number(verticalShift*Math.sin(camPhi)) - Number(horizontalShift*Math.sin(camTheta))

    return new AFRAME.THREE.Vector3(posX, posY, posZ) //{x: posX, y: posY, z: posZ}
}

AFRAME.registerComponent('touch-listener', {
  schema: {
    dragEnabled: {default: true},
    offsetPosition: {default: '0 0 0'},
    offsetRotation: {default: '0 0 0'},
    primitive: {default: 'circle'},
    scale: {default: '1 1 1'}
  },
  init: function() {
    this.posOffset = AFRAME.utils.coordinates.parse(this.data.offsetPosition)
    this.rotOffset = AFRAME.utils.coordinates.parse(this.data.offsetRotation)
  },
  play: function() {
    const scene = document.querySelector('a-scene')
    const cam = document.querySelector('a-camera')

    let Y_THRESHOLD = scene.systems['magic-window-drawing'].data.yThreshold

    const height = Number(cam.getAttribute('userHeight'))
    let camTHREE = cam.object3D.children[1]

    let Y_FOV = camTHREE.fov*HALF_PI
    let X_FOV = 2*Math.atan(Math.tan(Y_FOV*0.5)*camTHREE.aspect)

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

      const convertedTouch = getSceneTouchLocation(camPhi, camTheta, horizontalShift, verticalShift, height)

      if (!convertedTouch.x || !convertedTouch.y || !convertedTouch.z) {return}

      const circle = document.createElement(`a-${this.data.primitive}`)

      circle.setAttribute('position', {
        'x': convertedTouch.x + this.posOffset.x,
        'y': convertedTouch.y + this.posOffset.y,
        'z': convertedTouch.z + this.posOffset.z
      })

      circle.setAttribute('rotation', {
        'x': camPhi/HALF_PI + this.rotOffset.x,
        'y': camTheta/HALF_PI + this.rotOffset.y,
        'z': 0 + this.rotOffset.z
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
  }
})
