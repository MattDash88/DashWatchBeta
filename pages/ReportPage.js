// This is a temporary page for January 2019 Testing
import fetch from 'isomorphic-unfetch';
import shortid from 'shortid';
import React from 'react';
import ReactGA from 'react-ga';
ReactGA.initialize('UA-132694074-1');

// Import other elements 
import ScrollButton from '../components/buttons/ScrollButton';  // Scroll to top button
import ModalFrame from '../components/modal/ModalFrame';
import ModalContent from '../components/temp/SimplifiedModalContent';

// Import css
import "../components/css/style.css";
import '../components/css/monthstyle.css';


var basepath = 'http://localhost:5000' 

// Function for Google analytics
const trackEvent = (event) => {
  ReactGA.event({
    category: 'Event',
    action: event,
  });
}

// Airtable query requesting data for the selected month, passed on to the month list page
const getMonthList = (month) => {
  return (
      new Promise((resolve) => {
          fetch(`${basepath}/api/get/fastmonth/${month}`)
          .then((res) => res.json()
            .then((res)=> {
              resolve(res.data)              
    }))
  })
  )
}

class Month extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      monthId: 'January 2019',
      monthListData: '',
    }

    // Bind functions used in class
    this.handleSelectMonth = this.handleSelectMonth.bind(this);
  }

  // Function initiated when a month list button is pressed, requests the data for that month from index.js
  handleSelectMonth(event) {
    event.preventDefault();
    this.setState({monthId: event.currentTarget.id})
    trackEvent('Changed Month')
  }

  componentDidMount() {     
    // Promise to get the initial "month list" records 
    Promise.resolve(getMonthList(this.state.monthId)).then(data => { 
      this.setState({ monthListData: data })
      
    }) 
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.monthId !== this.state.monthId) {
      Promise.resolve(getMonthList(this.state.monthId)).then(data => {
        this.setState({
          monthListData: data,
        })
      })
    }
  }

  render() {
    const { // Declare data arrays used in class
      monthListData,
      monthId,
    } = this.state
    
    if (!Array.isArray(monthListData)) {
      // Still loading Airtable data
      return (
        <p>Loading&hellip;</p>
      )
    } else {

    return ( 
      <main>
        <div className="menu">
        <nav className="menuContent">
            <li className="tempMenuItem"><img id="Logo" src="https://dashwatchbeta.org/Logo/logo_white20.png"></img></li>
            <li className="tempMenuItem"><a href="https://dashwatchbeta.org" target="https://dashwatchbeta.org" onClick={trackEvent('Opened Full Beta site')}>Full Dash Watch Beta Website</a></li>
          </nav>
            </div>
        <section className="pagewrapper">
      <div className="monthTab" id='November 2018' value={this.state.monthId == 'November 2018' ? "Active" : 
        "Inactive"} onClick={this.handleSelectMonth}><p className="monthTabText">November 2018</p></div>
      <div className="monthTab" id='December 2018' value={this.state.monthId == 'December 2018' ? "Active" : 
        "Inactive"} onClick={this.handleSelectMonth}><p className="monthTabText">December 2018</p></div>
      <div className="monthTab" id='January 2019' value={this.state.monthId == 'January 2019' ? "Active" : 
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
          monthListData={post}      // Elements for the Month report list     

        />
  )}
    </div>
    </section>
    <ScrollButton scrollStepInPx="125" delayInMs="16.66"/>
    </main>
  )
}
}
}

class MonthReportRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      show: false  // Visibility state of modal
    };

    // Binding functions in this class
    this.hideModal = this.hideModal.bind(this);
  }

  // Function to show modal
  showModal = () => {
    this.setState({ show: true });
    trackEvent('Opened Modal')
  };

  // Function to close modal
  hideModal = () => {
    this.setState({ show: false });
  };

  render() {
    const { // Declare grouped elements used in class
     list_data,
     main_data,
    } = this.props.monthListData

    // Code to generate report link
    let reportLink = null;
    if (list_data.report_status == "Pending") { // If report is pending show "Pending"
      reportLink = (
        <div className="monthItem">Pending</div>
      )
    } else {  // If report is published, show links to report and modal
      if (list_data.report_type == "Video") {
      reportLink = (
        <div className="monthItem"><div><a className="monthReportLink" href={list_data.report_link} target={list_data.report_link} title={list_data.report_link} onClick={trackEvent('Clicked Video Link')}>
         <img className="reportIcon" id="YouTube" src="https://dashwatchbeta.org/images/Video.png" height="20"></img> Video</a> / <span className="monthReportLink" type="button" onClick={this.showModal}>
        show more</span></div></div>
      )
      } else  {
        reportLink = (
          <div className="monthItem"><div><a className="monthReportLink" href={list_data.report_link} target={list_data.report_link} title={list_data.report_link} onClick={trackEvent('Clicked Report Link')}><img id="PDF" src="https://dashwatchbeta.org/images/PDF.png" height="20"></img> Report</a> / <span className="monthReportLink" type="button" onClick={this.showModal}>
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
           list_data={list_data}
           main_data={main_data}
                    
           // For functions
           show={this.state.show}   // Show modal or not
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
          <div className="monthItem"><a className="monthVoteLink" href={list_data.voting_dc_link} target={list_data.voting_dc_link} value={list_data.voting_status} title={list_data.voting_dc_link} onClick={trackEvent('Clicked Voting Link')}>{list_data.voting_status}</a>
          </div> 
          {modal}
      </div>
    )
  }
}

export default Month