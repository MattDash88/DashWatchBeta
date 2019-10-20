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
} from 'semantic-ui-react';

// Analytics
import { trackEvent } from '../functions/analytics';

// Import css
import country_list from './lists/country_list.js';

const colors = ['blue', 'green', 'red', 'purple']

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

const getWalletAndroidGlobalData = () => {
    return (
        new Promise((resolve) => {
            fetch(`/api/dataset/labsWalletAndroidGlobalData`)
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
            shouldRedraw: false,        // Toggle redraw of charts

            // Elements for country section
            semanticDropdown: 'Select a Country',
            activeCountryTab: 'activeDevices',
            activeGlobalTab: 'activeDevices',

            wCountryActiveData: '',
            wCountryDeltaData: '',
            wCountryPercentageData: '',
            wAndroidGlobalData: '',

            country: new Set(),
            walletCountryList: '',
            countryActiveDevicesChartData: '',
            countryDeltaInstallsChartData: '',
            countryPercentageInstallsChartData: '',
            globalActiveDevicesChartData: '',
            globalDeltaInstallsChartData: '',
            globalPercentageInstallsChartData: '',
        }

        // Binding functions used in this Class
        this.handleCountryTab = this.handleCountryTab.bind(this)
        this.handleCountryChange = this.handleCountryChange.bind(this)

        this.handleGlobalTab = this.handleGlobalTab.bind(this)

        this.handleClick = this.handleClick.bind(this);
    }

    // Function to handle selection of item from the KPI dropdown menu
    handleCountryTab(e, { value }) {
        this.setState({
            activeCountryTab: value,
            shouldRedraw: false,
        })
        trackEvent('Labs Page', `Changed Chart to Wallet ${event.currentTarget.value}`)                 // Track Event on Google Analytics    
    }

    // Function to handle selection of item from the KPI dropdown menu
    handleGlobalTab(e, { value }) {
        this.setState({
            activeGlobalTab: value,
            shouldRedraw: false,
        })
        trackEvent('Labs Page', `Changed Chart to Wallet ${event.currentTarget.value}`)                 // Track Event on Google Analytics    
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

    // Handler for selecting 
    handleCountryChange(e, { value, flag, text }) {
        var activeDevicesChartData = []
        var deltaInstallsChartData = []
        var percentageInstallsChartData = []
        var requestedCountries = new Set(value)
        var activeDevicesData = this.state.wCountryActiveData
        var deltaInstallsData = this.state.wCountryDeltaData
        var percentageInstallsData = this.state.wCountryPercentageData
        var countryList = this.state.walletCountryList
        var i = 0

        // Iterate through set of countries selecting datasets
        requestedCountries.forEach(function (country) {
            activeDevicesChartData.push({
                label: countryList[country].country_name,
                fill: false,
                borderColor: colors[i % 4],
                data: activeDevicesData[country]
            })
            deltaInstallsChartData.push({
                label: countryList[country].country_name,
                fill: false,
                borderColor: colors[i % 4],
                data: deltaInstallsData[country]
            })
            percentageInstallsChartData.push({
                label: countryList[country].country_name,
                fill: false,
                borderColor: colors[i % 4],
                data: percentageInstallsData[country]
            })
            i = i + 1;      // Iterator for chart colors
        })

        this.setState({
            semanticDropdown: value,
            country: new Set(value),
            countryActiveDevicesChartData: {
                datasets: activeDevicesChartData
            },
            countryDeltaInstallsChartData: {
                datasets: deltaInstallsChartData
            },
            countryPercentageInstallsChartData: {
                datasets: percentageInstallsChartData
            },
            shouldRedraw: true,
        })

    }

    componentDidMount() {
        window.addEventListener('mousedown', this.handleClick);     // Handles closing of dropdown menu        

        var wCountryDataPromise = Promise.resolve(getLabsCountryData())
        var wCountryListPromise = Promise.resolve(getWalletCountryList())
        var wGlobalAndroidDataPromise = Promise.resolve(getWalletAndroidGlobalData())

        Promise.all([wCountryDataPromise, wCountryListPromise, wGlobalAndroidDataPromise]).then(data => {
            const fullCountryActiveDevices = data[0].active_installs
            const fullCountryDeltaInstalls = data[0].delta_installs
            const fullCountryPercentageInstalls = data[0].percentage_delta
            const wCountryListData = data[1]
            const fullAndroidGlobalData = data[2]

            const globalActiveDevicesChartData = {
                datasets: [{
                    label: 'Total Active Devices',
                    fill: false,
                    borderColor: 'blue',
                    data: fullAndroidGlobalData.active_devices
                }]
            }

            const globalDeltaInstallsChartData = {
                datasets:
                    [{
                        label: 'Delta Active Devices',
                        fill: false,
                        borderColor: 'blue',
                        data: fullAndroidGlobalData.delta_active_installs
                    }]
            }

            const globalPercentageInstallsChartData = {
                datasets:
                    [{
                        label: 'Percentage Delta Devices',
                        fill: false,
                        borderColor: 'blue',
                        data: fullAndroidGlobalData.percentage_delta_installs
                    }]
            }

            this.setState({
                wCountryActiveData: fullCountryActiveDevices,
                wCountryDeltaData: fullCountryDeltaInstalls,
                wCountryPercentageData: fullCountryPercentageInstalls,
                globalActiveDevicesChartData: globalActiveDevicesChartData,
                globalDeltaInstallsChartData: globalDeltaInstallsChartData,
                globalPercentageInstallsChartData: globalPercentageInstallsChartData,
                walletCountryList: wCountryListData,
            })
        })
    }

    componentWillUnmount() {
        window.removeEventListener('mousedown', this.handleClick);  // Stop event listener when modal is unloaded        
    }

    render() {
        const { // Declare data arrays used in class
            activeCountryTab,
            activeGlobalTab,

            countryActiveDevicesChartData,
            countryDeltaInstallsChartData,
            countryPercentageInstallsChartData,
            walletCountryList,

            globalActiveDevicesChartData,
            globalDeltaInstallsChartData,
            globalPercentageInstallsChartData,
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

        const dropdownOptions = createDropdownList(walletCountryList)
        return (
            <Container fluid style={{
                marginLeft: '20px',
              }}>
                <Grid stackable columns='three'>
                    <Grid.Row stretched>
                        <Grid.Column width={8}>
                            <Segment attached='top'>
                                <Label ribbon>Android Wallet Metrics per Country</Label><br></br>
                                <br></br>
                                <Dropdown
                                    placeholder='Select a country'
                                    scrolling
                                    fluid
                                    search
                                    clearable
                                    multiple
                                    selection
                                    options={dropdownOptions}
                                    onChange={this.handleCountryChange}
                                />
                                {
                                    countryActiveDevicesChartData.length !== 0 && (
                                        <section>
                                            {
                                                activeCountryTab == 'activeDevices' &&
                                                <Line
                                                    data={countryActiveDevicesChartData}
                                                    options={options}
                                                    redraw={this.state.shouldRedraw}
                                                />
                                            }
                                            {
                                                activeCountryTab == 'deltaInstalls' &&
                                                <Line
                                                    data={countryDeltaInstallsChartData}
                                                    options={options}
                                                    redraw={this.state.shouldRedraw}
                                                />
                                            }
                                            {
                                                activeCountryTab == 'percentageInstalls' &&
                                                <Line
                                                    data={countryPercentageInstallsChartData}
                                                    options={options}
                                                    redraw={this.state.shouldRedraw}
                                                />
                                            }
                                            <a href='/api/dataset/labsWalletData' target="_blank" title='Link to raw data' onClick={this.callEvent}>LINK TO RAW DATA</a>
                                        </section>

                                    ) || (
                                        <Segment attached='top' placeholder textAlign='center'>
                                            <Header icon>
                                                <Icon name='world' />
                                                Select a country in the menu above
                                        </Header>
                                        </Segment>
                                    )}
                            </Segment>
                            <Menu attached='bottom' tabular fitted='vertically'>
                                <Menu.Item
                                    value='activeDevices'
                                    active={activeCountryTab === 'activeDevices'}
                                    onClick={this.handleCountryTab}
                                >
                                    Active Installs
                    </Menu.Item>

                                <Menu.Item
                                    value='deltaInstalls'
                                    active={activeCountryTab === 'deltaInstalls'}
                                    onClick={this.handleCountryTab}
                                >
                                    Delta Active Installs
                    </Menu.Item>
                    <Menu.Item
                                    value='percentageInstalls'
                                    active={activeCountryTab === 'percentageInstalls'}
                                    onClick={this.handleCountryTab}
                                >
                                    Percentage Delta Installs
                    </Menu.Item>
                            </Menu>
                        </Grid.Column>
                        <Grid.Column width={8}>
                            {
                                globalActiveDevicesChartData.length !== 0 && (
                                    <Segment attached='top'>
                                        <Label ribbon>Android Wallet Metrics global</Label>
                                        {
                                            activeGlobalTab == 'activeDevices' &&
                                            <Line
                                                data={globalActiveDevicesChartData}
                                                options={options}
                                                redraw={this.state.shouldRedraw}
                                            />
                                        }
                                        {
                                            activeGlobalTab == 'deltaInstalls' &&
                                            <Line
                                                data={globalDeltaInstallsChartData}
                                                options={options}
                                                redraw={this.state.shouldRedraw}
                                            />
                                        }
                                        {
                                            activeGlobalTab == 'percentageInstalls' &&
                                            <Line
                                                data={globalPercentageInstallsChartData}
                                                options={options}
                                                redraw={this.state.shouldRedraw}
                                            />
                                        }
                                        <a href='/api/dataset/labsWalletAndroidGlobalData' target="_blank" title='Link to raw data' onClick={this.callEvent}>LINK TO RAW DATA</a>
                                    </Segment>
                                ) || (
                                    <Segment attached='top' placeholder textAlign='center' height={20}>
                                        <Loader inverted content='Loading' />
                                    </Segment>
                                )
                            }
                            <Menu attached='bottom' tabular fitted='vertically'>
                                <Menu.Item
                                    value='activeDevices'
                                    active={activeGlobalTab === 'activeDevices'}
                                    onClick={this.handleGlobalTab}
                                >
                                    Active Installs
                    </Menu.Item>

                                <Menu.Item
                                    value='deltaInstalls'
                                    active={activeGlobalTab === 'deltaInstalls'}
                                    onClick={this.handleGlobalTab}
                                >
                                    Delta Active Installs
                    </Menu.Item>
                    <Menu.Item
                                    value='percentageInstalls'
                                    active={activeGlobalTab === 'percentageInstalls'}
                                    onClick={this.handleGlobalTab}
                                >
                                    Percentage Delta Installs
                    </Menu.Item>
                            </Menu>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        )
    }
}

export default Wallets