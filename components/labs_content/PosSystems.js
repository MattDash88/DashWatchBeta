import React from 'react';
import { Line } from 'react-chartjs-2';

// Analytics
import {trackEvent} from '../functions/analytics';

// Import css
import '../css/style.css';
import '../css/labs.css';

const buildContent = (labsData, queries) => {
    try {
        var transactionsData = []
        var volumeData = []
        {
            queries.showAnypay ? (
                transactionsData.push({
                    label: labsData[0].system_name,
                    fill: false,
                    borderColor: 'blue',
                    data: labsData[0].dash_transactions,    // participation data points
                }),
                volumeData.push({
                    label: labsData[0].system_name,
                    fill: false,
                    borderColor: 'blue',
                    data: labsData[0].dash_volume,    // participation data points
                })
            ) : (
                    null
                )
        }
        {
            queries.showPaylive ? (
                transactionsData.push({
                    label: labsData[1].system_name,
                    fill: false,
                    borderColor: 'green',
                    data: labsData[1].dash_transactions,    // participation data points
                }),
                volumeData.push({
                    label: labsData[1].system_name,
                    fill: false,
                    borderColor: 'green',
                    data: labsData[1].dash_volume,    // participation data points
                })
            ) : (
                    null
                )
        }

        const optionsTransactions = {
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        unit: 'month'
                    },
                    distribution: "series",
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Transactions per Month'
                    },
                }]
            }
        }

        const optionsVolume = {
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        unit: 'month'
                    },
                    distribution: "series",
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Transaction Volume per Month (Dash)'
                    },
                }]
            }
        }
        const pageContent = {   // Elements that are used in page rendering
            proposalOwnerLink:
                <div>
                    <span className="labsText">
                        <a id="Proposal Owner Link" href={`/proposals?search=${labsData[0].system_proposal_owner}`} target="" >Link to Proposal Owner {labsData[0].system_name}</a>
                    </span><br></br>
                    <span className="labsText">
                        <a id="Proposal Owner Link" href={`/proposals?search=${labsData[1].system_proposal_owner}`} target="" >Link to Proposal Owner {labsData[1].system_name}</a>
                    </span>
                </div>
        }

        if (queries.showChart == 'Transactions') {
            var chartData = { datasets: transactionsData }
            var options = optionsTransactions
        } else if (queries.showChart == 'Volume') {
            var chartData = { datasets: volumeData }
            var options = optionsVolume
        } else {
            chartData = { datasets: [] }
            options = []
        }
        return {
            chartData: chartData,
            options: options,
            pageContent: pageContent,
        }
    } catch (e) {
        const pageContent = {   // Elements that are used in page rendering
            proposalOwnerLink:
                <div></div>
        }
        return {
            chartData: { datasets: [] },
            options: [],
            pageContent: pageContent,
        }
    }
}

const chartFunction = (chartData, options, redrawState) => {
    try {
        var chartObject = 
            <div>
            <Line
                data={chartData}
                options={options}
                redraw={redrawState}
            />
            </div>
        
        return chartObject
    }
    catch (error) {
        var chartObject = 
            <div>
                Please select a valid dataset
            </div>
        
        return chartObject
    }
}

