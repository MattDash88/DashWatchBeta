import React from 'react';
import shortid from 'shortid';
import ReactGA from 'react-ga';

// Analytics
import getGAKey from '../functions/analytics';
ReactGA.initialize(getGAKey);

// Import classes for KPI types
import MerchantKpiContent from './kpi_subtab/MerchantKpiContent'
import EventKpiContent from './kpi_subtab/EventKpiContent'
import SocialMediaKpiContent from './kpi_subtab/SocialMediaKpiContent'
import PublicRelationsKpiContent from './kpi_subtab/PublicRelationsKpiContent'

// Import css
import '../css/style.css';
import '../css/single.css';
import '../css/status_styling.css';

const trackEvent = (event) => {
  ReactGA.event({
      category: 'Single Page',
      action: event,
  });
}

class TabPerformance extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reportTab: props.kpi_data[0].report_date //State which report tab is selected
    };
    // Binding functions in this class
    this.displayTab = this.displayTab.bind(this);
  }

  // Function selecting which subtab to show
  displayTab(event) {
    event.preventDefault();
    this.setState({ reportTab: event.currentTarget.title })
    trackEvent('Changed Performance subtab')                 // Track Event on Google Analytics
  }

  render() {
    const { // Declare grouped elements used in the performance tab 
      kpi_data,
      openTab,
    } = this.props

    // Code to generate the performance subtabs
    let reportdata = null;
    if (kpi_data[0].report_date == "N/A") { // If no reports are available, no subtabs
      reportdata = (
        <p className="subTabWrapperText">No Reports available.</p>
      )
    } else {  // If there are reports, make subtabs
      // Make a tab button for every report
      reportdata = (
        kpi_data.map((post) =>
          <button className="subTab" title={post.report_date} id={post.report_date} value={this.state.reportTab == post.report_date ? "Active" :
            "Inactive"} key={post.report_ref} onClick={this.displayTab}>{post.report_date}</button>
        )
      )
    } // End of KPI subtab if

    return (
      <div className="tabContent" value={openTab == "TabPerformance" ? "active" : "inactive"}>
        <div className="tabHeader">Proposal KPI data from Reports:</div>
        <div className="subTabWrapper">
          {reportdata}
        </div>
        {kpi_data.map((post) =>
          <ReportTabContent
            key={shortid.generate()}
            report_ref={post.report_ref}
            report_date={post.report_date}
            kpi_metrics={post.kpi_metrics}
            report_tab={this.state.reportTab}
          />
        )}
      </div>
    )
  }
}

class ReportTabContent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      report_date,
      kpi_metrics,
      report_tab,
    } = this.props

    if (kpi_metrics == 'No KPI data found') { // If no kpi data is available, show this message
      return (
        <main className="reportTab" value={report_tab == report_date ? "Active" :
          "Inactive"}>
          <div className="tabProposalText">No standardized kpi data found. It is possible that the data just has not been entered into the database yet or that it has a structure that the site currently does not support. Please check the report that can be accessed via the reports tab.
          </div>
        </main>
      )
    } else { // If there is kpi data, push it to RenderKpi
      return (
        <main>
          {kpi_metrics.map((post) =>
            <RenderKpi
              key={shortid.generate()}
              report_date={report_date}
              kpi_metrics={post}
              report_tab={report_tab}
            />
          )}
        </main>
      )
    }
  }
}

class RenderKpi extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { // Declare elements used in this class
      report_date,
      kpi_metrics,
      report_tab,
    } = this.props

    // Sort kpi data on type and push it to the right function
    if (kpi_metrics.kpi_type == 'merchant_kpis') { // Merchant KPIs
      return (
        <main>
          <MerchantKpiContent
            report_date={report_date}
            kpi_metrics={kpi_metrics}
            report_tab={this.props.report_tab}
          />
        </main>
      )
    } else if (kpi_metrics.kpi_type == 'event_kpis') { // Event KPIs
      return (
        <main>
          <EventKpiContent
            report_date={report_date}
            kpi_metrics={kpi_metrics}
            report_tab={this.props.report_tab}
          />
        </main>
      )
    } else if (kpi_metrics.kpi_type == 'social_media_kpis') {  // Social Media KPIs
      return (
        <main>
          <div className="socialPerformanceWrapper">
            <SocialMediaKpiContent
              report_date={report_date}
              kpi_metrics={kpi_metrics}
              report_tab={this.props.report_tab}
            />
          </div>
        </main>
      )
    } else if (kpi_metrics.kpi_type == 'public_relations_kpis') {  // Public Relations KPIs
      return (
        <main>
          <PublicRelationsKpiContent
            report_date={report_date}
            kpi_metrics={kpi_metrics}
            report_tab={this.props.report_tab}
          />
        </main>
      )
    } else {    // No KPIs
      return (
        <main className="reportTab" value={report_tab == report_date ? "Active" :
          "Inactive"}><p className="tabProposalText">If this shows up there is an error in the data. Please report the proposal you're looking at to the Dash Watch report team.</p></main>
      )
    }
  }
}

export default TabPerformance