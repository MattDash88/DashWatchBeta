import React from 'react';

// Analytics
import {trackEvent} from '../functions/analytics';

// Import css
import '../css/style.css';
import '../css/single.css';
import '../css/status_styling.css';

class TabReports extends React.Component {
    
    render() {
        const { // Declare grouped elements used in reports tab 
            report_data,
            openTab,
        } = this.props

        // Code that either returns a row of tabs or nothing depending on whether funding data is available or not
        if (report_data[0].report_link == "N/A") {  // If there is no report available, show message
            return (
                <div className="tabContent" value={openTab == "TabReports" ? "active" : "inactive"}>
                    <div className="tabHeader">Dash Watch Reports:</div>
                    <div className="tabProposalText">No Reports available</div>
                </div>
            )
        } else {    // If there are reports run this
            return (
                <div className="tabContent" value={openTab == "TabReports" ? "active" : "inactive"}>
                    <div className="tabHeader">Dash Watch Reports:</div>
                    <div className="tabLinkDiv">
                        {report_data.map((post) =>
                            <ReportDiv
                                key={`${post.report_ref}_report`}
                                report_data={post}
                            />
                        )}
                    </div>
                </div>
            )
        }
    }
}

class ReportDiv extends React.Component {
    constructor(props) {
        super(props);
        // Binding functions in this class
        this.callEvent = this.callEvent.bind(this);
    }
    // Google Analytics function to track User interaction on page
    callEvent(event) {
        trackEvent('Single Page', 'clicked ' + event.currentTarget.id)
    }
    
    render() {
        const { // Declare elements used in the ReportDiv Class  
            report_name,
            report_date,
            report_link,
        } = this.props.report_data

        return (
            <div>
                <span className="tabLinkTitle">{report_date}:</span>
                <span className="tabReportLink">
                    <a className="tabReportLink" id="ReportLink" href={report_link} target="_blank" onClick={this.callEvent}>{report_name}</a></span><br></br>
            </div>
        )
    }
}

export default TabReports