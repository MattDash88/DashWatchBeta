// Get data processing functions from another file
var processingFunctions = require('./dataProcessingFunctions');

// Processing function for report data
var createMonthListDataset = function monthListDataset(monthReportData) {
    // Create const to push proposal data in
    const reportPosts = []
    const optedOutPosts = []

    Object.keys(monthReportData).map((item) => {
      if (typeof monthReportData[item].proposal_ref !== 'undefined' && typeof monthReportData[item].report_status !== 'undefined') {     //Check if record exists
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
    return reportListPosts
}

// Export the Airtable functions to be imported in server.js
module.exports = {
  createMonthListDataset,
}