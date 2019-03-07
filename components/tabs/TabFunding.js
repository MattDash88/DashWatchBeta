import React from 'react';
import ReactGA from 'react-ga';

// Analytics
import getGAKey from '../functions/analytics';
ReactGA.initialize(getGAKey);

// Import css
import '../css/style.css';
import '../css/single.css';
import '../css/status_styling.css';

const trackEvent = (event) => {
  ReactGA.event({
      category: 'Single Page',
      action: event,
  });
}

class TabFunding extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reportTab: props.financial_data[0].date_range // State which report tab is selected
    };

    // Binding functions in this class
    this.displayTab = this.displayTab.bind(this);
  }

  // Function which subtab to show
  displayTab(event) {
    event.preventDefault();
    this.setState({ reportTab: event.currentTarget.title })
    trackEvent('Changed Funding subtab')                 // Track Event on Google Analytics
  }  

  render() {
    const { // Declare grouped elements passed on to sub tab 
      financial_data,
      openTab,
    } = this.props

    const { // Declare elements used in the funding tab  
      payment_date,
      payments_received,
      funding_per_payment,
      funding_received_dash,
      funding_received_usd,
      escrow_agent,
    } = this.props.main_data

    // Code that either returns a row of tabs or nothing depending on whether funding data is available or not
    let reportdata = null;
    if (financial_data[0] == "N/A") { // If there is no funding data, no subtabs
      reportdata = (
        <p className="subTabWrapperText">No funding data available.</p>
      )
    } else {  // If there is funding data, make subtabs
      // Make a tab button for all funding data entries
      reportdata = (
        this.props.financial_data.map((post) =>
          <button className="subTab" title={post.date_range} id={post.date_range} value={this.state.reportTab == post.date_range ? "Active" :
            "Inactive"} key={post.financial_ref} onClick={this.displayTab}>{post.date_range}</button>
        )
      )
    }

    return (
      <div className="tabContent" value={openTab == "TabFunding" ? "active" : "inactive"}>
        <div className="tabHeader">Proposal Funding Details:</div>
        <div className="tabPropertyDiv">
          <div className="tabPropertyTitle">
            First Date Paid:
          </div>
          <div className="tabPropertyItem" title={payment_date}>
            <span className="statusPropertyValue">{payment_date}</span>
          </div>
        </div>

        <div className="tabPropertyDiv">
          <div className="tabPropertyTitle">
            No. of Payments Received:
            </div>
          <div className="tabPropertyItem" title={payments_received}>
            <span className="statusPropertyValue">{payments_received}</span>
          </div>
        </div>

        <div className="tabPropertyDiv">
          <div className="tabPropertyTitle">
            Funding per Payment:
            </div>
          <div className="tabPropertyItem" title={funding_per_payment}>
            <span className="statusPropertyValue">{funding_per_payment} Dash</span>
          </div>
        </div>

        <div className="tabPropertyDiv">
          <div className="tabPropertyTitle">
            Funding Received (Dash):
            </div>
          <div className="tabPropertyItem" title={funding_received_dash}>
            <span className="fundingPropertyValue">{funding_received_dash} Dash</span>
          </div>
        </div>

        <div className="tabPropertyDiv">
          <div className="tabPropertyTitle">
            Funding Received (USD):
            </div>
          <div className="tabPropertyItem" title={funding_received_usd}>
            <span className="statusPropertyValue">&#36;{funding_received_usd}</span>
          </div>
        </div>

        <div className="tabPropertyDiv">
          <div className="tabPropertyTitle">
            Escrow:
            </div>
          <div className="tabPropertyItem" title={escrow_agent}>
            <span className="statusPropertyValue">{escrow_agent}</span>
          </div>
        </div>
        <hr className="tabBreak"></hr>
        <div className="tabHeader">Proposal Funding and Expense Data from Reports:</div>
        <div className="subTabWrapper">
          <div>{reportdata}</div>
        </div>
        {financial_data.map((post) =>
          <ReportTabContent
            key={post.financial_ref}
            financial_data={post}
            report_tab={this.state.reportTab} // Determines which subtab to show
          />
        )}
      </div>
    )
  }
}

// This generates the content tabs for all the reports, but only shows the active one
class ReportTabContent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { // Declare other elements
      report_tab, // Name of the subtab
    } = this.props

    const { // Declare financial elements used in the subtab 
      date_range,
      expenses_note,
      dash_from_treasury,
      dash_converted,
      conversion_rate,
      rollover_last_month,
      unaccounted_last_month,
      available_funding,
      reported_expenses,
      rollover_next_month,
      unaccounted_this_month,
    } = this.props.financial_data

    // Only shows note when there is one
    let note = null;
    if (expenses_note == "No note") {
      note = (
        <p></p>
      )
    } else {
      note = (
        <div className="subTabNoteText">Expenses note: {expenses_note}</div>
      )
    }
    return (
      <div className="reportTab" value={report_tab == date_range && typeof date_range !== 'undefined' ? "Active" :
        "Inactive"}>
        <div className="subTabHeader">Funding and expense information for {date_range}</div>
        {note}
        <div className="reportTabFundingColumn">

          <div className="reportTabFundingPropertyDiv">
            <div className="reportTabFundingPropertyTitle">
              Dash Received from treasury:
            </div>
            <div className="reportTabFundingPropertyItem" title={dash_from_treasury}>
              {dash_from_treasury} Dash
              </div>
          </div>

          <div className="reportTabFundingPropertyDiv">
            <div className="reportTabFundingPropertyTitle">
              Dash Converted:
            </div>
            <div className="reportTabFundingPropertyItem" title={dash_converted}>
              <span className="fundingPropertyValue" value={dash_converted}>{dash_converted} Dash at {conversion_rate}/Dash</span>
            </div>
          </div>

          <div className="reportTabFundingPropertyDiv">
            <div className="reportTabFundingPropertyTitle">
              Rollover from last month
            </div>
            <div className="reportTabFundingPropertyItem" title={rollover_last_month}>
              <span className="fundingPropertyValue" value={rollover_last_month}>{rollover_last_month}</span>
            </div>
          </div>

          <div className="reportTabFundingPropertyDiv">
            <div className="reportTabFundingPropertyTitle">
              Unaccounted for last month
            </div>
            <div className="reportTabFundingPropertyItem" title={unaccounted_last_month}>
              {unaccounted_last_month}
            </div>
          </div>

          <div className="reportTabFundingAvailable">Available Funds: {available_funding}</div>
        </div>

        <div className="reportTabFundingColumn">
          <div className="reportTabFundingPropertyDiv">
            <div className="reportTabFundingPropertyTitle">
              Reported Expenses
            </div>
            <div className="reportTabFundingPropertyItem" title={reported_expenses}>
              <span className="fundingPropertyValue" value={reported_expenses}>{reported_expenses}</span>
            </div>
          </div>

          <div className="reportTabFundingPropertyDiv">
            <div className="reportTabFundingPropertyTitle">
              Rollover to Next Month:
            </div>
            <div className="reportTabFundingPropertyItem" title={rollover_next_month}>
              <span className="fundingPropertyValue" value={rollover_next_month}>{rollover_next_month}</span>
            </div>
          </div>

          <div className="reportTabFundingPropertyDiv">
            <div className="reportTabFundingPropertyTitle">
              Unaccounted for This Month:
            </div>
            <div className="reportTabFundingPropertyItem" title={rollover_next_month}>
              {unaccounted_this_month}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default TabFunding