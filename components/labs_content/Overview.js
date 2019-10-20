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

var monthsList = [
    'January', 'February', 'March', 'April', 'May',
    'June', 'July', 'August', 'September',
    'October', 'November', 'December'
];

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

class LabsOverview extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeWalletDevices: '',
            deltaWalletInstalls: '',
            percentageWalletInstalls: '',
            globalWalletData: '',
            walletCountryList: '',
            walletListsDate: '',
        }

        // Binding functions used in this Class
        this.handleClick = this.handleClick.bind(this);
    }

    // Function ran when the eventlistener is activated. Close dropdown menu if clicked outside of it
    handleClick = (event) => {
        if (event.target.id !== "dropdownMenu") {
            trackEvent('Labs Page', `Clicked on Labs Wallets page`)
        }
    }

    componentDidMount() {
        window.addEventListener('mousedown', this.handleClick);     // Handles closing of dropdown menu        

        var wTopListPromise = Promise.resolve(getWalletTopLists())
        var wCountryListPromise = Promise.resolve(getWalletCountryList())

        Promise.all([wTopListPromise, wCountryListPromise]).then(data => {
            var walletListData = data[0]
            var wCountryListData = data[1]

            var year = walletListData.top_active_devices[0].date.slice(0, 4)
            var month = Number(walletListData.top_active_devices[0].date.slice(5, 7) - 1)
            var walletdateString = `${monthsList[month]} ${year}`
            this.setState({
                activeWalletDevices: walletListData.top_active_devices,
                deltaWalletInstalls: walletListData.delta_active_installs,
                percentageWalletInstalls: walletListData.percentage_delta_installs,
                globalWalletData: walletListData.global_active_devices,
                walletCountryList: wCountryListData,
                walletListsDate: walletdateString,
            })
        })
    }

    render() {
        const { // Declare data arrays used in class
            activeWalletDevices,
            deltaWalletInstalls,
            percentageWalletInstalls,
            globalWalletData,
            walletCountryList,
        } = this.state

        const { // Declare data arrays used in class
            walletCountryList2,
        } = this.props

        return (
            <Container>
                <Segment>
                    <Label ribbon>Android Wallet Metrics</Label>
                    <h4>Month: {this.state.walletListsDate}</h4>
                    <Grid stackable>
                        <Grid.Row width={15}>
                            <Grid.Column width={5}>
                                {
                                    (activeWalletDevices.length !== 0) &&
                                    <Table selectable singleLine unstackable fixed>
                                        <Table.Header>
                                            <Table.Row singleLine>
                                                <Table.HeaderCell>Country</Table.HeaderCell>
                                                <Table.HeaderCell textAlign='right'>Active Installs</Table.HeaderCell>
                                            </Table.Row>
                                        </Table.Header>

                                        <Table.Body>
                                            {activeWalletDevices.slice(0, 6).map((row) =>
                                                <Table.Row key={row.id}>
                                                    <Table.Cell><Flag name={walletCountryList2[row.country].flag} />{walletCountryList2[row.country].country_name.toLocaleString('en')}</Table.Cell>
                                                    <Table.Cell textAlign='right'>{row.active_devices.toLocaleString('en')}</Table.Cell>
                                                </Table.Row>
                                            )}
                                            <Table.Row>
                                                <Table.Cell><b>All countries</b></Table.Cell>
                                                <Table.Cell textAlign='right'><b>{globalWalletData.active_device_installs.toLocaleString('en')}</b></Table.Cell>
                                            </Table.Row>
                                        </Table.Body>
                                    </Table>
                                }
                            </Grid.Column>

                            {
                                this.state.deltaWalletInstalls.length !== 0 && (
                                    <Grid.Column width={5}>
                                        <Table selectable singleLine unstackable fixed>
                                            <Table.Header>
                                                <Table.Row>
                                                    <Table.HeaderCell>Country</Table.HeaderCell>
                                                    <Table.HeaderCell textAlign='right'>New Installs</Table.HeaderCell>
                                                </Table.Row>
                                            </Table.Header>

                                            <Table.Body>
                                                {deltaWalletInstalls.slice(0, 6).map((row) =>
                                                    <Table.Row key={row.id}>
                                                        <Table.Cell><Flag name={walletCountryList2[row.country].flag} />{walletCountryList2[row.country].country_name}</Table.Cell>
                                                        <Table.Cell textAlign='right'>{row.delta_installs.toLocaleString('en')}</Table.Cell>
                                                    </Table.Row>
                                                )}

                                                <Table.Row>
                                                    <Table.Cell><b>All countries</b></Table.Cell>
                                                    <Table.Cell textAlign='right'><b>{globalWalletData.delta_active_installs.toLocaleString('en')}</b></Table.Cell>
                                                </Table.Row>
                                            </Table.Body>
                                        </Table>
                                    </Grid.Column>
                                ) || (<Grid.Column></Grid.Column>)
                            }
                            {
                                this.state.percentageWalletInstalls.length !== 0 && (
                                    <Grid.Column width={5}>
                                        <Table selectable singleLine unstackable fixed>
                                            <Table.Header>
                                                <Table.Row>
                                                    <Table.HeaderCell>Country</Table.HeaderCell>
                                                    <Table.HeaderCell textAlign='right'>% Change</Table.HeaderCell>
                                                </Table.Row>
                                            </Table.Header>

                                            <Table.Body>
                                                {percentageWalletInstalls.slice(0, 6).map((row) =>
                                                    <Table.Row key={row.id}>
                                                        <Table.Cell><Flag name={walletCountryList2[row.country].flag} />{walletCountryList2[row.country].country_name}</Table.Cell>
                                                        <Table.Cell textAlign='right'>{row.percentage_delta_installs}%</Table.Cell>
                                                    </Table.Row>
                                                )}

                                                <Table.Row>
                                                    <Table.Cell><b>All countries</b></Table.Cell>
                                                    <Table.Cell textAlign='right'><b>{globalWalletData.percentage_delta_installs}%</b></Table.Cell>
                                                </Table.Row>
                                            </Table.Body>
                                        </Table>
                                    </Grid.Column>
                                ) || (<Grid.Column></Grid.Column>)
                            }
                        </Grid.Row>
                    </Grid>
                </Segment>
            </Container>
        )
    }
}

export default LabsOverview