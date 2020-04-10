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

function lookupCallback(table, column, value, callBack) {
    pool.query(`SELECT * 
    FROM ${table} 
    WHERE ${column} = '${value}';`,
        function (err, results) {
            if (err) return callBack(new Error(err));
            if (results.rows.length == 1) return callBack(null, 'exists')
            else if (results.rows.length == 0) return callBack(null, 'new')
            else if (results.rows.length >= 2) {
                callBack(new Error(`Found multiple entries with ${value} looking for ${column} in ${table}`))
                return;
            } else {
                callBack(new Error('Something went wrong'))
                return;
            }
        })
}

function returnUUIDCallback(table, returnColumn, matchColumn, matchValue, callBack) {
    pool.query(`SELECT ${returnColumn} 
    FROM ${table} 
    WHERE ${matchColumn} = '${matchValue}';`,
        function (err, results) {
            if (err) return callBack(new Error(err));
            if (results.rows.length == 1) return callBack(null, results.rows[0])
            else if (results.rows.length == 0) {
                callBack(new Error(`No entry was found for item with '${matchColumn}' value '${matchValue}' in ${table}`))
                return;
            } else if (results.rows.length >= 1) {
                callBack(new Error(`Multiple entries were found for item with '${matchColumn}' value '${matchValue}' in ${table}`))
                return;
            }
        })
}

// Airtable Query for all projects in the Labs Proposal Section
const KpiProjects = function getLabsKpiProjects() {
    const base = new Airtable.base('apprp0FchTP02vzul') // Connect to Base

    return new Promise((resolve, reject) => {
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

//  **********************
// Database Retrieval functions for Report List
//  **********************

// Airtable Query for all projects in the Labs Proposal Section
const syncMonthList = function getMonthList() {
    const base = new Airtable.base('appaaPlruu0gGKXE7') // Connect to Base

    return new Promise((resolve, reject) => {
        // Read cache for this function
        const storeAirtablePosts = []       // Create const to store results in

        // Query to feed to Airtable
        const apiQuery = {
            pageSize: 100,
            sort: [{ field: 'Published Month', direction: 'asc' }],
        }

        // Get the data from the table
        base('Month List Reports').select(apiQuery).eachPage((records, fetchNextPage) => {
            // This function (`page`) will get called for each page of records.

            // Create a const with the required fields
            records.forEach(function (record) {
                const post = {
                    project_name: record.get('Project Name'),
                    month: record.get('Published Month').toUpperCase(),
                    //                    proposal_hash: record.get('KPI Name'),
                    //                    first_proposal_hash: record.get('KPI Name'),
                    proposal_type: record.get('Proposal Type'),
                    report_id: null,                // Set report ID null by default
                    report_airtable_id: record.get('Report ID'),
                    release_status: record.get('Report Status') == 'Published',
                    response_status: record.get('Response Status') == 'Yes',
                    voting_status: record.get('Voting Status')[0],
                    voting_link: record.get('Voting DC Link'),
                    airtable_id: record.id,
                }

                // Temp Hotfix for table
                if (typeof post.project_name !== 'undefined' && typeof post.month !== 'undefined') {
                    if (typeof post.report_airtable_id !== 'undefined') {
                        returnUUIDCallback('report_list.reports', 'unique_id', 'airtable_id', post.report_airtable_id, function (error, results) {
                            if (error) reject(error)
                            else {
                                post.report_id = results.unique_id
                            }
                        })
                    }
                    // Checks if entry exists, then to update or create a new entry
                    lookupCallback('report_list.release_list', 'airtable_id', post.airtable_id, function (error, results) {
                        if (error) reject(error)
                        if (results == 'new') {
                            pool.query(`
                                INSERT INTO report_list.release_list(
                                    project_name, 
                                    month,
                                    proposal_type,
                                    report_id,
                                    release_status,
                                    response_status,
                                    voting_status,
                                    voting_link,
                                    airtable_id
                                ) 
                                VALUES (
                                    '${post.project_name}', 
                                    '${post.month}',
                                    '${post.proposal_type}',
                                    '${post.report_id}',
                                    '${post.release_status}',
                                    '${post.response_status}',
                                    '${post.voting_status}',
                                    '${post.voting_link}',
                                    '${post.airtable_id}');`,
                                function (err, result) {
                                    if (err) reject(err);
                                }
                            )
                        } else if (results == 'exists') {
                            pool.query(`
                        UPDATE report_list.release_list
                            SET 
                                project_name='${post.project_name}', 
                                month='${post.month}', 
                                proposal_type='${post.proposal_type}', 
                                release_status='${post.release_status}', 
                                response_status='${post.response_status}', 
                                report_id='${post.report_id}',
                                voting_status='${post.voting_status}', 
                                voting_link='${post.voting_link}'
                            WHERE airtable_id='${post.airtable_id}';`,
                                function (err, result) {
                                    console.log(result)
                                    if (err) reject(err);
                                }
                            )
                        }
                    })
                }
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
const syncReportBase = function getReportBase() {
    const base = new Airtable.base('appaaPlruu0gGKXE7') // Connect to Base

    return new Promise((resolve, reject) => {
        // Query to feed to Airtable
        const apiQuery = {
            pageSize: 100,
            sort: [{ field: 'Report Date', direction: 'asc' }, { field: 'Report Name', direction: 'asc' }],
        }

        // Get the data from the table
        base('Reports').select(apiQuery).eachPage((records, fetchNextPage) => {
            // This function (`page`) will get called for each page of records.

            // Create a const with the required fields
            records.forEach(function (record) {
                // Make an object of the Airtable record
                const post = {
                    release_date: record.get('Report Date'),    // Date the report was released
                    entry_type: record.get('Entry Type'),       // Type of report
                    entry_name: record.get('Entry Name'),
                    //                    proposal_hash: record.get('KPI Name'),
                    //                    first_proposal_hash: record.get('KPI Name'),
                    report_link: record.get('Report Link'),
                    //                    report_id: record.get('KPI Name'),
                    airtable_id: record.id,                     // Unique ID of Airtable record
                }
                if (typeof post.report_link !== 'undefined' && typeof post.release_date !== 'undefined') {      // Don't do anything with the record if release date or report link is missing
                    lookupCallback('report_list.reports', 'airtable_id', post.airtable_id, function (error, results) {
                        if (error) reject('something went wrong')
                        else if (results.rows.length == 0) {
                            // Airtable id not found, adding new entry
                            pool.query(`
                            INSERT INTO report_list.reports(
                                release_date, 
                                entry_type, 
                                entry_name, 
                                report_link, 
                                airtable_id
                            ) 
                            VALUES ('
                                ${post.release_date}', 
                                '${post.entry_type}', 
                                '${post.entry_name}', 
                                '${post.report_link}', 
                                '${post.airtable_id}
                            ');`,
                                function (err, result) {
                                    if (err) console.log(err);
                                }
                            )
                        } else {
                            // Airtable id is found, update the entry
                            pool.query(`
                                UPDATE report_list.reports
                                SET release_date='${post.release_date}',
                                    entry_type='${post.entry_type}',
                                    entry_name='${post.entry_name}', 
                                    report_link='${post.report_link}' 
                                WHERE airtable_id='${post.airtable_id}';`,
                                function (err, result) {
                                    if (err) console.log(err);
                                }
                            )
                        }
                    })
                }
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
const KpiTest = function getUpdateMonthList() {
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
            resolve('done')
        })
    })
}

module.exports = {
     syncMonthList,
    // syncReportBase,
    
    //    KpiProjects,
    //    KpiEntries,
    //    KpiValues,
    //    KpiTest,
}