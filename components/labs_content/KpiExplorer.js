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
    Placeholder,
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
        this.onChartChange = this.onChartChange.bind(this);
    }

    onAddChart = (e, { }) => {
        let stateObject = this.state.segmentSet;
        var uuid = uuidv4()
        stateObject[uuid] = {
            proposalID: '',
            kpiID: '',
            id: uuid,
        };

        this.setState({
            segmentSet: stateObject,
        })
    }

    onRemoveChart = (e, { value }) => {
        let stateObject = this.state.segmentSet;

        delete stateObject[value]

        this.setState({
            segmentSet: stateObject,
        })
    }

    onChartChange(proposalID, kpiID, uuid) {
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
            <Container fluid style={{
                marginLeft: '20px',
            }}>
                {
                    (Object.keys(segmentSet).length !== 0) && (
                        <section>
                            <Grid columns={3} stackable>
                                {Object.values(segmentSet).map((item) =>
                                    <Grid.Column key={item.id} mobile={16} tablet={8} computer={5}>
                                        <ProposalKpiChart
                                            proposalID={item.proposalID}
                                            kpiID={item.kpiID}
                                            projectList={projectList}
                                            segmentID={item.id}

                                            onChartChange={this.onChartChange}
                                        />
                                        <Button
                                            onClick={this.onRemoveChart}
                                            value={item.id}
                                        >
                                            Remove Item
                                        </Button>
                                    </Grid.Column>
                                )}
                                {
                                    (Object.keys(segmentSet).length < 12) && (
                                    <Grid.Column key={'button'} mobile={16} tablet={8} computer={5}>
                                            <Button onClick={this.onAddChart}>
                                                Add Item
                                            </Button>
                                    </Grid.Column>
                                    )}
                            </Grid>
                        </section>
                    )}
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
            segmentID: props.segmentID,
            proposalID: props.proposalID,
            kpiID: props.kpiID,

            kpiList: '',
            kpiDetails: '',
            kpiChartData: '',
        }
        // Binding functions used in this Class
        this.handleProposalChange = this.handleProposalChange.bind(this)
        this.handleKpiChange = this.handleKpiChange.bind(this)
    }

    handleProposalChange(e, { key, value, text }) {
        this.props.onChartChange(value, '', this.state.segmentID)

        this.setState({
            proposalName: text,
            proposalID: value,
        })
    }

    handleKpiChange(e, { key, value, text }) {
        this.props.onChartChange(this.state.proposalID, value, this.state.segmentID)

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
            proposalID,
            kpiID,
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
