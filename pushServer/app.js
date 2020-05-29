const express = require('express')
const cors = require('cors')
const publisher = require('./publisher.js')
const app = express()
const port = 3000

app.use(express.json())
app.use(cors())

const subscribers = new Map()

app.post('/addsubscriber', function (req, res) {
  const pushSubscription = req.body

  const id = pushSubscription.keys.auth
  subscribers.set(id, pushSubscription)

  console.log(`New subscriber added. Total subscribers: ${subscribers.size}`)
  res.send('Ok!')
})

app.post('/removesubscriber', function (req, res) {
  const id = req.body.id
  subscribers.delete(id)
  console.log(`Subscriber unsubscribed. Total subscribers: ${subscribers.size}`)
  res.send('Ok!')
})

setInterval(() => publisher.notify(subscribers), 6000)

app.listen(port, () =>
  console.log(`Server App is running at http://localhost:${port}`)
)
