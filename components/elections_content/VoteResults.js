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

        console.log(vote_results)

        return (
            <main>
                <section className="tpPageTopSection" value={electionId == "TPE2019" ? "Active" : "Inactive"}>
                    <h1 className="tpHeader">2019 Dash Trust Protector Elections Results</h1>
                    <div className="electionsResultsWrapper">
                        <div className="electionsIndexItemFirst"><p className="tpColumnTitle">Candidate</p></div>
                        <div className="electionsIndexItem"><p className="tpColumnTitle">Results</p></div>
                    </div>
                    {
                        (vote_results.length == 0) ? (
                            <section>
                                <p>Loading&hellip;</p>
                            </section>
                        ) : (
                                <section>
                                    {vote_results.TPE2019.map((post) =>
                                        <ResultsListRow
                                            key={`${post.id}`}
                                            airtableData={post}      // Elements for the Month report list    
                                        />
                                    )}
                                </section>
                            )
                    }
                </section>
                <section className="tpPageTopSection" value={electionId == "DIF2019" ? "Active" : "Inactive"}>
                    <h1 className="tpHeader">2019 DIF Supervisor Elections Results</h1>
                    {
                        (vote_results.length == 0) ? (
                            <section>
                                <p>Loading&hellip;</p>
                            </section>
                        ) : (
                                (vote_results.DIF2019.length == 0) ? (
                                    <section><div className="tpText">Something went wrong retrieving the voting results.</div></section>
                                ) : (
                                        <section>
                                            <div className="electionsResultsWrapper">
                                                <div className="electionsIndexItemFirst"><p className="tpColumnTitle">Candidate</p></div>
                                                <div className="electionsIndexItem"><p className="tpColumnTitle">Results</p></div>
                                            </div>
                                            {vote_results.DIF2019.map((post) =>
                                                <ResultsListRow
                                                    key={`${post.id}`}
                                                    airtableData={post}      // Elements for the Month report list    
                                                />
                                            )}
                                        </section>
                                    )

                            )
                    }
                </section>
                <section className="tpPageTopSection" value={electionId == "TPE2020" ? "Active" : "Inactive"}>
                    <h1 className="tpHeader">2020 Dash Trust Protector Elections Results</h1>
                    {
                        (vote_results.length == 0) ? (
                            <section>
                                <p>Loading&hellip;</p>
                            </section>
                        ) : (
                                (vote_results.TPE2020.length == 0) ? (
                                    <section><div className="tpText">Something went wrong retrieving the voting results.</div></section>
                                ) : (
                                        <section>
                                            <div className="electionsResultsWrapper">
                                                <div className="electionsIndexItemFirst"><p className="tpColumnTitle">Candidate</p></div>
                                                <div className="electionsIndexItem"><p className="tpColumnTitle">Results</p></div>
                                            </div>
                                            {vote_results.TPE2020.map((post) =>
                                                <ResultsListRow
                                                    key={`${post.id}`}
                                                    airtableData={post}      // Elements for the Month report list    
                                                />
                                            )}
                                        </section>
                                    )

                            )
                    }
                    
                </section>
                <section className="tpPageTopSection" value={electionId == "DIF2020" ? "Active" : "Inactive"}>
                    <h1 className="tpHeader">2020 DIF Supervisor Elections Results</h1>
                    {
                        (vote_results.length == 0) ? (
                            <section>
                                <p>Loading&hellip;</p>
                            </section>
                        ) : (
                                (vote_results.DIF2020.length == 0) ? (
                                    <section><div className="tpText">Something went wrong retrieving the voting results.</div></section>
                                ) : (
                                        <section>
                                            <div className="electionsResultsWrapper">
                                                <div className="electionsIndexItemFirst"><p className="tpColumnTitle">Candidate</p></div>
                                                <div className="electionsIndexItem"><p className="tpColumnTitle">Results</p></div>
                                            </div>
                                            {vote_results.DIF2020.map((post) =>
                                                <ResultsListRow
                                                    key={`${post.id}`}
                                                    airtableData={post}      // Elements for the Month report list    
                                                />
                                            )}
                                        </section>
                                    )

                            )
                    }
                </section>
                <section className="tpPageTopSection" value={electionId == "TPE2021" ? "Active" : "Inactive"}>
                    <h1 className="tpHeader">2021 Dash Trust Protector Elections Results</h1>
                    {
                        (vote_results.length == 0) ? (
                            <section>
                                <p>Loading&hellip;</p>
                            </section>
                        ) : (
                                (vote_results.TPE2021.length == 0) ? (
                                    <section><div className="tpText">The Dash Investment Foundation Supervisor election results will be published here after the election has ended.</div></section>
                                ) : (
                                        <section>
                                            <div className="electionsResultsWrapper">
                                                <div className="electionsIndexItemFirst"><p className="tpColumnTitle">Candidate</p></div>
                                                <div className="electionsIndexItem"><p className="tpColumnTitle">Results</p></div>
                                            </div>
                                            {vote_results.TPE2021.map((post) =>
                                                <ResultsListRow
                                                    key={`${post.id}`}
                                                    airtableData={post}      // Elements for the Month report list    
                                                />
                                            )}
                                        </section>
                                    )

                            )
                    }
                    
                </section>
                <section className="tpPageTopSection" value={electionId == "DIF2021" ? "Active" : "Inactive"}>
                    <h1 className="tpHeader">2021 DIF Supervisor Elections Results</h1>
                    {
                        (vote_results.length == 0) ? (
                            <section>
                                <p>Loading&hellip;</p>
                            </section>
                        ) : (
                                (vote_results.DIF2021.length == 0) ? (
                                    <section><div className="tpText">The DIF Supervisor election results will be published here after the election has ended.</div></section>
                                ) : (
                                        <section>
                                            <div className="electionsResultsWrapper">
                                                <div className="electionsIndexItemFirst"><p className="tpColumnTitle">Candidate</p></div>
                                                <div className="electionsIndexItem"><p className="tpColumnTitle">Results</p></div>
                                            </div>
                                            {vote_results.DIF2021.map((post) =>
                                                <ResultsListRow
                                                    key={`${post.id}`}
                                                    airtableData={post}      // Elements for the Month report list    
                                                />
                                            )}
                                        </section>
                                    )

                            )
                    }
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
            <div className="electionsResultsWrapper" month="Active">
                <div className="electionsItemFirst">{candidateNameCell}</div>
                <div className="electionsItem">{votes}</div>
            </div>
        )
    }
}

export default VoteResults