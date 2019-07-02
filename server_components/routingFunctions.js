// All server code uses ES5 because of some packages
const fetch = require('isomorphic-unfetch');

// Function to return the record when the info of a single proposal is requested
var reportRedirects = function handleReportRedirects(month, proposalID) {
    fetch(`https://www.google-analytics.com/collect?v=1&tid=${gaKey}&cid=4B8302DA-21AD-401F-AF45-1DFD956B80B5&sc=end&t=pageview&dp=%2F/r/${req.params.month}/${req.params.reportId}&z=${x}`,
      {
        method: 'post',
      }
    )
    try {
        if (proposalID.match('.pdf')) {
            const actualPage = `https://reports.dashwatch.org/${month}/${proposalID}`
            return actualPage
        } else {
            const actualPage = `https://reports.dashwatch.org/${month}/${proposalID}.pdf`
            return actualPage
        }
    }
    catch {
        return '/'
    }
}

// Export the Airtable functions to be imported in server.js
module.exports = {
    reportRedirects,
}
