import React from 'react';
import ReactGA from 'react-ga';

// Analytics
import getGAKey from '../functions/analytics';
ReactGA.initialize(getGAKey);

// Import css
import "../css/style.css";

const trackEvent = (event) => {
    ReactGA.event({
        category: 'NavBar',
        action: event,
    });
}

const trackSearch = (event) => {
    ReactGA.event({
        category: 'Search',
        action: event,
    });
}

class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.callEvent = this.callEvent.bind(this);
    }

    // Function to handle the search field
    handleSubmit(event) {
        event.preventDefault();
        history.pushState(null, null, `/proposals?search=${event.target[0].value}`)
        location.replace(`/proposals?search=${event.target[0].value}`)
        trackSearch('Searched: ' + event.target[0].value )
    }

    callEvent(event) {
        trackEvent('Clicked ' + event.currentTarget.id)
    }
   
    render() {
        const { // Declare data arrays used in class
            showPage,
            searchQuery,
        } = this.props
        return (
            <div className="menu">
                <nav className="menuContent">
                    <li className="menuItem" id="image"><a title="Home" id="home" href="/" target="" onClick={this.callEvent}><img id="Home" src="https://dashwatchbeta.org/Logo/logo_white20.png"></img></a></li>
                    <li className="menuItem"><a title="Reports" id="reports" value={showPage == "reports" ? "Active" : "Inactive"} href="/reports" target="" onClick={this.callEvent}>Reports</a></li>
                    <li className="menuItem"><a title="Proposals" id="proposals" value={showPage == "proposals" ? "Active" : "Inactive"} href="/proposals" target="" onClick={this.callEvent}>Proposals View</a></li>
                    <form className="searchForm" onSubmit={this.handleSubmit}>
                        <input className="searchField"
                            placeholder={"Search proposal ID or proposer"}
                            ref={(input) => this.textInput = input}
                        />
                    </form>
                    <li className="menuItem"><a title="Labs" id="labs" value={showPage == "labs" ? "Active" : "Inactive"} href="/labs" target="" onClick={this.callEvent}>Labs</a></li>
                    <li className="menuItem"><a title="About" id="about" value={showPage == "about" ? "Active" : "Inactive"} href="/about" target="" onClick={this.callEvent}>About</a></li>
                </nav>
            </div>
        )
    }
}

export default NavBar