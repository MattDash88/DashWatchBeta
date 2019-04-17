import React from 'react';
import { Line } from 'react-chartjs-2';

// Analytics
import {trackEvent} from '../functions/analytics';

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

class Wallets extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showMenu: false,
            shouldRedraw: false,
        }

        // Binding functions used in this Class
        this.handleDatasetToggle = this.handleDatasetToggle.bind(this)
        this.handleSelectChart = this.handleSelectChart.bind(this)
        this.handleDropdown = this.handleDropdown.bind(this);
        this.handleQueries = this.handleQueries.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    // Dropdown list for KPIs
    handleDropdown(event) {
        event.preventDefault();
        this.setState({
            showMenu: !this.state.showMenu,
            shouldRedraw: false,
        })
        trackEvent('Labs Page', `Clicked Wallets KPI dropdown`)
    }

    // Function to handle selection of item from the KPI dropdown menu
    handleSelectChart(event) {
        this.setState({
            showMenu: false,
            shouldRedraw: true,
        })

        const queries = {
            dashCore: this.props.showDashCore,
            electrum: this.props.showElectrum,
            coreAndroid: this.props.showCoreAndroid,
            walletChart: event.currentTarget.value,
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
            dashCore: event.currentTarget.id == 'Dash Core' ? !this.props.showDashCore : this.props.showDashCore,
            electrum: event.currentTarget.id == 'DashElectrum' ? !this.props.showElectrum : this.props.showElectrum,
            coreAndroid: event.currentTarget.id == 'Core Android' ? !this.props.showCoreAndroid : this.props.showCoreAndroid,
            walletChart: this.props.showWalletChart,
        }

        this.handleQueries(queries)     // Send queries to main Labs file
        trackEvent('Labs Page', `Toggled ${event.currentTarget.id}`)                 // Track Event on Google Analytics 
    }

    // Function to push queries to main labs Class
    handleQueries(queries) {
        this.props.queryFunction('wallets', queries)
    }

    // Function ran when the eventlistener is activated. Close dropdown menu if clicked outside of it
    handleClick = (event) => {
        if (event.target.id !== "dropdownMenu") {
        this.setState({
            showMenu: false,
            shouldRedraw: false,
        }) 
        trackEvent('Labs Page', `Clicked on Labs Wallets page`) 
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
            walletData,
            versionData,
        } = this.props

        const tabQueries = {
            showChart: this.props.showWalletChart,
            showDashCore: this.props.showDashCore,
            showElectrum: this.props.showElectrum,
            showCoreAndroid: this.props.showCoreAndroid,
        }

        const content = buildContent(walletData, tabQueries)

        const {
            chartData,
            options,
            pageContent
        } = content

        var chartObject = chartFunction(chartData, options, this.state.shouldRedraw)

        return (
            <main>
                <h1 className="labsHeader">Wallet Downloads</h1>
                <p className="labsText">Select a metric:</p>
                <div className="labsDropdown" id="dropdownmenu">
                    <div id="dropdownMenu" onClick={this.handleDropdown} className="labsDropbtn"><i id="dropdownMenu"></i>{tabQueries.showChart}</div>
                    {
                        this.state.showMenu ? (
                            <div className="labsDropdownMenu" id="dropdownMenu">
                                <button id="dropdownMenu" value="Total" className="labsDropdownItem" onClick={this.handleSelectChart}>Total</button>
                                <button id="dropdownMenu" value="Desktop" className="labsDropdownItem" onClick={this.handleSelectChart}>Desktop</button>
                                <button id="dropdownMenu" value="Mobile" className="labsDropdownItem" onClick={this.handleSelectChart}>Mobile</button>
                            </div>
                        ) : (
                                null
                            )
                    }
                </div>
                <p className="labsText">Toggle datasets:</p>
                <div>
                    <div id="Dash Core" onClick={this.handleDatasetToggle} className="labsDatabtn" value={tabQueries.showDashCore ? "Active" : "Inactive"}>Dash Core</div>
                    <div id="DashElectrum" onClick={this.handleDatasetToggle} className="labsDatabtn" value={tabQueries.showElectrum ? "Active" : "Inactive"}>Dash Electrum</div>
                    <div id="Core Android" onClick={this.handleDatasetToggle} className="labsDatabtn" value={tabQueries.showCoreAndroid ? "Active" : "Inactive"}>Core Android</div>
                </div>
                <section>  
                    {pageContent.proposalOwnerLink}                
                    {chartObject}                    
                    <p className="labsNoteText">Dash Core and Dash Electrum note: The download numbers for the Dash Electrum and Dash Core wallets only include direct downloads from GitHub. It does not include downloads of the binaries from other sources or when the user compiled the wallet from the source code.</p>
                    <p className="labsNoteText">Dash Android note: The download numbers for the Dash Android wallet only include direct downloads from the Google Play Store. It does not account for for installations where the APK (Android application package) was obtained from other sources. Sharing APK files locally with one another to save bandwidth is a common practice in some countries.</p>              
                    <h2 className="labsHeader">Wallet Downloads per version</h2>
                    {
                        Object.values(versionData).map((item) =>
                        <section>
                        <p className="labsH2">{item.wallet_name} (last updated: {item.last_updated})</p>
                        <div className="labsTableWrapper" key={item.wallet_name}>
                            <div className="labsIndexItemFirst"><p className="labsColumnTitle">Wallet Version</p></div>
                            <div className="labsIndexItem"><p className="labsColumnTitle">Date Released</p></div>
                            <div className="labsIndexItem"><p className="labsColumnTitle">Desktop</p></div>
                            <div className="labsIndexItem"><p className="labsColumnTitle">Mobile</p></div>
                            <div className="labsIndexItem"><p className="labsColumnTitle">Total</p></div>
                        </div>
                        {
                            Object.values(item.walletVersionData).map((version) =>
                            <div className="labsTableWrapper" key={version.id}>
                                <div className="labsTableItemFirst">{version.wallet_version}</div>         
                                <div className="labsTableItem">{version.release_date}</div>
                                <div className="labsTableItem">{version.desktop}</div>
                                <div className="labsTableItem">{version.mobile}</div>
                                <div className="labsTableItem">{version.total}</div>
                            </div>
                            )
                        }
                        </section>
                        )
                    }
                </section>
                

                
            </main>
        )
    }
}

export default Wallets