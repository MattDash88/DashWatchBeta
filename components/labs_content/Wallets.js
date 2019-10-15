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
} from 'semantic-ui-react';

// Analytics
import { trackEvent } from '../functions/analytics';

// Import css
import country_list from './lists/country_list.js';

const colors = ['blue', 'green','red','purple']

// API query requesting Trust Protector Candidate List data
const getLabsCountryData = () => {
    return (
      new Promise((resolve) => {
        fetch(`/api/dataset/labsWalletData`)
          .then((res) => res.json()
            .then((res) => {              
                resolve(res)
            })
          )
      })
    )
  }

function dbCall(userFunc) {
    const client = redis.createClient(redisOptions)
    userFunc(client, () => { client.quit(); })

    // Log any errors
    client.on('error', function (error) {
        //console.log(error)
    })
}

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
                    data: labsData[0].total_downloads,
                }),
                desktopDownloads.push({
                    label: labsData[0].wallet_name,
                    fill: false,
                    borderColor: 'blue',
                    data: labsData[0].desktop_downloads,
                }),
                mobileDownloads.push({
                    label: labsData[0].wallet_name,
                    fill: false,
                    borderColor: 'blue',
                    data: labsData[0].mobile_downloads,
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
                    data: labsData[1].total_downloads,
                }),
                desktopDownloads.push({
                    label: labsData[1].wallet_name,
                    fill: false,
                    borderColor: 'purple',
                    data: labsData[1].desktop_downloads,
                }),
                mobileDownloads.push({
                    label: labsData[1].wallet_name,
                    fill: false,
                    borderColor: 'purple',
                    data: labsData[1].mobile_downloads,
                })
            ) : (
                    null
                )
        }
        {
            queries.showCoreAndroid ? (
                totalDownloads.push({
                    label: labsData[2].wallet_name,
                    fill: false,
                    borderColor: 'green',
                    data: labsData[2].total_downloads,
                }),
                desktopDownloads.push({
                    label: labsData[2].wallet_name,
                    fill: false,
                    borderColor: 'green',
                    data: labsData[2].desktop_downloads,
                }),
                mobileDownloads.push({
                    label: labsData[2].wallet_name,
                    fill: false,
                    borderColor: 'green',
                    data: labsData[2].mobile_downloads,
                })
            ) : (
                    null
                )
        }
        {
            queries.showCoreiOS ? (
                totalDownloads.push({
                    label: 'Core iOS',
                    fill: false,
                    borderColor: '#FF3824',
                    data: labsData[3].total_downloads,
                }),
                desktopDownloads.push({
                    label: 'Core iOS',
                    fill: false,
                    borderColor: '#FF3824',
                    data: labsData[3].desktop_downloads,
                }),
                mobileDownloads.push({
                    label: 'Core iOS',
                    fill: false,
                    borderColor: '#FF3824',
                    data: labsData[3].mobile_downloads,
                })
            ) : (
                    null
                )
        }

        // Set chart options
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

        // Set Dropdown name
        if (queries.showChart == 'type') {
            var dropdownName = "Wallet type"
        } else if (queries.showChart == 'country') {
            var dropdownName = "Installs by country"
        } else if (queries.showChart == 'version') {
            var dropdownName = "Downloads by version"
        } else {
            var dropdownName = "Select chart type"
        }

        const pageContent = {   // Elements that are used in page rendering
            proposalOwnerLink:
                <div>
                    <p className="labsText">
                        <a id="Proposal Owner Link" href={`/proposals?search=${labsData[1].wallet_proposal_owner}`} target="" >Link to Proposal Owner {labsData[1].wallet_name}</a>
                    </p>
                </div>,
            dropdownMenuString: dropdownName,
        }
        
        // Set the requested dataset as chartdata
        if (queries.showType == 'All') {
            var chartData = { datasets: totalDownloads }
        } else if (queries.showType == 'Desktop') {
            var chartData = { datasets: desktopDownloads }
        } else if (queries.showType == 'Mobile') {
            var chartData = { datasets: mobileDownloads }
        } else {
            var chartData = { datasets: totalDownloads }
        }
        return {
            chartData: chartData,
            options: options,
            pageContent: pageContent,
        }
    } catch (e) {
        // Set Dropdown name
        if (queries.showChart == 'type') {
            var dropdownName = "Wallet type"
        } else if (queries.showChart == 'country') {
            var dropdownName = "Installs by country"
        } else if (queries.showChart == 'version') {
            var dropdownName = "Downloads by version"
        } else {
            var dropdownName = "Select chart type"
        }

        const pageContent = {   // Elements that are used in page rendering
            proposalOwnerLink: <div></div>,
            dropdownMenuString: dropdownName,
        }
        return {
            chartData: { datasets: [] },
            options: {},
            pageContent: pageContent,
        }
    }
}

