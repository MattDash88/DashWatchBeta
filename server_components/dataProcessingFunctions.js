// All server code uses ES5 because of Airtable plugin

// Processing function for Main proposal data
var processMainData = function mainDataFunction(proposalData) {
    storeMainData = []

    // Format funding received
    proposalData.funding_received_usd = proposalData.funding_received_usd.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});

    // Determine type of completion date, anticipated or actual completion date
    if (typeof proposalData.estimated_completion_date !== 'undefined') {
        proposalData.completion_elem_type = 'Anticipated Completion'
        proposalData.completion_elem = proposalData.estimated_completion_date
    } else if (typeof proposalData.actual_completion_date !== 'undefined') {
        proposalData.completion_elem_type = 'Actual Completion'
        proposalData.completion_elem = proposalData.actual_completion_date
    } else {
        proposalData.completion_elem_type = 'Anticipated Completion'
        proposalData.completion_elem = 'N/A'
    }

    storeMainData = proposalData
    return storeMainData

}

// Processing function for KPI data
var processKpiData = function kpiDataFunction(proposalReportData, merchantKpiData, eventKpiData, socialMediaKpiData, publicRelationsKpiData) {
    storeKpiData = []        // Create Array to store kpi data in

    // Iterate through all report records for this proposal
    Object.keys(proposalReportData).map((report_item) => {
        // Only written reports contain kpi data, exclude videos
            kpiDataArray = []       // Create empty kpiDataArray for each report

            // Iterate through all merchant KPI records
            Object.keys(merchantKpiData).map((kpi_item) => {
                merchantKpiArray = []   // Clear previous data in merchantKpiData

                // Match Kpi data to its report
                if (proposalReportData[report_item].report_ref == merchantKpiData[kpi_item].report_ref) {
                    const merchantKpiArray = {      // Create Array with Merchant KPI data
                        kpi_type: 'merchant_kpis',
                        kpi_note: merchantKpiData[kpi_item].kpi_note,
                        total_integrated_full: merchantKpiData[kpi_item].total_integrated_full,
                        integrated_month: merchantKpiData[kpi_item].integrated_month,
                        total_single_full: merchantKpiData[kpi_item].total_single_full,
                        single_month: merchantKpiData[kpi_item].single_month,
                        total_small_full: merchantKpiData[kpi_item].total_small_full,
                        small_month: merchantKpiData[kpi_item].small_month,
                        total_medium_full: merchantKpiData[kpi_item].total_medium_full,
                        medium_month: merchantKpiData[kpi_item].medium_month,
                        total_large_full: merchantKpiData[kpi_item].total_large_full,
                        large_month: merchantKpiData[kpi_item].large_month,
                        follow_ups: merchantKpiData[kpi_item].follow_ups,
                        kpi_ref: merchantKpiData[kpi_item].id
                    }
                    kpiDataArray.push(merchantKpiArray)     // Push merchant KPI const to report KPI Array
                }
            })  // End of Merchant kpi loop

            // Iteration loop through all event KPI records
            Object.keys(eventKpiData).map((kpi_item) => {
                eventKpiArray = []   // Clear previous data in event Kpi Data

                // Match Kpi data to its report
                if (proposalReportData[report_item].report_ref == eventKpiData[kpi_item].report_ref) {
                    const eventKpiArray = {       // Create Array with Event KPI data
                        kpi_type: 'event_kpis',
                        kpi_note: eventKpiData[kpi_item].kpi_note,
                        consumer_meetups: eventKpiData[kpi_item].consumer_meetups,
                        merchant_meetups: eventKpiData[kpi_item].merchant_meetups,
                        media_meetups: eventKpiData[kpi_item].media_meetups,
                        new_wallets: eventKpiData[kpi_item].new_wallets,
                        attendees: eventKpiData[kpi_item].attendees,
                        new_merchant_leads: eventKpiData[kpi_item].new_merchant_leads,
                        new_merchant_integrated: eventKpiData[kpi_item].new_merchant_integrated,
                        media_attention: eventKpiData[kpi_item].media_attention,
                        number_journalists: eventKpiData[kpi_item].number_journalists,
                        kpi_ref: eventKpiData[kpi_item].id
                    }
                    kpiDataArray.push(eventKpiArray)        // Push event KPI const to report KPI Array
                }
            })    // End of Event kpi loop

            // Iteration loop through all social media KPI records
            Object.keys(socialMediaKpiData).map((kpi_item) => {
                socialMediaKpiArray = []   // Clear previous data in social media Kpi Data

                // Match Kpi data to its report
                if (proposalReportData[report_item].report_ref == socialMediaKpiData[kpi_item].report_ref) {
                    const socialMediaKpiArray = {     // Create Array with Social Media KPI data
                        kpi_type: 'social_media_kpis',
                        kpi_note: socialMediaKpiData[kpi_item].kpi_note,
                        platform_name: socialMediaKpiData[kpi_item].platform_name,
                        total_subscribers: socialMediaKpiData[kpi_item].total_subscribers,
                        new_subscribers: socialMediaKpiData[kpi_item].new_subscribers,
                        new_comments: socialMediaKpiData[kpi_item].new_comments,
                        new_likes: socialMediaKpiData[kpi_item].new_likes,
                        kpi_ref: socialMediaKpiData[kpi_item].id
                    }
                    kpiDataArray.push(socialMediaKpiArray)
                }
            })    // End of Social Media kpi loop

            // Iteration loop through all Public Relations KPI records
            Object.keys(publicRelationsKpiData).map((kpi_item) => {
                publicRelationsKpiArray = []   // Clear previous data in Public Relations Kpi Data

                // Match Kpi data to its report
                if (proposalReportData[report_item].report_ref == publicRelationsKpiData[kpi_item].report_ref) {
                    const publicRelationsKpiArray = {     // Create Array with Public Relations KPI data
                        kpi_type: 'public_relations_kpis',
                        kpi_note: publicRelationsKpiData[kpi_item].kpi_note,
                        total_published: publicRelationsKpiData[kpi_item].total_published,
                        traditional_print: publicRelationsKpiData[kpi_item].traditional_print,
                        web: publicRelationsKpiData[kpi_item].web,
                        television: publicRelationsKpiData[kpi_item].television,
                        radio: publicRelationsKpiData[kpi_item].radio,
                        podcast: publicRelationsKpiData[kpi_item].podcast,
                        dash_force: publicRelationsKpiData[kpi_item].dash_force,
                        kpi_ref: publicRelationsKpiData[kpi_item].id
                    }
                    kpiDataArray.push(publicRelationsKpiArray)
                }
            })    // End of Public Relations kpi loop
        


        // Create Array if no kpi data is found
        if (kpiDataArray.length == 0) {
            kpiDataArray = 'No KPI data found'
        }

        // Construct report KPI const
        const reportKpiData = {
            report_date: proposalReportData[report_item].report_date,       // Date of the report KPI data was in
            report_type: proposalReportData[report_item].report_type,       // Report type, video interviews currently have no kpi data
            report_ref: proposalReportData[report_item].report_ref, 
            kpi_metrics: kpiDataArray,                                      // Const containing all kpi data of the report
        }

        storeKpiData.push(reportKpiData)   // Push report KPI data to proposal Array
    })
    return storeKpiData
}   // End of KPI processing function

