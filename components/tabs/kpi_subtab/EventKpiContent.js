import React from 'react';
import '../../css/single.css';
import '../../css/style.css';

class EventKpiContent extends React.Component {
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
            consumer_meetups,
            merchant_meetups,
            media_meetups,
            new_wallets,          // Elements for consumer meetups
            attendees,
            new_merchant_leads,   // Elements for merchant meetups
            new_merchant_integrated,
            media_attention,      // Elements for media meetups
            number_journalists,
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
                <div className="subTabKpiHeader">Event KPIs</div>
                {note}
                <div className="subTabHeader">Event/Meetup Performance</div>
                <div className="tabReportPerformancePropertyDiv1">
                    <div className="tabPerformancePropertyTitle1">
                        Consumer Focused Meetups This Month
                    </div>
                    <div className="tabPerformancePropertyItem" title={consumer_meetups}>
                        <span className="performancePropertyValue" value={consumer_meetups}>{consumer_meetups}</span>
                    </div>
                </div>

                <div className="tabReportPerformancePropertyDiv1">
                    <div className="tabPerformancePropertyTitle1">
                        Merchant Focused Meetups This Month
                    </div>
                    <div className="tabPerformancePropertyItem" title={merchant_meetups}>
                    <span className="performancePropertyValue" value={merchant_meetups}>{merchant_meetups}</span>
                    </div>
                </div>

                <div className="tabReportPerformancePropertyDiv1">
                    <div className="tabPerformancePropertyTitle1">
                        Media Focused Meetups This Month
                    </div>
                    <div className="tabPerformancePropertyItem" title={media_meetups}>
                    <span className="performancePropertyValue" value={media_meetups}>{media_meetups}</span>
                    </div>
                </div>

                <div className="tabReportPerformancePropertyDiv2">
                    <div className="tabPerformanceGroupTitle">
                        Consumer Event KPIs
                    </div>
                    <div className="tabReportPerformancePropertySubDiv2" title={new_wallets}>
                        <span className="tabPerformancePropertyTitle2">New Wallets Created This Month</span><span className="tabPerformancePropertyItem"><span className="performancePropertyValue" value={new_wallets}>{new_wallets}</span></span>
                    </div>
                    <div className="tabReportPerformancePropertySubDiv2" title={attendees}>
                        <span className="tabPerformancePropertyTitle2">Total Attendees This Month</span><span className="tabPerformancePropertyItem"><span className="performancePropertyValue" value={attendees}>{attendees}</span></span>
                    </div>
                </div>

                <div className="tabReportPerformancePropertyDiv2">
                    <div className="tabPerformanceGroupTitle">
                        Merchant Event KPIs
                    </div>
                    <div className="tabReportPerformancePropertySubDiv2" title={new_merchant_leads}>
                        <span className="tabPerformancePropertyTitle2">Total for Proposal Duration</span><span className="tabPerformancePropertyItem"><span className="performancePropertyValue" value={new_merchant_leads}>{new_merchant_leads}</span></span>
                    </div>
                    <div className="tabReportPerformancePropertySubDiv2" title={new_merchant_integrated}>
                        <span className="tabPerformancePropertyTitle2">New for This Month</span><span className="tabPerformancePropertyItem"><span className="performancePropertyValue" value={new_merchant_integrated}>{new_merchant_integrated}</span></span>
                    </div>
                </div>

                <div className="tabReportPerformancePropertyDiv2">
                    <div className="tabPerformanceGroupTitle">
                        Media Event KPIs
                    </div>
                    <div className="tabReportPerformancePropertySubDiv2" title={media_attention}>
                        <span className="tabPerformancePropertyTitle2">Total for Proposal Duration</span><span className="tabPerformancePropertyItem"><span className="performancePropertyValue" value={media_attention}>{media_attention}</span></span>
                    </div>
                    <div className="tabReportPerformancePropertySubDiv2" title={number_journalists}>
                        <span className="tabPerformancePropertyTitle2">New for This Month</span><span className="tabPerformancePropertyItem"><span className="performancePropertyValue" value={new_merchant_integrated}>{number_journalists}</span></span>
                    </div>
                </div>
            </div >
        )
    }
}

export default EventKpiContent