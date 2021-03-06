// All server code uses ES5 because of Airtable plugin
require('dotenv').config()    // Access .env variables
const express = require('express');
const next = require('next');
const cache = require('./cache');
const fetch = require('isomorphic-unfetch');

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT;
var gaKey = process.env.GAKEY;
const app = next({ dev });
const ReactGA = require('react-ga');
ReactGA.initialize(gaKey);

const serialize = data => JSON.stringify({ data });
var cacheExpirationTime = process.env.CACHEEXPIRATION;  //Time until cache expires, can be adjusted for testing purposes

// Get data processing functions from another file
var airtableFunctions = require('./server_components/airtableFunctions');
var labsFunctions = require('./server_components/main_api_functions/labsApiFunctions');
var datasetBuildingFunctions = require('./server_components/datasetBuildingFunctions');
//var databaseFunctions = require('./server_components/db_functions');
var labsAirtableFunctions = require('./server_components/labsAirtableFunctions');
var labsSyncingFunctions = require('./server_components/data_retrieval/newLabsSyncingFunctions');
var processingFunctions = require('./server_components/dataProcessingFunctions');
var labsProcessingFunctions = require('./server_components/labsProcessingFunctions');
var filterFunctions = require('./server_components/filterFunctions');
var routingFunctions = require('./server_components/routingFunctions');

var labsElemRetrievalFunctions = require('./server_components/routingFunctions');

/* Airtable Query for Proposal Information Table */
const getAirtableData = (refreshCache) => {
  return new Promise((resolve, reject) => {
    // Read cache for this function
    cache.redisRetrieve('airtableData', function (error, data) {
      // Connection with redis fails, for back to direct Airtable retrieval
      var redisConnectionFailure;
      if (error) redisConnectionFailure = true;

      // If data is available in cache and a cache refresh is not requested, load from cache
      if (!!data && refreshCache==false) { 
        // Stored value, grab from cache
        resolve(JSON.parse(data))
      }

      // If cache is empty or a cache refresh is requested, retrieve from Airtable
      else {  
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
              proposalReportData = processingFunctions.oldProcessReportData(mainData[item], reportData)
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
          if (!redisConnectionFailure) {
            cache.redisStore('airtableData', storeAirtablePosts)
          }

          // Finish
          resolve(storeAirtablePosts)
        }).catch((error) => {
          reject({ error })
          console.log(error)
        })
      }
    })
  })
}

// Function to get data for the Month list
const getMonthListData = (refreshCache) => {
  return new Promise((resolve, reject) => {
    // Read cache for this function
    cache.redisRetrieve('monthListData', function (error, data) {
      // Connection with redis fails, for back to direct Airtable retrieval
      var redisConnectionFailure;
      if (error) redisConnectionFailure = true;

      // If data is available in cache and a cache refresh is not requested, load from cache
      if (!!data && refreshCache==false) { 
        resolve(JSON.parse(data))
      }

      // If cache is empty or a cache refresh is requested, retrieve from Airtable
      else { 
        Promise.resolve(airtableFunctions.MonthReportPosts('Month List Reports')).then(function (valArray) {
          const reportListPosts = datasetBuildingFunctions.createMonthListDataset(valArray)

          if (!redisConnectionFailure) {
          // Store results in Redis cache, cache expire time is defined in .env
            cache.redisStore('monthListData', reportListPosts)
          }
          
          resolve(reportListPosts)
        }).catch((error) => {
          reject({ error })
          console.log(error)
        })
      }
    })
  })
}

// Function to get data for the Month list
const getOldListData = (refreshCache) => {
  return new Promise((resolve, reject) => {
    // Read cache for this function
    cache.redisRetrieve('oldListData', function (error, data) {
      // Connection with redis fails, for back to direct Airtable retrieval
      var redisConnectionFailure;
      if (error) redisConnectionFailure = true;

      // If data is available in cache and a cache refresh is not requested, load from cache
      if (!!data && refreshCache==false) { 
        resolve(JSON.parse(data))
      }

      // If cache is empty or a cache refresh is requested, retrieve from Airtable
      else {  
        Promise.resolve(airtableFunctions.OldReportPosts('Old Reports')).then(function (valArray) {
          // Create const to push proposal data in
          const reportPosts = []
          const optedOutPosts = []

          // Sorting out all valArray items
          monthReportData = valArray

          Object.keys(monthReportData).map((item) => {
            if (typeof monthReportData[item].proposal_ref !== 'undefined' && typeof monthReportData[item].report_status !== 'undefined' && monthReportData[item].published_month !== 'June2018') {     //Check if record exists
              monthData = processingFunctions.processMonthListData(monthReportData[item])
              if (monthData.list_data.report_status[0] == "Opted Out") {
                optedOutPosts.push(monthData)
              } else {
                reportPosts.push(monthData)
              }
            }
          })

          const reportListPosts = {     // Create const with both lists
            report_list: reportPosts,
            opted_out_list: optedOutPosts,
          }

          if (!redisConnectionFailure) {
            // Store results in Redis cache, cache expire time is defined in .env
            cache.redisStore('oldListData', reportListPosts)
          }
          resolve(reportListPosts)
        }).catch((error) => {
          reject({ error })
          console.log(error)
        })
      }
    })
  })
}

