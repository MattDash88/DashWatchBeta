require('dotenv').config();    // Access .env variables
const { Pool, Client } = require('pg');
const pool = new Pool({
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    password: process.env.PG_PW,
    database: process.env.PG_DB,
    port: process.env.PG_PORT,
});

// Function to retrieve list of countries from database
var retrieveListOfMonths = function retrieveCountryListFunction() {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * 
                    FROM report_list.list_of_months
                    ORDER BY year DESC, month DESC;`, 
                    function (err, results) {
            if (err) reject(err);
            else {
                resolve(results.rows);
            }
        })
    })
}

// Function to retrieve dash.org data for world from database
var retrieveMonthListReleaseData = function retrieveMonthListReleaseFunction() {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT a.*, b.report_link
                    FROM report_list.release_list a
                    LEFT OUTER JOIN report_list.reports b
                    ON a.report_id = b.unique_id ::TEXT
                    ORDER BY a.voting_status != 'New Proposal', a.voting_status != 'Up for Vote', a.voting_status != 'Funded', a.project_name ASC;`, 
                    function (err, results) {
            if (err) reject(err);
            else {
                resolve(results.rows);
            }
        })
    })
}

// Function to retrieve dash.org data for world from database
var retrieveReportData = function retrieveReportsFunction() {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * 
                    FROM report_list.reports
                    ORDER BY release_date ASC;`, 
                    function (err, results) {
            if (err) reject(err);
            else {
                resolve(results.rows);
            }
        })
    })
}

module.exports = {
    // Month List functions functions    
    retrieveMonthListReleaseData,
    retrieveReportData,
}