import React from 'react';

// Import css
import '../css/style.css';
import '../css/modal.css';

class TabPerformance extends React.Component {
  constructor(props) {
    super(props);
    // Binding functions in this class
    this.showProposalPage = this.showProposalPage.bind(this);
  }

  showProposalPage(e) {
    e.preventDefault();
    this.props.handleProposalPage(e.currentTarget.id);
  }
    render() {
      const {
        slug,
      } = this.props

      const {   // Declare individual elements used in this class
        openTab,
      } = this.props
  
      return (
        <div className="modalTabContent" value={openTab == "TabPerformance" ? "active" : "inactive"}>
        <div className="modalTabLink">
            <div className="link" type="link" onClick={this.showProposalPage} id={slug}>Click here to see the Performance Data from the reports</div>
          </div>
      </div>
      )
    }
  }
  
  export default TabPerformance