// Processing function for Financial Data
var processFinancialData = function financialDataFunction(proposalData, financialData) {
    storeFinancialData = []     // Create Array to store Financial Data in

    // Iteration loop through all Financial Data KPI records
    Object.keys(financialData).map((financial_item) => {
        financeArray = [] 

        // Match Financial Data to the proposal
        if (proposalData.id == financialData[financial_item].proposal_ref) {
          const financeArray = {    // Create Array with Financial Data
            report_date: financialData[financial_item].report_date[0],
            date_range: financialData[financial_item].date_range,
            expenses_note: financialData[financial_item].expenses_note,
            dash_from_treasury: financialData[financial_item].dash_from_treasury,
            dash_converted: financialData[financial_item].dash_converted,
            conversion_rate: financialData[financial_item].conversion_rate,
            rollover_last_month: financialData[financial_item].rollover_last_month,
            unaccounted_last_month: financialData[financial_item].unaccounted_last_month,
            available_funding: financialData[financial_item].available_funding,
            reported_expenses: financialData[financial_item].reported_expenses,
            rollover_next_month: financialData[financial_item].rollover_next_month,
            unaccounted_this_month: financialData[financial_item].unaccounted_this_month,
            financial_ref: financialData[financial_item].id
          }
          storeFinancialData.push(financeArray)
        }
      })    // End of Financial Data loop

      // Create Array if no Financial Data is found
      if (storeFinancialData.length == 0) {
        const financeArray = 'N/A'
        storeFinancialData.push(financeArray)
      }

      return storeFinancialData
}

// Processing function for report data
var processReportData = function reportDataFunction(proposalData, proposalReportData) {
    storeReportData = []        // Create Array to store report data in

    // Iterate through all report records
    Object.keys(proposalReportData).map((item) => {
        if (proposalData.id == proposalReportData[item].proposal_ref) {
            const reportArray = {
                report_name: proposalReportData[item].report_name,
                report_date: proposalReportData[item].report_date,
                report_link: proposalReportData[item].report_link,
                report_type: proposalReportData[item].report_type[0],
                report_ref: proposalReportData[item].id
            }
            storeReportData.push(reportArray)
        }
    })

    // Create Array if no report is found
    if (storeReportData.length == 0) {
        reportArray = {
            report_name: 'None',
            report_date: 'N/A',
            report_link: 'N/A',
            report_ref: 'N/A'
        }
        storeReportData.push(reportArray)
    }
    return storeReportData
}

