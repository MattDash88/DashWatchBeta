import React from 'react';
import {
    Dropdown,
    Form,
    Divider,
    Menu,
    Image,
    Icon,
    Grid,
} from 'semantic-ui-react';

// Analytics
import { trackEvent, trackSearch } from '../functions/analytics';

class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showLabsSubmenu: false,
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleLabsMenu = this.handleLabsMenu.bind(this);
        this.callEvent = this.callEvent.bind(this);
    }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    handleLabsMenu = (e, { name }) => this.setState({ showLabsSubmenu: !this.state.showLabsSubmenu })

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
            showLabsSubmenu,
        } = this.state

        const { // Declare data arrays used in class
            showPage,
            searchQuery,
        } = this.props

        return (
            <main style={{ marginTop: '0px' }}>
                <Grid>
                    <Grid.Row only={'widescreen', 'large screen', 'computer'}>
                        <Menu fluid color='blue' inverted style={{ minHeight: '50px' }} >
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
                                style={{ width: '10%', alignItems: 'middle' }}
                                name='proposals'
                                active={showPage === 'proposals'}
                                href='/proposals' target=''
                                onClick={this.handleItemClick}
                            >
                                <h3>Proposals</h3>
                            </Menu.Item>

                            <Menu.Item
                                style={{ width: '30%' }}
                                name='searchBar'
                            >
                                <Form onSubmit={this.handleSubmit} widths={'equal'}>
                                    <Form.Input
                                        action={{ type: 'submit', content: 'Go' }}
                                        placeholder='Search proposal ID or proposer'
                                        value={searchQuery}
                                    />
                                </Form>
                            </Menu.Item>

                            <Menu.Item
                                style={{ width: '15%', alignItems: 'middle' }}
                                name='elections'
                                active={showPage === 'elections'}
                                href='/elections' target=''
                                onClick={this.handleItemClick}
                            >
                                <h3>Elections</h3>
                            </Menu.Item>

                            <Menu.Item
                                style={{ width: '10%', alignItems: 'middle' }}
                                name='labs'
                                active={showPage === 'labs'}
                                href='/labs' target=''
                                onClick={this.handleItemClick}
                            >
                                <h3>Labs</h3>
                            </Menu.Item>
                            <Menu.Item
                                style={{ width: '10%', alignItems: 'middle' }}
                                name='about'
                                active={showPage === 'about'}
                                href='/about' target=''
                                onClick={this.handleItemClick}
                            >
                                <h3>About</h3>
                            </Menu.Item>
                        </Menu>
                    </Grid.Row>

                    <Grid.Row only='tablet mobile'>
                        <Menu fluid color='blue' inverted style={{ minHeight: '50px' }}>
                            <Dropdown
                                item
                                floating
                                icon={<h3><Icon name='bars' size='large' />Menu</h3>}
                                simple
                                style={{ marginLeft: '0px' }}
                            >
                                <Dropdown.Menu>
                                    <Form onSubmit={this.handleSubmit} >
                                        <Form.Input
                                            action={{ type: 'submit', content: 'Go' }}
                                            placeholder='Search proposal ID or proposer'
                                            value={searchQuery}
                                        />
                                    </Form>
                                    <Dropdown.Item
                                        value='proposals'
                                        href='/reports' target=''
                                        onClick={this.handleItemClick}
                                    ><h3>Reports</h3></Dropdown.Item>
                                    <Dropdown.Item
                                        value='proposals'
                                        href='/proposals' target=''
                                        onClick={this.handleItemClick}
                                    ><h3>Proposals</h3>
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        value='elections'
                                        href='/elections' target=''
                                        onClick={this.handleItemClick}
                                    ><h3>Elections</h3>
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        value='labs'
                                        onClick={this.handleLabsMenu}
                                    ><h3><Icon name={showLabsSubmenu ? 'caret down' : 'caret right'} /> Labs </h3>
                                    </Dropdown.Item>
                                    <Divider
                                        style={{ display: showLabsSubmenu ? '' : 'none' }}
                                    />
                                    <Dropdown.Item
                                        value='overview'
                                        href='/labs?tab=overview' target=''
                                        onClick={this.handleItemClick}
                                        style={{ display: showLabsSubmenu ? '' : 'none', marginLeft: '10px' }}
                                    ><h4>Labs Main</h4>
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        value='wallets'
                                        href='/labs?tab=wallets' target=''
                                        onClick={this.handleItemClick}
                                        style={{ display: showLabsSubmenu ? '' : 'none', marginLeft: '10px' }}
                                    ><h4>Labs Wallets</h4>
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        value='websites'
                                        href='/labs?tab=websites' target=''
                                        onClick={this.handleItemClick}
                                        style={{ display: showLabsSubmenu ? '' : 'none', marginLeft: '10px' }}
                                    ><h4>Labs Websties</h4>
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        value='kpiExplorer'
                                        href='/labs?tab=kpiExplorer' target=''
                                        onClick={this.handleItemClick}
                                        style={{ display: showLabsSubmenu ? '' : 'none', marginLeft: '10px' }}
                                    ><h4>Labs KPI Explorer</h4>
                                    </Dropdown.Item>
                                    <Divider
                                        style={{ display: showLabsSubmenu ? '' : 'none' }}
                                    />
                                    <Dropdown.Item
                                        value='about'
                                        href='/about' target=''
                                        onClick={this.handleItemClick}
                                    ><h3>About</h3>
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            <Menu.Item
                                name='home'
                                href='/' target=''
                                onClick={this.handleItemClick}
                            >
                                <Image id="Home" src="/static/images/logo_white20.png" size='small '/>
                            </Menu.Item>
                        </Menu>
                    </Grid.Row>
                </Grid>
            </main>
        )
    }
}

export default NavBar