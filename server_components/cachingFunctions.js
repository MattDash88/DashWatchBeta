require('dotenv').config()    // Access .env variables

const cache = require('../cache')

// Get data processing functions from another file
var airtableFunctions = require('./airtableFunctions');
var labsAirtableFunctions = require('./labsAirtableFunctions');
var processingFunctions = require('./dataProcessingFunctions');
var labsProcessingFunctions = require('./labsProcessingFunctions');
var filterFunctions = require('./filterFunctions');

var cacheExpirationTime = process.env.CACHEEXPIRATION;  //Time until cache expires, can be adjusted for testing purposes

/* Airtable Query for Proposal Information Table */
const getAirtableCache = function AirtableCache() {
    return new Promise((resolve, reject) => {
        var mainInfoPromise = Promise.resolve(airtableFunctions.MainProposalPosts('Proposals'));
        var financialDataPromise = Promise.resolve(airtableFunctions.FinanceDataPosts('Funding and Expenses'));
        var merchantKpiPromise = Promise.resolve(airtableFunctions.MerchantKpiPosts('Merchant KPIs'));
        var eventKpiPromise = Promise.resolve(airtableFunctions.EventKpiPosts('Event KPIs'));
        var socialKpiPromise = Promise.resolve(airtableFunctions.SocialMediaKpiPosts('Social Media KPIs'));
        var prKpiPromise = Promise.resolve(airtableFunctions.PublicRelationsKpiPosts('Public Relations KPIs'));
        var reportDataPromise = Promise.resolve(airtableFunctions.ReportPosts('Reports'));

        Promise.all([mainInfoPromise, financialDataPromise, merchantKpiPromise, eventKpiPromise, socialKpiPromise, prKpiPromise, reportDataPromise]).then(function (valArray) {
            const storeAirtablePosts = []   // Create const to push all proposal data in

            // Sorting out all valArray items
            mainData = valArray[0]
            financialData = valArray[1]
            merchantKpiData = valArray[2]
            eventKpiData = valArray[3]
            socialMediaKpiData = valArray[4]
            publicRelationsKpiData = valArray[5]
            reportData = valArray[6]

            Object.keys(mainData).map((item) => {
                if (typeof mainData[item].id !== 'undefined') {    //Check if record exists
                    proposalMainData = processingFunctions.processMainData(mainData[item])
                    proposalReportData = processingFunctions.processReportData(mainData[item], reportData)
                    proposalKpiData = processingFunctions.processKpiData(proposalReportData, merchantKpiData, eventKpiData, socialMediaKpiData, publicRelationsKpiData)
                    proposalFinancialData = processingFunctions.processFinancialData(mainData[item], financialData)

                    const proposalData = {     // Create const for data of single proposal
                        main_data: proposalMainData,
                        kpi_data: proposalKpiData,
                        financial_data: proposalFinancialData,
                        report_data: proposalReportData,
                    }
                    storeAirtablePosts.push(proposalData)
                }
            }) // End of loop through all proposals

            // Store results in Redis cache, cache expire time is defined in .env
            cache.setex('airtableData', cacheExpirationTime, JSON.stringify(storeAirtablePosts))

            // Finish
            resolve(storeAirtablePosts)
        }).catch((error) => {
            reject({ error })
            console.log(error)
        })
    })
}

// Function to get data for the Month list
const getMonthListCache = function MonthListCache() {
    return new Promise((resolve, reject) => {
        Promise.resolve(airtableFunctions.MonthReportPosts('Month List Reports')).then(function (valArray) {
            const storeAirtablePosts = []   // Create const to push all proposal data in

            // Sorting out all valArray items
            monthReportData = valArray

            Object.keys(monthReportData).map((item) => {
                if (typeof monthReportData[item].proposal_ref !== 'undefined') {     //Check if record exists
                    monthData = processingFunctions.processMonthListData(monthReportData[item])
                    storeAirtablePosts.push(monthData)
                }
            })
            // Store results in Redis cache, cache expire time is defined in .env
            cache.setex('monthListData', cacheExpirationTime, JSON.stringify(storeAirtablePosts))
            resolve(storeAirtablePosts)
        }).catch((error) => {
            reject({ error })
            console.log(error)
        })
    })
}

// Function to get data for the Month list
const getOldListCache = function OldListCache() {
    return new Promise((resolve, reject) => {
        Promise.resolve(airtableFunctions.OldReportPosts('Old Reports')).then(function (valArray) {
            const storeAirtablePosts = []   // Create const to push all proposal data in

            // Sorting out all valArray items
            monthReportData = valArray

            Object.keys(monthReportData).map((item) => {
                if (typeof monthReportData[item].proposal_ref !== 'undefined') {     //Check if record exists
                    monthData = processingFunctions.processMonthListData(monthReportData[item])
                    storeAirtablePosts.push(monthData)
                }
            })
            // Store results in Redis cache, cache expire time is defined in .env
            cache.setex('oldListData', cacheExpirationTime, JSON.stringify(storeAirtablePosts))
            resolve(storeAirtablePosts)
        }).catch((error) => {
            reject({ error })
            console.log(error)
        })
    })
}

