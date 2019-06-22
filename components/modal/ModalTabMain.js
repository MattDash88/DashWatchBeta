import React from 'react';

// Analytics
import { trackEvent } from '../functions/analytics';

// Import css
import '../css/style.css';
import '../css/modal.css';
import '../css/status_styling.css';

class ModalTabMain extends React.Component {
  constructor() {
    super();

    this.state = {
      showTooltip: '',
      eventListener: false,
    };

    // Binding functions in this class
    this.handleClick = this.handleClick.bind(this);
    this.handleTooltip = this.handleTooltip.bind(this);
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
    if (event.target.className !== "modalTooltip") {
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
    const {   // Declare single elements used in this Modal tab         
      proposal_description,
      first_payment_date,
      status,
      budget_status,
      schedule_status,
      comm_status,
      reporting_status,
      completion_elem_type,
      completion_elem,
      funding_received_usd,
      last_updated,
      slug,
      dc_url,
      nexus_id,
      nexus_url,
    } = this.props.main_data

    const {   // Declare individual elements used in this class
      openTab,
    } = this.props

    return (
      <div className="modalTabContent" value={openTab == "TabMain" ? "active" : "inactive"}>
        <section> 
          {     // Only show Proposal Description header for proposals that have one
            typeof proposal_description !== 'undefined' ? (
              <div>
                <div className="modalHeader">Proposal Description:</div>
                <div className="modalProposalText">{proposal_description}</div>
              </div>
            ) : (
              null
            )
          }                    
          <div className="modalHeader">Proposal Details:</div>
          <div className="modalPropertyGrid">
            <div className="modalPropertyDiv" value={status}>
              <div className="modalPropertyTitle">
                Status:
                    </div>
              <div className="modalPropertyItem" title={status}>
                <span>{status}</span>
              </div>
            </div>

            <div className="modalPropertyDiv">
              <div id="first_date_paid" className="modalTooltip" onClick={this.handleTooltip}>First Date Paid:
                  <span className="modalTooltiptext" value={this.state.showTooltip == "first_date_paid" ? "Active" :
                  "Inactive"}>The date the proposal received its first payment from a superblock (UTC).</span>
              </div>
              <div className="modalPropertyItem" title={first_payment_date}>
                <span>{first_payment_date}</span>
              </div>
            </div>

            <div className="modalPropertyDiv" value={comm_status}>
              <div id="comm_status" className="modalTooltip" onClick={this.handleTooltip}>Communication status:
                  <span className="modalTooltiptext" value={this.state.showTooltip == "comm_status" ? "Active" :
                  "Inactive"}>The communication status of the proposal team with Dash Watch.</span>
              </div>
              <div className="modalPropertyItem" title={comm_status}>
                <span>{comm_status}</span>
              </div>
            </div>

            <div className="modalPropertyDiv" value={reporting_status}>
              <div id="reporting_status" className="modalTooltip" onClick={this.handleTooltip}>Reporting status:
                  <span className="modalTooltiptext" value={this.state.showTooltip == "reporting_status" ? "Active" :
                  "Inactive"}>This propoerty indicates if Dash Watch is still reporting on this proposal.</span>
              </div>
              <div className="modalPropertyItem" title={reporting_status}>
                <span>{reporting_status}</span>
              </div>
            </div>

            <div className="modalPropertyDiv" value={budget_status}>
              <div className="modalPropertyTitle">
                Budget Status:
                    </div>
              <div className="modalPropertyItem" title={budget_status}>
                <span>{budget_status}</span>
              </div>
            </div>

            <div className="modalPropertyDiv" value={schedule_status}>
              <div className="modalPropertyTitle">
                Schedule Status:
                    </div>
              <div className="modalPropertyItem" title={schedule_status}>
                <span>{schedule_status}</span>
              </div>
            </div>

            <div className="modalPropertyDiv">
              <div id="total_funding_received" className="modalTooltip" onClick={this.handleTooltip}>Total funding received:
                  <span className="modalTooltiptext" value={this.state.showTooltip == "total_funding_received" ? "Active" :
                  "Inactive"}>An indication of the USD value of the treasury payments received by this proposal. The amount is calculated using the price of Dash rounded to full US Dollars on the days each superblock is mined.</span>
              </div>
              <div className="modalPropertyItem" title={funding_received_usd}>
                <span>&#36;{funding_received_usd}</span>
              </div>
            </div>

            <div className="modalPropertyDiv">
              <div className="modalPropertyTitle">
                {completion_elem_type}:
              </div>
              <div className="modalPropertyItem" title={completion_elem}>
                <span>{completion_elem}</span>
              </div>
            </div>

            <div className="modalPropertyDiv">
              <div id="last_updated" className="modalTooltip" onClick={this.handleTooltip}>Last updated:
                  <span className="modalTooltiptext" value={this.state.showTooltip == "last_updated" ? "Active" :
                  "Inactive"}>Most recent date the metrics for this proposal were updated by Dash Watch.</span>
              </div>
              <div className="modalPropertyItem" title={last_updated}>
                <span>{last_updated}</span>
              </div>
            </div>
          </div>
          <p><span id="proposal_id" className="modalHeader">Proposal ID: </span>
          <span className="modalLongText">{slug}</span></p>
        </section>        
        <section>
          <div className="modalHeader">Links:</div>
          <div className="modalLinkDiv">
            {
              typeof nexus_url !== 'undefined' ? (
                <section>
                <a id="modalNexusLink" href={nexus_url} target="_blank" onClick={this.callEvent}><img id="NexusLogo" src="/static/images/DashNexus.png" height="40"></img></a>
                <div className="modalLinkSeparator"></div>
                </section>
               ) : (
                 null
               )
            }           
            <a id="modalDcLink" href={dc_url} target="_blank" onClick={this.callEvent}><img id="DcLogo" src="/static/images/DashCentral.png" height="40"></img></a>
            <div className="modalLinkSeparator"></div>
            <a id="modalDwLink" href={`/p/${slug}`} target="" onClick={this.callEvent}><img id="Logo" src="/static/images/DashWatch.png" height="40"></img></a>
          </div>
        </section>
      </div>
    )
  }
}

export default ModalTabMain
