import React from 'react';
import Airtable from 'airtable'
Airtable.configure({apiKey: 'key_here'});

// Analytics
import {trackPage} from '../components/functions/analytics';

// Import css
import "../components/css/style.css";
import "../components/css/monthstyle.css";
import "../components/css/about.css";

// Import other elements 
import Header from '../components/headers/AboutHeader';
import NavBar from "../components/elements/NavBar"

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
                  escrow_agent: record.get('Ecrow Agent'),                                    
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

class About extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {    
    trackPage(`/about`) // Track Pageview in Analytics

    // Promise to get the initial "month list" records 
    Promise.resolve(MainProposalPosts('Proposals')).then(data => {
      console.log(data)
    })
  }

  render() {
    return (
      <main>
        <Header></Header>
        <NavBar
          showPage="about"
        />
        <section className="pagewrapper">
          <div className="aboutPageWrapper">
            <div className="aboutHeader">Dash Watch contact</div>
            Email: team at dashwatch.org <br></br>
            <div>Twitter: <span><a type="link" href="https://twitter.com/DashWatch">HERE</a></span><br></br></div>
            <div>YouTube: <span><a type="link" href="https://www.youtube.com/channel/UCfWWHvfsdvmIISr6ZSit4-Q">HERE</a></span><br></br></div>
            Discord: <br></br>
            DashWatchTeam#5277<br></br>
            Dash-AI#1455<br></br>
            MattDash#6481 (Dash Watch Beta Website)<br></br>
            paragon#2778 <br></br>
            <div className="aboutHeader">API Access</div>
            <div>Please note that API support is currently still in beta and that the data structure may still be susceptible to change. This is especially the case for performance data.
            <span>All data can be accessed via an API at </span><span><a type="link" href="http://dashwatchbeta.org/api/get/posts" target="_blank">/api/get/posts</a></span></div><br></br>
            <div>Single proposals can be accessed through "/api/p/slug_from_dc" for example <a type="link" href="http://dashwatchbeta.org/api/p/ANYPAY_JUNE_2018">http://dashwatchbeta.org/api/p/ANYPAY_JUNE_2018</a>.
            There are a few exceptions for proposals that have identical names they are available here:</div>
            <div><a type="link" href="http://dashwatchbeta.org/api/p/Dash-Help-Support-Center_201803">Dash-Help-Support-Center_201803</a></div>
            <div><a type="link" href="http://dashwatchbeta.org/api/p/Dash-Help-Support-Center_201808">Dash-Help-Support-Center_201808</a></div>
            <div><a type="link" href="http://dashwatchbeta.org/api/p/Dash-Help-Support-Center_201811">Dash-Help-Support-Center_201811</a></div>
            <br></br>
            <div>Dash Watch Beta v0.11.2 by Matt available on GitHub <a type="link" href="https://github.com/MattDash88/DashWatchBeta">HERE</a><br></br></div>
          </div>
        </section>
      </main>
    )
  }
}

export default About