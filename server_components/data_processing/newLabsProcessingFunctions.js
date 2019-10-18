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
                        y: 100*(item.delta_active_installs / (item.active_device_installs - item.delta_active_installs)),
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
    processCountryWalletData,
    processTopListGlobalData,
}