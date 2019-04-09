import React from 'react';

// Analytics
import {trackEvent} from '../functions/analytics';

// Import css
import '../css/style.css';
import '../css/modal.css';
import '../css/status_styling.css';

class ModalTabFunding extends React.Component {
  constructor() {
    super();

    // Binding functions in this class
    this.callEvent = this.callEvent.bind(this);
  }
  
  // Google Analytics function to track User interaction on page
  callEvent(event) {
    trackEvent('Full Modal', 'clicked ' + event.currentTarget.id)
  }

  render() {
    const {   // Declare individual elements used in this class
      slug,
      payment_date,
      payments_received,
      funding_per_payment,
      funding_received_dash,
      funding_received_usd,
      escrow_agent,
    } = this.props.main_data

    const {   // Declare individual elements used in this class
      openTab,
    } = this.props

    return (
      <div className="modalTabContent" value={openTab == "TabFunding" ? "active" : "inactive"}>
        <div className="modalHeader">Proposal Funding Details:</div>
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
          No. of Payments Received:
            </div>
        <div className="modalPropertyItem" title={payments_received}>
        <span className="statusPropertyValue">{payments_received}</span>
        </div>
        </div>

         <div className="modalPropertyDiv">
        <div className="modalPropertyTitle">
          Funding per Payment:
            </div>
        <div className="modalPropertyItem" title={funding_per_payment}>
        <span className="statusPropertyValue">{funding_per_payment} Dash</span>
        </div>
        </div>

         <div className="modalPropertyDiv">
        <div className="modalPropertyTitle">
          Funding Received (Dash):
            </div>
        <div className="modalPropertyItem" title={funding_received_dash}>
        <span className="statusPropertyValue">{funding_received_dash} Dash</span>
        </div>
        </div>

        <div className="modalPropertyDiv">
        <div className="modalPropertyTitle">
          Funding Received (USD):
            </div>
        <div className="modalPropertyItem" title={funding_received_usd}>
        <span className="statusPropertyValue">&#36;{funding_received_usd}</span>
        </div>
        </div>

        <div className="modalPropertyDiv">
        <div className="modalPropertyTitle">
          Escrow:
            </div>
        <div className="modalPropertyItem" title={escrow_agent}>
        <span className="statusPropertyValue">{escrow_agent}</span>
        </div>
        </div>

        <div className="modalTabLink">
            <a className="link" id="directFundingLink" href={`/p/${slug}?tab=TabFunding`} target="" onClick={this.callEvent}>SHOW MORE FUNDING AND EXPENSE DATA FROM REPORTS</a>
          </div>
      </div>
      )
  }
}
  
export default ModalTabFunding