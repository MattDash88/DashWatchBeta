// All server code uses ES5 because of next.js
require('dotenv').config()    // Access .env variables
const cache = require('../../cache');

var cacheExpirationTime = process.env.CACHEEXPIRATION;  // Time until cache expires, can be adjusted for testing purposes

// Get data retrieving functions from another file
var newListRetrievalFunctions = require('../data_retrieval/newListRetrievalFunctions');

// Function to prepare data for the Prepared Datasets for Labs (Wallets and POS systems)
const getListOfMonths = (refreshCache) => {
    return new Promise((resolve, reject) => {
        var listOfMonthsPromise = Promise.resolve(newListRetrievalFunctions.retrieveListOfMonths());
        Promise.resolve(countryListPromise).then(function (valArray) {
            // Sorting out all valArray items
            var listOfMonths = valArray
            // Finish
            resolve(listOfMonths)
        }).catch((error) => {
            reject({ error })
            console.log(error)
        })
    })
}

// Function to prepare data for the Prepared Datasets for Labs (Wallets and POS systems)
const getListReportData = (year, month) => {
    return new Promise((resolve, reject) => {

        var reportListPromise = Promise.resolve(newListRetrievalFunctions.retrieveMonthListReleaseData());

        Promise.resolve(reportListPromise).then(function (valArray) {
            // Sorting out all valArray items
            var reportList = valArray

            // Finish
            resolve(reportList)
        }).catch((error) => {
            reject({ error })
            console.log(error)
        })
    })
}

module.exports = {
    getListOfMonths,
    // Report List functions
    getListReportData,
}
