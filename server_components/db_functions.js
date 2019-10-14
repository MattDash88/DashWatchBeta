require('dotenv').config();    // Access .env variables
const pg = require('pg');
var types = pg.types;
types.setTypeParser(1114, function(stringValue) {
    return new Date(stringValue + "+0000");
});


const pool = new pg.Pool({
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
                    FROM tblAndroidWalletActiveCount
                    WHERE androiddb.country_code = 'VE'`, 
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
var retrieveArray = function retrieveArrayFunction() {
    return new Promise((resolve, reject) => {
        var countryList
        pool.query(`SELECT * 
                    FROM androiddb`, 
                    function (err, results) {
            if (err) reject(err);
            else {
                // Declaring elements 
                storeMainData = {}                         
                Object.values(results.rows).map((item) => {
                    var countryCode = item.country_code
                    var dataItem = []
                    dataItem.push({
                        x: item.year,
                        y: item.activedeviceinstalls,
                    })  
                    storeMainData[countryCode].push(dataItem)    
                })
                resolve(storeMainData);
            }
        })
    })
}

// Function to retrieve all votes from database
var retrieveTest = function retrieveTestFunction() {
    return new Promise((resolve, reject) => {
        var countryList
        pool.query(`SELECT * FROM android_work_table ORDER BY date DESC, active_device_installs DESC`, 
                    function (err, results) {
            if (err) reject(err);
            else {
                // Declaring elements 
                storeMainData = {}      
                var dataItem = []                            
                Object.values(results.rows).map((item) => {
                    var dateString = item.date.toISOString().substring(0,7)  // Cut of day and timezone from string      
                    console.log(dateString) 
                    var countryCode = item.country_code                    
                    dataItem.push({
                        x: dateString,
                        y: item.active_device_installs,
                        z: item.delta_active_installs,
                    })   
                })
                resolve(dataItem);
            }
        })
    })
}

module.exports = {
    retrieveData,
    retrieveArray,
    retrieveTest,
}