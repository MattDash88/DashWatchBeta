import fetch from 'isomorphic-unfetch';
import React from 'react';
import ReactGA from 'react-ga';

// Analytics
import getGAKey from '../components/functions/analytics';
ReactGA.initialize(getGAKey);

// Import pages
import HowTo from '../components/elections_content/HowTo';
import Validation from '../components/elections_content/Validation';

// Import css
import "../components/css/style.css";
import "../components/css/elections.css";
import "../components/css/status_styling.css";

// Import other elements 
import Header from '../components/headers/ElectionsHeader';
import ScrollButton from '../components/elements/ScrollButton';  // Scroll to top button
import NavBar from "../components/elements/NavBar"

var basepath = 'https://dashwatchbeta.org'

const trackEvent = (event) => {
    ReactGA.event({
        category: 'Elections',
        action: event,
    });
}

const getCandidateList = () => {
    return (
        new Promise((resolve) => {
            fetch(`${basepath}/api/get/tpCandidates`)
                .then((res) => res.json()
                    .then((res) => {
                        resolve(res.data)
                    })
                )
        })
    )
}

class TrustElections extends React.Component {
    static async getInitialProps(ctx) {
        const props = {           
            tab: typeof ctx.query.tab == "undefined" ? "candidates" : ctx.query.tab,   // Default no month to latest
            url: ctx.pathname,
            as: ctx.asPath,
        }
        return props
    }

    constructor(props) {
        super(props);

        this.state = {
            tabId: props.tab,
            candidateListData: '',
            url: '/elections',
            as: props.as,
        }

        // Bind functions used in class
        this.callEvent = this.callEvent.bind(this);
        this.handleSelectTab = this.handleSelectTab.bind(this);
    }

    // Function initiated when a month list button is pressed, requests the data for that month from index.js
    handleSelectTab(event) {
        event.preventDefault();
        this.setState({
            tabId: event.currentTarget.id,        // Change state to load different month
            as: `/elections?tab=${event.currentTarget.id}`,
        })

        history.pushState(this.state, '', `/elections?tab=${event.currentTarget.id}`)   // Push State to history
        trackEvent(`Changed Tab to ${event.currentTarget.id}`)                 // Track Event on Google Analytics                                                     
    }

    // Google Analytics function to track User interaction on page
    callEvent(event) {
        trackEvent('clicked ' + event.currentTarget.id)
    }

    componentDidMount() {
        // To handle calls from popstate when the page is called from history
        onpopstate = event => {
            if (event.state) {
                this.setState(event.state)
            }
        }

        var candidateListPromise = Promise.resolve(getCandidateList());
        //var votingTallyPromise = Promise.resolve(getVotingTally());

        // Promise to get the initial "month list" records 
        Promise.all([candidateListPromise, candidateListPromise]).then(data => {
            this.setState({
                candidateListData: data[0],
            })
        }).then(history.replaceState(this.state, '', `${this.state.as}`))
    }

    
    componentDidUpdate(prevProps, prevState) {
        if (prevState.tabId !== this.state.tabId) {         // Just a history state update because it doesn't always work as desired in functions
            history.replaceState(this.state, '', `${this.state.as}`)
        }
    }

