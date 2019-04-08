import React from 'react';
import ReactGA from 'react-ga';

// Analytics
import {getGAKey, trackPage, trackEvent} from '../components/functions/analytics';
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
import KpiExplorer from "../components/labs_content/KpiExplorer";

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
      tab: typeof ctx.query.tab == "undefined" ? "explorer" : ctx.query.tab,   // Default no month to latest
      project: typeof ctx.query.project == "undefined" ? 0 : ctx.query.project,
      kpi: typeof ctx.query.kpi == "undefined" ? 0 : ctx.query.kpi,
      chart: ctx.query.chart,
      url: ctx.pathname,
      as: ctx.asPath,
    }
    return props
  }

  constructor(props) {
    super(props)

    this.state = {
      posSystemData: '',  // Dataset for posystems tab
      walletData: '',     // Dataset for wallet tab
      versionData: '',    // Dataset for posystems tab
      labsData: '',       // Dataset for proposals tab
      tabQueries: {
        // States that can be set by queries 
        project: props.project,
        kpi: props.kpi,
        showChart: props.chart,

        // Booleans for POS systems
        showAnypay: true,
        showPaylive: true,

        // Booleans for Wallets
        showDashCore: true,
        showElectrum: true,
        showCoreAndroid: true,
      },
      labsTabId: props.tab,
      url: '/labs',
      as: props.as,
    }

    // Binding functions in this class
    this.handleSelectTab = this.handleSelectTab.bind(this);
    this.handleQueries = this.handleQueries.bind(this);
  }

  handleSelectTab(event) {
    event.preventDefault();
    this.setState({
      labsTabId: event.currentTarget.id, 
      tabQueries: {},
      as: `/labs?tab=${event.currentTarget.id}`,
    })
    history.pushState(this.state, '', `/labs?tab=${event.currentTarget.id}`)                    // Push State to history
    trackEvent('Labs Page', `Changed Tab to ${event.currentTarget.id}`)                 // Track Event on Google Analytics
  }

  handleQueries(tabId, queries) {
    if (tabId == 'explorer') {
      this.setState({
        tabQueries: {
          project: queries.activeProject,
          kpi: queries.activeKpi,
        },
        as: `/labs?tab=explorer&project=${queries.activeProject}&kpi=${queries.activeKpi}`,
      })
      history.pushState(this.state, '', `/labs?tab=explorer&project=${queries.activeProject}&kpi=${queries.activeKpi}`)
    }
    if (tabId == 'possystems') { 
      this.setState({
        tabQueries: {
          showAnypay: queries.anypay,
          showPaylive: queries.paylive,
          showChart: queries.chart
        },
        as: `/labs?tab=POSsystems&chart=${queries.chart}`,
      })
      history.pushState(this.state, '', `/labs?tab=POSsystems&chart=${queries.chart}`)
    } 
    if (tabId == 'wallets') { 
      this.setState({
        tabQueries: {
          showDashCore: queries.dashCore,
          showElectrum: queries.electrum,
          showCoreAndroid: queries.coreAndroid,
          showChart: queries.chart
        },
        as: `/labs?tab=wallets&chart=${queries.chart}`,
      })
      history.pushState(this.state, '', `/labs?tab=wallets&chart=${queries.chart}`)
    }    
  }

  componentDidMount() {
    // To handle calls from history (forward and back buttons)
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
    })
    trackPage(`/labs`)  // Track Pageview in Analytics
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.tabQueries !== this.state.tabQueries || prevState.labsTabId !== this.state.labsTabId) {         // Just a history state update because it doesn't always work as desired in functions
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
    }
  }

  render() {
    const { // Declare data arrays used in class
      posSystemData,
      walletData,
      versionData,
      labsData,
      tabQueries,
    } = this.state

    return (
      <main>
        <Header></Header>
        <NavBar
          showPage="labs"
        />
        <section className="pagewrapper">
          <div className="monthTab" id='explorer' value={this.state.labsTabId == 'explorer' ? "Active" :
            "Inactive"} onClick={this.handleSelectTab}><p className="monthTabText">Proposals</p></div>
          <div className="monthTab" id='merchants' value={this.state.labsTabId == 'merchants' ? "Active" :
            "Inactive"} onClick={this.handleSelectTab}><p className="monthTabText">Merchants</p></div>
          <div className="monthTab" id='POSsystems' value={this.state.labsTabId == 'POSsystems' ? "Active" :
            "Inactive"} onClick={this.handleSelectTab}><p className="monthTabText">POS Systems</p></div>
          <div className="monthTab" id='wallets' value={this.state.labsTabId == 'wallets' ? "Active" :
            "Inactive"} onClick={this.handleSelectTab}><p className="monthTabText">Wallets</p></div>
          <div className="monthPageWrapper">
            <section className="plotWrapper" value={this.state.labsTabId == 'POSsystems' ? "Active" :
              "Inactive"}>
              {
                (posSystemData.length > 0) ? (
                  <div>
                    <PosSystems
                      posSystemData={posSystemData}
                      queryFunction={this.handleQueries}
                      tabQueries={tabQueries}
                    />
                  </div>
                ) : (
                    null
                  )
              }
            </section>
            <section className="plotWrapper" value={this.state.labsTabId == 'wallets' ? "Active" :
              "Inactive"}>
              {
                (walletData.length > 0) ? (
                  <div>
                    <Wallets
                      walletData={walletData}
                      versionData={versionData}
                      queryFunction={this.handleQueries}
                      tabQueries={tabQueries}
                    />
                  </div>
                ) : (
                    null
                  )
              }
            </section>
            <section className="plotWrapper" value={this.state.labsTabId == 'explorer' ? "Active" :
              "Inactive"}>
              {
                (labsData.length > 0) ? (
                  <div>
                    <KpiExplorer
                      labsData={labsData}
                      queryFunction={this.handleQueries}
                      tabQueries={tabQueries}
                    />
                  </div>
                ) : (
                  <section>
                    Loading&hellip;
                  </section>
                  )
              }
            </section>
          </div>
        </section>
      </main>
    )
  }
}

export default Labs