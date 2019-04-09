import React from 'react';

// Analytics
import {trackEvent} from '../functions/analytics';

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

class TabMain extends React.Component { 
  constructor() {
    super();
    // Binding functions in this class
    this.callEvent = this.callEvent.bind(this);
  }

  // Google Analytics function to track User interaction on page
  callEvent(event) {
    trackEvent('Clicked ' + event.currentTarget.id)
  }

  render() {
    const { // Declare single elements used in this tab   
      status,
      payment_date,
      comm_status,
      budget_status,
      schedule_status,
      completion_elem_type, // Type of the completion element, anticipated or actual completion
      completion_elem,      // Date or status of completion element
      last_updated,
      proposal_description,
      funding_received_usd,
      slug,
    } = this.props.main_data

    const {   // Declare individual elements used in this class
      openTab,
    } = this.props
    
    // Code to generate Dashcentral link
    let dclink = null;
      if (slug.match("Dash-Help-Support-Center") !== null) { //Code to handle Dash-Help proposals
        dclink = ('http://dashcentral.org/p/Dash-Help-Support-Center')
      } else {    // Pattern for all other proposals
        dclink = ('http://dashcentral.org/p/' + slug)
      }

    return (
      <div className="tabContent" value={openTab == "TabMain" ? "active" : "inactive"}>
        <div className="tabSubHeader">Proposal Description:</div>
        <div className="tabProposalText">{proposal_description}</div>
        <div className="tabHeader">Proposal Details:</div>
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
            Status:
            </div>
          <div className="tabPropertyItem" title={status}>
            <span className="statusPropertyValue" value={status}>{status}</span>
          </div>
        </div>

        <div className="tabPropertyDiv">
          <div className="tabPropertyTitle">
            Budget Status:
            </div>
          <div className="tabPropertyItem" title={budget_status}>
            <span className="statusPropertyValue" value={budget_status}>{budget_status}</span>
          </div>
        </div>

        <div className="tabPropertyDiv">
          <div className="tabPropertyTitle">
            Schedule Status:
            </div>
          <div className="tabPropertyItem" title={schedule_status}>
            <span className="statusPropertyValue" value={schedule_status}>{schedule_status}</span>
          </div>
        </div>

        <div className="tabPropertyDiv">
          <div className="tabPropertyTitle">
            {completion_elem_type}:
            </div>
          <div className="tabPropertyItem" title={completion_elem}>
            <span className="statusPropertyValue">{completion_elem}</span>
          </div>
        </div>

        <div className="tabPropertyDiv">
          <div className="tabPropertyTitle">
            Communication Status:
            </div>
          <div className="tabPropertyItem" title={comm_status}>
            <span className="statusPropertyValue" value={comm_status}>{comm_status}</span>
          </div>
        </div>

        <div className="tabPropertyDiv">
          <div className="tabPropertyTitle">
            Total funding received:
            </div>
          <div className="tabPropertyItem" title={funding_received_usd}>
            <span className="statusPropertyValue">&#36;{funding_received_usd}</span>
          </div>
        </div>

        <div className="tabPropertyDiv">
          <div className="tabPropertyTitle">
            Last updated:
            </div>
          <div className="tabPropertyItem" title={last_updated}>
            <span className="statusPropertyValue">{last_updated}</span>
          </div>
        </div>

        <div className="tabHeader">Links:</div>
        <div className="tabLinkDiv">
          <div className="tabLinkItem">
            <a className="link" id="pageDcLink" href={dclink} target="_blank" onClick={this.callEvent}>Dashcentral Link</a>
          </div><br></br>
        </div>
      </div>
    )
  }
}

export default TabMain
