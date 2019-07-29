import React from 'react';
import {
  Container,
  Dropdown,
  Label,
  Form,
  Checkbox,
  Segment,
  Button,
  Divider,
  TextArea,
  Input,
  Message,
  Dimmer,
  Tab,
  Menu,
} from 'semantic-ui-react';


// Analytics
import { trackPage, trackEvent } from '../components/functions/analytics';

// Import css

// Import other elements 
import Header from '../components/headers/LabsHeader';

import Wallets from "../components/labs_content/Wallets";

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
      tab: typeof ctx.query.tab == "undefined" ? "explorer" : ctx.query.tab,        // Default tab is explorer
      project: typeof ctx.query.project == "undefined" ? 0 : ctx.query.project,     // Default project is the first in the list
      kpi: typeof ctx.query.kpi == "undefined" ? 0 : ctx.query.kpi,                 // Default kpi is the first in the list
      country: typeof ctx.query.country == "undefined" ? 'Brazil' : ctx.query.country,  // Default country is the first alphabetically
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
      countryData: '',     // Dataset for wallet tab
      versionData: '',    // Dataset for wallet tab
      labsData: '',       // Dataset for proposals tab

      // States that can be set by queries 
      project: props.project,
      kpi: props.kpi,
      showPosChart: typeof props.chart == "undefined" ? 'Transactions' : props.chart,
      showWalletChart: typeof props.chart == "undefined" ? 'type' : props.chart,
      showWalletType: 'All',
      showWalletCountry: props.country,

      // Booleans for POS systems
      showAnypay: true,
      showPaylive: true,
      showDashRetail: true,

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
        showDashRetail: queries.dashretail,
        showPosChart: queries.POSChart,
        as: `/labs?tab=POSsystems&chart=${queries.POSChart}`,
      })
      history.pushState(this.state, '', `/labs?tab=POSsystems&chart=${queries.POSChart}`)
    }
    if (tabId == 'wallets') {
      // Add an extra query for wallet type or country charts
      if (queries.walletChart == "type") {
        var subChartQuery = `&type=${queries.walletType}`
      } else if (queries.walletChart == "country") {
        var subChartQuery = `&country=${queries.walletCountry}`
      } else {
        var subChartQuery = ''
      }

      this.setState({
        showDashCore: queries.dashCore,
        showElectrum: queries.electrum,
        showCoreAndroid: queries.coreAndroid,
        showCoreiOS: queries.coreiOS,
        showWalletType: queries.walletType,
        showWalletCountry: queries.walletCountry,
        showWalletChart: queries.walletChart,
        as: `/labs?tab=wallets&chart=${queries.walletChart}` + subChartQuery,
      })

      history.pushState(this.state, '', `/labs?tab=wallets&chart=${queries.walletChart}` + subChartQuery)
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
        countryData: data[1].country_data,
        versionData: data[1].version_data,
      })
    }).then(history.replaceState(this.state, '', `${this.state.as}`))
    trackPage(`/labs`)  // Track Pageview in Analytics
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.labsData !== this.state.labsData || prevState.labsTabId !== this.state.labsTabId || prevState.showPosChart !== this.state.showPosChart || prevState.showWalletChart !== this.state.showWalletChart
      || prevState.showWalletType !== this.state.showWalletType || prevState.showWalletCountry !== this.state.showWalletCountry) {// Just a history state update because it doesn't always work as desired in functions
      history.replaceState(this.state, '', `${this.state.as}`)
    }
  }

  render() {
    const { // Declare data arrays used in class
      posSystemData,
      walletData,
      countryData,
      versionData,
      labsData,
    } = this.state

    return (
      <main>
        <Header></Header>
        <Menu>
        <Tab.Pane>Something</Tab.Pane>
        <Tab.Pane>Another</Tab.Pane>
        </Menu>
        <Wallets
          walletData={walletData}
          countryData={countryData}
          versionData={versionData}
          queryFunction={this.handleQueries}
          showDashCore={this.state.showDashCore}
          showElectrum={this.state.showElectrum}
          showCoreAndroid={this.state.showCoreAndroid}
          showCoreiOS={this.state.showCoreiOS}
          showWalletChart={this.state.showWalletChart}
          showWalletType={this.state.showWalletType}
          showWalletCountry={this.state.showWalletCountry}
        />
      </main>
    )
  }
}

export default Labs