import React from 'react';
import { Bar } from 'react-chartjs-2';
import ReactGA from 'react-ga';

// Analytics
import getGAKey from '../components/functions/analytics';
ReactGA.initialize(getGAKey);

// Import css
import '../components/css/style.css';
import '../components/css/monthstyle.css';
import '../components/css/labs.css';


// Import other elements 
import Header from '../components/headers/LabsHeader';
import NavBar from "../components/elements/NavBar"

const trackPage = (page) => { // Function to track page views
  ReactGA.pageview(page);
}

const trackEvent = (event) => { // Function to track user interaction with page
  ReactGA.event({
    category: 'Labs Page',
    action: event,
  });
}

// Data Transactions
var dashRed = [1575, 925, 1050]
var dashText = [0, 12, 7]
var myDashWallet = [388, 450, 247.5]
var Anypay = [13, 6, 11]

// Data Electrum
var electrumWindows = [659, 409, 91]
var electrumMac = [119, 39, 16]
var electrumLinux = [324, 100, 35]
var electrumAndroid = [129, 68, 12]

// Dash Help
var dashHelp = [114, 205, 238, 316, 341, 202, 284]

const dataTx = {
  datasets: [
    {
      label: 'Dash.red (estimate)',
      backgroundColor: '#f44336',
      borderColor: '#f44336',
      borderWidth: 1,
      hoverBackgroundColor: '#f44336',
      hoverBorderColor: '#f44336',
      data: dashRed
    }, {
      label: 'MyDashWallet',
      backgroundColor: '#2196F3',
      borderColor: '#2196F3',
      borderWidth: 1,
      hoverBackgroundColor: '#2196F3',
      hoverBorderColor: '#2196F3',
      data: myDashWallet
    }, {
      label: 'Dash Text',
      backgroundColor: '#13c645',
      borderColor: '#13c645',
      borderWidth: 1,
      hoverBackgroundColor: '#13c645',
      hoverBorderColor: '#13c645',
      data: dashText
    }, {
      label: 'Anypay',
      backgroundColor: '#3f51b5',
      borderColor: '#3f51b5',
      borderWidth: 1,
      hoverBackgroundColor: '#3f51b5',
      hoverBorderColor: '#3f51b5',
      data: Anypay
    }
  ],
  labels: ['Nov 2018', 'Dec 2018', 'Jan 2019'],
};

const dataElectrum = {

  datasets: [
    {
      label: 'Windows',
      backgroundColor: '#f44336',
      borderColor: '#f44336',
      borderWidth: 1,
      hoverBackgroundColor: '#f44336',
      hoverBorderColor: '#f44336',
      data: electrumWindows
    }, {
      label: 'macOS',
      backgroundColor: '#2196F3',
      borderColor: '#2196F3',
      borderWidth: 1,
      hoverBackgroundColor: '#2196F3',
      hoverBorderColor: '#2196F3',
      data: electrumMac
    }, {
      label: 'Linux',
      backgroundColor: '#3f51b5',
      borderColor: '#3f51b5',
      borderWidth: 1,
      hoverBackgroundColor: '#3f51b5',
      hoverBorderColor: '#3f51b5',
      data: electrumLinux
    }, {
      label: 'Android',
      backgroundColor: '#13c645',
      borderColor: '#13c645',
      borderWidth: 1,
      hoverBackgroundColor: '#13c645',
      hoverBorderColor: '#13c645',
      data: electrumAndroid
    }
  ],
  labels: ['3.2.3.2 (Released: 2018-12-14)', '3.2.4 (Released: 2019-01-04)', '3.2.5 (Released: 2019-02-20)'],
};

const dataHelp = {
  labels: ['Jul 2018', 'Aug 2018', 'Sep 2018', 'Oct 2018', 'Nov 2018', 'Dec 2018', 'Jan 2019'],
  datasets: [
    {
      label: 'Dash Help Support Requests',
      backgroundColor: '#2196F3',
      borderColor: '#2196F3',
      borderWidth: 1,
      hoverBackgroundColor: '#2196F3',
      hoverBorderColor: '#2196F3',
      data: dashHelp
    }
  ],
};

