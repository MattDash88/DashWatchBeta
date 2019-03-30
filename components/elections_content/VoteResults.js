import React from 'react';

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
        } = this.props
        
        return (
            <main>
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
                                    {vote_results.map((post) =>
                                        <ResultsListRow
                                            key={`${post.id}`}
                                            airtableData={post}      // Elements for the Month report list    
                                        />
                                    )}
                                    </section>
                                )
                }
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
        }  else {
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