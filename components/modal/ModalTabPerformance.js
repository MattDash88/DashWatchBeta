import React from 'react';
import ReactGA from 'react-ga';

// Analytics
import getGAKey from '../functions/analytics';
ReactGA.initialize(getGAKey);

// Import css
import '../css/style.css';
import '../css/modal.css';

const trackEvent = (event) => {
  ReactGA.event({
      category: 'Full Modal',
      action: event,
  });
}

class TabPerformance extends React.Component {
  constructor(props) {
    super(props);
    // Binding functions in this class
    this.callEvent = this.callEvent.bind(this);
  }

  // Google Analytics function to track User interaction on page
  callEvent(event) {
    trackEvent('clicked ' + event.currentTarget.id)
  }
    
  render() {
      const {
        slug,
        openTab,
      } = this.props
  
      return (
        <div className="modalTabContent" value={openTab == "TabPerformance" ? "active" : "inactive"}>
        <div className="modalTabLink">
            <a className="link" href={`/p/${slug}?tab=TabPerformance`} target="" id="directPerformanceLink" onClick={this.callEvent}>Click here to see the Performance Data from the reports</a>
          </div>
      </div>
      )
    }
  }
  
  export default TabPerformance