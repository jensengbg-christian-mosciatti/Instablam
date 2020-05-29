// registerServiceWorker()
import service from './service.js'
service()
import { checkPermissions } from './cameraPermissions.js'
// import { getOrientation } from './imageOrientation.js'
import { handDraw } from './handDraw.js'
import { dbClick } from './dbClick.js'
import { addSvg } from './addSvg.js'

let stream = null
export let state = null
export const setState = (newVal) => (state = newVal)
let Caman = null
let canvas = document.getElementById('canvas')
let captureImg = null

// function registerServiceWorker() {
//   if ('serviceWorker' in navigator) {
//     navigator.serviceWorker
//       .register('../sw.js')
//       .then(() => console.log('Registered service worker'))
//       .catch((error) => console.log('Error register service worker ', error))
//   }
// }

document.addEventListener('DOMContentLoaded', function () {
  Caman = window.Caman
})

const cameraBtn = document.querySelector('.camera-btn')
cameraBtn.addEventListener('click', function () {
  if (stream == null) getMedia()
  else stopVideo()
})

document.querySelector('.video-ph').addEventListener('click', function () {
  if (stream == null) getMedia()
})

let permission = null
async function updPermission() {
  permission = await checkPermissions()
}
updPermission()

async function getMedia() {
  if (stream == null)
    if (['granted', 'prompt'].indexOf(permission.state) > -1) {
      try {
        // stream = await navigator.mediaDevices.getUserMedia({ video: true })
        stream = await navigator.mediaDevices.getUserMedia({
          video: { height: { max: 1280 }, width: { max: 720 } },
        })
        updPermission()
        const videoElem = document.querySelector('.camera')
        videoElem.srcObject = stream

        captureImg = new ImageCapture(stream.getVideoTracks()[0])

        videoElem.onloadedmetadata = () => {
          videoElem.play()
          document.querySelector('.video-ph').classList.add('hide')

          canvas.classList.add('hide')
          canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)

          videoElem.classList.remove('hide')

          // cameraBtn.textContent = 'STOP camera'
          cameraBtn.classList.add('hide')
          takePhotoBtn.classList.remove('hide')
        }
        // randomiseHue(videoElem);
      } catch (error) {
        updPermission()
        console.log('Error: ', error)
      }
    }
}

function stopVideo(takePhoto = false) {
  if (stream != null) {
    const videoElem = document.querySelector('.camera')
    videoElem.classList.add('hide')
    if (!takePhoto) document.querySelector('.video-ph').classList.remove('hide')
    videoElem.pause()
    stream.getTracks().forEach(function (track) {
      track.stop()
    })
    videoElem.srcObject = null
    stream = null
    // cameraBtn.textContent = 'START camera'
    cameraBtn.classList.remove('hide')
    takePhotoBtn.classList.add('hide')
    document.querySelector('.camera').classList.add('hide')
    canvas.classList.remove('hide')
  }
}

async function takePhotoClick() {
  // const videoTrack = stream.getVideoTracks()[0]
  // const captureImg = new ImageCapture(videoTrack)
  const blob = await captureImg.takePhoto({ imageWidth: 1024 })
  // const blob = await captureImg.takePhoto()
  // const arrayBuff = await blob.arrayBuffer()

  // getOrientation(arrayBuff, function (orientation) {
  //   alert('orientation: ' + orientation)
  // })

  // console.log('arraybuffer: ', arrayBuff)
  // const imageBitmap = await createImageBitmap(blob)
  // const photoCap = await captureImg.getPhotoCapabilities()
  // console.log('photoCap', photoCap)
  // const imageBitmap = await captureImg.grabFrame()

  // const data = await window.loadImage(blob, {
  // maxWidth: 1024,
  // maxHeight: 1024,
  // minWidth: 100,
  // minHeight: 50,

  // crop: true,
  //   canvas: true,
  //   orientation: true,
  // })

  // console.log(data)
  // data.image.id = 'canvas'
  // const p = document.getElementById('canvascont')
  // canvas = p.appendChild(data.image)
  canvas.removeAttribute('data-caman-id')
  const imgSrc = URL.createObjectURL(blob)
  const img = new Image()
  img.onload = () => {
    drawCanvas(canvas, img)
    // console.log(img)
  }
  img.src = imgSrc
  // const imageTag = document.getElementById('photo')
  // imageTag.src = img
  // imageTag.onload = () => {
  //   console.dir(imageTag)
  // }

  stopVideo(true)

  URL.revokeObjectURL(blob)
  // if (canvas) canvas.remove()
}

