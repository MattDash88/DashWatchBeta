// All server code uses ES5 because of Airtable plugin

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

var processAllLabsData = function mainLabsDataFunction(projects, kpis, values) {
    // Declaring elements 
    var valueIDs = []
    var kpiIDs = []
    
    // Get all record IDs of the KPI values
    Object.values(values).map((item) => {        
        valueIDs.push(item.id)
    })

    // Iterate through all Kpi entries
    Object.keys(kpis).map((item) => {                
        // Declaring elements 
        var kpi_values = [] 
        kpiIDs.push(kpis[item].id)  // Make an array of all record IDs of the KPI Entries
        
        // Iterate through all value IDs linked to Kpi entry
        Object.values(kpis[item].kpi_value_ids).map((value_item) => {           
            // Retrieve the values from the "KPI - Value" record and add them to an array
            kpi_value_index = valueIDs.indexOf(value_item)  
            kpi_values.push({
                x: values[kpi_value_index].date,
                y: values[kpi_value_index].value,
            })
            kpis[item].kpi_unit = values[kpi_value_index].unit
        }) // End of iteration through IDs of linked KPI values
        
        // Add the kpi value to the Kpi entry object
        kpis[item].kpi_values = (kpi_values)
    }) // End of loop through all kpi entries

    Object.keys(projects).map((item) => { 
        // Declaring elements 
        var kpi_entries = []
        
        // Iterate through all kpi entry IDs linked to project
        Object.values(projects[item].kpi_entries_ids).map((entry_item) => {
            // Retrieve the "KPI - Entry" objects linked to the project
            kpi_entry_index = kpiIDs.indexOf(entry_item)
            kpi_entries.push(kpis[kpi_entry_index])
        })  // End of iteration through IDs of linked KPI entries

        // Add the kpi entries to the Project object
        projects[item].kpi_entries = kpi_entries

    })  // End of loop through all projects
    return projects
}

// Processing wallet metrics over time data
var processWalletData = function mainWalletFunction(walletData) {
    // Declaring elements 
    storeMainData = []
    var walletEntries = []
    var uniqueWalletTypes
    
    Object.values(walletData).map((item) => {   //Go through dataset to find all wallet types
        walletEntries.push(item.wallet_name)
    })
    // Filter the array of wallet types on unique wallets
    var uniqueWalletTypes = walletEntries.filter(onlyUnique);

    // Sort and prepare all the data per wallet type
    Object.keys(uniqueWalletTypes).map((item) => {  // Iterate through all unique wallet types
        // Declare elements used per iteration
        var walletDataDesktop = []
        var walletDataMobile = []
        var walletDataTotal = []
        var walletPO

        // Sort the entries in the dataset to the unique wallet types
        Object.keys(walletData).map((data_item) => {        // Iterate through the whole wallet dataset
            if (walletData[data_item].wallet_name == uniqueWalletTypes[item]) {
                walletDataDesktop.push({    // Dataset for Desktop wallets
                    x: walletData[data_item].date,
                    y: walletData[data_item].desktop,
                })
                walletDataMobile.push({     // Dataset for Mobile wallets
                    x: walletData[data_item].date,
                    y: walletData[data_item].mobile,
                })
                walletDataTotal.push({      // Dataset for All wallets
                    x: walletData[data_item].date,
                    y: walletData[data_item].total,
                })
                walletPO = walletData[data_item].proposal_owner
            }
        })      // End of iteration through all wallet data  
        
        // Make an object for the wallet type
        const walletDataConst = {
            wallet_name: uniqueWalletTypes[item],
            wallet_proposal_owner: walletPO,
            total_downloads: walletDataTotal,
            desktop_downloads: walletDataDesktop,
            mobile_downloads: walletDataMobile,
        }
        storeMainData.push(walletDataConst)     // Push the object with wallet metrics to wallet data object      
    })  // End of iteration loop through unique wallet array
    return storeMainData
}

