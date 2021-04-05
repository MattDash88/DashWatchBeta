import fetch from 'isomorphic-unfetch';
import React from 'react';

// Analytics
import { trackPage, trackEvent } from '../components/functions/analytics';

// Import pages
import CandidateLists from '../components/elections_content/CandidateLists';
import VoteCharts from '../components/elections_content/VoteCharts';
import VoteResults from '../components/elections_content/VoteResults';

// Import css
import "../components/css/style.css";
import "../components/css/elections.css";
import "../components/css/status_styling.css";

// Import other elements 
import Header from '../components/headers/ElectionsHeader';
import ScrollButton from '../components/elements/ScrollButton';  // Scroll to top button
import NavBar from "../components/elements/NavBar"

// API query requesting Trust Protector Candidate List data
const getElectionsData = () => {
    return (
        new Promise((resolve) => {
            fetch(`/api/get/electionsData`)
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
            election: typeof ctx.query.tab == "undefined" ? "TPE2021" : ctx.query.election,   // Default no month to latest
            url: ctx.pathname,
            as: ctx.asPath,
        }
        return props
    }

    constructor(props) {
        super(props);

        this.state = {
            // General election section states
            tabId: props.tab,
            electionId: props.election,
            showMenu: false,
            redrawState: false,        // State to determine when the participation chart should rerender

            // Vote datasets
            candidateListData: '',
            voteMetrics: '',
            voteResults: '',

            // History states
            url: '/elections',
            as: props.as,
        }

        // Bind functions used in class
        this.callEvent = this.callEvent.bind(this);
        this.handleSelectTab = this.handleSelectTab.bind(this);
        this.handleDropdown = this.handleDropdown.bind(this);
        this.handleSelectElection = this.handleSelectElection.bind(this);
        this.handleClick = this.handleClick.bind(this)
    }

    // Function initiated when a month list button is pressed, requests the data for that month from index.js
    handleSelectTab(event) {
        event.preventDefault();
        this.setState({
            tabId: event.currentTarget.id,        // Change state to load different month
            shouldRedraw: false,
            as: `/elections?tab=${event.currentTarget.id}&election=${this.state.electionId}`,
        })

        history.pushState(this.state, '', `/elections?tab=${event.currentTarget.id}&election=${this.state.electionId}`)   // Push State to history
        trackEvent('Elections', `Changed Tab to ${event.currentTarget.id}`)                 // Track Event on Google Analytics                                                     
    }

    // Function to activate month dropdown menu
    handleDropdown(event) {
        event.preventDefault();
        this.setState({
            showMenu: !this.state.showMenu,
            shouldRedraw: false,
        })
        trackEvent('Elections', `Clicked Election Results dropdown`)
    }

    // Function to handle showing the month selected from the dropdown menu
    handleSelectElection(event) {
        this.setState({
            showMenu: false,
            electionId: event.currentTarget.value,
            shouldRedraw: true,
            as: `/elections?tab=${this.state.tabId}&election=${event.currentTarget.value}`,
        })

        history.pushState(this.state, '', `/elections?tab=${this.state.tabId}&election=${event.currentTarget.value}`)
        trackEvent('Elections', `Changed Elections to ${event.currentTarget.value}`)                 // Track Event on Google Analytics   
    }

    // Function ran when the eventlistener is activated. Close dropdown menu and tooltip if clicked outside of it
    handleClick = (event) => {
        if (event.target.id !== "dropdownMenu") {
            this.setState({
                showMenu: false,
                shouldRedraw: false,
            })
            trackEvent('Elections', `Clicked on Elections Vote Results page`)
        }
    }

    // Google Analytics function to track User interaction on page
    callEvent(event) {
        trackEvent('Elections', 'clicked ' + event.currentTarget.id)
    }

    componentDidMount() {
        // To handle calls from popstate when the page is called from history
        onpopstate = event => {
            if (event.state) {
                this.setState(event.state)
            }
        }

        trackPage(`/elections`) // Track Pageview in Analytics
        window.addEventListener('mousedown', this.handleClick);     // Handles closing of dropdown menu

        // Promise to get the initial "month list" records 
        Promise.resolve(getElectionsData()).then(data => {          
            this.setState({
                candidateListData: data.candidate_data,
                voteMetrics: data.vote_metrics,
                voteResults: data.vote_results,
            })
        }).then(history.replaceState(this.state, '', `${this.state.as}`))
    }

    componentWillUnmount() {
        window.removeEventListener('mousedown', this.handleClick);  // Stop event listener when modal is unloaded
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.tabId !== this.state.tabId || prevState.electionId !== this.state.electionId) {         // Just a history state update because it doesn't always work as desired in functions
            history.replaceState(this.state, '', `${this.state.as}`)
        }
    }

    render() {
        const { // Declare data arrays used in class
            candidateListData,
            voteMetrics,
            voteResults,
            redrawState,
            tabId,
            electionId,
        } = this.state

        let electionName
        if (electionId == "DIF2019") {
            electionName = "2019 Foundation Supervisors"
        } else if (electionId == "TPE2019") {
            electionName = "2019 Trust Protectors"
        } else if (electionId == "TPE2020") {
            electionName = "2020 Trust Protectors"
        } else if (electionId == "DIF2020") {
            electionName = "2020 Foundation Supervisors"
        } else if (electionId == "TPE2021") {
            electionName = "2021 Trust Protectors"
        } else {
            electionName = "Select an election"
        }

        return (
            <main>
                <Header></Header>
                <NavBar
                    showPage="elections"
                />
                <section className="pagewrapper">
                    <div className="tpTab" id="candidates" value={this.state.tabId == "candidates" ? "Active" :
                        "Inactive"} onClick={this.handleSelectTab}><div className="tpTabText">Candidates</div></div>
                    <div className="tpTab" id="participation" value={this.state.tabId == "participation" ? "Active" :
                        "Inactive"} onClick={this.handleSelectTab}><div className="tpTabText">Participation</div></div>
                    <div className="tpTab" id="results" value={this.state.tabId == "results" ? "Active" :
                        "Inactive"} onClick={this.handleSelectTab}><div className="tpTabText">Results</div></div>
                    <div className="tpPageWrapper">
                    <div className="tpText">Select an election:</div> 
                    <div className="electionsDropdown" id="dropdownMenu">
                    <div id="dropdownMenu" onClick={this.handleDropdown} className="electionsDropbtn"><i id="electionsDropdownMenu"></i>{electionName}</div>
                    {
                        this.state.showMenu ? (
                            <div className="electionsDropdownMenu" id="dropdownMenu">
                                <button id="dropdownMenu" value="TPE2021" className="electionsDropdownItem" onClick={this.handleSelectElection}>2021 Trust Protectors</button>
                                <button id="dropdownMenu" value="DIF2020" className="electionsDropdownItem" onClick={this.handleSelectElection}>2020 Foundation Supervisors</button>
                                <button id="dropdownMenu" value="TPE2020" className="electionsDropdownItem" onClick={this.handleSelectElection}>2020 Trust Protectors</button>
                                <button id="dropdownMenu" value="DIF2019" className="electionsDropdownItem" onClick={this.handleSelectElection}>2019 Foundation Supervisors</button>
                                <button id="dropdownMenu" value="TPE2019" className="electionsDropdownItem" onClick={this.handleSelectElection}>2019 Trust Protectors</button>
                            </div>
                        ) : (
                                null
                            )
                    }
                    </div>
                        <section className="tpPageTopSection" value={this.state.tabId == "candidates" ? "Active" :
                            "Inactive"}>
                            <CandidateLists
                                electionId={electionId}
                                candidateListData={candidateListData}
                            />
                        </section>
                        <section className="tpPageTopSection" value={this.state.tabId == 'participation' ? "Active" :
                            "Inactive"}>
                            {
                                voteMetrics.length == 0 ? (
                                    <div>
                                        <p>Loading&hellip;</p>
                                    </div>
                                ) : (
                                        <VoteCharts
                                            electionId={electionId}
                                            voteMetrics={voteMetrics}
                                            redrawState={redrawState}
                                        />
                                    )
                            }
                        </section>
                        <section className="tpPageTopSection" value={this.state.tabId == "results" ? "Active" :
                            "Inactive"}>
                            <VoteResults
                                electionId={electionId}
                                vote_results={voteResults}
                            />
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

export default TrustElections