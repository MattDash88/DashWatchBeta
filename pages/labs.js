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

import LabsOverview from "../components/labs_content/Overview";
import Wallets from "../components/labs_content/Wallets";

const getWalletCountryList = () => {
  return (
    new Promise((resolve) => {
      fetch(`/api/dataset/labsWalletCountryList`)
        .then((res) => res.json()
          .then((res) => {              
              resolve(res)
          })
        )
    })
  )
}

class Labs extends React.Component {
  static async getInitialProps(ctx) {
    const props = {
      tab: typeof ctx.query.tab == "undefined" ? "overview" : ctx.query.tab,        // Default tab is explorer
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
      walletCountryList: '',  // Dataset for posystems tab

      // States that can be set by queries 

      // Booleans for POS systems

      // Booleans for Wallets

      activeTab: props.tab,
      url: '/labs',
      as: props.as,
    }

    // Binding functions in this class
    this.handleSelectTab = this.handleSelectTab.bind(this);
    this.handleQueries = this.handleQueries.bind(this);
  }

  handleSelectTab(event, { name }) {
    event.preventDefault();
    console.log(name)
    this.setState({
      activeTab: name,
      as: `/labs?tab=${name}`,
    })
    history.pushState(this.state, '', `/labs?tab=${name}`)                    // Push State to history
    trackEvent('Labs Page', `Changed Tab to ${name}`)                 // Track Event on Google Analytics
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
    var wCountryListPromise = Promise.resolve(getWalletCountryList())

    Promise.all([wCountryListPromise]).then(data => {
      var wCountryListData = data[0]
      
      this.setState({
          walletCountryList: wCountryListData,
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
      walletCountryList,
      activeTab,
    } = this.state

    return (
      <main className="ui container" style={{
        marginTop: '20px',
      }}>
        <Header></Header>
        <Container>
        <Menu>
        <Menu.Item
        name='overview'
        active={activeTab === 'overview'}
        onClick={this.handleSelectTab}
        >
          Overview
        </Menu.Item>
        <Menu.Item
        name='wallets'
        active={activeTab === 'wallets'}
        onClick={this.handleSelectTab}
        >
          Wallets
        </Menu.Item>
        </Menu>
        {
                   (walletCountryList.length !== 0 ) && (
                   <section>
        {
          activeTab == 'overview' &&
          <LabsOverview
          walletCountryList2={walletCountryList}
          />
        }
        {
          activeTab == 'wallets' &&
        <Wallets
        walletCountryList={walletCountryList}
        />
        }
        </section>  
        ) || (<Segment loading />)
      }
        </Container>
      </main>
    )
  }
}

export default Labs