/* Airtable Query for Proposal List Page */
const getProposalListData = (refreshCache) => {
  return new Promise((resolve, reject) => {
    // Read cache for this function
    cache.redisRetrieve('proposalListData', function (error, data) {
      // Connection with redis fails, for back to direct Airtable retrieval
      var redisConnectionFailure;
      if (error) redisConnectionFailure = true;
      
      // If data is available in cache and a cache refresh is not requested, load from cache
      if (!!data && refreshCache==false) { 
        // Stored value, grab from cache
        resolve(JSON.parse(data))
      } 
      
      // If cache is empty or a cache refresh is requested, retrieve from Airtable
      else {    
        var mainInfoPromise = Promise.resolve(airtableFunctions.MainProposalPosts('Proposals'));
        var reportDataPromise = Promise.resolve(airtableFunctions.ReportPosts('Reports'));

        Promise.all([mainInfoPromise, reportDataPromise]).then(function (valArray) {
          const storeAirtablePosts = []   // Create const to push all proposal data in

          // Sorting out all valArray items
          mainData = valArray[0]
          reportData = valArray[1]

          Object.keys(mainData).map((item) => {
            if (typeof mainData[item].id !== 'undefined') {    //Check if record exists
              proposalMainData = processingFunctions.processMainData(mainData[item])
              proposalReportData = processingFunctions.processReportData(mainData[item], reportData)

              const proposalData = {     // Create const for data of single proposal
                main_data: proposalMainData,
                report_data: proposalReportData,
              }
              storeAirtablePosts.push(proposalData)
            }
          }) // End of loop through all proposals

          if (!redisConnectionFailure) {
            // Store results in Redis cache, cache expire time is defined in .env
          cache.redisStore('proposalListData', storeAirtablePosts)
          }

          // Finish
          resolve(storeAirtablePosts)
        }).catch((error) => {
          reject({ error })
          console.log(error)
        })
      }
    })
  })
}

// Function to prepare data for Peyton's data processing project
const getMerchantKpiData = () => {
  return new Promise((resolve, reject) => {
    // Read cache for this function
    cache.redisRetrieve('peytonsKpiData', function (error, data) {
      if (error) throw error

      if (!!data) {   // If value was already retrieved recently, grab from cache
        resolve(JSON.parse(data))
      }
      else {    // If cache is empty, retrieve from Airtable
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
          if (!redisConnectionFailure) {
            // Store results in Redis cache, cache expire time is defined in .env
          cache.redisStore('peytonsKpiData', storeAirtablePosts)
          }
          resolve(storeAirtablePosts)
        }).catch((error) => {
          reject({ error })
          console.log(error)
        })
      }
    })
  })
}

