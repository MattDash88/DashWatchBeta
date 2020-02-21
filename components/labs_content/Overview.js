import React from 'react';
import {
    Container,
    Label,
    Icon,
    Segment,
    Table,
    Flag,
    Grid,
    Accordion,
    Divider,
    Message,
} from 'semantic-ui-react';

// Analytics
import { trackEvent } from '../functions/analytics';

// Import functions for charts
import tableFunctions from './labs_functions/tableFunctions';

// API query requesting Trust Protector Candidate List data
const getWalletTopLists = () => {
    return (
        new Promise((resolve) => {
            fetch(`/api/dataset/labsWalletTopLists`)
                .then((res) => res.json()
                    .then((res) => {
                        resolve(res)
                    })
                )
        })
    )
}

// API query requesting Trust Protector Candidate List data
const getWebsiteTopLists = () => {
    return (
        new Promise((resolve) => {
            fetch(`/api/dataset/labsWebsiteTopLists`)
                .then((res) => res.json()
                    .then((res) => {
                        resolve(res)
                    })
                )
        })
    )
}

class LabsOverview extends React.Component {
    render() {
        const { // Declare data arrays used in class
            countryList,
        } = this.props

        return (
            <Container>
                <WalletTableRow
                    countryList={countryList}
                />
                <WebsiteTableRow
                    countryList={countryList}
                />
            </Container>
        )
    }
}

class WalletTableRow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            walletActiveDevices: '',
            deltaWalletInstalls: '',
            percentageWalletInstalls: '',
            globalWalletData: '',
            walletListsDate: '',
            walletAccordionState: false,
        }

        // Binding functions used in this Class
        this.handleAccordionClick = this.handleAccordionClick.bind(this)
    }

    handleAccordionClick() {    
        this.setState({ walletAccordionState: !this.state.walletAccordionState })
      }

    componentDidMount() {
        var wTopListPromise = Promise.resolve(getWalletTopLists())

        Promise.all([wTopListPromise]).then(data => {
            var walletListData = data[0]

            // Create header string with date
            var walletdateString = tableFunctions.createListDateString(walletListData.top_active_devices[0].date)
            this.setState({
                walletActiveDevices: walletListData.top_active_devices,
                deltaWalletInstalls: walletListData.delta_active_installs,
                percentageWalletInstalls: walletListData.percentage_delta_installs,
                globalWalletData: walletListData.global_active_devices,
                walletListsDate: walletdateString,
            })
        })
    }

    render() {
        const { // Declare data arrays used in class
            walletActiveDevices,
            deltaWalletInstalls,
            percentageWalletInstalls,
            globalWalletData,
            walletListsDate,
            walletAccordionState,
        } = this.state

        const { // Declare data arrays used in class
            countryList,
        } = this.props
        return (
            <main>
                <Segment>
                    <Label ribbon>Android Wallet Metrics</Label>
                    <h4>Month: {walletListsDate}</h4>
                    <p>The table lists the countries with the most active installations and the largest growth in new installation, both in % and absolute numbers, of the Dash Android wallet in the month of {walletListsDate}. More countries are available in the wallet section.</p>
                    <Accordion fluid styled>
                        <Accordion.Title
                            active={walletAccordionState}
                            color='grey'
                            index={0}
                            onClick={this.handleAccordionClick}
                             >
                        <Icon name='dropdown' />
                        What are Active Devices?
                    </Accordion.Title>
                        <Accordion.Content active={walletAccordionState}>
                            <p>
                            Active devices are Android devices that have the Dash Wallet app installed and have been online at least once in the past 30 days.
                            </p>
                        </Accordion.Content>
                    </Accordion>    
                    <Divider hidden />                
                    <Grid stackable>
                        <Grid.Row width={16}>
                            <Grid.Column mobile={16} tablet={5} computer={5} widescreen={5}>
                                {
                                    (walletActiveDevices.length !== 0) && (
                                        <OverviewTable
                                            listData={walletActiveDevices}
                                            countryList={countryList}
                                            globalDataPoint={globalWalletData.active_device_installs}
                                            dataColumnLabel={'Active Devices'}
                                            dataLabel={'active_devices'}
                                        />
                                    )
                                }
                            </Grid.Column>
                            <Grid.Column mobile={16} tablet={5} computer={5} widescreen={5}>
                                {
                                    (deltaWalletInstalls.length !== 0) && (
                                        <OverviewTable
                                            listData={deltaWalletInstalls}
                                            countryList={countryList}
                                            globalDataPoint={globalWalletData.delta_active_installs}
                                            dataColumnLabel={'New Installs'}
                                            dataLabel={'delta_active_installs'}
                                        />
                                    )
                                }
                            </Grid.Column>
                            <Grid.Column mobile={16} tablet={5} computer={5} widescreen={5}>
                                {
                                    (percentageWalletInstalls.length !== 0) && (
                                        <OverviewTable
                                            listData={percentageWalletInstalls}
                                            countryList={countryList}
                                            globalDataPoint={globalWalletData.percentage_delta_installs}
                                            dataColumnLabel={'% Change'}
                                            dataLabel={'percentage_delta_installs'}
                                        />
                                    )
                                }
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    <Message>Google Play Store metrics provided by Dash Core Group.</Message>
                </Segment>
            </main>
        )
    }
}

