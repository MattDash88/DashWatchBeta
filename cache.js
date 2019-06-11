const redis = require('redis')
const redisOptions = {
  host: "35.224.194.89",
  port: 6379,
  password: "foobared",
}
const client = redis.createClient(redisOptions)


// Log any errors
client.on('error', function(error) {
  console.log('Error:')
  console.log(error)
})

module.exports = client