function drawCanvas(canvas, img) {
  //   canvas.width = getComputedStyle(canvas).width.split('px')[0]
  //   canvas.height = getComputedStyle(canvas).height.split('px')[0]

  canvas.width = img.width
  canvas.height = img.height
  // console.dir(img)
  // const imgUrl = URL.createObjectURL(blob)
  // const imag = new Image()
  // imag.onload = function () {
  //   console.log(img)
  // }
  // imag.src = imgUrl

  let ratio = Math.min(canvas.width / img.width, canvas.height / img.height)
  let x = (canvas.width - img.width * ratio) / 2
  let y = (canvas.height - img.height * ratio) / 2
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(
    img,
    0,
    0,
    img.width,
    img.height,
    x,
    y,
    img.width * ratio,
    img.height * ratio
  )
  // ctx.beginPath()
  // ctx.rect(0, 0, 600, 600)
  // ctx.stroke()
}

const takePhotoBtn = document.querySelector('.capture-btn')
takePhotoBtn.addEventListener('click', function () {
  // captureImage()
  takePhotoClick()
})

document.querySelector('.btn-draw').innerHTML = addSvg('.btn-draw')

document.querySelector('.btn-draw').addEventListener('click', function () {
  if (state !== 'draw') handDraw()
  else handDraw(false)
})
document.querySelector('.btn-filter').innerHTML = addSvg('.btn-filter')
document.querySelector('.btn-filter').addEventListener('click', filters)
function filters() {
  document.querySelector('.wrapper-filters').classList.toggle('hide')
}

// document.querySelector('.caman-btn').addEventListener('click', updCaman)

const inputRangeArray = []
document.querySelectorAll('.slidercontainer input').forEach((el) => {
  el.onchange = updCaman
  el.addEventListener('touchend', dbClick)
  el.addEventListener('mouseup', dbClick)
  inputRangeArray.push({
    id: el.id,
    type: el.attributes.camanprop.nodeValue,
    multiplier: el.attributes.camanmultiplier
      ? el.attributes.camanmultiplier.nodeValue
      : 1,
    ref: el,
    textRef: document.getElementById(el.id + 'txt'),
  })
})

function getInputFuncString() {
  // let string = `console.log('inner', e)
  // this.revert(true)`
  let string = `this.revert(true)`
  inputRangeArray.forEach((el) => {
    // console.log('calc', el)
    if (el.ref.type === 'range' && el.ref.value != 0) {
      string = `${string}
      this.${el.type}(Number(${el.ref.value})*Number(${el.multiplier}))`
    } else if (el.ref.type === 'checkbox' && el.ref.checked === true)
      string = `${string}
      this.${el.type}()`
  })
  return `${string}
  this.render()`
}

function updCaman(event) {
  const elRef = document.getElementById(event.target.id + 'txt')
  if (elRef) elRef.textContent = event.target.value
  const camanFunction = new Function('e', getInputFuncString())
  // console.log(camanFunction.toString())
  Caman('#canvas', camanFunction)
  // canvas.getContext('2d')
  event.preventDefault()
}

document.getElementById('download').addEventListener('click', downloadImage)
function downloadImage(event) {
  this.href = canvas.toDataURL('image/jpeg')
}

;(function () {
  const wrpf = document.querySelector('.wrapper-filters')
  wrpf.addEventListener('mousedown', remOpacity)
  wrpf.addEventListener('touchstart', remOpacity)
  wrpf.addEventListener('mouseup', addOpacity)
  wrpf.addEventListener('touchend', addOpacity)
  function addOpacity() {
    wrpf.classList.add('opacity')
  }
  function remOpacity() {
    wrpf.classList.remove('opacity')
  }
})()
