import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
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
import NavBar from "../components/elements/NavBar";

import PosSystems from "../components/labs_content/PosSystems";

const trackPage = (page) => { // Function to track page views
  ReactGA.pageview(page);
}

const trackEvent = (event) => { // Function to track user interaction with page
  ReactGA.event({
    category: 'Labs Page',
    action: event,
  });
}

// API query requesting Trust Protector Candidate List data
const getLabsData = () => {
  return (
    new Promise((resolve) => {
      fetch(`http://localhost:5000/api/get/labsData`)
        .then((res) => res.json()
          .then((res) => {
            resolve(res.data)
          })
        )
    })
  )
}

const dataTx = {
  datasets: [
    {
      label: 'Dash.red (estimate)',
      backgroundColor: '#f44336',
      borderColor: '#f44336',
      borderWidth: 1,
      hoverBackgroundColor: '#f44336',
      hoverBorderColor: '#f44336',
    }, {
      label: 'MyDashWallet',
      backgroundColor: '#2196F3',
      borderColor: '#2196F3',
      borderWidth: 1,
      hoverBackgroundColor: '#2196F3',
      hoverBorderColor: '#2196F3',
    }, {
      label: 'Dash Text',
      backgroundColor: '#13c645',
      borderColor: '#13c645',
      borderWidth: 1,
      hoverBackgroundColor: '#13c645',
      hoverBorderColor: '#13c645',
    }, {
      label: 'Anypay',
      backgroundColor: '#3f51b5',
      borderColor: '#3f51b5',
      borderWidth: 1,
      hoverBackgroundColor: '#3f51b5',
      hoverBorderColor: '#3f51b5',
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
    }, {
      label: 'macOS',
      backgroundColor: '#2196F3',
      borderColor: '#2196F3',
      borderWidth: 1,
      hoverBackgroundColor: '#2196F3',
      hoverBorderColor: '#2196F3',
    }, {
      label: 'Linux',
      backgroundColor: '#3f51b5',
      borderColor: '#3f51b5',
      borderWidth: 1,
      hoverBackgroundColor: '#3f51b5',
      hoverBorderColor: '#3f51b5',
    }, {
      label: 'Android',
      backgroundColor: '#13c645',
      borderColor: '#13c645',
      borderWidth: 1,
      hoverBackgroundColor: '#13c645',
      hoverBorderColor: '#13c645',
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
    }
  ],
};



class Labs extends React.Component {
  static async getInitialProps(ctx) {
    const props = {
      url: ctx.pathname,
      as: ctx.asPath,
    }
    return props
  }

  constructor(props) {
    super(props)

    this.state = {
      posSystemData: '',
      chartType: '',
      showMenu: false,
      url: '/labs',
      as: props.as,
    }

    // Binding functions in this class
    this.handleSelectChart = this.handleSelectChart.bind(this)
    this.handleSelectTab = this.handleSelectTab.bind(this);
    this.handleDropdown = this.handleDropdown.bind(this);
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

  handleSelectChart(event) {
    this.setState({
      chartType: event.currentTarget.value,        // Change state to load different month
      showMenu: false,
      as: `/labs?chart=${event.currentTarget.value}`,
    })

    history.pushState(this.state, '', `/labs?chart=${event.currentTarget.value}`)   // Push State to history
    trackEvent(`Changed Chart to ${event.currentTarget.value} ${this.state.yearId}`)                 // Track Event on Google Analytics    
  }

  handleDropdown(event) {
    event.preventDefault();
    this.setState({
      showMenu: !this.state.showMenu,
    })
  }

  componentDidMount() {
    onpopstate = event => {
      if (event.state) {
        this.setState(event.state)
      }
    }

    var labsData = Promise.resolve(getLabsData());

    Promise.all([labsData]).then(data => {
      this.setState({
        posSystemData: data[0].pos_system_data,
      })
    }).then(history.replaceState(this.state, '', `${this.state.as}`))

    trackPage(`/labs`)  // Track Pageview in Analytics
  }

  render() {
    const { // Declare data arrays used in class
      posSystemData,
    } = this.state

    return (
      <main>
        <Header></Header>
        <NavBar
          showPage="labs"
        />
        <section className="plotPageWrapper">
          <div className="monthTab" id='Plotly' value={this.state.dataId == 'Plotly' ? "Active" :
            "Inactive"} onClick={this.handleSelectTab}><p className="monthTabText">Merchants</p></div>
          <div className="monthTab" id='PosSystems' value={this.state.dataId == 'Transactions' ? "Active" :
            "Inactive"} onClick={this.handleSelectTab}><p className="monthTabText">POS Systems</p></div>
          <div className="monthPageWrapper">
            <div className="plotWrapper" value="Active">              
              {
                  (posSystemData.length > 0) ? (
              <section>
                <PosSystems
                    posSystemData={posSystemData}
                    url={this.state.url}
                    as={this.state.as}
                />
              </section>
                  ) : (
                    null
                  )
              }
            </div>
          </div>
        </section>
      </main>
    )
  }
}

export default Labs