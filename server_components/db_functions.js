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
var retrieveData = function retrieveFunction(countryCode) {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * 
                    FROM tblAndroidWalletActiveCount'`, 
                    function (err, results) {
            if (err) reject(err);
            else {
                var objs = [];    
                console.log(results.rows)                        
                //Object.values(results.rows).map((item) => {
                    //objs.push({
                    //   id: item.uniqueid,
                    //    date: item.year+'-'+item.month,
                    //    country: item.country,
                    //    country_code: item.countrycode,  
                    //    activedeviceinstalls : item.activedeviceinstalls,
                    //    installevents : item.installevents,                        
                    //});
                //})
                resolve('test');
            }
        })
    })
}

// Function to retrieve all votes from database
var retrieveArray = function retrieveArrayFunction(countryCode) {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * 
                    FROM tblAndroidWalletActiveCount 
                    WHERE tblAndroidWalletActiveCount.countrycode = '${countryCode}'`, 
                    function (err, results) {
            if (err) reject(err);
            else {
                var objs = [];                          
                Object.values(results.rows).map((item) => {
                    objs.push({
                        x: item.year+'-'+item.month,
                        y : item.activedeviceinstalls,                      
                    });
                })
                resolve(objs);
            }
        })
    })
}

module.exports = {
    retrieveData,
    retrieveArray,
}