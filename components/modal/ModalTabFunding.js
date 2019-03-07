import React from 'react';
import ReactGA from 'react-ga';

// Analytics
import getGAKey from '../functions/analytics';
ReactGA.initialize(getGAKey);

// Import css
import '../css/style.css';
import '../css/modal.css';
import '../css/status_styling.css';

const trackEvent = (event) => {
  ReactGA.event({
      category: 'Full Modal',
      action: event,
  });
}

class ModalTabFunding extends React.Component {
  constructor(props) {
    super(props);

    // Binding functions in this class
    this.callEvent = this.callEvent.bind(this);
  }
  
  // Google Analytics function to track User interaction on page
  callEvent(event) {
    trackEvent('clicked ' + event.currentTarget.id)
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
        <span className="statusPropertyValue">{funding_received_dash} Dash</span>
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

        <div className="modalTabLink">
            <a className="link" href={`/p/${slug}?tab=TabFunding`} target="" id="directFundingLink" onClick={this.callEvent}>SHOW MORE FUNDING AND EXPENSE DATA FROM REPORTS</a>
          </div>
      </div>
      )
  }
}
  
export default ModalTabFunding