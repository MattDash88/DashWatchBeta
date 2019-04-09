import React from 'react';
import { Line } from 'react-chartjs-2';

// Analytics
import {trackEvent} from '../functions/analytics';

// Import css
import '../css/style.css';
import '../css/labs.css';

// Function to build output used on page
const buildContent = (labsData, prj, akp) => {
    try {
        var projectData = labsData[prj]                                  // Proposal that is active
        var kpiData = labsData[prj].kpi_entries[akp]    // Kpi data that is active

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
            options: {  // Axis Styling for the chart
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

        const pageContent = {   // Elements that are used in page rendering
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

        const kpiList = [{  // Empty kpi list
            kpi_name: 'Select a project first',
            id: '1',
        }]

        const pageContent = {   // Error page elements
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

const chartFunction = (chartData, options, redrawState) => {
    try {
        var chartObject = 
            <div>
            <Line
                data={chartData}
                options={options}
                redraw={redrawState}
            />
            </div>
        
        return chartObject
    }
    catch (error) {
        var chartObject = 
            <div>
                Please select a valid dataset
            </div>
        
        return chartObject
    }
}

class KpiExplorer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // Dropdown menu toggles
            showProjectMenu: false,     // Project Menu Toggle
            showKpiMenu: false,         // Kpi Menu Toggle
            showTooltip: false,         // Toggle show/hiding tooltip
            shouldRedraw: false,        // Toggle redraw of charts
        }

        // Binding functions in this class
        this.handleProjectDropdown = this.handleProjectDropdown.bind(this);
        this.handleKpiDropdown = this.handleKpiDropdown.bind(this);
        this.handleSelectProject = this.handleSelectProject.bind(this);
        this.handleSelectKpi = this.handleSelectKpi.bind(this);
        this.handleClick = this.handleClick.bind(this);         // Function for event listener to close dropdown menus
        this.handleTooltip = this.handleTooltip.bind(this);
        this.handleQueries = this.handleQueries.bind(this);     // Send queries to main labs Class
    }

    // Dropdown list for Projects
    handleProjectDropdown(event) {
        event.preventDefault();
        this.setState({
            showProjectMenu: !this.state.showProjectMenu,
            showKpiMenu: false,
            showTooltip: false,
            shouldRedraw: false,
        })
        trackEvent('Labs Page', `Clicked Project dropdown`)
    }

    // Dropdown list for KPIs
    handleKpiDropdown(event) {
        event.preventDefault();
        this.setState({
            showKpiMenu: !this.state.showKpiMenu,
            showProjectMenu: false,
            showTooltip: false,
            shouldRedraw: false,
        })
        trackEvent('Labs Page', `Clicked KPI dropdown`)
    }

    // Function to handle selection of item from the Projects dropdown menu
    handleSelectProject(event) {
        event.preventDefault();
        this.setState({
            showProjectMenu: false,
            showKpiMenu: false,
            shouldRedraw: true,
        })
        const queries = {
            activeProject: event.currentTarget.value,
            activeKpi: 0,
        }
        this.handleQueries(queries)
        trackEvent('Labs Page', `Changed KPI Explorer Chart to ${event.currentTarget.value}`)                 // Track Event on Google Analytics    
    }

    // Function to handle selection of item from the KPI dropdown menu
    handleSelectKpi(event) {
        event.preventDefault();
        this.setState({
            showProjectMenu: false,
            showKpiMenu: false,
            shouldRedraw: true,
        })

        const queries = {
            activeProject: this.props.project,
            activeKpi: event.currentTarget.value,
        }
        this.handleQueries(queries)
        trackEvent('Labs Page', `Changed KPI Explorer Chart to ${event.currentTarget.value}`)                 // Track Event on Google Analytics    
    }

    // Function to push queries to main labs Class
    handleQueries(queries) {
        this.props.queryFunction('explorer', queries)
    }

    // Function to show and hide tooltip on click (for mobile users that can't hover)
    handleTooltip(event) {
        event.preventDefault();
        this.setState({
            showTooltip: !this.state.showTooltip,
            showProjectMenu: false,
            showKpiMenu: false,
            shouldRedraw: false,
        })
        trackEvent('Labs Page', `Clicked Tooltip`)
    }

    // Function ran when the eventlistener is activated. Close dropdown menu and tooltip if clicked outside of it
    handleClick = (event) => {
        if (event.target.id !== "dropdownMenu" && event.target.id !== "tooltip") {
        this.setState({
            showProjectMenu: false,
            showKpiMenu: false,
            showTooltip: false,
            shouldRedraw: false,
        }) 
        trackEvent('Labs Page', `Clicked on Labs KPI Explorer page`)
        }
      }

    componentDidMount() {
        window.addEventListener('mousedown', this.handleClick);     // Handles closing of dropdown menu
    }

    componentWillUnmount() {        
        window.removeEventListener('mousedown', this.handleClick);  // Stop event listener when modal is unloaded
    }

    render() {
        const { // Declare data arrays used in class
            labsData,
        } = this.props

        // Elements taken from queries
        const tabQueries = {
            activeProject: typeof this.props.project == 'undefined' ? 0 : this.props.project,
            activeKpi: typeof this.props.kpi == 'undefined' ? 0 : this.props.kpi,
        }

        const content = buildContent(labsData, tabQueries.activeProject, tabQueries.activeKpi)

        const {
            chartData,
            kpiList,
            pageContent,
        } = content

        var chartObject = chartFunction(chartData.data, chartData.options, this.state.shouldRedraw)

        return (
            <main>
                <h1 className="labsHeader">Dash Watch KPI Explorer</h1>
                <div className="labsDropdown" id="dropdownmenu">
                    <p className="labsText">Select a project:</p>
                    <div id="dropdownMenu" onClick={this.handleProjectDropdown} className="labsDropbtn"><i id="dropdownMenu"></i>{pageContent.projectName}</div>
                    {
                        this.state.showProjectMenu ? (
                            <div className="labsDropdownMenu" id="dropdownMenu">
                                {
                                    Object.keys(labsData).map((item) =>
                                        <div key={labsData[item].id}>
                                            <button id="dropdownMenu" value={item} className="labsDropdownItem" onClick={this.handleSelectProject}>{labsData[item].project_name}</button>
                                        </div>
                                    )}
                            </div>
                        ) : (
                                null
                            )
                    }
                </div>
                <div className="labsDropdown" id="dropdownmenu">
                    <p className="labsText">Select a kpi:</p>
                    <div id="dropdownMenu" onClick={this.handleKpiDropdown} className="labsDropbtn"><i id="dropdownMenu"></i>{pageContent.kpiName}</div>
                    {
                        this.state.showKpiMenu ? (
                            <div className="labsDropdownMenu" id="dropdownMenu">
                                {
                                    Object.keys(kpiList).map((item) =>
                                        <div key={kpiList[item].id}>
                                            <button id="dropdownMenu" value={item} className="labsDropdownItem" onClick={this.handleSelectKpi}>{kpiList[item].kpi_name}</button>
                                        </div>
                                    )}
                            </div>
                        ) : (
                                null
                            )
                    }
                </div>
                <div id="tooltip" className="labsTooltip" onClick={this.handleTooltip}>{pageContent.tooltipTitle}?
                    <span className="labsTooltipBlock" value={this.state.showTooltip ? "Active" :
                        "Inactive"}>{pageContent.tooltipText}</span>
                </div>
                <section>
                    {pageContent.proposalOwnerLink}
                    {chartObject}
                </section>
            </main>
        )
    }
}

export default KpiExplorer
