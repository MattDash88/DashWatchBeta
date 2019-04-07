import React from 'react';
import { Line } from 'react-chartjs-2';
import ReactGA from 'react-ga';

// Analytics
import getGAKey from '../functions/analytics';
ReactGA.initialize(getGAKey);

// Import css
import '../css/style.css';
import '../css/labs.css';

const trackEvent = (event) => { // Function to track user interaction with page
    ReactGA.event({
        category: 'Labs Page',
        action: event,
    });
}

class PosSystems extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            posSystemData: props.posSystemData,
            chartData: {
                transactions: [],
                volume: [],
            },
            showChart: 'Transactions',
            showMenu: false,
            showAnypay: true,
            showPaylive: true,
            url: props.url,
            as: props.as,
        }

        // Binding functions in this class
        this.handleDatasetToggle = this.handleDatasetToggle.bind(this)
        this.handleSelectChart = this.handleSelectChart.bind(this)
        this.handleDropdown = this.handleDropdown.bind(this);
    }

    handleSelectChart(event) {
        event.preventDefault();
        this.setState({
            showChart: event.currentTarget.value,        // Change state to load different month
            showMenu: false,
            as: `/labs?chart=${event.currentTarget.value}`,
        })

        //history.pushState(this.state, '', `/labs?tab=POS`)   // Push State to history
        trackEvent(`Changed Chart to ${event.currentTarget.value}`)                 // Track Event on Google Analytics    
    }

    handleDropdown(event) {
        event.preventDefault();
        this.setState({
            showMenu: !this.state.showMenu,
        })
    }

    handleDatasetToggle(event) {
        event.preventDefault();
        if (event.currentTarget.id == 'Anypay') {
            this.setState({
                showAnypay: !this.state.showAnypay,
                chartData: {
                    transactions: [],
                    volume: [],
                },
            })
        } else if (event.currentTarget.id == 'Paylive') {
            this.setState({
                showPaylive: !this.state.showPaylive,
                chartData: {
                    transactions: [],
                    volume: [],
                },
            })
        }
    }

    componentDidMount() {
        // To handle calls from popstate when the page is called from history
        onpopstate = event => {
            if (event.state) {
                this.setState(event.state)
            }
        }
        var transactionsData = []
        var volumeData = []
        {
            this.state.showAnypay ? (
                transactionsData.push({
                    label: this.state.posSystemData[0].system_name,
                    fill: false,
                    borderColor: 'blue',
                    data: this.state.posSystemData[0].dash_transactions,    // participation data points
                }),
                volumeData.push({
                    label: this.state.posSystemData[0].system_name,
                    fill: false,
                    borderColor: 'blue',
                    data: this.state.posSystemData[0].dash_volume,    // participation data points
                })
            ) : (
                    null
                )
        }
        {
            this.state.showPaylive ? (
                transactionsData.push({
                    label: this.state.posSystemData[1].system_name,
                    fill: false,
                    borderColor: 'green',
                    data: this.state.posSystemData[1].dash_transactions,    // participation data points
                }),
                volumeData.push({
                    label: this.state.posSystemData[1].system_name,
                    fill: false,
                    borderColor: 'green',
                    data: this.state.posSystemData[1].dash_volume,    // participation data points
                })
            ) : (
                    null
                )
        }
        this.setState({
            chartData: {
                transactions: transactionsData,
                volume: volumeData,
            }
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.showAnypay !== this.state.showAnypay || prevState.showPaylive !== this.state.showPaylive) {
            var transactionsData = []
            var volumeData = []
            {
                this.state.showAnypay ? (
                    transactionsData.push({
                        label: this.state.posSystemData[0].system_name,
                        fill: false,
                        borderColor: 'blue',
                        data: this.state.posSystemData[0].dash_transactions,    // participation data points
                    }),
                    volumeData.push({
                        label: this.state.posSystemData[0].system_name,
                        fill: false,
                        borderColor: 'blue',
                        data: this.state.posSystemData[0].dash_volume,    // participation data points
                    })
                ) : (
                        null
                    )
            }
            {
                this.state.showPaylive ? (
                    transactionsData.push({
                        label: this.state.posSystemData[1].system_name,
                        fill: false,
                        borderColor: 'green',
                        data: this.state.posSystemData[1].dash_transactions,    // participation data points
                    }),
                    volumeData.push({
                        label: this.state.posSystemData[1].system_name,
                        fill: false,
                        borderColor: 'green',
                        data: this.state.posSystemData[1].dash_volume,    // participation data points
                    })
                ) : (
                        null
                    )
            }
            this.setState({
                chartData: {
                    transactions: transactionsData,
                    volume: volumeData,
                }
            })
        }
    }


    render() {
        const {     // Elements passed down to the component
            showChart,
            chartData,
        } = this.state

        const transactionData = {  // Data styling for the chart
            datasets: this.state.chartData.transactions
        };

        const volumeData = {  // Data styling for the chart
            datasets: this.state.chartData.volume
        };

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

        return (
            <main>
                <h1 className="labsHeader">Point-Of-Sale Systems</h1>
                <p className="labsText">Select a metric:</p>
                <div className="dropdown" id="dropdownmenu">
                    <div id="dropdownMenu" onClick={this.handleDropdown} className="dropbtn"><i id="dropdownMenu"></i>{showChart}</div>
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
                    <div id="Anypay" onClick={this.handleDatasetToggle} className="databtn" value={this.state.showAnypay ? "Active" : "Inactive"}>Anypay</div>
                    <div id="Paylive" onClick={this.handleDatasetToggle} className="databtn" value={this.state.showPaylive ? "Active" : "Inactive"}>Paylive</div>
                </div>
                <section className="chartSection" value={this.state.showChart == "Transactions" ? "Active" : "Inactive"}>
                    <Line
                        data={transactionData}
                        options={optionsTransactions}
                    />
                </section>
                <section className="chartSection" value={this.state.showChart == "Volume" ? "Active" : "Inactive"}>
                    <Line
                        data={volumeData}
                        options={optionsVolume}
                    />
                </section>

            </main>
        )
    }
}

export default PosSystems