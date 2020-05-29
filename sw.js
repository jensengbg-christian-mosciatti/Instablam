self.addEventListener('install', (event) => {
  console.log('SW installed at: ', new Date().toLocaleTimeString())
  event.waitUntil(
    caches.open('v1').then((cache) => {
      console.log('add cache ')
      return cache.addAll([
        'index.html',
        '/',
        'style/style.css',
        'https://fonts.gstatic.com/s/orbitron/v15/yMJRMIlzdpvBhQQL_Qq7dy0.woff2	',
        'manifest.json',
        'js/index.js',
        'js/addSvg.js',
        'js/caman.min.js',
        'js/cameraPermissions.js',
        'js/dbClick.js',
        'js/handDraw.js',
        'offline.html',
        '/assets/draw.svg',
        '/assets/filter.svg',
        '/assets/icon-128x128.png',
        '/assets/icon-512x512.png',
      ])
    })
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  console.log('SW activated at: ', new Date().toLocaleTimeString())
})

self.addEventListener('fetch', (event) => {
  //   console.log('listen')
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (!navigator.onLine) {
        if (response) {
          return response
        } else {
          return caches.match(new Request('offline.html'))
        }
      } else {
        // console.log('update cache', event.request)
        return updateCache(event.request)
      }
    })
  )
})

async function updateCache(request) {
  return fetch(request).then((response) => {
    // console.log(response)
    if (response) {
      return caches.open('v1').then((cache) => {
        return cache.put(request, response.clone()).then(() => {
          return response
        })
      })
    }
  })
}

//Lyssnar efter push notiser
// self.addEventListener('push', (event) => {
//   if (event.data) {
//     createNotification(event.data.text())
//   }
// })

//Skapar en notifikation med Web notifications API
// const createNotification = (text) => {
//   self.registration.showNotification('Baudo Pippo says', {
//     body: text,
//     icon: 'assets/icon-128x128.png',
//   })
// }

self.addEventListener('push', (event) => {
  const transaction = JSON.parse(event.data.text())

  const options = {
    body: transaction.business,
  }

  const transactionType = transaction.type === 'deposit' ? '+' : '-'

  event.waitUntil(
    self.registration.showNotification(
      `New Transaction: ${transactionType} ${transaction.amount}`,
      options
    )
  )
})
