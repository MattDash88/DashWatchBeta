// Processing wallet metrics over time data
var processCountryWalletData = function mainWalletFunction(countryList, walletData) {
    // Declaring elements 
    activeInstallsData = {}
    deltaInstallsData = {}

    Object.values(countryList).map((country) => {   //Go through list of countries
        var countryCode = country.country_code
        activeInstallsArray = []
        deltaInstallsArray = []
        Object.values(walletData).map((item) => {   //Go through full Android wallet SQL dataset            
            if (item.country_code == countryCode) { // Match country code with SQL entry, datasets are build up by country
                var dateString = item.year+'-'+item.month
                // Prepare datasets for charts
                activeInstallsArray.push({
                    x: dateString,
                    y: item.activedeviceinstalls,
                })
                if (item.delta_active_installs !== null) {
                    deltaInstallsArray.push({
                        x: dateString,
                        y: item.delta_active_installs,
                    })
                }
                
            }        
        })
        // Put full dataset in their respective sub object
        activeInstallsData[countryCode] = activeInstallsArray
        deltaInstallsData[countryCode] = deltaInstallsArray
    })
    // Combine both the data objects for active installs and delta installs into one master object to return
    const outputObject = {
        active_installs: activeInstallsData,
        delta_installs: deltaInstallsData,
    }
    return (outputObject)
}

// Export the Airtable functions to be imported in server.js
module.exports = {
    processCountryWalletData,
}