import React from 'react';
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
    Table,
    Flag,
    Image,
    Grid,
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
        
        var wTopListPromise =  Promise.resolve(getWalletTopLists())
        var wCountryListPromise = Promise.resolve(getWalletCountryList())
        
        Promise.all([wTopListPromise, wCountryListPromise]).then(data => {
            var walletListData = data[0]
            var wCountryListData = data[1]
            
            var year = walletListData.top_active_devices[0].date.slice(0,4)
            var month = Number(walletListData.top_active_devices[0].date.slice(5,7))
            var walletdateString = `${monthsList[month]} ${year}`
            this.setState({
                activeWalletDevices: walletListData.top_active_devices,
                deltaWalletInstalls: walletListData.delta_active_devices,
                walletCountryList: wCountryListData,
                walletListsDate: walletdateString,
            })
        })
    }

    render() {
        const { // Declare data arrays used in class
            activeWalletDevices,
            deltaWalletInstalls,
            walletCountryList,
        } = this.state
        return (
    <Container>
                    <h1>Wallet Metrics</h1>
                    <h2>{this.state.walletListsDate}</h2>
    <Grid>
    <Grid.Column width={4}>
    {
                   this.state.activeWalletDevices.length !== 0 && 
                    <Table collapsing selectable >
                        <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Country</Table.HeaderCell>
                            <Table.HeaderCell>Active Installs</Table.HeaderCell>
                        </Table.Row>
                        </Table.Header>

                        <Table.Body>
                        {activeWalletDevices.slice(0,6).map((row) =>
                        <Table.Row key={row.id}>
                            <Table.Cell><Flag name = {walletCountryList[row.country].flag} />{walletCountryList[row.country].country_name}</Table.Cell>
                            <Table.Cell>{row.active_devices}</Table.Cell>
                        </Table.Row>
                        )}
                        </Table.Body>
                    </Table>
                }
    </Grid.Column>
    
    {
                   this.state.deltaWalletInstalls.length !== 0 && (
                    <Grid.Column width={4}>
                    <Table collapsing selectable>
                        <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Country</Table.HeaderCell>
                            <Table.HeaderCell>Delta Installs</Table.HeaderCell>
                        </Table.Row>
                        </Table.Header>

                        <Table.Body>
                        {deltaWalletInstalls.slice(0,6).map((row) =>
                        <Table.Row key={row.id}>
                            <Table.Cell><Flag name = {row.country.toLowerCase()} />{row.country}</Table.Cell>
                            <Table.Cell>{row.delta_installs}</Table.Cell>
                        </Table.Row>
                        )}
                        </Table.Body>
                    </Table>
                    </Grid.Column>
                   ) || (<Grid.Column></Grid.Column>)}
    
    <Grid.Column width={8}>Right</Grid.Column>
  </Grid>
  </Container>
            
        )
    }
}

export default LabsOverview