class PosSystems extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showMenu: false,        // Dropdown Menu Toggle
            shouldRedraw: false,    // Toggle redraw of charts
        }

        // Binding functions in this class
        this.handleDatasetToggle = this.handleDatasetToggle.bind(this)
        this.handleSelectChart = this.handleSelectChart.bind(this)
        this.handleDropdown = this.handleDropdown.bind(this);
        this.handleClick = this.handleClick.bind(this);                 // Function for event listener to close dropdown menus
        this.handleQueries = this.handleQueries.bind(this);             // Send queries to main labs Class       
    }

    // Dropdown list for KPIs
    handleDropdown(event) {
        event.preventDefault();
        this.setState({
            showMenu: !this.state.showMenu,
            shouldRedraw: false,
        })
        trackEvent('Labs Page', `Clicked POS KPI dropdown`)
    }

    // Function to handle selection of item from the KPI dropdown menu
    handleSelectChart(event) {
        this.setState({
            showMenu: false,
            shouldRedraw: true,
        })

        const queries = {
            anypay: this.props.showAnypay,
            paylive: this.props.showPaylive,
            POSChart: event.currentTarget.value,
        }

        this.handleQueries(queries)     // Send queries to main Labs file
        trackEvent('Labs Page', `Changed Chart to ${event.currentTarget.value}`)                 // Track Event on Google Analytics    
    }

    // Function to toggle datasets on or off
    handleDatasetToggle(event) {
        this.setState({
            shouldRedraw: true,
        })

        const queries = {
            anypay: event.currentTarget.id == 'Anypay' ? !this.props.showAnypay : this.props.showAnypay,
            paylive: event.currentTarget.id == 'Paylive' ? !this.props.showPaylive : this.props.showPaylive,
            POSChart: this.props.showPosChart,
        }

        this.handleQueries(queries)     // Send queries to main Labs file
        trackEvent('Labs Page', `Toggled ${event.currentTarget.id}`)
    }

    // Function to push queries to main labs Class
    handleQueries(queries) {
        this.props.queryFunction('possystems', queries)
    }  

    // Function ran when the eventlistener is activated. Close dropdown menu if clicked outside of it
    handleClick = (event) => {
        if (event.target.id !== "dropdownMenu") {
        this.setState({
            showMenu: false,
            shouldRedraw: false,
        })
        trackEvent('Labs Page', `Clicked on Labs POS Systems page`) 
        }
      }

    componentDidMount() {
        window.addEventListener('mousedown', this.handleClick);     // Handles closing of dropdown menu
    }

    componentWillUnmount() {       
        window.removeEventListener('mousedown', this.handleClick);  // Stop event listener when modal is unloaded
    }

    render() {
        const { // Declare data arrays used in class
            posSystemData,
        } = this.props

        const tabQueries = {
            showChart: this.props.showPosChart,
            showAnypay: typeof this.props.showAnypay == 'undefined' ? true : this.props.showAnypay,
            showPaylive: typeof this.props.showPaylive == 'undefined' ? true : this.props.showPaylive,
        }

        const content = buildContent(posSystemData, tabQueries)

        const {
            chartData,
            options,
            pageContent
        } = content

        var chartObject = chartFunction(chartData, options, this.state.shouldRedraw)

        return (
            <main>
                <h1 className="labsHeader">Point-Of-Sale Systems</h1>
                <p className="labsText">Select a metric:</p>
                <div className="labsDropdown" id="dropdownmenu">
                    <div id="dropdownMenu" onClick={this.handleDropdown} className="labsDropbtn"><i id="dropdownMenu"></i>{tabQueries.showChart}</div>
                    {
                        this.state.showMenu ? (
                            <div className="labsDropdownMenu" id="dropdownMenu">
                                <button id="dropdownMenu" value="Transactions" className="labsDropdownItem" onClick={this.handleSelectChart}>Transactions</button>
                                <button id="dropdownMenu" value="Volume" className="labsDropdownItem" onClick={this.handleSelectChart}>Volume</button>
                            </div>
                        ) : (
                                null
                            )
                    }
                </div>
                <p className="labsText">Toggle datasets:</p>
                <div>
                    <div id="Anypay" onClick={this.handleDatasetToggle} className="labsDatabtn" value={tabQueries.showAnypay ? "Active" : "Inactive"}>Anypay</div>
                    <div id="Paylive" onClick={this.handleDatasetToggle} className="labsDatabtn" value={tabQueries.showPaylive ? "Active" : "Inactive"}>Paylive</div>
                </div>
                <section>
                {pageContent.proposalOwnerLink}
                {chartObject}
                </section>
            </main>
        )
    }
}

export default PosSystems