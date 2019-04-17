import React from 'react';

// Analytics
import {trackEvent} from '../functions/analytics';

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

class ReportSection extends React.Component {
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
    this.handleClick = this.handleClick.bind(this);
    this.callEvent = this.callEvent.bind(this);
  }

  // Dropdown list for KPIs
  handleDocumentDropdown() {
    this.setState({
      showDocumentMenu: !this.state.showDocumentMenu,
    })
    trackEvent('Proposals Page', `Clicked Document dropdown`)
  }

  handleMediaDropdown() {
    this.setState({
      showMediaMenu: !this.state.showMediaMenu,
    })
    trackEvent('Proposals Page', `Clicked Media dropdown`)
  }

  // Function that returns what image to show for the report or media
  getImageUrl(type) {
    if (type == "Report") {
      return (<img id="PDF" src="https://dashwatchbeta.org/images/PDF.png" height="25"></img>)
    } else if (type == "Video") {
      return (<img id="Video" src="https://dashwatchbeta.org/images/Video.png" height="25"></img>)
    } else if (type == "Podcast") {
      return (<img id="Podcast" src="https://dashwatchbeta.org/images/Podcast.png" height="25"></img>)
    } else {
      return (<img id="PDF" src="https://dashwatchbeta.org/images/PDF.png" height="25"></img>)
    }
  }

  // Function ran when the eventlistener is activated. Close dropdown menus if clicking outside of them
  handleClick = (event) => {
    if (event.target.id !== "reportsMenu" && event.target.id !== "cardDropdownMenu" && event.target.id !== "cardDocumentLink" && event.target.id !== "cardMediaLink") {
      this.setState({
        showDocumentMenu: false,
        showMediaMenu: false,
      })
    }
    trackEvent('Proposals Page', `Closed Dropdowns by clicking outside`)
  }

  // Google Analytics function to track User interaction on page
  callEvent(event) {
    trackEvent('Proposals Page', 'clicked ' + event.currentTarget.id)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.showDocumentMenu !== this.state.showDocumentMenu || prevState.showMediaMenu !== this.state.showMediaMenu) {
      if (this.state.showDocumentMenu || this.state.showMediaMenu) {
        window.addEventListener('mousedown', this.handleClick);         // Handles closing of dropdown menu
      } else if (!this.state.showDocumentMenu && !this.state.showMediaMenu) {
        window.removeEventListener('mousedown', this.handleClick);      // Stop event listener when menu is closed
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('mousedown', this.handleClick);    // Stop event listener when menu is closed
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
      <section className="cardReportGrid">
        {
          documentsArray.length == 0 ? (
            // If there are no report document show "No reports available"
            <div className="cardReportDiv">
              <div className="cardReportItem"><span className="cardNoReportText">No reports available</span></div>
            </div>
          ) : (
            // If there is one just show a report link
              documentsArray.length == 1 ? (
                <div className="cardReportDiv">
                  <div className="cardReportItem" ><a className="cardReportLink" href={report_data[documentsArray[0]].report_link} target="_blank" title={report_data[documentsArray[0]].report_link} onClick={this.callEvent}>{this.getImageUrl(report_data[documentsArray[0]].entry_type)} {report_data[documentsArray[0]].entry_name} [{report_data[documentsArray[0]].report_date}]</a></div>
                </div>
              ) : (
                // If there are more generate a report document Menu
                  <div className="cardReportDiv">
                    <div className="cardDropdown" id="dropdownmenu">
                      <div id="cardDropdownMenu" className="cardDropdownButton" value={this.state.showDocumentMenu ? "Active" : "Inactive"}><div id="cardDropdownMenu" className="cardGlyphDiv" onClick={this.handleDocumentDropdown}><i id="reportsMenu" ></i></div><a id="cardDocumentLink" className="cardReportLink" href={report_data[documentsArray[0]].report_link} target="_blank" title={report_data[documentsArray[0]].report_link} onClick={this.callEvent}>{this.getImageUrl(report_data[documentsArray[0]].entry_type)} {report_data[documentsArray[0]].entry_name} [{report_data[documentsArray[0]].report_date}]</a></div>
                      {
                        this.state.showDocumentMenu ? (
                          // Show or hide report document dropdown menu based on state
                          <DocumentMenu
                            key={`${id}_docs`}
                            report_data={report_data}
                            documentsArray={documentsArray}
                          />
                        ) : (
                            null
                          ) // End of show/hide dropdown if
                      }
                    </div>
                  </div>
                ) // End of 1 or more reports if
            ) // End of Report Document items if 
        }
        {
          mediaArray.length == 0 ? (
            // If there are no media items show nothing"
            <div className="cardReportDiv">
            </div>
          ) : (
              mediaArray.length == 1 ? (
                // If there is one just show a media item link
                <div className="cardReportDiv">
                  <div className="cardReportItem" ><a className="cardReportLink" href={report_data[mediaArray[0]].report_link} target="_blank" title={report_data[mediaArray[0]].report_link} onClick={this.callEvent}>{this.getImageUrl(report_data[mediaArray[0]].entry_type)} {report_data[mediaArray[0]].entry_name} [{report_data[mediaArray[0]].report_date}]</a></div>
                </div>
              ) : (
                 // If there are more generate a media item Menu
                  <div className="cardReportDiv">
                    <div className="cardDropdown" id="dropdownmenu">
                      <div id="cardDropdownMenu" className="cardDropdownButton" value={this.state.showMediaMenu ? "Active" : "Inactive"}><div id="cardDropdownMenu" className="cardGlyphDiv" onClick={this.handleMediaDropdown}><i id="reportsMenu"></i></div><a id="cardMediaLink" className="cardReportLink" href={report_data[mediaArray[0]].report_link} target="_blank" title={report_data[mediaArray[0]].report_link} onClick={this.callEvent}>{this.getImageUrl(report_data[mediaArray[0]].entry_type)} {report_data[mediaArray[0]].entry_name} [{report_data[mediaArray[0]].report_date}]</a></div>
                      {
                        this.state.showMediaMenu ? (
                          // Show or hide media item dropdown menu based on state
                          <MediaMenu
                            key={`${id}_media`}
                            report_data={report_data}
                            mediaArray={mediaArray}
                          />
                        ) : (
                            null
                          ) // End of show/hide dropdown if
                      }
                    </div>
                  </div>
                ) // End of 1 or more reports if
            ) // End of Report Document items if 
        }
      </section>
    )
  }
}

