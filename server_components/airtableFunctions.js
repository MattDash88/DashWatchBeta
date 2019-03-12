// All server code uses ES5 because of Airtable plugin
require('dotenv').config()
const Airtable = require('airtable')
const cache = require('../cache')
Airtable.configure({ apiKey: process.env.APIKEY });

var cacheExpirationTime = process.env.CACHEEXPIRATION;  //Time until cache expires, can be shortened for testing purposes

// Airtable Query for Proposal Information Table
const MainProposalPosts = function getMainProposalPosts(tableId) {
    const base = new Airtable.base('appaaPlruu0gGKXE7') // Connect to Base

    return new Promise((resolve, reject) => {
        // Read cache for this function
        cache.get('mainProposalCache', function (error, data) {
            if (error) {
                reject({ error })
            }
            if (!!data) {       // If value was already retrieved recently, grab from cache
                resolve(JSON.parse(data))
            }
            else {              // If cache is empty, retrieve from Airtable
                const storeAirtablePosts = []       // Create const to store results in

                // Query to feed to Airtable
                const apiQuery = {
                    pageSize: 100,
                    sort: [{ field: 'Date of First Payment', direction: 'desc' }]
                }

                // Get the data from the table
                base(tableId).select(apiQuery).eachPage((records, fetchNextPage) => {
                    // This function (`page`) will get called for each page of records.

                    // Create a const with the required fields
                    records.forEach(function (record) {
                        const post = {
                            title: record.get('Proposal Name'),
                            slug: record.get('Proposal ID'),  //This is the ending of the Dash Central url, it is used as an proposal identifier
                            last_updated: record.get('Date Updated'),
                            status: record.get('Status'),
                            payment_date: record.get('Date of First Payment'),
                            proposal_owner: record.get('Proposal Owner Name'),
                            comm_status: record.get('Communication Status'),
                            budget_status: record.get('Budget Status'),
                            schedule_status: record.get('Schedule Status'),
                            estimated_completion_date: record.get('Estimated Completion Date'),
                            actual_completion_date: record.get('Actual Completion'),
                            proposal_description: record.get('Proposal Description'),
                            payments_received: record.get('Number of Payments Received'),
                            funding_per_payment: record.get('Funding per Payment'),
                            funding_received_dash: record.get('Funding Received (Dash)'),
                            funding_received_usd: record.get('Funding Received (USD)'),
                            escrow_agent: record.get('Ecrow Agent'),
                            id: record.id,                    // Used as unique record identifier
                        }

                        // Handling for proposals that received zero payments, because Airtable gives an object as output
                        if (post.payments_received == 0) {
                            post.funding_per_payment='N/A'
                        }

                        // Push retrieved data to const
                        storeAirtablePosts.push(post)
                    })

                    // Continue to next record
                    fetchNextPage()
                }, function done(error) {
                    if (error) reject({ error })

                    // Store results in Redis, cache expire time defined globally
                    cache.setex('mainProposalCache', cacheExpirationTime, JSON.stringify(storeAirtablePosts))

                    // Finish
                    resolve(storeAirtablePosts)
                })
            }
        })
    })
}

