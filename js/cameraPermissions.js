async function cameraPermissions() {
  try {
    return {
      state: (await navigator.permissions.query({ name: 'camera' })).state,
    }
  } catch (error) {
    return {
      state: 'error',
      message: error,
    }
    console.log('Got error :', error)
  }
}

export async function checkPermissions() {
  const camInfo = document.querySelector('.video-ph--info')

  const media = await navigator.mediaDevices.enumerateDevices()
  let findVideo = null
  if (media) findVideo = media.find((el) => el.kind === 'videoinput')

  let permission = { state: null }
  if (findVideo != null) permission = await cameraPermissions()
  switch (permission.state) {
    case null:
      camInfo.textContent = 'Unfortunately your device does not have any camera'
      break
    case 'prompt':
      camInfo.textContent = 'Please allow the browser to use your camera'
      break
    case 'denied':
      camInfo.textContent =
        'This App will not work without access to your camera. \n Change your browser settings to allow camera.'
      break
    case 'error':
      camInfo.textContent =
        'This App will not work without access to your camera. \n Change your browser settings to allow camera.'
      break
    default:
      camInfo.textContent = ''
  }

  setVideoState(permission.state === 'denied' ? true : false)

  return permission
}

function setVideoState(disable) {
  const videoEl = document.querySelector('.wrapper-video')
  if (disable && !videoEl.classList.contains('disable'))
    videoEl.classList.add('disable')
  else if (!disable && videoEl.hasAttribute('disabled'))
    videoEl.classList.remove('disable')
}
