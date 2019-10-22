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
var retrieveWalletCountryList = function retrieveCountryListFunction() {
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
var retrieveWalletCountryData = function retrieveWalletDataFunction() {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * 
                    FROM android_work_table
                    ORDER BY date ASC`, 
                    function (err, results) {
            if (err) reject(err);
            else {
                resolve(results.rows);
            }
        })
    })
}

// Function to retrieve all votes from database
var retrieveAndroidGlobalData = function retrieveAndroidGlobaFunction() {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * 
                    FROM android_global_table
                    ORDER BY date ASC`, 
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
                    WHERE active_device_installs >= 100
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
                        percentage_delta_installs: item.percentage_delta_installs,
                        id: item.unique_id,
                    }) 
                })
                resolve(storeMainData);
            }
        })
    })
}

module.exports = {
    retrieveTopList,
    retrieveWalletCountryList,
    retrieveAndroidGlobalData,
    retrieveWalletCountryData,
}