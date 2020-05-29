// const client = (() => {
export default () => {
  let serviceWorkerRegObj = undefined

  //   const notificationButton = document.getElementById('btn-notify')
  const pushButton = document.getElementById('btn-push')

  /*
   const showNotificationButton = () => {
     notificationButton.style.display = 'block'
     notificationButton.addEventListener('click', showNotification)
   }
   
  const showNotification = () => {
    // console.log('Show notification btn clicked.')

    // const simpleNotification = (reg) => reg.showNotification('My Notification')

    const customizedNotification = (reg) => {
      const options = {
        body: 'This is the notification body',
        icon: 'imgs/notification.png',
        actions: [
          { action: 'search', title: 'Try searching' },
          { action: 'close', title: 'Forget it!' },
        ],
        data: {
          notificationTime: Date.now(),
          githubUser: 'jensengbg-christian-mosciatti',
        },
      }
      reg.showNotification('My Notification', options)
    }
    navigator.serviceWorker
      .getRegistration()
      //   .then((registration) => registration.showNotification('My Notification!'))
      .then((registration) => customizedNotification(registration))
  }
*/
  const checkNotificationSupport = () => {
    // return Promise.reject('notification support not checked.')
    if (!('Notification' in window))
      return Promise.reject('The browser does not support Notifications.')
    console.log('The browser supports notifications.')
    return Promise.resolve('ok')
  }

  const registerServiceWorker = () => {
    // return Promise.reject('service worker not registered.')
    if (!('serviceWorker' in navigator)) {
      return Promise.reject('The browser does not support Service worker.')
    }

    return navigator.serviceWorker.register('sw.js').then((regObj) => {
      console.log('Service worker successfully registered.')
      serviceWorkerRegObj = regObj
      //   showNotificationButton()
      serviceWorkerRegObj.pushManager.getSubscription().then((subscription) => {
        if (subscription) disablePushNotificationButton()
        else enablePushNotificationButton()
      })
    })
  }

  const requestNotificationPermission = () => {
    // return Promise.reject('Permissions not requested.')
    return Notification.requestPermission((status) =>
      console.log('Notification permission status:', status)
    )
  }

  checkNotificationSupport()
    .then(registerServiceWorker)
    .then(requestNotificationPermission)
    .catch((err) => console.error(err))

  let isUserSubscribed = false
  const disablePushNotificationButton = () => {
    isUserSubscribed = true
    pushButton.textContent = 'Disable Push Notifications'
    pushButton.style.backgroundColor = '#ea9085'
  }
  const enablePushNotificationButton = () => {
    isUserSubscribed = false
    pushButton.textContent = 'Enable Push Notifications'
    // pushButton.style.backgroundColor = '#efb1ff'
  }

  const setupPush = () => {
    const urlB64ToUint8Array = (base64String) => {
      const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
      const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/')
      const rawData = atob(base64)
      const outputArray = new Uint8Array(rawData.length)

      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
      }

      return outputArray
    }

    const subscribeWithServer = (subscription) => {
      return fetch('http://localhost:3000/addsubscriber', {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: {
          'Content-type': 'application/json',
        },
      })
    }

    const subscribeUser = () => {
      console.log('subscribing User')
      const appServerPublicKey =
        'BLpzNfugoCxZyoYu6-Bl38qJhDbRoZuH9SHC8Z8bSIl9T4M2se6LmCcUAdpASU_sylGH3nN4ZrChS8khPOPGfMo'
      const publicKeyAsArray = urlB64ToUint8Array(appServerPublicKey)

      serviceWorkerRegObj.pushManager
        .subscribe({
          userVisibleOnly: true,
          applicationServerKey: publicKeyAsArray,
        })
        .then((subscription) => {
          console.log(JSON.stringify(subscription, null, 4))
          subscribeWithServer(subscription)
          disablePushNotificationButton()
        })
        .catch((err) => console.error('Error subscribing push service', err))
    }

    const unsubscribeWithServer = (id) => {
      return fetch('http://localhost:3000/removeSubscriber', {
        method: 'POST',
        body: JSON.stringify({ id }),
        headers: {
          'Content-type': 'application/json',
        },
      })
    }

    const unSubscribeUser = () => {
      console.log('un-subscribing User')
      serviceWorkerRegObj.pushManager
        .getSubscription()
        .then((subscription) => {
          if (subscription) {
            let subAsString = JSON.stringify(subscription)
            let subAsObject = JSON.parse(subAsString)
            unsubscribeWithServer(subAsObject.keys.auth)
            return subscription.unsubscribe()
          }
        })
        .then(enablePushNotificationButton)
        .catch((err) =>
          console.error('Error unsubscribing from Push notifications:', err)
        )
    }

    pushButton.addEventListener('click', function () {
      if (isUserSubscribed) unSubscribeUser()
      else subscribeUser()
    })
  }
  setupPush()
}

/*
  =======================================
  
  Public Key:
  BLpzNfugoCxZyoYu6-Bl38qJhDbRoZuH9SHC8Z8bSIl9T4M2se6LmCcUAdpASU_sylGH3nN4ZrChS8khPOPGfMo
  
  Private Key:
  gW_Z5R_PMLmmAV-FBTh8bMOB2uu7RzqO9B-Dtt_WGCQ
  
  =======================================
  */
