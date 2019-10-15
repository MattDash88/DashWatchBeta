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
} from 'semantic-ui-react';

// Analytics
import { trackEvent } from '../functions/analytics';

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

  class LabsOverview extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeWalletDevices: '',
            deltaWalletInstalls: '',
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
        Promise.resolve(getWalletTopLists()).then(data => {
            this.setState({
                activeWalletDevices: data.top_active_devices,
                deltaWalletInstalls: data.delta_active_devices,
            })
        })
    }

    render() {
        const { // Declare data arrays used in class
            activeWalletDevices,
            deltaWalletInstalls,
        } = this.state
        return (
            <main>
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
                            <Table.Cell><Flag name = {row.country.toLowerCase()} />{row.country}</Table.Cell>
                            <Table.Cell>{row.active_devices}</Table.Cell>
                        </Table.Row>
                        )}
                        </Table.Body>
                    </Table>
                }

{
                   this.state.deltaWalletInstalls.length !== 0 && 
                    <Table collapsing selectable >
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
                }
            </main>
        )
    }
}

export default LabsOverview