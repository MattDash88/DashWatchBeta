import React from 'react';

// Import css
import "./css/style.css";
import './css/monthstyle.css';
import './css/single.css';
import './css/about.css';

class AboutPage extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        show: false,
      };
      this.toggleChangelog = this.toggleChangelog.bind(this);    
    }

    toggleChangelog = () => {
        this.state.show ? this.setState({ show: false}) : this.setState({ show: true})
      };
  
    render() {
        return(
        <div className="aboutWrapper">
            <div className="aboutHeader">Dash Watch contact</div>
            Email: team at dashwatch.org <br></br>
            Twitter: <span><a link href="https://twitter.com/DashWatch">HERE</a></span><br></br>
            YouTube: <span><a link href="https://www.youtube.com/channel/UCfWWHvfsdvmIISr6ZSit4-Q">HERE</a></span><br></br>
            Discord: <br></br>
            paragon#2778 <br></br>
            Dash-AI#1455 (Quickest Response)<br></br>
            DashWatchTeam#5277<br></br>
            MattDash#6481 (Dash Watch Beta Website)<br></br>
            <div className="aboutHeader">API Access</div>
            <div>Please note that API support is currently still in beta and that the data structure may still be susceptible to change. This is especially the case for performance data.</div>
            <span>All data can be accessed via an API at </span>
                <span>
                <a link href="http://dashwatchbeta.org/api/get/posts" target="_blank">/api/get/posts</a></span><br></br>
            <div>Single proposals can be accessed through "/api/p/slug_from_dc" for example  <a link href="http://dashwatchbeta.org/api/p/ANYPAY_JUNE_2018">http://dashwatchbeta.org/api/p/ANYPAY_JUNE_2018</a>. 
            There are a few exceptions for proposals that have identical names they are available here:</div>
            <div><a link href="http://dashwatchbeta.org/api/p/Dash-Help-Support-Center_201803">Dash-Help-Support-Center_201803</a></div>
            <div><a link href="http://dashwatchbeta.org/api/p/Dash-Help-Support-Center_201808">Dash-Help-Support-Center_201808</a></div>
            <div><a link href="http://dashwatchbeta.org/api/p/Dash-Help-Support-Center_201811">Dash-Help-Support-Center_201811</a></div>
            <br></br>
            Dash Watch website revisited v0.9.3 by Matt available on GitHub <a link href="https://github.com/MattDash88/DashWatchBeta">HERE</a><br></br>
        </div>
        )
    }
}

export default AboutPage