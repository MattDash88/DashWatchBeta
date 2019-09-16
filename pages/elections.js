import fetch from 'isomorphic-unfetch';
import React from 'react';
import 'semantic-ui-react'
import {
    Container,
    Dropdown,
    Label,
    Form,
    Checkbox,
    Segment,
    Table,
    Menu,
    Icon,
    Button,
    Divider,
    TextArea,
    Input,
    Message,
    Dimmer,
} from 'semantic-ui-react';

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

class PollSection extends React.Component {
    static async getInitialProps(ctx) {
        const props = {
            tab: typeof ctx.query.tab == "undefined" ? "candidates" : ctx.query.tab,   // Default no month to latest
            election: typeof ctx.query.tab == "undefined" ? "DIF2019" : ctx.query.election,   // Default no month to latest
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

        //this.handleClick = this.handleClick.bind(this)
    }

    render() {
        const { // Declare data arrays used in class
        } = this.state

        return (
            <main className="ui container" style={{
                marginTop: '20px',
            }}>
                <Header></Header>

                <Container>
                    <Segment>
                        <h2>Dash Watch Polling Section</h2>
                    </Segment>
                    <Segment>
                        <h3>Current polls</h3>
                        <Table selectable>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Poll Title</Table.HeaderCell>
                                    <Table.HeaderCell>Poll Deadline</Table.HeaderCell>
                                    <Table.HeaderCell>Poll URL</Table.HeaderCell>
                                    <Table.HeaderCell>More info</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell>Cell</Table.Cell>
                                    <Table.Cell>Cell</Table.Cell>
                                    <Table.Cell>Cell</Table.Cell>
                                    <Table.Cell>Cell</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>Cell</Table.Cell>
                                    <Table.Cell>Cell</Table.Cell>
                                    <Table.Cell>Cell</Table.Cell>
                                    <Table.Cell>Cell</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>Cell</Table.Cell>
                                    <Table.Cell>Cell</Table.Cell>
                                    <Table.Cell>Cell</Table.Cell>
                                    <Table.Cell>Cell</Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table>
                    </Segment>
                    <Segment>
                        <h3>Old polls</h3>
                        <Table celled>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Poll Title</Table.HeaderCell>
                                    <Table.HeaderCell>Poll Deadline</Table.HeaderCell>
                                    <Table.HeaderCell>More info and Results</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell>Cell</Table.Cell>
                                    <Table.Cell>Cell</Table.Cell>
                                    <Table.Cell>Cell</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>Cell</Table.Cell>
                                    <Table.Cell>Cell</Table.Cell>
                                    <Table.Cell>Cell</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>Cell</Table.Cell>
                                    <Table.Cell>Cell</Table.Cell>
                                    <Table.Cell>Cell</Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table>
                    </Segment>
                </Container>
            </main>
        )
    }
}

export default PollSection