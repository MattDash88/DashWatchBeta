import React from 'react';
import { Line } from 'react-chartjs-2';

// Import css
import '../css/style.css';
import '../css/elections.css';

class VoteCharts extends React.Component {
    constructor() {
        super();
    }
    render() {
        const {     // Elements passed down to the component
            electionId,
            vote_data,
            chart_dates,
            data_participation,
        } = this.props

        const data = {  // Data styling for the chart
            labels: chart_dates,    // The dates of the datapoints are the labels on the x-axis
            datasets: [
                {
                    label: 'Percentage of Masternodes that voted',
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: '#012060',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: data_participation    // participation data points
                }
            ]
        };

        const options = {   // Options for the chart
            scales: {
                yAxes: [{
                    display: true,
                    ticks: {
                        beginAtZero: true,
                        steps: 10,
                        max: Math.min(data_participation[data_participation.length - 1] * 5, 100),       // Scale y-axis to dataset, or 100% as maximum
                        callback: function(tick) {                            
                            return Math.floor(tick).toString() + '%';
                        }
                    },
                }]
            },
            tooltips: {
                enabled: true,
                mode: 'single',
                callbacks: {
                  label: function(tooltipItem, data) {
                    var allData = data.datasets[tooltipItem.datasetIndex].data;
                    var tooltipLabel = data.labels[tooltipItem.index];
                    var tooltipData = allData[tooltipItem.index];
                    return tooltipLabel + ": " + tooltipData + "%";
                  }
                }
            },
        }

        // Handle wrong entry of date
        let updatedDate
        if (typeof vote_data[vote_data.length - 1].date !== 'undefined') {
            updatedDate = vote_data[vote_data.length - 1].date
        } else {
            updatedDate = 'N/A'
        }

        return (
            <main>
                <section className="tpPageTopSection" value={electionId == "tpe2019" ? "Active" : "Inactive"}>
                <h1 className="tpHeader">2019 Dash TP Elections voting participation</h1>
                <div className="tpText">The chart was updated once a day during the elections.</div>
                <div className="tpChartStatsDiv">
                    <div className="tpChartStatsTitle">Last updated:</div><div className="tpChartStatsItem" title={updatedDate}>{updatedDate}</div><br></br>
                    <div className="tpChartStatsTitle">Number of eligible MNs:</div><div className="tpChartStatsItem" title={vote_data[vote_data.length - 1].number_of_masternodes}>{vote_data[vote_data.length - 1].number_of_masternodes}</div><br></br>
                    <div className="tpChartStatsTitle">Total valid votes cast:</div><div className="tpChartStatsItem" title={vote_data[vote_data.length - 1].valid_votes}>{vote_data[vote_data.length - 1].valid_votes}</div>
                </div>
                <Line
                    data={data}
                    options={options}
                />
                </section>
                <section className="tpPageTopSection" value={electionId == "dif2019" ? "Active" : "Inactive"}>
                    <h1 className="tpHeader">2019 DIF Supervisor Elections voting participation</h1>
                    <p className="tpText">Participation metrics will be available here once the election has started on May 31, 2019.</p>
                </section>
            </main>
        )
    }
}

export default VoteCharts