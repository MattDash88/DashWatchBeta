import React from 'react';
import Airtable from 'airtable'
Airtable.configure({apiKey: 'key'});

// Analytics
import {trackPage} from '../components/functions/analytics';

// Import css
import "../components/css/style.css";
import "../components/css/monthstyle.css";
import "../components/css/about.css";

// Import other elements 
import Header from '../components/headers/AboutHeader';
import NavBar from "../components/elements/NavBar"

class About extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {    
    trackPage(`/about`) // Track Pageview in Analytics
  }

  render() {
    return (
      <main>
        <Header></Header>
        <NavBar
          showPage="about"
        />
        <section className="pagewrapper">
          <div className="aboutPageWrapper">
            <div className="aboutHeader">Dash Watch contact</div>
            Email: team at dashwatch.org <br></br>
            <div>Twitter: <span><a type="link" href="https://twitter.com/DashWatch">HERE</a></span><br></br></div>
            <div>YouTube: <span><a type="link" href="https://www.youtube.com/channel/UCfWWHvfsdvmIISr6ZSit4-Q">HERE</a></span><br></br></div>
            Discord: <br></br>
            DashWatchTeam#5277<br></br>
            Dash-AI#1455<br></br>
            MattDash#6481 (Dash Watch Beta Website)<br></br>
            paragon#2778 <br></br>
            <div className="aboutHeader">API Access</div>
            <div>Please note that API support is currently still in beta and that the data structure may still be susceptible to change. This is especially the case for performance data.
            <span>All data can be accessed via an API at </span><span><a type="link" href="http://dashwatchbeta.org/api/get/posts" target="_blank">/api/get/posts</a></span></div><br></br>
            <div>Single proposals can be accessed through "/api/p/slug_from_dc" for example <a type="link" href="http://dashwatchbeta.org/api/p/ANYPAY_JUNE_2018">http://dashwatchbeta.org/api/p/ANYPAY_JUNE_2018</a>.
            There are a few exceptions for proposals that have identical names they are available here:</div>
            <div><a type="link" href="http://dashwatchbeta.org/api/p/Dash-Help-Support-Center_201803">Dash-Help-Support-Center_201803</a></div>
            <div><a type="link" href="http://dashwatchbeta.org/api/p/Dash-Help-Support-Center_201808">Dash-Help-Support-Center_201808</a></div>
            <div><a type="link" href="http://dashwatchbeta.org/api/p/Dash-Help-Support-Center_201811">Dash-Help-Support-Center_201811</a></div>
            <br></br>
            <div>Dash Watch Beta v0.11.2 by Matt available on GitHub <a type="link" href="https://github.com/MattDash88/DashWatchBeta">HERE</a><br></br></div>
          </div>
        </section>
      </main>
    )
  }
}

export default About