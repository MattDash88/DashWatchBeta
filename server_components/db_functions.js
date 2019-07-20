require('dotenv').config()    // Access .env variables
const { Pool, Client } = require('pg');
const pool = new Pool({
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    password: process.env.PG_PW,
    database: process.env.PG_DB,
    port: process.env.PG_PORT,
});

// Function to retrieve all votes from database
var retrieveData = function retrieveFunction() {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * 
                    FROM tblwalletactiveraw`, 
                    function (err, results) {
            if (err) reject(err);
            else {
                console.log(results.rows)
                resolve(results.rows);
            }
        })
    })
}

module.exports = {
    retrieveData,
}