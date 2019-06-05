import React from 'react';

// Analytics
import { trackPage, trackEvent } from '../functions/analytics';

// Import css
import '../css/style.css';
import '../css/elections.css';

class CandidateLists extends React.Component {
    constructor() {
        super();

    }

    render() {
        const {     // Elements passed down to the component
            candidateListData,
            electionId,
        } = this.props

        return (
            <main>                
                <section className="tpPageTopSection" value={electionId == "tpe2019" ? "Active" : "Inactive"}>
                <h1 className="tpHeader">2019 Dash Trust Protector Candidates</h1>
                <p className="tpText">Voting for the Trust Protectors Elections 2019 ended on March 31, 2019. The results are available <a className="tpHowToLink" id="results" href={`/elections?tab=results&election=${electionId}`}>Here</a>.</p>
                <div className="tpIndexWrapper">
                    <div className="tpIndexItemFirst"><p className="tpColumnTitle">Candidate</p></div>
                    <div className="tpIndexItem"><p className="tpColumnTitle">Contact</p></div>
                    <div className="tpIndexItem"><p className="tpColumnTitle">Dash Involvement</p></div>
                    <div className="tpIndexItem"><p className="tpColumnTitle">Profile Link</p></div>
                </div>
                {
                    candidateListData.length == 0 ? (
                        <div>
                            <p>Loading&hellip;</p>
                        </div>
                    ) : (
                            <div>
                                {candidateListData.TPE19.map((post) =>
                                    <CandidateListRow
                                        key={`${post.id}`}
                                        airtableData={post}      // Elements for the Month report list    
                                    />
                                )}
                            </div>
                        )
                }
                <div className="tpBottomDiv">
                    <div className="tpSubHeader">Questions, Comments, Concerns? Contact Us</div>
                    E-mail: <a href="mailto:team@dashwatch.org" target="mailto:team@dashwatch.org">team@dashwatch.org</a><br></br>
                    DashWatchTeam#5277 Discord<br></br>
                    Dash-AI#1455 Discord<br></br>
                    MattDash#6481 Discord<br></br>
                    paragon#2778 Discord<br></br>
                    Twitter: <a href="https://twitter.com/DashWatch" target="_blank">@DashWatch</a>
                </div>
                </section>   
                <section className="tpPageTopSection" value={electionId == "dif2019" ? "Active" : "Inactive"}>
                    <h1 className="tpHeader">2019 Investment Foundation Supervisor Candidates</h1>
                    <p className="tpText"><b>Update May 31, 2019</b>: Dash Core Group has decided to extend the deadline to apply for the Dash Investment Foundation Supervisor role due to a limited number of applicants and a community desire to receive more information about the role. We will be releasing the new deadline soon.</p>
                    <p className="tpText"><b>Update June 4, 2019</b>: The new deadline to submit candidacies for a supervisor role at the Dash Investment Foundation is June 7 23.59 GMT.</p>
                    <p className="tpText">The list of candidates for the Dash Investment Foundation supervisors will be published on this page shortly before the elections starts. More information is available <a id="results" target="_blank" href="https://blog.dash.org/details-on-the-election-for-dash-investment-foundation-supervisors-25766c55a1f">Here</a>.</p>
                    <p className="tpText">If you would like to apply as a candidate for the Dash Investment Foundation Supervisor elections, please complete the <a id="results" target="_blank" href="https://dashwatchbeta.org/files/DIF19_CandidateApplicationForm.pdf">Application form</a> and submit it to <a href="mailto:team@dashwatch.org" target="">team@dashwatch.org</a>.</p>
                    <div className="tpIndexWrapper">
                    <div className="tpIndexItemFirst"><p className="tpColumnTitle">Candidate</p></div>
                    <div className="tpIndexItem"><p className="tpColumnTitle">Contact</p></div>
                    <div className="tpIndexItem"><p className="tpColumnTitle">Dash Involvement</p></div>
                    <div className="tpIndexItem"><p className="tpColumnTitle">Profile Link</p></div>
                </div>
                {
                    candidateListData.length == 0 ? (
                        <div>
                            <p>Loading&hellip;</p>
                        </div>
                    ) : (
                            <div>
                                {candidateListData.DIF19.map((post) =>
                                    <CandidateListRow
                                        key={`${post.id}`}
                                        airtableData={post}      // Elements for the Month report list    
                                    />
                                )}
                            </div>
                        )
                }
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
        trackEvent('Elections', 'clicked: ' + event.currentTarget.id)
    }

    render() {
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
                <div className="tpItem"><a className="tpInvolvementLink" id="involvementLink" href={dash_involvement_link} target="_blank" title={dash_involvement_link} onClick={this.callEvent}>
                    {dash_involvement}</a></div>
            )
        } // End of involvement if

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

        // Code to generate interview link
        let interviewLink = null;
        if (typeof interview_type == "undefined") { // If report is pending show "Pending"
            interviewLink = (
                <div className="tpItem"></div>
            )
        } else {  // If report is published, show links to report and modal
            if (interview_type == "Video") {
                interviewLink = (
                    <div className="tpItem" id="tpInterviewLink"><div><a className="tpInterviewLink" id="reportLink" href={interview_link} target="_blank" title={interview_link} onClick={this.callEvent}>
                        <img className="reportIcon" id="YouTube" src="https://dashwatchbeta.org/images/Video.png" height="30"></img> Profile</a></div></div>
                )
            } else if (interview_type == "Text") {
                interviewLink = (
                    <div className="tpItem" id="tpInterviewLink"><div><a className="tpInterviewLink" id="reportLink" href={interview_link} target="_blank" title={interview_link} onClick={this.callEvent}>
                        <img className="reportIcon" id="Text" src="https://dashwatchbeta.org/images/PDF.png" height="30"></img> Profile</a></div></div>
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

export default CandidateLists