// Code that retrieves The Month Report Overview Records
const MonthReportPosts = function getMonthReportPosts(tableId) {
    const base = new Airtable.base('appaaPlruu0gGKXE7')  // Connect to Base
    return new Promise((resolve, reject) => {
        cache.get('monthReportsCache', function (error, data) {
            if (error) {
                reject({ error })
            }
            if (!!data) {       // If value was already retrieved recently, grab from cache
                resolve(JSON.parse(data))
            }
            else {              // If cache is empty, retrieve from Airtable
                const storeAirtablePosts = []       // Create const to store results in

                // Query to feed to Airtable
                const apiQuery = {
                    pageSize: 50,
                    sort: [{ field: 'Voting Status', direction: 'asc' },
                    { field: 'Proposal Name', direction: 'asc' }

                    ]
                }

                // Get the data from the table
                base(tableId).select(apiQuery).eachPage((records, fetchNextPage) => {
                    // This function (`page`) will get called for each page of records.

                    // Create a const with the desired fields
                    records.forEach(function (record) {
                        const post = {
                            project_name: record.get('Project Name'),
                            proposal_type: record.get('Proposal Type'),
                            proposal_ref: record.get('Proposal ID'),
                            voting_status: record.get('Voting Status'),
                            voting_dc_link: record.get('Voting DC Link'),
                            response_status: record.get('Response Status'),
                            report_status: record.get('Report Status'),             // This variable is used to handle pending reports 
                            published_month: record.get('Published Month'),  // Variable used to determine in which list it should be published
                            report_link: record.get('Report URL'),
                            report_type: record.get('Report Type'),          // Written report or Video
                            report_ref: record.get('Report ID'),
                            id: record.id,                                   // Used as unique record identifier
                            
                            // Elements for Modal
                            proposal_name: record.get('Proposal Title'),
                            proposal_owner: record.get('Proposal Owner'),
                            slug: record.get('Proposal ID Text'),
                            proposal_description: record.get('Proposal Description'),
                            payment_date: record.get('Date of First Payment'),
                            last_updated: record.get('Date Updated'),
                            status: record.get('Proposal Status'),
                            budget_status: record.get('Budget Status'),
                            schedule_status: record.get('Schedule Status'),
                            estimated_completion_date: record.get('Estimated Completion Date'),
                            actual_completion_date: record.get('Actual Completion'),
                            comm_status: record.get('Communication Status'),
                            funding_received_usd: record.get('Funding Received (USD)'),
                        }

                        storeAirtablePosts.push(post)   // Push data to const
                    })

                    fetchNextPage()  // Continue to next record
                }, function done(error) {
                    if (error) reject({ error })

                    // Store results in Redis, cache expire time is defined in .env
                    cache.setex('monthReportsCache', cacheExpirationTime, JSON.stringify(storeAirtablePosts))

                    // Finish
                    resolve(storeAirtablePosts)
                })
            }
        })
    })
}

// Airtable Query for Proposal Owners Table Data, currently unused
const ProposalOwnerPosts = function getProposalOwnerPosts(tableId) {
    const base = new Airtable.base('appaaPlruu0gGKXE7')     // Connect to Base

    return new Promise((resolve, reject) => {
        // Open cache for this function
        cache.get('proposalOwnerCache', function (error, data) {
            if (error) {
                reject({ error })
            }
            if (!!data) {       // If value was already retrieved recently, grab from cache
                resolve(JSON.parse(data))
            }
            else {              // If cache is empty, retrieve from Airtable
                        const storeAirtablePosts = []       // Create const to store results in

                // Query to feed to Airtable
                const apiQuery = {
                    pageSize: 50,
                }

                // Get the data from the table
                base(tableId).select(apiQuery).eachPage((records, fetchNextPage) => {
                    // This function (`page`) will get called for each page of records.

                    // Create a const with the desired fields
                    records.forEach(function (record) {
                        const post = {
                            proposal_owner: record.get('Proposal Owner Name'),
                            proposal_refs: record.get('Proposals'),
                            id: record.id,      // Used as unique record identifier
                        }

                        storeAirtablePosts.push(post)       // Push data to const
                    })

                    fetchNextPage()     // Continue to next record
                }, function done(error) {
                    if (error) reject({ error })

                    // Store results in Redis, cache expire time is defined in .env
                    cache.setex('proposalOwnerCache', cacheExpirationTime, JSON.stringify(storeAirtablePosts))

                    // Finish
                    resolve(storeAirtablePosts)
                })
            }
        })
    })
}

