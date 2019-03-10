import fetch from 'isomorphic-unfetch';
import React from 'react';
import ReactGA from 'react-ga';

// Analytics
import getGAKey from '../components/functions/analytics';
ReactGA.initialize(getGAKey);

// Import pages

// Import css
import "../components/css/style.css";
import "../components/css/tp_elections.css";
import "../components/css/status_styling.css";

// Import other elements 
import Header from '../components/headers/IndexHeader';
import ScrollButton from '../components/elements/ScrollButton';  // Scroll to top button
import NavBar from "../components/elements/NavBar_TP"

var basepath = 'http://localhost:5000'

const trackEvent = (event) => {
    ReactGA.event({
        category: 'TP Page',
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

const getVotingTally = () => {
    return (
        new Promise((resolve) => {
            fetch(`${basepath}/api/get/tpVotingTally`)
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
            tallyData: '',
            url: '/TPelection',
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
        trackEvent('Changed Tab')                 // Track Event on Google Analytics                                                   // Track event in Google Analytics       
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

        var candidateListPromise = Promise.resolve(getCandidateList());
        var votingTallyPromise = Promise.resolve(getVotingTally());

        // Promise to get the initial "month list" records 
        Promise.all([candidateListPromise, votingTallyPromise]).then(data => {
            this.setState({
                candidateListData: data[0],
                tallyListData: data[1],
            })
        }).then(history.replaceState(this.state, '', `${this.state.as}`))

    }

    render() {
        const { // Declare data arrays used in class
            candidateListData,
            tallyListData,
            tabId,
        } = this.state

        if (candidateListData.length == 0) {
            var pageContent = (
                <div>
                    <p>Loading&hellip;</p>
                </div>
            )
        } else if (tabId=="candidates") {
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
        } else if (tabId=="tally") {
            var pageContent = (
                <div>
                    {tallyListData.map((post) =>
                        <VotingTallyRow                       
                            key={`${post.id}`}
                            airtableData={post}      // Elements for the Month report list    
                            showTab={tabId} 
                        />
                    )}
                </div>
            )
        }

        // Still loading Airtable data
        return (
            <main>
                <NavBar
                    showPage="candidateList"
                />
                <section className="pagewrapper">
                    <div className="tpTab" id='candidates' value={this.state.tabId == 'candidates' ? "Active" :
                        "Inactive"} onClick={this.handleSelectTab}><p className="tpTabText">2019 Candidates</p></div>
                    <div className="tpTab" id='tally' value={this.state.tabId == 'tally' ? "Active" :
                        "Inactive"} onClick={this.handleSelectTab}><p className="tpTabText">Voting Tally</p></div>
                    <div className="tpPageWrapper">
                        <h1 className="tpHeader">2019 Dash Trust Protector Election Candidates</h1>
                        <div className="tpIndexWrapper">
                            <div className="tpIndexItemFirst"><p className="tpColumnTitle">Candidate</p></div>
                            <div className="tpIndexItem"><p className="tpColumnTitle">Contact</p></div>
                            <div className="tpIndexItem"><p className="tpColumnTitle">Dash Involvement</p></div>
                            <div className="tpIndexItem"><p className="tpColumnTitle">Interview Link</p></div>
                        </div>
                        {pageContent}
                        <div className="tpBottomDiv">
                            <div className="tpSubHeader">Questions, Comments, Concerns? Contact Us</div>
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
class CandidateListRow extends React.Component {
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
            candidate_name,
            alias,
            contact,
            dash_involvement,
            dash_involvement_link,
        } = this.props.airtableData

        // Code to generate report link
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
                    <div className="tpItem"><a className="tpReportLink" href={dash_involvement_link} target="_blank" title={dash_involvement_link} onClick={this.callEvent}>
                        {dash_involvement}</a></div>
                )
        } // End of report status if

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
        }

        // Output for the month list rows
        return (
            <div className="tpProposalWrapper" month="Active">
                <div className="tpItemFirst">{candidateNameCell}</div>
                    <div className="tpItem"><p className="tpCandidateContact" title={contact}>{contact}</p></div>
                {involvementLink}                
                <div className="tpItem"></div>
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

export default Month