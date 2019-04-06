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
import Wallets from "../components/labs_content/Wallets";
import ProjectKpis from "../components/labs_content/ProjectKpis";

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
const getLabsPreparedData = () => {
  return (
    new Promise((resolve) => {
      fetch(`/api/get/labsPreparedData`)
        .then((res) => res.json()
          .then((res) => {
            resolve(res.data)
          })
        )
    })
  )
}

// API query requesting Trust Protector Candidate List data
const getLabsAllData = () => {
  return (
    new Promise((resolve) => {
      fetch(`/api/get/labsAllData`)
        .then((res) => res.json()
          .then((res) => {
            resolve(res.data)
          })
        )
    })
  )
}

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
      walletData: '',
      versionData: '',
      labsData: '',
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

    var labsPreparedData = Promise.resolve(getLabsPreparedData());
    var labsAllData = Promise.resolve(getLabsAllData());

    Promise.all([labsAllData, labsPreparedData]).then(data => {
      this.setState({
        labsData: data[0],
        posSystemData: data[1].pos_system_data,
        walletData: data[1].wallet_data,
        versionData: data[1].version_data,
      })
    }).then(history.replaceState(this.state, '', `${this.state.as}`))

    trackPage(`/labs`)  // Track Pageview in Analytics
  }

  render() {
    const { // Declare data arrays used in class
      posSystemData,
      walletData,
      versionData,
      labsData,
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
          <div className="monthTab" id='PosSystems' value={this.state.dataId == 'PosSystems' ? "Active" :
            "Inactive"} onClick={this.handleSelectTab}><p className="monthTabText">POS Systems</p></div>
          <div className="monthTab" id='wallets' value={this.state.dataId == 'wallets' ? "Active" :
            "Inactive"} onClick={this.handleSelectTab}><p className="monthTabText">Wallets</p></div>
          <div className="monthTab" id='other' value={this.state.dataId == 'other' ? "Active" :
            "Inactive"} onClick={this.handleSelectTab}><p className="monthTabText">Other</p></div>
          <div className="monthPageWrapper">
            <div  value="Active">    
            <section className="plotWrapper" value={this.state.dataId == 'PosSystems' ? "Active" :
            "Inactive"}>
              {
                  (posSystemData.length > 0) ? (
              <div>
                <PosSystems
                    posSystemData={posSystemData}
                    url={this.state.url}
                    as={this.state.as}
                />
              </div>
                  ) : (
                    null
                  )
              }
              </section>
              <section className="plotWrapper" value={this.state.dataId == 'wallets' ? "Active" :
            "Inactive"}>
              {
                  (walletData.length > 0) ? (
              <div>
                <Wallets
                    walletData={walletData}
                    versionData={versionData}
                    url={this.state.url}
                    as={this.state.as}
                />
              </div>
                  ) : (
                    null
                  )
              }
              </section>
              <section className="plotWrapper" value={this.state.dataId == 'other' ? "Active" :
            "Inactive"}>
              {
                  (labsData.length > 0) ? (
              <div>
                <ProjectKpis
                    labsData={labsData}
                    url={this.state.url}
                    as={this.state.as}
                />
              </div>
                  ) : (
                    null
                  )
              }
              </section>
            </div>
          </div>
        </section>
      </main>
    )
  }
}

export default Labs