// Airtable Query for Funding and Expenses Table Data
const FinanceDataPosts = function getFinanceDataPosts(tableId) {
    const base = new Airtable.base('appaaPlruu0gGKXE7') // Connect to Base

    return new Promise((resolve, reject) => {
        // Read cache for this function
        cache.get('financeDataCache', function (error, data) {
            if (error) {
                reject({ error })
            }
            if (!!data) {       // If value was already retrieved recently, grab from cache
                resolve(JSON.parse(data))
            }
            else {              // If cache is empty, retrieve from Airtable
                const storeAirtablePosts = []       // Create const to store results in

                // Query to feed to Airtable
                const apiQuery = {
                    pageSize: 50,
                    sort: [{ field: 'Report Date', direction: 'desc' }]
                }

                // Get the data from the table
                base(tableId).select(apiQuery).eachPage((records, fetchNextPage) => {
                    // This function (`page`) will get called for each page of records.

                    // Create a const with the desired fields
                    records.forEach(function (record) {
                        const post = {
                            report_date: record.get('Report Date'),
                            date_range: record.get('Date Range'),
                            expenses_note: record.get('Expenses note'),
                            dash_from_treasury: record.get('Dash From Treasury This Month'),
                            dash_converted: record.get('Dash Converted'),
                            conversion_rate: record.get('Conversion Rate'),
                            rollover_last_month: record.get('Rollover from Last Month'),
                            unaccounted_last_month: record.get('Unaccounted for Last Month'),
                            available_funding: record.get('Available funding'),
                            reported_expenses: record.get('Reported Expenses'),
                            rollover_next_month: record.get('Rollover to Next Month'),
                            unaccounted_this_month: record.get('Unaccounted for this month'),
                            report_ref: record.get('Report link'),      // Unused for now
                            proposal_ref: record.get('Proposal Link'),  // Used to determine which proposal this record is for
                            id: record.id                    // Used as unique record identifier
                        }

                        storeAirtablePosts.push(post)   // Push data to const
                    })

                    fetchNextPage()  // Continue to next record
                }, function done(error) {
                    if (error) reject({ error })

                    // Store results in Redis, cache expire time is defined in .env
                    cache.setex('financeDataCache', cacheExpirationTime, JSON.stringify(storeAirtablePosts))

                    // Finish
                    resolve(storeAirtablePosts)
                })
            }
        })
    })
}

// Airtable Query for Merchant KPIs Table
const MerchantKpiPosts = function getMerchantKpiPosts(tableId) {
    const base = new Airtable.base('appaaPlruu0gGKXE7')     // Connect to Base

    return new Promise((resolve, reject) => {
        cache.get('merchantKpiCache', function (error, data) {
            if (error) {
                reject({ error })
            }
            if (!!data) {       // If value was already retrieved recently, grab from cache
                resolve(JSON.parse(data))
            }
            else {              // If cache is empty, retrieve from Airtable
                const storeAirtablePosts = []       // Create const to store results in

                // Query to feed to Airtable
                const apiQuery = {
                    pageSize: 50,
                    sort: [{ field: 'Date', direction: 'desc' }]
                }

                // Get the data from the table
                base(tableId).select(apiQuery).eachPage((records, fetchNextPage) => {
                    // This function (`page`) will get called for each page of records.

                    // Create a const with the desired fields
                    records.forEach(function (record) {
                        const post = {
                            date: record.get('Date'),
                            proposal_ref: record.get('Proposal'),       // Used to determine which proposal this record is for
                            report_ref: record.get('Report'),           // Used to determine which report this record is for
                            kpi_note: record.get('KPI Note'),
                            total_integrated_full: record.get('Total Merchants Integrated for Proposal Duration'),
                            integrated_month: record.get('Total Merchants Integrated Newly for This Month'),
                            total_single_full: record.get('Total for Proposal Duration (Single owner)'),
                            single_month: record.get('New for This Month (Single owner)'),
                            total_small_full: record.get('Total for Proposal Duration (Small independent merchant)'),
                            small_month: record.get('New for This Month (Small independent merchant)'),
                            total_medium_full: record.get('Total for Proposal Duration (Medium businesses)'),
                            medium_month: record.get('New for This Month (Medium Businesses)'),
                            total_large_full: record.get('Total for Proposal Duration (Large Businesses)'),
                            large_month: record.get('New for This Month (Large businesses)'),
                            follow_ups: record.get('Merchant Follow-Ups'),
                            id: record.id                          // Used as unique record identifier
                        }

                        storeAirtablePosts.push(post)       // Push data to const
                    })

                    fetchNextPage()     // Continue to next record
                }, function done(error) {
                    if (error) reject({ error })

                    // Store results in Redis, cache expire time is defined in .env
                    cache.setex('merchantKpiCache', cacheExpirationTime, JSON.stringify(storeAirtablePosts))

                    // Finish
                    resolve(storeAirtablePosts)
                })
            }
        })
    })
}

