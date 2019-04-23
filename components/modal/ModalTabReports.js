import React from 'react';

// Analytics
import {trackEvent} from '../functions/analytics';

// Import css
import '../css/style.css';
import '../css/modal.css';

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

class ModalTabReports extends React.Component {
    render() {
        const { // Declare grouped elements to pass on to ReportDiv   
            report_data,
            openTab,
            id,
        } = this.props

        return (
            <main className="modalTabContent" value={openTab == "TabReports" ? "active" : "inactive"}>
            {
                typeof report_data == 'undefined' ? (
                    <div className="modalNoReportText">Something went wrong with the report data</div>
                ) : ( 
                    report_data == "No reports available" ? ( 
                        <div className="modalNoReportText">No reports available</div>
                ) : (
                    <ModalReportSection
                        report_data={report_data}
                        id={id}
                    />
                    )             
                )
            }
            </main>
        )
    }
}

class ModalReportSection extends React.Component {
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
        } else if (type == "Report") {
            return (<img id="cardDocumentLink" src="https://dashwatchbeta.org/images/PDF.png" height="25"></img>)
        } else {
            return (<img id="cardMediaLink" src="https://dashwatchbeta.org/images/PDF.png" height="25"></img>)
        }
    }

    // Google Analytics function to track User interaction on page
    callEvent(event) {
        trackEvent('Full Modal', 'Clicked ' + event.currentTarget.id)
    }

    render() {
        const {     // Declare single elements used in this Modal tab   
            report_data,
            id,
        } = this.props

        var {
            documentsArray,
            mediaArray,
        } = getReportTypeArrays(report_data)

        return (
            <main>
                <section className="modalReportGrid">
                    {
                        documentsArray.length == 0 ? (
                            <div className="modalReportDiv">
                            <div className="modalNoReportText">No reports available</div>
                            </div>
                        ) : (
                            <div className="modalReportDiv">
                            <div className="modalHeader">Dash Watch Report Links</div>
                            {
                                Object.values(documentsArray).map((item) =>
                                    <div key={report_data[item].id} className="modalReportItem">
                                        <a id="modalDocumentLink" className="modalReportLink" href={report_data[item].report_link} target="_blank" title={report_data[item].report_link} onClick={this.callEvent}>{this.getImageUrl(report_data[item].entry_type)} {report_data[item].entry_name} [{report_data[item].report_date}]</a>
                                    </div>
                                )
                            }
                            </div>
                        )
                    }
                    {
                        mediaArray.length == 0 ? (
                            <div className="modalReportDiv">
                            </div>
                        ) : (
                            <div className="modalReportDiv">
                            <div className="modalHeader">Dash Watch Media Links</div>
                            {
                                Object.values(mediaArray).map((item) =>
                                    <div key={report_data[item].id} className="modalReportItem">
                                        <a id="modalMediaLink" className="modalReportLink" href={report_data[item].report_link} target="_blank" title={report_data[item].report_link} onClick={this.callEvent}>{this.getImageUrl(report_data[item].entry_type)} {report_data[item].entry_name} [{report_data[item].report_date}]</a>
                                    </div>
                                )
                            }
                            </div>
                        )
                    }
                </section>               
            </main>
        )
    }
}

export default ModalTabReports