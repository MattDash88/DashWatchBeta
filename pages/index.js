import fetch from 'isomorphic-unfetch';
import React from 'react';

// Analytics
import {trackPage, trackEvent} from '../components/functions/analytics';

// Import pages

// Import css
import "../components/css/style.css";
import "../components/css/monthstyle.css";
import '../components/css/simplified_modal.css';
import "../components/css/status_styling.css";

// Import other elements 
import Header from '../components/headers/IndexHeader';
import ScrollButton from '../components/elements/ScrollButton';  // Scroll to top button
import NavBar from "../components/elements/NavBar"
import ModalFrame from '../components/modal/ModalFrame';
import ModalContent from '../components/modal/SimplifiedModalContent';

// API query requesting Report List data
const getMonthList = () => {
    return (
        new Promise((resolve) => {
            fetch(`/api/get/monthlist`)
                .then((res) => res.json()
                    .then((res) => {
                        resolve(res.data)
                    })
                )
        })
    )
}

class Month extends React.Component {
    static async getInitialProps(ctx) {
        const props = {
            month: typeof ctx.query.month == "undefined" ? "Sep20" : ctx.query.month,   // Default no query month to latest
            url: ctx.pathname,
            as: ctx.asPath,
        }
        return props
    }

    constructor(props) {
        super(props);

        this.state = {
            monthId: props.month,
            monthListData: '',
            optOutListData: '',
            url: '/reportlist',
            as: props.as,
        }

        // Bind functions used in class
        this.handleSelectMonth = this.handleSelectMonth.bind(this);
        this.callEvent = this.callEvent.bind(this);
    }

    // Function initiated when a month list button is pressed
    handleSelectMonth(event) {
        event.preventDefault();
        this.setState({
            monthId: event.currentTarget.id,        // Change state to load different month
            as: `/reportlist?month=${event.currentTarget.id}`,
        })

        history.pushState(this.state, '', `/reportlist?month=${event.currentTarget.id}`)   // Push State to history
        trackEvent('Reports Page', 'Changed Month')                 // Track Event on Google Analytics    
    }

    // Google Analytics function to track User interaction on page
    callEvent(event) {
        event.preventDefault();
        trackEvent('Reports Page','clicked ' + event.currentTarget.className)
    }

