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

  const getWalletCountryList = () => {
    return (
      new Promise((resolve) => {
        fetch(`/api/dataset/labsWalletCountryList`)
          .then((res) => res.json()
            .then((res) => {              
                resolve(res)
            })
          )
      })
    )
  }

function createDropdownList(countryObject) {
    try {
    var dropdownList = []
    Object.values(countryObject).map((item) => {
        dropdownList.push({
            key: item.unique_id,
            value: item.country_code,
            flag: item.flag,
            text: item.country_name,
        })
    })
    return dropdownList
} catch (e) {
    return {
        key: 'error',
        value: '',
        flag: '',
        text: 'Something went wrong',
    }
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
            walletCountryList: '',
            chartData: '',
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
        var requestedCountries = new Set(value)
        var countryData = this.state.countryData
        var countryList = this.state.walletCountryList
        var i = 0
        
        // Iterate through set of countries selecting datasets
        requestedCountries.forEach(function (country) {
            chartData.push({
                label: countryList[country].country_name,
                fill: false,
                borderColor: colors[i % 4],
                data: countryData[country]
            })
            i = i + 1;      // Iterator for chart colors
        })

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
        
        var wCountryDataPromise =  Promise.resolve(getLabsCountryData())
        var wCountryListPromise = Promise.resolve(getWalletCountryList())

        Promise.all([wCountryDataPromise, wCountryListPromise]).then(data => {
            const activeDevices = data[0].active_installs
            const wCountryListData = data[1]
            
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
                walletCountryList: wCountryListData,
            })
        })
    }

   

    componentWillUnmount() {
        window.removeEventListener('mousedown', this.handleClick);  // Stop event listener when modal is unloaded        
    }

    render() {
        const { // Declare data arrays used in class
            chartData,
            walletCountryList,
        } = this.state

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

        //var chartObject = chartFunction(chartData, options, this.state.shouldRedraw)
        const dropdownOptions = createDropdownList(walletCountryList)

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
                   chartData.length !== 0 &&                               
                <Line
                    data={chartData}
                    options={options}
                />  
                }              
                </Segment>
            </main>
        )
    }
}

export default Wallets