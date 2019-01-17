import shortid from 'shortid';
import React from 'react';

// Import css
import './css/style.css';
import './css/monthstyle.css';

// Import other elements 
import ModalFrame from './modal/ModalFrame';
import ModalContent from './modal/ModalContent';

class MonthPage extends React.Component {
  constructor(props) {
    super(props);

    // Bind functions used in class
    this.handleProposalPage = this.handleProposalPage.bind(this);
    this.handleSelectMonth = this.handleSelectMonth.bind(this);
  }
  
  // Pass on single proposal click to Home, the page can be accessed from the Modal
  handleProposalPage(slug, openTab) {
    this.props.getProposalID(slug, openTab)
  } 

  // Function initiated when a month list button is pressed, requests the data for that month from index.js
  handleSelectMonth(event) {
    event.preventDefault();
    this.props.getMonthId(event.currentTarget.id)
  }

  render() {
    const { // Declare data arrays used in class
      monthListData,
      monthId,
    } = this.props
    
    return ( 
      <main>
      <div className="monthTab" id='November 2018' value={monthId == 'November 2018' ? "Active" : 
        "Inactive"} onClick={this.handleSelectMonth}><p className="monthTabText">November 2018</p></div>
      <div className="monthTab" id='December 2018' value={monthId == 'December 2018' ? "Active" : 
        "Inactive"} onClick={this.handleSelectMonth}><p className="monthTabText">December 2018</p></div>
      <div className="monthTab" id='January 2019' value={monthId == 'January 2019' ? "Active" : 
        "Inactive"} onClick={this.handleSelectMonth}><p className="monthTabText">January 2019</p></div>
      <div className="monthPageWrapper">
      <h1 className="monthHeader">Dash Watch {monthId} Reports</h1>
      <p>This is a live table and will be updated with additional reports in the upcoming days.</p>
      <div className="monthIndexWrapper">
        <div className="monthIndexItem"><p className="monthColumnTitle">Proposal</p></div>
        <div className="monthIndexItem"><p className="monthColumnTitle">Report Link</p></div>
        <div className="monthIndexItem"><p className="monthColumnTitle">Proposal Type</p></div>
        <div className="monthIndexItem"><p className="monthColumnTitle">Voting Status</p></div>    
    </div>
      {monthListData.map((post) =>
        <MonthReportRow
          key={shortid.generate()}
          list_data={post.list_data}      // Elements for the Month report list
          main_data={post.main_data}      // Elements for the main proposal tab
          report_data={post.report_data}  // Elements for the report tab       

          // For handling functions
          getProposalID={this.handleProposalPage}   // Pass on requested single proposal page
        />
  )}
    </div>
    </main>
  )}
}

class MonthReportRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      show: false  // Visibility state of modal
    };

    // Binding functions in this class
    this.handleProposalPage = this.handleProposalPage.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }

  // Function that initiates the single page call if selected from Modal
  handleProposalPage(slug, openTab) {
    this.props.getProposalID(slug, openTab);
  }

  // Function to show modal
  showModal = () => {
    this.setState({ show: true });
  };

  // Function to close modal
  hideModal = () => {
    this.setState({ show: false });
  };

  render() {
    const { // Declare grouped elements used in class
     list_data,
     main_data,
     report_data,
    } = this.props

    // Code to generate report link
    let reportLink = null;
    if (list_data.report_status == "Pending") { // If report is pending show "Pending"
      reportLink = (
        <div className="monthItem">Pending</div>
      )
    } else {  // If report is published, show links to report and modal
      if (list_data.report_type == "Video") {
      reportLink = (
        <div className="monthItem"><div><a className="monthReportLink" href={list_data.report_link} target={list_data.report_link} title={list_data.report_link}>
         <img className="reportIcon" id="YouTube" src="https://dashwatchbeta.org/images/Video.png" height="20"></img> Video</a> / <span className="monthReportLink" type="button" onClick={this.showModal}>
        show more</span></div></div>
      )
      } else  {
        reportLink = (
          <div className="monthItem"><div><a className="monthReportLink" href={list_data.report_link} target={list_data.report_link} title={list_data.report_link}><img id="PDF" src="https://dashwatchbeta.org/images/PDF.png" height="20"></img> Report</a> / <span className="monthReportLink" type="button" onClick={this.showModal}>
          show more</span></div></div>
        )
      }
    } // End of report status if

    // Code to generate Modal or not
    let modal = null;
    if ( this.state.show == true) {   // Show modal
        modal = (
         <div><ModalFrame
         show={this.state.show}
       >
         <ModalContent
           key={shortid.generate()}

           // Group data elements passed on to Modal
           main_data={main_data}
           report_data={report_data}
                    
           // For functions
           show={this.state.show}   // Show modal or not
           handleProposalPage={this.handleProposalPage}   // Function to go to proposal page
           handleClose={this.hideModal} // Function to close modal
         />
       </ModalFrame></div> 
        )} else {   // Show nothing
          modal = (
          <div></div>
          )
        }
    
    // Output for the month list rows
    return (
      <div className="monthProposalWrapper">
          <div className="monthItemTitle" onClick={this.showModal}><p className="monthProposalName">{list_data.project_name}</p>
          <p className="monthOwnerName">by {main_data.proposal_owner}</p></div>
          {reportLink}
          <div className="monthItem" onClick={this.showModal}><p className="monthProposalType" value={list_data.proposal_type}>{list_data.proposal_type}</p></div>
          <div className="monthItem"><a className="monthVoteLink" href={list_data.voting_dc_link} target={list_data.voting_dc_link} value={list_data.voting_status} title={list_data.voting_dc_link}>{list_data.voting_status}</a>
          </div> 
          {modal}
      </div>
    )
  }
}

export default MonthPage