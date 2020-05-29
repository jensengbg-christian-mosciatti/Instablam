let timeout
let lastTap = 0
let elem = ''

export function dbClick(event) {
  const currentTime = new Date().getTime()
  const tapLength = currentTime - lastTap

  clearTimeout(timeout)
  if (tapLength < 500 && tapLength > 0 && elem === event.target.id) {
    elem = ''
    if (event.target.value >= -20 && event.target.value <= 20) {
      event.target.value = 0
      const ev = new Event('change')
      event.target.dispatchEvent(ev)
    }
    event.preventDefault()
  } else {
    elem = event.target.id
    timeout = setTimeout(function () {
      //   console.log('Single Tap (timeout)')
      clearTimeout(timeout)
    }, 500)
  }
  lastTap = currentTime
}