const getData = (dataId) => {
  if (dataId == 'Transactions') {
    return (
      dataTx
    )
  } else if (dataId == 'Electrum') {
    return (
      dataElectrum
    )
  } else if (dataId == 'Dash Help') {
    return (
      dataHelp
    )
  } else {
    return (
      dataHelp
    )
  }
}

const getTabTitle = (dataId) => {
  if (dataId == 'Transactions') {
    return (
      'Average Dash Transactions by known source'
    )
  } else if (dataId == 'Electrum') {
    return (
      'Dash Electrum downloads by version'
    )
  } else if (dataId == 'Dash Help') {
    return (
      'Dash Help support requests per month'
    )
  } else {
    return (
      'Plotly charts'
    )
  }
}

class Labs extends React.Component {
  constructor() {
    super()

    this.state = {
      dataId: 'Electrum',
      tabTitle: '',
      data: dataElectrum,
      showPlotly: false,
      plotlyData: '',
    }

    // Binding functions in this class
    this.handleSelectTab = this.handleSelectTab.bind(this);

  }

  handleSelectTab(event) {
    event.preventDefault();
    this.setState({
      dataId: event.currentTarget.id,
    })
    if (event.currentTarget.id == 'Plotly') {
      this.setState({
        showPlotly: true,
        plotlyData: (<iframe width="1000" height="800" frameBorder="0" scrolling="no" src="//plot.ly/~dashwatch/0.embed"></iframe>)
      })
    } else {
      this.setState({
        showPlotly: false,
      })
    }
    trackEvent(`Changed Tab to ${event.currentTarget.id}`)                 // Track Event on Google Analytics
  }

  componentDidMount() {
    // Promise to get the initial "month list" records 
    this.setState({
      data: getData(this.state.dataId),
      tabTitle: getTabTitle(this.state.dataId),
    })
    
    trackPage(`/labs`)  // Track Pageview in Analytics
  }

  componentDidUpdate(prevProps, prevState) {
    // Update "Proposal list" data for search and filters
    if (prevState.dataId !== this.state.dataId) {
      this.setState({
        data: getData(this.state.dataId),
        tabTitle: getTabTitle(this.state.dataId),
      })
    }

  }

  render() {

    const options = {
      scales: {
        xAxes: [{
          stacked: true
        }],
        yAxes: [{
          stacked: true
        }]
      }
    }

    return (

      <main>
        <Header></Header>
        <NavBar
          showPage="labs"
        />
        <section className="plotPageWrapper">
          <div className="monthTab" id='Plotly' value={this.state.dataId == 'Plotly' ? "Active" :
            "Inactive"} onClick={this.handleSelectTab}><p className="monthTabText">Merchants</p></div>
          <div className="monthTab" id='Transactions' value={this.state.dataId == 'Transactions' ? "Active" :
            "Inactive"} onClick={this.handleSelectTab}><p className="monthTabText">Transactions</p></div>
          <div className="monthTab" id='Electrum' value={this.state.dataId == 'Electrum' ? "Active" :
            "Inactive"} onClick={this.handleSelectTab}><p className="monthTabText">Dash Electrum</p></div>
          <div className="monthTab" id='Dash Help' value={this.state.dataId == 'Dash Help' ? "Active" :
            "Inactive"} onClick={this.handleSelectTab}><p className="monthTabText">Dash Help</p></div>
          <div className="monthPageWrapper">
            <div className="plotWrapper" value={this.state.showPlotly ? "Inactive" : "Active"}>
              <h1 className="monthHeader">{this.state.tabTitle}</h1>
              <Bar
                data={this.state.data}
                options={options}
              />
            </div>
          </div>
          <div className="plotWrapper" value={this.state.showPlotly ? "Active" : "Inactive"}>
            {this.state.plotlyData}
          </div>
        </section>
      </main>
    )
  }
}

export default Labs