const redis = require('redis')
require('dotenv').config()      // Access .env variables
const redisOptions = {
  host: process.env.REDIS_IP,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASS,
}
const client = redis.createClient(redisOptions)


// Log any errors
client.on('error', function(error) {
  console.log('Error:')
  console.log(error)
})

module.exports = client
