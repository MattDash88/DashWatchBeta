import React from 'react';
import { Line } from 'react-chartjs-2';
import ReactGA from 'react-ga';

// Analytics
import {getGAKey, trackEvent} from '../functions/analytics';
ReactGA.initialize(getGAKey);

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
                    <p className="labsText">
                        <a id="Proposal Owner Link" href={`/proposals?search=${labsData[0].system_proposal_owner}`} target="" >Link to Proposal Owner {labsData[0].system_name}</a>
                    </p><br></br>
                    <p className="labsText">
                        <a id="Proposal Owner Link" href={`/proposals?search=${labsData[1].system_proposal_owner}`} target="" >Link to Proposal Owner {labsData[1].system_name}</a>
                    </p>
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

class PosSystems extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showMenu: false,
        }

        // Binding functions in this class
        this.handleDatasetToggle = this.handleDatasetToggle.bind(this)
        this.handleSelectChart = this.handleSelectChart.bind(this)
        this.handleDropdown = this.handleDropdown.bind(this);
        this.handleQueries = this.handleQueries.bind(this);
    }

    handleSelectChart(event) {
        event.preventDefault();
        this.setState({
            showMenu: false,
        })

        const queries = {
            anypay: this.props.tabQueries.showAnypay,
            paylive: this.props.tabQueries.showPaylive,
            chart: event.currentTarget.value,
        }

        this.handleQueries(queries)
        trackEvent('Labs Page', `Changed Chart to ${event.currentTarget.value}`)                 // Track Event on Google Analytics    
    }

    handleDropdown(event) {
        event.preventDefault();
        this.setState({
            showMenu: !this.state.showMenu,
        })
    }

    handleDatasetToggle(event) {
        event.preventDefault();
        const queries = {
            anypay: event.currentTarget.id == 'Anypay' ? !this.props.tabQueries.showAnypay : this.props.tabQueries.showAnypay,
            paylive: event.currentTarget.id == 'Paylive' ? !this.props.tabQueries.showPaylive : this.props.tabQueries.showPaylive,
            chart: this.props.tabQueries.showChart,
        }

        this.handleQueries(queries)
        trackEvent('Labs Page', `Toggled ${event.currentTarget.id}`)
    }

    // Function to push queries to main labs Class
    handleQueries(queries) {
        this.props.queryFunction('possystems', queries)
    }  

    render() {
        const { // Declare data arrays used in class
            posSystemData,
        } = this.props

        const tabQueries = {
            showChart: typeof this.props.tabQueries.showChart == 'undefined' ? "Transactions" : this.props.tabQueries.showChart,
            showAnypay: typeof this.props.tabQueries.showAnypay == 'undefined' ? true : this.props.tabQueries.showAnypay,
            showPaylive: typeof this.props.tabQueries.showPaylive == 'undefined' ? true : this.props.tabQueries.showPaylive,
        }

        const content = buildContent(posSystemData, tabQueries)

        const {
            chartData,
            options,
            pageContent
        } = content

        return (
            <main>
                <h1 className="labsHeader">Point-Of-Sale Systems</h1>
                <p className="labsText">Select a metric:</p>
                <div className="dropdown" id="dropdownmenu">
                    <div id="dropdownMenu" onClick={this.handleDropdown} className="dropbtn"><i id="dropdownMenu"></i>{tabQueries.showChart}</div>
                    {
                        this.state.showMenu ? (
                            <div className="dropdownMenu" id="dropdownMenu">
                                <button id="dropdownMenu" value="Transactions" className="dropdownItem" onClick={this.handleSelectChart}>Transactions</button>
                                <button id="dropdownMenu" value="Volume" className="dropdownItem" onClick={this.handleSelectChart}>Volume</button>
                            </div>
                        ) : (
                                null
                            )
                    }
                </div>
                <p className="labsText">Toggle datasets:</p>
                <div>
                    <div id="Anypay" onClick={this.handleDatasetToggle} className="databtn" value={tabQueries.showAnypay ? "Active" : "Inactive"}>Anypay</div>
                    <div id="Paylive" onClick={this.handleDatasetToggle} className="databtn" value={tabQueries.showPaylive ? "Active" : "Inactive"}>Paylive</div>
                </div>
                <section className="chartSection" value="Active">
                {pageContent.proposalOwnerLink}
                    <Line
                        data={chartData}
                        options={options}
                    />
                </section>
            </main>
        )
    }
}

export default PosSystems