// Function to prepare data project data for labs 
const getElectionsData = (refreshCache) => {
  return new Promise((resolve, reject) => {
    // Read cache for this function
    cache.redisRetrieve('ElectionsData', function (error, data) {
      // Connection with redis fails, for back to direct Airtable retrieval
      var redisConnectionFailure;
      if (error) redisConnectionFailure = true;

      // If data is available in cache and a cache refresh is not requested, load from cache
      if (!!data && refreshCache==false) {
        resolve(JSON.parse(data))
      }

      // If cache is empty or a cache refresh is requested, retrieve from Airtable
      else {    
        var TPE2019CandidatePromise = Promise.resolve(airtableFunctions.ElectionsCandidateList('Candidate List - TPE2019'));
        var DIF2019CandidatePromise = Promise.resolve(airtableFunctions.ElectionsCandidateList('Candidate List - DIF2019'));
        var TPE2020CandidatePromise = Promise.resolve(airtableFunctions.ElectionsCandidateList('Candidate List - TPE2020'));
        var DIF2020CandidatePromise = Promise.resolve(airtableFunctions.ElectionsCandidateList('Candidate List - DIF2020'));
        var TPE2021CandidatePromise = Promise.resolve(airtableFunctions.ElectionsCandidateList('Candidate List - TPE2021'));
        var DIF2021CandidatePromise = Promise.resolve(airtableFunctions.ElectionsCandidateList('Candidate List - DIF2021'));
        var TPE2019VoteDataPromise = Promise.resolve(airtableFunctions.VoteData('Vote Data - TPE2019'));
        var DIF2019VoteDataPromise = Promise.resolve(airtableFunctions.VoteData('Vote Data - DIF2019'));
        var TPE2020VoteDataPromise = Promise.resolve(airtableFunctions.VoteData('Vote Data - TPE2020'));
        var DIF2020VoteDataPromise = Promise.resolve(airtableFunctions.VoteData('Vote Data - DIF2020'));
        var TPE2021VoteDataPromise = Promise.resolve(airtableFunctions.VoteData('Vote Data - TPE2021'));
        var DIF2021VoteDataPromise = Promise.resolve(airtableFunctions.VoteData('Vote Data - DIF2021'));
        var TPE2019VoteResultsPromise = Promise.resolve(airtableFunctions.VoteResults('Vote Results - TPE2019'));
        var DIF2019VoteResultsPromise = Promise.resolve(airtableFunctions.VoteResults('Vote Results - DIF2019'));
        var TPE2020VoteResultsPromise = Promise.resolve(airtableFunctions.VoteResults('Vote Results - TPE2020'));
        var DIF2020VoteResultsPromise = Promise.resolve(airtableFunctions.VoteResults('Vote Results - DIF2020'));
        var TPE2021VoteResultsPromise = Promise.resolve(airtableFunctions.VoteResults('Vote Results - TPE2021'));
        var DIF2021VoteResultsPromise = Promise.resolve(airtableFunctions.VoteResults('Vote Results - DIF2021'));

        Promise.all([
          TPE2019CandidatePromise,
          DIF2019CandidatePromise,
          TPE2020CandidatePromise,
          DIF2020CandidatePromise,
          TPE2021CandidatePromise,
          DIF2021CandidatePromise,
          TPE2019VoteDataPromise,
          DIF2019VoteDataPromise,
          TPE2020VoteDataPromise,
          DIF2020VoteDataPromise,
          TPE2021VoteDataPromise,
          DIF2021VoteDataPromise,
          TPE2019VoteResultsPromise,
          DIF2019VoteResultsPromise,
          TPE2020VoteResultsPromise,
          DIF2020VoteResultsPromise,
          TPE2021VoteResultsPromise,
          DIF2021VoteResultsPromise
        ]).then(function (valArray) {

          TPE2019CandidateList = valArray[0]
          DIF2019CandidateList = valArray[1]
          TPE2020CandidateList = valArray[2]
          DIF2020CandidateList = valArray[3]
          TPE2021CandidateList = valArray[4]
          DIF2021CandidateList = valArray[5]

          TPE2019ParticipationData = valArray[6]
          DIF2019ParticipationData = valArray[7]
          TPE2020ParticipationData = valArray[8]
          DIF2020ParticipationData = valArray[9]
          TPE2021ParticipationData = valArray[10]
          DIF2021ParticipationData = valArray[11]

          TPE2019ResultsData = valArray[12]
          DIF2019ResultsData = valArray[13]
          TPE2020ResultsData = valArray[14]
          DIF2020ResultsData = valArray[15]
          TPE2021ResultsData = valArray[16]
          DIF2021ResultsData = valArray[17]

          var TPE2019CandidateData = []
          var DIF2019CandidateData = []
          var TPE2020CandidateData = []
          var DIF2020CandidateData = []
          var TPE2021CandidateData = []
          var DIF2021CandidateData = []
          var TPE2019VoteData = []
          var DIF2019VoteData = []
          var TPE2020VoteData = []
          var DIF2020VoteData = []
          var TPE2021VoteData = []
          var DIF2021VoteData = []
          var TPE2019VoteResultsData = []
          var DIF2019VoteResultsData = []
          var TPE2020VoteResultsData = []
          var DIF2020VoteResultsData = []
          var TPE2021VoteResultsData = []
          var DIF2021VoteResultsData = []

          // Check if TPE2019 candidate name exists
          Object.values(TPE2019CandidateList).map((item) => {            
            if (typeof item.candidate_name !== 'undefined') {    //Check if record exists
              TPE2019CandidateData.push(item)
            }
          })

          // Check if DIF2019 candidate name exists
          Object.values(DIF2019CandidateList).map((item) => {            
            if (typeof item.candidate_name !== 'undefined') {    //Check if record exists
              DIF2019CandidateData.push(item)
            }
          })

          // Check if TPE2020 candidate name exists
          Object.values(TPE2020CandidateList).map((item) => {            
            if (typeof item.candidate_name !== 'undefined') {    //Check if record exists
              TPE2020CandidateData.push(item)
            }
          })

          // Check if TPE2020 candidate name exists
          Object.values(DIF2020CandidateList).map((item) => {            
            if (typeof item.candidate_name !== 'undefined') {    //Check if record exists
              DIF2020CandidateData.push(item)
            }
          })

          // Check if TPE2021 candidate name exists
          Object.values(TPE2021CandidateList).map((item) => {            
            if (typeof item.candidate_name !== 'undefined') {    //Check if record exists
              TPE2021CandidateData.push(item)
            }
          })

          // Check if TPE2020 candidate name exists
          Object.values(DIF2021CandidateList).map((item) => {            
            if (typeof item.candidate_name !== 'undefined') {    //Check if record exists
              DIF2021CandidateData.push(item)
            }
          })

          // Check if participation data and values were entered correctly
          Object.values(TPE2019ParticipationData).map((item) => {            
            if (typeof item.date !== 'undefined' && typeof item.vote_participation !== 'undefined') {    //Check if record exists
              TPE2019VoteData.push(item)
            }
          })

          // Check if participation data and values were entered correctly
          Object.values(DIF2019ParticipationData).map((item) => {            
            if (typeof item.date !== 'undefined' && typeof item.vote_participation !== 'undefined') {    //Check if record exists
              DIF2019VoteData.push(item)
            }
          })

          // Check if participation data and values were entered correctly
          Object.values(TPE2020ParticipationData).map((item) => {            
            if (typeof item.date !== 'undefined' && typeof item.vote_participation !== 'undefined') {    //Check if record exists
              TPE2020VoteData.push(item)
            }
          })

          // Check if participation data and values were entered correctly
          Object.values(DIF2020ParticipationData).map((item) => {            
            if (typeof item.date !== 'undefined' && typeof item.vote_participation !== 'undefined') {    //Check if record exists
              DIF2020VoteData.push(item)
            }
          })

          // Check if participation data and values were entered correctly
          Object.values(TPE2021ParticipationData).map((item) => {            
            if (typeof item.date !== 'undefined' && typeof item.vote_participation !== 'undefined') {    //Check if record exists
              TPE2021VoteData.push(item)
            }
          })

          // Check if participation data and values were entered correctly
          Object.values(DIF2021ParticipationData).map((item) => {            
            if (typeof item.date !== 'undefined' && typeof item.vote_participation !== 'undefined') {    //Check if record exists
              DIF2021VoteData.push(item)
            }
          })
          
          // Check if candidate results were entered correctly
          Object.values(TPE2019ResultsData).map((item) => {            
            if (typeof item.candidate_name !== 'undefined' && typeof item.votes !== 'undefined') {    //Check if record exists
              TPE2019VoteResultsData.push(item)
            }
          })

          // Check if candidate results were entered correctly
          Object.values(DIF2019ResultsData).map((item) => {            
            if (typeof item.candidate_name !== 'undefined' && typeof item.votes !== 'undefined') {    //Check if record exists
              DIF2019VoteResultsData.push(item)
            }
          })

          // Check if candidate results were entered correctly
          Object.values(TPE2020ResultsData).map((item) => {            
            if (typeof item.candidate_name !== 'undefined' && typeof item.votes !== 'undefined') {    //Check if record exists
              TPE2020VoteResultsData.push(item)
            }
          })

          // Check if candidate results were entered correctly
          Object.values(DIF2020ResultsData).map((item) => {            
            if (typeof item.candidate_name !== 'undefined' && typeof item.votes !== 'undefined') {    //Check if record exists
              DIF2020VoteResultsData.push(item)
            }
          })

          // Check if candidate results were entered correctly
          Object.values(TPE2021ResultsData).map((item) => {            
            if (typeof item.candidate_name !== 'undefined' && typeof item.votes !== 'undefined') {    //Check if record exists
              TPE2021VoteResultsData.push(item)
            }
          })

          // Check if candidate results were entered correctly
          Object.values(DIF2021ResultsData).map((item) => {            
            if (typeof item.candidate_name !== 'undefined' && typeof item.votes !== 'undefined') {    //Check if record exists
              DIF2021VoteResultsData.push(item)
            }
          })

          // Create the data construct
          const electionsAllData = {
            candidate_data: {
              TPE2019: TPE2019CandidateData,
              DIF2019: DIF2019CandidateData,
              TPE2020: TPE2020CandidateData,
              DIF2020: DIF2020CandidateData,
              TPE2021: TPE2021CandidateData,
              DIF2021: DIF2021CandidateData,
            },
            vote_metrics: {
              TPE2019: TPE2019VoteData,
              DIF2019: DIF2019VoteData,
              TPE2020: TPE2020VoteData,
              DIF2020: DIF2020VoteData,
              TPE2021: TPE2021VoteData,
              DIF2021: DIF2021VoteData,
            },
            vote_results: {
              TPE2019: TPE2019VoteResultsData,
              DIF2019: DIF2019VoteResultsData,
              TPE2020: TPE2020VoteResultsData,
              DIF2020: DIF2020VoteResultsData,
              TPE2021: TPE2021VoteResultsData,
              DIF2021: DIF2021VoteResultsData,
            },
          }
          if (!redisConnectionFailure) {
            // Store results in Redis cache, cache expire time is defined in .env
          cache.redisStore('ElectionsData', electionsAllData)
          }
          
          // Finish
          resolve(electionsAllData)
        }).catch((error) => {
          reject({ error })
          console.log(error)
        })
      }
    })
  })
}