// Function to prepare data for Peyton's data processing project
const getMerchantKpiCache = function MerchantKpiCache() {
    return new Promise((resolve, reject) => {
        // Read cache for this function
        var mainInfoPromise = Promise.resolve(airtableFunctions.MainProposalPosts('Proposals'));
        var merchantKpiPromise = Promise.resolve(airtableFunctions.MerchantKpiPosts('Merchant KPIs'));

        Promise.all([mainInfoPromise, merchantKpiPromise]).then(function (valArray) {
            const storeAirtablePosts = []   // Create const to push all proposal data in

            // Sorting out all valArray items
            mainData = valArray[0]
            merchantKpiData = valArray[1]

            Object.keys(mainData).map((item) => {
                if (typeof mainData[item].id !== 'undefined') {    //Check if record exists
                    kpiData = processingFunctions.processMerchantKpiData(mainData[item], merchantKpiData)
                    if (kpiData !== "No KPI data found") {
                        const data = {
                            proposal_id: mainData[item].slug,
                            kpi_data: kpiData,
                        }

                        storeAirtablePosts.push(data)
                    }
                }
            })
            // Store results in Redis cache, cache expire time is defined in .env
            cache.setex('peytonsKpiData', cacheExpirationTime, JSON.stringify(storeAirtablePosts))
            resolve(storeAirtablePosts)
        }).catch((error) => {
            reject({ error })
            console.log(error)
        })
    })
}

// Function to prepare data project data for labs 
const getElectionsCache = function ElectionsCache() {
    return new Promise((resolve, reject) => {
        var electionsCandidatePromise = Promise.resolve(airtableFunctions.TrustProtectorList('Candidate List'));
        var electionsVoteDataPromise = Promise.resolve(airtableFunctions.VoteData('Vote Data'));
        var electionsVoteResultsPromise = Promise.resolve(airtableFunctions.VoteResults('Vote Results'));

        Promise.all([electionsCandidatePromise, electionsVoteDataPromise, electionsVoteResultsPromise]).then(function (valArray) {
            electionsCandidateData = []
            electionsVoteData = []
            electionsVoteResultsData = []

            // Check if candidate name exists
            Object.values(valArray[0]).map((item) => {
                if (typeof item.candidate_name !== 'undefined') {    //Check if record exists
                    electionsCandidateData.push(item)
                }
            })

            // Check if participation data and values were entered correctly
            Object.values(valArray[1]).map((item) => {
                if (typeof item.date !== 'undefined' && typeof item.vote_participation !== 'undefined') {    //Check if record exists
                    electionsVoteData.push(item)
                }
            })

            // Check if candidate results were entered correctly
            Object.values(valArray[2]).map((item) => {
                if (typeof item.candidate_name !== 'undefined' && typeof item.votes !== 'undefined') {    //Check if record exists
                    electionsVoteResultsData.push(item)
                }
            })

            // Create the data construct
            const electionsAllData = {
                candidate_data: electionsCandidateData,
                vote_metrics: electionsVoteData,
                vote_results: electionsVoteResultsData,
            }
            // Store results in Redis cache, cache expire time is defined in .env
            cache.setex('ElectionsData', cacheExpirationTime, JSON.stringify(electionsAllData))

            // Finish
            resolve(electionsAllData)
        }).catch((error) => {
            reject({ error })
            console.log(error)
        })
    })
}

// Function to prepare data for the Prepared Datasets for Labs (Wallets and POS systems)
const getLabsPreparedCache = function LabsPreparedCache() {
    return new Promise((resolve, reject) => {

        var walletDataPromise = Promise.resolve(labsAirtableFunctions.WalletDownloadPosts('Dash Wallets - Month'));
        var WalletVersionPromise = Promise.resolve(labsAirtableFunctions.WalletVersionPosts('Dash Wallets - Version'))
        var posDataPromise = Promise.resolve(labsAirtableFunctions.PosMetricsPosts('POS Systems'));

        Promise.all([walletDataPromise, WalletVersionPromise, posDataPromise]).then(function (valArray) {
            // Sorting out all valArray items
            labsWalletData = labsProcessingFunctions.processWalletData(valArray[0])
            WalletVersionData = labsProcessingFunctions.processVersionData(valArray[1])
            posSystemData = labsProcessingFunctions.processPosData(valArray[2])

            // Create the data construct
            const storeAirtablePosts = {
                wallet_data: labsWalletData,
                version_data: WalletVersionData,
                pos_system_data: posSystemData,
            }

            // Store results in Redis cache, cache expire time is defined in .env
            cache.setex('labsPreparedData', cacheExpirationTime, JSON.stringify(storeAirtablePosts))

            // Finish
            resolve(storeAirtablePosts)
        }).catch((error) => {
            reject({ error })
            console.log(error)
        })
    })
}

// Function to prepare data project data for labs 
const getLabsAllCache = function LabsAllCache() {
    return new Promise((resolve, reject) => {
        var labsProjectsPromise = Promise.resolve(labsAirtableFunctions.LabsKpiProjects('KPI - Dash Projects'));
        var labsKpiPromise = Promise.resolve(labsAirtableFunctions.LabsKpiEntries('KPI - Entries'));
        var labsValuesPromise = Promise.resolve(labsAirtableFunctions.LabsKpiValues('KPI - Values'));

        Promise.all([labsProjectsPromise, labsKpiPromise, labsValuesPromise]).then(function (valArray) {
            // Sorting out all valArray items
            labsProjectData = valArray[0]
            labsKpiData = valArray[1]
            labsValuesData = valArray[2]

            // Put datasets through processing function to build the array
            labsAllData = labsProcessingFunctions.processAllLabsData(labsProjectData, labsKpiData, labsValuesData)

            // Store results in Redis cache, cache expire time is defined in .env
            cache.setex('AllLabsData', cacheExpirationTime, JSON.stringify(labsAllData))

            // Finish
            resolve(labsAllData)
        }).catch((error) => {
            reject({ error })
            console.log(error)
        })
    })
}


module.exports = {
    getAirtableCache,
    getMonthListCache,
    getOldListCache,
    getMerchantKpiCache,
    getElectionsCache,
    getLabsPreparedCache,
    getLabsAllCache,
}