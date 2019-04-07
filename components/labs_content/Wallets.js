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

class Wallets extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            walletData: props.walletData,
            versionData: props.versionData,
            chartData: {
                totalDownloads: [],
                desktopDownloads: [],
                mobileDownloads: [], 
            },
            showChart: 'Total',
            showMenu: false,
            showDashCore: true,
            showDashElectrum: true,
            showCoreAndroid: true,
            url: props.url,
            as: props.as,
        }

        // Binding functions used in this Class
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
        if (event.currentTarget.id == 'Dash Core') {
            this.setState({
                showDashCore: !this.state.showDashCore,
                chartData: {
                    totalDownloads: [],
                    desktopDownloads: [],
                    mobileDownloads: [],
                },
            })
        } else if (event.currentTarget.id == 'DashElectrum') {
            this.setState({
                showDashElectrum: !this.state.showDashElectrum,
                chartData: {
                    totalDownloads: [],
                    desktopDownloads: [],
                    mobileDownloads: [],
                },
            })
        } else if (event.currentTarget.id == 'Core Android') {
            this.setState({
                showCoreAndroid: !this.state.showCoreAndroid,
                chartData: {
                    totalDownloads: [],
                    desktopDownloads: [],
                    mobileDownloads: [],
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
        var totalDownloads = []
        var desktopDownloads = []
        var mobileDownloads = []
        {
            this.state.showDashCore ? (
                totalDownloads.push({
                    label: this.state.walletData[0].wallet_name,
                    fill: false,
                    borderColor: 'blue',
                    data: this.state.walletData[0].total_downloads,    // participation data points
                }),
                desktopDownloads.push({
                    label: this.state.walletData[0].wallet_name,
                    fill: false,
                    borderColor: 'blue',
                    data: this.state.walletData[0].desktop_downloads,    // participation data points
                }),
                mobileDownloads.push({
                    label: this.state.walletData[0].wallet_name,
                    fill: false,
                    borderColor: 'blue',
                    data: this.state.walletData[0].mobile_downloads,    // participation data points
                })
            ) : (
                    null
                )
        }
        {
            this.state.showDashElectrum ? (
                totalDownloads.push({
                    label: this.state.walletData[1].wallet_name,
                    fill: false,
                    borderColor: 'purple',
                    data: this.state.walletData[1].total_downloads,    // participation data points
                }),
                desktopDownloads.push({
                    label: this.state.walletData[1].wallet_name,
                    fill: false,
                    borderColor: 'purple',
                    data: this.state.walletData[1].desktop_downloads,    // participation data points
                }),
                mobileDownloads.push({
                    label: this.state.walletData[1].wallet_name,
                    fill: false,
                    borderColor: 'purple',
                    data: this.state.walletData[1].mobile_downloads,    // participation data points
                })
            ) : (
                    null
                )
                this.state.showCoreAndroid ? (
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
        this.setState({
            chartData: {
                totalDownloads: totalDownloads,
                desktopDownloads: desktopDownloads,
                mobileDownloads: mobileDownloads,
            }
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.showDashCore !== this.state.showDashCore || prevState.showDashElectrum !== this.state.showDashElectrum || prevState.showCoreAndroid !== this.state.showCoreAndroid) {
            var totalDownloads = []
            var desktopDownloads = []
            var mobileDownloads = []
            {
                this.state.showDashCore ? (
                    totalDownloads.push({
                        label: this.state.walletData[0].wallet_name,
                        fill: false,
                        borderColor: 'blue',
                        data: this.state.walletData[0].total_downloads,    // participation data points
                    }),
                    desktopDownloads.push({
                        label: this.state.walletData[0].wallet_name,
                        fill: false,
                        borderColor: 'blue',
                        data: this.state.walletData[0].desktop_downloads,    // participation data points
                    }),
                    mobileDownloads.push({
                        label: this.state.walletData[0].wallet_name,
                        fill: false,
                        borderColor: 'blue',
                        data: this.state.walletData[0].mobile_downloads,    // participation data points
                    })
                ) : (
                        null
                    )
            }
            {
                this.state.showDashElectrum ? (
                    totalDownloads.push({
                        label: this.state.walletData[1].wallet_name,
                        fill: false,
                        borderColor: 'purple',
                        data: this.state.walletData[1].total_downloads,    // participation data points
                    }),
                    desktopDownloads.push({
                        label: this.state.walletData[1].wallet_name,
                        fill: false,
                        borderColor: 'purple',
                        data: this.state.walletData[1].desktop_downloads,    // participation data points
                    }),
                    mobileDownloads.push({
                        label: this.state.walletData[1].wallet_name,
                        fill: false,
                        borderColor: 'purple',
                        data: this.state.walletData[1].mobile_downloads,    // participation data points
                    })
                ) : (
                        null
                    )
                this.state.showCoreAndroid ? (
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
            this.setState({
                chartData: {
                    totalDownloads: totalDownloads,
                    desktopDownloads: desktopDownloads,
                    mobileDownloads: mobileDownloads,
                }
            })
        }
    }


    render() {
        const {     // Elements passed down to the component
            showChart,
            chartData,
        } = this.state

        const totalDownloads = {  // Data styling for the chart
            datasets: chartData.totalDownloads
        };

        const desktopDownloads = {  // Data styling for the chart
            datasets: chartData.desktopDownloads
        };

        const mobileDownloads = {  // Data styling for the chart
            datasets: chartData.mobileDownloads
        };

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

        return (
            <main>
                <h1 className="labsHeader">Wallet Downloads</h1>
                <p className="labsText">Select a metric:</p>
                <div className="dropdown" id="dropdownmenu">
                    <div id="dropdownMenu" onClick={this.handleDropdown} className="dropbtn"><i id="dropdownMenu"></i>{showChart}</div>
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
                    <div id="Dash Core" onClick={this.handleDatasetToggle} className="databtn" value={this.state.showDashCore ? "Active" : "Inactive"}>Dash Core</div>
                    <div id="DashElectrum" onClick={this.handleDatasetToggle} className="databtn" value={this.state.showDashElectrum ? "Active" : "Inactive"}>Dash Electrum</div>
                    <div id="Core Android" onClick={this.handleDatasetToggle} className="databtn" value={this.state.showCoreAndroid ? "Active" : "Inactive"}>Core Android</div>
                </div>
                <section className="chartSection" value={this.state.showChart == "Total" ? "Active" : "Inactive"}>
                    <Line
                        data={totalDownloads}
                        options={options}
                    />
                </section>
                <section className="chartSection" value={this.state.showChart == "Desktop" ? "Active" : "Inactive"}>
                    <Line
                        data={desktopDownloads}
                        options={options}
                    />
                </section>
                <section className="chartSection" value={this.state.showChart == "Mobile" ? "Active" : "Inactive"}>
                    <Line
                        data={mobileDownloads}
                        options={options}
                    />
                </section>

            </main>
        )
    }
}

export default Wallets