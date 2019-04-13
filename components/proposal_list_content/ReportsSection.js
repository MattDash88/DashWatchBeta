import React from 'react';

// Analytics
import { trackEvent } from '../functions/analytics';

// Import other elements 

// Import css
import '../css/style.css';
import '../css/status_styling.css';

function getReportTypeArrays(report_data) {
  var documentsArray = []   // Array for documents dropdown
  var mediaArray = []       // Array for Media dropdown

  Object.keys(report_data).map((item) => {
    if (report_data[item].entry_type == 'Report') {
      documentsArray.push(item)
    } else if (report_data[item].entry_type == 'Podcast' || report_data[item].entry_type == 'Video') {
      mediaArray.push(item)
    }
  })

  return {
    documentsArray: documentsArray,
    mediaArray: mediaArray,
  }
}

class ReportsSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showDocumentMenu: false,
      showMediaMenu: false,
    };

    // Binding functions in this class
    this.handleDocumentDropdown = this.handleDocumentDropdown.bind(this);
    this.handleMediaDropdown = this.handleMediaDropdown.bind(this);
    this.getImageUrl = this.getImageUrl.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  // Dropdown list for KPIs
  handleDocumentDropdown(event) {
    this.setState({
      showDocumentMenu: !this.state.showDocumentMenu,
    })
    trackEvent('Proposals Page', `Clicked Document dropdown`)
  }

  handleMediaDropdown(event) {
    this.setState({
      showMediaMenu: !this.state.showMediaMenu,
    })
    trackEvent('Proposals Page', `Clicked Media dropdown`)
  }

  // Function that returns what image to show for the report or media
  getImageUrl(type) {
    if (type == "Report") {
      return (<img id="PDF" src="https://dashwatchbeta.org/images/PDF.png" height="25"></img>)
    } else if (type == "Video"){
      return (<img id="Video" src="https://dashwatchbeta.org/images/Video.png" height="25"></img>)
    } else if (type == "Podcast"){
      return (<img id="Podcast" src="https://dashwatchbeta.org/images/Podcast.png" height="25"></img>)
    } else {
      return (<img id="PDF" src="https://dashwatchbeta.org/images/PDF.png" height="25"></img>)
    }   
  }

  handleClose() {
    this.setState({
      showDocumentMenu: false,
      showMediaMenu: false,
    })
  }

  render() {
    const { // Declare grouped elements to pass on to modal      
      report_data,
      id,
    } = this.props

    var {
      documentsArray,
      mediaArray,
    } = getReportTypeArrays(report_data)


    return (
      <main>        
          {
            documentsArray.length == 0 ? (
              <section className="reportLeftDiv">
                <div className="reportItem" >No reports available</div>
              </section>
            ) : (
                documentsArray.length == 1 ? (
                  <section className="reportLeftDiv">
                  <div className="reportItem" ><a className="reportLink" href={report_data[documentsArray[0]].report_link} target="_blank" title={report_data[documentsArray[0]].report_link} onClick={this.callEvent}>{this.getImageUrl(report_data[documentsArray[0]].entry_type)} {report_data[documentsArray[0]].entry_name} [{report_data[documentsArray[0]].report_date}]</a></div>
                  </section>
                ) : (
                  <section className="reportLeftDiv">
                    <div className="proposalsDropdown" id="dropdownmenu">
                      <div className="reportItem" value={this.state.showDocumentMenu ? "Active" : "Inactive"}><i id="reportsMenu" onClick={this.handleDocumentDropdown}></i><a className="reportLink" href={report_data[documentsArray[0]].report_link} target="_blank" title={report_data[documentsArray[0]].report_link} onClick={this.callEvent}>{this.getImageUrl(report_data[documentsArray[0]].entry_type)} {report_data[documentsArray[0]].entry_name} [{report_data[documentsArray[0]].report_date}]</a></div>
                      {
                        this.state.showDocumentMenu ? (
                          <DocumentMenu
                            key={`${id}_docs`}
                            closeDropdown={this.handleClose}
                            report_data={report_data}
                            documentsArray={documentsArray}
                          />
                        ) : (
                            null
                          )
                      }
                    </div>
                    </section>
                  )
              )
          }    
          {
            mediaArray.length == 0 ? (
              <section className="reportRightDiv">

              </section>
            ) : (
              mediaArray.length == 1 ? (
                  <section className="reportRightDiv">
                  <div className="reportItem" ><a className="reportLink" href={report_data[mediaArray[0]].report_link} target="_blank" title={report_data[mediaArray[0]].report_link} onClick={this.callEvent}>{this.getImageUrl(report_data[mediaArray[0]].entry_type)} {report_data[mediaArray[0]].entry_name} [{report_data[mediaArray[0]].report_date}]</a></div>
                  </section>
                ) : (
                  <section className="reportRightDiv">
                  <div className="proposalsDropdown" id="dropdownmenu">
                      <div className="reportItem" value={this.state.showMediaMenu ? "Active" : "Inactive"}><i id="reportsMenu" onClick={this.handleMediaDropdown}></i><a className="reportLink" href={report_data[mediaArray[0]].report_link} target="_blank" title={report_data[mediaArray[0]].report_link} onClick={this.callEvent}>{this.getImageUrl(report_data[mediaArray[0]].entry_type)} {report_data[mediaArray[0]].entry_name} [{report_data[documentsArray[0]].report_date}]</a></div>
                      {
                        this.state.showMediaMenu ? (
                          <MediaMenu
                            key={`${id}_media`}
                            report_data={report_data}
                            mediaArray={mediaArray}
                          />
                        ) : (
                            null
                          )
                      }
                      </div>
                    </section>
                  )
              )
          }     
      </main>
    )
  }
}

class DocumentMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };

    // Binding functions in this class
    this.getImageUrl = this.getImageUrl.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  // Function that returns what image to show for the report
  getImageUrl(type) {
    if (type == "Report") {
      return (<img id="PDF" src="https://dashwatchbeta.org/images/PDF.png" height="25"></img>)
    } else {
      return (<img id="PDF" src="https://dashwatchbeta.org/images/PDF.png" height="25"></img>)
    }   
  }

  handleClick = (event) => {
    if (event.target.id !== "proposalsDropdownMenu") {
      this.props.closeDropdown()
    }
  }

  componentDidMount() {
    window.addEventListener('mousedown', this.handleClick);     // Handles closing of dropdown menu
  }

  componentWillUnmount() {        
    window.removeEventListener('mousedown', this.handleClick);  // Stop event listener when modal is unloaded
  }

  render() {
    const { // Declare grouped elements to pass on to modal      
      report_data,
      documentsArray
    } = this.props
    return (
      <main>
        <div id="proposalsDropdownMenu" className="proposalsDropdownMenu">
          {
            Object.values(documentsArray).slice(1).map((item) =>
              <div key={report_data[item].id}>
                <div className="reportItem" value="Active"><a className="reportLink" href={report_data[item].report_link} target="_blank" title={report_data[item].report_link} onClick={this.callEvent}>{this.getImageUrl(report_data[item].entry_type)} {report_data[item].entry_name} [{report_data[item].report_date}]</a></div>
              </div>
            )
          }
        </div>
      </main>
    )
  }
}

class MediaMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };

    // Binding functions in this class
    this.getImageUrl = this.getImageUrl.bind(this);
  }

  // Function that returns what image to show for the media
  getImageUrl(type) {
    if (type == "Video"){
      return (<img id="Video" src="https://dashwatchbeta.org/images/Video.png" height="25"></img>)
    } else if (type == "Podcast"){
      return (<img id="Podcast" src="https://dashwatchbeta.org/images/Podcast.png" height="25"></img>)
    } else {
      return (<img id="Video" src="https://dashwatchbeta.org/images/Video.png" height="25"></img>)
    }   
  }

  // Dropdown list for KPIs

  render() {
    const { // Declare grouped elements to pass on to modal      
      report_data,
      mediaArray
    } = this.props
    return (
      <main>
        <div className="proposalsDropdownMenu">
          {
            Object.values(mediaArray).slice(1).map((item) =>
              <div key={report_data[item].id}>
                <div className="reportItem" value="Active"><a className="reportLink" href={report_data[item].report_link} target="_blank" title={report_data[item].report_link} onClick={this.callEvent}>{this.getImageUrl(report_data[item].entry_type)} {report_data[item].entry_name} [{report_data[item].report_date}]</a></div>
              </div>
            )
          }
        </div>
      </main>
    )
  }
}

export default ReportsSection