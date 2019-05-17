// All server code uses ES5 because of Airtable plugin
require('dotenv').config()
const Airtable = require('airtable')
Airtable.configure({ apiKey: process.env.APIKEY });

// Airtable Query for Proposal Information Table
const WalletDownloadPosts = function getWalletDownloadPosts(tableId) {
    const base = new Airtable.base('apprp0FchTP02vzul') // Connect to Base

    return new Promise((resolve, reject) => {
        // Read cache for this function
        const storeAirtablePosts = []       // Create const to store results in

        // Query to feed to Airtable
        const apiQuery = {
            pageSize: 100,
            sort: [
                { field: 'Wallet', direction: 'asc' },
                { field: 'Date', direction: 'asc' }
            ],
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

// Airtable Query for Proposal Information Table
const WalletVersionPosts = function getWalletVersionPosts(tableId) {
    const base = new Airtable.base('apprp0FchTP02vzul') // Connect to Base

    return new Promise((resolve, reject) => {
        // Read cache for this function
        const storeAirtablePosts = []       // Create const to store results in

        // Query to feed to Airtable
        const apiQuery = {
            pageSize: 100,
            sort: [{ field: 'Release Date', direction: 'desc' }]
        }

        // Get the data from the table
        base(tableId).select(apiQuery).eachPage((records, fetchNextPage) => {
            // This function (`page`) will get called for each page of records.

            // Create a const with the required fields
            records.forEach(function (record) {
                const post = {                  
                    wallet_name: record.get('Wallet'),  //This is the ending of the Dash Central url, it is used as an proposal identifier
                    release_date: record.get('Release Date'),
                    last_updated: record.get('Last Updated'),
                    successor_release: record.get('Successor Date'),
                    wallet_version: record.get('Wallet Version'),
                    total: record.get('Total'),
                    desktop: record.get('Desktop'),
                    mobile: record.get('Mobile'),
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

// Airtable Query for all projects in the Labs Proposal Section
const LabsKpiProjects = function getLabsKpiProjects(tableId) {
    const base = new Airtable.base('apprp0FchTP02vzul') // Connect to Base

    return new Promise((resolve, reject) => {
        // Read cache for this function
        const storeAirtablePosts = []       // Create const to store results in

        // Query to feed to Airtable
        const apiQuery = {
            pageSize: 100,
            sort: [{ field: 'Project Name', direction: 'asc' }]
        }

        // Get the data from the table
        base(tableId).select(apiQuery).eachPage((records, fetchNextPage) => {
            // This function (`page`) will get called for each page of records.

            // Create a const with the required fields
            records.forEach(function (record) {
                const post = {
                    project_name: record.get('Project Name'),
                    proposal_owner: record.get('Proposal Owner'),  //This is the ending of the Dash Central url, it is used as an proposal identifier
                    last_updated: record.get('Last Updated'),
                    kpi_entries_ids: record.get('KPI - Entries'),
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

// Airtable Query for all KPI types for the projects in the Labs Proposal Section
const LabsKpiEntries = function getLabsKpiEntries(tableId) {
    const base = new Airtable.base('apprp0FchTP02vzul') // Connect to Base

    return new Promise((resolve, reject) => {
        // Read cache for this function
        const storeAirtablePosts = []       // Create const to store results in

        // Query to feed to Airtable
        const apiQuery = {
            pageSize: 100,
            sort: [{ field: 'KPI Name', direction: 'asc' }]
        }

        // Get the data from the table
        base(tableId).select(apiQuery).eachPage((records, fetchNextPage) => {
            // This function (`page`) will get called for each page of records.

            // Create a const with the required fields
            records.forEach(function (record) {
                const post = {
                    kpi_name: record.get('KPI Name'),
                    kpi_description: record.get('KPI Description'),  //This is the ending of the Dash Central url, it is used as an proposal identifier
                    axis_title: record.get('Axis Title'),
                    kpi_value_ids: record.get('KPI - Values'),
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

// Airtable Query for all the values of the KPIs for the projects in the Labs Proposal Section
const LabsKpiValues = function getLabsKpiValues(tableId) {
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
                    value: record.get('Value'),  //This is the ending of the Dash Central url, it is used as an proposal identifier
                    unit: record.get('Unit'),
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
    WalletVersionPosts,
    PosMetricsPosts,
    LabsKpiProjects,
    LabsKpiEntries,
    LabsKpiValues,
}
