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

class KpiExplorer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            labsData: props.labsData,
            chartData: '',
            activeProject: 0,
            activeKpi: 0,
            tooltipText: '',
            showProjectMenu: false,
            showKpiMenu: false,
            url: props.url,
            as: props.as,
        }

        this.handleProjectDropdown = this.handleProjectDropdown.bind(this);
        this.handleKpiDropdown = this.handleKpiDropdown.bind(this);
        this.handleSelectProject = this.handleSelectProject.bind(this);
        this.handleSelectKpi = this.handleSelectKpi.bind(this);
    }

    handleProjectDropdown(event) {
        event.preventDefault();
        this.setState({
            showProjectMenu: !this.state.showProjectMenu,
            showKpiMenu: false,
        })
    }

    handleKpiDropdown(event) {
        event.preventDefault();
        this.setState({
            showKpiMenu: !this.state.showKpiMenu,
            showProjectMenu: false,
        })
    }

    handleSelectProject(event) {
        event.preventDefault();
        this.setState({
            activeProject: event.currentTarget.value,        // Change state to load different month
            showProjectMenu: false,
            showKpiMenu: false,
            activeKpi: 0,
            as: `/labs?project=${event.currentTarget.value}`,
        })

        //history.pushState(this.state, '', `/labs?tab=POS`)   // Push State to history
        trackEvent(`Changed Chart to ${event.currentTarget.value}`)                 // Track Event on Google Analytics    
    }

    handleSelectKpi(event) {
        event.preventDefault();
        this.setState({
            activeKpi: event.currentTarget.value,        // Change state to load different month
            showProjectMenu: false,
            showKpiMenu: false,
            chartData: {
                data: {  // Data styling for the chart
                    datasets: []
                },
            },
            as: `/labs?project=${event.currentTarget.value}`,
        })

        //history.pushState(this.state, '', `/labs?tab=POS`)   // Push State to history
        trackEvent(`Changed Chart to ${event.currentTarget.value}`)                 // Track Event on Google Analytics    
    }

    componentDidMount() {
        var activeData = this.state.labsData[this.state.activeProject].kpi_entries[this.state.activeKpi] 
        this.setState({
            chartData: {
                data: {  // Data styling for the chart
                    datasets: [{
                        label: this.state.labsData[this.state.activeProject].project_name,
                        fill: false,
                        borderColor: 'blue',
                        data: activeData.kpi_values,
                    }]
                },
                options: {  // Styling settings for the chart
                    scales: {
                        xAxes: [{
                            type: 'time',
                            distribution: 'linear',
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
                                labelString: activeData.axis_title
                            },
                        }]
                    }
                }
            },
            tooltipText: activeData.kpi_description,
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.activeProject !== this.state.activeProject || prevState.activeKpi !== this.state.activeKpi) {
            var activeData = this.state.labsData[this.state.activeProject].kpi_entries[this.state.activeKpi] 
            this.setState({
                chartData: {
                    data: {  // Data styling for the chart
                        datasets: [{
                            label: this.state.labsData[this.state.activeProject].project_name,
                            fill: false,
                            borderColor: 'blue',
                            data: activeData.kpi_values,
                        }]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                scaleLabel: {
                                    display: true,
                                    labelString: activeData.axis_title
                                },
                            }]
                        }
                    }
                },
                tooltipText: activeData.kpi_description,
            })
        }
    }

    render() {
        const { // Declare data arrays used in class
            labsData,
            chartData,
            activeProject,
            activeKpi,
            tooltipText,
        } = this.state

        return (
            <main>
                <h1 className="labsHeader">Dash Watch KPI Explorer</h1>               
                <div className="dropdown" id="dropdownmenu">
                <p className="labsText">Select a project:</p>
                    <div id="dropdownMenu" onClick={this.handleProjectDropdown} className="dropbtn"><i id="dropdownMenu"></i>{labsData[activeProject].project_name}</div>
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
                    <div id="dropdownMenu" onClick={this.handleKpiDropdown} className="dropbtn"><i id="dropdownMenu"></i>{labsData[activeProject].kpi_entries[activeKpi].kpi_name}</div>
                    {
                        this.state.showKpiMenu ? (
                            <div className="dropdownMenu" id="dropdownMenu">
                                {
                                    Object.keys(labsData[activeProject].kpi_entries).map((item) =>
                                        <div key={labsData[activeProject].kpi_entries[item].id}>
                                            <button id="dropdownMenu" value={item} className="dropdownItem" onClick={this.handleSelectKpi}>{labsData[activeProject].kpi_entries[item].kpi_name}</button>
                                        </div>
                                    )}
                            </div>
                        ) : (
                                null
                            )
                    }
                </div>
                <div class="tooltip">{labsData[activeProject].kpi_entries[activeKpi].kpi_name}?
                    <span class="tooltiptext" value="">{tooltipText}</span>
                </div>
                <section className="chartSection">                
                <p className="labsText"><a id="Proposal Owner Link" href={`/proposals?search=${labsData[activeProject].proposal_owner}`} target="" onClick={this.callEvent}>Link to Proposal Owner {labsData[activeProject].proposal_owner}</a></p>
                    <Line
                        data={chartData.data}
                        options={chartData.options}
                    />
                </section>
            </main>
        )
    }
}

export default KpiExplorer
