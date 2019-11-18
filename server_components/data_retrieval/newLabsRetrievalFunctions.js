require('dotenv').config();    // Access .env variables
const { Pool, Client } = require('pg');
const pool = new Pool({
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    password: process.env.PG_PW,
    database: process.env.PG_DB,
    port: process.env.PG_PORT,
});

// Function to retrieve list of countries from database
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

//  **********************
// Database Retrieval functions for wallet metrics
//  **********************

// Function to retrieve Android wallet data per country from database
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

// Function to retrieve Android wallet data for world from database
var retrieveAndroidGlobalData = function retrieveAndroidGlobalFunction() {
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

// Function to retrieve data for other wallets from database
var retrieveOtherWalletData = function retrieveOtherWalletFunction(walletType) {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * 
                    FROM other_wallet_table
                    WHERE wallet_id = '${walletType}'
                    ORDER BY date ASC`, 
                    function (err, results) {
            if (err) reject(err);
            else {
                resolve(results.rows);
            }
        })
    })
}

//  **********************
// Database Retrieval functions for Website metrics
//  **********************

// Function to retrieve data for dash.org from database
var retrieveWebsiteCountryData = function retrieveWebsiteCountryFunction() {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * 
                    FROM dash_org_website
                    ORDER BY date ASC`, 
                    function (err, results) {
            if (err) reject(err);
            else {
                resolve(results.rows);
            }
        })
    })
}

// Function to retrieve dash.org data for world from database
var retrieveWebsiteGlobalData = function retrieveWebsiteGlobalFunction() {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * 
                    FROM website_global_table
                    ORDER BY date ASC`, 
                    function (err, results) {
            if (err) reject(err);
            else {
                resolve(results.rows);
            }
        })
    })
}

//  **********************
// Database Retrieval functions for best of lists
//  **********************

// Function to retrieve all votes from database
var retrieveWalletTopList = function retrieveWalletListFunction(element) {
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
                        delta_active_installs: item.delta_active_installs,
                        percentage_delta_installs: item.percentage_delta_installs,
                        id: item.unique_id,
                    }) 
                })
                resolve(storeMainData);
            }
        })
    })
}

// Function to retrieve all votes from database
var retrieveWebsiteTopList = function retrieveWebsiterListFunction(element) {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * 
                    FROM dash_org_website 
                    WHERE users >= 100
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
                        users: item.users,
                        delta_users: item.delta_users,
                        percentage_delta_users: item.percentage_delta_users,
                        id: item.unique_id,
                    }) 
                })
                resolve(storeMainData);
            }
        })
    })
}

module.exports = {
    retrieveCountryList,
    // Wallet functions    
    retrieveAndroidGlobalData,
    retrieveWalletCountryData,
    retrieveOtherWalletData,
    // Website functions
    retrieveWebsiteCountryData,
    retrieveWebsiteGlobalData,
    // Best of list functions
    retrieveWalletTopList,
    retrieveWebsiteTopList,
}