    componentDidMount() {
        // To handle calls from history (forward and back buttons)
        onpopstate = event => {
            if (event.state) {
                this.setState(event.state)
            }
        }
       
        trackPage(`/reports`)   // Track Pageview in Analytics

        // Promise to get the initial "month list" records 
        Promise.resolve(getMonthList()).then(data => {
            this.setState({
                monthListData: data.report_list,
                optOutListData: data.opted_out_list,
            })
        }).then(history.replaceState(this.state, '', `${this.state.as}`))
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.monthId !== this.state.monthId) {// Just a history state update because it doesn't always work as desired in functions
            history.replaceState(this.state, '', `${this.state.as}`)
        }
    }

    render() {
        const { // Declare data arrays used in class
            monthListData,
            optOutListData,
            monthId,
        } = this.state

        let monthText
        if (monthId == "Jun20") {
            monthText = "Dash Watch June 2020 Reports"
        } else if (monthId == "Jul20") {
            monthText = "Dash Watch July 2020 Reports"
        } else if (monthId == "Aug20") {
            monthText = "Dash Watch August 2020 Reports"
        } else if (monthId == "Sep20") {
            monthText = "Dash Watch September 2020 Reports"
        } else  {
            monthText = "Please select a month tab to view reports"
        }

        if (!Array.isArray(monthListData)) {
            var pageContent = (
                <div>
                    <p>Loading&hellip;</p>
                </div>
            )
        } else {
            var pageContent = (
                <div>
                    {monthListData.map((post) =>
                        <MonthReportRow                       
                            key={`${post.list_data.id}`}
                            monthListData={post}      // Elements for the Month report list     
                            showMonth={this.state.monthId}
                        />
                    )}
                    <section id="optOutDiv">
                        <h1 className="optOutHeader">Proposal teams opted out of Dash Watch reporting</h1>
                        {optOutListData.map((post2) =>
                            <OptOutRow
                                key={`${post2.list_data.id}`}
                                optOutListData={post2}      // Elements for the Month report list  
                                showMonth={this.state.monthId}   
                            />
                        )}
                    </section>
                </div>
            )
        }

        // Still loading Airtable data
        return (
            <main>
                <Header></Header>
                <NavBar
                    showPage="reports"
                />
                <section className="pagewrapper">
                    <div className="monthTab" id='Jun20' value={this.state.monthId == 'Jun20' ? "Active" :
                        "Inactive"} onClick={this.handleSelectMonth}><p className="monthTabText">June 2020</p></div>
                    <div className="monthTab" id='Jul20' value={this.state.monthId == 'Jul20' ? "Active" :
                        "Inactive"} onClick={this.handleSelectMonth}><p className="monthTabText">July 2020</p></div>
                        <div className="monthTab" id='Aug20' value={this.state.monthId == 'Aug20' ? "Active" :
                        "Inactive"} onClick={this.handleSelectMonth}><p className="monthTabText">August 2020</p></div>
                    <div className="monthTab" id='Sep20' value={this.state.monthId == 'Sep20' ? "Active" :
                        "Inactive"} onClick={this.handleSelectMonth}><p className="monthTabText">September 2020</p></div>
                    <div className="monthPageWrapper">
                        <div className="monthHeaderWrapper">
                            <a className="reportPageLink" id="oldReports" href="/oldreports"><i id="oldReports"></i>Older Reports</a>
                            <div className="monthHeader">{monthText}</div>
                        </div>
                        {this.state.monthId == 'Feb20' && <div className='monthTabMessage'>
                            <p>The new Labs section is now live <a className="reportPageLink" id="labs" href="/labs">link here</a>. Please, check it out and let us know what you think.</p>
                        </div>}

                        {this.state.monthId!=='Aug19' && <section>
                        <div className="monthIndexWrapper">
                            <div className="monthIndexItem" id="proposalColumn"><p className="monthColumnTitle">Proposal</p></div>
                            <div className="monthIndexItem" id="reportsColumn"><p className="monthColumnTitle">Report Link</p></div>
                            <div className="monthIndexItem"><p className="monthColumnTitle">Proposal Type</p></div>
                            <div className="monthIndexItem"><p className="monthColumnTitle">Voting Status</p></div>
                        </div>
                        {pageContent}
                        </section>}
                        <div className="monthBottomDiv">
                            <div className="monthSubHeader">Questions, Comments, Concerns? Contact Us</div>
                            E-mail: <a href="mailto:team@dashwatch.org" target="mailto:team@dashwatch.org">team@dashwatch.org</a><br></br>
                            DashWatchTeam#5277 Discord<br></br>
                            Dash-AI#1455 Discord<br></br>
                            MattDash#6481 Discord (This web page)<br></br>
                            paragon#2778 Discord<br></br>
                            Twitter: <a href="https://twitter.com/DashWatch" target="_blank">@DashWatch</a>
                        </div>
                    </div>
                </section>
                <ScrollButton scrollStepInPx="125" delayInMs="16.66" />
                <section className="pagewrapper">
                </section>
            </main>
        )

    }
}

