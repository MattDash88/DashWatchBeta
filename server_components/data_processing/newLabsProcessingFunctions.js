//  **********************
// Processing functions for wallet metrics
//  **********************

// Processing wallet metrics over time data
var processCountryWalletData = function mainWalletFunction(countryList, walletData) {
    // Declaring elements 
    activeInstallsData = {}
    deltaInstallsData = {}
    percentageDeltaData = {}

    Object.values(countryList).map((country) => {   //Go through list of countries
        var countryCode = country.country_code
        activeInstallsArray = []
        deltaInstallsArray = []
        percentageDeltaArray = []
        Object.values(walletData).map((item) => {   //Go through full Android wallet SQL dataset            
            if (item.country_code == countryCode) { // Match country code with SQL entry, datasets are build up by country
                var dateString = item.date.toISOString().substring(0, 7)  // Cut of day and timezone from string
                // Prepare datasets for charts
                activeInstallsArray.push({
                    x: dateString,
                    y: item.active_device_installs,
                })
                if (item.delta_active_installs !== null) {
                    deltaInstallsArray.push({
                        x: dateString,
                        y: item.delta_active_installs,
                    })
                    percentageDeltaArray.push({
                        x: dateString,
                        y: item.percentage_delta_installs,
                    })
                }
            }
        })
        // Put full dataset in their respective sub object
        activeInstallsData[countryCode] = activeInstallsArray
        deltaInstallsData[countryCode] = deltaInstallsArray
        percentageDeltaData[countryCode] = percentageDeltaArray
    })
    // Combine both the data objects for active installs and delta installs into one master object to return
    const outputObject = {
        active_installs: activeInstallsData,
        delta_installs: deltaInstallsData,
        percentage_delta: percentageDeltaData,
    }
    return (outputObject)
}

// Processing wallet metrics over time data
var processOtherWalletDataData = function mainTopListGlobalFunction(walletData) {
    // Declaring elements 
    var totalInstalls = []
    var desktopInstalls = []
    var mobileInstalls = []

    Object.values(walletData).map((item) => {   //Go through list of countries           
        var dateString = item.date.toISOString().substring(0, 7)  // Cut of day and timezone from string
        totalInstalls.push({
            x: dateString,
            y: item.total_installs,
        })
        desktopInstalls.push({
            x: dateString,
            y: item.desktop_installs,
        })
        mobileInstalls.push({
            x: dateString,
            y: item.mobile_installs,
        })
    })

    const walletDataset = {
        total_installs: totalInstalls,
        desktop_installs: desktopInstalls,
        mobile_installs: mobileInstalls,
    }
    return (walletDataset)
}

//  **********************
// Processing functions for website metrics
//  **********************

// Processing wallet metrics over time data
var processCountryWebsiteData = function countryWebsiteFunction(countryList, websiteData) {
    // Declaring elements 
    usersData = {}
    deltaUsersData = {}
    sessionsData = {}
    bounceRateData = {}

    Object.values(countryList).map((country) => {       // Go through list of countries
        var countryCode = country.country_code
        usersArray = []
        deltaUsersArray = []
        percentageDeltaArray = []
        sessionsArray = []
        bounceRateArray = []
        Object.values(websiteData).map((item) => {      // Go through full Android wallet SQL dataset            
            if (item.country_code == countryCode) {     // Match country code with SQL entry, datasets will be built up by country
                var dateString = item.date.toISOString().substring(0, 7)  // Cut of day and timezone from string
                // Prepare datasets for charts
                usersArray.push({
                    x: dateString,
                    y: item.users,
                })
                deltaUsersArray.push({
                    x: dateString,
                    y: item.delta_users,
                })
                percentageDeltaArray.push({
                    x: dateString,
                    y: item.percentage_delta_users,
                })
                sessionsArray.push({
                    x: dateString,
                    y: item.sessions,
                })
                bounceRateArray.push({
                    x: dateString,
                    y: item.bounce_rate,
                })
            }
        })
        // Put full dataset in their respective sub object
        usersData[countryCode] = usersArray
        deltaUsersData[countryCode] = deltaUsersArray
        percentageDeltaUsersData[countryCode] = percentageDeltaArray
        sessionsData[countryCode] = sessionsArray
        bounceRateData[countryCode] = bounceRateArray
    })
    // Combine all the data objects into one master object to return
    const outputObject = {
        users: usersData,
        delta_users: deltaUsersData,
        percentage_delta: percentageDeltaUsersData,
        sessions: sessionsData,
        bounce_rate: bounceRateData,
    }
    return (outputObject)
}

//  **********************
// Processing functions for best of lists
//  **********************

// Processing wallet metrics over time data
var processTopListGlobalData = function mainTopListGlobalFunction(globalData, targetDate) {
    // Declaring elements 
    var topListGlobalData = []
    Object.values(globalData).map((item) => {   //Go through list of countries        
        if (item.date.toISOString() == targetDate.toISOString()) { // Match date with SQL date of SQL entry
            topListGlobalData = item
        }
    })
    return (topListGlobalData)
}

// Export the Airtable functions to be imported in server.js
module.exports = {
    // Wallet functions
    processCountryWalletData,    
    processOtherWalletDataData,
    // Website functions
    processCountryWebsiteData,
    // Best of list functions
    processTopListGlobalData,
}