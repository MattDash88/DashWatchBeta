// This is a temporary simplified for the January 2019 test page
import React from 'react';

// Import css
import '../css/style.css';
import '../css/modal.css';
import '../css/status_styling.css';

class ModalContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.handleClose = this.handleClose.bind(this);
  }

  // Function to close the modal
  handleClose() {
    this.props.handleClose();
  }

  // If user clicks outside modal area, run handleClose
  handleClick = (e) => {
    if (e.target.id == "outside") {
      this.handleClose()
    }
  }

  componentDidMount() {
    // Event listener to check if user clicks outside of modal area
    document.addEventListener('mousedown', this.handleClick);
  }

  render() {
    const { // Declare grouped elements passed on to sub tab 
      slug,
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

    console.log(last_updated)

    // Code to generate Dashcentral link
    let dclink = null;
    if (slug[0].match("Dash-Help-Support-Center") !== null) { //Code to handle Dash-Help proposals
      dclink = ('http://dashcentral.org/p/Dash-Help-Support-Center')
    } else {  // Pattern for all other proposals
      dclink = ('http://dashcentral.org/p/' + slug)
    }

    return (
      <div className="modalWrapper" id="Modal">
        <div className="modalCardTitle">
          <span className="modalTitleWrapper">
            <span className="modalProposalName">{slug}</span><span className="modalCloseButton" onClick={this.handleClose}>[ close ]</span>
            <div className="modalOwnerName">by {proposal_owner}</div>
          </span>
          <div className="modalTabContent">
          <div className="modalSubHeader">Proposal Description:</div>
          <div className="modalProposalText">{proposal_description}</div>
          <div className="modalHeader">Proposal Details:</div>
          <div className="modalPropertyDiv">
            <div className="modalPropertyTitle">
              First Date Paid:
            </div>
            <div className="modalPropertyItem" title={payment_date}>
              <span className="statusPropertyValue">{payment_date}</span>
            </div>
          </div>

          <div className="modalPropertyDiv">
            <div className="modalPropertyTitle">
              Status:
            </div>
            <div className="modalPropertyItem" title={status} value={status}>
              <span className="statusPropertyValue" value={status}>{status}</span>
            </div>
          </div>

          <div className="modalPropertyDiv">
            <div className="modalPropertyTitle">
              Budget Status:
            </div>
            <div className="modalPropertyItem" title={budget_status} value={budget_status}>
              <span className="statusPropertyValue" value={budget_status}>{budget_status}</span>
            </div>
          </div>

          <div className="modalPropertyDiv">
            <div className="modalPropertyTitle">
              Schedule Status:
            </div>
            <div className="modalPropertyItem" title={schedule_status} value={schedule_status}>
              <span className="statusPropertyValue" value={schedule_status}>{schedule_status}</span>
            </div>
          </div>

          <div className="modalPropertyDiv">
            <div className="modalPropertyTitle">
              {completion_elem_type}
            </div>
            <div className="modalPropertyItem" title={completion_elem}>
              <span className="statusPropertyValue">{completion_elem}</span>
            </div>
          </div>

          <div className="modalPropertyDiv">
            <div className="modalPropertyTitle">
              Communication Status:
            </div>
            <div className="modalPropertyItem" title={comm_status} value={comm_status}>
              <span className="statusPropertyValue" value={comm_status}>{comm_status}</span>
            </div>
          </div>

          <div className="modalPropertyDiv">
            <div className="modalPropertyTitle">
              Total funding received:
            </div>
            <div className="modalPropertyItem" title={funding_received_usd}>
              <span className="statusPropertyValue">&#36;{funding_received_usd}</span>
            </div>
          </div>

          <div className="modalPropertyDiv">
            <div className="modalPropertyTitle">
              Last updated:
            </div>
            <div className="modalPropertyItem" title={last_updated}>
              <span className="statusPropertyValue">{last_updated}</span>
            </div>
          </div>

          <div className="modalHeader">Links:</div>
          <div className="modalLinkDiv">
            <span className="modalLinkItem">
              <a className="link" href={dclink} target={dclink}>Dashcentral Link</a>
            </span>
          </div>

        </div>
        <br></br>
        </div>
      </div>
    );
  }
}

export default ModalContent