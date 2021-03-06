var vw = window.innerWidth

var isDragging = false
var dragStart = {}
var dragEnd = {}

var xRotation = 60
var yRotation = 0
var zRotation = 45

var $plane = document.getElementById('plane')
var $perspectiveKnob = document.querySelector('#perspective .knob')

/** METHODS **/
function setDragStart(e) {
  if (e.touches)
    e = e.touches["0"];

  dragStart = { x: e.pageX, y: e.pageY }
}

function calculateRotations(e) {

  if (e.touches)
    e = e.touches["0"];

  dragEnd = { x: e.pageX, y: e.pageY }

  var dragDiffX = dragEnd.x - dragStart.x
  var dragDiffY = dragEnd.y - dragStart.y

  xRotation -= dragDiffY / 50
  zRotation -= dragDiffX / 50

  if (xRotation < 0) xRotation = 0
  if (xRotation > 90) xRotation = 89
}

function applyRotations(node, x, y, z) {
  var rotationString = `rotateX(${x}deg) rotateY(${y}deg) rotateZ(${z}deg)`
  node.style.transform = rotationString
}

function startDrag(e) {
  if (e.path && e.path.indexOf($perspectiveKnob) !== -1) return

  var targetTouches = e.targetTouches ? Array.prototype.slice.apply(e.targetTouches) : null
  if (targetTouches && targetTouches.indexOf($perspectiveKnob) !== -1) return

  // setup move listeners
  document.addEventListener('mousemove', drag)
  document.addEventListener('touchmove', drag)

  setDragStart(e)
}

function endDrag() {

  // tear down move listeners
  document.removeEventListener('mousemove', drag)
  document.removeEventListener('touchmove', drag)
}

function drag(e) {
  if (!e.touches)
    e.preventDefault()
  // console.log("drag",e)
  calculateRotations(e)

  // when the browser is ready, apply the new positioning
  window.requestAnimationFrame( function(){
    applyRotations($plane, xRotation, yRotation, zRotation)
  })
}

/** EVENT LISTENERS **/
document.addEventListener('mousedown', startDrag)
document.addEventListener('touchstart', startDrag)

document.addEventListener('mouseup', endDrag)
document.addEventListener('touchend',  endDrag)

/** RUN **/
setTimeout(() => {
  applyRotations($plane, xRotation, yRotation, zRotation)
})