// Airtable Query for Event KPIs Table
const EventKpiPosts = function getEventKpiPosts(tableId) {
    const base = new Airtable.base('appaaPlruu0gGKXE7')     // Connect to Base

    return new Promise((resolve, reject) => {
        cache.get('eventKpiCache', function (error, data) {
            if (error) {
                reject({ error })
            }
            if (!!data) {       // If value was already retrieved recently, grab from cache
                resolve(JSON.parse(data))
            }
            else {              // If cache is empty, retrieve from Airtable
                const storeAirtablePosts = []       // Create const to store results in

                // Query to feed to Airtable
                const apiQuery = {
                    pageSize: 50,
                    sort: [{ field: 'Date', direction: 'desc' }]
                }

                // Get the data from the table
                base(tableId).select(apiQuery).eachPage((records, fetchNextPage) => {
                    // This function (`page`) will get called for each page of records.

                    // Create a const with the desired fields
                    records.forEach(function (record) {
                        const post = {
                            date: record.get('Date'),
                            proposal_ref: record.get('Proposal'),       // Used to determine which proposal this record is for
                            report_ref: record.get('Report'),           // Used to determine which report this record is for
                            kpi_note: record.get('KPI Note'),
                            consumer_meetups: record.get('Consumer Focused Meetups This Month'),
                            merchant_meetups: record.get('Merchant Focused Meetups This Month'),
                            media_meetups: record.get('Media Focused Meetups This Month'),
                            new_wallets: record.get('New Wallets Created This Month'),
                            attendees: record.get('Total Attendees This Month'),
                            new_merchant_leads: record.get('New Merchant Leads Generated This Month'),
                            new_merchant_integrated: record.get('New Merchants Integrated This Month'),
                            media_attention: record.get('Media Attention Generated by Conferences'),
                            number_journalists: record.get('Number of Journalists Directly Engaged Through This Event'),
                            id: record.id                          // Used as unique record identifier
                        }

                        storeAirtablePosts.push(post)       // Push data to const
                    })

                    fetchNextPage()     // Continue to next record
                }, function done(error) {
                    if (error) reject({ error })

                    // Store results in Redis, cache expire time is defined in .env
                    cache.setex('eventKpiCache', cacheExpirationTime, JSON.stringify(storeAirtablePosts))

                    // Finish
                    resolve(storeAirtablePosts)
                })
            }
        })
    })
}

// Airtable query for Social Media KPIs Table
const SocialMediaKpiPosts = function getSocialMediaKpiPosts(tableId) {
    const base = new Airtable.base('appaaPlruu0gGKXE7')     // Connect to Base

    return new Promise((resolve, reject) => {
        cache.get('socialKpiCache', function (error, data) {
            if (error) {
                reject({ error })
            }
            if (!!data) {       // If value was already retrieved recently, grab from cache
                resolve(JSON.parse(data))
            }
            else {              // If cache is empty, retrieve from Airtable
                const storeAirtablePosts = []       // Create const to store results in

                // Query to feed to Airtable
                const apiQuery = {
                    pageSize: 50,
                    sort: [{ field: 'Date', direction: 'desc' }]
                }

                // Get the data from the table
                base(tableId).select(apiQuery).eachPage((records, fetchNextPage) => {
                    // This function (`page`) will get called for each page of records.

                    // Create a const with the desired fields
                    records.forEach(function (record) {
                        const post = {
                            date: record.get('Date'),
                            proposal_ref: record.get('Proposal'),       // Used to determine which proposal this record is for
                            report_ref: record.get('Report'),           // Used to determine which report this record is for
                            kpi_note: record.get('KPI Note'),
                            platform_name: record.get('Platform Name'),
                            total_subscribers: record.get('Total Subscribers'),
                            new_subscribers: record.get('New Subscribers for This Month'),
                            new_comments: record.get('New Comments for This Month'),
                            new_likes: record.get('New Likes for This Month'),
                            id: record.id                          // Used as unique record identifier
                        }

                        storeAirtablePosts.push(post)       // Push data to const
                    })

                    fetchNextPage()     // Continue to next record
                }, function done(error) {
                    if (error) reject({ error })

                    // Store results in Redis, cache expire time is defined in .env
                    cache.setex('socialKpiCache', cacheExpirationTime, JSON.stringify(storeAirtablePosts))

                    // Finish
                    resolve(storeAirtablePosts)
                })
            }
        })
    })
}