class DocumentMenu extends React.Component {
  constructor() {
    super();

    // Binding functions in this class
    this.getImageUrl = this.getImageUrl.bind(this);
    this.callEvent = this.callEvent.bind(this);
  }

  // Function that returns what image to show for the report
  getImageUrl(type) {
    if (type == "Report") {
      return (<img id="cardDocumentLink" src="https://dashwatchbeta.org/images/PDF.png" height="25"></img>)
    } else {
      return (<img id="cardDocumentLink" src="https://dashwatchbeta.org/images/PDF.png" height="25"></img>)
    }
  }

  // Google Analytics function to track User interaction on page
  callEvent(event) {
    trackEvent('Proposals Page', 'clicked ' + event.currentTarget.id)
  }

  render() {
    const { // Declare grouped elements to pass on to modal      
      report_data,
      documentsArray
    } = this.props
    return (
      <main>
        <div id="cardDropdownMenu" className="cardDropdownMenu">
          {
            Object.values(documentsArray).slice(1).map((item) =>
              <div key={report_data[item].id}>
                <div className="cardDropdownItem" value="Active"><a id="cardDocumentLink" className="cardReportLink" href={report_data[item].report_link} target="_blank" title={report_data[item].report_link} onClick={this.callEvent}>{this.getImageUrl(report_data[item].entry_type)} {report_data[item].entry_name} [{report_data[item].report_date}]</a></div>
              </div>
            )
          }
        </div>
      </main>
    )
  }
}

class MediaMenu extends React.Component {
  constructor() {
    super();

    // Binding functions in this class
    this.getImageUrl = this.getImageUrl.bind(this);
    this.callEvent = this.callEvent.bind(this);
  }

  // Function that returns what image to show for the media
  getImageUrl(type) {
    if (type == "Video") {
      return (<img id="cardMediaLink" src="https://dashwatchbeta.org/images/Video.png" height="25"></img>)
    } else if (type == "Podcast") {
      return (<img id="cardMediaLink" src="https://dashwatchbeta.org/images/Podcast.png" height="25"></img>)
    } else {
      return (<img id="cardMediaLink" src="https://dashwatchbeta.org/images/Video.png" height="25"></img>)
    }
  }

  // Google Analytics function to track User interaction on page
  callEvent(event) {
    trackEvent('Proposals Page', 'clicked ' + event.currentTarget.id)
  }

  render() {
    const { // Declare grouped elements to pass on to modal      
      report_data,
      mediaArray
    } = this.props
    return (
      <main>
        <div id="cardDropdownMenu" className="cardDropdownMenu">
          {
            Object.values(mediaArray).slice(1).map((item) =>
              <div key={report_data[item].id}>
                <div className="cardDropdownItem" value="Active"><a id="cardMediaLink" className="cardReportLink" href={report_data[item].report_link} target="_blank" title={report_data[item].report_link} onClick={this.callEvent}>{this.getImageUrl(report_data[item].entry_type)} {report_data[item].entry_name} [{report_data[item].report_date}]</a></div>
              </div>
            )
          }
        </div>
      </main>
    )
  }
}

export default ReportSection