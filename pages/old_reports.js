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
import Header from '../components/headers/OldReportsHeader';
import ScrollButton from '../components/elements/ScrollButton';  // Scroll to top button
import NavBar from "../components/elements/NavBar"
import ModalFrame from '../components/modal/ModalFrame';
import ModalContent from '../components/modal/SimplifiedModalContent';

// API query requesting Report List data
const getMonthList = () => {
    return (
        new Promise((resolve) => {
            fetch(`/api/get/old_monthlist`)
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
            year: typeof ctx.query.year == "undefined" ? "2019" : ctx.query.year,   // Default no month to latest
            month: typeof ctx.query.month == "undefined" ? "January" : ctx.query.month,   // Default no month to latest
            url: ctx.pathname,
            as: ctx.asPath,
        }
        return props
    }

    constructor(props) {
        super(props);

        this.state = {
            monthId: props.month,
            yearId: props.year,
            monthListData: '',
            optOutListData: '',
            showMenu: false,
            url: '/reportlist',
            as: props.as,
        }

        // Bind functions used in class
        this.handleTab = this.handleTab.bind(this);
        this.handleDropdown = this.handleDropdown.bind(this);
        this.handleSelectMonth = this.handleSelectMonth.bind(this)
        this.handleClick = this.handleClick.bind(this);
        this.callEvent = this.callEvent.bind(this);
    }

    // Function to handle the selection of the top year tabs
    handleTab(event) {
        event.preventDefault();
        if (event.currentTarget.id == "2018") {
            this.setState({
                monthId: "December",        // Change state to load different month
            })
        } else if (event.currentTarget.id == "2019") {
            this.setState({
                monthId: "January",        // Change state to load different month
            })
        }
        this.setState({
            yearId: event.currentTarget.id,        // Change state to load different month
            as: `/oldreports?year=${event.currentTarget.id}`,
        })        
        trackEvent('Old Reports Page', 'Changed Year')                 // Track Event on Google Analytics    
    }

    // Function to activate month dropdown menu
    handleDropdown(event) {
        event.preventDefault();
        this.setState({
            showMenu: !this.state.showMenu,
        }) 
    }

    // Function to handle showing the month selected from the dropdown menu
    handleSelectMonth(event) {
        this.setState({
            monthId: event.currentTarget.value,        // Change state to load different month
            showMenu: false,
            as: `/oldreports?month=${event.currentTarget.value}&year=${this.state.yearId}`,
        })

        //history.pushState(this.state, '', `/oldreports?year=${this.state.yearId}&month=${event.currentTarget.value}`)   // Push State to history
        trackEvent('Old Reports Page', `Changed Month to ${event.currentTarget.value} ${this.state.yearId}`)                 // Track Event on Google Analytics    
    }

    // Function ran when the eventlistener is activated. Close dropdown menu if clicked outside of it
    handleClick = (event) => {
        if (event.target.id !== "dropdownMenu") {
        this.setState({
            showMenu: false,
        }) 
        }
      }

    // Google Analytics function to track User interaction on page
    callEvent(event) {
        event.preventDefault();
        trackEvent('Old Reports Page', 'clicked ' + event.currentTarget.className)
    }

    componentDidMount() {
        // To handle calls from history (forward and back buttons)
        onpopstate = event => {
            if (event.state) {
                this.setState(event.state)
            }
        }

        trackPage(`/old_reports`) // Track Pageview in Analytics
        window.addEventListener('mousedown', this.handleClick);     // Handles closing of dropdown menu

        // Promise to get the initial "month list" records 
        Promise.resolve(getMonthList()).then(data => {
            this.setState({
                monthListData: data.report_list,
                optOutListData: data.opted_out_list,
            })
        })//.then(history.replaceState(this.state, '', `${this.state.as}`))
    }

    //componentDidUpdate(prevProps, prevState) {
    //    if (prevState.monthId !== this.state.monthId) {// Just a history state update because it doesn't always work as desired in functions
    //        history.replaceState(this.state, '', `${this.state.as}`)
    //    }
    //}

    componentWillUnmount() {
        // Stop event listener when modal is unloaded
        window.removeEventListener('mousedown', this.handleClick);
    }
  
    render() {
        const { // Declare data arrays used in class
            monthListData,
            optOutListData,
            monthId,
            yearId,
        } = this.state

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
                            showYear={this.state.yearId}
                        />
                    )}
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
                    <div className="monthTab" id='2018' value={this.state.yearId == '2018' ? "Active" :
                        "Inactive"} onClick={this.handleTab}><p className="monthTabText">2018</p>
                    </div>
                    <div className="monthTab" id='2019' value={this.state.yearId == '2019' ? "Active" :
                        "Inactive"} onClick={this.handleTab}><p className="monthTabText">2019</p>
                    </div>
                    <div className="monthPageWrapper"> 
                        <div className="monthHeaderWrapper">
                            <div className="monthHeader">Dash Watch {monthId} {yearId} reports</div>
                            <a className="reportPageLink" id="newReports" href="/reportlist">New Reports<i id="newReports"></i></a>
                        </div>
                        <p className="monthText">Select a month:</p> 
                        <div className="dropdown" id="dropdownmenu">
                            <div id="dropdownMenu" onClick={this.handleDropdown} className="dropbtn"><i id="dropdownMenu"></i>{monthId} {yearId}</div>
                            {   
                                this.state.showMenu ? (
                                    this.state.yearId == "2018" ? (
                                    <div className="dropdownMenu" id="dropdownMenu">
                                        <button id="dropdownMenu" value="December" className="dropdownItem"  onClick={this.handleSelectMonth}>December {this.state.yearId}</button>
                                        <button id="dropdownMenu" value="November" className="dropdownItem"  onClick={this.handleSelectMonth}>November {this.state.yearId}</button>
                                        <button id="dropdownMenu" value="October" className="dropdownItem"  onClick={this.handleSelectMonth}>October {this.state.yearId}</button>
                                        <button id="dropdownMenu" value="September" className="dropdownItem"  onClick={this.handleSelectMonth}>September {this.state.yearId}</button>
                                        <button id="dropdownMenu" value="August" className="dropdownItem"  onClick={this.handleSelectMonth}>August {this.state.yearId}</button>
                                        <button id="dropdownMenu" value="July" className="dropdownItem"  onClick={this.handleSelectMonth}>July {this.state.yearId}</button>
                                        <button id="dropdownMenu" value="June" className="dropdownItem"  onClick={this.handleSelectMonth}>June {this.state.yearId}</button>
                                   </div>
                                    ) : (
                                        this.state.yearId == "2019" ? (  
                                            <div className="dropdownMenu" id="dropdownMenu">
                                                <button id="dropdownMenu" value="January" className="dropdownItem"  onClick={this.handleSelectMonth}>January {this.state.yearId}</button>
                                                <button id="dropdownMenu" value="February" className="dropdownItem"  onClick={this.handleSelectMonth}>February {this.state.yearId}</button>
                                                <button id="dropdownMenu" value="March" className="dropdownItem"  onClick={this.handleSelectMonth}>March {this.state.yearId}</button>
                                                <button id="dropdownMenu" value="April" className="dropdownItem"  onClick={this.handleSelectMonth}>April {this.state.yearId}</button>
                                                <button id="dropdownMenu" value="May" className="dropdownItem"  onClick={this.handleSelectMonth}>May {this.state.yearId}</button>
                                                <button id="dropdownMenu" value="June" className="dropdownItem"  onClick={this.handleSelectMonth}>June {this.state.yearId}</button>
                                            </div>
                                        ) : (
                                            <div className="dropdownMenu" id="dropdownMenu">
                                                <button id="dropdownMenu" value="January" className="dropdownItem">No reports available</button>
                                            </div>
                                        )
                                    )
                                ) : (
                                        null
                                )
                            }
                        </div>  
                        <div className="monthIndexWrapper">
                            <div className="monthIndexItem" id="proposalColumn"><p className="monthColumnTitle">Proposal</p></div>
                            <div className="monthIndexItem" id="reportsColumn"><p className="monthColumnTitle">Report Link</p></div>
                            <div className="monthIndexItem"><p className="monthColumnTitle">Proposal Type</p></div>
                            <div className="monthIndexItem"><p className="monthColumnTitle">Voting Status</p></div>
                        </div>
                        {pageContent}
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
        trackEvent('Old Reports Page', 'Opened Modal')
    };

    // Function to close modal
    hideModal = () => {
        this.setState({ show: false });
    };

    callEvent(event) {
        trackEvent('Old Reports Page', 'clicked ' + event.currentTarget.className)
    }

    render() {
        const { // Declare grouped elements used in class
            showMonth,
            showYear,
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
                    <div className="monthItem" id="reportsColumn"><div><a className="monthReportLink" href={list_data.report_link} target="_blank" title={list_data.report_link} onClick={this.callEvent}>
                        <img className="reportIcon" id="YouTube" src="/static/images/Video.png" height="30"></img> Video</a></div></div>
                )
            } else if (list_data.report_type == "Podcast") {
                reportLink = (
                    <div className="monthItem" id="reportsColumn"><div><a className="monthReportLink" href={list_data.report_link} target="_blank" title={list_data.report_link} onClick={this.callEvent}>
                        <img className="reportIcon" id="YouTube" src="/static/images/Podcast.png" height="30"></img> Podcast</a></div></div>
                )
            } else {
                reportLink = (
                    <div className="monthItem" id="reportsColumn"><div><a className="monthReportLink" href={list_data.report_link} target="_blank" title={list_data.report_link} onClick={this.callEvent}><img id="PDF" src="/static/images/PDF.png" height="30"></img> Report</a></div></div>
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
            <div className="monthProposalWrapper" month={this.props.showMonth+this.props.showYear == list_data.published_month ? "Active" :
                "Inactive"} response={list_data.response_status == "No" ? "No" :
                    "Yes"}>
                <div className="monthItem" id="proposalColumn" onClick={this.showModal}><p className="monthProposalName">{list_data.project_name}</p>
                    <p className="monthOwnerName">by {main_data.proposal_owner}</p></div>
                {reportLink}
                <div className="monthItem" onClick={this.showModal}><p className="monthProposalType" value={list_data.proposal_type}>{list_data.proposal_type}</p></div>
                <div className="monthItem"><div title={list_data.voting_status}>{list_data.voting_status}</div>
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
        trackEvent('Old Reports Page', 'Opened Modal')
    };

    // Function to close modal
    hideModal = () => {
        this.setState({ show: false });
    };

    callEvent(event) {
        trackEvent('Old Reports Page', 'clicked ' + event.currentTarget.className)
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