import fetch from 'isomorphic-unfetch';
import React from 'react';
import ReactGA from 'react-ga';

// Analytics
import getGAKey from '../components/functions/analytics';
ReactGA.initialize(getGAKey);

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

var basepath = 'https://dashwatchbeta.org'

const trackEvent = (event) => {
    ReactGA.event({
        category: 'Reports Page',
        action: event,
    });
}

const getMonthList = () => {
    return (
        new Promise((resolve) => {
            fetch(`${basepath}/api/get/monthlist`)
                .then((res) => res.json()
                    .then((res) => {
                        resolve(res.data)
                    })
                )
        })
    )
}

const getOptOutList = () => {
    return (
        new Promise((resolve) => {
            fetch(`${basepath}/api/get/optoutlist`)
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
            month: typeof ctx.query.month == "undefined" ? "Feb19" : ctx.query.month,   // Default no month to latest
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

    // Function initiated when a month list button is pressed, requests the data for that month from index.js
    handleSelectMonth(event) {
        event.preventDefault();
        this.setState({
            monthId: event.currentTarget.id,        // Change state to load different month
            as: `/reportlist?month=${event.currentTarget.id}`,
        })

        history.pushState(this.state, '', `/reportlist?month=${event.currentTarget.id}`)   // Push State to history
        trackEvent('Changed Month')                 // Track Event on Google Analytics    
    }

    // Google Analytics function to track User interaction on page
    callEvent(event) {
        event.preventDefault();
        trackEvent('clicked ' + event.currentTarget.className)
    }

    componentDidMount() {
        // To handle calls from history (forward and back buttons)
        onpopstate = event => {
            if (event.state) {
                this.setState(event.state)
            }
        }

        var monthListPromise = Promise.resolve(getMonthList());
        var optOutListPromise = Promise.resolve(getOptOutList());

        // Promise to get the initial "month list" records 
        Promise.all([monthListPromise, optOutListPromise]).then(data => {
            this.setState({
                monthListData: data[0],
                optOutListData: data[1],
            })
        }).then(history.replaceState(this.state, '', `${this.state.as}`))
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.monthId !== this.state.monthId) {
            var monthListPromise = Promise.resolve(getMonthList());
            var optOutListPromise = Promise.resolve(getOptOutList());

            // Promise to get the initial "month list" records 
            Promise.all([monthListPromise, optOutListPromise]).then(data => {
                this.setState({
                    monthListData: data[0],
                    optOutListData: data[1],
                })
            }).then(history.replaceState(this.state, '', `${this.state.as}`))
        }
    }

    render() {
        const { // Declare data arrays used in class
            monthListData,
            optOutListData,
            monthId,
        } = this.state

        let monthText
        if (monthId == "Nov18") {
            monthText = "Dash Watch November 2018 Reports"
        } else if (monthId == "Dec18") {
            monthText = "Dash Watch December 2018 Reports"
        } else if (monthId == "Jan19") {
            monthText = "Dash Watch January 2019 Reports"
        } else if (monthId == "Feb19") {
            monthText = "Dash Watch February 2019 Reports"
        } else {
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
                    <div className="monthTab" id='Nov18' value={this.state.monthId == 'Nov18' ? "Active" :
                        "Inactive"} onClick={this.handleSelectMonth}><p className="monthTabText">November 2018</p></div>
                    <div className="monthTab" id='Dec18' value={this.state.monthId == 'Dec18' ? "Active" :
                        "Inactive"} onClick={this.handleSelectMonth}><p className="monthTabText">December 2018</p></div>
                    <div className="monthTab" id='Jan19' value={this.state.monthId == 'Jan19' ? "Active" :
                        "Inactive"} onClick={this.handleSelectMonth}><p className="monthTabText">January 2019</p></div>
                    <div className="monthTab" id='Feb19' value={this.state.monthId == 'Feb19' ? "Active" :
                        "Inactive"} onClick={this.handleSelectMonth}><p className="monthTabText">February 2019</p></div>
                    <div className="monthPageWrapper">
                        <h1 className="monthHeader">{monthText}</h1>
                        <div className="monthIndexWrapper">
                            <div className="monthIndexItem"><p className="monthColumnTitle">Proposal</p></div>
                            <div className="monthIndexItem"><p className="monthColumnTitle">Report Link</p></div>
                            <div className="monthIndexItem"><p className="monthColumnTitle">Proposal Type</p></div>
                            <div className="monthIndexItem"><p className="monthColumnTitle">Voting Status</p></div>
                        </div>
                        {pageContent}
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
        trackEvent('Opened Modal')
    };

    // Function to close modal
    hideModal = () => {
        this.setState({ show: false });
    };

    callEvent(event) {
        trackEvent('clicked ' + event.currentTarget.className)
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
                <div className="monthItem">Pending</div>
            )
        } else {  // If report is published, show links to report and modal
            if (list_data.report_type == "Video") {
                reportLink = (
                    <div className="monthItem" id="monthReportLink"><div><a className="monthReportLink" href={list_data.report_link} target="_blank" title={list_data.report_link} onClick={this.callEvent}>
                        <img className="reportIcon" id="YouTube" src="https://dashwatchbeta.org/images/Video.png" height="30"></img> Video</a></div></div>
                )
            } else if (list_data.report_type == "Podcast") {
                reportLink = (
                    <div className="monthItem" id="monthReportLink"><div><a className="monthReportLink" href={list_data.report_link} target="_blank" title={list_data.report_link} onClick={this.callEvent}>
                        <img className="reportIcon" id="YouTube" src="https://dashwatchbeta.org/images/Podcast.png" height="30"></img> Podcast</a></div></div>
                )
            } else {
                reportLink = (
                    <div className="monthItem" id="monthReportLink"><div><a className="monthReportLink" href={list_data.report_link} target="_blank" title={list_data.report_link} onClick={this.callEvent}><img id="PDF" src="https://dashwatchbeta.org/images/PDF.png" height="30"></img> Report</a></div></div>
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
                <div className="monthItemTitle" onClick={this.showModal}><p className="monthProposalName">{list_data.project_name}</p>
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
        trackEvent('Opened Modal')
    };

    // Function to close modal
    hideModal = () => {
        this.setState({ show: false });
    };

    callEvent(event) {
        trackEvent('clicked ' + event.currentTarget.className)
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