// Component for Report List Table
class MonthReportRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false  // Visibility state of modal
        };

        // Binding functions in this class
        this.hideModal = this.hideModal.bind(this);
        this.callEvent = this.callEvent.bind(this);
    }

    // Function to show modal
    showModal = () => {
        this.setState({ show: true });
        trackEvent('Reports Page','Opened Modal')
    };

    // Function to close modal
    hideModal = () => {
        this.setState({ show: false });
    };

    callEvent(event) {
        trackEvent('Reports Page','clicked ' + event.currentTarget.className)
    }

    render() {
        const { // Declare grouped elements used in class
            showMonth,
        } = this.props

        const { // Declare grouped elements used in class
            list_data,
            main_data,
        } = this.props.monthListData

        // Code to generate report link
        let reportLink = null;
        if (list_data.report_status == "Pending") { // If report is pending show "Pending"
            reportLink = (
                <div className="monthItem" id="reportsColumn">Pending</div>
            )
        } else {  // If report is published, show links to report and modal
            if (list_data.entry_type == "Video") {
                reportLink = (
                    <div className="monthItem" id="reportsColumn"><div><a className="monthReportLink" href={list_data.report_link} target="_blank" title={list_data.report_link} onClick={this.callEvent}>
                        <img className="reportIcon" id="YouTube" src="/static/images/Video.png" height="30"></img> Video</a></div></div>
                )
            } else if (list_data.entry_type == "Podcast") {
                reportLink = (
                    <div className="monthItem" id="reportsColumn"><div><a className="monthReportLink" href={list_data.report_link} target="_blank" title={list_data.report_link} onClick={this.callEvent}>
                        <img className="reportIcon" id="Podcast" src="/static/images/Podcast.png" height="30"></img> Podcast</a></div></div>
                )
            } else {
                reportLink = (                    
                    <div className="monthItem" id="reportsColumn">
                        <div>
                            <a className="monthReportLink" href={list_data.report_link} target="_blank" title={list_data.report_link} onClick={this.callEvent}><img id="PDF" src="/static/images/PDF.png" height="30"></img> Report</a> 
                        </div>
                    </div>
                )
            }
        } // End of report status if

        // Code to generate Modal or not
        let modal = null;
        if (this.state.show == true) {   // Show modal
            modal = (
                <div><ModalFrame
                    show={this.state.show}
                >
                    <ModalContent
                        key={main_data.id}

                        // Group data elements passed on to Modal
                        list_data={list_data}
                        main_data={main_data}

                        // For functions
                        show={this.state.show}   // Show modal or not
                        handleClose={this.hideModal} // Function to close modal
                        reportLink={reportLink}
                    />
                </ModalFrame></div>
            )
        } else {   // Show nothing
            modal = (
                <div></div>
            )
        }

        // Output for the month list rows
        return (
            <div className="monthProposalWrapper" month={this.props.showMonth == list_data.published_month ? "Active" :
            "Inactive"} response={list_data.response_status == "No" ? "No" :
            "Yes"}>
                <div className="monthItem" id="proposalColumn" onClick={this.showModal}><p className="monthProposalName">{list_data.project_name}</p>
                    <p className="monthOwnerName">by {main_data.proposal_owner}</p></div>
                {reportLink}
                <div className="monthItem" onClick={this.showModal}><p className="monthProposalType" value={list_data.proposal_type}>{list_data.proposal_type}</p></div>
                <div className="monthItem"><a className="monthVoteLink" href={list_data.voting_dc_link} target="_blank" value={list_data.voting_status} title={list_data.voting_dc_link} onClick={this.callEvent}>{list_data.voting_status}</a>
                </div>
                {modal}
            </div>
        )
    }
}

// Component for Opted-out Table
class OptOutRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false  // Visibility state of modal
        };

        // Binding functions in this class
        this.hideModal = this.hideModal.bind(this);
        this.callEvent = this.callEvent.bind(this);
    }

    // Function to show modal
    showModal = () => {
        this.setState({ show: true });
        trackEvent('Reports Page','Opened Modal')
    };

    // Function to close modal
    hideModal = () => {
        this.setState({ show: false });
    };

    callEvent(event) {
        trackEvent('Reports Page','clicked ' + event.currentTarget.className)
    }

    render() {
        const { // Declare grouped elements used in class
            showMonth,
        } = this.props

        const { // Declare grouped elements used in class
            list_data,
            main_data,
        } = this.props.optOutListData

        // Code to generate Modal or not
        let modal = null;
        if (this.state.show == true) {   // Show modal
            modal = (
                <div><ModalFrame
                    show={this.state.show}
                >
                    <ModalContent
                        key={main_data.id}

                        // Group data elements passed on to Modal
                        list_data={list_data}
                        main_data={main_data}

                        // For functions
                        show={this.state.show}   // Show modal or not
                        handleClose={this.hideModal} // Function to close modal
                    />
                </ModalFrame></div>
            )
        } else {   // Show nothing
            modal = (
                <div></div>
            )
        }

        // Output for the month list rows
        return (
            <div className="optOutWrapper" month={this.props.showMonth == list_data.published_month ? "Active" :
            "Inactive"}>
                <div className="optOutItemTitle" onClick={this.showModal} value="optedOut"><p className="monthProposalName">{list_data.project_name}</p></div>
                <div className="monthItem" onClick={this.callEvent}><a className="monthVoteLink" href={list_data.voting_dc_link} target="_blank" value={list_data.voting_status} title={list_data.voting_dc_link} onClick={this.callEvent}>{list_data.voting_status}</a>
                </div>
                {modal}
            </div>
        )
    }
}

export default Month