import React from 'react';
import ReactGA from 'react-ga';
ReactGA.initialize('UA-132694074-1');

// Import tab elements
import TabMain from './tabs/TabMain'
import TabPerformance from './tabs/TabPerformance'
import TabFunding from './tabs/TabFunding'
import TabReports from './tabs/TabReports'

// Import css
import './css/style.css';
import './css/single.css';

// Track Event Google Analytics function
const trackEvent = (event) => {
  ReactGA.event({
    category: 'Single Page',
    action: event,
  });
}

class SinglePost extends React.Component {  
  constructor(props) {
    super(props);
    this.state = {
      displayTab: props.displayTab    // State for the opened tab
    };

    // Binding functions in this class
    this.backButton = this.backButton.bind(this);
    this.handleTab = this.handleTab.bind(this);
  }

  //Go back but don't reset querry
  backButton() {
    history.back();
    trackEvent('Clicked + event.currentTarget.id')
  }

  // Returns the corresponding Tab based on the selected button
  handleTab(event) {
    event.preventDefault()
    this.setState({ displayTab: event.currentTarget.id })
    trackEvent(`Changed Single Page Tab to ${event.currentTarget.id}`)
  }

  render() {
    const {   // Declare grouped elements to pass on to the tabs         
      main_data,
      kpi_data,
      financial_data,
      report_data,
    } = this.props

    if (typeof main_data == "undefined") {  // Still loading Airtable data  
      var cardTitle = (
        <div>
        </div>
      )
      var pageContent = (
        <section>
          Loading&hellip;
        </section>
      )      
    } else {         // Render content
      var cardTitle = (
        <div>
        <div className="proposalName">{main_data.slug}</div>
        <div className="ownerName">by {main_data.proposal_owner}</div>
        </div>
      )
      var pageContent = (
        <section>
          <TabMain
            main_data={main_data}
            openTab={this.state.displayTab}     // Determines tab content visibility  
          />
          <TabPerformance
            main_data={main_data}
            kpi_data={kpi_data}
            openTab={this.state.displayTab}      // Determines tab content visibility  
          />
          <TabFunding
            main_data={main_data}
            financial_data={financial_data}
            openTab={this.state.displayTab}     // Determines tab content visibility  
          />
          <TabReports
            report_data={report_data}
            openTab={this.state.displayTab}      // Determines tab content visibility        
          />
        </section>
      )      
    }   // End of pageContent if

    return (
      <div className="singlePageWrapper">
        <div className="backButtonDiv">
          <div className="backButton" id="backButton" type="link" onClick={this.backButton}><i></i> BACK</div>
        </div>
        <div className='singleCardWrapper'>
          <div className="singleCardTitle">
            {cardTitle}
          </div>
          <div className="tabWrapper">
            <button className="tabButton" title="Proposal_Details" id="TabMain" value={this.state.displayTab == "TabMain" ? "active" :
              "inactive"} onClick={this.handleTab}>Proposal Details</button>
            <button className="tabButton" title="Proposal_Details" id="TabPerformance" value={this.state.displayTab == "TabPerformance" ? "active" :
              "inactive"} onClick={this.handleTab}>Key Performance Indicators</button>
            <button className="tabButton" title="Proposal_Details" id="TabFunding" value={this.state.displayTab == "TabFunding" ? "active" :
              "inactive"} onClick={this.handleTab}>Funding and Expenses</button>
            <button className="tabButton" title="Proposal_Reports" id="TabReports" value={this.state.displayTab == "TabReports" ? "active" :
              "inactive"} onClick={this.handleTab}>Reports</button>
            <br></br>
          </div>
          {pageContent}
        </div>
      </div>
    );
  }
}

export default SinglePost