// Function to prepare data for the Prepared Datasets for Labs (Wallets and POS systems)
const getLabsPreparedData = (refreshCache) => {
  return new Promise((resolve, reject) => {
    // Read cache for this function
    cache.redisRetrieve('labsPreparedData', function (error, data) {
      // Connection with redis fails, for back to direct Airtable retrieval
      var redisConnectionFailure;
      if (error) redisConnectionFailure = true;

      // If data is available in cache and a cache refresh is not requested, load from cache
      if (!!data && refreshCache==false) { 
        resolve(JSON.parse(data))
      }

      // If cache is empty or a cache refresh is requested, retrieve from Airtable
      else {        
        var walletDataPromise = Promise.resolve(labsAirtableFunctions.WalletDownloadPosts('Dash Wallets - Month'));
        var WalletCountryPromise = Promise.resolve(labsAirtableFunctions.WalletCountryPosts('Dash Wallets - Countries'))
        var WalletVersionPromise = Promise.resolve(labsAirtableFunctions.WalletVersionPosts('Dash Wallets - Version'))
        var posDataPromise = Promise.resolve(labsAirtableFunctions.PosMetricsPosts('POS Systems'));
        
        Promise.all([walletDataPromise, WalletCountryPromise, WalletVersionPromise, posDataPromise]).then(function (valArray) {          
          // Sorting out all valArray items
          labsWalletData = labsProcessingFunctions.processWalletData(valArray[0])
          walletCountryData = labsProcessingFunctions.processCountryData(valArray[1])
          walletVersionData = labsProcessingFunctions.processVersionData(valArray[2])
          posSystemData = labsProcessingFunctions.processPosData(valArray[3])

          // Create the data construct
          const storeAirtablePosts = {
            wallet_data: labsWalletData,
            country_data: walletCountryData,
            version_data: walletVersionData,
            pos_system_data: posSystemData,
          }

          if (!redisConnectionFailure) {
            // Store results in Redis cache, cache expire time is defined in .env
          cache.redisStore('labsPreparedData', storeAirtablePosts)
          }
          
          // Finish
          resolve(storeAirtablePosts)
        }).catch((error) => {
          reject({ error })
          console.log(error)
        })
      }
    })
  })
}



