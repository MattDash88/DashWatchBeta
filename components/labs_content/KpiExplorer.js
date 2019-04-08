import React from 'react';
import { Line } from 'react-chartjs-2';
import ReactGA from 'react-ga';

// Analytics
import getGAKey from '../functions/analytics';
ReactGA.initialize(getGAKey);

// Import css
import '../css/style.css';
import '../css/labs.css';

const trackEvent = (event) => { // Function to track user interaction with page
    ReactGA.event({
        category: 'Labs Page',
        action: event,
    });
}

// Function to build output used on page
const buildContent = (labsData, activeProject, activeKpi) => {
    try {
        var projectData = labsData[activeProject]                                  // Proposal that is active
        var kpiData = labsData[activeProject].kpi_entries[activeKpi]    // Kpi data that is active

        var kpiList = []
        // Make an array with KPIs for the active proposal
        Object.keys(projectData.kpi_entries).map((item) =>
            kpiList.push(projectData.kpi_entries[item])
        )

        const chartData = {
            data: {  // Data + styling for the chart
                datasets: [{
                    label: projectData.project_name,
                    fill: false,
                    borderColor: 'blue',
                    data: kpiData.kpi_values,
                }]
            },
            options: {  // Axis Styling for chart
                scales: {
                    xAxes: [{
                        type: 'time',
                        time: {
                            unit: 'month'
                        },
                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                        },
                        scaleLabel: {
                            display: true,
                            labelString: kpiData.axis_title
                        },
                    }]
                }
            }
        }
        const pageContent = {
            projectName: projectData.project_name,
            kpiName: kpiData.kpi_name,
            tooltipTitle: kpiData.kpi_name,
            tooltipText: kpiData.kpi_description,
            proposalOwnerLink:
                <p className="labsText">
                    <a id="Proposal Owner Link" href={`/proposals?search=${projectData.proposal_owner}`} target="" >Link to Proposal Owner {projectData.proposal_owner}</a>
                </p>,
        }

        return {
            kpiList: kpiList,
            chartData: chartData,
            pageContent: pageContent,
        }
    } catch (e) {
        const chartData = {
            data: {  // Data styling for the chart
                datasets: []
            },
            options: {}
        }

        const kpiList = [{
            kpi_name: 'Select a project first',
            id: '1',
        }]

        const pageContent = {
            projectName: 'Select a project',
            kpiName: 'Select a Kpi',
            tooltipTitle: 'Tooltip',
            tooltipText: 'Select a project',
            proposalOwnerLink: <p></p>,
        }

        return {
            kpiList: kpiList,
            chartData: chartData,
            pageContent: pageContent,
        }
    }
}


class KpiExplorer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // Dropdown menu toggles
            showProjectMenu: false,     // Project Menu Toggle
            showKpiMenu: false,         // Kpi Menu Toggle
        }

        // Binding functions in this class
        this.handleProjectDropdown = this.handleProjectDropdown.bind(this);
        this.handleKpiDropdown = this.handleKpiDropdown.bind(this);
        this.handleSelectProject = this.handleSelectProject.bind(this);
        this.handleSelectKpi = this.handleSelectKpi.bind(this);
        this.handleQueries = this.handleQueries.bind(this);
    }

    // Dropdown list for Projects
    handleProjectDropdown(event) {
        event.preventDefault();
        this.setState({
            showProjectMenu: !this.state.showProjectMenu,
            showKpiMenu: false,
        })
    }

    // Dropdown list for KPIs
    handleKpiDropdown(event) {
        event.preventDefault();
        this.setState({
            showKpiMenu: !this.state.showKpiMenu,
            showProjectMenu: false,
        })
    }

    // Function to handle selection of item from the Projects dropdown menu
    handleSelectProject(event) {
        event.preventDefault();
        this.setState({
            //activeProject: event.currentTarget.value,        // Change state to load different month
            showProjectMenu: false,
            showKpiMenu: false,
        })
        const queries = {
            activeProject: event.currentTarget.value,
            activeKpi: 0,
        }
        this.handleQueries(queries)
        trackEvent(`Changed Chart to ${event.currentTarget.value}`)                 // Track Event on Google Analytics    
    }

    // Function to handle selection of item from the KPI dropdown menu
    handleSelectKpi(event) {
        event.preventDefault();
        this.setState({
            showProjectMenu: false,
            showKpiMenu: false,
        })

        const queries = {
            activeProject: this.props.tabQueries.project,
            activeKpi: event.currentTarget.value,
        }
        this.handleQueries(queries)
        trackEvent(`Changed Chart to ${event.currentTarget.value}`)                 // Track Event on Google Analytics    
    }

    // Function to push queries to main labs Class
    handleQueries(queries) {
        this.props.queryFunction('explorer', queries)
    }

    render() {
        const { // Declare data arrays used in class
            labsData,
        } = this.props

        const tabQueries = {
            activeProject: typeof this.props.tabQueries.project == 'undefined' ? 0 : this.props.tabQueries.project,
            activeKpi: typeof this.props.tabQueries.kpi == 'undefined' ? 0 : this.props.tabQueries.kpi,
        }

        const content = buildContent(labsData, tabQueries.activeProject, tabQueries.activeKpi)

        const {
            chartData,
            kpiList,
            pageContent,
        } = content

        // Catch error with Chart plotting
        try {
            var chartObject = (
                <Line
                    data={chartData.data}
                    options={chartData.options}
                />
            )
        }
        catch (error) {
            var chartObject = (
                <div>
                    Please select a valid dataset
                </div>
            )
        }

        return (
            <main>
                <h1 className="labsHeader">Dash Watch KPI Explorer</h1>
                <div className="dropdown" id="dropdownmenu">
                    <p className="labsText">Select a project:</p>
                    <div id="dropdownMenu" onClick={this.handleProjectDropdown} className="dropbtn"><i id="dropdownMenu"></i>{pageContent.projectName}</div>
                    {
                        this.state.showProjectMenu ? (
                            <div className="dropdownMenu" id="dropdownMenu">
                                {
                                    Object.keys(labsData).map((item) =>
                                        <div key={labsData[item].id}>
                                            <button id="dropdownMenu" value={item} className="dropdownItem" onClick={this.handleSelectProject}>{labsData[item].project_name}</button>
                                        </div>
                                    )}
                            </div>
                        ) : (
                                null
                            )
                    }
                </div>
                <div className="dropdown" id="dropdownmenu">
                    <p className="labsText">Select a kpi:</p>
                    <div id="dropdownMenu" onClick={this.handleKpiDropdown} className="dropbtn"><i id="dropdownMenu"></i>{pageContent.kpiName}</div>
                    {
                        this.state.showKpiMenu ? (
                            <div className="dropdownMenu" id="dropdownMenu">
                                {
                                    Object.keys(kpiList).map((item) =>
                                        <div key={kpiList[item].id}>
                                            <button id="dropdownMenu" value={item} className="dropdownItem" onClick={this.handleSelectKpi}>{kpiList[item].kpi_name}</button>
                                        </div>
                                    )}
                            </div>
                        ) : (
                                null
                            )
                    }
                </div>
                <div className="tooltip">{pageContent.tooltipTitle}?
                    <span className="tooltiptext" value="">{pageContent.tooltipText}</span>
                </div>
                <section className="chartSection">
                    {pageContent.proposalOwnerLink}
                    {chartObject}
                </section>
            </main>
        )
    }
}

export default KpiExplorer
