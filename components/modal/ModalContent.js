import React from 'react';

// Analytics
import {trackEvent} from '../functions/analytics';

// Import other elements 
import ModalTabMain from './ModalTabMain'
import ModalTabPerformance from './ModalTabPerformance'
import ModalTabFunding from './ModalTabFunding'
import ModalTabReports from './ModalTabReports'

// Import css
import '../css/style.css';
import '../css/modal.css'

class ModalContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          displayTab: "TabMain"
        };
        this.handleTab = this.handleTab.bind(this);
        this.handleClose = this.handleClose.bind(this);
      }

      // Returns the corresponding Tab based on the selected button
      handleTab(event) {
        event.preventDefault()
        this.setState({ displayTab: event.currentTarget.id })
        trackEvent('Full Modal', `Changed Modal Tab to ${event.currentTarget.id}`)                 // Track Event on Google Analytics
      }
    
      // Function to close the modal
     handleClose() {
      this.props.handleClose();
      trackEvent('Full Modal', 'Closed Modal Button')                 // Track Event on Google Analytics
    }
    
    // If user clicks outside modal area, run handleClose
    handleClick = (e) => {
      if (e.target.id == "outside")
      {
        this.props.handleClose()
      } 
    }

    componentDidMount() {      
      window.addEventListener('mousedown', this.handleClick);       // Event listener to check if user clicks outside of modal area
    }

    componentWillUnmount() {    
      window.removeEventListener('mousedown', this.handleClick);    // Stop event listener when modal is unloaded
    }

    render() {
        const { // Declare grouped elements passed on to sub tab 
        main_data,
        report_data, 
        } = this.props  
        
        const { // Declare main_data elements that are used in the modal header
          proposal_owner,
          slug,
        } = this.props.main_data
       
        return (   
          <div className="modalWrapper" id="Modal">
              <div className="modalCardTitle">
              <span className="modalTitleWrapper">
                <span className="modalProposalName">{slug}</span><span className="modalCloseButton" onClick={this.handleClose}>[ close ]</span>
                <div className="modalOwnerName">by {proposal_owner}</div>
              </span>
              
                
              </div>
              <div className="modalTabWrapper">
              <button className="modalTabButton" title="Proposal Details" id="TabMain" value={this.state.displayTab == "TabMain" ? "active" : 
          "inactive"} onClick={this.handleTab}>Proposal Details</button>
            <button className="modalTabButton" title="Key Performance Indicators" id="TabPerformance" value={this.state.displayTab == "TabPerformance" ? "active" : 
          "inactive"} onClick={this.handleTab}>Key Performance Indicators</button>
            <button className="modalTabButton" title="Funding and Expenses" id="TabFunding" value={this.state.displayTab == "TabFunding" ? "active" : 
          "inactive"} onClick={this.handleTab}>Funding and Expenses</button>
            <button className="modalTabButton" title="Reports" id="TabReports" value={this.state.displayTab == "TabReports" ? "active" : 
          "inactive"} onClick={this.handleTab}>Reports</button>
            <br></br>
              </div>
              <ModalTabMain
                main_data={main_data}
                openTab={this.state.displayTab}     // Determines tab content visibility  
              />
              <ModalTabPerformance
                slug={slug}
                openTab={this.state.displayTab}     // Determines tab content visibility  
              />
              <ModalTabFunding
                main_data={main_data}
                openTab={this.state.displayTab}     // Determines tab content visibility  
              />
              <ModalTabReports
                report_data={report_data}
                openTab={this.state.displayTab}     // Determines tab content visibility        
            />
          </div>
    
        );
      }
    }
  
  export default ModalContent