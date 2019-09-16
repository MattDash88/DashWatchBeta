require('dotenv').config()    // Access .env variables
//const fs = require('fs');
const { Pool, Client } = require('pg');
const pool = new Pool({
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    password: process.env.PG_PW,
    database: 'polldata',
    port: process.env.PG_PORT,
    //ssl: {
    //    rejectUnauthorized : false,
    //    ca   : fs.readFileSync("./server-ca.pem").toString(),
    //    key  : fs.readFileSync("./client-key.pem").toString(),
    //    cert : fs.readFileSync("./client-cert.pem").toString(),
    //},
});

// Function to retrieve all votes from database
var retrievePollData = function pollRetrieveFunction() {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * 
                    FROM polldb`, 
                    function (err, results) {
            if (err) reject(err);
            else {
                var objs = [];                            
                Object.values(results.rows).map((item) => {
                    objs.push({
                        title: item.title,
                        organization: item.organization,
                        end_date: item.end_date,
                        poll_url: item.poll_url,
                    });
                })
                resolve(objs);
            }
        })
    })
}

module.exports = {
    retrievePollData,
//    healthCheck,
}