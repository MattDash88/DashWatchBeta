import React from 'react';

// Import css
import '../css/style.css';
import '../css/modal.css';
import '../css/status_styling.css';

class ModalTabMain extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    const {   // Declare single elements used in this Modal tab   
      status,
      payment_date,
      comm_status,
      budget_status,
      schedule_status,
      completion_elem_name,
      completion_elem,
      last_updated,
      proposal_description,
      funding_received_usd,
      slug,
      id,
    } = this.props.main_data

    const {   // Declare individual elements used in this class
      openTab,
    } = this.props

    // Code to generate Dashcentral link
    let dclink = null;
    const permalink = '/p/' + slug
    if (slug.match("Dash-Help-Support-Center") !== null) { //Code to handle Dash-Help proposals
      dclink = ('http://dashcentral.org/p/Dash-Help-Support-Center')
    } else {  // Pattern for all other proposals
      dclink = ('http://dashcentral.org/p/' + slug)
    }

    return (
      <div className="modalTabContent" value={openTab == "TabMain" ? "active" : "inactive"}>
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
              {completion_elem_name}
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
      <div className="modalLinkDiv">
        <span className="modalLinkItem">
        <a className="link" href={permalink} target={permalink}>Dash Watch Permalink</a>
        </span>
      </div>
    </div>
    )
  }
}

export default ModalTabMain
