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
var processingFunctions = require('./server_components/dataProcessingFunctions');
var filterFunctions = require('./server_components/filterFunctions');

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
            if (typeof monthReportData[item].id !== 'undefined') {     //Check if record exists
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
    server.get('/reports', (req, res) => {
      const actualPage = '/index'

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

      app.render(req, res, actualPage)
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
      const actualPage = '/'

      const queryParams = req.query // Pass on queries

      app.render(req, res, actualPage, queryParams)
    })

    server.listen(port, (err) => {
      if (err) throw err
    })
  }).catch((ex) => {
    //console.error(ex.stack)
    process.exit(1)
  })