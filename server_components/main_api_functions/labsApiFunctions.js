// All server code uses ES5 because of next.js
require('dotenv').config()    // Access .env variables
const cache = require('../../cache');

var cacheExpirationTime = process.env.CACHEEXPIRATION;  // Time until cache expires, can be adjusted for testing purposes

// Get data retrieving functions from another file
var newLabsRetrievalFunctions = require('../data_retrieval/newLabsRetrievalFunctions');

// Get data processing functions from another file
var newLabsProcessingFunctions = require('../data_processing/newLabsProcessingFunctions');

// Function to prepare data for the Prepared Datasets for Labs (Wallets and POS systems)
const getLabsTopWalletList = (refreshCache) => {
    return new Promise((resolve, reject) => {
        // Read cache for this function
        cache.get('labsWalletTopList', function (error, data) {
            // Connection with redis fails, for back to direct Airtable retrieval
            var redisConnectionFailure;
            if (error) redisConnectionFailure = true;

            // If data is available in cache and a cache refresh is not requested, load from cache
            if (!!data && refreshCache == false) {
                resolve(JSON.parse(data))
            }

            // If cache is empty or a cache refresh is requested, retrieve from Airtable
            else {
                var activeDevicesListPromise = Promise.resolve(newLabsRetrievalFunctions.retrieveTopList('active_device_installs'));
                var deltaDevicesListPromise = Promise.resolve(newLabsRetrievalFunctions.retrieveTopList('delta_active_installs'));

                Promise.all([activeDevicesListPromise, deltaDevicesListPromise]).then(function (valArray) {
                    // Sorting out all valArray items
                    topActiveDevicesList = valArray[0]
                    topDeltaDevicesList = valArray[1]

                    const storeTopListData = {
                        top_active_devices: topActiveDevicesList,
                        delta_active_devices: topDeltaDevicesList,
                    }

                    if (!redisConnectionFailure) {
                        // Store results in Redis cache, cache expire time is defined in .env
                        cache.setex('labsTopWalletList', cacheExpirationTime, JSON.stringify(storeTopListData))
                    }

                    // Finish
                    resolve(storeTopListData)
                }).catch((error) => {
                    reject({ error })
                    console.log(error)
                })
            }
        })
    })
}

// Function to prepare data for the Prepared Datasets for Labs (Wallets and POS systems)
const getLabsCountryData = (refreshCache) => {
    return new Promise((resolve, reject) => {
        // Read cache for this function
        cache.get('labsCountryData', function (error, data) {
            // Connection with redis fails, for back to direct Airtable retrieval
            var redisConnectionFailure;
            if (error) redisConnectionFailure = true;

            // If data is available in cache and a cache refresh is not requested, load from cache
            if (!!data && refreshCache == false) {
                resolve(JSON.parse(data))
            }

            // If cache is empty or a cache refresh is requested, retrieve from Airtable
            else {
                var countryListPromise = Promise.resolve(newLabsRetrievalFunctions.retrieveWalletCountryList());
                var countryListPromise = Promise.resolve(newLabsRetrievalFunctions.retrieveWalletData());

                Promise.all([countryListPromise, countryListPromise]).then(function (valArray) {
                    // Sorting out all valArray items
                    countryListData = valArray[0]
                    countryWalletData = valArray[1]

                    var storeWalletData = newLabsProcessingFunctions.processCountryWalletData(countryListData, countryWalletData)

                    if (!redisConnectionFailure) {
                        // Store results in Redis cache, cache expire time is defined in .env
                        cache.setex('labsCountryData', cacheExpirationTime, JSON.stringify(storeWalletData))
                    }

                    // Finish
                    resolve(storeWalletData)
                }).catch((error) => {
                    reject({ error })
                    console.log(error)
                })
            }
        })
    })
}

// Function to prepare data for the Prepared Datasets for Labs (Wallets and POS systems)
const getLabsWalletCountryList = (refreshCache) => {
    return new Promise((resolve, reject) => {
        // Read cache for this function
        cache.get('labsWalletCountryList', function (error, data) {
            // Connection with redis fails, for back to direct Airtable retrieval
            var redisConnectionFailure;
            if (error) redisConnectionFailure = true;

            // If data is available in cache and a cache refresh is not requested, load from cache
            if (!!data && refreshCache == false) {
                resolve(JSON.parse(data))
            }

            // If cache is empty or a cache refresh is requested, retrieve from Airtable
            else {
                var countryListPromise = Promise.resolve(newLabsRetrievalFunctions.retrieveWalletCountryList());

                Promise.resolve(countryListPromise).then(function (valArray) {
                    // Sorting out all valArray items
                    var countryList = valArray
                    storeCountryData = {}

                    Object.values(countryList).map((item) => {
                        var countryCode = item.country_code
                        storeCountryData[countryCode] = item
                    })

                    if (!redisConnectionFailure) {
                        // Store results in Redis cache, cache expire time is defined in .env
                        cache.setex('labsCountryData', cacheExpirationTime, JSON.stringify(storeCountryData))
                    }

                    // Finish
                    resolve(storeCountryData)
                }).catch((error) => {
                    reject({ error })
                    console.log(error)
                })
            }
        })
    })
}

module.exports = {
    getLabsTopWalletList,
    getLabsCountryData,
    getLabsWalletCountryList,
}