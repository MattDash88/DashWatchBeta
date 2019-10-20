// All server code uses ES5 because of Airtable plugin
require('dotenv').config()
const Airtable = require('airtable')
Airtable.configure({ apiKey: process.env.APIKEY });

// Airtable Query for Proposal Information Table
const MainProposalPosts = function getMainProposalPosts(tableId) {
    const base = new Airtable.base('appaaPlruu0gGKXE7') // Connect to Base

    return new Promise((resolve, reject) => {
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
                    // Main Tab Elements
                    title: record.get('Proposal Name'),                    
                    last_updated: record.get('Date Updated'),
                    status: record.get('Status'),
                    first_payment_date: record.get('Date of First Payment'),
                    proposal_owner: record.get('Proposal Owner Name'),
                    comm_status: record.get('Communication Status'),
                    reporting_status: record.get('Reporting Status'),
                    budget_status: record.get('Budget Status'),
                    schedule_status: record.get('Schedule Status'),
                    estimated_completion_date: record.get('Estimated Completion Date'),
                    actual_completion_date: record.get('Actual Completion'),
                    slug: record.get('Proposal ID'),                // This is the ending of the Dash Central url, it is used as an proposal identifier
                    dc_url: record.get('Dashcentral URL'),          // Url to the proposal on Dashcentral
                    nexus_id: record.get('Nexus ID'),               // ID of the proposal on Dash Nexus           
                    nexus_url: record.get('Nexus URL'),             // Url to the proposal on Dash Nexus   
                    proposal_description: record.get('Proposal Description'),
                    id: record.id,                      // Used as unique record identifier

                    // Financial Tab elements
                    payments_requested: record.get('Payments Requested'),
                    payments_received: record.get('Number of Payments Received'),
                    funding_per_payment: record.get('Funding per Payment'),
                    funding_received_dash: record.get('Funding Received (Dash)'),
                    funding_received_usd: record.get('Funding Received (USD)'),
                    payment_address: record.get('Payment Address'),
                    escrow_agent: record.get('Escrow Agent'),                                    
                }

                // Handling for proposals that received zero payments, because Airtable gives an object as output
                if (post.payments_received == 0) {
                    post.funding_per_payment = 'N/A'
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

// Code that retrieves The Month Report Overview Records
const MonthReportPosts = function getMonthReportPosts(tableId) {
    const base = new Airtable.base('appaaPlruu0gGKXE7')  // Connect to Base
    return new Promise((resolve, reject) => {
        const storeAirtablePosts = []       // Create const to store results in

        // Query to feed to Airtable
        const apiQuery = {
            pageSize: 50,
            sort: [
                { field: 'Published Month', direction: 'desc' },
                { field: 'Voting Status', direction: 'asc' },
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
                    report_status: record.get('Report Status'),         // This variable is used to handle pending reports 
                    published_month: record.get('Published Month'),     // Variable used to determine in which list it should be published
                    report_link: record.get('Report URL'),
                    kpi_link: record.get('KPI Link'),
                    entry_type: record.get('Entry Type'),               // Written report or Video
                    report_ref: record.get('Report ID'),
                    id: record.id,                                      // Used as unique record identifier

                    // Elements for Modal
                    proposal_name: record.get('Proposal Title'),
                    proposal_owner: record.get('Proposal Owner'),                    
                    proposal_description: record.get('Proposal Description'),
                    payment_date: record.get('Date of First Payment'),
                    last_updated: record.get('Date Updated'),
                    status: record.get('Proposal Status'),
                    budget_status: record.get('Budget Status'),
                    schedule_status: record.get('Schedule Status'),
                    estimated_completion_date: record.get('Estimated Completion Date'),
                    actual_completion_date: record.get('Actual Completion'),
                    comm_status: record.get('Communication Status'),
                    reporting_status: record.get('Reporting Status'),
                    slug: record.get('Proposal ID Text'),
                    dc_url: record.get('Dashcentral URL'),          // Url to the proposal on Dashcentral        
                    nexus_url: record.get('Nexus URL'),             // Url to the proposal on Dash Nexus  
                    funding_received_usd: record.get('Funding Received (USD)'),
                }
                storeAirtablePosts.push(post)   // Push data to const
            })

            fetchNextPage()  // Continue to next record
        }, function done(error) {
            if (error) reject({ error })

            // Finish
            resolve(storeAirtablePosts)
        })
    })
}

