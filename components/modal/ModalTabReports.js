import React from 'react';

// Import css
import '../css/style.css';
import '../css/modal.css';

class ModalTabReports extends React.Component {
    render() {
        const { // Declare grouped elements to pass on to ReportDiv   
            report_data,
            openTab,
        } = this.props

        if (report_data[0].report_link == "N/A") {  // If there is no report available, show message
            return (
                <div className="modalTabContent" value={openTab == "TabReports" ? "active" : "inactive"}>
                    <div className="modalHeader">Dash Watch Reports:</div>
                    <div className="modalProposalText">No Reports available</div>
                </div>
            )
        } else {
            return (
                // Return a row of items per report
                <div className="modalTabContent" value={openTab == "TabReports" ? "active" : "inactive"}>
                    <div className="modalHeader">Dash Watch Reports:</div>
                    <div className="modalLinkDiv">
                        {report_data.map((post) =>
                            <ReportDiv
                                key={post.report_ref}
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
    render() {
        const {     // Declare single elements used in this Modal tab   
            report_name,
            report_date,
            report_link,
        } = this.props.report_data

        return (
            <main>
                <div className="modalLinkTitle">{report_date}:</div>
                <span className="modalReportLink">
                <a className="link" href={report_link} target={report_link}>{report_name}</a></span><br></br>
            </main>
        )
    }
}

export default ModalTabReports