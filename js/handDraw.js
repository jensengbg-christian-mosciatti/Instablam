import { setState } from './index.js'

let mouseUp = null
let mouseDn = null
let mouseMove = null
export function handDraw(draw = true) {
  if (!draw) {
    canvas.removeEventListener('mousemove', mouseMove)
    canvas.removeEventListener('mousedown', mouseDn)
    canvas.removeEventListener('mouseup', mouseUp)
    canvas.removeEventListener('touchstart', mouseDn)
    canvas.removeEventListener('touchend', mouseUp)
    canvas.removeEventListener('touchmove', mouseMove)

    setState(null)
    // document.querySelector('.btn-draw').textContent = 'Draw on your picture'
    return
  }

  setState('draw')
  // document.querySelector('.draw-btn').textContent = 'Stop Drawing'

  const ctx = canvas.getContext('2d')
  ctx.lineWidth = (canvas.width * canvas.height) / 100000
  //   ctx.beginPath()
  //   ctx.rect(0, 0, 600, 600)
  //   ctx.stroke()

  //   for (let i = 50; i < 600; i += 50) {
  //     ctx.beginPath()
  //     ctx.moveTo(i, 0)
  //     ctx.lineTo(i, 600)
  //     ctx.stroke()
  //   }

  let prevX
  let prevY
  let isDrawing = false

  if (!mouseUp)
    mouseUp = function (event) {
      isDrawing = false
      prevX = null
      prevY = null
      event.preventDefault()
    }

  if (!mouseDn)
    mouseDn = function (event) {
      isDrawing = true
      event.preventDefault()
    }

  canvas.addEventListener('mousedown', mouseDn)
  canvas.addEventListener('mouseup', mouseUp)
  canvas.addEventListener('touchstart', mouseDn)
  canvas.addEventListener('touchend', mouseUp)

  // const coords = document.getElementById('coords')

  if (!mouseMove)
    mouseMove = function (event) {
      if (!isDrawing) {
        prevX = null
        prevY = null
        return
      }
      let clientX, clientY
      if (event.targetTouches) {
        clientX = event.targetTouches[0].clientX
        clientY = event.targetTouches[0].clientY
      } else {
        clientX = event.clientX
        clientY = event.clientY
      }

      let x =
        (clientX - canvas.offsetLeft) / (canvas.clientWidth / canvas.width)
      let y =
        (clientY -
          canvas.offsetTop -
          document.documentElement.children[1].firstElementChild.clientHeight +
          document.documentElement.scrollTop) /
        (canvas.clientHeight / canvas.height)

      // (clientY - canvas.offsetTop + document.documentElement.scrollTop) /
      // (canvas.clientHeight / canvas.height)

      // console.log('lineWidth:', ctx.lineWidth)
      // console.log(`
      //   1=${clientX},
      //   2=${canvas.offsetLeft},
      //   3=${canvas.clientWidth},
      //   4=${canvas.width}
      //   `)

      // let y = event.clientY / (canvas.clientHeight / canvas.height)
      // coords.textContent = `x=${x}, y=${y}`

      if (prevX && prevY) {
        ctx.beginPath()
        ctx.moveTo(prevX, prevY)
        ctx.lineTo(x, y)
        ctx.stroke()
        ctx.closePath()
        //   console.log(`drawing x=${prevX}-${x}, y=${prevY}-${y}`)
        //   console.dir(document.getElementById('canvas'))
      }
      prevX = x
      prevY = y
      event.preventDefault()
    }
  canvas.addEventListener('mousemove', mouseMove)
  canvas.addEventListener('touchmove', mouseMove)
}
