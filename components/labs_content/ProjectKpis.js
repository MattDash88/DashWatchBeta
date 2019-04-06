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

class ProjectKpis extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            labsData: props.labsData,
            activeProject: 0,
            activeKpi: '',
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
            activeKpi: '',
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
            as: `/labs?project=${event.currentTarget.value}`,
        })

        //history.pushState(this.state, '', `/labs?tab=POS`)   // Push State to history
        trackEvent(`Changed Chart to ${event.currentTarget.value}`)                 // Track Event on Google Analytics    
    }

    render() {
        const { // Declare data arrays used in class
            labsData,
            activeProject
          } = this.state

        return (
        <main>
            <h1 className="labsHeader">Kpi Explorer</h1>       
        <div className="dropdown" id="dropdownmenu">
        <div id="dropdownMenu" onClick={this.handleProjectDropdown} className="dropbtn">{labsData[activeProject].project_name}<i id="dropdownMenu"></i></div>
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
        <div id="dropdownMenu" onClick={this.handleKpiDropdown} className="dropbtn">{this.state.activeKpi}<i id="dropdownMenu"></i></div>
        {
            this.state.showKpiMenu ? (
                <div className="dropdownMenu" id="dropdownMenu">
                { 
                    Object.keys(labsData[activeProject].kpi_entries).map((item) => 
                        <div key={labsData[activeProject].kpi_entries[item].id}>
                            <button id="dropdownMenu" value={item} className="dropdownItem" onClick={this.handleSelectKpi}>{item}</button>
                        </div>
                    )}
                </div>
            ) : (
                    null
                )
        }
    </div>
    </main>
        )
    }    
}

export default ProjectKpis
