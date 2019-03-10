// All server code uses ES5 because of Airtable plugin

// Function to return the record when the info of a single proposal is requested
var searchQuery = function searchFunction(proposalData, query) {
    storeProposalData = []        // Create Array to store report data in
    Object.keys(proposalData).map((item) => {

        // Filter out other props like 'url', etc.
        if (typeof proposalData[item].main_data !== 'undefined') {            
            if (typeof proposalData[item].main_data.proposal_owner == 'undefined') {
                // Do nothing, skip entry
            } else if (proposalData[item].main_data.proposal_owner[0].toLowerCase().match(query) !== null || proposalData[item].main_data.slug.toLowerCase().match(query) !== null || proposalData[item].main_data.title.toLowerCase().match(query)) {
                // Return data when a match is found   
                storeProposalData.push(proposalData[item])
            }
        }
    })  // End of proposalData loop
    return storeProposalData
}

// Function to return the record when the info of a single proposal is requested
var filterQuery = function filterInactiveFunction(proposalData) {
    storeProposalData = []        // Create Array to store report data in
    Object.keys(proposalData).map((item) => {
        // Filter out proposals with matching comm_status
        if (typeof proposalData[item].main_data.comm_status === 'undefined') {
            // Do nothing, skip entry
        } else if (proposalData[item].main_data.comm_status[0] !== 'Opted out of Dash Watch' && proposalData[item].main_data.comm_status[0] !== 'Dash Watch reporting concluded' && proposalData[item].main_data.comm_status[0] !== 'Not reported by Dash Watch') {
            // Return data when a match is found
            storeProposalData.push(proposalData[item])
        }
    })  // End of proposalData loop
    return storeProposalData
}

// Export the Airtable functions to be imported in server.js
module.exports = {
    filterQuery,
    searchQuery,
}
