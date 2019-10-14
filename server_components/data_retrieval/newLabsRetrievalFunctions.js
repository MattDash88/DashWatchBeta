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

// Function to retrieve all votes from database
var retrieveTopList = function retrieveWalletDataFunction(element) {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * 
                    FROM android_work_table 
                    ORDER BY date DESC, ${element} DESC 
                    LIMIT 100`, 
                    function (err, results) {
            if (err) reject(err);
            else {
                storeMainData = [] 
                Object.values(results.rows).map((item) => {
                    storeMainData.push({
                        date: item.date,
                        country: item.country_code,
                        active_devices: item.active_device_installs,
                        delta_installs: item.delta_active_installs,
                    }) 
                })
                resolve(storeMainData);
            }
        })
    })
}

module.exports = {
    retrieveTopList,
    retrieveCountryList,
    retrieveWalletData,
}