// Airtable query for Public Relations KPIs table
const PublicRelationsKpiPosts = function getPublicRelationsKpiPosts(tableId) {
    const base = new Airtable.base('appaaPlruu0gGKXE7')     // Connect to Base

    return new Promise((resolve, reject) => {
        cache.get('publicRelationsKpiCache', function (error, data) {
            if (error) {
                reject({ error })
            }
            if (!!data) {       // If value was already retrieved recently, grab from cache
                resolve(JSON.parse(data))
            }
            else {              // If cache is empty, retrieve from Airtable
                const storeAirtablePosts = []       // Create const to store results in

                // Query to feed to Airtable
                const apiQuery = {
                    pageSize: 50,
                    sort: [{ field: 'Date', direction: 'desc' }]
                }

                // Get the data from the table
                base(tableId).select(apiQuery).eachPage((records, fetchNextPage) => {
                    // This function (`page`) will get called for each page of records.

                    // Create a const with the desired fields
                    records.forEach(function (record) {
                        const post = {
                            date: record.get('Date'),
                            proposal_ref: record.get('Proposal'),           // Used to determine which proposal this record is for
                            report_ref: record.get('Report'),               // Used to determine which report this record is for
                            kpi_note: record.get('KPI Note'),
                            total_published: record.get('Total Dash Interviews/Articles published this month'),
                            traditional_print: record.get('Traditional Print'),
                            web: record.get('Web Published'),
                            television: record.get('Television'),
                            radio: record.get('Radio'),
                            podcast: record.get('Podcast'),
                            dash_force: record.get('Dash Force News'),
                            id: record.id                              // Used as unique record identifier
                        }

                        storeAirtablePosts.push(post)       // Push data to const
                    })

                    fetchNextPage()         // Continue to next record
                }, function done(error) {
                        if (error) reject({ error })

                        // Store results in Redis, cache expire time is defined in .env
                        cache.setex('publicRelationsKpiCache', cacheExpirationTime, JSON.stringify(storeAirtablePosts))

                        // Finish
                        resolve(storeAirtablePosts)
                    })
            }
        })
    })
}

// Airtable query for Reports Table Data 
const ReportPosts = function getReportPosts(tableId) {
    const base = new Airtable.base('appaaPlruu0gGKXE7') // Connect to Base

    return new Promise((resolve, reject) => {
        // Open cache for this function
        cache.get('reportCache', function (error, data) {
            if (error) {
                reject({ error })
            }
            if (!!data) {       // If value was already retrieved recently, grab from cache
                resolve(JSON.parse(data))
            }
            else {              // If cache is empty, retrieve from Airtable
                const storeAirtablePosts = []       // Create const to store results in

                // Query to feed to Airtable
                const apiQuery = {
                    pageSize: 50,
                    sort: [{ field: 'Report Date', direction: 'desc' }]
                }

                // Get the data from the table
                base(tableId).select(apiQuery).eachPage((records, fetchNextPage) => {
                    // This function (`page`) will get called for each page of records.

                    // Create a const with the desired fields
                    records.forEach(function (record) {
                        const post = {
                            report_name: record.get('Report Name'),
                            report_date: record.get('Report Date'),
                            report_link: record.get('Report Link'),
                            report_type: record.get('Report Type'),
                            proposal_ref: record.get('Proposal ID'),    // Used to determine which proposal this record is for
                            id: record.id,                              // Used as unique record identifier
                        }

                        storeAirtablePosts.push(post)       // Push data to const
                    })

                    fetchNextPage()         // Continue to next record
                }, function done(error) {
                    if (error) reject({ error })

                    // Store results in Redis, cache expire time is defined in .env
                    cache.setex('reportCache', cacheExpirationTime, JSON.stringify(storeAirtablePosts))

                    // Finish
                    resolve(storeAirtablePosts)
                })
            }
        })
    })
}

