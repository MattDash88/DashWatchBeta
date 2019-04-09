// All server code uses ES5 because of Airtable plugin
require('dotenv').config()    // Access .env variables
const express = require('express')
const next = require('next')
const cache = require('./cache')
const fetch = require('isomorphic-unfetch');
const qs = require('query-string');

const dev = process.env.NODE_ENV !== 'production'
const port = process.env.PORT
var gaKey = process.env.GAKEY
const app = next({ dev })
const ReactGA = require('react-ga');
ReactGA.initialize(gaKey);

const serialize = data => JSON.stringify({ data })
var cacheExpirationTime = process.env.CACHEEXPIRATION;  //Time until cache expires, can be adjusted for testing purposes

// Get data processing functions from another file
var airtableFunctions = require('./server_components/airtableFunctions');
var labsAirtableFunctions = require('./server_components/labsAirtableFunctions');
var processingFunctions = require('./server_components/dataProcessingFunctions');
var labsProcessingFunctions = require('./server_components/labsProcessingFunctions');
var filterFunctions = require('./server_components/filterFunctions');
var cachingFunctions = require('./server_components/cachingFunctions');

/* Airtable Query for Proposal Information Table */
const getAirtableData = () => {
  return new Promise((resolve, reject) => {
    // Read cache for this function
    cache.get('airtableData', function (error, data) {
      if (error) throw error

      if (!!data) { // If value was already retrieved recently, grab from cache
        // Stored value, grab from cache
        resolve(JSON.parse(data))
      }
      else {    // If cache is empty, retrieve from Airtable
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
      }
    })
  })
}

// Function to get data for the Month list
const getMonthList = () => {
  return new Promise((resolve, reject) => {
    // Read cache for this function
    cache.get('monthListData', function (error, data) {
      if (error) throw error

      if (!!data) {   // If value was already retrieved recently, grab from cache
        resolve(JSON.parse(data))
      }
      else {    // If cache is empty, retrieve from Airtable
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
      }
    })
  })
}

// Function to get data for the Month list
const getOldList = () => {
  return new Promise((resolve, reject) => {
    // Read cache for this function
    cache.get('oldListData', function (error, data) {
      if (error) throw error

      if (!!data) {   // If value was already retrieved recently, grab from cache
        resolve(JSON.parse(data))
      }
      else {    // If cache is empty, retrieve from Airtable
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
      }
    })
  })
}