class WebsiteTableRow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            websiteUsers: '',
            websiteDeltaUsers: '',
            websitePercentageUsers: '',
            globalWebsiteData: '',
            websiteListsDate: '',
        }
    }

    componentDidMount() {
        var webTopListPromise = Promise.resolve(getWebsiteTopLists())

        Promise.all([webTopListPromise]).then(data => {
            var websitesListData = data[0]

            // Create header string with date
            var websitedateString = tableFunctions.createListDateString(websitesListData.users[0].date)
            this.setState({
                websiteUsers: websitesListData.users,
                websiteDeltaUsers: websitesListData.delta_users,
                websitePercentageUsers: websitesListData.percentage_delta_users,
                globalWebsiteData: websitesListData.global_users,
                websiteListsDate: websitedateString,
            })
        })
    }

    render() {
        const { // Declare data arrays used in class
            websiteUsers,
            websiteDeltaUsers,
            websitePercentageUsers,
            globalWebsiteData,
            websiteListsDate
        } = this.state

        const { // Declare data arrays used in class
            countryList,
        } = this.props
        return (
            <main>
                <Segment>
                    <Label ribbon>Dash.org Metrics</Label>
                    <h4>Month: {websiteListsDate}</h4>
                    <p>The table lists the countries with the most users and the largest growth in users, both in % and absolute numbers, of the Dash.org website in the month of {websiteListsDate}. More countries are available in the Websites section.</p>
                    <Divider fitted />
                    <Grid stackable>
                        <Grid.Row width={16}>
                            <Grid.Column mobile={16} tablet={5} computer={5} widescreen={5}>
                                {
                                    (websiteUsers.length !== 0) && (
                                        <OverviewTable
                                            listData={websiteUsers}
                                            countryList={countryList}
                                            globalDataPoint={globalWebsiteData.users}
                                            dataColumnLabel={'Users'}
                                            dataLabel={'users'}
                                        />
                                    )
                                }
                            </Grid.Column>
                            <Grid.Column mobile={16} tablet={5} computer={5} widescreen={5}>
                                {
                                    (websiteDeltaUsers.length !== 0) && (
                                        <OverviewTable
                                            listData={websiteDeltaUsers}
                                            countryList={countryList}
                                            globalDataPoint={globalWebsiteData.delta_users}
                                            dataColumnLabel={'Delta Users'}
                                            dataLabel={'delta_users'}
                                        />
                                    )
                                }
                            </Grid.Column>
                            <Grid.Column mobile={16} tablet={5} computer={5} widescreen={5}>
                                {
                                    (websitePercentageUsers.length !== 0) && (
                                        <OverviewTable
                                            listData={websitePercentageUsers}
                                            countryList={countryList}
                                            globalDataPoint={globalWebsiteData.percentage_delta_users}
                                            dataColumnLabel={'% Change'}
                                            dataLabel={'percentage_delta_users'}
                                        />
                                    )
                                }
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    <Message>Dash.org website metrics provided by Dash Core Group.</Message>
                </Segment>
            </main>
        )
    }
}

class OverviewTable extends React.Component {
    render() {
        const {
            listData,
            countryList,
            globalDataPoint,
            dataColumnLabel,
            dataLabel,
        } = this.props

        return (
            <Table selectable singleLine unstackable fixed>
                <Table.Header>
                    <Table.Row singleLine>
                        <Table.HeaderCell>Country</Table.HeaderCell>
                        <Table.HeaderCell textAlign='right'>{dataColumnLabel}</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {listData.slice(0, 6).map((row) =>
                        <Table.Row key={row.id}>
                            <Table.Cell><Flag name={countryList[row.country].flag} />{countryList[row.country].country_name.toLocaleString('en')}</Table.Cell>
                            <Table.Cell textAlign='right'>{row[dataLabel].toLocaleString('en')}</Table.Cell>
                        </Table.Row>
                    )}
                    <Table.Row>
                        <Table.Cell><b>All countries</b></Table.Cell>
                        <Table.Cell textAlign='right'><b>{globalDataPoint.toLocaleString('en')}</b></Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>
        )
    }
}

export default LabsOverview