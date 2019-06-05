import React from 'react';

// Analytics
import { trackPage, trackEvent } from '../functions/analytics';

// Import css
import '../css/style.css';
import '../css/elections.css';

class VoteResults extends React.Component {
    constructor() {
        super();
    }

    render() {
        const {     // Elements passed down to the component
            vote_results,
            electionId,
        } = this.props

        return (
            <main>              
                <section className="tpPageTopSection" value={electionId == "tpe2019" ? "Active" : "Inactive"}>
                <h1 className="tpHeader">2019 Dash Trust Protector Elections Results</h1>
                <div className="tpResultsWrapper">
                    <div className="tpIndexItemFirst"><p className="tpColumnTitle">Candidate</p></div>
                    <div className="tpIndexItem"><p className="tpColumnTitle">Results</p></div>
                </div>               
                {
                    (vote_results.length == 0) ? (
                        <section>
                            <p>Loading&hellip;</p>
                        </section>
                    ) : (
                            <section>
                                {vote_results.TPE19.map((post) =>
                                    <ResultsListRow
                                        key={`${post.id}`}
                                        airtableData={post}      // Elements for the Month report list    
                                    />
                                )}
                            </section>
                        )
                }
                </section>
                <section className="tpPageTopSection" value={electionId == "dif2019" ? "Active" : "Inactive"}>
                    <h1 className="tpHeader">2019 Investment Foundation Supervisor Elections Results</h1>
                    <div className="tpText">The Dash Investment Foundation Supervisor election results will be published here shortly after the election is concluded, no later than July 5th, 2019.</div>
                </section>
            </main>
        )
    }
}

// Component for Report List Table
class ResultsListRow extends React.Component {
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
            candidate_name,
            alias,
            votes,
        } = this.props.airtableData

        let candidateNameCell = null;
        if (typeof alias == "undefined") {
            candidateNameCell = (
                <div><p className="tpCandidateName" title={candidate_name}>{candidate_name}</p>
                </div>
            )
        } else {
            candidateNameCell = (
                <div><p className="tpCandidateName" title={candidate_name}>{candidate_name}</p>
                    <p className="tpCandidateAlias" title={alias}>aka {alias}</p></div>
            )
        }   // End of candidate name if       

        // Output for the month list rows
        return (
            <div className="tpResultsWrapper" month="Active">
                <div className="tpItemFirst">{candidateNameCell}</div>
                <div className="tpItem">{votes}</div>
            </div>
        )
    }
}

export default VoteResults