const buildCountryContent = (countryData, queries) => {
    try {
        var country = queries.showCountry
        var activeDevices = [
            {
                label: country,
                fill: false,
                borderColor: 'blue',
                data: countryData[country].active_devices,
            }
        ]

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
                        labelString: 'Active Andriod devices with wallet installed'
                    },
                }]
            }
        }

        return {
            countryChart: { datasets: activeDevices },
            countryOptions: options,
        }
    } catch (e) {
        return {
            countryChart: { datasets: [] },
            countryOptions: {},
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
            showMenu: false,            // Main Wallet Menu Toggle
            showTypeMenu: false,        // Wallet Type Menu Toggle
            showCountryMenu: false,     // Country Menu Toggle
            showTooltip: false,         // Toggle show/hiding tooltip
            shouldRedraw: false,        // Toggle redraw of charts
            country: new Set(),
            countryData: '',
            chartData: '',
            countryData2: [],
            semanticDropdown: 'Select a Country',
        }

        // Binding functions used in this Class
        this.handleDatasetToggle = this.handleDatasetToggle.bind(this)
        this.handleSelectChart = this.handleSelectChart.bind(this)
        this.handleSelectType = this.handleSelectType.bind(this)
        this.handleQueries = this.handleQueries.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

        // Function to handle selection of item from the KPI dropdown menu
    handleSelectChart(event) {
        this.setState({
            showMenu: false,
            showCountryMenu: false,
            shouldRedraw: true,
        })

        const queries = {
            dashCore: this.props.showDashCore,
            electrum: this.props.showElectrum,
            coreAndroid: this.props.showCoreAndroid,
            coreiOS: this.props.showCoreiOS,
            walletType: this.props.showWalletType,
            //walletCountry: this.props.showWalletCountry,
            walletChart: event.currentTarget.value,
        }

        this.handleQueries(queries)     // Send queries to main Labs file
        trackEvent('Labs Page', `Changed Chart to Wallet ${event.currentTarget.value}`)                 // Track Event on Google Analytics    
    }

    // Function to handle selection of item from the KPI dropdown menu
    handleSelectType(event) {
        this.setState({
            showMenu: false,
            showTypeMenu: false,
            shouldRedraw: true,
        })

        const queries = {
            dashCore: this.props.showDashCore,
            electrum: this.props.showElectrum,
            coreAndroid: this.props.showCoreAndroid,
            coreiOS: this.props.showCoreiOS,
            walletType: event.currentTarget.value,
            walletCountry: this.props.showWalletCountry,
            walletChart: this.props.showWalletChart,
        }

        this.handleQueries(queries)     // Send queries to main Labs file
        trackEvent('Labs Page', `Changed Chart to Wallet ${event.currentTarget.value}`)                 // Track Event on Google Analytics    
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
            coreiOS: event.currentTarget.id == 'Core iOS' ? !this.props.showCoreiOS : this.props.showCoreiOS,
            walletType: this.props.showWalletType,
            walletCountry: this.props.showWalletCountry,
            walletChart: this.props.showWalletChart,
        }

        this.handleQueries(queries)     // Send queries to main Labs file
        trackEvent('Labs Page', `Toggled ${event.currentTarget.id}`)                 // Track Event on Google Analytics 
    }

    // Function to push queries to main labs Class
    handleQueries(queries) {
        this.props.queryFunction('wallets', queries)
    }

    // Function to show and hide tooltip on click (for mobile users that can't hover)
    handleTooltip(event) {
        event.preventDefault();
        this.setState({
            showTooltip: !this.state.showTooltip,
            showMenu: false,
            showCountryMenu: false,
        })
        trackEvent('Labs Page', `Clicked Tooltip`)
    }

    // Function ran when the eventlistener is activated. Close dropdown menu if clicked outside of it
    handleClick = (event) => {
        if (event.target.id !== "dropdownMenu") {
            this.setState({
                showMenu: false,
                showCountryMenu: false,
                shouldRedraw: false,
            })
            trackEvent('Labs Page', `Clicked on Labs Wallets page`)
        }
    }

    handleChange = (e, { value, flag, text }) => {
        var chartData = []
        var countryList = new Set(value)
        var countryData = this.state.countryData
        var i = 0
        
        // Iterate through set of countries selecting datasets
        countryList.forEach(function (country) {
            chartData.push({
                label: country,
                fill: false,
                borderColor: colors[i % 4],
                data: countryData[country]
            })
            i = i + 1;      // Iterator for chart colors
        })
        
        var countryList = new Set(value)
        this.setState({
            semanticDropdown: value,
            country: new Set(value),
            chartData: {
                datasets: chartData
            }
        })
        
    }

    componentDidMount() {
        window.addEventListener('mousedown', this.handleClick);     // Handles closing of dropdown menu        
        Promise.resolve(getLabsCountryData()).then(data => {
            const activeDevices = data.active_installs
            
            var chartData = []
            var countrySet = this.state.country
            var i = 0

            // Iterate through set of countries selecting datasets
            countrySet.forEach(function (value) {
                chartData.push({
                    label: value,
                    fill: false,
                    borderColor: colors[i],
                    data: activeDevices[value]
                })
                i++     // Iterator for chart colors
            })
            this.setState({
                countryData: activeDevices,
                chartData: {
                    datasets: chartData
                }
            })
        })
    }

   

    componentWillUnmount() {
        window.removeEventListener('mousedown', this.handleClick);  // Stop event listener when modal is unloaded        
    }

    render() {
        const { // Declare data arrays used in class
            walletData,
            countryData,
            versionData,
        } = this.props

        var activeDevices = { 
            datasets: this.state.countryData        
        }

        //console.log(this.state.countryData)

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
                        labelString: 'Active Andriod devices with wallet installed'
                    },
                }]
            }
        }

        //console.log(this.state.countryData)
        //console.log(this.state.countryData2)

        const tabQueries = {
            showChart: this.props.showWalletChart,              // Dataset to look at: 'all', 'country', 'version'
            showType: this.props.showWalletType,
            showCountry: this.props.showWalletCountry,          // Sets the country sub chart
            showDashCore: this.props.showDashCore,
            showElectrum: this.props.showElectrum,
            showCoreAndroid: this.props.showCoreAndroid,
            showCoreiOS: this.props.showCoreiOS,
        }

        const content = buildContent(walletData, tabQueries)
        const country_content = buildCountryContent(countryData, tabQueries)

        const {
            chartData,
            pageContent,
        } = content

        const {
            countryChart,
            countryOptions,
        } = country_content

        //var chartObject = chartFunction(chartData, options, this.state.shouldRedraw)
        const dropdownOptions = country_list;

        return (
            <main>
                <Segment>
                <h1 className="labsHeader">Wallet Metrics</h1>
                <Dropdown
                    placeholder='Select a country'
                    search
                    clearable
                    multiple
                    selection
                    options={dropdownOptions}
                    onChange={this.handleChange}
                /> 
                {
                   this.state.chartData.length !== 0 &&                               
                <Line
                    data={this.state.chartData}
                    options={options}
                />  
                }              
                </Segment>
            </main>
        )
    }
}

export default Wallets