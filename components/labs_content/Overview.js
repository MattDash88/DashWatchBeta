import React from 'react';
import {
    Container,
    Dropdown,
    Label,
    Icon,
    Form,
    Checkbox,
    Segment,
    Button,
    Divider,
    TextArea,
    Input,
    Message,
    Dimmer,
    Table,
    Flag,
    Image,
    Grid,
    Header,
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
        }
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
            walletListsDate
        } = this.state

        const { // Declare data arrays used in class
            countryList,
        } = this.props
        return (
            <main>
                <Segment>
                    <Label ribbon>Android Wallet Metrics</Label>
                    <h4>Month: {walletListsDate}</h4>
                    <Grid stackable>
                        <Grid.Row width={15}>
                            <Grid.Column width={5}>
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
                            <Grid.Column width={5}>
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
                            <Grid.Column width={5}>
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
                    <Grid stackable>
                        <Grid.Row width={15}>
                            <Grid.Column width={5}>
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
                            <Grid.Column width={5}>
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
                            <Grid.Column width={5}>
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
        console.log(listData)

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