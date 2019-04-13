import React from 'react';

// Analytics
import { trackEvent } from './functions/analytics';

// Import other elements 
import ModalFrame from './modal/ModalFrame';
import ModalContent from './modal/ModalContent';
import ReportsSection from './proposal_list_content/ReportsSection';

// Import css
import './css/style.css';
import './css/status_styling.css';

class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = { show: false };

    // Binding functions in this class
    this.hideModal = this.hideModal.bind(this);
    this.showModal = this.showModal.bind(this);
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

  callEvent(event) {
    trackEvent('Proposals Page', 'clicked ' + event.currentTarget.id)
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
      completion_elem,      // Date or status of completion element
      completion_elem_type, // Type of the completion element, anticipated or actual completion
      funding_received_usd,
      last_updated,
      payment_date,
      proposal_owner,
      schedule_status,
      slug,
      status,
      id,
    } = this.props.main_data

    const { // Declare report_data elements to use in render()
      report_date,
      report_link,
    } = this.props.report_data[0]

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
        <div className="cardTitle" onClick={this.showModal}>
          <div className="proposalName">{title}</div>
          <div className="ownerName">proposed by <a id="owner link" target="" href={`/proposals?search=${proposal_owner}`} onClick={this.callEvent}>{proposal_owner}</a></div>
        </div>

        <div className="cardContentWrapper">

          <div className="cardPropertyDiv">
            <div className="cardPropertyTitle">
              First Date Paid:
            </div>
            <div className="cardPropertyItem" title={payment_date}>
              <span className="statusPropertyValue">{payment_date}</span>
            </div>
          </div>

          <div className="cardPropertyDiv">
            <div className="cardPropertyTitle">
              Status:
            </div>
            <div className="cardPropertyItem" title={status}>
              <span className="statusPropertyValue" value={status}>{status}</span>
            </div>
          </div>

          <div className="cardPropertyDiv">
            <div className="cardPropertyTitle">
              Budget Status:
            </div>
            <div className="cardPropertyItem" title={budget_status}>
              <span className="statusPropertyValue" value={budget_status}>{budget_status}</span>
            </div>
          </div>

          <div className="cardPropertyDiv">
            <div className="cardPropertyTitle">
              Schedule Status:
            </div>
            <div className="cardPropertyItem" title={schedule_status}>
              <span className="statusPropertyValue" value={schedule_status}>{schedule_status}</span>
            </div>
          </div>

          <div className="cardPropertyDiv">
            <div className="cardPropertyTitle">
              {completion_elem_type}
            </div>
            <div className="cardPropertyItem" title={completion_elem}>
              <span className="statusPropertyValue">{completion_elem}</span>
            </div>
          </div>

          <div className="cardPropertyDiv">
            <div className="cardPropertyTitle">
              Communication Status:
            </div>
            <div className="cardPropertyItem" title={comm_status}>
              <span className="statusPropertyValue" value={comm_status}>{comm_status}</span>
            </div>
          </div>

          <div className="cardPropertyDiv">
            <div className="cardPropertyTitle">
              Total funding received:
            </div>
            <div className="cardPropertyItem" title={funding_received_usd}>
              <span className="statusPropertyValue">&#36;{funding_received_usd}</span>
            </div>
          </div>

          <div className="cardPropertyDiv">
            <div className="cardPropertyTitle">
              Last updated:
            </div>
            <div className="cardPropertyItem" title={last_updated}>
              <span className="statusPropertyValue">{last_updated}</span>
            </div>
          </div>
          {
            typeof report_data=='undefined' ? (
              <div>
              <section className="reportLeftDiv">
                <div className="reportItem" >Something went wrong with the report data</div>
              </section>
              <section className="reportRightDiv">
              </section>
              </div>
              ) : (
                report_data == "No reports available" ? (
                  <div>
                  <section className="reportLeftDiv">
                    <div className="reportItem" >No reports available</div>
                  </section>
                  <section className="reportRightDiv">
                  </section>
                  </div>
                ) : (
                  <ReportsSection
                    key={`${id}_dropdown`}
                    report_data = {report_data}
                    id={id}
                  />
                 )
              )
          }


          <div className="linkItem" text-align="left">
            <a className="link" id="Dash Central Link" href={dclink} target="_blank" onClick={this.callEvent}>DASHCENTRAL LINK</a>
          </div>

          <div className="linkItem">
            <a className="link" id="Dash Watch Link" href={`/p/${slug}`} target="" onClick={this.callEvent}>DASH WATCH PAGE</a>
          </div>

          <div className="linkItem" text-align="right">
            <div className="link" type="button" onClick={this.showModal}>
              +show more
            </div>
          </div>

        </div>
        {modal}
      </div>
    )
  }
}

export default Post