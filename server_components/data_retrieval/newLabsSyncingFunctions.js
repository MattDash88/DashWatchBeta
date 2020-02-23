require('dotenv').config();    // Access .env variables
const { Pool, Client } = require('pg');
const pool = new Pool({
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    password: process.env.PG_PW,
    database: process.env.PG_DB,
    port: process.env.PG_PORT,
});
const Airtable = require('airtable')
Airtable.configure({ apiKey: process.env.APIKEY });

// Airtable Query for all projects in the Labs Proposal Section
const KpiProjects = function getLabsKpiProjects() {
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
        base('KPI - Dash Projects').select(apiQuery).eachPage((records, fetchNextPage) => {
            // This function (`page`) will get called for each page of records.

            // Create a const with the required fields
            records.forEach(function (record) {
                const post = {
                    project_name: record.get('Project Name'),
                    proposal_owner: record.get('Proposal Owner'),  //This is the ending of the Dash Central url, it is used as an proposal identifier
                    first_proposal_id: record.get('First Proposal ID'),
                    proposal_hash: record.get('Proposal Hash'),
                    last_updated: record.get('Last Updated'),
                    kpi_entries_ids: record.get('KPI - Entries'),
                    id: record.id,                    // Used as unique record identifier
                }
                // Push retrieved data to const

                pool.query(`INSERT INTO proposals.proposal_table(
                    project_name, proposal_owner, first_proposal_id, first_proposal_hash, last_updated) 
                    VALUES ('${post.project_name}', '${post.proposal_owner}', '${post.first_proposal_id}', '${post.proposal_hash}', '${post.last_updated}');`,
                    function (err, result) {
                        if (err) console.log(err);
                        console.log(result)
                    })
            })

            // Continue to next record
            fetchNextPage()
        }, function done(error) {
            if (error) reject({ error })
            // Finish
            resolve('done')
        })
    })
}

// Airtable Query for all projects in the Labs Proposal Section
const KpiEntries = function getLabsKpiEntries() {
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
        base('KPI - Entries').select(apiQuery).eachPage((records, fetchNextPage) => {
            // This function (`page`) will get called for each page of records.

            // Create a const with the required fields
            records.forEach(function (record) {
                const post = {
                    kpi_name: record.get('KPI Name'),
                    kpi_description: record.get('KPI Description'),  //This is the ending of the Dash Central url, it is used as an proposal identifier
                    axis_title: record.get('Axis Title'),
                    proposal_hash: record.get('Proposal Hash'),
                    project_name: record.get('Project Name'),
                    id: record.id,                    // Used as unique record identifier
                }
                // Push retrieved data to const

                pool.query(`INSERT INTO proposals.list_of_kpis(
                    kpi_name, kpi_description, axis_title, first_proposal_hash, project_name) 
                    VALUES ('${post.kpi_name}', '${post.kpi_description}', '${post.axis_title}', '${post.proposal_hash}', '${post.project_name}');`,
                    function (err, result) {
                        if (err) console.log(err);
                        console.log(result)
                    })
            })

            // Continue to next record
            fetchNextPage()
        }, function done(error) {
            if (error) reject({ error })
            // Finish
            resolve('done')
        })
    })
}

// Airtable Query for all projects in the Labs Proposal Section
const KpiValues = function getLabsKpiEntries() {
    const base = new Airtable.base('apprp0FchTP02vzul') // Connect to Base

    return new Promise((resolve, reject) => {
        // Read cache for this function
        const storeAirtablePosts = []       // Create const to store results in

        // Query to feed to Airtable
        const apiQuery = {
            pageSize: 100,
            sort: [{ field: 'Project Name', direction: 'asc' }],
            filterByFormula: '{Date Added} > "2020-02-21"',
        }

        // Get the data from the table
        base('KPI - Values').select(apiQuery).eachPage((records, fetchNextPage) => {
            // This function (`page`) will get called for each page of records.

            // Create a const with the required fields
            records.forEach(function (record) {
                const post = {
                    kpi_name: record.get('KPI Name'),
                    proposal_hash: record.get('Proposal Hash'),
                    project_name: record.get('Project Name'),
                    date: record.get('Date'),
                    value: record.get('Value'),
                    id: record.id,                    // Used as unique record identifier
                }
                // Push retrieved data to const

                pool.query(`INSERT INTO proposals.kpi_values_table(
                    kpi_name, first_proposal_hash, project_name, date, value) 
                    VALUES ('${post.kpi_name}', '${post.proposal_hash}', '${post.project_name}', '${post.date}', '${post.value}');`,
                    function (err, result) {
                        if (err) console.log(err);
                        console.log(result)
                    })
            })

            // Continue to next record
            fetchNextPage()
        }, function done(error) {
            if (error) reject({ error })
            // Finish
            resolve('done')
        })
    })
}

// Airtable Query for all projects in the Labs Proposal Section
const KpiTest = function getLabsKpiEntries() {
    const base = new Airtable.base('apprp0FchTP02vzul') // Connect to Base

    return new Promise((resolve, reject) => {
        // Read cache for this function
        const storeAirtablePosts = []       // Create const to store results in

        // Query to feed to Airtable
        const apiQuery = {
            pageSize: 100,
            sort: [{ field: 'Project Name', direction: 'asc' }],
            filterByFormula: '{Date Added} > "2020-01-01"',
        }

        // Get the data from the table
        base('KPI - Values').select(apiQuery).eachPage((records, fetchNextPage) => {
            // This function (`page`) will get called for each page of records.

            // Create a const with the required fields
            records.forEach(function (record) {
                const post = {
                    kpi_name: record.get('KPI Name'),
                    proposal_hash: record.get('Proposal Hash'),
                    project_name: record.get('Project Name'),
                    date: record.get('Date'),
                    value: record.get('Value'),
                    date_added: record.get('Date Added'),
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
            console.log(storeAirtablePosts)
            resolve('done')
        })
    })
}

module.exports = {
    //    KpiProjects,
    //    KpiEntries,
    //    KpiValues,
    //    KpiTest,
}