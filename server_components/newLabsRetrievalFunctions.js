require('dotenv').config();    // Access .env variables
const { Pool, Client } = require('pg');
const pool = new Pool({
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    password: process.env.PG_PW,
    database: process.env.PG_DB,
    port: process.env.PG_PORT,
});

// Function to retrieve all votes from database
var retrieveCountryList = function retrieveCountryListFunction() {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * 
                    FROM countryList`, 
                    function (err, results) {
            if (err) reject(err);
            else {
                resolve(results.rows);
            }
        })
    })
}

// Function to retrieve all votes from database
var retrieveWalletData = function retrieveWalletDataFunction() {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * 
                    FROM android_work_table`, 
                    function (err, results) {
            if (err) reject(err);
            else {
                resolve(results.rows);
            }
        })
    })
}

module.exports = {
    retrieveCountryList,
    retrieveWalletData,
}