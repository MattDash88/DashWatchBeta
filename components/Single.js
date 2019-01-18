import React from 'react';
import ReactGA from 'react-ga';

// Import tab elements
import TabMain from './tabs/TabMain'
import TabPerformance from './tabs/TabPerformance'
import TabFunding from './tabs/TabFunding'
import TabReports from './tabs/TabReports'

// Import css
import './css/style.css';
import './css/single.css';

const trackPage = (page) => {
  console.log(page)
  ReactGA.initialize('UA-132694074-1', { debug: true });
  ReactGA.event({
    category: 'Tab',
    action: 'Changed tab',
  });
}

class SinglePost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayTab: ""    // State for the opened tab
    };

    // Binding functions in this class
    this.backButton = this.backButton.bind(this);
    this.handleTab = this.handleTab.bind(this);
  }

  //Go back but don't reset querry
  backButton(e) {
    e.preventDefault();
    this.props.getBack();
  }

  // Returns the corresponding Tab based on the selected button
  handleTab(e) {
    this.setState({ displayTab: e.currentTarget.id })
    trackPage('test')
  }

  

  render() {
    const {   // Declare grouped elements to pass on to the tabs         
      main_data,
      kpi_data,
      financial_data,
      report_data,
    
      // Functions
      showTab,      
    } = this.props

    const { // Declare main_data elements that are used in the header
      proposal_owner,
      slug,
    } = this.props.main_data

    if (this.state.displayTab == "") {
      this.setState({ displayTab: this.props.showTab })
    }

    return (              
      <div className="singlePageWrapper">
      <div className="backButtonDiv">
            <div className="backButton" type="link" onClick={this.backButton}><i></i> BACK</div>
      </div>
          <div className='singleCardWrapper'> 
          <div className="singleCardTitle">
            <div className="proposalName">{slug}</div>
            <div className="ownerName">by {proposal_owner}</div>
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
          <TabMain
            main_data={main_data}
            openTab={this.state.displayTab}     // Determines tab content visibility  
          />
          <TabPerformance
            main_data={main_data}
            kpi_data={kpi_data}
            openTab={this.state.displayTab}     // Determines tab content visibility  
          />
          <TabFunding
            main_data={main_data}
            financial_data={financial_data}
            openTab={this.state.displayTab}     // Determines tab content visibility  
          />
          <TabReports
            report_data={report_data}   
            openTab={this.state.displayTab}     // Determines tab content visibility        
        />
        </div>
      </div>

    );
  }
}

export default SinglePost