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

class Websites extends React.Component {
    render() {
        const {
            countryList,
        } = this.props
        return (
            <Container fluid style={{
                marginLeft: '20px',
            }}>
                <Grid stackable columns='three'>
                    <Grid.Row stretched>
                        <Grid.Column width={8}>
                            <WebsitesCountryChart
                                countryList={countryList}
                            />
                        </Grid.Column>
                        <Grid.Column width={8}>

                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={8}>

                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
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
        const dropdownOptions = chartFunctions.createDropdownList(countryList)
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
                    <p>
                        Dash.org analytics metrics provided by Dash Core Group. <a id="dashorgRawLink" href="/api/dataset/labsWebsiteCountryData"> CLICK HERE FOR THE RAW DATA</a>
                    </p>
                </Message>
            </Segment>
                <Menu attached='bottom' tabular fitted='vertically'>
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

export default Websites