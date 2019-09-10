const redis = require('redis')
require('dotenv').config()                              // Access .env variables
var cacheExpirationTime = process.env.CACHEEXPIRATION;  //Time until cache expires, can be adjusted for testing purposes
const redisOptions = {
  host: process.env.REDIS_IP,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASS,
//  enable_offline_queue: false,
}

function dbCall(userFunc) {  
  const client = redis.createClient(redisOptions)
  userFunc(client, () => { client.quit(); })  

  // Log any errors
  client.on('error', function(error) {
  console.log(error)
})
}

function redisRetrieve(listId, fn) { 
  dbCall((client, done) => { 
    client.get(listId, function (error, data) {      
      fn(error, data)
      done();
    });
  })
}

function redisStore(listId, data) { 
  dbCall((client, done) => { 
    client.set(listId, JSON.stringify(data), 'EX', cacheExpirationTime, function(err, reply) {
      if (err) console.log('err')
      done();
    }) 
  })
}

module.exports = {
  redisRetrieve,
  redisStore,
}