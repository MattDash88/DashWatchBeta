// All server code uses ES5 because of next.js
require('dotenv').config()    // Access .env variables
const cache = require('../../cache');

var cacheExpirationTime = process.env.CACHEEXPIRATION;  // Time until cache expires, can be adjusted for testing purposes

// Get data retrieving functions from another file
var newLabsRetrievalFunctions = require('../data_retrieval/newLabsRetrievalFunctions');

// Get data processing functions from another file
var newLabsProcessingFunctions = require('../data_processing/newLabsProcessingFunctions');

// Function to prepare data for the Prepared Datasets for Labs (Wallets and POS systems)
const getLabsCountryList = (refreshCache) => {
    return new Promise((resolve, reject) => {
        // Read cache for this function
        cache.redisRetrieve('testlabsCountryList', function (error, data) {
            // Connection with redis fails, for back to direct Airtable retrieval
            var redisConnectionFailure;
            if (error) redisConnectionFailure = true;

            // If data is available in cache and a cache refresh is not requested, load from cache
            if (!!data && refreshCache == false) {
                resolve(JSON.parse(data))
            }

            // If cache is empty or a cache refresh is requested, retrieve from Airtable
            else {
                var countryListPromise = Promise.resolve(newLabsRetrievalFunctions.retrieveCountryList());

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
                        cache.redisStore('testlabsCountryList', storeCountryData)
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

//  **********************
// API functions for wallet metrics
//  **********************

// Function to get and process Android wallet data per country
const getLabsWalletsCountryData = (refreshCache) => {
    return new Promise((resolve, reject) => {
        // Read cache for this function
        cache.redisRetrieve('testlabsWalletCountryData', function (error, data) {
            // Connection with redis fails, for back to direct Airtable retrieval
            var redisConnectionFailure;
            if (error) redisConnectionFailure = true;

            // If data is available in cache and a cache refresh is not requested, load from cache
            if (!!data && refreshCache == false) {
                resolve(JSON.parse(data))
            }

            // If cache is empty or a cache refresh is requested, retrieve from Airtable
            else {
                var countryListPromise = Promise.resolve(newLabsRetrievalFunctions.retrieveCountryList());
                var countryDataPromise = Promise.resolve(newLabsRetrievalFunctions.retrieveWalletCountryData());

                Promise.all([countryListPromise, countryDataPromise]).then(function (valArray) {
                    // Sorting out all valArray items
                    countryListData = valArray[0]
                    countryWalletData = valArray[1]

                    var storeWalletData = newLabsProcessingFunctions.processCountryWalletData(countryListData, countryWalletData)

                    if (!redisConnectionFailure) {
                        // Store results in Redis cache, cache expire time is defined in .env
                        cache.redisStore('testlabsWalletCountryData', storeWalletData)
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
const getLabsWalletAndroidGlobalData = (refreshCache) => {
    return new Promise((resolve, reject) => {
        // Read cache for this function
        cache.redisRetrieve('testlabsWalletAndroidGlobalData', function (error, data) {
            // Connection with redis fails, for back to direct Airtable retrieval
            var redisConnectionFailure;
            if (error) redisConnectionFailure = true;

            // If data is available in cache and a cache refresh is not requested, load from cache
            if (!!data && refreshCache == false) {
                resolve(JSON.parse(data))
            }

            // If cache is empty or a cache refresh is requested, retrieve from Airtable
            else {
                var walletAndroidGlobalPromise = Promise.resolve(newLabsRetrievalFunctions.retrieveAndroidGlobalData());

                Promise.all([walletAndroidGlobalPromise]).then(function (valArray) {
                    // Sorting out all valArray items
                    androidWalletData = valArray[0]

                    var activeDevices = []
                    var deltaInstalls = []
                    var percentageDelta = []

                    Object.values(androidWalletData).map((item) => {
                        var dateString = item.date.toISOString().substring(0,7)  // Cut of day and timezone from string
                        activeDevices.push({
                            x: dateString,
                            y: item.active_device_installs,
                        })
                        deltaInstalls.push({
                            x: dateString,
                            y: item.delta_active_installs,
                        })
                        percentageDelta.push({
                            x: dateString,
                            y: 100 * item.delta_active_installs / (item.active_device_installs - item.delta_active_installs),
                        })
                    })

                    const storeWalletData = {
                        active_devices: activeDevices,
                        delta_active_installs: deltaInstalls,
                        percentage_delta_installs: percentageDelta,
                    } 

                    if (!redisConnectionFailure) {
                        // Store results in Redis cache, cache expire time is defined in .env
                        cache.redisStore('testlabsWalletAndroidGlobalData', storeWalletData)
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
const getLabsOtherWalletsData = (refreshCache) => {
    return new Promise((resolve, reject) => {
        // Read cache for this function
        cache.redisRetrieve('testlabsOtherWalletsData', function (error, data) {
            // Connection with redis fails, for back to direct Airtable retrieval
            var redisConnectionFailure;
            if (error) redisConnectionFailure = true;

            // If data is available in cache and a cache refresh is not requested, load from cache
            if (!!data && refreshCache == false) {
                resolve(JSON.parse(data))
            }

            // If cache is empty or a cache refresh is requested, retrieve from Airtable
            else {
                var walletDashCorePromise = Promise.resolve(newLabsRetrievalFunctions.retrieveOtherWalletData('dash_core'));
                var walletDashElectrumPromise = Promise.resolve(newLabsRetrievalFunctions.retrieveOtherWalletData('dash_electrum'));

                Promise.all([walletDashCorePromise, walletDashElectrumPromise]).then(function (valArray) {
                    // Sorting out all valArray items
                    dashcoreData = valArray[0]
                    dashelectrumData = valArray[1]

                    const dashCoreDataset = newLabsProcessingFunctions.processOtherWalletDataData(dashcoreData)
                    const dashElectrumDataset = newLabsProcessingFunctions.processOtherWalletDataData(dashelectrumData)

                    const storeWalletData = {
                        dash_core: dashCoreDataset,
                        dash_electrum: dashElectrumDataset,
                    } 

                    if (!redisConnectionFailure) {
                        // Store results in Redis cache, cache expire time is defined in .env
                        cache.redisStore('testlabsOtherWalletsData', storeWalletData)
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

//  **********************
// API functions for website metrics
//  **********************

// Function to get and process Android wallet data per country
const getLabsWebsiteCountryData = (refreshCache) => {
    return new Promise((resolve, reject) => {
        // Read cache for this function
        cache.redisRetrieve('testlabsWebsiteCountryData', function (error, data) {
            // Connection with redis fails, for back to direct Airtable retrieval
            var redisConnectionFailure;
            if (error) redisConnectionFailure = true;

            // If data is available in cache and a cache refresh is not requested, load from cache
            if (!!data && refreshCache == false) {
                resolve(JSON.parse(data))
            }

            // If cache is empty or a cache refresh is requested, retrieve from Airtable
            else {
                var countryListPromise = Promise.resolve(newLabsRetrievalFunctions.retrieveCountryList());
                var countryDataPromise = Promise.resolve(newLabsRetrievalFunctions.retrieveWebsiteCountryData());

                Promise.all([countryListPromise, countryDataPromise]).then(function (valArray) {
                    // Sorting out all valArray items
                    countryListData = valArray[0]
                    countryWebsiteData = valArray[1]

                    var storeWebsiteData = newLabsProcessingFunctions.processCountryWebsiteData(countryListData, countryWebsiteData)

                    if (!redisConnectionFailure) {
                        // Store results in Redis cache, cache expire time is defined in .env
                        cache.redisStore('testlabsWebsiteCountryData', storeWebsiteData)
                    }

                    // Finish
                    resolve(storeWebsiteData)
                }).catch((error) => {
                    reject({ error })
                    console.log(error)
                })
            }
        })
    })
}

// Function to prepare data for the Prepared Datasets for Labs (Wallets and POS systems)
const getLabsWebsiteGlobalData = (refreshCache) => {
    return new Promise((resolve, reject) => {
        // Read cache for this function
        cache.redisRetrieve('testlabsWebsiteGlobalData', function (error, data) {
            // Connection with redis fails, for back to direct Airtable retrieval
            var redisConnectionFailure;
            if (error) redisConnectionFailure = true;

            // If data is available in cache and a cache refresh is not requested, load from cache
            if (!!data && refreshCache == false) {
                resolve(JSON.parse(data))
            }

            // If cache is empty or a cache refresh is requested, retrieve from Airtable
            else {
                var websiteGlobalPromise = Promise.resolve(newLabsRetrievalFunctions.retrieveWebsiteGlobalData());

                Promise.all([websiteGlobalPromise]).then(function (valArray) {
                    // Sorting out all valArray items
                    websiteGlobalData = valArray[0]

                    var users = []
                    var sessions = []
                    var bounceRate = []
                    var deltaUsers = []
                    var percentageDelta = []

                    Object.values(websiteGlobalData).map((item) => {
                        var dateString = item.date.toISOString().substring(0,7)  // Cut of day and timezone from string
                        users.push({
                            x: dateString,
                            y: item.users,
                        })
                        sessions.push({
                            x: dateString,
                            y: item.sessions,
                        })
                        bounceRate.push({
                            x: dateString,
                            y: item.bounce_rate,
                        })
                        deltaUsers.push({
                            x: dateString,
                            y: item.delta_users,
                        })
                        percentageDelta.push({
                            x: dateString,
                            y: item.percentage_delta_users,
                        })
                    })

                    const storeWalletData = {
                        users: users,
                        sessions: sessions,
                        bounce_rate: bounceRate,
                        delta_users: deltaUsers,
                        percentage_delta_users: percentageDelta,
                    } 

                    if (!redisConnectionFailure) {
                        // Store results in Redis cache, cache expire time is defined in .env
                        cache.redisStore('testlabsWebsiteGlobalData', storeWalletData)
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

//  **********************
// API functions for best of lists
//  **********************

// Function to prepare data for the Android Wallet Top lists
const getLabsTopWalletList = (refreshCache) => {
    return new Promise((resolve, reject) => {
        // Read cache for this function
        cache.redisRetrieve('labsTopWalletList', function (error, data) {
            // Connection with redis fails, for back to direct Airtable retrieval
            var redisConnectionFailure;
            if (error) redisConnectionFailure = true;

            // If data is available in cache and a cache refresh is not requested, load from cache
            if (!!data && refreshCache == false) {
                resolve(JSON.parse(data))
            }

            // If cache is empty or a cache refresh is requested, retrieve from Airtable
            else {
                var activeDevicesListPromise = Promise.resolve(newLabsRetrievalFunctions.retrieveWalletTopList('active_device_installs'));
                var deltaDevicesListPromise = Promise.resolve(newLabsRetrievalFunctions.retrieveWalletTopList('delta_active_installs'));
                var percentageDevicesListPromise = Promise.resolve(newLabsRetrievalFunctions.retrieveWalletTopList('percentage_delta_installs'));
                var walletAndroidGlobalPromise = Promise.resolve(newLabsRetrievalFunctions.retrieveAndroidGlobalData());

                Promise.all([activeDevicesListPromise, deltaDevicesListPromise, percentageDevicesListPromise, walletAndroidGlobalPromise]).then(function (valArray) {
                    // Sorting out all valArray items
                    topActiveDevicesList = valArray[0]
                    topDeltaDevicesList = valArray[1]
                    topPercentageDevicesList = valArray[2]
                    globalAndroidList = valArray[3]

                    var mostRecentDate = topActiveDevicesList[0].date
                    var topGlobalAndroidList = newLabsProcessingFunctions.processTopListGlobalData(globalAndroidList, mostRecentDate)

                    const storeTopListData = {
                        top_active_devices: topActiveDevicesList,
                        delta_active_installs: topDeltaDevicesList,
                        percentage_delta_installs: topPercentageDevicesList,
                        global_active_devices: topGlobalAndroidList,
                    }

                    if (!redisConnectionFailure) {
                        // Store results in Redis cache, cache expire time is defined in .env
                        cache.redisStore('labsTopWalletList', storeTopListData)
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
const getLabsTopWebsiteList = (refreshCache) => {
    return new Promise((resolve, reject) => {
        // Read cache for this function
        cache.redisRetrieve('labsTopWebsitesList', function (error, data) {
            // Connection with redis fails, for back to direct Airtable retrieval
            var redisConnectionFailure;
            if (error) redisConnectionFailure = true;

            // If data is available in cache and a cache refresh is not requested, load from cache
            if (!!data && refreshCache == false) {
                resolve(JSON.parse(data))
            }

            // If cache is empty or a cache refresh is requested, retrieve from Airtable
            else {
                var usersListPromise = Promise.resolve(newLabsRetrievalFunctions.retrieveWebsiteTopList('users'));
                var deltaUsersListPromise = Promise.resolve(newLabsRetrievalFunctions.retrieveWebsiteTopList('delta_users'));
                var percentageDevicesListPromise = Promise.resolve(newLabsRetrievalFunctions.retrieveWebsiteTopList('percentage_delta_users'));
                var walletAndroidGlobalPromise = Promise.resolve(newLabsRetrievalFunctions.retrieveWebsiteGlobalData());

                Promise.all([
                    usersListPromise, 
                    deltaUsersListPromise, 
                    percentageDevicesListPromise, 
                    walletAndroidGlobalPromise
                ]).then(function (valArray) {

                    // Sorting out all valArray items
                    topUsersList = valArray[0]
                    topDeltaUsersList = valArray[1]
                    topPercentageUsersList = valArray[2]
                    globalWebsiteList = valArray[3]
                    
                    var mostRecentDate = topUsersList[0].date
                    var topGlobalWebsiteList = newLabsProcessingFunctions.processTopListGlobalData(globalWebsiteList, mostRecentDate)

                    const storeTopListData = {
                        users: topUsersList,
                        delta_users: topDeltaUsersList,
                        percentage_delta_users: topPercentageUsersList,
                        global_users: topGlobalWebsiteList,
                    }

                    if (!redisConnectionFailure) {
                        // Store results in Redis cache, cache expire time is defined in .env
                        cache.redisStore('labsTopWebsitesList', storeTopListData)
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


module.exports = {
    getLabsCountryList,
    // Wallet functions
    getLabsWalletsCountryData,
    getLabsWalletAndroidGlobalData,
    getLabsOtherWalletsData,
    // Website functions
    getLabsWebsiteCountryData,
    getLabsWebsiteGlobalData,
    // Best of list functions
    getLabsTopWalletList,
    getLabsTopWebsiteList,
}