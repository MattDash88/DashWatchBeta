// All server code uses ES5 because of Airtable plugin
require('dotenv').config()
const Airtable = require('airtable')
const cache = require('../cache')
Airtable.configure({ apiKey: process.env.APIKEY });

var cacheExpirationTime = process.env.CACHEEXPIRATION;  //Time until cache expires, can be shortened for testing purposes

// Airtable Query for Proposal Information Table
const WalletDownloadPosts = function getWalletDownloadPosts(tableId) {
    const base = new Airtable.base('apprp0FchTP02vzul') // Connect to Base

    return new Promise((resolve, reject) => {
        // Read cache for this function
        const storeAirtablePosts = []       // Create const to store results in

        // Query to feed to Airtable
        const apiQuery = {
            pageSize: 100,
            sort: [{ field: 'Date', direction: 'asc' }]
        }

        // Get the data from the table
        base(tableId).select(apiQuery).eachPage((records, fetchNextPage) => {
            // This function (`page`) will get called for each page of records.

            // Create a const with the required fields
            records.forEach(function (record) {
                const post = {
                    date: record.get('Date'),
                    wallet_name: record.get('Wallet'),  //This is the ending of the Dash Central url, it is used as an proposal identifier
                    total: record.get('Total'),
                    desktop: record.get('Desktop'),
                    mobile: record.get('Mobile'),
                    id: record.id,                    // Used as unique record identifier
                }

                // Push retrieved data to const
                storeAirtablePosts.push(post)
            })

            // Continue to next record
            fetchNextPage()
        }, function done(error) {
            if (error) reject({ error })

            // Finish
            resolve(storeAirtablePosts)
        })
    })
}

// Airtable Query for Proposal Information Table
const PosMetricsPosts = function getPosMetricsPosts(tableId) {
    const base = new Airtable.base('apprp0FchTP02vzul') // Connect to Base

    return new Promise((resolve, reject) => {
        // Read cache for this function
        const storeAirtablePosts = []       // Create const to store results in

        // Query to feed to Airtable
        const apiQuery = {
            pageSize: 100,
            sort: [{ field: 'Date', direction: 'asc' }]
        }

        // Get the data from the table
        base(tableId).select(apiQuery).eachPage((records, fetchNextPage) => {
            // This function (`page`) will get called for each page of records.

            // Create a const with the required fields
            records.forEach(function (record) {
                const post = {
                    date: record.get('Date'),
                    system_name: record.get('POS System'),  //This is the ending of the Dash Central url, it is used as an proposal identifier
                    dash_transactions: record.get('Dash Transactions'),
                    dash_volume: record.get('Dash Volume'),
                    proposal_owner: record.get('Proposal Owner'),
                    id: record.id,                    // Used as unique record identifier
                }

                // Push retrieved data to const
                storeAirtablePosts.push(post)
            })

            // Continue to next record
            fetchNextPage()
        }, function done(error) {
            if (error) reject({ error })

            // Finish
            resolve(storeAirtablePosts)
        })
    })
}

module.exports = {
    WalletDownloadPosts,
    PosMetricsPosts,
}
