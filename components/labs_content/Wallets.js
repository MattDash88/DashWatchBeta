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
const getLabsCountryData = (country_code) => {
    return (
      new Promise((resolve) => {
        fetch(`/database/${country_code}`,)
          .then((res) => res.json()
            .then((res) => {
                resolve(res)
            })
          )
      })
    )
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
            country: ['AL'],
            countryData: [{
                label: 'placeholder',
                fill: false,
                borderColor: 'blue',
                data: [],
            }],
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

    handleChange = (e, { value }) => {
        this.setState({
            semanticDropdown: value,
            country: value,
        })
        
    }

    componentDidMount() {
        window.addEventListener('mousedown', this.handleClick);     // Handles closing of dropdown menu
        var labsCountryData2 = []
        Object.values(this.state.country).map((item) => {
            labsCountryData2.push(Promise.resolve(getLabsCountryData(item)));
        })
        
        var labsCountryData = Promise.resolve(getLabsCountryData(this.state.country));
        Promise.all([labsCountryData]).then(data => {            
            this.setState({
              countryData: [{
                label: this.state.country[0],
                fill: false,
                borderColor: colors[0],
                data: data[0],
            }]
            })
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.country !== this.state.country ) {
            
            var newData = []
            Object.keys(this.state.country).map((item) => {
                var number = item % 4;
                Promise.resolve(getLabsCountryData(this.state.country[item])).then((data) => {
                    newData.push({
                        label: this.state.country[item],
                        fill: false,
                        borderColor: colors[number],
                        data: data,
                    })
                }) ;
            })

            this.setState({
                countryData: newData,
            })

            

                //console.log(this.state.countryData)
            //Promise.all(labsCountryData).then(data => {
            //    const dataConstruct
            //})
                
                //Object.values(data[0]).map((item) => {
                //    dataConstruct.push({
                //        label: this.state.country[item],
                //        fill: false,
                //        borderColor: 'blue',
                //        data: data[item],
                //    })
                //})
                //console.log(data)          
        }
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

        var activeDevices = { datasets: 
            this.state.countryData        
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
                        labelString: 'Active Andriod devices with wallet installed'
                    },
                }]
            }
        }

        console.log(this.state.countryData)
            console.log(this.state.countryData2)

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
        const dropdownOptions = [
            { key: 'af', value: 'af', flag: 'af', text: 'Afghanistan' },
            { key: 'ax', value: 'ax', flag: 'ax', text: 'Aland Islands' },
            { key: 'al', value: 'al', flag: 'al', text: 'Albania' },
            { key: 'dz', value: 'dz', flag: 'dz', text: 'Algeria' },
        ];

        return (
            <main>
                <Segment>
                <h1 className="labsHeader">Wallet Metrics</h1>
                <Dropdown
                    placeholder='placeholder'
                    search
                    clearable
                    multiple
                    selection
                    options={country_list}
                    onChange={this.handleChange}
                />                                
                
                <Line
                        data={activeDevices}
                        options={options}
                />
                </Segment>
            </main>
        )
    }
}

export default Wallets