// Airtable Query for Proposal Owners Table Data, currently unused
const ProposalOwnerPosts = function getProposalOwnerPosts(tableId) {
    const base = new Airtable.base('appaaPlruu0gGKXE7')     // Connect to Base

    return new Promise((resolve, reject) => {
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
            // Finish
            resolve(storeAirtablePosts)
        })
    })
}

// Airtable Query for Funding and Expenses Table Data
const FinanceDataPosts = function getFinanceDataPosts(tableId) {
    const base = new Airtable.base('appaaPlruu0gGKXE7') // Connect to Base

    return new Promise((resolve, reject) => {
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
            // Finish
            resolve(storeAirtablePosts)
        })

    })
}

// Airtable Query for Merchant KPIs Table
const MerchantKpiPosts = function getMerchantKpiPosts(tableId) {
    const base = new Airtable.base('appaaPlruu0gGKXE7')     // Connect to Base

    return new Promise((resolve, reject) => {
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
            // Finish
            resolve(storeAirtablePosts)
        })
    })
}

// Airtable Query for Event KPIs Table
const EventKpiPosts = function getEventKpiPosts(tableId) {
    const base = new Airtable.base('appaaPlruu0gGKXE7')     // Connect to Base

    return new Promise((resolve, reject) => {
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
            // Finish
            resolve(storeAirtablePosts)
        })
    })
}

// Airtable query for Social Media KPIs Table
const SocialMediaKpiPosts = function getSocialMediaKpiPosts(tableId) {
    const base = new Airtable.base('appaaPlruu0gGKXE7')     // Connect to Base

    return new Promise((resolve, reject) => {
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
            // Finish
            resolve(storeAirtablePosts)
        })

    })
}

// Airtable query for Public Relations KPIs table
const PublicRelationsKpiPosts = function getPublicRelationsKpiPosts(tableId) {
    const base = new Airtable.base('appaaPlruu0gGKXE7')     // Connect to Base

    return new Promise((resolve, reject) => {
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
            // Finish
            resolve(storeAirtablePosts)
        })
    })
}

// Airtable query for Reports Table Data 
const ReportPosts = function getReportPosts(tableId) {
    const base = new Airtable.base('appaaPlruu0gGKXE7') // Connect to Base

    return new Promise((resolve, reject) => {
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
                    entry_type: record.get('Entry Type'),
                    entry_name: record.get('Entry Name'),
                    proposal_ref: record.get('Proposal ID'),    // Used to determine which proposal this record is for
                    id: record.id,                              // Used as unique record identifier
                }

                storeAirtablePosts.push(post)       // Push data to const
            })

            fetchNextPage()         // Continue to next record
        }, function done(error) {
            if (error) reject({ error })
            // Finish
            resolve(storeAirtablePosts)
        })
    })
}

// Code that retrieves The Old Month Report Overview Records
const OldReportPosts = function getOldReportPosts(tableId) {
    const base = new Airtable.base('appaaPlruu0gGKXE7')  // Connect to Base
    return new Promise((resolve, reject) => {
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
                    proposal_description: record.get('Proposal Description'),
                    payment_date: record.get('Date of First Payment'),
                    last_updated: record.get('Date Updated'),
                    status: record.get('Proposal Status'),
                    budget_status: record.get('Budget Status'),
                    schedule_status: record.get('Schedule Status'),
                    estimated_completion_date: record.get('Estimated Completion Date'),
                    actual_completion_date: record.get('Actual Completion'),
                    comm_status: record.get('Communication Status'),
                    reporting_status: record.get('Reporting Status'),
                    slug: record.get('Proposal ID Text'),
                    dc_url: record.get('Dashcentral URL'),          // Url to the proposal on Dashcentral        
                    nexus_url: record.get('Nexus URL'),             // Url to the proposal on Dash Nexus  
                    funding_received_usd: record.get('Funding Received (USD)'),
                }

                storeAirtablePosts.push(post)   // Push data to const
            })

            fetchNextPage()  // Continue to next record
        }, function done(error) {
            if (error) reject({ error })
            // Finish
            resolve(storeAirtablePosts)
        })
    })
}

