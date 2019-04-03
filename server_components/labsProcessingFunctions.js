// All server code uses ES5 because of Airtable plugin

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

// Processing function for Main proposal data
var processWalletData = function mainWalletFunction(walletData) {
    storeMainData = []

    var walletEntries = []
    var uniqueWalletTypes
    Object.keys(walletData).map((item) => {
        walletEntries.push(walletData[item].wallet_name)
    })
    var uniqueWalletTypes = walletEntries.filter(onlyUnique);

    Object.keys(uniqueWalletTypes).map((item) => {
        var walletDateArray = []
        var walletDataDesktop = []
        var walletDataMobile = []
        var walletDataTotal = []
        //walletDataConst = []

        Object.keys(walletData).map((data_item) => {
            if (walletData[item].wallet_name == uniqueWalletTypes[data_item]) {
                walletDateArray.push(walletData[data_item].date)
                walletDataDesktop.push({
                    x: walletData[data_item].date,
                    y: walletData[data_item].desktop,
                })
                walletDataMobile.push({
                    x: walletData[data_item].date,
                    y: walletData[data_item].mobile,
                })
                walletDataTotal.push({
                    x: walletData[data_item].date,
                    y: walletData[data_item].total,
                })
                walletPO = walletData[data_item].proposal_owner
            }
        })       
        
        const walletDataConst = {
            wallet_name: uniqueWalletTypes[item],
            wallet_proposal_owner: walletPO,
            dates: walletDateArray,
            total_downloads: walletDataTotal,
            desktop_downloads: walletDataDesktop,
            mobile_downloads: walletDataMobile,
        }
        storeMainData.push(walletDataConst)     // Push merchant KPI const to report KPI Array

        //storeAirtablePosts.push(walletDataConst)        
    })
    return storeMainData
}

// Processing function for Main proposal data
var processPosData = function mainPosFunction(posSystemData) {
    storeMainData = []

    var posEntries = []
    var uniqueSystemTypes
    Object.keys(posSystemData).map((item) => {
        posEntries.push(posSystemData[item].system_name)
    })
    var uniqueSystemTypes = posEntries.filter(onlyUnique);

    Object.keys(uniqueSystemTypes).map((item) => {
        var systemDateArray = []
        var systemTransactions = []
        var systemVolume = []
        var systemPO

        Object.keys(posSystemData).map((data_item) => {
            if (posSystemData[data_item].system_name == uniqueSystemTypes[item]) {
                systemDateArray.push(posSystemData[data_item].date)
                systemTransactions.push({
                    x: posSystemData[data_item].date,
                    y: posSystemData[data_item].dash_transactions,
                })
                systemVolume.push({
                    x: posSystemData[data_item].date,
                    y: posSystemData[data_item].dash_volume,
                })
                systemPO = posSystemData[data_item].proposal_owner
            }
        })       
        
        const systemDataConst = {
            system_name: uniqueSystemTypes[item],
            system_proposal_owner: systemPO,
            dates: systemDateArray,
            dash_transactions: systemTransactions,
            dash_volume: systemVolume,
        }
        storeMainData.push(systemDataConst)     // Push merchant KPI const to report KPI Array

        //storeAirtablePosts.push(walletDataConst)        
    })
    return storeMainData
}

// Export the Airtable functions to be imported in server.js
module.exports = {
    processWalletData,
    processPosData,
}