// Function to prepare data for Peyton's data processing project
const getMerchantKpiData = () => {
  return new Promise((resolve, reject) => {
    // Read cache for this function
    cache.get('peytonsKpiData', function (error, data) {
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
          // Store results in Redis cache, cache expire time is defined in .env
          cache.setex('peytonsKpiData', cacheExpirationTime, JSON.stringify(storeAirtablePosts))
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
const getElectionsData = () => {
  return new Promise((resolve, reject) => {
    // Read cache for this function
    cache.get('ElectionsData', function (error, data) {
      if (error) throw error

      if (!!data) {   // If value was already retrieved recently, grab from cache
        resolve(JSON.parse(data))
      }
      else {    // If cache is empty, retrieve from Airtable       
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
      }
    })
  })
}

// Function to prepare data for the Prepared Datasets for Labs (Wallets and POS systems)
const getLabsPreparedData = () => {
  return new Promise((resolve, reject) => {
    // Read cache for this function
    cache.get('labsPreparedData', function (error, data) {
      if (error) throw error

      if (!!data) {   // If value was already retrieved recently, grab from cache
        resolve(JSON.parse(data))
      }
      else {    // If cache is empty, retrieve from Airtable
        
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
      }
    })
  })
}

// Function to prepare data project data for labs 
const getLabsAllData = () => {
  return new Promise((resolve, reject) => {
    // Read cache for this function
    cache.get('AllLabsData', function (error, data) {
      if (error) throw error

      if (!!data) {   // If value was already retrieved recently, grab from cache
        resolve(JSON.parse(data))
      }
      else {    // If cache is empty, retrieve from Airtable       
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
      }
    })
  })
}

app.prepare()
  .then(() => {
    const server = express()

    // Internal API call to get Airtable data
    server.get('/api/get/posts', (req, res) => {
      Promise.resolve(getAirtableData()).then(function (valArray) {
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
      Promise.resolve(getMonthList()).then(function (valArray) {
        Object.keys(valArray).map((list_item) => {
          if (typeof valArray[list_item].list_data.report_status === 'undefined') {
            // Do nothing, skip entry
          } else if (valArray[list_item].list_data.report_status[0] !== "Opted Out") {
            monthSelection.push(valArray[list_item])
          }
        })
        res.writeHead(200, {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        })
        return res.end(serialize(monthSelection))
      }).catch((error) => {
        console.log(error)
        // Send empty JSON otherwise page load hangs indefinitely
        res.writeHead(200, { 'Content-Type': 'application/json' })
        return res.end(serialize({}))
      });
    })

    // Internal API call for Reports Page Opt-out table
    server.get('/api/get/optoutlist', (req, res) => {
      optOutSelection = []
      Promise.resolve(getMonthList()).then(function (valArray) {
        Object.keys(valArray).map((list_item) => {
          if (typeof valArray[list_item].list_data.report_status === 'undefined') {
            // Do nothing, skip entry
          } else if (valArray[list_item].list_data.report_status[0] == "Opted Out") {
            optOutSelection.push(valArray[list_item])
            }
        })
        res.writeHead(200, {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        })
        return res.end(serialize(optOutSelection))
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
      Promise.resolve(getOldList()).then(function (valArray) {
        Object.keys(valArray).map((list_item) => {
          if (typeof valArray[list_item].list_data.report_status === 'undefined') {
            // Do nothing, skip entry
          } else if (valArray[list_item].list_data.report_status[0] !== "Opted Out") {
            monthSelection.push(valArray[list_item])
          }
        })
        res.writeHead(200, {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        })
        return res.end(serialize(monthSelection))
      }).catch((error) => {
        console.log(error)
        // Send empty JSON otherwise page load hangs indefinitely
        res.writeHead(200, { 'Content-Type': 'application/json' })
        return res.end(serialize({}))
      });
    })

    // Internal API call for Reports Page Opt-out table
    server.get('/api/get/old_optoutlist', (req, res) => {
      optOutSelection = []
      Promise.resolve(getOldList()).then(function (valArray) {
        Object.keys(valArray).map((list_item) => {
          if (typeof valArray[list_item].list_data.report_status === 'undefined') {
            // Do nothing, skip entry
          } else if (valArray[list_item].list_data.report_status[0] == "Opted Out") {
            optOutSelection.push(valArray[list_item])
            }
        })
        res.writeHead(200, {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        })
        return res.end(serialize(optOutSelection))
      }).catch((error) => {
        console.log(error)
        // Send empty JSON otherwise page load hangs indefinitely
        res.writeHead(200, { 'Content-Type': 'application/json' })
        return res.end(serialize({}))
      });
    })

    // Internal API call to support search
    server.get('/api/filter/:query', (req, res) => {
      query = qs.parse(req.params.query)
      Promise.resolve(getAirtableData()).then(function (valArray) {
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
      query = req.params.slug
      Promise.resolve(getAirtableData()).then(function (valArray) {
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
      Promise.resolve(getElectionsData()).then(function (valArray) {
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
      Promise.resolve(getLabsPreparedData()).then(function (valArray) {
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
      Promise.resolve(getLabsAllData()).then(function (valArray) {
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

    // Internal API call to get Airtable data
    server.get('/api/get/cacheRefresh', (req, res) => {
      var airtablePromise = Promise.resolve(cachingFunctions.getAirtableCache());
      var monthListPromise = Promise.resolve(cachingFunctions.getMonthListCache());
      var oldListPromise = Promise.resolve(cachingFunctions.getOldListCache());
      var electionsPromise = Promise.resolve(cachingFunctions.getElectionsCache());
      var labsPreparedPromise = Promise.resolve(cachingFunctions.getLabsPreparedCache());
      var labsAllPromise = Promise.resolve(cachingFunctions.getLabsAllCache());

      Promise.all([airtablePromise, monthListPromise, oldListPromise, electionsPromise, labsPreparedPromise, labsAllPromise]).then(function (valArray) {
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

    // Routing for reports
    server.get('/r/:month/:reportId', (req, res) => {
      const actualPage = `https://dashwatchbeta.org/reports/${req.params.month}/${req.params.reportId}.pdf`

      // Sending (anonymous) pageview request to Analytics
      var x = Math.floor((Math.random() * 100000) + 1);   // Random number to avoid caching
      fetch(`https://www.google-analytics.com/collect?v=1&tid=${gaKey}&cid=4B8302DA-21AD-401F-AF45-1DFD956B80B5&sc=end&t=pageview&dp=%2F/r/${req.params.month}/${req.params.reportId}&z=${x}`,
        {
          method: 'post',
        })

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