// Unused Airtable function to retrieve a single proposal, kept for future use
const getAirtablePost = (recordId, baseId) => {
    const base = new Airtable.base(baseId)

    return new Promise((resolve, reject) => {
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
            // Finish
            resolve(airtablePost)
        })
    })
}

// Airtable Query to create the Trust protector candidate table
const ElectionsCandidateList = function getElectionCandidates(tableId) {
    const base = new Airtable.base('appXzI83ECDm5ggmA')     // Connect to Base

    return new Promise((resolve, reject) => {
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
                    interview_link: record.get('Interview Link'),
                    interview_type: record.get('Interview Type'),           // Interview document taken by Dash Watch
                    video_link: record.get('Video Link'),           // Interview document taken by Dash Watch
                    id: record.id,                                          // Used as unique record identifier
                }

                storeAirtablePosts.push(post)       // Push data to const
            })

            fetchNextPage()     // Continue to next record
        }, function done(error) {
            if (error) reject({ error })
            // Finish
            resolve(storeAirtablePosts)
        })
    })
}

// Airtable Query to create the Trust protector candidate table
const VoteData = function getVoteData(tableId) {
    const base = new Airtable.base('appXzI83ECDm5ggmA')     // Connect to Base

    return new Promise((resolve, reject) => {
        const storeAirtablePosts = []       // Create const to store results in

        // Query to feed to Airtable
        const apiQuery = {
            pageSize: 50,
            sort: [{ field: 'Date', direction: 'asc' }]
        }

        // Get the data from the table
        base(tableId).select(apiQuery).eachPage((records, fetchNextPage) => {
            // This function (`page`) will get called for each page of records.

            // Create a const with the desired fields
            records.forEach(function (record) {
                const post = {
                    date: record.get('Date'),
                    vote_participation: record.get('MNO Vote Participation'),       // Percentage of valid MNOs that voted
                    valid_votes: record.get('Valid Votes'),       // Percentage of valid MNOs that voted
                    number_of_masternodes: record.get('Number of MNs'),       // Percentage of valid MNOs that voted
                    id: record.id,                                                  // Used as unique record identifier
                }

                storeAirtablePosts.push(post)       // Push data to const
            })

            fetchNextPage()     // Continue to next record
        }, function done(error) {
            if (error) reject({ error })
            // Finish
            resolve(storeAirtablePosts)
        })

    })
}

// Airtable Query to create the Trust protector candidate table
const VoteResults = function getVoteResults(tableId) {
    const base = new Airtable.base('appXzI83ECDm5ggmA')     // Connect to Base

    return new Promise((resolve, reject) => {
        const storeAirtablePosts = []       // Create const to store results in

        // Query to feed to Airtable
        const apiQuery = {
            pageSize: 50,
            sort: [{ field: 'Votes', direction: 'desc' }]
        }

        // Get the data from the table
        base(tableId).select(apiQuery).eachPage((records, fetchNextPage) => {
            // This function (`page`) will get called for each page of records.

            // Create a const with the desired fields
            records.forEach(function (record) {
                const post = {
                    candidate_name: record.get('Candidate Name'),
                    alias: record.get('Alias'),                                 // Username within the Dash community
                    votes: record.get('Votes'),                             // Way to contact the candidate
                    id: record.id,                                          // Used as unique record identifier
                }

                storeAirtablePosts.push(post)       // Push data to const
            })

            fetchNextPage()     // Continue to next record
        }, function done(error) {
            if (error) reject({ error })
            // Finish
            resolve(storeAirtablePosts)
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
    OldReportPosts,
    ElectionsCandidateList,
    VoteResults,
    VoteData,
}