// Processing wallet metrics per version data
var processVersionData = function mainVersionFunction(walletData) {
    // Declaring elements 
    storeMainData = []
    var walletEntries = []
    var uniqueWalletTypes

    Object.values(walletData).map((item) => {   // Go through dataset to find all system types
        walletEntries.push(item.wallet_name)
    })
    // Filter the array of wallet types on unique wallets
    var uniqueWalletTypes = walletEntries.filter(onlyUnique);

    // Sort and prepare all the data per wallet type
    Object.keys(uniqueWalletTypes).map((item) => {  // Iterate through all unique wallet types
        // Declare elements used per iteration
        var walletVersionArray = []
        var walletVersionData = []
        var walletPO

        // Sort the entries in the dataset to the unique wallet types
        Object.keys(walletData).map((data_item) => {    // Iterate through the whole wallet dataset
            if (walletData[item].wallet_name == uniqueWalletTypes[data_item]) {
                walletVersionArray.push(walletData[data_item].wallet_version)
                walletVersionData.push({
                    wallet_version: walletData[data_item].wallet_version,
                    last_updated: walletData[data_item].last_updated,
                    release_updated: walletData[data_item].release_updated,
                    successor_release: walletData[data_item].successor_releasen,
                    total: walletData[data_item].total,
                    desktop: walletData[data_item].desktop,
                    mobile: walletData[data_item].mobile,
                    id: walletData[data_item].id,
                })
                walletPO = walletData[data_item].proposal_owner
            }
        })      // End of iteration through all wallet data   
        
        // Make an object for the wallet type
        const walletDataConst = {
            wallet_name: uniqueWalletTypes[item],
            walletVersionArray: walletVersionArray,
            wallet_proposal_owner: walletPO,
            walletVersionData: walletVersionData,
        }   // End of iteration loop through unique wallet array
        storeMainData.push(walletDataConst)     // Push the object with wallet metrics to wallet data object     
    })
    return storeMainData
}

// Processing function for POS system metrics
var processPosData = function mainPosFunction(posSystemData) {
    // Declaring elements 
    storeMainData = []
    var posEntries = []
    var uniqueSystemTypes

    Object.values(posSystemData).map((item) => {  // Go through dataset to find all system types
        posEntries.push(item.system_name)
    })
    // Filter the array of system types on unique systems
    var uniqueSystemTypes = posEntries.filter(onlyUnique);

    // Sort and prepare all the data per system type
    Object.keys(uniqueSystemTypes).map((item) => {  //Iterate through all unique system types
        // Declare elements used per iteration
        var systemTransactions = []
        var systemVolume = []
        var systemPO

        // Sort the entries in the dataset to the unique system types
        Object.keys(posSystemData).map((data_item) => {     // Iterate through the whole POS system dataset
            if (posSystemData[data_item].system_name == uniqueSystemTypes[item]) {
                systemTransactions.push({   // Dataset for Transactions per month
                    x: posSystemData[data_item].date,
                    y: posSystemData[data_item].dash_transactions,
                })
                systemVolume.push({         // Dataset for Volume in Dash per month
                    x: posSystemData[data_item].date,
                    y: posSystemData[data_item].dash_volume,
                })
                systemPO = posSystemData[data_item].proposal_owner
            }
        })     // End of iteration through all POS system data  
        
        // Make an object for the system type
        const systemDataConst = {
            system_name: uniqueSystemTypes[item],
            system_proposal_owner: systemPO,
            dash_transactions: systemTransactions,
            dash_volume: systemVolume,
        }
        storeMainData.push(systemDataConst)     // Push the object with POS system metrics to POS data object       
    })  // End of iteration loop through unique POS systems array
    return storeMainData
}

// Export the Airtable functions to be imported in server.js
module.exports = {
    processAllLabsData,
    processWalletData,
    processVersionData,
    processPosData,
}