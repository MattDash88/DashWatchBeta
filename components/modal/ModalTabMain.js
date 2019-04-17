import React from 'react';

// Analytics
import {trackEvent} from '../functions/analytics';

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
  handleClick() {
    this.setState({
      showTooltip: '',
      eventListener: false,
    })
    trackEvent('Full Modal', `Closed Tooltip by clicking outside`)
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
      slug,
      proposal_description,
      first_payment_date,
      status,
      budget_status,
      schedule_status,
      comm_status,
      completion_elem_type,
      completion_elem,
      funding_received_usd,
      last_updated
    } = this.props.main_data

    const {   // Declare individual elements used in this class
      openTab,
    } = this.props

    // Code to generate Dashcentral link
    let dclink = null;
    if (slug.match("Dash-Help-Support-Center") !== null) { //Code to handle Dash-Help proposals
      dclink = ('http://dashcentral.org/p/Dash-Help-Support-Center')
    } else {  // Pattern for all other proposals
      dclink = ('http://dashcentral.org/p/' + slug)
    }

    return (
      <div className="modalTabContent" value={openTab == "TabMain" ? "active" : "inactive"}>
        {
          comm_status == "Opted out of Dash Watch Reporting" || comm_status == "Not reported by Dash Watch" ? (
            <section>
              <div className="modalHeader">Proposal Details:</div>
              <div className="modalPropertyGrid">
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
                  <div id="proposal_id" className="modalTooltip" onClick={this.handleTooltip}>Proposal ID:
                  <span className="modalTooltiptext" value={this.state.showTooltip == "proposal_id" ? "Active" :
                        "Inactive"}>Unique proposal identifier. With a few exceptions it is the last, proposal unique part of the url of the Dash Central proposal page.</span>
                  </div>
                  <div className="modalPropertyItem" title={slug}>
                    <span>{slug}</span>
                  </div>
                </div>

                <div className="modalPropertyDiv">
                  <div id="last_updated" className="modalTooltip" onClick={this.handleTooltip}>Last updated:
                  <span className="modalTooltiptext" value={this.state.showTooltip == "last_updated" ? "Active" :
                        "Inactive"}>Last time the metrics for this proposal were updated by Dash Watch.</span>
                  </div>
                  <div className="modalPropertyItem" title={last_updated}>
                    <span>{last_updated}</span>
                  </div>
                </div>
              </div>
            </section>
          ) : (
              <section>
                <div className="modalHeader">Proposal Description:</div>
                <div className="modalProposalText">{proposal_description}</div>
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

                  <div className="modalPropertyDiv" value={comm_status}>
                    <div id="comm_status" className="modalTooltip" onClick={this.handleTooltip}>Communication status:
                  <span className="modalTooltiptext" value={this.state.showTooltip == "comm_status" ? "Active" :
                        "Inactive"}>The communication status of the proposal team with Dash Watch.</span>
                    </div>
                    <div className="modalPropertyItem" title={comm_status}>
                      <span>{comm_status}</span>
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
                    <div id="first_date_paid" className="modalTooltip" onClick={this.handleTooltip}>First Date Paid:
                  <span className="modalTooltiptext" value={this.state.showTooltip == "first_date_paid" ? "Active" :
                        "Inactive"}>The date the proposal received its first payment from a superblock (UTC).</span>
                    </div>
                    <div className="modalPropertyItem" title={first_payment_date}>
                      <span>{first_payment_date}</span>
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
                      {completion_elem_type}
                    </div>
                    <div className="modalPropertyItem" title={completion_elem}>
                      <span>{completion_elem}</span>
                    </div>
                  </div>

                  <div className="modalPropertyDiv">
                    <div id="proposal_id" className="modalTooltip" onClick={this.handleTooltip}>Proposal ID:
                  <span className="modalTooltiptext" value={this.state.showTooltip == "proposal_id" ? "Active" :
                        "Inactive"}>Unique proposal identifier. With a few exceptions it is the last, proposal unique part of the url of the Dash Central proposal page.</span>
                    </div>
                    <div className="modalPropertyItem" title={slug}>
                      <span>{slug}</span>
                    </div>
                  </div>

                  <div className="modalPropertyDiv">
                    <div id="last_updated" className="modalTooltip" onClick={this.handleTooltip}>Last updated:
                  <span className="modalTooltiptext" value={this.state.showTooltip == "last_updated" ? "Active" :
                        "Inactive"}>Last time the metrics for this proposal were updated by Dash Watch.</span>
                    </div>
                    <div className="modalPropertyItem" title={last_updated}>
                      <span>{last_updated}</span>
                    </div>
                  </div>
                </div>
              </section>
            )
        }

        <section>
          <div className="modalHeader">Links:</div>
          <div className="modalLinkDiv">
            <a id="modalDcLink" href={dclink} target="_blank" onClick={this.callEvent}><img id="DcLogo" src="https://dashwatchbeta.org/images/DashCentral.png" height="40"></img></a>
            <div className="modalLinkSeparator"></div>
            <a id="modalDwLink" href={`/p/${slug}`} target="" onClick={this.callEvent}><img id="Logo" src="https://dashwatchbeta.org/images/DashWatch.png" height="40"></img></a>
            <div className="modalLinkSeparator"></div>
          </div>
        </section>
      </div>
    )
  }
}

export default ModalTabMain
