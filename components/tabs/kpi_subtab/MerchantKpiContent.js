import React from 'react';
import '../../css/single.css';
import '../../css/style.css';

class MerchantKpiContent extends React.Component {
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
            total_integrated_full,
            integrated_month,
            total_single_full,  // Elements for independent businesses
            single_month,
            total_small_full,   // Element for small businesses
            small_month,
            total_medium_full,  // Element for medium businesses
            medium_month,
            total_large_full,   // Element for large businesses
            large_month,
            follow_ups,         // Follow-up metric
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
                <div className="subTabKpiHeader">Merchant KPIs</div>
                {note}
                <div className="subTabHeader">Merchant integrations</div>
                <div className="tabReportPerformancePropertyDiv1">
                    <div className="tabPerformancePropertyTitle1">
                        Total Merchants Integrated for Proposal Duration
                </div>
                    <div className="tabPerformancePropertyItem" title={total_integrated_full}>
                    <span className="performancePropertyValue" value={total_integrated_full}>{total_integrated_full}</span>
                    </div>
                </div>

                <div className="tabReportPerformancePropertyDiv1">
                    <div className="tabPerformancePropertyTitle1">
                        Total Merchants Integrated Newly for This Month
              </div>
                    <div className="tabPerformancePropertyItem" title={integrated_month}>
                    <span className="performancePropertyValue" value={integrated_month}>{integrated_month}</span>
                    </div>
                </div>

                <div className="subTabHeader">Merchant integrations by Type</div>
                <div className="tabReportPerformancePropertyDiv2">
                    <div className="tabPerformanceGroupTitle">
                        Single owner and operator (e.g. street vendor, craft vendor, etc.)
                    </div>
                    <div className="tabReportPerformancePropertySubDiv2" title={total_single_full}>
                        <span className="tabPerformancePropertyTitle2">Total for Proposal Duration</span><span className="tabPerformancePropertyItem" ><span className="performancePropertyValue" value={total_single_full}>{total_single_full}</span></span>
                    </div>
                    <div className="tabReportPerformancePropertySubDiv2" title={single_month}>
                        <span className="tabPerformancePropertyTitle2">New for This Month</span><span className="tabPerformancePropertyItem"><span className="performancePropertyValue" value={single_month}>{single_month}</span></span>
                    </div>
                </div>

                <div className="tabReportPerformancePropertyDiv2">
                    <div className="tabPerformanceGroupTitle">
                        Small independent merchant with more than 1 additional employees
                    </div>
                    <div className="tabReportPerformancePropertySubDiv2" title={total_small_full}>
                        <span className="tabPerformancePropertyTitle2">Total for Proposal Duration</span><span className="tabPerformancePropertyItem"><span className="performancePropertyValue" value={total_small_full}>{total_small_full}</span></span>
                    </div>
                    <div className="tabReportPerformancePropertySubDiv2" title={small_month}>
                        <span className="tabPerformancePropertyTitle2">New for This Month</span><span className="tabPerformancePropertyItem"><span className="performancePropertyValue" value={small_month}>{small_month}</span></span>
                    </div>
                </div>

                <div className="tabReportPerformancePropertyDiv2">
                    <div className="tabPerformanceGroupTitle">
                        Medium Businesses (approximately 15+ employees)
          </div>
                    <div className="tabReportPerformancePropertySubDiv2" title={total_medium_full}>
                        <span className="tabPerformancePropertyTitle2">Total for Proposal Duration</span><span className="tabPerformancePropertyItem"><span className="performancePropertyValue" value={total_medium_full}>{total_medium_full}</span></span>
                    </div>
                    <div className="tabReportPerformancePropertySubDiv2" title={medium_month}>
                        <span className="tabPerformancePropertyTitle2">New for This Month</span><span className="tabPerformancePropertyItem"><span className="performancePropertyValue" value={medium_month}>{medium_month}</span></span>
                    </div>
                </div>

                <div className="tabReportPerformancePropertyDiv2">
                    <div className="tabPerformanceGroupTitle">
                        Large businesses (approximately 100+ employees)
                    </div>
                    <div className="tabReportPerformancePropertySubDiv2" title={total_large_full}>
                        <span className="tabPerformancePropertyTitle2">Total for Proposal Duration</span><span className="tabPerformancePropertyItem"><span className="performancePropertyValue" value={total_large_full}>{total_large_full}</span></span>
                    </div>
                    <div className="tabReportPerformancePropertySubDiv2" title={large_month}>
                        <span className="tabPerformancePropertyTitle2">New for This Month</span><span className="tabPerformancePropertyItem"><span className="performancePropertyValue" value={large_month}>{large_month}</span></span>
                    </div>
                </div>

                <div className="subTabHeader">Merchant Follow-Ups</div>
                <div className="tabReportPerformancePropertyDiv3">
                    <div className="tabReportPerformancePropertySubDiv2" title={follow_ups}>
                        <span className="tabPerformancePropertyTitle2">Total for Proposal Duration</span><span className="tabPerformancePropertyItem"><span className="performancePropertyValue" value={follow_ups}>{follow_ups}</span></span>
                    </div>
                </div>
            </div >
        )
    }
}

export default MerchantKpiContent