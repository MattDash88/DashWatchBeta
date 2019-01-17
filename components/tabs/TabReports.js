import React from 'react';
import shortid from 'shortid';
import '../css/single.css';
import '../css/style.css';

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
                            key={shortid.generate()}
                            report_data={post}
                        />
                    )}
                </div>
            </div>
        )}
    }
}

class ReportDiv extends React.Component {
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
                <a className="tabReportLink" link href={report_link} target={report_link}>{report_name}</a></span><br></br>
            </div>
        )
    }
}

export default TabReports