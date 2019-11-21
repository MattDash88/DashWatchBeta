import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Container,
    Dropdown,
    Label,
    Form,
    Checkbox,
    Segment,
    Button,
    Divider,
    TextArea,
    Input,
    Message,
    Dimmer,
    Menu,
    Header,
    Icon,
    Loader,
    Grid,
} from 'semantic-ui-react';

// Analytics
import { trackEvent } from '../functions/analytics';

// Import functions for charts
import chartFunctions from './labs_functions/chartFunctions';
import fetchingFunctions from './labs_functions/fetchingFunctions';

class KpiExplorer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            projectList: '',
        }
    }

    componentDidMount() {
        var proposalListPromise = Promise.resolve(fetchingFunctions.getLabsListOfProjects())

        Promise.all([proposalListPromise]).then(data => {
            const proposalList = data[0]

            this.setState({
                projectList: proposalList,
            })
        })
    }

    render() {
        const {
            projectList,
        } = this.state
        return (
            <Container fluid style={{
                marginLeft: '20px',
            }}>
                <Grid stackable columns='three'>
                    <Grid.Row stretched>
                        <Grid.Column width={8}>
                            <ProposalKpiChart
                                projectList={projectList}
                            />
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <ProposalKpiChart
                                projectList={projectList}
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={8}>
                            <ProposalKpiChart
                                projectList={projectList}
                            />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        )
    }
}

class ProposalKpiChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shouldRedraw: false,    // Toggle redraw for charts
            proposalName: 'None Selected',
            proposalID: '',
            kpiID: '',

            kpiList: '',
            kpiDetails: '',
            kpiChartData: '',
        }
        // Binding functions used in this Class
        this.handleProposalChange = this.handleProposalChange.bind(this)
        this.handleKpiChange = this.handleKpiChange.bind(this)
    }

    handleProposalChange(e, { key, value, text }) {
        this.setState({
            proposalName: text,
            proposalID: value,
        })
    }

    handleKpiChange(e, { key, value, text }) {
        this.setState({
            kpiID: value,
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.proposalID !== this.state.proposalID) {// Just a history state update because it doesn't always work as desired in functions

            var kpiListPromise = Promise.resolve(fetchingFunctions.getLabsListOfKpis(this.state.proposalID))

            Promise.all([kpiListPromise]).then(data => {
                const kpiList = data[0]

                this.setState({
                    kpiList: kpiList,
                })
            })
        }

        if (prevState.kpiID !== this.state.kpiID) {// Just a history state update because it doesn't always work as desired in functions

            var kpiDataPromise = Promise.resolve(fetchingFunctions.getLabsKpiDataset(this.state.kpiID))

            Promise.all([kpiDataPromise]).then(data => {
                const kpiData = data[0].dataset
                const kpiDetails = data[0].info

                const kpiChartData = chartFunctions.buildChartDataset(kpiData, kpiDetails.axis_title, 0)

                this.setState({
                    kpiDetails: kpiDetails,
                    kpiChartData: {
                        datasets: [kpiChartData]
                    },
                })
            })
        }
    }

    render() {
        const {
            proposalName,
            kpiList,
            kpiDetails,
            kpiChartData,
        } = this.state

        const {
            projectList,
        } = this.props

        const proposalDropdownOptions = chartFunctions.createProposalDropdownList(projectList)
        const kpiDropdownOptions = chartFunctions.createKpiDropdownList(kpiList)

        const kpiChartsOptions = chartFunctions.buildChartOptions(kpiDetails.kpi_name)
        console.log(kpiList)
        return (
            <main>
                <Segment attached='top'>
                    <Label ribbon>KPI Metrics for {proposalName}</Label>
                    {
                        (projectList.length !== 0) && (
                            <Dropdown
                                placeholder='Select a proposal'
                                scrolling
                                search
                                clearable
                                selection
                                options={proposalDropdownOptions}
                                onChange={this.handleProposalChange}
                            />
                        )
                    }
                    {
                        (kpiList.length !== 0) && (
                            <Dropdown
                                placeholder='Select a proposal'
                                scrolling
                                search
                                clearable
                                selection
                                options={kpiDropdownOptions}
                                onChange={this.handleKpiChange}
                            />
                        )
                    }
                    {
                        kpiChartData.length !== 0 &&
                        <Line
                            data={kpiChartData}
                            options={kpiChartsOptions}
                        />
                    }
                    <Message>
                        <p>
                            Placeholder Message. <a id="projectKpiRawLink" href={`/api/dataset/labsKpiData?kpi=${kpiDetails.unique_id}`}> CLICK HERE FOR THE RAW DATA</a>
                        </p>
                    </Message>
                </Segment>
            </main>
        )
    }
}

export default KpiExplorer