// Function to prepare data project data for labs 
const getLabsAllData = (refreshCache) => {
  return new Promise((resolve, reject) => {
    // Read cache for this function
    cache.redisRetrieve('AllLabsData', function (error, data) {
      // Connection with redis fails, for back to direct Airtable retrieval
      var redisConnectionFailure;
      if (error) redisConnectionFailure = true;

      // If data is available in cache and a cache refresh is not requested, load from cache
      if (!!data && refreshCache==false) {
        resolve(JSON.parse(data))
      }
      
      // If cache is empty or a cache refresh is requested, retrieve from Airtable
      else {   
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

          if (!redisConnectionFailure) {
            // Store results in Redis cache, cache expire time is defined in .env
          cache.redisStore('AllLabsData', labsAllData)
          }
          
          // Finish
          resolve(labsAllData)
        }).catch((error) => {
          reject({ error })
          console.log(error)
        })
      }
    })
  })
}

app.prepare()
  .then(() => {
    const server = express()



    // Internal API call to get Airtable data
    server.get('/api/get/posts', (req, res) => {
      var refreshCache = false    // Load from cache if available
      Promise.resolve(getAirtableData(refreshCache)).then(function (valArray) {
        res.writeHead(200, {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        })
        return res.end(serialize(valArray))
      }).catch((error) => {
        console.log(error)
        // Send empty JSON otherwise page load hangs indefinitely
        res.writeHead(200, { 'Content-Type': 'application/json' })
        return res.end(serialize({}))
      });
    })

    // Internal API call to create Reports page
    server.get('/api/get/monthlist', (req, res) => {
      monthSelection = []
      var refreshCache = false    // Load from cache if available
      Promise.resolve(getMonthListData(refreshCache)).then(function (valArray, error) {
        if (error) throw error
        res.writeHead(200, {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        })
        return res.end(serialize(valArray))
      }).catch((error) => {
        console.log(error)
        // Send empty JSON otherwise page load hangs indefinitely
        res.writeHead(200, { 'Content-Type': 'application/json' })
        return res.end(serialize({}))
      });
    })

    // Internal API call to create Reports page
    server.get('/api/get/old_monthlist', (req, res) => {
      monthSelection = []
      var refreshCache = false    // Load from cache if available
      Promise.resolve(getOldListData(refreshCache)).then(function (valArray) {
        res.writeHead(200, {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        })
        return res.end(serialize(valArray))
      }).catch((error) => {
        console.log(error)
        // Send empty JSON otherwise page load hangs indefinitely
        res.writeHead(200, { 'Content-Type': 'application/json' })
        return res.end(serialize({}))
      });
    })

    // Internal API call to get data for the Proposal List page
    server.get('/api/get/proposalList', (req, res) => {
      var refreshCache = false    // Load from cache if available
      Promise.resolve(getProposalListData(refreshCache)).then(function (valArray) {
        res.writeHead(200, {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        })
        return res.end(serialize(valArray))
      }).catch((error) => {
        console.log(error)
        // Send empty JSON otherwise page load hangs indefinitely
        res.writeHead(200, { 'Content-Type': 'application/json' })
        return res.end(serialize({}))
      });
    })

    // Internal API call to support search
    server.get('/api/filter', (req, res) => {
      query = req.query
      var refreshCache = false    // Load from cache if available
      Promise.resolve(getProposalListData(refreshCache)).then(function (valArray) {
        processedData = valArray    // Put proposal data in processedData
        if (query.search !== '') {  // Filter on search is there is a search item
          processedData = filterFunctions.searchQuery(processedData, query.search)
        } if (query.show_inactive == 'false') {  // Filter proposals with opted out and concluded comm_status
          processedData = filterFunctions.filterQuery(processedData)
        }
        res.writeHead(200, {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        })
        return res.end(serialize(processedData))
      }).catch((error) => {
        console.log(error)
        // Send empty JSON otherwise page load hangs indefinitely
        res.writeHead(200, { 'Content-Type': 'application/json' })
        return res.end(serialize({}))
      });
    })

    // API call to get individual Proposal data
    server.get('/api/p/:slug', (req, res) => {
      var refreshCache = false    // Load from cache if available
      query = req.params.slug
      Promise.resolve(getAirtableData(refreshCache)).then(function (valArray) {
        proposalData = processingFunctions.singleProposalQuery(valArray, query)
        res.writeHead(200, {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        })
        return res.end(serialize(proposalData))
      }).catch((error) => {
        console.log(error)
        // Send empty JSON otherwise page load hangs indefinitely
        res.writeHead(200, { 'Content-Type': 'application/json' })
        return res.end(serialize({}))
      });
    })


    // API call for Peyton's 
    server.get('/api/get/kpidata', (req, res) => {
      Promise.resolve(getMerchantKpiData()).then(function (valArray) {
        res.writeHead(200, {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        })
        return res.end(serialize(valArray))
      }).catch((error) => {
        console.log(error)
        // Send empty JSON otherwise page load hangs indefinitely
        res.writeHead(200, { 'Content-Type': 'application/json' })
        return res.end(serialize({}))
      });
    })

    // API call for trust protector election candidates table
    server.get('/api/get/electionsData', (req, res) => {
      var refreshCache = false    // Load from cache if available
      Promise.resolve(getElectionsData(refreshCache)).then(function (valArray) {
        res.writeHead(200, {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        })
        return res.end(serialize(valArray))
      }).catch((error) => {
        console.log(error)
        // Send empty JSON otherwise page load hangs indefinitely
        res.writeHead(200, { 'Content-Type': 'application/json' })
        return res.end(serialize({}))
      });
    })

    // API call for trust protector election candidates table
    server.get('/api/get/labsPreparedData', (req, res) => {
      var refreshCache = false    // Load from cache if available
      Promise.resolve(getLabsPreparedData(refreshCache)).then(function (valArray) {
        res.writeHead(200, {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        })
        return res.end(serialize(valArray))
      }).catch((error) => {
        console.log(error)
        // Send empty JSON otherwise page load hangs indefinitely
        res.writeHead(200, { 'Content-Type': 'application/json' })
        return res.end(serialize({}))
      });
    })

    // API call for trust protector election candidates table
    server.get('/api/get/labsAllData', (req, res) => {
      var refreshCache = false    // Load from cache if available
      Promise.resolve(getLabsAllData(refreshCache)).then(function (valArray) {
        res.writeHead(200, {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        })
        return res.end(serialize(valArray))
      }).catch((error) => {
        console.log(error)
        // Send empty JSON otherwise page load hangs indefinitely
        res.writeHead(200, { 'Content-Type': 'application/json' })
        return res.end(serialize({}))
      });
    })

    // API call to get labs Wallet top lists
    server.get('/api/list/labsProjectsWithKpis', (req, res) => {
      var refreshCache = true   // Request cache refresh
      Promise.resolve(labsFunctions.getLabsKpiProjectList(refreshCache)).then(function (results) {
        res.status(200).send(results);
      }).catch((error) => {                                                           // Run this if the retrieving functions returns an error
        res.status(200).send(serialize(error))
      })
    })

    // API call to get labs Wallet top lists
    server.get('/api/list/ListOfKpis', (req, res) => {
      var project = req.query.hash 
      Promise.resolve(labsFunctions.getLabsListOfKpis(project)).then(function (results) {
        res.status(200).send(results);
      }).catch((error) => {                                                           // Run this if the retrieving functions returns an error
        res.status(200).send(serialize(error))
      })
    })

    // API call to get labs Wallet top lists
    server.get('/api/dataset/labsWalletTopLists', (req, res) => {
      var refreshCache = true   // Request cache refresh
      Promise.resolve(labsFunctions.getLabsTopWalletList(refreshCache)).then(function (results) {
        res.status(200).send(results);
      }).catch((error) => {                                                           // Run this if the retrieving functions returns an error
        res.status(200).send(serialize(error))
      })
    })

    // API call to get labs Wallet top lists
    server.get('/api/dataset/labsWebsiteTopLists', (req, res) => {
      var refreshCache = true   // Request cache refresh
      Promise.resolve(labsFunctions.getLabsTopWebsiteList(refreshCache)).then(function (results) {
        res.status(200).send(results);
      }).catch((error) => {                                                           // Run this if the retrieving functions returns an error
        res.status(200).send(serialize(error))
      })
    })

    // API call to get labs Wallet data
    server.get('/api/dataset/labsCountryWalletData', (req, res) => {
      var refreshCache = true   // Request cache refresh
      Promise.resolve(labsFunctions.getLabsWalletsCountryData(refreshCache)).then(function (results) {
        res.status(200).send(results);
      }).catch((error) => {                                                           // Run this if the retrieving functions returns an error
        res.status(200).send(serialize(error))
      })
    })

    // API call to get labs Wallet data
    server.get('/api/dataset/labsWalletAndroidGlobalData', (req, res) => {
      var refreshCache = true   // Request cache refresh
      Promise.resolve(labsFunctions.getLabsWalletAndroidGlobalData(refreshCache)).then(function (results) {
        res.status(200).send(results);
      }).catch((error) => {                                                           // Run this if the retrieving functions returns an error
        res.status(200).send(serialize(error))
      })
    })

    // API call to get labs Wallet data
    server.get('/api/dataset/labsOtherWalletData', (req, res) => {
      var refreshCache = true   // Request cache refresh
      Promise.resolve(labsFunctions.getLabsOtherWalletsData(refreshCache)).then(function (results) {
        res.status(200).send(results);
      }).catch((error) => {                                                           // Run this if the retrieving functions returns an error
        res.status(200).send(serialize(error))
      })
    })

    // API call to get labs Wallet data
    server.get('/api/dataset/labsCountryList', (req, res) => {
      var refreshCache = true   // Request cache refresh
      Promise.resolve(labsFunctions.getLabsCountryList(refreshCache)).then(function (results) {
        res.status(200).send(results);
      }).catch((error) => {                                                           // Run this if the retrieving functions returns an error
        res.status(200).send(serialize(error))
      })
    })

    // API call to get labs Website data per country
    server.get('/api/dataset/labsWebsiteCountryData', (req, res) => {
      var refreshCache = true   // Request cache refresh
      Promise.resolve(labsFunctions.getLabsWebsiteCountryData(refreshCache)).then(function (results) {
        res.status(200).send(results);
      }).catch((error) => {                                                           // Run this if the retrieving functions returns an error
        res.status(200).send(serialize(error))
      })
    })

    // API call to get labs Website data for world
    server.get('/api/dataset/labsWebsiteGlobalData', (req, res) => {
      var refreshCache = true   // Request cache refresh
      Promise.resolve(labsFunctions.getLabsWebsiteGlobalData(refreshCache)).then(function (results) {
        res.status(200).send(results);
      }).catch((error) => {                                                           // Run this if the retrieving functions returns an error
        res.status(200).send(serialize(error))
      })
    })

    // API call to get labs Website data for world
    server.get('/api/dataset/labsKpiData', (req, res) => {
      var kpiID = req.query.kpi 
      Promise.resolve(labsFunctions.getLabsKpiValuesDataset(kpiID)).then(function (results) {
        res.status(200).send(results);
      }).catch((error) => {                                                           // Run this if the retrieving functions returns an error
        res.status(200).send(serialize(error))
      })
    })

    // Internal API call to refresh cache
    server.get('/api/cache/refresh', (req, res) => {
      var refreshCache = true   // Request cache refresh
      var airtablePromise = Promise.resolve(getAirtableData(refreshCache));
      var monthListPromise = Promise.resolve(getMonthListData(refreshCache));
      var oldListPromise = Promise.resolve(getOldListData(refreshCache));
      var proposalListPromise = Promise.resolve(getProposalListData(refreshCache))
      var electionsPromise = Promise.resolve(getElectionsData(refreshCache));
      var labsPreparedPromise = Promise.resolve(getLabsPreparedData(refreshCache));
      var labsAllPromise = Promise.resolve(getLabsAllData(refreshCache));

      Promise.all([airtablePromise, monthListPromise, oldListPromise, proposalListPromise, electionsPromise, labsPreparedPromise, labsAllPromise]).then(function (valArray) {
        res.writeHead(200, {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        })
        return res.end(serialize('caches reloaded'))
      }).catch((error) => {
        console.log(error)
        // Send empty JSON otherwise page load hangs indefinitely
        res.writeHead(200, { 'Content-Type': 'application/json' })
        return res.end(serialize({}))
      });
    })

    // Routing for reports for /r
    server.get('/r/:month/:reportId', (req, res) => {
      const actualPage = routingFunctions.reportRedirects(req.params.month, req.params.reportId)
      res.redirect(actualPage);
    })

    // Routing for reports for /reports
    server.get('/reports/:month/:reportId', (req, res) => {
      const actualPage = routingFunctions.reportRedirects(req.params.month, req.params.reportId)
      res.redirect(actualPage);
    })

    // Routing to main page
    server.get('/reportlist', (req, res) => {
      const actualPage = '/index'

      const queryParams_reports = req.query // Pass on queries

      app.render(req, res, actualPage, queryParams_reports)
    })

    // Routing to main page
    server.get('/oldreports', (req, res) => {
      const actualPage = '/old_reports'

      const queryParams_reports = req.query // Pass on queries

      app.render(req, res, actualPage, queryParams_reports)
    })

    // Routing to the proposal list page
    server.get('/proposals', (req, res) => {
      const actualPage = '/proposals'

      const queryParams_proposals = req.query // Pass on queries      

      app.render(req, res, actualPage, queryParams_proposals)
    })

    // Direct routing to proposal pages
    server.get('/p/:slug', (req, res) => {
      const actualPage = '/single_page'

      const queryParams_p = req.query // Pass on queries
      queryParams_p.slug = req.params.slug

      app.render(req, res, actualPage, queryParams_p)
    })

    // Routing to the about page
    server.get('/about', (req, res) => {
      const actualPage = '/about'

      app.render(req, res, actualPage)
    })

    // Routing to the labs page
    server.get('/labs', (req, res) => {
      const actualPage = '/labs'

      const queryParams_labs = req.query // Pass on queries      

      app.render(req, res, actualPage, queryParams_labs)
    })  

    // Routing to the TP Elections page
    server.get('/elections', (req, res) => {
      const actualPage = '/elections'

      const queryParams_elections = req.query // Pass on queries

      app.render(req, res, actualPage, queryParams_elections)
    })

    // Backward compatibility routing for January 2019 reports
    server.get('/January2019', (req, res) => {
      const actualPage = '/index'

      const queryParams_reports = req.query // Pass on queries
      queryParams_reports.month = "Jan19"

      app.render(req, res, actualPage, queryParams_reports)
    })

    // Routing for reports for /r
//    server.get('/database/sync', (req, res) => {
//      var refreshCache = true   // Request cache refresh
//      Promise.resolve(labsSyncingFunctions.KpiValues()).then(function (results) {
//        //console.log(results)
//        res.status(200).send(results);
//      }).catch((error) => {                                                           // Run this if the retrieving functions returns an error
//        res.status(200).send(serialize(error))
//      })
//    })

    // Routing for reports for /r
    server.get('/database/test2', (req, res) => {
      var refreshCache = true   // Request cache refresh
      Promise.resolve(labsSyncingFunctions.KpiTest()).then(function (results) {
        //console.log(results)
        res.status(200).send(results);
      }).catch((error) => {                                                           // Run this if the retrieving functions returns an error
        res.status(200).send(serialize(error))
      })
    })

    // Backward compatibility routing for February 2019 reports
    server.get('/month/:month', (req, res) => {
      const actualPage = '/index'

      const queryParams_reports = req.query // Pass on queries
      queryParams_reports.month = req.params.month

      app.render(req, res, actualPage, queryParams_reports)
    })

    // Routing to main page
    server.get('*', (req, res) => {
      const actualPage = '/index'

      const queryParams = '' // Pass on queries

      app.render(req, res, actualPage, queryParams)
    })

    server.listen(port, (err) => {
      if (err) throw err
    })
  }).catch((ex) => {
    //console.error(ex.stack)
    process.exit(1)
  })