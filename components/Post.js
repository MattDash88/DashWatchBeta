import React from 'react';

// Analytics
import { trackEvent } from './functions/analytics';

// Import other elements 
import ModalFrame from './modal/ModalFrame';
import ModalContent from './modal/ModalContent';
import ReportSection from './proposal_list_content/ReportSection';

// Import css
import './css/style.css';
import './css/status_styling.css';

class Post extends React.Component {
  constructor() {
    super();
    this.state = { 
      show: false,
      showTooltip: '',
      eventListener: false,
    };

    // Binding functions in this class
    this.hideModal = this.hideModal.bind(this);
    this.showModal = this.showModal.bind(this);
    this.handleTooltip = this.handleTooltip.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.callEvent = this.callEvent.bind(this);
  }

  // Function to show modal
  showModal(event) {
    this.setState({ show: true });
    trackEvent('Proposals Page', 'Opened Modal: ' + event.target.className)
  };

  // Function to close Modal
  hideModal() {
    this.setState({ show: false });
  };

  // Function to close Modal
  handleTooltip(event) {
    if (this.state.showTooltip == event.currentTarget.id) {      
      this.setState({ 
        showTooltip: '',
        eventListener: false,
      });      
      trackEvent('Proposals Page', 'Opened Tooltip by clicking')
    } else {
      this.setState({ 
        showTooltip: event.currentTarget.id,
        eventListener: true,
      });
      trackEvent('Proposals Page', 'Closed Tooltip by clicking on it')
    }
  };

// Function when the eventlistener is activated. Closes tooltips when clicking outside of them
handleClick(event) {
  if (event.target.className !== "cardTooltip") {
    this.setState({
      showTooltip: '',
      eventListener: false,
    })
    trackEvent('Proposals Page', 'Closed Tooltip by clicking outside')
  }
}