// Unused Airtable function to retrieve a single proposal, kept for future use
const getAirtablePost = (recordId, baseId) => {
    const base = new Airtable.base(baseId)
    const cacheRef = '_cachedAirtableBook_' + recordId

    return new Promise((resolve, reject) => {
        cache.get(cacheRef, function (error, data) {
            if (error) throw error

            if (!!data) {
                // Stored value, grab from cache
                resolve(JSON.parse(data))
            }
            else {
                base('Proposals').find(recordId, function (err, record) {
                    if (err) {
                        console.error(err)
                        reject({ err })
                    }

                    const airtablePost = {
                        title: record.get('Proposal Name'),
                        status: record.get('Status'),
                        payment_date: record.get('Date of First Payment'),
                        proposal_owner_ref: record.get('Proposal Owner'),
                        comm_status: record.get('Communication Status'),
                        budget_status: record.get('Budget Status'),
                        schedule_status: record.get('Schedule Status'),
                        slug: record.get('Proposal ID'),
                        id: record.id,
                    }

                    // Store results in Redis, expires in 30 sec
                    cache.setex(cacheRef, cacheExpirationTime, JSON.stringify(airtablePost));

                    resolve(airtablePost)
                })
            }
        })
    })
}

// Airtable Query to create the Trust protector candidate table
const TrustProtectorList = function getTrustProtectors(tableId) {
    const base = new Airtable.base('appXzI83ECDm5ggmA')     // Connect to Base

    return new Promise((resolve, reject) => {
        cache.get('trustProtectorCache', function (error, data) {
            if (error) {
                reject({ error })
            }
            if (!!data) {       // If value was already retrieved recently, grab from cache
                resolve(JSON.parse(data))
            }
            else {              // If cache is empty, retrieve from Airtable
                const storeAirtablePosts = []       // Create const to store results in

                // Query to feed to Airtable
                const apiQuery = {
                    pageSize: 50,
                    sort: [{ field: 'Candidate Name', direction: 'asc' }]
                }

                // Get the data from the table
                base(tableId).select(apiQuery).eachPage((records, fetchNextPage) => {
                    // This function (`page`) will get called for each page of records.

                    // Create a const with the desired fields
                    records.forEach(function (record) {
                        const post = {
                            candidate_name: record.get('Candidate Name'),   
                            alias: record.get('Alias'),                                 // Username within the Dash community
                            contact: record.get('Contact'),                             // Way to contact the candidate
                            dash_involvement: record.get('Dash Involvement'),           // What the protector has done in the community
                            dash_involvement_link: record.get('Dash Involvement Link'), // Used to attach a link to the candidate's Dash activity, if available
                            interview_link: record.get('Interview Link'),               // Interview document taken by Dash Watch
                            id: record.id                                               // Used as unique record identifier
                        }

                        storeAirtablePosts.push(post)       // Push data to const
                    })

                    fetchNextPage()     // Continue to next record
                }, function done(error) {
                    if (error) reject({ error })

                    // Store results in Redis, cache expire time is defined in .env
                    cache.setex('trustProtectorCache', cacheExpirationTime, JSON.stringify(storeAirtablePosts))

                    // Finish
                    resolve(storeAirtablePosts)
                })
            }
        })
    })
}

// Export the Airtable functions to be imported in server.js
module.exports = {
    MainProposalPosts,
    MonthReportPosts,
    ProposalOwnerPosts,
    FinanceDataPosts,
    MerchantKpiPosts,
    EventKpiPosts,
    SocialMediaKpiPosts,
    PublicRelationsKpiPosts,
    ReportPosts,
    TrustProtectorList,
}