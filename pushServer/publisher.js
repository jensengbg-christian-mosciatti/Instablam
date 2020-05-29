const webPush = require('web-push')
const faker = require('faker')

const pushSubscription = {
  endpoint:
    'https://fcm.googleapis.com/fcm/send/eRAQZO7wdu8:APA91bFDkWfHsP29FCy1xjL3DSF0QMmpvnruQ3QexB1L7v1S6kfT7oMcP2c7DAGJ3H8vYZECUs7FSm9TEFP8zEXHU17vKJ4YB2uRyMCcPD0nxYt1Ku9bfRhYgW-Zp9r5mAgZP74d3I7M',
  expirationTime: null,
  keys: {
    p256dh:
      'BBR1E2U3AkyC_0iTApK9wMkbF91Akkqrx8ceKTrQD0JzQaMcUkJLz1e5XBGlYZYw8s5b0bnzfUodN1pKqUKOppk',
    auth: 'tXkWLaY3yOX8htm8nY7UBQ',
  },
}

const vapidPublicKey =
  'BLpzNfugoCxZyoYu6-Bl38qJhDbRoZuH9SHC8Z8bSIl9T4M2se6LmCcUAdpASU_sylGH3nN4ZrChS8khPOPGfMo'
const vapidPrivateKey = 'gW_Z5R_PMLmmAV-FBTh8bMOB2uu7RzqO9B-Dtt_WGCQ'

const options = {
  TTL: 60,
  vapidDetails: {
    subject: 'mailto: pusher@push.push',
    publicKey: vapidPublicKey,
    privateKey: vapidPrivateKey,
  },
}

const notify = (subscribers) => {
  if (subscribers.size < 1) {
    console.log('No subscribers to notify')
    return
  }
  const transaction = faker.helpers.createTransaction()
  subscribers.forEach((subscriber, id) => {
    webPush
      .sendNotification(
        subscriber,
        // `Hello I'm the Server`,
        JSON.stringify(transaction),
        options
      )
      .then(() => console.log(`${subscribers.size} subscribers notified.`))
      .catch((error) => console.error('Error pushing notification', error))
  })
  //   webPush
  //     .sendNotification(
  //       pushSubscription,
  //       // `Hello I'm the Server`,
  //       JSON.stringify(transaction),
  //       options
  //     )
  //     .then(() => console.log('subscribers notified.'))
  //     .catch((error) => console.error('Error pushing notification', error))
  // }
}

// notify()

module.exports = {
  notify: notify,
}
