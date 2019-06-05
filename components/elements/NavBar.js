import React from 'react';

// Analytics
import {trackEvent, trackSearch} from '../functions/analytics';

// Import css
import "../css/style.css";

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
        trackEvent('NavBar', 'Clicked ' + event.currentTarget.id)
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
                    <li className="menuItem" value={showPage == "reports" ? "Active" : "Inactive"}><a title="Reports" id="reports" value={showPage == "reports" ? "Active" : "Inactive"} href="/reportlist" target="" onClick={this.callEvent}>Reports</a></li>
                    <li className="menuItem" value={showPage == "proposals" ? "Active" : "Inactive"}><a title="Proposals" id="proposals" value={showPage == "proposals" ? "Active" : "Inactive"} href="/proposals" target="" onClick={this.callEvent}>Proposals</a></li>
                    <form className="searchForm" onSubmit={this.handleSubmit}>
                    {   // Display the search value in the field when the user is searching
                        searchQuery == '' || typeof searchQuery == 'undefined' ? (
                        <input className="searchField"                        
                        placeholder={"Search proposal ID or proposer"}
                        ref={(input) => this.textInput = input}
                        />
                                ) : (
                        <input className="searchField"                        
                        defaultValue={searchQuery}
                        ref={(input) => this.textInput = input}
                        />
                                )
                    }                      
                    </form>
                    <li className="menuItem" value={showPage == "elections" ? "Active" : "Inactive"}><a title="Trust Protector Elections" id="elections" value={showPage == "elections" ? "Active" : "Inactive"} href="/elections" target="" onClick={this.callEvent}>Elections</a></li>
                    <li className="menuItem" value={showPage == "labs" ? "Active" : "Inactive"}><a title="Labs" id="labs" value={showPage == "labs" ? "Active" : "Inactive"} href="/labs" target="" onClick={this.callEvent}>Labs</a></li>                   
                    <li className="menuItem" value={showPage == "about" ? "Active" : "Inactive"}><a title="About" id="about" value={showPage == "about" ? "Active" : "Inactive"} href="/about" target="" onClick={this.callEvent}>About</a></li>
                </nav>
            </div>
        )
    }
}

export default NavBar