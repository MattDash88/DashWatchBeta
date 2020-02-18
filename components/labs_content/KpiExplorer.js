import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Dropdown,
    Label,
    Segment,
    Button,
    Divider,
    Message,
    Icon,
    Grid,
} from 'semantic-ui-react';

// Analytics
import { trackEvent } from '../functions/analytics';

// Import functions for charts
import chartFunctions from './labs_functions/chartFunctions';
import fetchingFunctions from './labs_functions/fetchingFunctions';

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

class KpiExplorer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            projectList: '',
            segmentSet: {},
        }

        // Bind functions used in class
        this.onRemoveChart = this.onRemoveChart.bind(this);
        this.onChartChange = this.onChartChange.bind(this);
    }

    // Function to add a new chart component
    onAddChart = (e, { }) => {
        event.preventDefault();
        let stateObject = this.state.segmentSet;
        var uuid = uuidv4()     // Generate a unique uuid for the chart component that will be rendered

        // Create an element for the new chart in the Array of chart object
        stateObject[uuid] = {
            proposalID: '',
            kpiID: '',
            id: uuid,
        };

        // Push the new array (that now includes the new chart object) to state
        this.setState({
            segmentSet: stateObject,
        })
    }

    // Function to remove a chart component
    onRemoveChart(value) {
        let stateObject = this.state.segmentSet;    // Read the array of chart objects from state
        delete stateObject[value]                   // Remove the closed chart objects from the array

        // Push the new array (without the closed chart object) to state
        this.setState({
            segmentSet: stateObject,
        })
    }

    // Function to process state changes when changes are made in a chart component
    onChartChange(proposalID, kpiID, uuid) {
        event.preventDefault();
        let stateObject = this.state.segmentSet;

        const newState = {
            proposalID: proposalID,
            kpiID: kpiID,
            id: uuid,
        }

        stateObject[uuid] = newState

        this.setState({
            segmentSet: stateObject,
        })
    }

    componentDidMount() {
        var proposalListPromise = Promise.resolve(fetchingFunctions.getLabsListOfProjects())

        // Create a list of projects to feed to chart segments
        Promise.all([proposalListPromise]).then(data => {
            const proposalList = data[0]
            this.setState({
                projectList: proposalList,
            })
        })

        // Make an empty object for the first chart segment
        var uuid = uuidv4()
        const stateObject = {}
        stateObject[uuid] = {
            proposalID: '',
            kpiID: '',
            id: uuid,
        };
        this.setState({
            segmentSet: stateObject,
        })
    }

    render() {
        const {
            projectList,
            segmentSet,
        } = this.state

        return (
            <main style={{
                marginLeft: '20px',
                marginRight: '20px',
              }}>
                {   // Show Add chart button if all Chart components have been removed
                    (Object.keys(segmentSet).length == 0) && (
                        <section>
                            <Grid columns={3} centered stackable>
                                <Grid.Column key={'button'} mobile={16} tablet={8} computer={8} widescreen={5}>
                                    <Button primary onClick={this.onAddChart}>
                                        Add Chart
                                    </Button>
                                </Grid.Column>
                            </Grid>
                        </section>
                    )
                }                
                {   // Render a grid of chart components
                    (Object.keys(segmentSet).length !== 0) && (
                        <section>
                            <Grid columns={3} centered stackable>
                                {Object.values(segmentSet).map((item) =>
                                    <Grid.Column mobile={16} tablet={8} computer={8} widescreen={5} key={item.id} >
                                        <ProposalKpiChart
                                            proposalID={item.proposalID}
                                            kpiID={item.kpiID}
                                            projectList={projectList}
                                            segmentID={item.id}
                                            onRemoveChart={this.onRemoveChart}
                                            onChartChange={this.onChartChange}
                                        />
                                    </Grid.Column>
                                )}
                                {   // Show add chart button if there are fewer than 11 charts
                                    (Object.keys(segmentSet).length < 12) && (
                                        <Grid.Column key={'button'} mobile={16} tablet={8} computer={8} widescreen={5}>
                                            <Button primary onClick={this.onAddChart}>
                                                Add Chart
                                            </Button>
                                        </Grid.Column>
                                    )}
                            </Grid>
                        </section>
                    )}
            </main>
        )
    }
}

class ProposalKpiChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shouldRedraw: false,            // Toggle redraw for charts
            proposalName: 'None Selected',  // Display state for readable proposal name
            segmentID: props.segmentID,     // ID of this component, given upon creation in kpiExplorer component
            proposalID: props.proposalID,   // GUUID of the proposal, read from database
            kpiID: props.kpiID,             // GUUID of the kpi, read from database

            kpiList: '',
            kpiDetails: '',
            kpiChartData: '',
        }
        // Binding functions used in this Class
        this.handleProposalChange = this.handleProposalChange.bind(this)
        this.handleKpiChange = this.handleKpiChange.bind(this)
        this.handleCloseChart = this.handleCloseChart.bind(this)
    }

    // Function to handle the selection of a new proposal from dropdown
    handleProposalChange(e, { key, value, text }) {
        this.props.onChartChange(value.projectID, '', this.state.segmentID)
        console.log(value)
        this.setState({
            proposalName: value.projectName,
            proposalID: value.projectID,
        })
    }

    // Function to handle the selection of a new KPI from dropdown
    handleKpiChange(e, { key, value, text }) {
        this.props.onChartChange(this.state.proposalID, value, this.state.segmentID)

        this.setState({
            kpiID: value,
        })
    }

    // Function to handle closing the chart
    handleCloseChart(e, { key, value, text }) {
        this.props.onRemoveChart(value)
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
            if (this.state.kpiID == '') {
                this.setState({
                    kpiDetails: '',
                    kpiChartData: '',
                })
            } else {
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
    }

    render() {
        const {
            proposalName,
            segmentID,

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
        const placeholderDataset = chartFunctions.createBlankDataset()

        return (
            <main>
                <Segment
                    attached='top'
                >
                    <Label ribbon>KPI Metrics for {proposalName}</Label>
                    <Button
                        onClick={this.handleCloseChart}
                        floated='right'
                        value={segmentID}
                    >
                        <Icon name='close' />Close chart
                    </Button>
                    <Divider hidden />
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
                    {   // Empty chart
                        kpiChartData.length == 0 &&
                        <Line
                            data={placeholderDataset}
                        />
                    }
                    {   // Populated chart
                        kpiChartData.length !== 0 &&
                        <Line
                            data={kpiChartData}
                            options={kpiChartsOptions}
                        />
                    }
                    { kpiDetails !== '' && (
                        <Message>
                            <p>{kpiDetails.kpi_description}.</p>
                            <p><a id="projectKpiRawLink" href={`/api/dataset/labsKpiData?kpi=${kpiDetails.unique_id}`}> CLICK HERE FOR THE RAW DATA</a></p>
                        </Message>
                    )
                    }
                   
                </Segment>
            </main>
        )
    }
}

export default KpiExplorer
