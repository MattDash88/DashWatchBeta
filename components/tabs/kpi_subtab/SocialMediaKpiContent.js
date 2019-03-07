import React from 'react';
import '../../css/style.css';
import '../../css/single.css';
import '../../css/status_styling.css';

class SocialMediaKpiContent extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        const { // Declare elements used in this class
            report_date,
            report_tab
        } = this.props

        const { // Declare kpi metrics sub elements used in this class
            kpi_note,
            platform_name,
            total_subscribers,
            new_subscribers,
            new_comments,
            new_likes,
        } = this.props.kpi_metrics

        // Only shows a note when there is one
        let note = null;
        if (kpi_note == "No note") {
            note = (
                <p></p>
            )
        } else {
            note = (
                <div className="subTabNoteText">KPI note: {kpi_note}</div>
            )
        }

        return (
            <div className="reportTab" value={report_tab == report_date ? "Active" :
          "Inactive"}>
                <div className="tabSocialPerformanceWrapper">
                    <div className="subTabKpiHeader">{platform_name}</div>
                    {note}
                    <div className="tabSocialPerformanceDiv">
                        <div className="tabSocialPropertyTitle">
                            Total Subscribers
                    </div>
                        <div className="tabPerformancePropertyItem" title={total_subscribers}>
                        <span className="performancePropertyValue" value={total_subscribers}>{total_subscribers}</span>
                        </div>
                    </div>
                    <div className="tabSocialPerformanceDiv">
                        <div className="tabSocialPropertyTitle">
                            New Subscribers for This Month
                    </div>
                        <div className="tabPerformancePropertyItem" title={new_subscribers}>
                        <span className="performancePropertyValue" value={new_subscribers}>{new_subscribers}</span>
                        </div>
                    </div>
                    <div className="tabSocialPerformanceDiv">
                        <div className="tabSocialPropertyTitle">
                            New Comments for This Month
              </div>
                        <div className="tabPerformancePropertyItem" title={new_comments}>
                        <span className="performancePropertyValue" value={new_comments}>{new_comments}</span>
                        </div>
                    </div>
                    <div className="tabSocialPerformanceDiv">
                        <div className="tabSocialPropertyTitle">
                            New Likes for This Month
              </div>
                        <div className="tabPerformancePropertyItem" title={new_likes}>
                        <span className="performancePropertyValue" value={new_likes}>{new_likes}</span>
                        </div>

                    </div>
                </div>

            </div>
        )
    }
}

export default SocialMediaKpiContent