    render() {
        const { // Declare data arrays used in class
            candidateListData,
            tabId,
        } = this.state

            if (candidateListData.length == 0) {    // Show if still loading content
                var pageContent = (
                    <section>
                        <div>
                            <p>Loading&hellip;</p>
                        </div>
                    </section>
                )
            } else {    // Show candidate list
                var pageContent = (
                    <div>
                        {candidateListData.map((post) =>
                            <CandidateListRow
                                key={`${post.id}`}
                                airtableData={post}      // Elements for the Month report list    
                                showTab={tabId}
                            />
                        )}
                    </div>
                )
            }   // End of page content loop
           
        return (
            <main>
                <Header></Header>
                <NavBar
                    showPage="candidateList"
                />
                <section className="pagewrapper">
                    <div className="tpTab" id="candidates" value={this.state.tabId == "candidates" ? "Active" :
                        "Inactive"} onClick={this.handleSelectTab}><p className="tpTabText">2019 Candidates</p></div>                    
                        <div className="tpTab" id="howTo" value={this.state.tabId == "howTo" ? "Active" :
                        "Inactive"} onClick={this.handleSelectTab}><p className="tpTabText">How to Vote</p></div>
                        <div className="tpTab" id="voting" value={this.state.tabId == "voting" ? "Active" :
                        "Inactive"} onClick={this.handleSelectTab}><p className="tpTabText">Validation</p></div>
                    <div className="tpPageWrapper">

                    <section className="tpPageTopSection" value={this.state.tabId == "candidates" ? "Active" :
                        "Inactive"}>
                        <h1 className="tpHeader">2019 Dash Trust Protector Elections Candidates</h1>
                        <p className="tpText">Want to vote? The voting tool for Dash MNOs is available at: <a id="Trustvote Link" href="https://trustvote.dash.org/" target="" onClick={this.callEvent}>trustvote.dash.org/</a><br></br>
                        To help you along Dash Watch has made a <span className="tpReportLink" id="howTo" onClick={this.handleSelectTab}>How to Vote Guide</span></p>
                        <div className="tpIndexWrapper">
                            <div className="tpIndexItemFirst"><p className="tpColumnTitle">Candidate</p></div>
                            <div className="tpIndexItem"><p className="tpColumnTitle">Contact</p></div>
                            <div className="tpIndexItem"><p className="tpColumnTitle">Dash Involvement</p></div>
                            <div className="tpIndexItem"><p className="tpColumnTitle">Interview Link</p></div>
                        </div>
                        {pageContent}
                        <div className="tpBottomDiv" value={this.state.tabId == 'candidates' ? "Active" : "Inactive"}>
                            <div className="tpSubHeader">Questions, Comments, Concerns? Contact Us</div>
                            E-mail: <a href="mailto:team@dashwatch.org" target="mailto:team@dashwatch.org">team@dashwatch.org</a><br></br>
                            DashWatchTeam#5277 Discord<br></br>
                            Dash-AI#1455 Discord<br></br>
                            MattDash#6481 Discord<br></br>
                            paragon#2778 Discord<br></br>
                            Twitter: <a href="https://twitter.com/DashWatch" target="_blank">@DashWatch</a>
                        </div>
                    </section>

                    <section className="tpPageTopSection" value={this.state.tabId == 'voting' ? "Active" :
                        "Inactive"}>
                        <Validation></Validation>
                    </section>

                    <section className="tpPageTopSection" value={this.state.tabId == 'howTo' ? "Active" :
                        "Inactive"}>
                        <HowTo></HowTo>
                    </section>
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
class CandidateListRow extends React.Component {
    constructor(props) {
        super(props);

        // Binding functions in this class
        this.callEvent = this.callEvent.bind(this);
    }

    callEvent(event) {
        trackEvent('clicked: ' + event.currentTarget.id)
    }

    

    render() {
        const { // Declare grouped elements used in class
            showTab,
        } = this.props

        const { // Declare grouped elements used in class
            candidate_name,
            alias,
            contact,
            dash_involvement,
            dash_involvement_link,
            interview_link,
            interview_type,
        } = this.props.airtableData

        // Code to generate involvement link
        let involvementLink = null;
        if (typeof dash_involvement == "undefined") { // If report is pending show "Pending"
            involvementLink = (
                <div className="tpItem"></div>
            )
        } else if (typeof dash_involvement_link == "undefined") {  // If report is published, show links to report and modal
            involvementLink = (
                    <div className="tpItem">{dash_involvement}</div>
                )
            } else {
                involvementLink = (
                    <div className="tpItem"><a className="tpReportLink" id="involvementLink" href={dash_involvement_link} target="_blank" title={dash_involvement_link} onClick={this.callEvent}>
                        {dash_involvement}</a></div>
                )
        } // End of involvement if

        let candidateNameCell = null;
        if (typeof alias == "undefined") {
            candidateNameCell = (
                <div><p className="tpCandidateName" title={candidate_name}>{candidate_name}</p>
                    </div>
            )
        }  else {
            candidateNameCell = (
                <div><p className="tpCandidateName" title={candidate_name}>{candidate_name}</p>
                    <p className="tpCandidateAlias" title={alias}>aka {alias}</p></div>
            )
        }   // End of candidate name if

        // Code to generate interview link
        let interviewLink = null;
        if (typeof interview_type == "undefined") { // If report is pending show "Pending"
            interviewLink = (
                <div className="tpItem"></div>
            )
        } else {  // If report is published, show links to report and modal
            if (interview_type == "Video") {
                interviewLink = (
                    <div className="tpItem" id="tpInterviewLink"><div><a className="tpReportLink" id="reportLink" href={interview_link} target="_blank" title={interview_link} onClick={this.callEvent}>
                        <img className="reportIcon" id="YouTube" src="https://dashwatchbeta.org/images/Video.png" height="30"></img> Video</a></div></div>
                )
            } else if (interview_type == "Text") {
                interviewLink = (
                    <div className="tpItem" id="tpInterviewLink"><div><a className="tpReportLink" id="reportLink" href={interview_link} target="_blank" title={interview_link} onClick={this.callEvent}>
                        <img className="reportIcon" id="Text" src="https://dashwatchbeta.org/images/PDF.png" height="30"></img> Text</a></div></div>
                )
            } else {
                interviewLink = (
                    <div className="tpItem"></div>
                )
            }
        } // End of interview link if

        // Output for the month list rows
        return (
            <div className="tpProposalWrapper" month="Active">
                <div className="tpItemFirst">{candidateNameCell}</div>
                    <div className="tpItem"><p className="tpCandidateContact" title={contact}>{contact}</p></div>
                {involvementLink}                
                <div className="tpItem">{interviewLink}</div>
            </div>
        )
    }
}

// Component for Opted-out Table
class VotingTallyRow extends React.Component {
    constructor(props) {
        super(props);

        // Binding functions in this class
        this.callEvent = this.callEvent.bind(this);
    }

    callEvent(event) {
        trackEvent('clicked ' + event.currentTarget.className)
    }

    render() {
        const { // Declare grouped elements used in class
            showTab,
        } = this.props

        const { // Declare grouped elements used in class
            candidate,
            votes,
        } = this.props.airtableData

        // Output for the month list rows
        return (
            <div className="votingTallyWrapper">
                <div className="tpItemFirst"><p className="tpCandidateContact">{candidate}</p></div>
                <div className="tpItem">{votes}</div>
            </div>
        )
    }
}

export default TrustElections