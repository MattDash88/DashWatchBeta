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

// Import functions for charts
import chartFunctions from './labs_functions/chartFunctions';

// API query requesting Trust Protector Candidate List data
const getLabsCountryData = () => {
    return (
        new Promise((resolve) => {
            fetch(`/api/dataset/labsCounryWalletData`)
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

const getOtherWalletData = () => {
    return (
        new Promise((resolve) => {
            fetch(`/api/dataset/labsOtherWalletData`)
                .then((res) => res.json()
                    .then((res) => {
                        resolve(res)
                    })
                )
        })
    )
}

class Wallets extends React.Component {
    render() {
        return (
            <Container fluid style={{
                marginLeft: '20px',
            }}>
                <Grid stackable columns='three'>
                    <Grid.Row stretched>
                        <Grid.Column width={8}>
                            <AndroidCountryChart />
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <AndroidGlobalChart />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={8}>
                            <OtherWalletsChart />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        )
    }
}

class AndroidCountryChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shouldRedraw: false,    // Toggle redraw for charts

            // States for country selection
            semanticDropdown: 'Select a Country',
            activeCountryTab: 'activeDevices',
            country: new Set(),
            walletCountryList: '',      // Full dataset of country list
            
            // States containing full datasets
            wCountryActiveData: '',
            wCountryDeltaData: '',
            wCountryPercentageData: '',   
            
            // States containing datasets for plotting
            countryActiveDevicesChartData: '',
            countryDeltaInstallsChartData: '',
            countryPercentageInstallsChartData: '',
        }

        // Binding functions used in this Class
        this.handleCountryTab = this.handleCountryTab.bind(this)
        this.handleCountryChange = this.handleCountryChange.bind(this)
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
            var countryName = countryList[country].country_name
            activeDevicesChartData.push(
                chartFunctions.buildChartDataset(activeDevicesData[country], countryName, i % 4)
            )
            deltaInstallsChartData.push(
                chartFunctions.buildChartDataset(deltaInstallsData[country], countryName, i % 4)
            )
            percentageInstallsChartData.push(
                chartFunctions.buildChartDataset(percentageInstallsData[country], countryName, i % 4)
            )
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

        Promise.all([wCountryDataPromise, wCountryListPromise]).then(data => {
            const fullCountryActiveDevices = data[0].active_installs
            const fullCountryDeltaInstalls = data[0].delta_installs
            const fullCountryPercentageInstalls = data[0].percentage_delta
            const wCountryListData = data[1]

            this.setState({
                wCountryActiveData: fullCountryActiveDevices,
                wCountryDeltaData: fullCountryDeltaInstalls,
                wCountryPercentageData: fullCountryPercentageInstalls,
                walletCountryList: wCountryListData,
            })
        })
    }

    componentWillUnmount() {
        window.removeEventListener('mousedown', this.handleClick);  // Stop event listener when modal is unloaded        
    }

    render() {
        const {
            activeCountryTab,
            shouldRedraw,
            countryActiveDevicesChartData,
            countryDeltaInstallsChartData,
            countryPercentageInstallsChartData,
            walletCountryList,
        } = this.state
        
        // Set formatting of chart and axes
        const countryActiveDevicesOptions = chartFunctions.buildChartOptions('Active Android devices with wallet installed')
        const countryDeltaInstallsOptions = chartFunctions.buildChartOptions('Change in Active Android Devices')
        const countryPercentageInstallsOptions = chartFunctions.buildChartOptions('Percentage Change in Active Android Devices')
        
        // Create country list for dropdown menu
        const dropdownOptions = chartFunctions.createDropdownList(walletCountryList)
        return (
            <main><Segment attached='top'>
                <Label ribbon>Android Wallet Metrics per Country</Label>
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
                                    options={countryActiveDevicesOptions}
                                    redraw={shouldRedraw}
                                />
                            }
                            {
                                activeCountryTab == 'deltaInstalls' &&
                                <Line
                                    data={countryDeltaInstallsChartData}
                                    options={countryDeltaInstallsOptions}
                                    redraw={shouldRedraw}
                                />
                            }
                            {
                                activeCountryTab == 'percentageInstalls' &&
                                <Line
                                    data={countryPercentageInstallsChartData}
                                    options={countryPercentageInstallsOptions}
                                    redraw={shouldRedraw}
                                />
                            }
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
                </Menu></main>
        )
    }
}

class AndroidGlobalChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shouldRedraw: false,    // Toggle redraw for charts
            activeGlobalTab: 'activeDevices',
            
            // States for Global datasets
            globalActiveDevicesChartData: '',
            globalDeltaInstallsChartData: '',
            globalPercentageInstallsChartData: '',            
        }
        // Binding functions used in this Class
        this.handleGlobalTab = this.handleGlobalTab.bind(this)
    }

    // Function to handle selection of item from the KPI dropdown menu
    handleGlobalTab(e, { value }) {
        this.setState({
            activeGlobalTab: value,
            shouldRedraw: false,
        })
        trackEvent('Labs Page', `Changed Chart to Wallet ${event.currentTarget.value}`)                 // Track Event on Google Analytics    
    }

    componentDidMount() {
        var wGlobalAndroidDataPromise = Promise.resolve(getWalletAndroidGlobalData())
        Promise.all([wGlobalAndroidDataPromise]).then(data => {
            const fullAndroidGlobalData = data[0]

            // Create chart data for Desktop + Mobile installs
            const globalActiveDevicesChartData = chartFunctions.buildChartDataset(fullAndroidGlobalData.active_devices, 'Total Active Devices', 0)
            const globalDeltaInstallsChartData = chartFunctions.buildChartDataset(fullAndroidGlobalData.delta_active_installs, 'Delta Active Devices', 0)
            const globalPercentageInstallsChartData = chartFunctions.buildChartDataset(fullAndroidGlobalData.percentage_delta_installs, 'Percentage Delta Devices', 0)
            
            this.setState({
                globalActiveDevicesChartData: {
                    datasets: [globalActiveDevicesChartData],
                },
                globalDeltaInstallsChartData: {
                    datasets: [globalDeltaInstallsChartData],
                },
                globalPercentageInstallsChartData: {
                    datasets: [globalPercentageInstallsChartData],
                }
            })
        })
    }
    render() {
        const {
            activeGlobalTab,
            shouldRedraw,

            // States containing datasets for plotting
            globalActiveDevicesChartData,
            globalDeltaInstallsChartData,
            globalPercentageInstallsChartData,            
        } = this.state
        
        const globalActiveDevicesOptions = chartFunctions.buildChartOptions('Active Android devices with wallet installed')
        const globalDeltaInstallsOptions = chartFunctions.buildChartOptions('Change in Active Android Devices')
        const globalPercentageInstallsOptions = chartFunctions.buildChartOptions('Percentage Change in Active Android Devices')

        return (
            <main><Segment attached='top'>
                <Label ribbon>Android Wallet Metrics global</Label>
                {
                    globalActiveDevicesChartData.length !== 0 && (
                        <section>
                            {
                                activeGlobalTab == 'activeDevices' &&
                                <Line
                                    data={globalActiveDevicesChartData}
                                    options={globalActiveDevicesOptions}
                                    redraw={shouldRedraw}
                                />
                            }
                            {
                                activeGlobalTab == 'deltaInstalls' &&
                                <Line
                                    data={globalDeltaInstallsChartData}
                                    options={globalDeltaInstallsOptions}
                                    redraw={shouldRedraw}
                                />
                            }
                            {
                                activeGlobalTab == 'percentageInstalls' &&
                                <Line
                                    data={globalPercentageInstallsChartData}
                                    options={globalPercentageInstallsOptions}
                                    redraw={shouldRedraw}
                                />
                            }
                        </section>
                    )

                }
            </Segment>
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
                </Menu></main>
        )
    }
}

class OtherWalletsChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeWalletTab: 'totalInstalls',
            shouldRedraw: false,

            // States containing datasets for plotting
            wOtherTotalInstalls: '',
            wOtherDesktopInstalls: '',
            wOtherMobileInstalls: '',
        }
        // Binding functions used in this Class
        this.handleWalletTab = this.handleWalletTab.bind(this)
    }

    // Function to handle selection of item from the KPI dropdown menu
    handleWalletTab(e, { value }) {
        this.setState({
            activeWalletTab: value,
            shouldRedraw: false,
        })
        trackEvent('Labs Page', `Changed Chart to Wallet ${event.currentTarget.value}`)                 // Track Event on Google Analytics    
    }

    componentDidMount() {
        var wOtherWalletDataPromise = Promise.resolve(getOtherWalletData())
        Promise.all([wOtherWalletDataPromise]).then(data => {
            const dashCoreData = data[0].dash_core
            const dashElectrumData = data[0].dash_electrum
            // Create chart data for Desktop + Mobile installs
            const dashCoreTotalInstallsChartData = chartFunctions.buildChartDataset(dashCoreData.total_installs, 'Dash Core', 0)
            const dashElectrumTotalInstallsChartData = chartFunctions.buildChartDataset(dashElectrumData.total_installs, 'Dash Electrum', 1)
            // Create chart data for Desktop installs only
            const dashCoreDesktopInstallsChartData = chartFunctions.buildChartDataset(dashCoreData.desktop_installs, 'Dash Core', 0)
            const dashElectrumDesktopInstallsChartData = chartFunctions.buildChartDataset(dashElectrumData.desktop_installs, 'Dash Electrum', 1)
            // Create chart data for Mobile installs only
            const dashCoreMobileInstallsChartData = chartFunctions.buildChartDataset(dashCoreData.mobile_installs, 'Dash Core', 0)
            const dashElectrumMobileInstallsChartData = chartFunctions.buildChartDataset(dashElectrumData.mobile_installs, 'Dash Electrum', 1)

            this.setState({
                wOtherTotalInstalls: {
                    datasets: [dashCoreTotalInstallsChartData, dashElectrumTotalInstallsChartData],
                },
                wOtherDesktopInstalls: {
                    datasets: [dashCoreDesktopInstallsChartData, dashElectrumDesktopInstallsChartData],
                },
                wOtherMobileInstalls: {
                    datasets: [dashCoreMobileInstallsChartData, dashElectrumMobileInstallsChartData],
                }
            })
        })
    }
    render() {
        const {
            activeWalletTab,
            shouldRedraw,
            wOtherTotalInstalls,
            wOtherDesktopInstalls,
            wOtherMobileInstalls,           
        } = this.state
        
        const otherWalletChartOptions = chartFunctions.buildChartOptions('Wallets installs in month')

        return (
            <main><Segment attached='top'>
                <Label ribbon>Wallet Metrics</Label>
                {
                    wOtherTotalInstalls.length !== 0 && (
                        <section>
                            {
                                activeWalletTab == 'totalInstalls' &&
                                <Line
                                    data={wOtherTotalInstalls}
                                    options={otherWalletChartOptions}
                                    redraw={shouldRedraw}
                                />
                            }
                            {
                                activeWalletTab == 'desktopInstalls' &&
                                <Line
                                    data={wOtherDesktopInstalls}
                                    options={otherWalletChartOptions}
                                    redraw={shouldRedraw}
                                />
                            }
                            {
                                activeWalletTab == 'mobileInstalls' &&
                                <Line
                                    data={wOtherMobileInstalls}
                                    options={otherWalletChartOptions}
                                    redraw={shouldRedraw}
                                />
                            }
                        </section>
                    )

                }
            </Segment>
                <Menu attached='bottom' tabular fitted='vertically'>
                    <Menu.Item
                        value='totalInstalls'
                        active={activeWalletTab === 'totalInstalls'}
                        onClick={this.handleWalletTab}
                    >
                        Total Installs
                    </Menu.Item>
                    <Menu.Item
                        value='desktopInstalls'
                        active={activeWalletTab === 'desktopInstalls'}
                        onClick={this.handleWalletTab}
                    >
                        Desktop Installs Only
                    </Menu.Item>
                    <Menu.Item
                        value='mobileInstalls'
                        active={activeWalletTab === 'mobileInstalls'}
                        onClick={this.handleWalletTab}
                    >
                        Mobile Installs Only
                    </Menu.Item>
                </Menu></main>
        )
    }
}


export default Wallets