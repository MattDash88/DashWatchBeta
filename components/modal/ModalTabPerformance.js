import React from 'react';

// Analytics
import {trackEvent} from '../functions/analytics';

// Import css
import '../css/style.css';
import '../css/modal.css';

class TabPerformance extends React.Component {
  constructor() {
    super();
    // Binding functions in this class
    this.callEvent = this.callEvent.bind(this);
  }

  // Google Analytics function to track User interaction on page
  callEvent(event) {
    trackEvent('Full Modal', 'Clicked ' + event.currentTarget.id)
  }
    
  render() {
      const {
        slug,
        openTab,
      } = this.props
  
      return (
        <div className="modalTabContent" value={openTab == "TabPerformance" ? "active" : "inactive"}>
        <div className="modalTabLink">
        <a className="link" id="directPerformanceLink" href={`/p/${slug}?tab=TabPerformance`} target="" onClick={this.callEvent}>Click here to see the Performance Data from the reports</a>
          </div>
      </div>
      )
    }
  }
  
  export default TabPerformance