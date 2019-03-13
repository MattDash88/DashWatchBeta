// This is a temporary simplified for the January 2019 test page
import React from 'react';
import ReactGA from 'react-ga';

// Analytics
import getGAKey from '../functions/analytics';
ReactGA.initialize(getGAKey);

// Import css
import '../css/style.css';
import '../css/simplified_modal.css';
import '../css/status_styling.css';

const trackEvent = (event) => {
  ReactGA.event({
      category: 'Simple Modal',
      action: event,
  });
}

class ModalContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.handleClose = this.handleClose.bind(this);
    this.callEvent = this.callEvent.bind(this);
  }

  // Function to close the modal
  handleClose() {
    this.props.handleClose();
    trackEvent('Closed Modal Button')                 // Track Event on Google Analytics
  }

  // If user clicks outside modal area, run handleClose
  handleClick = (e) => {
    if (e.target.id == "outside") {      
      this.props.handleClose()
    }
  }

  // Google Analytics function to track User interaction on page
  callEvent(event) {
    trackEvent('clicked ' + event.currentTarget.id)
  }

  componentDidMount() {
    // Event listener to check if user clicks outside of modal area
    document.addEventListener('mousedown', this.handleClick);
  }

  render() {
    const { // Declare grouped elements passed on to sub tab 
      slug,
      proposal_name,
      proposal_owner,
      proposal_description,
      payment_date,
      status,
      budget_status,
      schedule_status,
      comm_status,
      completion_elem_type,
      completion_elem,
      funding_received_usd,
      last_updated
    } = this.props.main_data

    // Code to generate Dashcentral link
    let dclink = null;
    if (slug[0].match("Dash-Help-Support-Center") !== null) { //Code to handle Dash-Help proposals
      dclink = ('http://dashcentral.org/p/Dash-Help-Support-Center')
    } else {  // Pattern for all other proposals
      dclink = ('http://dashcentral.org/p/' + slug)
    }

    return (
      <div className="simple_modalWrapper" id="Modal">
      <div className="simple_modalCardTitle">
            <div className="simple_modalCloseButton" onClick={this.handleClose}>[ close ]</div>
            <div className="simple_modalProposalName">{proposal_name}</div>
            <div className="simple_modalOwnerName">proposed by <a className="simple_modalOwnerNameText" id="owner link" target="" href={`/proposals?search=${proposal_owner}`} onClick={this.callEvent}>{proposal_owner}</a></div>
          <div className="simple_modalTabContent">
          <div className="simple_modalSubHeader">Proposal Description:</div>
          <div className="simple_modalProposalText">{proposal_description}</div>
          <div className="simple_modalHeader">Proposal Details:</div>
          <div className="simple_modalPropertyGrid">
          <div className="simple_modalPropertyDiv">
            <div className="simple_modalPropertyTitle">
              First Date Paid:
            </div>
            <div className="simple_modalPropertyItem" title={payment_date}>
              <span className="statusPropertyValue">{payment_date}</span>
            </div>
          </div>

          <div className="simple_modalPropertyDiv" value={status}>
            <div className="simple_modalPropertyTitle">
              Status:
            </div>
            <div className="simple_modalPropertyItem" title={status} value={status}>
              <span className="statusPropertyValue">{status}</span>
            </div>
          </div>

          <div className="simple_modalPropertyDiv" value={budget_status}>
            <div className="simple_modalPropertyTitle">
              Budget Status:
            </div>
            <div className="simple_modalPropertyItem" title={budget_status} value={budget_status}>
              <span className="statusPropertyValue">{budget_status}</span>
            </div>
          </div>

          <div className="simple_modalPropertyDiv" value={schedule_status}>
            <div className="simple_modalPropertyTitle">
              Schedule Status:
            </div>
            <div className="simple_modalPropertyItem" title={schedule_status}>
              <span className="statusPropertyValue">{schedule_status}</span>
            </div>
          </div>

          <div className="simple_modalPropertyDiv" value={comm_status}>
            <div className="simple_modalPropertyTitle">
              Communication Status:
            </div>
            <div className="simple_modalPropertyItem" title={comm_status}>
              <span className="statusPropertyValue">{comm_status}</span>
            </div>
          </div>

          <div className="simple_modalPropertyDiv">
            <div className="simple_modalPropertyTitle">
              {completion_elem_type}
            </div>
            <div className="simple_modalPropertyItem" title={completion_elem}>
              <span className="statusPropertyValue">{completion_elem}</span>
            </div>
          </div>

          <div className="simple_modalPropertyDiv">
            <div className="simple_modalPropertyTitle">
              Total funding received:
            </div>
            <div className="simple_modalPropertyItem" title={funding_received_usd}>
              <span className="statusPropertyValue">&#36;{funding_received_usd}</span>
            </div>
          </div>

          <div className="simple_modalPropertyDiv">
            <div className="simple_modalPropertyTitle">
              Last updated:
            </div>
            <div className="simple_modalPropertyItem" title={last_updated}>
              <span className="statusPropertyValue">{last_updated}</span>
            </div>
          </div>

          <div className="simple_modalPropertyDiv" id="linkPropertyDiv">
          <div className="simple_modalPropertyTitle">
              Links:
            </div>
            <a className="link" id="modalDcLink" href={dclink} target="_blank" onClick={this.callEvent}><img id="DcLogo" src="https://dashwatchbeta.org/images/DashCentral.png" height="40"></img></a>
            <a className="link" id="modalDwLink" href={`/p/${slug}`} target="" onClick={this.callEvent}><img id="Logo" src="https://dashwatchbeta.org/images/DashWatch.png" height="40"></img></a> 
              
          </div>
          </div>          
          </div>
        </div>
      </div>
    );
  }
}

export default ModalContent