// Function to return the records for the requested month report list
var processMonthListData = function monthDataFunction(monthReportData) {
    storeReportData = []        // Create Array to store report data in

    // Format funding received
    monthReportData.funding_received_usd = monthReportData.funding_received_usd.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});

    // Determine type of completion date, anticipated or actual completion date
    if (typeof monthReportData.estimated_completion_date !== 'undefined') {
        monthReportData.completion_elem_type = 'Anticipated Completion'
        monthReportData.completion_elem = monthReportData.estimated_completion_date
    } else if (typeof monthReportData.actual_completion_date !== 'undefined') {
        monthReportData.completion_elem_type = 'Actual Completion'
        monthReportData.completion_elem = monthReportData.actual_completion_date
    } else {
        monthReportData.completion_elem_type = 'Anticipated Completion'
        monthReportData.completion_elem = 'N/A'
    }

    // Create data construct for proposal
    const monthListData = {   // Create Array to store report data in
        list_data: {
            project_name: monthReportData.project_name,
            proposal_type: monthReportData.proposal_type,
            voting_status: monthReportData.voting_status,
            voting_dc_link: monthReportData.voting_dc_link,
            response_status: monthReportData.response_status,
            report_status: monthReportData.report_status,
            report_type: monthReportData.report_type,
            report_link: monthReportData.report_link,
            published_month: monthReportData.published_month,
            id: monthReportData.id,
        },
        main_data: {
            slug: monthReportData.slug,
            proposal_name: monthReportData.proposal_name,
            proposal_owner: monthReportData.proposal_owner,
            payment_date: monthReportData.payment_date,
            status: monthReportData.status,
            budget_status: monthReportData.budget_status,
            schedule_status: monthReportData.schedule_status,
            comm_status: monthReportData.comm_status,
            completion_elem_type: monthReportData.completion_elem_type,
            completion_elem: monthReportData.completion_elem,
            funding_received_usd: monthReportData.funding_received_usd,
            last_updated: monthReportData.last_updated,
            proposal_description: monthReportData.proposal_description,
            proposal_ref: monthReportData.proposal_ref,
        },
    }
    storeReportData=monthListData
    return storeReportData
}

// Function to return the record when the info of a single proposal is requested
var singleProposalQuery = function singleProposalFunction(proposalData, query) {
    storeProposalData = []        // Create Array to store report data in
    Object.keys(proposalData).map((item) => {
        // Filter out other props like 'url', etc.
        if (typeof proposalData[item].main_data !== 'undefined') {
            // Return data when a match is found
            if (proposalData[item].main_data.slug == query) {
                storeProposalData=proposalData[item]
            }
        }
    })  // End of proposalData loop
    return storeProposalData
}

var processMerchantKpiData = function merchantKpiDataFunction(proposalMainData, merchantKpiData) {
    storeKpiData = []        // Create Array to store kpi data in

            // Iterate through all merchant KPI records
            Object.keys(merchantKpiData).map((kpi_item) => {
                merchantKpiArray = []   // Clear previous data in merchantKpiData
                // Match Kpi data to its report
                if (proposalMainData.id == merchantKpiData[kpi_item].proposal_ref) {
                    const merchantKpiArray = {      // Create Array with Merchant KPI data
                        kpi_type: 'merchant_kpis',
                        date: merchantKpiData[kpi_item].date[0],
                        kpi_note: merchantKpiData[kpi_item].kpi_note,
                        total_integrated_full: merchantKpiData[kpi_item].total_integrated_full,
                        integrated_month: merchantKpiData[kpi_item].integrated_month,
                        total_single_full: merchantKpiData[kpi_item].total_single_full,
                        single_month: merchantKpiData[kpi_item].single_month,
                        total_small_full: merchantKpiData[kpi_item].total_small_full,
                        small_month: merchantKpiData[kpi_item].small_month,
                        total_medium_full: merchantKpiData[kpi_item].total_medium_full,
                        medium_month: merchantKpiData[kpi_item].medium_month,
                        total_large_full: merchantKpiData[kpi_item].total_large_full,
                        large_month: merchantKpiData[kpi_item].large_month,
                        follow_ups: merchantKpiData[kpi_item].follow_ups,
                        kpi_ref: merchantKpiData[kpi_item].id
                    }                    
                storeKpiData.push(merchantKpiArray)
                }
                
                
                
            })  // End of Merchant kpi loop
    // Create Array if no kpi data is found
    if (storeKpiData.length == 0) {
        storeKpiData = 'No KPI data found'
    }

    return storeKpiData
}   // End of KPI processing function

// Export the Airtable functions to be imported in server.js
module.exports = {
    processMainData,    
    processKpiData,
    processFinancialData,
    processReportData,
    processMonthListData,
    singleProposalQuery,
    processMerchantKpiData,     // Function for Peyton's project
}
