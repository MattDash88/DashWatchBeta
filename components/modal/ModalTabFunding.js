import React from 'react';

// Analytics
import { trackEvent } from '../functions/analytics';

// Import css
import '../css/style.css';
import '../css/modal.css';
import '../css/status_styling.css';

class ModalTabFunding extends React.Component {
  constructor() {
    super();

    this.state = { 
      showTooltip: '',
      eventListener: false,
    };

    // Binding functions in this class
    this.handleTooltip = this.handleTooltip.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.callEvent = this.callEvent.bind(this);
  }

  // Function to close Modal
  handleTooltip(event) {
    if (this.state.showTooltip == event.currentTarget.id) {
      this.setState({ 
        showTooltip: '',
        eventListener: false,
      });
      trackEvent('Full Modal', `Opened Tooltip by clicking`)
    } else {
      this.setState({ 
        showTooltip: event.currentTarget.id,
        eventListener: true,
      });
      trackEvent('Full Modal', `Closed Tooltip by clicking on it`)
    }
  };

// Function when the eventlistener is activated. Closes tooltips when clicking outside of them
handleClick(event) {
  if (event.target.className !== "cardTooltip") {
    this.setState({
      showTooltip: '',
      eventListener: false,
    })
    trackEvent('Full Modal', `Closed Tooltip by clicking outside`)
  }
}

  // Google Analytics function to track User interaction on page
  callEvent(event) {
    trackEvent('Full Modal', 'clicked ' + event.currentTarget.id)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.eventListener !== this.state.eventListener) {
      { // Start or stop event listener that handles closing of tooltip
        this.state.eventListener ? window.addEventListener('mousedown', this.handleClick) : window.removeEventListener('mousedown', this.handleClick);        // Handles closing of dropdown menu
      }   
    }
  }

  componentWillUnmount() {
    window.removeEventListener('mousedown', this.handleClick);    // Stop event listener post is unloaded
  }

  render() {
    const {   // Declare individual elements used in this class
      slug,
      first_payment_date,
      payments_requested,
      payments_received,
      funding_per_payment,
      funding_received_dash,
      funding_received_usd,
      escrow_agent,
      payment_address,
    } = this.props.main_data

    const {   // Declare individual elements used in this class
      openTab,
    } = this.props

    return (
      <div className="modalTabContent" value={openTab == "TabFunding" ? "active" : "inactive"}>
        <div className="modalHeader">Proposal Funding Details:</div>
        <section className="modalPropertyGrid">
          <div className="modalPropertyDiv">
            <div id="first_date_paid" className="modalTooltip" onClick={this.handleTooltip}>First Date Paid:
                  <span className="modalTooltiptext" value={this.state.showTooltip == "first_date_paid" ? "Active" :
                        "Inactive"}>The date the proposal received its first payment from a superblock (UTC).</span>
            </div>
            <div className="modalPropertyItem" title={first_payment_date}>
              <span>{first_payment_date}</span>
            </div>
          </div>

          <div className="modalPropertyDiv">
            <div className="modalPropertyTitle">
              No. of Payments Requested:
            </div>
            <div className="modalPropertyItem" title={payments_requested}>
              <span>{payments_requested}</span>
            </div>
          </div>

          <div className="modalPropertyDiv">
            <div className="modalPropertyTitle">
              No. of Payments Received:
            </div>
            <div className="modalPropertyItem" title={payments_received}>
              <span>{payments_received}</span>
            </div>
          </div>

          <div className="modalPropertyDiv">
            <div className="modalPropertyTitle">
              Funding per Payment:
            </div>
            <div className="modalPropertyItem" title={funding_per_payment}>
              <span>{funding_per_payment} Dash</span>
            </div>
          </div>

          <div className="modalPropertyDiv">
            <div className="modalPropertyTitle">
              Total Funding Received (Dash):
            </div>
            <div className="modalPropertyItem" title={funding_received_dash}>
              <span>{funding_received_dash} Dash</span>
            </div>
          </div>

          <div className="modalPropertyDiv">
            <div id="total_funding_received" className="modalTooltip" onClick={this.handleTooltip}>Total funding received:
                  <span className="modalTooltiptext" value={this.state.showTooltip == "total_funding_received" ? "Active" :
                        "Inactive"}>Total USD value of the treasury payments received by this proposal. The amount is calculated by using the USD value of Dash on the days when the superblocks is mined.</span>
            </div>
            <div className="modalPropertyItem" title={funding_received_usd}>
              <span>&#36;{funding_received_usd}</span>
            </div>
          </div>

          <div className="modalPropertyDiv">
            <div className="modalPropertyTitle">
              Escrow:
            </div>
            <div className="modalPropertyItem" title={escrow_agent}>
              <span>{escrow_agent}</span>
            </div>
          </div>

          <div className="modalPropertyDiv">
            <div className="modalPropertyTitle">
              Payment Address:
            </div>
            <div className="modalPropertyItem" title={payment_address}>
              <span className="modalLongText">{payment_address}</span>
            </div>
          </div>
        </section>

        <div className="modalTabLink">
          <a id="directFundingLink" href={`/p/${slug}?tab=TabFunding`} target="" onClick={this.callEvent}>SHOW MORE FUNDING AND EXPENSE DATA FROM REPORTS</a>
        </div>
      </div>
    )
  }
}

export default ModalTabFunding