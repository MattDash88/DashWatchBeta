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
        var totalDownloads = []
        var desktopDownloads = []
        var mobileDownloads = []
        {
            queries.showDashCore ? (
                totalDownloads.push({
                    label: labsData[0].wallet_name,
                    fill: false,
                    borderColor: 'blue',
                    data: labsData[0].total_downloads,    // participation data points
                }),
                desktopDownloads.push({
                    label: labsData[0].wallet_name,
                    fill: false,
                    borderColor: 'blue',
                    data: labsData[0].desktop_downloads,    // participation data points
                }),
                mobileDownloads.push({
                    label: labsData[0].wallet_name,
                    fill: false,
                    borderColor: 'blue',
                    data: labsData[0].mobile_downloads,    // participation data points
                })
            ) : (
                    null
                )
        }
        {
            queries.showElectrum ? (
                totalDownloads.push({
                    label: labsData[1].wallet_name,
                    fill: false,
                    borderColor: 'purple',
                    data: labsData[1].total_downloads,    // participation data points
                }),
                desktopDownloads.push({
                    label: labsData[1].wallet_name,
                    fill: false,
                    borderColor: 'purple',
                    data: labsData[1].desktop_downloads,    // participation data points
                }),
                mobileDownloads.push({
                    label: labsData[1].wallet_name,
                    fill: false,
                    borderColor: 'purple',
                    data: labsData[1].mobile_downloads,    // participation data points
                })
            ) : (
                    null
                )
            queries.showCoreAndroid ? (
                totalDownloads.push({
                    label: 'Core Android',
                    fill: false,
                    borderColor: 'green',
                    data: [],    // participation data points
                }),
                desktopDownloads.push({
                    label: 'Core Android',
                    fill: false,
                    borderColor: 'green',
                    data: [],    // participation data points
                }),
                mobileDownloads.push({
                    label: 'Core Android',
                    fill: false,
                    borderColor: 'green',
                    data: [],    // participation data points
                })
            ) : (
                    null
                )
        }

        const options = {
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
                        labelString: 'Downloads per Month'
                    },
                }]
            }
        }

        const pageContent = {   // Elements that are used in page rendering
            proposalOwnerLink:
                <div>
                    <p className="labsText">
                        <a id="Proposal Owner Link" href={`/proposals?search=${labsData[1].wallet_proposal_owner}`} target="" >Link to Proposal Owner {labsData[1].wallet_name}</a>
                    </p>
                </div>
        }

        if (queries.showChart == 'Total') {
            var chartData = { datasets: totalDownloads }
        } else if (queries.showChart == 'Desktop') {
            var chartData = { datasets: desktopDownloads }
        } else if (queries.showChart == 'Mobile') {
            var chartData = { datasets: mobileDownloads }
        } else {
            chartData = { datasets: [] }
        }
        return {
            chartData: chartData,
            options: options,
            pageContent: pageContent,
        }
    } catch (e) {
        const pageContent = {   // Elements that are used in page rendering
            proposalOwnerLink: <div></div>,
        }
        return {
            chartData: { datasets: [] },
            options: [],
            pageContent: pageContent,
        }
    }
}

class Wallets extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showMenu: false,
        }

        // Binding functions used in this Class
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
            dashCore: this.props.tabQueries.showDashCore,
            electrum: this.props.tabQueries.showElectrum,
            coreAndroid: this.props.tabQueries.coreAndroid,
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
            dashCore: event.currentTarget.id == 'Dash Core' ? !this.props.tabQueries.showDashCore : this.props.tabQueries.showDashCore,
            electrum: event.currentTarget.id == 'DashElectrum' ? !this.props.tabQueries.showElectrum : this.props.tabQueries.showElectrum,
            coreAndroid: event.currentTarget.id == 'Core Android' ? !this.props.tabQueries.showCoreAndroid : this.props.tabQueries.showCoreAndroid,
            chart: this.props.tabQueries.showChart,
        }

        this.handleQueries(queries)
        trackEvent('Labs Page', `Toggled ${event.currentTarget.id}`)                 // Track Event on Google Analytics 
    }

    handleQueries(queries) {
        this.props.queryFunction('wallets', queries)
    }

    render() {
        const { // Declare data arrays used in class
            walletData,
            versionData,
        } = this.props

        const tabQueries = {
            showChart: typeof this.props.tabQueries.showChart == 'undefined' ? "Total" : this.props.tabQueries.showChart,
            showDashCore: typeof this.props.tabQueries.showDashCore == 'undefined' ? true : this.props.tabQueries.showDashCore,
            showElectrum: typeof this.props.tabQueries.showElectrum == 'undefined' ? true : this.props.tabQueries.showElectrum,
            showCoreAndroid: typeof this.props.tabQueries.showCoreAndroid == 'undefined' ? true : this.props.tabQueries.showCoreAndroid,
        }

        const content = buildContent(walletData, tabQueries)

        const {
            chartData,
            options,
            pageContent
        } = content

        return (
            <main>
                <h1 className="labsHeader">Wallet Downloads</h1>
                <p className="labsText">Select a metric:</p>
                <div className="dropdown" id="dropdownmenu">
                    <div id="dropdownMenu" onClick={this.handleDropdown} className="dropbtn"><i id="dropdownMenu"></i>{tabQueries.showChart}</div>
                    {
                        this.state.showMenu ? (
                            <div className="dropdownMenu" id="dropdownMenu">
                                <button id="dropdownMenu" value="Total" className="dropdownItem" onClick={this.handleSelectChart}>Total</button>
                                <button id="dropdownMenu" value="Desktop" className="dropdownItem" onClick={this.handleSelectChart}>Desktop</button>
                                <button id="dropdownMenu" value="Mobile" className="dropdownItem" onClick={this.handleSelectChart}>Mobile</button>
                            </div>
                        ) : (
                                null
                            )
                    }
                </div>
                <p className="labsText">Toggle datasets:</p>
                <div>
                    <div id="Dash Core" onClick={this.handleDatasetToggle} className="databtn" value={tabQueries.showDashCore ? "Active" : "Inactive"}>Dash Core</div>
                    <div id="DashElectrum" onClick={this.handleDatasetToggle} className="databtn" value={tabQueries.showElectrum ? "Active" : "Inactive"}>Dash Electrum</div>
                    <div id="Core Android" onClick={this.handleDatasetToggle} className="databtn" value={tabQueries.showCoreAndroid ? "Active" : "Inactive"}>Core Android</div>
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

export default Wallets