import React from 'react';
import '../../css/single.css';
import '../../css/style.css';

class PublicRelationsKpiContent extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        const {
            report_date,
            report_tab
        } = this.props

        const { // Declare kpi metrics sub elements used in this class
            kpi_note,
            total_published,
            traditional_print,
            web,
            television,
            radio,
            podcast,
            dash_force,
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
                <div className="subTabKpiHeader">Public Relations Performance</div>
                {note}
                <div className="tabSocialPerformanceDiv">
                    <div className="tabSocialPropertyTitle">
                        Total Dash Interviews/Articles published this month by reporting organizations
                </div>
                    <div className="tabPerformancePropertyItem" title={total_published}>
                    <span className="performancePropertyValue" value={total_published}>{total_published}</span>
                    </div>
                </div>

                <div className="subTabHeader">
                    Number of Interviews/Dash Articles by type
              </div>
                <div className="tabSocialPerformanceDiv">
                    <div className="tabSocialPropertyTitle">
                        Traditional Print
                </div>
                    <div className="tabPerformancePropertyItem" title={traditional_print}>
                    <span className="performancePropertyValue" value={traditional_print}>{traditional_print}</span>
                    </div>
                </div>

                <div className="tabSocialPerformanceDiv">
                    <div className="tabSocialPropertyTitle">
                        Web Published
                </div>
                    <div className="tabPerformancePropertyItem" title={web}>
                    <span className="performancePropertyValue" value={web}>{web}</span>
                    </div>
                </div>

                <div className="tabSocialPerformanceDiv">
                    <div className="tabSocialPropertyTitle">
                        Television
                </div>
                    <div className="tabPerformancePropertyItem" title={television}>
                    <span className="performancePropertyValue" value={television}>{television}</span>
                    </div>
                </div>

                <div className="tabSocialPerformanceDiv">
                    <div className="tabSocialPropertyTitle">
                        Radio
                </div>
                    <div className="tabPerformancePropertyItem" title={radio}>
                    <span className="performancePropertyValue" value={radio}>{radio}</span>
                    </div>
                </div>

                <div className="tabSocialPerformanceDiv">
                    <div className="tabSocialPropertyTitle">
                        Podcast
                </div>
                    <div className="tabPerformancePropertyItem" title={podcast}>
                    <span className="performancePropertyValue" value={podcast}>{podcast}</span>
                    </div>
                </div>

                <div className="tabSocialPerformanceDiv">
                    <div className="tabSocialPropertyTitle">
                        Dash News
                </div>
                    <div className="tabPerformancePropertyItem" title={dash_force}>
                    <span className="performancePropertyValue" value={dash_force}>{dash_force}</span>
                    </div>
                </div>

            </div >
        )
    }
}

export default PublicRelationsKpiContent