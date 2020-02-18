import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Dropdown,
    Label,
    Segment,
    Message,
    Menu,
    Header,
    Icon,
    Grid,
} from 'semantic-ui-react';

// Analytics
import { trackEvent } from '../functions/analytics';

// Import functions for charts
import chartFunctions from './labs_functions/chartFunctions';

// API query requesting Trust Protector Candidate List data
const getWebsitesCountryData = () => {
    return (
        new Promise((resolve) => {
            fetch(`/api/dataset/labsWebsiteCountryData`)
                .then((res) => res.json()
                    .then((res) => {
                        resolve(res)
                    })
                )
        })
    )
}

// API query requesting Trust Protector Candidate List data
const getWebsitesGlobalData = () => {
    return (
        new Promise((resolve) => {
            fetch(`/api/dataset/labsWebsiteGlobalData`)
                .then((res) => res.json()
                    .then((res) => {
                        resolve(res)
                    })
                )
        })
    )
}

class Websites extends React.Component {
    render() {
        const {
            countryList,
        } = this.props
        return (
            <main style={{
                marginLeft: '20px',
                marginRight: '20px',
              }}>
                <Grid stackable centered columns={3}>
                    <Grid.Row stretched>
                        <Grid.Column mobile={16} tablet={8} computer={8} widescreen={5}>
                            <WebsitesCountryChart
                                countryList={countryList}
                            />
                        </Grid.Column>
                        <Grid.Column mobile={16} tablet={8} computer={8} widescreen={5}>
                            <WebsitesGlobalChart />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column mobile={16} tablet={8} computer={8} widescreen={5}>

                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </main>
        )
    }
}

class WebsitesCountryChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shouldRedraw: false,    // Toggle redraw for charts

            // States for country selection
            semanticDropdown: 'Select a Country',
            activeCountryTab: 'users',
            country: new Set(),
            countryList: props.countryList,      // Full dataset of country list

            // States containing full datasets
            webCountryUsersData: '',
            webCountrySessionsData: '',
            webCountryBounceRateData: '',

            // States containing datasets for plotting
            countryUsersChartData: '',
            countrySessionsChartData: '',
            countryBounceRateChartData: '',
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
        trackEvent('Labs Page', `Changed Country Chart tab to ${event.currentTarget.value}`)                 // Track Event on Google Analytics    
    }

    // Function ran when the eventlistener is activated. Close dropdown menu if clicked outside of it
    handleClick = (event) => {
        if (event.target.id !== "dropdownMenu") {
            this.setState({
                showMenu: false,
                showCountryMenu: false,
                shouldRedraw: false,
            })
            trackEvent('Labs Page', `Clicked on Labs Websites page`)
        }
    }

    // Handler for selecting 
    handleCountryChange(e, { value, flag, text }) {
        var usersChartData = []
        var sessionsChartData = []
        var bounceRateChartData = []
        var requestedCountries = new Set(value)
        var usersData = this.state.webCountryUsersData
        var sessionsData = this.state.webCountrySessionsData
        var bounceRateData = this.state.webCountryBounceRateData
        var countryList = this.state.countryList
        var i = 0

        // Iterate through set of countries selecting datasets
        requestedCountries.forEach(function (country) {
            var countryName = countryList[country].country_name
            usersChartData.push(
                chartFunctions.buildChartDataset(usersData[country], countryName, i % 4)
            )
            sessionsChartData.push(
                chartFunctions.buildChartDataset(sessionsData[country], countryName, i % 4)
            )
            bounceRateChartData.push(
                chartFunctions.buildChartDataset(bounceRateData[country], countryName, i % 4)
            )
            i = i + 1;      // Iterator for chart colors
        })

        this.setState({
            semanticDropdown: value,
            country: new Set(value),
            countryUsersChartData: {
                datasets: usersChartData
            },
            countrySessionsChartData: {
                datasets: sessionsChartData
            },
            countryBounceRateChartData: {
                datasets: bounceRateChartData
            },
            shouldRedraw: true,
        })
    }

    componentDidMount() {
        window.addEventListener('mousedown', this.handleClick);     // Handles closing of dropdown menu        

        var wCountryDataPromise = Promise.resolve(getWebsitesCountryData())

        Promise.all([wCountryDataPromise]).then(data => {
            const fullCountryUsers = data[0].users
            const fullCountrySessions = data[0].sessions
            const fullCountryBounceRate = data[0].bounce_rate

            this.setState({
                webCountryUsersData: fullCountryUsers,
                webCountrySessionsData: fullCountrySessions,
                webCountryBounceRateData: fullCountryBounceRate,
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
            countryUsersChartData,
            countrySessionsChartData,
            countryBounceRateChartData,
            countryList,
        } = this.state

        // Set formatting of chart and axes
        const countryUsersOptions = chartFunctions.buildChartOptions('Unique website users in month')
        const countrySessionsOptions = chartFunctions.buildChartOptions('Website sessions in month')
        const countryBounceRateOptions = chartFunctions.buildChartOptions('Website bounce rate')

        // Create country list for dropdown menu
        const dropdownOptions = chartFunctions.createCountryDropdownList(countryList)
        return (
            <main>
                <Segment attached='top'>
                    <Label ribbon>Dash.org website Metrics per Country</Label>
                    <br></br>
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
                        countryUsersChartData.length !== 0 && (
                            <section>
                                {
                                    activeCountryTab == 'users' &&
                                    <Line
                                        data={countryUsersChartData}
                                        options={countryUsersOptions}
                                        redraw={shouldRedraw}
                                    />
                                }
                                {
                                    activeCountryTab == 'sessions' &&
                                    <Line
                                        data={countrySessionsChartData}
                                        options={countrySessionsOptions}
                                        redraw={shouldRedraw}
                                    />
                                }
                                {
                                    activeCountryTab == 'bounceRate' &&
                                    <Line
                                        data={countryBounceRateChartData}
                                        options={countryBounceRateOptions}
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
                    <Message>
                        <p>Dash.org analytics metrics provided by Dash Core Group.</p>
                        <p><a id="dashorgRawLink" href="/api/dataset/labsWebsiteCountryData"> CLICK HERE FOR THE RAW DATA</a></p>
                    </Message>
                </Segment>
                <Menu attached='bottom' tabular fitted='vertically' fluid widths={3}>
                    <Menu.Item
                        value='users'
                        active={activeCountryTab === 'users'}
                        onClick={this.handleCountryTab}
                    >
                        Website Users
                    </Menu.Item>
                    <Menu.Item
                        value='sessions'
                        active={activeCountryTab === 'sessions'}
                        onClick={this.handleCountryTab}
                    >
                        Website Sessions
                    </Menu.Item>
                    <Menu.Item
                        value='bounceRate'
                        active={activeCountryTab === 'bounceRate'}
                        onClick={this.handleCountryTab}
                    >
                        Website bounce rate
                    </Menu.Item>
                </Menu>
            </main>
        )
    }
}

class WebsitesGlobalChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shouldRedraw: false,    // Toggle redraw for charts
            activeGlobalTab: 'users',

            // States for Global datasets
            globalUsersChartData: '',
            globalSessionsChartData: '',
            globalBounceRateChartData: '',
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
        var wGlobalWebsiteDataPromise = Promise.resolve(getWebsitesGlobalData())
        Promise.all([wGlobalWebsiteDataPromise]).then(data => {
            const fullWebsiteGlobalData = data[0]

            // Create chart data for Desktop + Mobile installs
            const globalUsersChartData = chartFunctions.buildChartDataset(fullWebsiteGlobalData.users, 'Users', 0)
            const globalSessionsChartData = chartFunctions.buildChartDataset(fullWebsiteGlobalData.sessions, 'Sessions', 0)
            const globalBounceRateChartData = chartFunctions.buildChartDataset(fullWebsiteGlobalData.bounce_rate, 'Bounce Rate', 0)

            this.setState({
                globalUsersChartData: {
                    datasets: [globalUsersChartData],
                },
                globalSessionsChartData: {
                    datasets: [globalSessionsChartData],
                },
                globalBounceRateChartData: {
                    datasets: [globalBounceRateChartData],
                }
            })
        })
    }
    render() {
        const {
            activeGlobalTab,
            shouldRedraw,
            globalUsersChartData,
            globalSessionsChartData,
            globalBounceRateChartData,
        } = this.state

        const globalUsersOptions = chartFunctions.buildChartOptions('Unique website users in month')
        const globalSessionsOptions = chartFunctions.buildChartOptions('Website sessions in month')
        const globalBounceRateOptions = chartFunctions.buildChartOptions('Website bounce rate')

        return (
            <main>
                <Segment attached='top'>
                    <Label ribbon>Dash.org metrics global</Label>
                    {
                        globalUsersChartData.length !== 0 && (
                            <section>
                                {
                                    activeGlobalTab == 'users' &&
                                    <Line
                                        data={globalUsersChartData}
                                        options={globalUsersOptions}
                                        redraw={shouldRedraw}
                                    />
                                }
                                {
                                    activeGlobalTab == 'sessions' &&
                                    <Line
                                        data={globalSessionsChartData}
                                        options={globalSessionsOptions}
                                        redraw={shouldRedraw}
                                    />
                                }
                                {
                                    activeGlobalTab == 'bounceRate' &&
                                    <Line
                                        data={globalBounceRateChartData}
                                        options={globalBounceRateOptions}
                                        redraw={shouldRedraw}
                                    />
                                }
                            </section>
                        )

                    }
                    <Message>
                        <p>Dash.org analytics metrics provided by Dash Core Group.</p>
                        <p><a id="dashorgRawLink" href="/api/dataset/labsWebsiteGlobalData"> CLICK HERE FOR THE RAW DATA</a></p>
                    </Message>
                </Segment>
                <Menu attached='bottom' tabular fitted='vertically' fluid widths={3}>
                    <Menu.Item
                        value='users'
                        active={activeGlobalTab === 'users'}
                        onClick={this.handleGlobalTab}
                    >
                        Users
                    </Menu.Item>
                    <Menu.Item
                        value='sessions'
                        active={activeGlobalTab === 'sessions'}
                        onClick={this.handleGlobalTab}
                    >
                        Sessions
                    </Menu.Item>
                    <Menu.Item
                        value='bounceRate'
                        active={activeGlobalTab === 'bounceRate'}
                        onClick={this.handleGlobalTab}
                    >
                        Bounce Rate
                    </Menu.Item>
                </Menu>
            </main>
        )
    }
}

export default Websites