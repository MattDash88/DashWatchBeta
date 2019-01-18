import React from 'react';

// Import tab elements
import TabMain from './tabs/TabMain'
import TabPerformance from './tabs/TabPerformance'
import TabFunding from './tabs/TabFunding'
import TabReports from './tabs/TabReports'

// Import css
import './css/style.css';
import './css/single.css';

class SinglePost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayTab: "TabMain"
    };
    this.handleTab = this.handleTab.bind(this);
  }

  // returns the corresponding Form based on currentMode
  handleTab(e) {
    this.setState({ displayTab: e.currentTarget.id })
  }

  render() {

    const {   // Declare grouped elements to pass on to the tabs    
      main_data,
      kpi_data,
      financial_data,
      report_data,
    } = this.props

    const { // Declare main_data elements that are used in the header
      proposal_owner,
      slug,
    } = this.props.main_data

    return (
      <div className="singlePageWrapper">
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
