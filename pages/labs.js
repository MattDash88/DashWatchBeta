import React from 'react';

// Analytics
import { trackPage, trackEvent } from '../components/functions/analytics';

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

      // States that can be set by queries 
      project: props.project,
      kpi: props.kpi,
      showPosChart: typeof props.chart == "undefined" ? 'Transactions' : props.chart,
      showWalletChart: typeof props.chart == "undefined" ? 'Total' : props.chart,

      // Booleans for POS systems
      showAnypay: true,
      showPaylive: true,

      // Booleans for Wallets
      showDashCore: true,
      showElectrum: true,
      showCoreAndroid: true,
      showCoreiOS: true,

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
      as: `/labs?tab=${event.currentTarget.id}`,
    })
    history.pushState(this.state, '', `/labs?tab=${event.currentTarget.id}`)                    // Push State to history
    trackEvent('Labs Page', `Changed Tab to ${event.currentTarget.id}`)                 // Track Event on Google Analytics
  }

  // Function to handle queries pushed by the sub Classes/tabs
  handleQueries(tabId, queries) {
    if (tabId == 'explorer') {
      this.setState({
        project: queries.activeProject,
        kpi: queries.activeKpi,
        as: `/labs?tab=explorer&project=${queries.activeProject}&kpi=${queries.activeKpi}`,
      })
      history.pushState(this.state, '', `/labs?tab=explorer&project=${queries.activeProject}&kpi=${queries.activeKpi}`)
    }
    if (tabId == 'possystems') {
      this.setState({
        showAnypay: queries.anypay,
        showPaylive: queries.paylive,
        showPosChart: queries.POSChart,
        as: `/labs?tab=POSsystems&chart=${queries.POSChart}`,
      })
      history.pushState(this.state, '', `/labs?tab=POSsystems&chart=${queries.POSChart}`)
    }
    if (tabId == 'wallets') {
      this.setState({
        showDashCore: queries.dashCore,
        showElectrum: queries.electrum,
        showCoreAndroid: queries.coreAndroid,
        showCoreiOS: queries.coreiOS,
        showWalletChart: queries.walletChart,
        as: `/labs?tab=wallets&chart=${queries.walletChart}`,
      })
      history.pushState(this.state, '', `/labs?tab=wallets&chart=${queries.walletChart}`)
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
    }).then(history.replaceState(this.state, '', `${this.state.as}`))
    trackPage(`/labs`)  // Track Pageview in Analytics
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.labsTabId !== this.state.labsTabId || prevState.showPosChart !== this.state.showPosChart || prevState.showWalletChart !== this.state.showWalletChart) {// Just a history state update because it doesn't always work as desired in functions
        history.replaceState(this.state, '', `${this.state.as}`)
    }
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
            <section className="plotWrapper" value={this.state.labsTabId == 'explorer' ? "Active" :
              "Inactive"}>
              {
                (labsData.length > 0) ? (
                  <div>
                    <KpiExplorer
                      labsData={labsData}
                      queryFunction={this.handleQueries}
                      project={this.state.project}
                      kpi={this.state.kpi}
                    />
                  </div>
                ) : (
                    <section>
                      Loading&hellip;
                  </section>
                  )
              }
            </section>
            <section className="plotWrapper" value={this.state.labsTabId == 'merchants' ? "Active" :
              "Inactive"}>
              {
                (this.state.labsTabId == 'merchants') ? (
                  <div>
                    <iframe width="1000" height="800" frameBorder="0" scrolling="no" src="//plot.ly/~dashwatch/0.embed"></iframe>
                  </div>
                ) : (
                    null
                  )
              }
            </section>
            <section className="plotWrapper" value={this.state.labsTabId == 'POSsystems' ? "Active" :
              "Inactive"}>
              {
                (posSystemData.length > 0) ? (
                  <div>
                    <PosSystems
                      posSystemData={posSystemData}
                      queryFunction={this.handleQueries}
                      showAnypay={this.state.showAnypay}
                      showPaylive={this.state.showPaylive}
                      showPosChart={this.state.showPosChart}
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
                      showDashCore={this.state.showDashCore}
                      showElectrum={this.state.showElectrum}
                      showCoreAndroid={this.state.showCoreAndroid}
                      showCoreiOS={this.state.showCoreiOS}
                      showWalletChart={this.state.showWalletChart}
                    />
                  </div>
                ) : (
                    null
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