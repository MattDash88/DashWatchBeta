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
    Tab,
    Menu,
    Sidebar,
    Header,
    Image,
    Search,
    Icon,
    Grid,
} from 'semantic-ui-react';

// Analytics
import { trackEvent, trackSearch } from '../functions/analytics';

class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.callEvent = this.callEvent.bind(this);
    }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    // Function to handle the search field
    handleSubmit(event) {
        event.preventDefault();
        history.pushState(null, null, `/proposals?search=${event.target[0].value}`)
        location.replace(`/proposals?search=${event.target[0].value}`)
        trackSearch('Searched: ' + event.target[0].value)
    }

    callEvent(event) {
        trackEvent('NavBar', 'Clicked ' + event.currentTarget.id)
    }

    render() {
        const { // Declare data arrays used in class
            showPage,
            searchQuery,
        } = this.props
        return (
            <main fluid style={{ marginTop: '0px' }}>
                <Menu stackable color='dark blue' inverted style={{ minHeight: 50 }} fluid>
                    <Menu.Item
                        style={{ width: '15%' }}
                        name='home'
                        href='/' target=''
                        onClick={this.handleItemClick}
                    >
                        <Image id="Home" src="/static/images/logo_white20.png" size='small' />
                    </Menu.Item>
                    <Menu.Item
                        style={{ width: '10%' }}
                        name='reports'
                        active={showPage === 'reports'}
                        href='/reports' target=''
                        onClick={this.handleItemClick}
                    >
                        <h3>Reports</h3>
                    </Menu.Item>

                    <Menu.Item
                        style={{ width: '10%',  alignItems: 'middle' }}
                        name='proposals'
                        active={showPage === 'proposals'}
                        href='/proposals' target=''
                        onClick={this.handleItemClick}
                    >
                        <h3>Proposals</h3>
                    </Menu.Item>

                    <Menu.Item
                        style={{ width: '35%',  alignItems: 'middle' }}
                        name='searchBar'
                    >
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Group>
                                <Form.Input
                                    action={{ type: 'submit', content: 'Go' }}
                                    placeholder='Search proposal ID or proposer'
                                    value={searchQuery}
                                    input='text'
                                />
                            </Form.Group>
                        </Form>
                    </Menu.Item>

                    <Menu.Item
                        style={{ width: '10%',  alignItems: 'middle' }}
                        name='elections'
                        active={showPage === 'elections'}
                        href='/elections' target=''
                        onClick={this.handleItemClick}
                    >
                        <h3>Elections</h3>
                    </Menu.Item>

                    <Menu.Item
                        style={{ width: '10%',  alignItems: 'middle' }}
                        name='labs'
                        active={showPage === 'labs'}
                        href='/labs' target=''
                        onClick={this.handleItemClick}
                    >
                        <h3>Labs</h3>
                    </Menu.Item>
                    <Menu.Item
                        style={{ width: '10%',  alignItems: 'middle' }}
                        name='about'
                        active={showPage === 'about'}
                        href='/about' target=''
                        onClick={this.handleItemClick}
                    >
                        <h3>About</h3>
                    </Menu.Item>
                </Menu>

                <Menu attached='top'>
                    <Dropdown item icon='bars' simple style={{ minHeight: 50 }}>
                        <Dropdown.Menu scrolling>
                            <Dropdown.Divider />
                            <Dropdown.Item
                                value='overview'
                            ><h3>Overview</h3></Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item
                                value='wallets'
                            ><h3>Wallets</h3>
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item
                                value='websites'
                            ><h3>Websites</h3>
                            </Dropdown.Item>
                            <Dropdown.Item
                                value='websites'
                            ><h3>KPI Explorer</h3>
                            </Dropdown.Item>
                            <Dropdown.Divider />
                        </Dropdown.Menu>
                    </Dropdown>
                </Menu>
            </main>
        )
    }
}

export default NavBar