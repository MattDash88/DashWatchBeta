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
                <section className="tpPageTopSection" value={electionId == "TPE2019" ? "Active" : "Inactive"}>
                <h1 className="tpHeader">2019 Dash Trust Protector Candidates</h1>
                <p className="tpText">Voting for the Trust Protectors Elections 2019 has ended. The results are available on the <a className="tpHowToLink" id="results" href={`/elections?tab=results&election=${electionId}`}>results tab</a>.</p>
                <div className="electionsIndexWrapper">
                    <div className="electionsIndexItemFirst"><p className="tpColumnTitle">Candidate</p></div>
                    <div className="electionsIndexItem"><p className="tpColumnTitle">Contact</p></div>
                    <div className="electionsIndexItem"><p className="tpColumnTitle">Dash Involvement</p></div>
                    <div className="electionsIndexItem"><p className="tpColumnTitle">Profile Link</p></div>
                </div>
                {
                    candidateListData.length == 0 ? (
                        <div>
                            <p>Loading&hellip;</p>
                        </div>
                    ) : (
                            <div>
                                {candidateListData.TPE2019.map((post) =>
                                    <TPECandidateListRow
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
                <section className="tpPageTopSection" value={electionId == "DIF2019" ? "Active" : "Inactive"}>
                    <h1 className="tpHeader">2019 Investment Foundation Supervisor Candidates</h1>
                    <p className="tpText">Voting for the Dash Investment Foundation Supervisors Elections 2019 has ended. The results are available on the <a className="votingLink" id="votingLink" href='/elections?tab=results&election=DIF2019'>results tab</a>.</p>
                    <div className="electionsIndexWrapper">
                    <div className="electionsIndexItem" id="nameColumn"><p className="tpColumnTitle">Candidate</p></div>
                    <div className="electionsIndexItem"><p className="tpColumnTitle">Contact</p></div>
                    <div className="electionsIndexItem"><p className="tpColumnTitle">Dash Involvement</p></div>
                    <div className="electionsIndexItem"><p className="tpColumnTitle">Candidate Profile</p></div>
                    <div className="electionsIndexItem"><p className="tpColumnTitle">Candidate Video</p></div>
                </div>
                {
                    candidateListData.length == 0 ? (
                        <div>
                            <p>Loading&hellip;</p>
                        </div>
                    ) : (
                            <div>
                                {candidateListData.DIF2019.map((post) =>
                                    <DIFCandidateListRow
                                        key={`${post.id}`}
                                        airtableData={post}      // Elements for the Month report list    
                                    />
                                )}
                            </div>
                        )
                }
                </section>
                <section className="tpPageTopSection" value={electionId == "TPE2020" ? "Active" : "Inactive"}>
                <h1 className="tpHeader">2020 Dash Trust Protector Candidates</h1>
                <p className="tpText">Voting for the Trust Protectors Elections 2020 has ended. The results are available on the <a className="votingLink" id="votingLink" href='/elections?tab=results&election=TPE2020'>results tab</a>.</p>
                <div className="electionsIndexWrapper">
                    <div className="electionsIndexItemFirst"><p className="tpColumnTitle">Candidate</p></div>
                    <div className="electionsIndexItem"><p className="tpColumnTitle">Contact</p></div>
                    <div className="electionsIndexItem"><p className="tpColumnTitle">Dash Involvement</p></div>
                    <div className="electionsIndexItem"><p className="tpColumnTitle">Profile Link</p></div>
                </div>
                {
                    candidateListData.length == 0 ? (
                        <div>
                            <p>Loading&hellip;</p>
                        </div>
                    ) : (
                            <div>
                                {candidateListData.TPE2020.map((post) =>
                                    <TPECandidateListRow
                                        key={`${post.id}`}
                                        airtableData={post}      // Elements for the Month report list    
                                    />
                                )}
                            </div>
                        )
                }
                </section>  
                <section className="tpPageTopSection" value={electionId == "DIF2020" ? "Active" : "Inactive"}>
                    <h1 className="tpHeader">2020 Investment Foundation Supervisor Candidates</h1>
                    <p className="tpText">Voting for the Dash Investment Foundation Supervisors 2020 Elections has ended. The results are available on the <a className="votingLink" id="votingLink" href='/elections?tab=results&election=DIF2020'>results tab</a>.</p>
                    <div className="electionsIndexWrapper">
                    <div className="electionsIndexItem" id="nameColumn"><p className="tpColumnTitle">Candidate</p></div>
                    <div className="electionsIndexItem"><p className="tpColumnTitle">Contact</p></div>
                    <div className="electionsIndexItem"><p className="tpColumnTitle">Dash Involvement</p></div>
                    <div className="electionsIndexItem"><p className="tpColumnTitle">Profile Link</p></div>
                </div>
                {
                    candidateListData.length == 0 ? (
                        <div>
                            <p>Loading&hellip;</p>
                        </div>
                    ) : (
                            <div>
                                {candidateListData.DIF2020.map((post) =>
                                    <TPECandidateListRow
                                        key={`${post.id}`}
                                        airtableData={post}      // Elements for the Month report list    
                                    />
                                )}
                            </div>
                        )
                }
                </section>       
                <section className="tpPageTopSection" value={electionId == "TPE2021" ? "Active" : "Inactive"}>
                <h1 className="tpHeader">2021 Dash Trust Protector Candidates</h1>
                <p>Voting for the Trust Protectors Elections 2020 has ended. The results are available on the <a className="votingLink" id="votingLink" href='/elections?tab=results&election=TPE2021'>results tab</a>.</p>
                <div className="electionsIndexWrapper">
                    <div className="electionsIndexItemFirst"><p className="tpColumnTitle">Candidate</p></div>
                    <div className="electionsIndexItem"><p className="tpColumnTitle">Contact</p></div>
                    <div className="electionsIndexItem"><p className="tpColumnTitle">Dash Involvement</p></div>
                    <div className="electionsIndexItem"><p className="tpColumnTitle">Profile Link</p></div>
                </div>
                {
                    candidateListData.length == 0 ? (
                        <div>
                            <p>Loading&hellip;</p>
                        </div>
                    ) : (
                            <div>
                                {candidateListData.TPE2021.map((post) =>
                                    <TPECandidateListRow
                                        key={`${post.id}`}
                                        airtableData={post}      // Elements for the Month report list    
                                    />
                                )}
                            </div>
                        )
                }
                </section>   
                <section className="tpPageTopSection" value={electionId == "DIF2021" ? "Active" : "Inactive"}>
                    <h1 className="tpHeader">2021 DIF Supervisor Candidates</h1>
                    <p className="tpText">Voting for the Dash Investment Foundation Supervisors 2021 will start on Monday June 28, 2021.</p>
                    <div className="electionsIndexWrapper">
                    <div className="electionsIndexItem" id="nameColumn"><p className="tpColumnTitle">Candidate</p></div>
                    <div className="electionsIndexItem"><p className="tpColumnTitle">Contact</p></div>
                    <div className="electionsIndexItem"><p className="tpColumnTitle">Dash Involvement</p></div>
                    <div className="electionsIndexItem"><p className="tpColumnTitle">Profile Link</p></div>
                </div>
                {
                    candidateListData.length == 0 ? (
                        <div>
                            <p>Loading&hellip;</p>
                        </div>
                    ) : (
                            <div>
                                {candidateListData.DIF2021.map((post) =>
                                    <TPECandidateListRow
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
class DIFCandidateListRow extends React.Component {
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
            video_link,
        } = this.props.airtableData

        // Code to generate involvement link
        let involvementLink = null;
        if (typeof dash_involvement == "undefined") { // If report is pending show "Pending"
            involvementLink = (
                <div className="electionsItem"></div>
            )
        } else if (typeof dash_involvement_link == "undefined") {  // If report is published, show links to report and modal
            involvementLink = (
                <div className="electionsItem">{dash_involvement}</div>
            )
        } else {
            involvementLink = (
                <div className="electionsItem"><a className="tpInvolvementLink" id="involvementLink" href={dash_involvement_link} target="_blank" title={dash_involvement_link} onClick={this.callEvent}>
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
        let profileLink = null;
        if (typeof interview_type == "undefined") { // If report is pending show "Pending"
        profileLink = (
                <div className="electionsItem"></div>
            )
        } else {  // If report is published, show links to report and modal
            if (interview_type == "Video") {
                profileLink = (
                    <div className="electionsItem"><div><a className="tpInterviewLink" id="profileLink" href={interview_link} target="_blank" title={interview_link} onClick={this.callEvent}>
                        <img className="reportIcon" id="YouTube" src="/static/images/Video.png" height="30"></img> Profile</a></div></div>
                )
            } else if (interview_type == "Text") {
                profileLink = (
                    <div className="electionsItem"><div><a className="tpInterviewLink" id="profileLink" href={interview_link} target="_blank" title={interview_link} onClick={this.callEvent}>
                        <img className="reportIcon" id="Text" src="/static/images/PDF.png" height="30"></img> Profile</a></div></div>
                )
            } else {
                profileLink = (
                    <div className="electionsItem"></div>
                )
            }
        } // End of interview link if

        let videoLink = null;
        if (typeof video_link == "undefined") { // If report is pending show "Pending"
        videoLink = (
                <div className="electionsItem"></div>
            )
        } else {  // If report is published, show links to report and modal
            videoLink = (
                <div className="electionsItem" id="linksColumn"><div><a className="tpInterviewLink" id="videoLink" href={video_link} target="_blank" title={video_link} onClick={this.callEvent}>
                    <img className="reportIcon" id="YouTube" src="/static/images/Video.png" height="30"></img> Video</a></div></div>
            )
        }

        // Output for the month list rows
        return (
            <div className="electionsRowWrapper" month="Active">
                <div className="electionsItemFirst">{candidateNameCell}</div>
                <div className="electionsItem"><p className="tpCandidateContact" title={contact}>{contact}</p></div>
                {involvementLink}
                {profileLink}
                {videoLink}
            </div>
        )
    }
}

// Component for Report List Table
class TPECandidateListRow extends React.Component {
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
                <div className="electionsItem"></div>
            )
        } else if (typeof dash_involvement_link == "undefined") {  // If report is published, show links to report and modal
            involvementLink = (
                <div className="electionsItem">{dash_involvement}</div>
            )
        } else {
            involvementLink = (
                <div className="electionsItem"><a className="tpInvolvementLink" id="involvementLink" href={dash_involvement_link} target="_blank" title={dash_involvement_link} onClick={this.callEvent}>
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
                <div className="electionsItem"></div>
            )
        } else {  // If report is published, show links to report and modal
            if (interview_type == "Video") {
                interviewLink = (
                    <div className="electionsItem" id="tpInterviewLink"><div><a className="tpInterviewLink" id="reportLink" href={interview_link} target="_blank" title={interview_link} onClick={this.callEvent}>
                        <img className="reportIcon" id="YouTube" src="/static/images/Video.png" height="30"></img> Profile</a></div></div>
                )
            } else if (interview_type == "Text") {
                interviewLink = (
                    <div className="electionsItem" id="tpInterviewLink"><div><a className="tpInterviewLink" id="reportLink" href={interview_link} target="_blank" title={interview_link} onClick={this.callEvent}>
                        <img className="reportIcon" id="Text" src="/static/images/PDF.png" height="30"></img> Profile</a></div></div>
                )
            } else {
                interviewLink = (
                    <div className="electionsItem"></div>
                )
            }
        } // End of interview link if

        // Output for the month list rows
        return (
            <div className="electionsRowWrapper" month="Active">
                <div className="electionsItemFirst">{candidateNameCell}</div>
                <div className="electionsItem"><p className="tpCandidateContact" title={contact}>{contact}</p></div>
                {involvementLink}
                {interviewLink}
            </div>
        )
    }
}

export default CandidateLists