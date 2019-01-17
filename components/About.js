import React from 'react';
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
            Dash Watch website revisited v0.9.1 <span className="aboutLink" onClick={this.toggleChangelog}>[Changelog]</span> by Matt<br></br>
            <div className={this.state.show ? "display-block" : "display-none"}>
            <div className="changelogWrapper">
            <div className="aboutHeader">Changelog v0.9.1</div>
            Other
            <li>Added header to Proposal List</li>
            <li>Fixed some bugs in the colour coding of some KPI metrics</li>
            <li>Improved outlining of images on Navbar and Month page</li>
            <li>Added API call for internal Dash Watch propoct</li>
            <li>A couple of other fixes and improvements.</li>
            <div className="aboutHeader">Changelog v0.9</div>
            Proposal List Page
            <li>Added filter for opted out and reporting concluded proposals.</li>
            <li>Added title and counter at top of proposal list page</li>            
            Month Page
            <li>The Month page can now show report lists from previous months.</li>
            <li>Added support for videos</li>
            <li>Added icon to indicate whether an item is a pdf or video</li>
            Single Proposal Page
            <li>Added styling to Performance and Funding elements, for example "Not Provided" will now show up red.</li>
            <li>Video reports added to the report tab</li>
            Back-end
            <li>Airtable data requests were moved to their own file. Each of the 8 tables used now has its own function and cache making data retrieval much more flexible</li>
            <li>Back-end sorting functions were moved to their own file, cleaning up the code and they can now be reused.</li>
            <li>Data elements are now grouped per tab, main_data, kpi_data, financial_data, report_data and list_data. This significantly simplifies handover of data between pages and maintanability.</li>
            <li>Searches and proposal page requests are now handled on the server side</li>
            <li>Search query altered to allow filtering</li>
            <li>Month overview data has been prepared to handle multiple months.</li>
            <li>Included Proposal Owner in the main table, this removes the dependency on the "Proposal Owner" reducing the number of queries to Airtable.</li>
            Other
            <li>Fixed a bug in the Social Media KPIs where "new likes" actually showed the metric for "new comments"</li>
            <li>Fixed issue that searching before the data was loaded would return no results.</li>
            <li>Changed estimated completion to anticipated completion to better match reports.</li>
            <li>Added indicator to Navbar highlighting the page the user is on.</li>
            <li>Added scroll to top button on potentially long pages</li>
            <li>Many other small styling tweaks and code improvements.</li>
            <br></br>
            </div>
            </div>
        </div>
        )
    }
}

export default AboutPage