  // Google Analytics function to track User interaction on page
  callEvent(event) {
    trackEvent('Proposals Page', 'clicked ' + event.currentTarget.id)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.eventListener !== this.state.eventListener) {
      { 
        this.state.eventListener ? window.addEventListener('mousedown', this.handleClick) : window.removeEventListener('mousedown', this.handleClick);        // Handles closing of dropdown menu
      }   // Start or stop event listener that handles closing of tooltip
    }
  }

  componentWillUnmount() {
    window.removeEventListener('mousedown', this.handleClick);    // Stop event listener post is unloaded
  }

  render() {
    const { // Declare grouped elements to pass on to modal      
      main_data,
      report_data,
    } = this.props

    const { // Declare main_data elements to use in render()
      title,
      budget_status,
      comm_status,
      completion_elem,        // Date or status of completion element
      completion_elem_type,   // Type of the completion element, anticipated or actual completion
      funding_received_usd,
      last_updated,
      first_payment_date,
      proposal_owner,
      schedule_status,
      slug,
      status,
      id,                     // Unique id of the proposal's Airtable record
    } = this.props.main_data

    // Code to generate Dashcentral link
    let dclink = null;
    if (slug.match("Dash-Help-Support-Center") !== null) { // Code to handle Dash-Help proposals
      dclink = ('http://dashcentral.org/p/Dash-Help-Support-Center')
    } else {
      dclink = ('http://dashcentral.org/p/' + slug) // Pattern for all other proposals
    }

    // Code generating Modal or not
    let modal = null;
    if (this.state.show == true) { // Show modal
      modal = (
        <div><ModalFrame
          show={this.state.show}
        >
          <ModalContent
            key={id}

            // Group data elements passed on to Modal
            main_data={main_data}
            report_data={report_data}

            // For functions
            show={this.state.show}   // Show modal or not
            handleClose={this.hideModal} // Function to close modal
          />
        </ModalFrame></div>
      )
    } else {   // Show nothing
      modal = (
        <div></div>
      )
    }
    // Output for the card
    return (
      <div className="cardDiv">
        <section className="cardTitle">
          <div className="proposalName" onClick={this.showModal}>{title}</div>
          <div className="ownerName">proposed by <a id="owner link" target="" href={`/proposals?search=${proposal_owner}`} onClick={this.callEvent} title={`Search ${proposal_owner}`}>{proposal_owner}</a></div>
        </section>
        <div className="cardContentWrapper">
          {
            comm_status == "Opted out of Dash Watch Reporting" || comm_status == "Not reported by Dash Watch" ? (
              // If a proposal is not reported on show a shorter card without reporting metrics
              <section className="cardPropertyGrid">
                <div className="cardPropertyDiv">
                  <div className="cardPropertyTitle">
                    <div id="first_date_paid" className="cardTooltip" onClick={this.handleTooltip}>First Date Paid:
                  <span className="cardTooltiptext" value={this.state.showTooltip == "first_date_paid" ? "Active" :
                        "Inactive"}>The date the proposal received its first payment from a superblock (UTC).</span>
                    </div>
                  </div>
                  <div className="cardPropertyItem" title={first_payment_date}>
                    <span>{first_payment_date}</span>
                  </div>
                </div>

                <div className="cardPropertyDiv" value={comm_status}>
                  <div id="comm_status" className="cardTooltip" onClick={this.handleTooltip}>Communication status:
                  <span className="cardTooltiptext" value={this.state.showTooltip == "comm_status" ? "Active" :
                        "Inactive"}>The communication status of the proposal team with Dash Watch.</span>
                  </div>
                  <div className="cardPropertyItem" title={comm_status}>
                    <span>{comm_status}</span>
                  </div>
                </div>

                <div className="cardPropertyDiv">
                  <div id="total_funding_received" className="cardTooltip" onClick={this.handleTooltip}>Total funding received:
                  <span className="cardTooltiptext" value={this.state.showTooltip == "total_funding_received" ? "Active" :
                        "Inactive"}>An indication of the USD value of the treasury payments received by this proposal. The amount is calculated using the price of Dash rounded to full US Dollars on the days each superblock is mined.</span>
                  </div>
                  <div className="cardPropertyItem" title={funding_received_usd}>
                    <span>&#36;{funding_received_usd}</span>
                  </div>
                </div>

                <div className="cardPropertyDiv">
                  <div id="last_updated" className="cardTooltip" onClick={this.handleTooltip}>Last updated:
                  <span className="cardTooltiptext" value={this.state.showTooltip == "last_updated" ? "Active" :
                        "Inactive"}>Last time the metrics for this proposal were updated by Dash Watch.</span>
                  </div>
                  <div className="cardPropertyItem" title={last_updated}>
                    <span>{last_updated}</span>
                  </div>
                </div>
              </section>
            ) : (
              // Else show full card
                <section className="cardPropertyGrid">
                  <div className="cardPropertyDiv" value={status}>
                    <div className="cardPropertyTitle">
                      Status:
          </div>
                    <div className="cardPropertyItem" title={status}>
                      <span>{status}</span>
                    </div>
                  </div>

                  <div className="cardPropertyDiv" value={comm_status}>
                    <div id="comm_status" className="cardTooltip" onClick={this.handleTooltip}>Communication status:
                  <span className="cardTooltiptext" value={this.state.showTooltip == "comm_status" ? "Active" :
                        "Inactive"}>The communication status of the proposal team with Dash Watch.</span>
                    </div>
                    <div id="comm_status" className="cardPropertyItem" title={comm_status}>
                      <span>{comm_status}</span>
                    </div>
                  </div>

                  <div className="cardPropertyDiv" value={budget_status}>
                    <div className="cardPropertyTitle">
                      Budget Status:
          </div>
                    <div className="cardPropertyItem" title={budget_status}>
                      <span>{budget_status}</span>
                    </div>
                  </div>

                  <div className="cardPropertyDiv" value={schedule_status}>
                    <div className="cardPropertyTitle">
                      Schedule Status:
          </div>
                    <div className="cardPropertyItem" title={schedule_status}>
                      <span>{schedule_status}</span>
                    </div>
                  </div>

                  <div className="cardPropertyDiv">
                    <div id="first_date_paid" className="cardTooltip" onClick={this.handleTooltip}>First Date Paid:
                  <span className="cardTooltiptext" value={this.state.showTooltip == "first_date_paid" ? "Active" :
                        "Inactive"}>The date the proposal received its first payment from a superblock (UTC).</span>
                    </div>
                    <div className="cardPropertyItem" title={first_payment_date}>
                      <span>{first_payment_date}</span>
                    </div>
                  </div>

                  <div className="cardPropertyDiv">
                    <div id="total_funding_received" className="cardTooltip" onClick={this.handleTooltip}>Total funding received:
                  <span className="cardTooltiptext" value={this.state.showTooltip == "total_funding_received" ? "Active" :
                        "Inactive"}>An indication of the USD value of the treasury payments received by this proposal. The amount is calculated using the price of Dash rounded to full US Dollars on the days each superblock is mined.</span>
                    </div>
                    <div className="cardPropertyItem" title={funding_received_usd}>
                      <span>&#36;{funding_received_usd}</span>
                    </div>
                  </div>

                  <div className="cardPropertyDiv">
                    <div className="cardPropertyTitle">
                      {completion_elem_type}
                    </div>
                    <div className="cardPropertyItem" title={completion_elem}>
                      <span>{completion_elem}</span>
                    </div>
                  </div>

                  <div className="cardPropertyDiv">
                    <div id="last_updated" className="cardTooltip" onClick={this.handleTooltip}>Last updated:
                  <span className="cardTooltiptext" value={this.state.showTooltip == "last_updated" ? "Active" :
                        "Inactive"}>Most recent date the metrics for this proposal were updated by Dash Watch.</span>
                    </div>
                    <div className="cardPropertyItem" title={last_updated}>
                      <span>{last_updated}</span>
                    </div>
                  </div>
                </section>
              ) // End of comm_status if
          }
          {
            typeof report_data == 'undefined' ? (
              // Throw error if there are errors in the Data
              <section className="cardReportGrid">
                <div className="cardReportDiv">
                  <div className="cardReportItem"><span className="cardNoReportText">Something went wrong with the report data</span></div>
                </div>
                <div className="cardReportDiv">
                </div>
              </section>
            ) : (
                report_data == "No reports available" ? (
                  //  For proposals that are not reported on, show nothing unless there is a report or media item
                    comm_status == "Opted out of Dash Watch Reporting" || comm_status == "Not reported by Dash Watch" ? ( 
                      null
                    ) : (
                  //  Show "no reports found" if there are none
                  <section className="cardReportGrid">
                    <div className="cardReportDiv">
                      <div className="cardReportItem"><span className="cardNoReportText">No reports available</span></div>
                    </div>
                    <div className="cardReportDiv">
                    </div>
                  </section>
                    ) // End of comm_status if
                  ) : (
                    // If there are reports generate links from ReportSection class
                    <ReportSection
                      key={`${id}_dropdown`}
                      report_data={report_data}
                      id={id}
                    />
                  ) // End of reports available or not if
              ) // End of report if
          }
          <section>
            <div className="cardLinkItem">
              <a className="cardLink" id="Dash Central Link" href={dclink} target="_blank" onClick={this.callEvent}>DASHCENTRAL LINK</a>
            </div>

            <div className="cardLinkItem">
              <a className="cardLink" id="Dash Watch Link" href={`/p/${slug}`} target="" onClick={this.callEvent}>DASH WATCH PAGE</a>
            </div>

            <div className="cardLinkItem">
              <div className="cardLink" type="button" onClick={this.showModal}>
                +show more
            </div>
            </div>
          </section>
        </div>
        {modal}
      </div>
    )
  }
}

export default Post