import fetch from 'isomorphic-unfetch'
import React from 'react';

// Analytics
import {trackPage} from '../components/functions/analytics';

// Import pages
import SinglePost from '../components/Single'

// Import css
import '../components/css/style.css';
import '../components/css/single.css';
import '../components/css/status_styling.css';

// Import other elements 
import Header from '../components/headers/SingleHeader';
import NavBar from "../components/elements/NavBar"

var basepath = 'https://dashwatchbeta.org'

// Airtable query requesting Proposal List data
const getProposal = (slug) => {
  return (
    new Promise((resolve) => {
      fetch(`${basepath}/api/p/${slug}`)
        .then((res) => res.json()
          .then((res) => {
            resolve(res.data)
          }))
    })
  )
}

class Single extends React.Component {
  static async getInitialProps(ctx) {
    const props = {
      proposal: ctx.query.slug,
      displayTab: typeof ctx.query.tab == "undefined" ? "TabMain" : ctx.query.tab,
      url: ctx.pathname,
      as: ctx.asPath,
    }
    return props
  }
  constructor(props) {
    super(props);
    this.state = {
      proposal: props.proposal,
      airtableData: [],                         // All Proposal data
      displayTab: props.displayTab,                   // State that handles the initial tab on the Single Proposal page, the modal can direct the user directly to the funding and performance tabs
      url: '/p',
      as: props.as,
    }
  }

  componentDidMount() {
    // To handle calls from history (forward and back buttons)
    onpopstate = event => {
      if (event.state) {
        this.setState(event.state)
      }
    }

    trackPage(`/p/${this.state.proposal}`)  // Track Proposal Pageview in Analytics

    Promise.resolve(getProposal(this.state.proposal))
      .then(data =>
        this.setState({
          airtableData: data,
        })
      )
  }

  render() {
    const {
      main_data,
      kpi_data,
      financial_data,
      report_data,
    } = this.state.airtableData

    

    return (
      // Simplified navbar code
      <main>
        <Header
            proposal={this.state.proposal}
        />
        <NavBar
          showPage="singlePage"
          searchQuery=''
        />
        <section className="pagewrapper">
          <SinglePost
            main_data={main_data}
            kpi_data={kpi_data}
            financial_data={financial_data}
            report_data={report_data}

            displayTab={this.state.displayTab}
          />
        </section></main>
    )
  }
}

export default Single